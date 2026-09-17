/**
 * The scheduled half of the bot: match live deals to subscribers and send.
 *
 * Costs are capped in three places — deals per subscriber, total sends per run,
 * and WhatsApp's refusal to push outside the free window unless a template is
 * configured. A reel going viral raises the subscriber count, never the bill
 * per run.
 */

import { readyChannels } from "./channels";
import { config } from "./config";
import { renderDeal } from "./handlers/deals";
import { listDeals, listSubscribers, matchDeals, saveSubscriber } from "./store";

export interface BroadcastResult {
  deals: number;
  subscribers: number;
  sent: number;
  skipped: number;
  failed: number;
}

export async function runBroadcast(): Promise<BroadcastResult> {
  const deals = await listDeals();
  const result: BroadcastResult = {
    deals: deals.length,
    subscribers: 0,
    sent: 0,
    skipped: 0,
    failed: 0,
  };

  if (deals.length === 0) return result;

  for (const channel of readyChannels()) {
    const subscribers = await listSubscribers(channel.name);
    result.subscribers += subscribers.length;

    for (const subscriber of subscribers) {
      if (result.sent >= config.limits.sendsPerRun) return result;
      if (!subscriber.active || subscriber.step !== "ready") continue;

      const matches = matchDeals(subscriber, deals).slice(
        0,
        config.limits.dealsPerRun,
      );
      if (matches.length === 0) continue;

      const body = matches.map(renderDeal).join("\n\n");

      try {
        const delivered = await channel.push(subscriber, body);
        if (!delivered) {
          // WhatsApp, outside the 24h window, no approved template. Leave the
          // deals unsent so they go out when the user next says hello.
          result.skipped += 1;
          continue;
        }

        subscriber.sentDealIds = [
          ...matches.map((deal) => deal.id),
          ...subscriber.sentDealIds,
        ];
        await saveSubscriber(subscriber);
        result.sent += 1;
      } catch {
        // One dead subscriber (blocked the bot, changed number) must not stop
        // the run.
        result.failed += 1;
      }
    }
  }

  return result;
}

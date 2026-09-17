/**
 * One entry point for every incoming message, whatever the channel.
 *
 * Today everything goes to the deals handler. When the next automation lands
 * (scam checker, biodata, expense splitter), this is where a subscriber gets
 * routed to it — the webhooks and the store stay untouched.
 */

import { getChannel } from "./channels";
import { handleDealsMessage } from "./handlers/deals";
import {
  getSubscriber,
  isRateLimited,
  newSubscriber,
  saveSubscriber,
} from "./store";
import type { IncomingMessage } from "./types";

export async function handleIncoming(message: IncomingMessage): Promise<void> {
  const { channel: channelName, userId, text } = message;

  // A user hammering the bot costs us money on WhatsApp and AI calls later.
  if (await isRateLimited(channelName, userId)) return;

  const channel = getChannel(channelName);
  const subscriber =
    (await getSubscriber(channelName, userId)) ??
    newSubscriber(channelName, userId);

  // Stamping this keeps WhatsApp's free 24-hour reply window accurate.
  subscriber.lastInboundAt = Date.now();

  const reply = await handleDealsMessage(subscriber, text);
  await saveSubscriber(subscriber);
  await channel.send(userId, reply);
}

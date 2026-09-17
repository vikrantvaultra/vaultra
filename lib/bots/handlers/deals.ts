/**
 * The deal alert bot.
 *
 * A subscriber picks categories and a budget; deals you post are matched
 * against that and sent out by the cron broadcast. Every link carries the
 * Associates tag, so the first sales it refers are what unlock Amazon's
 * Product Advertising API for automated price tracking later.
 */

import { formatRupees } from "../affiliate";
import { config } from "../config";
import { renderDeal } from "../render";
import { listDeals, matchDeals, saveSubscriber } from "../store";
import {
  CATEGORIES,
  isCategory,
  type Category,
  type Deal,
  type Subscriber,
} from "../types";
import { handleAdminMessage } from "./admin";

const categoryList = CATEGORIES.map(
  (name, index) => `${index + 1}. ${name}`,
).join("\n");

export const WELCOME = `👋 Welcome! I send you the best Amazon deals — only in the categories you care about.

Which ones? Reply with numbers or names:

${categoryList}

Example: 1, 3  (or "all")`;

const HELP = `Here's what I understand:

• *deals* — show what's live right now
• *categories* — change what you follow
• *budget* — change your price limit
• *stop* — unsubscribe (come back any time with "start")`;

function parseCategories(text: string): Category[] | null {
  const cleaned = text.toLowerCase().trim();
  if (cleaned === "all" || cleaned === "sab" || cleaned === "everything") {
    return [...CATEGORIES];
  }

  const picked = new Set<Category>();
  for (const token of cleaned.split(/[\s,/]+/).filter(Boolean)) {
    const index = Number(token);
    if (Number.isInteger(index) && index >= 1 && index <= CATEGORIES.length) {
      picked.add(CATEGORIES[index - 1]);
    } else if (isCategory(token)) {
      picked.add(token);
    }
  }

  return picked.size > 0 ? [...picked] : null;
}

/** Accepts "20000", "20k", "₹20,000", "under 20000", "any". */
function parseBudget(text: string): number | null | "invalid" {
  const cleaned = text.toLowerCase().replace(/[₹,\s]/g, "");
  if (["any", "no", "none", "skip", "koi"].some((w) => cleaned.includes(w))) {
    return null;
  }

  const match = cleaned.match(/(\d+(?:\.\d+)?)(k|l)?/);
  if (!match) return "invalid";

  let amount = Number(match[1]);
  if (match[2] === "k") amount *= 1_000;
  if (match[2] === "l") amount *= 100_000;

  return amount > 0 ? Math.round(amount) : "invalid";
}

/**
 * What to say when a subscriber's filters match nothing. An empty answer is the
 * fastest way to lose someone who just signed up, so show live deals from
 * outside their filters rather than leaving them with silence.
 */
function nothingMatched(subscriber: Subscriber, deals: Deal[]): string {
  const opening = `Nothing in ${summary(subscriber)} right now.`;

  const others = deals
    .filter((deal) => !subscriber.sentDealIds.includes(deal.id))
    .slice(0, 2);

  if (others.length === 0) {
    return `${opening} I'll ping you the moment something lands. 🔎`;
  }

  return `${opening} Here's what else is live today 👇\n\n${others
    .map(renderDeal)
    .join("\n\n")}\n\nThese are outside your filters — send *categories* or *budget* to widen them.`;
}

function summary(subscriber: Subscriber): string {
  const budget =
    subscriber.maxPrice === null
      ? "any price"
      : `under ${formatRupees(subscriber.maxPrice)}`;
  return `${subscriber.categories.join(", ")} · ${budget}`;
}

/**
 * Handles one incoming message and returns what to reply with. The caller owns
 * sending, so this stays free of channel details.
 */
export async function handleDealsMessage(
  subscriber: Subscriber,
  text: string,
): Promise<string> {
  // Posting deals, and the mid-draft answers that follow, belong to admins.
  const adminReply = await handleAdminMessage(subscriber, text);
  if (adminReply) return adminReply;

  // Telegram clients send "/start", and its menu offers "/help", "/deals" and
  // the rest as slash commands — same words, so drop the slash.
  const command = text
    .toLowerCase()
    .trim()
    .replace(/^\/(?=(start|help|deals|stop|budget|categories)\b)/, "");

  if (["stop", "unsubscribe", "band karo"].includes(command)) {
    subscriber.active = false;
    await saveSubscriber(subscriber);
    return "Done, no more deals. Send *start* whenever you want them back. 👋";
  }

  if (["help", "menu", "?"].includes(command)) return HELP;

  if (["start", "sale", "deals", "hi", "hello", "hey"].includes(command)) {
    if (!subscriber.active) {
      subscriber.active = true;
      subscriber.step = "ready";
    }

    if (subscriber.step === "ready" && command === "deals") {
      const all = await listDeals();
      const live = matchDeals(subscriber, all).slice(0, 5);
      if (live.length === 0) return nothingMatched(subscriber, all);
      // Showing these now marks them sent, so the broadcast won't repeat them.
      subscriber.sentDealIds = [
        ...live.map((deal) => deal.id),
        ...subscriber.sentDealIds,
      ];
      await saveSubscriber(subscriber);
      return live.map(renderDeal).join("\n\n");
    }

    if (subscriber.step === "ready") {
      await saveSubscriber(subscriber);
      return `You're set: ${summary(subscriber)}\n\nSend *deals* to see what's live, or *help* for the rest.`;
    }

    subscriber.step = "awaiting_categories";
    await saveSubscriber(subscriber);
    return WELCOME;
  }

  if (command === "categories") {
    subscriber.step = "awaiting_categories";
    await saveSubscriber(subscriber);
    return WELCOME;
  }

  if (command === "budget") {
    subscriber.step = "awaiting_budget";
    await saveSubscriber(subscriber);
    return "What's your limit? Reply with a number like 20000, or *any*.";
  }

  if (subscriber.step === "awaiting_categories") {
    const categories = parseCategories(text);
    if (!categories) {
      return `Didn't catch that. Reply with numbers from the list:\n\n${categoryList}`;
    }

    subscriber.categories = categories;
    subscriber.step = "awaiting_budget";
    await saveSubscriber(subscriber);
    return `Got it: ${categories.join(", ")} ✅\n\nAnd your budget? Reply with a number like 20000, or *any*.`;
  }

  if (subscriber.step === "awaiting_budget") {
    const budget = parseBudget(text);
    if (budget === "invalid") {
      return "Reply with a number like 20000, or *any* for no limit.";
    }

    subscriber.maxPrice = budget;
    subscriber.step = "ready";
    await saveSubscriber(subscriber);

    const all = await listDeals();
    const live = matchDeals(subscriber, all).slice(0, config.limits.dealsPerRun);

    if (live.length === 0) {
      return `All set — ${summary(subscriber)} 🎉\n\n${nothingMatched(subscriber, all)}`;
    }

    subscriber.sentDealIds = [
      ...live.map((deal) => deal.id),
      ...subscriber.sentDealIds,
    ];
    await saveSubscriber(subscriber);

    return `All set — ${summary(subscriber)} 🎉\n\nHere's what's live now:\n\n${live
      .map(renderDeal)
      .join("\n\n")}`;
  }

  return HELP;
}

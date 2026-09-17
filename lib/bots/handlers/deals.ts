/**
 * The deal alert bot.
 *
 * A subscriber picks categories and a budget; deals you post are matched
 * against that and sent out by the cron broadcast. Every link carries the
 * Associates tag, so the first sales it refers are what unlock Amazon's
 * Product Advertising API for automated price tracking later.
 */

import { findUrl, formatRupees, withAffiliateTag, expandShortLink } from "../affiliate";
import { config, isAdmin } from "../config";
import { addDeal, listDeals, matchDeals, saveSubscriber } from "../store";
import {
  CATEGORIES,
  isCategory,
  type Category,
  type Deal,
  type Subscriber,
} from "../types";

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

/** One deal, formatted for a chat message. */
export function renderDeal(deal: Deal): string {
  const off =
    deal.mrp && deal.mrp > deal.price
      ? ` (${Math.round(((deal.mrp - deal.price) / deal.mrp) * 100)}% off)`
      : "";

  return `🔥 ${deal.title}\n${formatRupees(deal.price)}${off}\n${withAffiliateTag(deal.url)}`;
}

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

function summary(subscriber: Subscriber): string {
  const budget =
    subscriber.maxPrice === null
      ? "any price"
      : `under ${formatRupees(subscriber.maxPrice)}`;
  return `${subscriber.categories.join(", ")} · ${budget}`;
}

/**
 * Admin-only: `/deal <url> | <title> | <price> | <category> [| <mrp>]`
 * Returns the reply text, or null when this is not a deal command.
 */
async function handleAdminDeal(
  text: string,
  userId: string,
): Promise<string | null> {
  if (!text.toLowerCase().startsWith("/deal")) return null;
  if (!isAdmin(userId)) return "That command is for admins only.";

  const parts = text
    .slice("/deal".length)
    .split("|")
    .map((part) => part.trim());

  if (parts.length < 4) {
    return "Format: /deal <url> | <title> | <price> | <category> [| <mrp>]";
  }

  const [rawUrl, title, rawPrice, rawCategory, rawMrp] = parts;
  const url = findUrl(rawUrl);
  if (!url) return "That first part doesn't look like a link.";

  const price = Number(rawPrice.replace(/[₹,\s]/g, ""));
  if (!Number.isFinite(price) || price <= 0) return "Price must be a number.";

  const category = rawCategory.toLowerCase();
  if (!isCategory(category)) {
    return `Category must be one of: ${CATEGORIES.join(", ")}`;
  }

  const mrp = rawMrp ? Number(rawMrp.replace(/[₹,\s]/g, "")) : NaN;

  const deal: Deal = {
    id: `${Date.now().toString(36)}`,
    title,
    url: await expandShortLink(url),
    price,
    mrp: Number.isFinite(mrp) && mrp > price ? mrp : null,
    category,
    createdAt: Date.now(),
  };

  await addDeal(deal);
  return `✅ Saved. It goes out on the next broadcast.\n\n${renderDeal(deal)}`;
}

/**
 * Handles one incoming message and returns what to reply with. The caller owns
 * sending, so this stays free of channel details.
 */
export async function handleDealsMessage(
  subscriber: Subscriber,
  text: string,
): Promise<string> {
  const adminReply = await handleAdminDeal(text, subscriber.id);
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
      const live = matchDeals(subscriber, await listDeals()).slice(0, 5);
      if (live.length === 0) {
        return `Nothing matching ${summary(subscriber)} right now. I'll message you the moment something lands. 🔎`;
      }
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

    const live = matchDeals(subscriber, await listDeals()).slice(
      0,
      config.limits.dealsPerRun,
    );

    if (live.length === 0) {
      return `All set — ${summary(subscriber)} 🎉\n\nNothing matching right now, but I'll ping you the moment it lands.`;
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

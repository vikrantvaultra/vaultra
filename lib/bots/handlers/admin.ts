/**
 * Posting a deal, as a conversation.
 *
 * The pipe format (`/deal url | title | price | category`) is still accepted
 * because it is one message when you know it, but nobody types it from a phone
 * at midnight. Sending a bare link starts a four-question flow instead, which
 * is what actually gets deals into the bot.
 */

import { expandShortLink, findUrl, formatRupees } from "../affiliate";
import { runBroadcast } from "../broadcast";
import { isAdmin } from "../config";
import { renderDeal } from "../render";
import { addDeal, saveSubscriber } from "../store";
import {
  CATEGORIES,
  isCategory,
  type Deal,
  type DealDraft,
  type Subscriber,
} from "../types";

const categoryList = CATEGORIES.map(
  (name, index) => `${index + 1}. ${name}`,
).join("\n");

/** "12999" or "12999 17999" (price then MRP). */
function parseAmounts(text: string): { price: number; mrp: number | null } | null {
  const numbers = text
    .replace(/[₹,]/g, " ")
    .split(/\s+/)
    .map((token) => Number(token))
    .filter((value) => Number.isFinite(value) && value > 0);

  if (numbers.length === 0) return null;
  const [price, mrp] = numbers;
  return { price: Math.round(price), mrp: mrp && mrp > price ? Math.round(mrp) : null };
}

function draftToDeal(draft: DealDraft): Deal {
  return {
    id: Date.now().toString(36),
    title: draft.title as string,
    url: draft.url,
    price: draft.price as number,
    mrp: draft.mrp ?? null,
    category: draft.category as Deal["category"],
    createdAt: Date.now(),
  };
}

async function save(subscriber: Subscriber, draft: DealDraft): Promise<Deal> {
  const deal = draftToDeal(draft);
  await addDeal(deal);
  subscriber.admin = undefined;
  await saveSubscriber(subscriber);
  return deal;
}

/** The one-message form, for when you know it. Null when it isn't one. */
async function pipeFormat(
  subscriber: Subscriber,
  text: string,
): Promise<string | null> {
  const parts = text
    .replace(/^\/deal\s*/i, "")
    .split("|")
    .map((part) => part.trim());

  if (parts.length < 4) return null;

  const [rawUrl, title, rawPrice, rawCategory, rawMrp] = parts;
  const url = findUrl(rawUrl);
  if (!url) return "That first part doesn't look like a link.";

  const amounts = parseAmounts(rawMrp ? `${rawPrice} ${rawMrp}` : rawPrice);
  if (!amounts) return "Price must be a number.";

  const category = rawCategory.toLowerCase();
  if (!isCategory(category)) {
    return `Category must be one of: ${CATEGORIES.join(", ")}`;
  }

  const deal = await save(subscriber, {
    url: await expandShortLink(url),
    title,
    price: amounts.price,
    mrp: amounts.mrp,
    category,
  });

  return `✅ Saved.\n\n${renderDeal(deal)}\n\nSend *broadcast* to push it now, or it goes out on the next run.`;
}

/**
 * Handles anything an admin sends that is about posting a deal. Returns null
 * when the message is ordinary subscriber traffic.
 */
export async function handleAdminMessage(
  subscriber: Subscriber,
  text: string,
): Promise<string | null> {
  if (!isAdmin(subscriber.id)) {
    // Only the "/deal" attempt is worth a refusal; everything else falls
    // through to the normal conversation.
    return text.toLowerCase().startsWith("/deal")
      ? "That command is for admins only."
      : null;
  }

  const trimmed = text.trim();
  const command = trimmed.toLowerCase().replace(/^\//, "");
  const pending = subscriber.admin;

  if (pending && ["cancel", "stop"].includes(command)) {
    subscriber.admin = undefined;
    await saveSubscriber(subscriber);
    return "Dropped that draft. 👍";
  }

  /* ---- mid-draft answers ---- */

  if (pending) {
    const { draft } = pending;

    if (pending.step === "title") {
      draft.title = trimmed;
      pending.step = "price";
      await saveSubscriber(subscriber);
      return `Title: *${draft.title}*\n\nPrice? Send \`12999\`, or \`12999 17999\` to include the MRP.`;
    }

    if (pending.step === "price") {
      const amounts = parseAmounts(trimmed);
      if (!amounts) return "Send a number like `12999`, or `12999 17999`.";

      draft.price = amounts.price;
      draft.mrp = amounts.mrp;
      pending.step = "category";
      await saveSubscriber(subscriber);
      return `${formatRupees(amounts.price)}${amounts.mrp ? ` (MRP ${formatRupees(amounts.mrp)})` : ""}\n\nCategory?\n\n${categoryList}`;
    }

    if (pending.step === "category") {
      const token = trimmed.toLowerCase();
      const index = Number(token);
      const category = Number.isInteger(index)
        ? CATEGORIES[index - 1]
        : isCategory(token)
          ? token
          : undefined;

      if (!category) return `Pick one:\n\n${categoryList}`;

      draft.category = category;
      pending.step = "confirm";
      await saveSubscriber(subscriber);
      return `${renderDeal(draftToDeal(draft))}\n\nSend it to everyone now? *yes* / *save* (send later) / *cancel*`;
    }

    if (pending.step === "confirm") {
      if (["yes", "y", "send", "broadcast", "haan"].includes(command)) {
        const deal = await save(subscriber, draft);
        const result = await runBroadcast();
        return `📤 Sent to ${result.sent} subscriber${result.sent === 1 ? "" : "s"}.\n\n${renderDeal(deal)}`;
      }

      if (["save", "later", "no", "n"].includes(command)) {
        const deal = await save(subscriber, draft);
        return `✅ Saved for the next run.\n\n${renderDeal(deal)}`;
      }

      return "Send *yes* to push it now, *save* for later, or *cancel*.";
    }
  }

  /* ---- starting points ---- */

  if (command === "broadcast") {
    const result = await runBroadcast();
    return `📤 Broadcast done — ${result.sent} sent, ${result.skipped} skipped, ${result.failed} failed, across ${result.subscribers} subscribers.`;
  }

  const url = findUrl(trimmed);
  const looksLikeADeal = trimmed.toLowerCase().startsWith("/deal") || url;
  if (!looksLikeADeal) return null;

  if (!url) return "Send the product link, like:\n/deal https://amzn.in/d/xxxx";

  const viaPipes = await pipeFormat(subscriber, trimmed);
  if (viaPipes) return viaPipes;

  subscriber.admin = {
    step: "title",
    draft: { url: await expandShortLink(url) },
  };
  await saveSubscriber(subscriber);

  return "Got the link. What's the title? (short — it's what people read)\n\nSend *cancel* any time.";
}

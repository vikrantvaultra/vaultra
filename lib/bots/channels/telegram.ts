/**
 * Telegram. Free, no approval, no message templates — which is why it is the
 * channel to launch on while WhatsApp business verification is pending.
 */

import { config } from "../config";
import type { Channel, Subscriber } from "../types";

async function call(method: string, payload: unknown): Promise<void> {
  const response = await fetch(
    `https://api.telegram.org/bot${config.telegram.token}/${method}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Telegram ${method} failed: ${response.status}`);
  }
}

export const telegram: Channel = {
  name: "telegram",

  isReady() {
    return Boolean(config.telegram.token);
  },

  async send(userId, text) {
    await call("sendMessage", {
      chat_id: userId,
      text,
      parse_mode: "HTML",
      link_preview_options: { is_disabled: false },
    });
  },

  async push(subscriber, text) {
    // Telegram has no 24-hour window and no per-message cost, so a push is
    // just a message.
    await telegram.send(subscriber.id, text);
    return true;
  },
};

/** Pulls `{ userId, text }` out of a Telegram update, if it carries one. */
export function parseTelegramUpdate(
  update: unknown,
): { userId: string; text: string } | null {
  const message = (update as { message?: unknown })?.message as
    | { chat?: { id?: number | string }; text?: string }
    | undefined;

  const chatId = message?.chat?.id;
  const text = message?.text;
  if (chatId === undefined || typeof text !== "string") return null;

  return { userId: String(chatId), text };
}

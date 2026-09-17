/**
 * WhatsApp Cloud API.
 *
 * The rule that shapes this file: replies sent within 24 hours of the user's
 * last message are free-form and free. Anything later needs a template Meta has
 * approved, and costs per message. So `push` sends a template when one is
 * configured, falls back to a free-form message when the window is still open,
 * and otherwise refuses rather than quietly failing or spending money.
 */

import crypto from "node:crypto";

import { config } from "../config";
import type { Channel, Subscriber } from "../types";

const WINDOW_MS = 24 * 60 * 60 * 1000;

async function call(payload: unknown): Promise<void> {
  const { token, phoneNumberId, graphVersion } = config.whatsapp;
  const response = await fetch(
    `https://graph.facebook.com/${graphVersion}/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`WhatsApp send failed: ${response.status} ${detail}`);
  }
}

export const whatsapp: Channel = {
  name: "whatsapp",

  isReady() {
    return Boolean(config.whatsapp.token && config.whatsapp.phoneNumberId);
  },

  async send(userId, text) {
    await call({
      messaging_product: "whatsapp",
      to: userId,
      type: "text",
      text: { body: text, preview_url: true },
    });
  },

  async push(subscriber, text) {
    const withinWindow = Date.now() - subscriber.lastInboundAt < WINDOW_MS;

    if (withinWindow) {
      await whatsapp.send(subscriber.id, text);
      return true;
    }

    if (!config.whatsapp.template) return false;

    // A utility template with one body variable, e.g. body "🔥 {{1}}".
    await call({
      messaging_product: "whatsapp",
      to: subscriber.id,
      type: "template",
      template: {
        name: config.whatsapp.template,
        language: { code: config.whatsapp.templateLang },
        components: [
          {
            type: "body",
            parameters: [{ type: "text", text }],
          },
        ],
      },
    });
    return true;
  },
};

/**
 * Meta signs every delivery. Without this check anyone who finds the URL can
 * post fake messages to the bot.
 */
export function verifyWhatsappSignature(
  rawBody: string,
  header: string | null,
): boolean {
  const { appSecret } = config.whatsapp;
  if (!appSecret) return false;
  if (!header?.startsWith("sha256=")) return false;

  const expected = crypto
    .createHmac("sha256", appSecret)
    .update(rawBody, "utf8")
    .digest("hex");
  const received = header.slice("sha256=".length);

  const expectedBuffer = Buffer.from(expected, "utf8");
  const receivedBuffer = Buffer.from(received, "utf8");
  if (expectedBuffer.length !== receivedBuffer.length) return false;

  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

/** Pulls the first text message out of a webhook payload, if there is one. */
export function parseWhatsappPayload(
  payload: unknown,
): { userId: string; text: string } | null {
  const value = (
    payload as {
      entry?: { changes?: { value?: unknown }[] }[];
    }
  )?.entry?.[0]?.changes?.[0]?.value as
    | { messages?: { from?: string; type?: string; text?: { body?: string } }[] }
    | undefined;

  const message = value?.messages?.[0];
  if (!message?.from || message.type !== "text" || !message.text?.body) {
    // Delivery receipts and status updates arrive here too; ignore them.
    return null;
  }

  return { userId: message.from, text: message.text.body };
}

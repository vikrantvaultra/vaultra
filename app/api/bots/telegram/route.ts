/**
 * Telegram webhook.
 *
 * Register it once with:
 *   curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<host>/api/bots/telegram&secret_token=<BOT_TELEGRAM_SECRET>"
 */

import { config } from "@/lib/bots/config";
import { parseTelegramUpdate } from "@/lib/bots/channels/telegram";
import { handleIncoming } from "@/lib/bots/router";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(request: Request): Promise<Response> {
  if (!config.telegram.token) {
    return new Response("not configured", { status: 503 });
  }

  if (
    config.telegram.secret &&
    request.headers.get("x-telegram-bot-api-secret-token") !==
      config.telegram.secret
  ) {
    return new Response("unauthorized", { status: 401 });
  }

  try {
    const message = parseTelegramUpdate(await request.json());
    if (message) {
      await handleIncoming({
        channel: "telegram",
        userId: message.userId,
        text: message.text,
      });
    }
  } catch (error) {
    // Always answer 200: Telegram retries failures, and a retry storm on a
    // broken handler is worse than a dropped message.
    console.error("[bots/telegram]", error);
  }

  return new Response("ok");
}

/**
 * WhatsApp Cloud API webhook.
 *
 * GET  — Meta's one-time subscribe handshake.
 * POST — incoming messages, signed with the app secret.
 *
 * Set the callback URL to https://<host>/api/bots/whatsapp in the Meta app
 * dashboard, with BOT_WHATSAPP_VERIFY_TOKEN as the verify token.
 */

import { config } from "@/lib/bots/config";
import {
  parseWhatsappPayload,
  verifyWhatsappSignature,
} from "@/lib/bots/channels/whatsapp";
import { handleIncoming } from "@/lib/bots/router";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(request: Request): Promise<Response> {
  const params = new URL(request.url).searchParams;

  if (
    params.get("hub.mode") === "subscribe" &&
    config.whatsapp.verifyToken &&
    params.get("hub.verify_token") === config.whatsapp.verifyToken
  ) {
    return new Response(params.get("hub.challenge") ?? "", { status: 200 });
  }

  return new Response("forbidden", { status: 403 });
}

export async function POST(request: Request): Promise<Response> {
  if (!config.whatsapp.token || !config.whatsapp.phoneNumberId) {
    return new Response("not configured", { status: 503 });
  }

  // The signature is over the exact bytes Meta sent, so read text, not json.
  const rawBody = await request.text();

  if (
    !verifyWhatsappSignature(rawBody, request.headers.get("x-hub-signature-256"))
  ) {
    return new Response("unauthorized", { status: 401 });
  }

  try {
    const message = parseWhatsappPayload(JSON.parse(rawBody));
    if (message) {
      await handleIncoming({
        channel: "whatsapp",
        userId: message.userId,
        text: message.text,
      });
    }
  } catch (error) {
    // Meta retries non-200 responses aggressively; swallow and log instead.
    console.error("[bots/whatsapp]", error);
  }

  return new Response("ok");
}

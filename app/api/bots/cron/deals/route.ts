/**
 * The deal broadcast, triggered from outside.
 *
 * Vercel's Hobby plan only runs cron jobs once a day, so point a free scheduler
 * (cron-job.org, GitHub Actions) at this instead, every few hours:
 *   https://<host>/api/bots/cron/deals?secret=<BOT_CRON_SECRET>
 *
 * The secret is the only thing standing between this URL and anyone who guesses
 * it, so the route refuses to run without one configured.
 */

import { runBroadcast } from "@/lib/bots/broadcast";
import { config } from "@/lib/bots/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

function authorized(request: Request): boolean {
  if (!config.cronSecret) return false;

  const fromQuery = new URL(request.url).searchParams.get("secret");
  const fromHeader = request.headers
    .get("authorization")
    ?.replace(/^Bearer\s+/i, "");

  return fromQuery === config.cronSecret || fromHeader === config.cronSecret;
}

export async function GET(request: Request): Promise<Response> {
  if (!authorized(request)) {
    return new Response("unauthorized", { status: 401 });
  }

  try {
    const result = await runBroadcast();
    return Response.json({ ok: true, ...result });
  } catch (error) {
    console.error("[bots/cron/deals]", error);
    return Response.json({ ok: false }, { status: 500 });
  }
}

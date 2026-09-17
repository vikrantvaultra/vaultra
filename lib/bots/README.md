# The bots

A deal alert bot that lives beside the marketing site without touching it.
People find it through a reel ("comment SALE"), tell it what they shop for, and
get Amazon deals on Telegram or WhatsApp. Every link carries Associates tag
`750655-21`, so the sales it refers are what unlock Amazon's Product
Advertising API — after which this can track any product's price automatically.

## The rule that keeps the site safe

Nothing in `lib/bots/` or `app/api/bots/` is imported by a site page, and site
code never imports bot code. They share a repo and nothing else. The marketing
pages are prerendered at build time, so a bot failing at runtime cannot affect
them.

## Files

| File | Does |
| --- | --- |
| `types.ts` | Shared shapes, the category list, the `Channel` interface |
| `config.ts` | Every `BOT_`-prefixed env var, read without throwing |
| `store.ts` | Subscribers, deals, rate limits — Upstash REST, temp file in dev |
| `affiliate.ts` | Adds the Associates tag, expands `amzn.in` links |
| `channels/telegram.ts` | Free channel, no windows, no templates |
| `channels/whatsapp.ts` | Cloud API, signature check, 24h-window logic |
| `handlers/deals.ts` | The conversation: categories → budget → deals |
| `router.ts` | One entry point for every message; where the next bot plugs in |
| `broadcast.ts` | The scheduled send, with the cost caps |

Routes: `app/api/bots/telegram`, `app/api/bots/whatsapp`, `app/api/bots/cron/deals`.

## Setup

1. **Telegram** — message `@BotFather`, `/newbot`, copy the token into
   `BOT_TELEGRAM_TOKEN`. Put any random string in `BOT_TELEGRAM_SECRET`, then
   register the webhook:

   ```bash
   curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<host>/api/bots/telegram&secret_token=<SECRET>"
   ```

2. **Storage** — add Upstash from the Vercel Marketplace and copy its REST URL
   and token into `BOT_UPSTASH_URL` / `BOT_UPSTASH_TOKEN`. Skip this locally.

3. **Admin** — message the bot, find your chat id in the logs, and put it in
   `BOT_ADMIN_IDS`. That is who may post deals.

4. **Scheduler** — generate `BOT_CRON_SECRET`, then have cron-job.org hit
   `https://<host>/api/bots/cron/deals?secret=…` every three hours.

5. **WhatsApp** (later) — create a Meta app, add WhatsApp, set the callback to
   `https://<host>/api/bots/whatsapp` with your verify token, and fill the four
   `BOT_WHATSAPP_*` vars. Leave `BOT_WHATSAPP_TEMPLATE` empty until a template
   is approved; until then the bot only sends inside the free 24-hour window.

## Posting a deal

As an admin, message the bot:

```
/deal https://amzn.in/d/xxxx | Redmi Note 14 5G | 12999 | mobiles | 17999
```

It is saved and goes out on the next broadcast to everyone who follows that
category and whose budget covers it.

## What it costs

Telegram is free. WhatsApp is free within 24 hours of a user's last message,
and roughly ₹0.12 per message after that. Upstash and cron-job.org are free at
this size. The caps in `config.limits` bound a viral day.

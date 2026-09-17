/**
 * Every bot setting comes from a `BOT_`-prefixed env var, so bot secrets are
 * never confused with the site's own config. Nothing here throws at import
 * time — an unconfigured channel simply reports itself as not ready.
 */

function env(name: string): string | null {
  const value = process.env[name];
  return value && value.trim() ? value.trim() : null;
}

export const config = {
  /** Amazon Associates tag. Every outgoing amazon.in link carries it. */
  amazonTag: env("BOT_AMAZON_TAG") ?? "750655-21",

  telegram: {
    token: env("BOT_TELEGRAM_TOKEN"),
    /** Echoed by Telegram in X-Telegram-Bot-Api-Secret-Token. */
    secret: env("BOT_TELEGRAM_SECRET"),
  },

  whatsapp: {
    token: env("BOT_WHATSAPP_TOKEN"),
    phoneNumberId: env("BOT_WHATSAPP_PHONE_ID"),
    /** Our half of Meta's webhook handshake. */
    verifyToken: env("BOT_WHATSAPP_VERIFY_TOKEN"),
    /** Used to check X-Hub-Signature-256 on every delivery. */
    appSecret: env("BOT_WHATSAPP_APP_SECRET"),
    /** Approved template name for alerts sent outside the 24h window. */
    template: env("BOT_WHATSAPP_TEMPLATE"),
    templateLang: env("BOT_WHATSAPP_TEMPLATE_LANG") ?? "en",
    graphVersion: env("BOT_WHATSAPP_GRAPH_VERSION") ?? "v21.0",
  },

  upstash: {
    // Vercel's Upstash integration injects KV_REST_API_* itself, so accept
    // those as-is and let BOT_UPSTASH_* override when both are present.
    url: env("BOT_UPSTASH_URL") ?? env("KV_REST_API_URL"),
    token: env("BOT_UPSTASH_TOKEN") ?? env("KV_REST_API_TOKEN"),
  },

  /** Guards the cron route, which is otherwise a public URL. */
  cronSecret: env("BOT_CRON_SECRET"),

  /** Channel-native ids allowed to post deals. Comma separated. */
  adminIds: (env("BOT_ADMIN_IDS") ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean),

  limits: {
    /** Messages one user may send us per minute before we go quiet. */
    messagesPerMinute: 12,
    /** Deals sent to one subscriber per broadcast. */
    dealsPerRun: 2,
    /** Total sends per broadcast — a ceiling on cost if a reel goes viral. */
    sendsPerRun: 400,
    /** How many deal ids we remember per subscriber to avoid repeats. */
    sentHistory: 40,
    /** Deals kept in the store, newest first. */
    dealHistory: 50,
  },
} as const;

export function isAdmin(userId: string): boolean {
  return config.adminIds.includes(userId);
}

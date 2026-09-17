/**
 * Shared shapes for the bots. Nothing here is imported by the marketing site —
 * `lib/bots/` and `app/api/bots/` are a self-contained half of the repo.
 */

export type ChannelName = "telegram" | "whatsapp";

/** The categories a subscriber can pick from. Order is the order they are shown. */
export const CATEGORIES = [
  "mobiles",
  "laptops",
  "electronics",
  "fashion",
  "home",
  "beauty",
] as const;

export type Category = (typeof CATEGORIES)[number];

export function isCategory(value: string): value is Category {
  return (CATEGORIES as readonly string[]).includes(value);
}

/** Where a subscriber is in the sign-up conversation. */
export type Step = "awaiting_categories" | "awaiting_budget" | "ready";

export interface Subscriber {
  /** Channel-native id: a Telegram chat id, or a WhatsApp phone number. */
  id: string;
  channel: ChannelName;
  categories: Category[];
  /** Rupees. `null` means "any price". */
  maxPrice: number | null;
  step: Step;
  createdAt: number;
  /**
   * When they last messaged us. WhatsApp only lets us reply freely for 24h
   * after this, so the broadcast uses it to decide what is free to send.
   */
  lastInboundAt: number;
  /** Ids of deals already sent, newest first, capped so the record stays small. */
  sentDealIds: string[];
  active: boolean;
}

export interface Deal {
  id: string;
  title: string;
  /** The raw product URL. The affiliate tag is added when we send it. */
  url: string;
  price: number;
  mrp: number | null;
  category: Category;
  createdAt: number;
}

export interface IncomingMessage {
  channel: ChannelName;
  userId: string;
  text: string;
}

/**
 * A messaging platform. Adding a channel means implementing this and listing it
 * in `channels/index.ts` — no handler code changes.
 */
export interface Channel {
  name: ChannelName;
  /** Configured via env? Unconfigured channels are skipped everywhere. */
  isReady(): boolean;
  /** A reply to something the user just sent. Always free. */
  send(userId: string, text: string): Promise<void>;
  /**
   * An unprompted message, such as a deal alert. On WhatsApp this is either a
   * paid template or nothing, so it can refuse.
   */
  push(subscriber: Subscriber, text: string): Promise<boolean>;
}

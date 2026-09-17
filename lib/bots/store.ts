/**
 * Storage for subscribers and deals.
 *
 * Upstash Redis over its REST API when configured — no SDK, just fetch. When it
 * is not configured we fall back to a JSON file in the system temp directory so
 * `npm run dev` works with no setup. That fallback is per-machine and vanishes
 * on deploy, which is fine for local work and wrong for production.
 */

import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";

import { config } from "./config";
import type { Category, ChannelName, Deal, Subscriber } from "./types";

type Kv = {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  incr(key: string, ttlSeconds: number): Promise<number>;
  sadd(key: string, member: string): Promise<void>;
  srem(key: string, member: string): Promise<void>;
  smembers(key: string): Promise<string[]>;
};

/* ---------------------------------------------------------------- Upstash - */

async function upstash<T>(command: (string | number)[]): Promise<T> {
  const { url, token } = config.upstash;
  const response = await fetch(url as string, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Upstash ${command[0]} failed: ${response.status}`);
  }

  const body = (await response.json()) as { result: T };
  return body.result;
}

const upstashKv: Kv = {
  async get(key) {
    return upstash<string | null>(["GET", key]);
  },
  async set(key, value) {
    await upstash(["SET", key, value]);
  },
  async incr(key, ttlSeconds) {
    const count = await upstash<number>(["INCR", key]);
    if (count === 1) await upstash(["EXPIRE", key, ttlSeconds]);
    return count;
  },
  async sadd(key, member) {
    await upstash(["SADD", key, member]);
  },
  async srem(key, member) {
    await upstash(["SREM", key, member]);
  },
  async smembers(key) {
    return (await upstash<string[] | null>(["SMEMBERS", key])) ?? [];
  },
};

/* ------------------------------------------------------------ Dev fallback - */

type FileShape = {
  values: Record<string, { value: string; expiresAt?: number }>;
  sets: Record<string, string[]>;
};

const filePath = path.join(os.tmpdir(), "vaultra-bots.json");

async function readFile(): Promise<FileShape> {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8")) as FileShape;
  } catch {
    return { values: {}, sets: {} };
  }
}

async function writeFile(data: FileShape): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(data), "utf8");
}

const fileKv: Kv = {
  async get(key) {
    const data = await readFile();
    const entry = data.values[key];
    if (!entry) return null;
    if (entry.expiresAt && entry.expiresAt < Date.now()) return null;
    return entry.value;
  },
  async set(key, value) {
    const data = await readFile();
    data.values[key] = { value };
    await writeFile(data);
  },
  async incr(key, ttlSeconds) {
    const data = await readFile();
    const entry = data.values[key];
    const expired = entry?.expiresAt ? entry.expiresAt < Date.now() : false;
    const count = entry && !expired ? Number(entry.value) + 1 : 1;
    data.values[key] = {
      value: String(count),
      expiresAt: count === 1 ? Date.now() + ttlSeconds * 1000 : entry?.expiresAt,
    };
    await writeFile(data);
    return count;
  },
  async sadd(key, member) {
    const data = await readFile();
    const set = new Set(data.sets[key] ?? []);
    set.add(member);
    data.sets[key] = [...set];
    await writeFile(data);
  },
  async srem(key, member) {
    const data = await readFile();
    data.sets[key] = (data.sets[key] ?? []).filter((item) => item !== member);
    await writeFile(data);
  },
  async smembers(key) {
    const data = await readFile();
    return data.sets[key] ?? [];
  },
};

const kv: Kv = config.upstash.url && config.upstash.token ? upstashKv : fileKv;

export const usingPersistentStore = Boolean(
  config.upstash.url && config.upstash.token,
);

/* ---------------------------------------------------------------- Subscribers - */

const subscriberKey = (channel: ChannelName, id: string) =>
  `sub:${channel}:${id}`;
const subscriberSet = (channel: ChannelName) => `subs:${channel}`;

export async function getSubscriber(
  channel: ChannelName,
  id: string,
): Promise<Subscriber | null> {
  const raw = await kv.get(subscriberKey(channel, id));
  return raw ? (JSON.parse(raw) as Subscriber) : null;
}

export async function saveSubscriber(subscriber: Subscriber): Promise<void> {
  const trimmed: Subscriber = {
    ...subscriber,
    sentDealIds: subscriber.sentDealIds.slice(0, config.limits.sentHistory),
  };
  await kv.set(
    subscriberKey(trimmed.channel, trimmed.id),
    JSON.stringify(trimmed),
  );
  await kv.sadd(subscriberSet(trimmed.channel), trimmed.id);
}

export async function listSubscribers(
  channel: ChannelName,
): Promise<Subscriber[]> {
  const ids = await kv.smembers(subscriberSet(channel));
  const loaded = await Promise.all(ids.map((id) => getSubscriber(channel, id)));
  return loaded.filter((item): item is Subscriber => item !== null);
}

export async function forgetSubscriber(
  channel: ChannelName,
  id: string,
): Promise<void> {
  await kv.srem(subscriberSet(channel), id);
}

export function newSubscriber(
  channel: ChannelName,
  id: string,
): Subscriber {
  const now = Date.now();
  return {
    id,
    channel,
    categories: [],
    maxPrice: null,
    step: "awaiting_categories",
    createdAt: now,
    lastInboundAt: now,
    sentDealIds: [],
    active: true,
  };
}

/* --------------------------------------------------------------------- Deals - */

const DEALS_KEY = "deals";

export async function listDeals(): Promise<Deal[]> {
  const raw = await kv.get(DEALS_KEY);
  return raw ? (JSON.parse(raw) as Deal[]) : [];
}

export async function addDeal(deal: Deal): Promise<void> {
  const deals = await listDeals();
  const next = [deal, ...deals].slice(0, config.limits.dealHistory);
  await kv.set(DEALS_KEY, JSON.stringify(next));
}

/** Deals a subscriber wants and has not been sent yet, newest first. */
export function matchDeals(subscriber: Subscriber, deals: Deal[]): Deal[] {
  const wanted = new Set<Category>(subscriber.categories);
  return deals.filter((deal) => {
    if (subscriber.sentDealIds.includes(deal.id)) return false;
    if (wanted.size > 0 && !wanted.has(deal.category)) return false;
    if (subscriber.maxPrice !== null && deal.price > subscriber.maxPrice) {
      return false;
    }
    return true;
  });
}

/* ---------------------------------------------------------------- Rate limit - */

/** True when the user has blown through their per-minute allowance. */
export async function isRateLimited(
  channel: ChannelName,
  id: string,
): Promise<boolean> {
  const bucket = Math.floor(Date.now() / 60_000);
  const count = await kv.incr(`rate:${channel}:${id}:${bucket}`, 120);
  return count > config.limits.messagesPerMinute;
}

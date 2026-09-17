/**
 * Turns a product link into an earning link.
 *
 * Amazon is the only tagged store for now: `tag=<associate id>` is all the
 * Associates programme needs, no API access required. Links from other stores
 * pass through untouched until an affiliate network is wired up.
 */

import { config } from "./config";

const AMAZON_HOSTS = ["amazon.in", "www.amazon.in", "amzn.in", "amzn.to"];

function isAmazon(url: URL): boolean {
  return AMAZON_HOSTS.includes(url.hostname.toLowerCase());
}

/**
 * amzn.in links hide the product id behind a redirect. Following it lets us tag
 * the real URL; if the request fails we tag the short link instead, which still
 * credits the sale.
 */
export async function expandShortLink(url: string): Promise<string> {
  try {
    const parsed = new URL(url);
    if (!["amzn.in", "amzn.to"].includes(parsed.hostname.toLowerCase())) {
      return url;
    }

    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    return response.url || url;
  } catch {
    return url;
  }
}

/** Adds our Associates tag, replacing anyone else's. Invalid URLs pass through. */
export function withAffiliateTag(url: string): string {
  try {
    const parsed = new URL(url);
    if (!isAmazon(parsed)) return url;

    // A shared Amazon link drags along a paragraph of tracking parameters,
    // which in a chat message pushes the price off the screen. A /dp/ link
    // needs none of them, so keep the tag alone.
    const keepParams =
      parsed.pathname.includes("/dp/") || parsed.pathname.includes("/gp/")
        ? new URLSearchParams()
        : parsed.searchParams;

    keepParams.set("tag", config.amazonTag);
    parsed.search = keepParams.toString();
    return parsed.toString();
  } catch {
    return url;
  }
}

/** The first http(s) URL in a message, or null. */
export function findUrl(text: string): string | null {
  const match = text.match(/https?:\/\/\S+/i);
  return match ? match[0].replace(/[),.]+$/, "") : null;
}

/** "₹12,999" */
export function formatRupees(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

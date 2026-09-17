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

    parsed.searchParams.set("tag", config.amazonTag);
    // Tracking noise Amazon adds to shared links; it makes messages unreadable.
    for (const junk of ["ref", "ref_", "pf_rd_r", "pf_rd_p", "psc", "th"]) {
      parsed.searchParams.delete(junk);
    }
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

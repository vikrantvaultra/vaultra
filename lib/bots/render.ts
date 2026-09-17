/**
 * How a deal reads in a chat message. Its own file so both the handler and the
 * broadcast can use it without importing each other.
 */

import { formatRupees, withAffiliateTag } from "./affiliate";
import type { Deal } from "./types";

export function renderDeal(deal: Deal): string {
  const off =
    deal.mrp && deal.mrp > deal.price
      ? ` (${Math.round(((deal.mrp - deal.price) / deal.mrp) * 100)}% off)`
      : "";

  return `🔥 ${deal.title}\n${formatRupees(deal.price)}${off}\n${withAffiliateTag(deal.url)}`;
}

import { capacityText, capacityTextShort } from "@/lib/siteConfig";

/**
 * Honest scarcity. The figure lives in siteConfig, and is meant to move.
 * `compact` is the header's abbreviation of the same sentence.
 */
export function Slots({ compact = false }: { compact?: boolean }) {
  return (
    <span className="slots">
      <span className="slots__dot" aria-hidden="true" />
      {compact ? capacityTextShort : capacityText}
    </span>
  );
}

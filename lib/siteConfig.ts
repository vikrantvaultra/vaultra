/** The placeholder from .env.example counts as "not configured yet". */
function normalizeKey(value: string | undefined) {
  const key = (value || "").trim();
  return key === "your-access-key-here" ? "" : key;
}

export const siteConfig = {
  name: "Vaultra",
  city: "Mumbai",
  tagline: "Automation consultancy · Mumbai",
  description:
    "We find the repetitive work eating your staff's hours — invoice entry, quotations, weekly reports, after-hours enquiries — and replace it with software. Two to four weeks, at a fixed price agreed before anyone starts.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://vaultra.in",

  /**
   * PLACEHOLDER — swap in the real number before launch. Digits only, with the
   * country code and no "+", exactly as wa.me expects.
   */
  whatsapp: "91XXXXXXXXXX",

  /**
   * Who takes the call, as named in the confirmation panel. Kept impersonal
   * so it stays true whoever picks the call up. The copy reads
   * "<callers> calls you on ..." — keep it singular.
   */
  callers: "Someone from the team",

  /**
   * Honest scarcity — the capacity pill in the header, the booking form and
   * the floating bar all read from here. Update it as the month fills and
   * when it resets; a number that never moves stops being believed.
   */
  capacity: { month: "September", left: 1 },

  /**
   * The midpoint build price the payback line in the calculator is worked
   * out against. Rupees.
   */
  assumedBuildCost: 150000,

  /** Web3Forms access key — https://web3forms.com */
  web3formsKey: normalizeKey(process.env.NEXT_PUBLIC_WEB3FORMS_KEY),
} as const;

export const whatsappHref = `https://wa.me/${siteConfig.whatsapp}`;

export const reassurance = "No pitch. We'll tell you if automation won't help.";

/** "September · 1 build slot left" — pluralised. The form and the floating bar. */
export const capacityText = `${siteConfig.capacity.month} · ${siteConfig.capacity.left} build slot${
  siteConfig.capacity.left === 1 ? "" : "s"
} left`;

/**
 * "Sep · 1 slot left" — the header bar carries the brand, five links and the
 * one ask, and the full sentence does not fit beside them.
 */
export const capacityTextShort = `${siteConfig.capacity.month.slice(0, 3)} · ${
  siteConfig.capacity.left
} slot${siteConfig.capacity.left === 1 ? "" : "s"} left`;

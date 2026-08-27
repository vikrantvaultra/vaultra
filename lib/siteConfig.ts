/** The placeholder from .env.example counts as "not configured yet". */
function normalizeKey(value: string | undefined) {
  const key = (value || "").trim();
  return key === "your-access-key-here" ? "" : key;
}

/**
 * Knobs that were editor props on the original design canvas.
 * They are plain constants here — flip them and rebuild.
 */
export const siteConfig = {
  name: "Vaultra",
  tagline: "Automation consultancy · Mumbai",
  description:
    "We find the repetitive work eating your staff's hours — invoice entry, quotations, weekly reports, after-hours enquiries — and replace it with software. Two to four weeks, at a fixed price agreed before anyone starts.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://vaultra.in",

  /** "modal" opens the booking dialog; "contact" scrolls to the contact form. */
  bookingCta: "modal" as "modal" | "contact",
  /** Sticky bottom call-to-action bar on phones. */
  mobileCtaBar: true,
  /** The brass-rods photograph beside the "How we work" heading. */
  showProcessImage: true,

  /** Web3Forms access key — https://web3forms.com */
  web3formsKey: normalizeKey(process.env.NEXT_PUBLIC_WEB3FORMS_KEY),
} as const;

export const budgetOptions = [
  { value: "unsure", label: "Not sure yet" },
  { value: "under-1", label: "Under ₹1 lakh" },
  { value: "1-2", label: "₹1 – 2 lakh" },
  { value: "2-3", label: "₹2 – 3 lakh" },
  { value: "above-3", label: "Above ₹3 lakh" },
];

export const reassurance = "No pitch. We'll tell you if automation won't help.";

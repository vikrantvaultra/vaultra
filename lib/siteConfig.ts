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
   * The midpoint build price the payback line in the calculator is worked
   * out against. Rupees.
   */
  assumedBuildCost: 150000,

  /** Web3Forms access key — https://web3forms.com */
  web3formsKey: normalizeKey(process.env.NEXT_PUBLIC_WEB3FORMS_KEY),
} as const;

export const whatsappHref = `https://wa.me/${siteConfig.whatsapp}`;

export const reassurance = "No pitch. We'll tell you if automation won't help.";

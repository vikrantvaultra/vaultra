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
    "We replace the repetitive work in mid-market Indian businesses with software — vendor invoices, quotations, WhatsApp enquiries, tenders, MIS. Two to four weeks, at one fixed price agreed in writing before anyone starts.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://vaultra.in",

  /**
   * PLACEHOLDER — swap in the real number before launch. Digits only, with the
   * country code and no "+", exactly as wa.me expects.
   */
  whatsapp: "91XXXXXXXXXX",

  /** The two people who take the call, named in the confirmation panel. */
  callers: "Aditya or Rohan",

  /** Web3Forms access key — https://web3forms.com */
  web3formsKey: normalizeKey(process.env.NEXT_PUBLIC_WEB3FORMS_KEY),
} as const;

export const whatsappHref = `https://wa.me/${siteConfig.whatsapp}`;

export const reassurance = "No pitch. We'll tell you if automation won't help.";

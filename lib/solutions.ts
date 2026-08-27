/**
 * The four solution cards, expanded into pages. Tones match the cards on the
 * home page; the headline metrics are the same placeholders as the cards —
 * swap in real engagement numbers before making claims out of them.
 */
export type Solution = {
  slug: string;
  no: string;
  glyph: string;
  tone: "mint" | "sand" | "sun" | "peach";
  title: [string, string];
  card: string;
  metric: string;
  /** Two short lines for the home-page card. */
  highlights: [string, string];
  lede: string;
  automate: string[];
  outcomes: { n: string; accent: string; label: string }[];
};

export const solutions: Solution[] = [
  {
    slug: "custom-ai-agents",
    no: "01",
    glyph: "✦",
    tone: "mint",
    title: ["Custom", "AI agents."],
    card: "Smart systems that answer, route and execute repetitive work around the clock.",
    metric: "25 hrs/week saved",
    highlights: ["Replies in under a minute, 24/7", "A human approves anything priced"],
    lede: "Agents built around your workflows, running on your accounts and your infrastructure. They answer, look up, route and execute — and anything priced or sensitive waits for a human click.",
    automate: [
      "After-hours enquiries answered on WhatsApp and email in under a minute",
      "Leads qualified on the spot and routed to the right salesperson",
      "Plain-language questions over your contracts, specs and policies",
      "Data pulled across systems without anyone swivel-chairing between tabs",
      "Escalation to a named person for anything priced or unusual",
      "A morning digest of everything the agent handled overnight",
    ],
    outcomes: [
      { n: "25", accent: " hrs", label: "a week back, typical" },
      { n: "< 60", accent: " sec", label: "to first reply, any hour" },
      { n: "24", accent: "/7", label: "coverage without headcount" },
    ],
  },
  {
    slug: "crm-sales-ops",
    no: "02",
    glyph: "↗",
    tone: "sand",
    title: ["CRM &", "sales ops."],
    card: "Turn every lead, follow-up and handoff into one clean, automatic pipeline.",
    metric: "3.4× faster follow-up",
    highlights: ["Leads captured from WhatsApp & web", "Quotes from your own price list"],
    lede: "Every lead captured, followed up and handed off in one clean pipeline — so no enquiry waits until tomorrow and none quietly go missing.",
    automate: [
      "Leads from WhatsApp, web forms and email land in the CRM by themselves",
      "First follow-up goes out in minutes, not days",
      "Quotations assembled from your own price list and discount slabs",
      "Handoffs carry full context, so nobody asks the customer twice",
      "Stale deals get nudged before they go cold",
      "The weekly pipeline report writes itself",
    ],
    outcomes: [
      { n: "3.4", accent: "×", label: "faster follow-up" },
      { n: "4", accent: " min", label: "per quotation, not forty" },
      { n: "0", accent: "", label: "leads dropped between tools" },
    ],
  },
  {
    slug: "finance-automation",
    no: "03",
    glyph: "₹",
    tone: "sun",
    title: ["Finance", "automation."],
    card: "Invoices, payroll and reconciliations that run on time without spreadsheet chaos.",
    metric: "99.9% accuracy",
    highlights: ["Invoices staged straight into Tally", "Bank reconciliation, daily"],
    lede: "Invoices, payroll inputs and reconciliations that run on time, every time — staged into the system you already use, with nothing posting until a person clicks approve.",
    automate: [
      "Vendor invoices read from email and staged as vouchers in Tally or your ERP",
      "Purchase orders matched line by line before anything is booked",
      "Payment reminders and collections that follow up politely, on schedule",
      "Payroll inputs assembled from attendance and approvals",
      "Bank statements reconciled daily instead of month-end",
      "Monday's MIS in your inbox at 7 am, numbers that moved marked",
    ],
    outcomes: [
      { n: "99.9", accent: "%", label: "posting accuracy" },
      { n: "~3", accent: " hrs", label: "a day back on data entry" },
      { n: "100", accent: "%", label: "human-approved postings" },
    ],
  },
  {
    slug: "customer-support",
    no: "04",
    glyph: "◌",
    tone: "peach",
    title: ["Customer", "support."],
    card: "Resolve common questions instantly and give your team context on every ticket.",
    metric: "68% tickets automated",
    highlights: ["Instant answers on repeat questions", "Full context on every handoff"],
    lede: "The questions that repeat get answered instantly, at any hour, in any channel — and the ones that need a person arrive with the full story attached.",
    automate: [
      "Instant answers to the questions that make up most of the queue",
      "Order, delivery and payment status looked up without a human",
      "Tickets triaged and routed to the right team automatically",
      "Agents see the customer's history before they say hello",
      "Anything priced, angry or unusual waits for a person",
      "A weekly summary of what customers actually asked",
    ],
    outcomes: [
      { n: "68", accent: "%", label: "of tickets resolved automatically" },
      { n: "< 60", accent: " sec", label: "to first response" },
      { n: "7", accent: " days", label: "a week, without shifts" },
    ],
  },
];

export const getSolution = (slug: string) => solutions.find((s) => s.slug === slug);

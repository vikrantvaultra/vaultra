import type { ReactNode } from "react";
import { BookCallButton } from "@/components/BookCallButton";
import { reassurance } from "@/lib/siteConfig";

const iconProps = {
  viewBox: "0 0 24 24",
  width: 40,
  height: 40,
  fill: "none",
  stroke: "#0d6a70",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const capabilities: {
  icon: ReactNode;
  title: string;
  body: string;
  stat: string;
  delay: number;
}[] = [
  {
    icon: (
      <svg {...iconProps}>
        <path d="M12 3v9" />
        <path d="M8.4 8.4 12 12l3.6-3.6" />
        <path d="M4 14.5v5h16v-5" />
      </svg>
    ),
    title: "Vendor invoices enter Tally without anyone typing.",
    body: "Invoices arriving by email or WhatsApp are read, matched against the purchase order, and posted as vouchers for one approval click.",
    stat: "Roughly 3 hours a day back",
    delay: 0,
  },
  {
    icon: (
      <svg {...iconProps}>
        <path d="M20.5 12.4 12.4 20.5l-9-9V3.4h8.1z" />
        <circle cx="8" cy="8" r="1.6" />
      </svg>
    ),
    title: "A quotation goes out in four minutes, not forty.",
    body: "Sales picks the customer and the items. Pricing, discount slab and terms come from your own list, and a manager approves before it sends.",
    stat: "Roughly 5 hours a week back",
    delay: 60,
  },
  {
    icon: (
      <svg {...iconProps}>
        <path d="M3.5 4.6h17v10.2h-11l-6 4.6z" />
        <circle cx="8.6" cy="9.7" r=".9" />
        <circle cx="12" cy="9.7" r=".9" />
        <circle cx="15.4" cy="9.7" r=".9" />
      </svg>
    ),
    title: "Every WhatsApp enquiry is answered in under a minute.",
    body: "Product, quantity and city are captured on the spot at any hour, then passed to the right salesperson. Anything priced waits for a person.",
    stat: "Nights and weekends covered",
    delay: 120,
  },
  {
    icon: (
      <svg {...iconProps}>
        <rect x="3.5" y="5.2" width="17" height="15.3" rx="1.2" />
        <path d="M8 3v4M16 3v4M3.5 10h17" />
        <path d="m9 14.6 2.4 2.4 4-4.4" />
      </svg>
    ),
    title: "Tenders in your categories arrive in one morning email.",
    body: "The portals are checked for you. Closing dates, eligibility and document fees are pulled out, with anything due inside a week at the top.",
    stat: "Roughly 4 hours a week of portal checking",
    delay: 0,
  },
  {
    icon: (
      <svg {...iconProps}>
        <path d="M3.6 20.4h16.8" />
        <rect x="5.6" y="12.4" width="3.6" height="8" />
        <rect x="11.2" y="7.6" width="3.6" height="12.8" />
        <rect x="16.8" y="4" width="3.6" height="16.4" />
      </svg>
    ),
    title: "Monday's MIS report is in your inbox at 7am.",
    body: "Built from the same sources every week, in the format your reviewers already read, with the numbers that moved marked.",
    stat: "Half a day a week back",
    delay: 60,
  },
  {
    icon: (
      <svg {...iconProps}>
        <path d="M6 3.5h7.4L18 8.1v12.4H6z" />
        <circle cx="11.8" cy="13" r="3" />
        <path d="m14 15.2 2.6 2.6" />
      </svg>
    ),
    title: "Ask about a contract, get the clause and the page.",
    body: "Contracts, specs and policies become searchable in plain language, and every answer comes back with the source quoted.",
    stat: "Minutes instead of a hunt through the drive",
    delay: 120,
  },
];

export function Build() {
  return (
    <section id="build" className="section section--ruled">
      <div className="shell">
        <div className="build__head" data-reveal="0">
          <div>
            <p className="eyebrow">02 · What we build</p>
            <h2 className="h2">Six jobs we are asked to take off people.</h2>
          </div>
          <p className="lede">
            Each one is built around the systems you already run &mdash; Tally,
            Zoho, Excel, WhatsApp &mdash; and handed over to your team, not kept
            in ours.
          </p>
        </div>

        <div className="cards">
          {capabilities.map((item) => (
            <div className="card" key={item.title} data-reveal={item.delay}>
              {item.icon}
              <h3 className="card__title">{item.title}</h3>
              <p className="card__body">{item.body}</p>
              <p className="card__stat">{item.stat}</p>
            </div>
          ))}
        </div>

        <p className="build__aside" data-reveal="0">
          These are the six we are asked for most. The same approach applies to
          any other system you run &mdash; an ERP, custom software written years
          ago, or a legacy database nobody has touched since.
        </p>

        <div
          className="section__foot section__foot--tight btn-stack"
          data-reveal="0"
        >
          <BookCallButton variant="section" />
          <p className="note">{reassurance}</p>
        </div>
      </div>
    </section>
  );
}

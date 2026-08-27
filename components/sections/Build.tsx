import { Cta } from "@/components/Cta";
import { Folio } from "@/components/Folio";
import { Plate } from "@/components/Plate";
import { reassurance } from "@/lib/siteConfig";

const entries = [
  {
    title: "Vendor invoices post into Tally without anyone typing.",
    body: "Read from email or WhatsApp, matched to the purchase order, staged as vouchers for one approval click. Nothing posts unseen.",
    dayOne: "Yesterday's invoice mails are already staged as vouchers when you log in.",
    credit: "~3 hrs",
    unit: "a day back",
  },
  {
    title: "A quotation goes out in four minutes, not forty.",
    body: "Pricing, discount slab and terms pull from your own list. A manager approves before it sends.",
    dayOne: "Your live price list and discount slabs are loaded and quoting.",
    credit: "~5 hrs",
    unit: "a week back",
  },
  {
    title: "Every WhatsApp enquiry answered in under a minute, at any hour.",
    body: "Product, quantity and city captured on the spot, then routed to the right salesperson. Anything priced waits for a human.",
    dayOne: "An 11:40 pm enquiry gets an answer, and a salesperson gets the lead.",
    credit: "13 hrs",
    unit: "of silence closed",
  },
  {
    title: "Tender closing dates arrive in one morning email.",
    body: "The portals are checked for you. Closing dates, eligibility and document fees pulled out, with anything due inside a week at the top.",
    dayOne: "Tomorrow's 8 am email lists every open tender and its closing date.",
    credit: "~4 hrs",
    unit: "a week back",
  },
  {
    title: "Monday's MIS is in your inbox at 7 am.",
    body: "Built from the same sources every week, in the format your reviewers already read, with the numbers that moved marked.",
    dayOne: "Your existing MIS template, matched line for line.",
    credit: "½ day",
    unit: "a week back",
  },
  {
    title: "Ask your contracts a question in plain language.",
    body: "Contracts, specs and policies become searchable, and every answer returns the clause and the page.",
    dayOne: "Last year's contracts and specs are indexed and answering.",
    credit: "0 min",
    unit: "hunting folders",
  },
];

export function Build() {
  return (
    <section className="section" id="build">
      <div className="wrap">
        <Folio n="02" label="What we build" direction="E" quality="growth" />

        <div className="build__head">
          <div>
            <h2 data-reveal>Six jobs we are asked to take off people.</h2>
            <p className="lede" data-reveal>
              Each one is built around the systems you already run, and handed over to your
              team, not kept in ours. Hours saved are entered on the credit side, where they
              belong.
            </p>
          </div>
          <Plate
            src="/images/bundle-vs-sheet.jpg"
            alt="A thick bundle of paper tied with a band beside one single folded sheet"
            width={1600}
            height={1066}
            n="02"
            caption="Before, and after"
            sizes="(max-width: 880px) 100vw, 320px"
          />
        </div>

        <div className="ledger" data-reveal>
          <div className="ledger__head">
            <div className="no">No.</div>
            <div>Particulars</div>
            <div className="cr">Cr · hours back</div>
          </div>

          {entries.map((entry, i) => (
            <div className="entry" key={entry.title}>
              <div className="entry__no">{String(i + 1).padStart(2, "0")}</div>
              <div className="entry__desc">
                <h3>{entry.title}</h3>
                <p>{entry.body}</p>
                <p className="entry__day1">
                  <b>Day one</b>
                  {entry.dayOne}
                </p>
              </div>
              <div className="entry__cr">
                <span className="entry__n">{entry.credit}</span>
                <span className="entry__u">{entry.unit}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="build__note">
          These are the six we are asked for most. The same approach applies to any other
          system you run: an ERP, custom software written years ago, or a legacy database
          nobody has touched since.
        </p>

        <div className="cta-band" data-reveal>
          <p className="cta-band__line">
            Not sure which of these fits you? That is exactly what the call is for.
          </p>
          <div className="cta-band__side">
            <Cta>Book my free 20-minute call</Cta>
            <span className="cta-band__sub">{reassurance}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

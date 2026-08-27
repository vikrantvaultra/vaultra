import { Folio } from "@/components/Folio";
import { Plate } from "@/components/Plate";

const cases = [
  {
    who: "₹40 cr auto-components distributor · Bhiwandi",
    what: "Vendor invoices into Tally",
    before: "15 hrs",
    beforeUnit: "a week typing",
    after: "40 min",
    afterUnit: "a week approving",
    built: "Built in 3 weeks · 4 people freed",
  },
  {
    who: "₹90 cr speciality chemicals maker · Vapi",
    what: "Quotations out of the price list",
    before: "40 min",
    beforeUnit: "per quotation",
    after: "4 min",
    afterUnit: "per quotation",
    built: "Built in 2 weeks · 60 quotes a month",
  },
  {
    who: "₹25 cr fasteners trader · Mumbai",
    what: "After-hours WhatsApp enquiries",
    before: "13 hrs",
    beforeUnit: "unanswered daily",
    after: "60 sec",
    afterUnit: "to first reply",
    built: "Built in 2 weeks · 7 days a week",
  },
];

export function Proof() {
  return (
    <section className="section" id="proof">
      <div className="wrap">
        <Folio n="03" label="Proof" direction="नैऋत्य · SW" quality="stability" />
        <h2 data-reveal>Work we have already shipped.</h2>

        <div className="proof__grid">
          {cases.map((item) => (
            <article className="proof" key={item.what} data-reveal>
              <div className="proof__who">{item.who}</div>
              <h3 className="proof__what">{item.what}</h3>
              <div className="ba">
                <div>
                  <span className="ba__k">Before</span>
                  <span className="ba__n">{item.before}</span>
                  <div className="ba__u">{item.beforeUnit}</div>
                </div>
                <span className="ba__arrow" aria-hidden="true">
                  →
                </span>
                <div className="ba__after">
                  <span className="ba__k">After</span>
                  <span className="ba__n">{item.after}</span>
                  <div className="ba__u">{item.afterUnit}</div>
                </div>
              </div>
              <div className="proof__built">{item.built}</div>
            </article>
          ))}
        </div>

        {/* Placeholder figures, as marked. Swap before launch. */}
        <p className="proof__sample">Sample entries · swap in your own numbers before launch</p>

        <figure className="quote" data-reveal>
          <blockquote>
            <p>
              &ldquo;The first three hours of every morning used to go into typing invoices. Now
              two people look at a screen, click approve, and get on with the day.&rdquo;
            </p>
          </blockquote>
          <figcaption>Sample quote · name · role · company type</figcaption>
        </figure>

        <div className="proof__plates">
          <Plate
            src="/images/ledger-ruler.jpg"
            alt="A closed dark green hardbound ledger with a brass ruler laid across the cover"
            width={1600}
            height={900}
            n="03"
            caption="The books, closed by seven"
            sizes="(max-width: 760px) 100vw, 540px"
            dark
          />
          <Plate
            src="/images/quote-paper-pen.jpg"
            alt="A single sheet of paper held by a brass paperweight with a fountain pen beside it"
            width={1600}
            height={1066}
            n="04"
            caption="One number, in writing"
            sizes="(max-width: 760px) 100vw, 540px"
          />
        </div>
      </div>
    </section>
  );
}

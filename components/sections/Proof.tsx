const cases = [
  {
    who: "₹40 cr auto-components distributor · Bhiwandi",
    title: "Vendor invoices into Tally",
    before: "15 hrs",
    beforeUnit: "a week typing",
    after: "40 min",
    afterUnit: "a week approving",
    built: "Built in 3 weeks · 4 people freed",
  },
  {
    who: "₹90 cr speciality chemicals maker · Vapi",
    title: "Quotations out of the price list",
    before: "40 min",
    beforeUnit: "per quotation",
    after: "4 min",
    afterUnit: "per quotation",
    built: "Built in 2 weeks · 60 quotes a month",
  },
  {
    who: "₹25 cr fasteners trader · Mumbai",
    title: "After-hours WhatsApp enquiries",
    before: "13 hrs",
    beforeUnit: "unanswered daily",
    after: "60 sec",
    afterUnit: "to first reply",
    built: "Built in 2 weeks · 7 days a week",
  },
];

export function Proof() {
  return (
    <section className="dark section proof">
      <div className="shell">
        <p className="eyebrow" data-reveal>
          <span>03</span>
          <span>Proof</span>
        </p>
        <h2 className="h2" data-reveal>
          Work we have already shipped.
        </h2>

        {/* Placeholder figures, as marked on the design. Swap before launch. */}
        <p className="proof__disclaimer" data-reveal>
          Sample entries · swap in your own numbers before launch
        </p>

        <div className="proof__grid">
          {cases.map((item) => (
            <article className="proof__card" key={item.title} data-reveal>
              <div className="proof__who">{item.who}</div>
              <h3>{item.title}</h3>
              <div className="proof__delta">
                <div>
                  <span className="label-sm">Before</span>
                  <div className="proof__value">{item.before}</div>
                  <div className="proof__unit">{item.beforeUnit}</div>
                </div>
                <div className="proof__arrow" aria-hidden="true">
                  →
                </div>
                <div>
                  <span className="label-sm">After</span>
                  <div className="proof__value proof__value--after">{item.after}</div>
                  <div className="proof__unit">{item.afterUnit}</div>
                </div>
              </div>
              <div className="proof__built">{item.built}</div>
            </article>
          ))}
        </div>

        <figure className="proof__quote" data-reveal>
          <blockquote>
            “The first three hours of every morning used to go into typing invoices. Now two
            people look at a screen, click approve, and get on with the day.”
          </blockquote>
          <figcaption>Sample quote · name · role · company type</figcaption>
        </figure>
      </div>
    </section>
  );
}

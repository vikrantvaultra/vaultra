import Image from "next/image";

const items = [
  {
    title: "Vendor invoices post into Tally without anyone typing.",
    body: "Read from email or WhatsApp, matched to the PO, staged as vouchers for one approval click. Nothing posts unseen.",
    metric: "~3 hrs",
    unit: "a day back",
    dayOne: "Yesterday's invoice mails are already staged as vouchers when you log in.",
  },
  {
    title: "A quotation goes out in four minutes, not forty.",
    body: "Pricing, discount slab and terms pull from your own list. The manager approves before it sends.",
    metric: "~5 hrs",
    unit: "a week back",
    dayOne: "Your live price list and discount slabs are loaded and quoting.",
  },
  {
    title: "Every WhatsApp enquiry answered in under a minute, at any hour.",
    body: "Product, quantity and city captured, then routed to the right salesperson. Anything priced waits for a human.",
    metric: "13 hrs",
    unit: "of silence closed",
    dayOne: "An 11:40pm enquiry gets an answer, and a salesperson gets the lead.",
  },
  {
    title: "Tender closing dates arrive in one morning email.",
    body: "Portals checked automatically. Closing dates, eligibility and fees extracted and listed.",
    metric: "~4 hrs",
    unit: "a week back",
    dayOne: "Tomorrow's 8am email lists every open tender and its closing date.",
  },
  {
    title: "Monday's MIS is in your inbox at 7am.",
    body: "Same format your reviewers already read, with the numbers that moved marked.",
    metric: "½ day",
    unit: "a week back",
    dayOne: "Your existing MIS template, matched line for line.",
  },
  {
    title: "Ask your contracts a question in plain language.",
    body: "Contracts, specs and policies made searchable. Every answer returns the clause and the page.",
    metric: "0 min",
    unit: "hunting folders",
    dayOne: "Last year's contracts and specs are indexed and answering.",
  },
];

export function Build() {
  return (
    <section className="shell section build">
      <div className="head-split">
        <div className="head-split__text">
          <p className="eyebrow" data-reveal>
            <span>02</span>
            <span>What we build</span>
          </p>
          <h2 className="h2" data-reveal>
            Six things we get asked for most.
          </h2>
        </div>
        <figure className="figure head-split__figure build__head-figure" data-reveal>
          <Image
            src="/images/bundle-vs-sheet.jpg"
            alt="A thick bundle of paper tied with a band beside one single folded sheet on a cream surface"
            width={1600}
            height={1066}
            sizes="(max-width: 640px) 100vw, 320px"
          />
        </figure>
      </div>

      <div className="build__grid">
        {items.map((item) => (
          <article className="build__card" key={item.title} data-reveal>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
            <div className="build__foot">
              <div className="build__metric">
                <strong>{item.metric}</strong>
                <span className="label-sm">{item.unit}</span>
              </div>
              <p className="build__dayone">
                <span className="label-sm">Day one</span>
                <br />
                {item.dayOne}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

import Image from "next/image";

const steps = [
  {
    n: "STEP 01",
    title: "A 20-minute call",
    body: "You describe the work that repeats. We say whether software should do it, and what we would build first.",
  },
  {
    n: "STEP 02",
    title: "A fixed-scope build",
    body: "Scope, price and dates in writing within two working days. Two to four weeks to running software, with a review at the halfway mark.",
  },
  {
    n: "STEP 03",
    title: "Support, if you want it",
    body: "Code and credentials go to your team either way. Monthly support is optional, not a condition.",
  },
];

const terms = [
  "You work with the people who build it.",
  "A human approves anything touching money.",
  "The work stays yours. No lock-in.",
];

export function Process() {
  return (
    <section className="shell section process">
      <div className="head-split process__head">
        <div className="head-split__text">
          <p className="eyebrow" data-reveal>
            <span>04</span>
            <span>How it works</span>
          </p>
          <p className="process__claim" data-reveal>
            One number, in writing, within two working days.
          </p>
        </div>
        <figure className="figure head-split__figure process__head-figure" data-reveal>
          <Image
            src="/images/quote-paper-pen.jpg"
            alt="A single sheet of paper held by a brass paperweight with a fountain pen beside it"
            width={1600}
            height={1066}
            sizes="(max-width: 640px) 100vw, 320px"
          />
        </figure>
      </div>

      <div className="process__steps">
        {steps.map((step) => (
          <div className="process__step" key={step.n} data-reveal>
            <div className="process__step-n">{step.n}</div>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </div>
        ))}
      </div>

      <figure className="figure process__figure" data-reveal>
        <Image
          src="/images/handover-laptop-key.jpg"
          alt="A closed dark green laptop with a brass key resting on its lid, beside a printed document"
          width={1600}
          height={1200}
          sizes="(max-width: 640px) 100vw, 400px"
        />
      </figure>

      <ul className="process__terms" data-reveal>
        {terms.map((term) => (
          <li key={term}>{term}</li>
        ))}
      </ul>
    </section>
  );
}

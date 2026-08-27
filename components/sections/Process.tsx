import { Folio } from "@/components/Folio";
import { Plate } from "@/components/Plate";
import { Stamp } from "@/components/Stamp";

const steps = [
  {
    n: "Step 01",
    title: "A 20-minute call",
    body: "You describe the work that repeats. We walk it end to end — what starts it, who touches it, where it stalls — and say whether software should do it.",
    how: "20 minutes",
    cost: "Free, no follow-up sequence",
  },
  {
    n: "Step 02",
    title: "A fixed-scope build",
    body: "Scope, price and dates in writing within two working days. Two to four weeks to running software, tested with the people who do the work today, with a review at the halfway mark.",
    how: "Two to four weeks",
    cost: "Fixed price. No hourly billing",
  },
  {
    n: "Step 03",
    title: "Support, if you want it",
    body: "Code, credentials and documentation go to your team either way. Hosting, monitoring and changes are optional — plenty of clients take the build and run it themselves.",
    how: "Monthly, ongoing",
    cost: "Flat retainer. Cancel any month",
  },
];

const promises = [
  { stamp: "Senior team", text: "You work with the people who build it." },
  { stamp: "Human approves", text: "A person releases anything touching money." },
  { stamp: "No lock-in", text: "The work stays yours — code and credentials handed over." },
];

export function Process() {
  return (
    <section className="section" id="process">
      <div className="wrap">
        <Folio n="04" label="How it works" direction="पश्चिम · W" quality="gains" />
        <h2 data-reveal>One number, in writing, within two working days.</h2>
        <p className="lede" data-reveal>
          We scope by workflow, not by software. No discovery retainer, no workshop phase.
        </p>

        <div className="steps">
          {steps.map((step) => (
            <div className="step" key={step.n} data-reveal>
              <span className="step__n">{step.n}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              <dl>
                <div className="step__kv">
                  <dt>How long</dt>
                  <dd>{step.how}</dd>
                </div>
                <div className="step__kv">
                  <dt>Cost</dt>
                  <dd>{step.cost}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>

        <ul className="promises" data-reveal>
          {promises.map((promise) => (
            <li className="promise" key={promise.stamp}>
              <Stamp>{promise.stamp}</Stamp>
              {promise.text}
            </li>
          ))}
        </ul>

        <div className="guarantee" data-reveal>
          <div>
            <h3>
              If the software cannot do what the scope says, you do not pay the balance.
            </h3>
            <p>
              There is a review at the halfway mark. If it is going the wrong way, you see it
              then — not at the end.
            </p>
            <div className="guarantee__mark">
              <Stamp tone="gold">In writing</Stamp>
            </div>
          </div>
          <Plate
            src="/images/handover-laptop-key.jpg"
            alt="A closed dark green laptop with a brass key resting on its lid, beside a printed document"
            width={1600}
            height={1200}
            n="05"
            caption="Code and credentials, handed over"
            sizes="(max-width: 760px) 100vw, 300px"
            dark
          />
        </div>
      </div>
    </section>
  );
}

import { Eyebrow } from "@/components/Eyebrow";

const entries = [
  {
    glyph: "✦",
    title: "Custom AI agents",
    body: "Smart systems that answer, route and execute repetitive work around the clock.",
    metric: "25 hrs/week saved",
  },
  {
    glyph: "↗",
    title: "CRM & sales ops",
    body: "Turn every lead, follow-up and handoff into one clean, automatic pipeline.",
    metric: "3.4× faster follow-up",
  },
  {
    glyph: "₹",
    title: "Finance automation",
    body: "Invoices, payroll and reconciliations that run on time without spreadsheet chaos.",
    metric: "99.9% accuracy",
  },
  {
    glyph: "◌",
    title: "Customer support",
    body: "Resolve common questions instantly and give your team context on every ticket.",
    metric: "68% tickets automated",
  },
];

const tones = ["mint", "sand", "sun", "peach"];

export function Build() {
  return (
    <section className="section" id="solutions">
      <div className="wrap">
        <div className="solutions__head">
          <div>
            <Eyebrow>Your growth, systemized</Eyebrow>
            <h2 data-reveal>
              <span className="line">Less admin.</span>
              <span className="line line--sage">More ambition.</span>
            </h2>
          </div>
          <a className="text-link" href="#calculator" data-reveal>
            Calculate your savings
          </a>
        </div>

        <div className="solutions" data-reveal>
          {entries.map((entry, i) => (
            <a className={`scard scard--${tones[i]}`} href="#calculator" key={entry.title}>
              <span className="scard__top">
                <span className="scard__disc" aria-hidden="true">
                  {entry.glyph}
                </span>
                <span className="scard__no">{String(i + 1).padStart(2, "0")}</span>
              </span>
              <h3>{entry.title}</h3>
              <p className="scard__body">{entry.body}</p>
              <span className="scard__foot">
                <span className="scard__metric">{entry.metric}</span>
                <span className="scard__go" aria-hidden="true">
                  ↗
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

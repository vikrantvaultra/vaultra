import Image from "next/image";
import { siteConfig } from "@/lib/siteConfig";
import brassRods from "@/public/images/brass-rods.jpg";

const steps = [
  {
    num: "01",
    title: "A call about one workflow",
    body: "We walk the work end to end: what starts it, who touches it, where it stalls, and what it costs in hours. You leave knowing whether it is worth automating.",
    duration: "20 minutes",
    cost: "Free, and no follow-up sequence",
    delay: 0,
  },
  {
    num: "02",
    title: "A fixed-scope build",
    body: "One or two workflows, written into a scope you sign, built against your real documents and whatever systems hold them, tested with the people who do the work today, handed over with training.",
    duration: "Two to four weeks",
    cost: "Fixed price, quoted after the call. No hourly billing",
    delay: 90,
  },
  {
    num: "03",
    title: "Support and improvement",
    body: "Hosting, monitoring and changes as your process shifts. Optional — plenty of clients take the build and run it themselves.",
    duration: "Monthly, ongoing",
    cost: "Flat retainer. Cancel with a month's notice",
    delay: 180,
  },
];

const pillars = [
  {
    title: "You work with the builders",
    body: "A small senior team. No junior handoff, no account manager relaying questions.",
  },
  {
    title: "A person approves the money",
    body: "Anything touching payments, pricing or a customer reply is prepared by software and released by your team.",
  },
  {
    title: "The work stays yours",
    body: "Code, credentials and documentation are handed over. You are not locked into us to keep it running.",
  },
];

export function Process() {
  return (
    <section id="process" className="section section--ruled">
      <div className="shell">
        <div className="process__head" data-reveal="0">
          <div className="process__intro">
            <p className="eyebrow">03 · How we work</p>
            <h2 className="h2 h2--narrow">
              Three steps, and you know the price at the second one.
            </h2>
            <p className="lede">
              We scope by workflow, not by software. No discovery retainer, no
              workshop phase. The first call is free and the build is quoted as
              one number.
            </p>
          </div>

          {siteConfig.showProcessImage ? (
            <Image
              className="photo process__photo"
              src={brassRods}
              alt="Three brass rods of decreasing length laid out in parallel on a pale surface"
              sizes="(max-width: 860px) 100vw, 470px"
            />
          ) : null}
        </div>

        <div className="steps">
          {steps.map((step, i) => (
            <div
              className={`step${i === 0 ? " step--first" : ""}`}
              key={step.num}
              data-reveal={step.delay}
            >
              <p className="step__num">{step.num}</p>
              <h3 className="step__title">{step.title}</h3>
              <p className="step__body">{step.body}</p>
              <div className="step__meta">
                <span className="step__meta-dim">
                  HOW LONG&nbsp;&nbsp;{step.duration}
                </span>
                <span className="step__meta-key">
                  COST&nbsp;&nbsp;{step.cost}
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className="process__pledge" data-reveal="0">
          Every build is quoted as a single number, in writing, within two
          working days of the call.
        </p>

        <div className="pillars" data-reveal="0">
          {pillars.map((pillar) => (
            <div className="pillar" key={pillar.title}>
              <h3 className="pillar__title">{pillar.title}</h3>
              <p className="pillar__body">{pillar.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

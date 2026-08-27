import Link from "next/link";
import { Eyebrow } from "@/components/Eyebrow";
import { solutions } from "@/lib/solutions";

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
          {solutions.map((entry) => (
            <Link
              className={`scard scard--${entry.tone}`}
              href={`/solutions/${entry.slug}`}
              key={entry.slug}
            >
              <span className="scard__top">
                <span className="scard__disc" aria-hidden="true">
                  {entry.glyph}
                </span>
                <span className="scard__no">{entry.no}</span>
              </span>
              <h3>{`${entry.title[0]} ${entry.title[1].replace(/\.$/, "")}`}</h3>
              <p className="scard__body">{entry.card}</p>
              <span className="scard__foot">
                <span className="scard__metric">{entry.metric}</span>
                <span className="scard__go" aria-hidden="true">
                  ↗
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

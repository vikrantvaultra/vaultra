import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuditModal, AuditTrigger } from "@/components/AuditModal";
import { Eyebrow } from "@/components/Eyebrow";
import { Header } from "@/components/Header";
import { Reveal } from "@/components/Reveal";
import { Footer } from "@/components/sections/Footer";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { getSolution, solutions } from "@/lib/solutions";

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const solution = getSolution((await params).slug);
  if (!solution) return {};
  const title = `${solution.title[0]} ${solution.title[1].replace(/\.$/, "")}`;
  return {
    title,
    description: solution.card,
    alternates: { canonical: `/solutions/${solution.slug}` },
  };
}

export default async function SolutionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const solution = getSolution((await params).slug);
  if (!solution) notFound();

  return (
    <>
      <Reveal />
      <Header />
      <main>
        <section className="hero sol-hero">
          <div className="wrap sol-hero__grid">
            <div>
              <Eyebrow>Solution · {solution.no}</Eyebrow>
              <h1>
                <span className="line">{solution.title[0]}</span>
                <span className="line line--sage">{solution.title[1]}</span>
              </h1>
              <p className="hero__sub">{solution.lede}</p>
              <div className="hero__ctas">
                <AuditTrigger label="Audit my workflows" />
                <Link className="btn-ghost" href="/#calculator">
                  Estimate the ROI
                </Link>
              </div>
            </div>

            <aside className={`sol-panel scard--${solution.tone}`} data-reveal>
              <span className="scard__top">
                <span className="scard__disc" aria-hidden="true">
                  {solution.glyph}
                </span>
                <span className="scard__no">{solution.no}</span>
              </span>
              <span className="sol-panel__metric">{solution.metric}</span>
              <p className="sol-panel__body">{solution.card}</p>
            </aside>
          </div>
        </section>

        <section className="stats" aria-label="Typical outcomes">
          <div className="wrap stats__grid" data-reveal>
            {solution.outcomes.map((o) => (
              <div className="stat" key={o.label}>
                <span className="stat__n">
                  {o.n}
                  <b>{o.accent}</b>
                </span>
                <span className="stat__l">{o.label}</span>
              </div>
            ))}
            <p className="stats__tag">
              <span aria-hidden="true">✦</span> Typical figures · your audit gets exact ones
            </p>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <div className="contrast__head">
              <div>
                <Eyebrow>What we automate</Eyebrow>
                <h2 data-reveal>
                  <span className="line">The work this</span>
                  <span className="line line--sage">takes off people.</span>
                </h2>
              </div>
              <p data-reveal>
                Built around the systems you already run, handed over to your team, not kept
                in ours.
              </p>
            </div>
            <ul className="sol-list" data-reveal>
              {solution.automate.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section section--band">
          <div className="wrap sol-cta" data-reveal>
            <div>
              <h2>
                <span className="line">See what this unlocks</span>
                <span className="line line--sage">for your team.</span>
              </h2>
              <p className="sol-cta__sub">
                Three questions, two minutes. We reply with a custom plan within one working
                day.
              </p>
            </div>
            <div className="sol-cta__actions">
              <AuditTrigger label="Get your free roadmap" />
              <Link className="btn-ghost" href="/#solutions">
                All solutions
              </Link>
            </div>
          </div>
        </section>
      </main>
      <TrustStrip />
      <Footer />
      <AuditModal />
    </>
  );
}

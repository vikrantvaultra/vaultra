import Image from "next/image";
import { AuditTrigger } from "@/components/AuditModal";
import { Eyebrow } from "@/components/Eyebrow";

const avatars = [
  { t: "AM", bg: "#6f967c" },
  { t: "RK", bg: "#bd7d55" },
  { t: "MS", bg: "#273f51" },
  { t: "+", bg: "#0d3b2e" },
];

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap hero__grid">
        <div>
          <Eyebrow>The operating system for your next stage</Eyebrow>
          <h1>
            <span className="line">Make busywork</span>
            <span className="line line--sage">disappear.</span>
          </h1>
          <p className="hero__sub">
            We build custom AI agents and automated systems that handle repetitive
            work&mdash;so your team can focus on growth.
          </p>

          <div className="hero__ctas">
            <AuditTrigger label="Get your free roadmap" />
            <a className="btn-ghost" href="#solutions">
              Explore our systems
            </a>
          </div>

          <div className="hero__social" data-reveal>
            <div className="faces" aria-hidden="true">
              {avatars.map((a) => (
                <span key={a.t} className="face" style={{ background: a.bg }}>
                  {a.t}
                </span>
              ))}
            </div>
            <p>
              <b>200+ businesses</b>
              <span>trust Vaultra with their ops</span>
            </p>
          </div>
        </div>

        <div className="hero__visual" data-reveal>
          {/* The floating stat cards are part of the artwork itself. */}
          <Image
            src="/images/hero-v2.png"
            alt="Operations leader reviewing an automation dashboard. Overlay cards read: hours saved this month 10,248, up 24% vs last month; workflow complete, invoice pipeline, just now."
            width={1104}
            height={974}
            priority
            sizes="(max-width: 980px) 100vw, 555px"
            className="hero__photo"
          />
        </div>
      </div>
    </section>
  );
}

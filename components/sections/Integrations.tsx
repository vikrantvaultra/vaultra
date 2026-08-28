import { Eyebrow } from "@/components/Eyebrow";
import { integrations } from "@/lib/integrations";

export function Integrations() {
  return (
    <section
      className="section section--band integrations"
      id="integrations"
      aria-label="ERP and finance systems we integrate with"
    >
      <div className="wrap">
        <div className="contrast__head">
          <div>
            <Eyebrow>Seamless integration</Eyebrow>
            <h2 data-reveal>
              <span className="line">Works with the ERP</span>
              <span className="line line--sage">you already run.</span>
            </h2>
          </div>
          <p data-reveal>
            From Tally to SAP S/4HANA — we stage work into your finance system and
            never ask you to replace it.
          </p>
        </div>
      </div>
      <div className="erp-marquee" data-reveal>
        <ul className="erp-marquee__track">
          {[...integrations, ...integrations].map((name, i) => (
            <li
              className="erp-chip"
              key={`${name}-${i}`}
              aria-hidden={i >= integrations.length || undefined}
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

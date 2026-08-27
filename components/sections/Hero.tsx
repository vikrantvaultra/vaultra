import { Cta } from "@/components/Cta";
import { reassurance } from "@/lib/siteConfig";

const facts = [
  {
    label: "Works with your stack",
    value: "Tally, Zoho, SAP, Excel, WhatsApp — or whatever you already run",
  },
  {
    label: "Price certainty",
    value: "One fixed number, in writing, in two working days",
  },
  {
    label: "No lock-in",
    value: "Code and credentials handed to your team",
  },
  {
    label: "Where we are",
    value: "Mumbai. On a call in twenty minutes",
  },
];

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__grid">
        <div>
          <h1>Your team is still typing vendor invoices by hand.</h1>
          <p className="hero__lede">
            We replace that work with software built around whatever you already run — Tally,
            Zoho, SAP, a custom ERP, Excel, WhatsApp. Two to four weeks. One fixed price, agreed
            in writing before anyone starts.
          </p>
          <div className="hero__cta">
            <Cta size="lg">Book a 20-minute call</Cta>
            <p className="hero__note">{reassurance}</p>
          </div>
        </div>

        {/* The invoice that arrives, and the voucher it becomes. */}
        <div className="hero__proof" aria-hidden="true">
          <div className="doc-invoice">
            <div className="doc-invoice__from">Vendor mail · attachment.pdf</div>
            <div className="doc-invoice__vendor">Shree Metals Pvt Ltd</div>
            <div className="doc-invoice__ref">Tax Invoice SM/2114 · PO 4471</div>
            <div className="doc-invoice__lines">
              <span />
              <span style={{ width: "78%" }} />
              <span style={{ width: "54%" }} />
            </div>
            <dl className="doc-invoice__total">
              <dt>Total</dt>
              <dd>₹4,18,600</dd>
            </dl>
          </div>

          <div className="doc-voucher">
            <div className="doc-voucher__head">
              <span>Tally · Purchase voucher</span>
              <span className="doc-voucher__badge">STAGED</span>
            </div>
            <dl className="doc-voucher__rows">
              <dt>Purchase A/c</dt>
              <dd>4,18,600.00</dd>
              <dt>Shree Metals Pvt Ltd</dt>
              <dd>Cr 4,18,600.00</dd>
              <dt>PO match</dt>
              <dd className="is-match">4471 ✓</dd>
            </dl>
            <div className="doc-voucher__foot">Waiting on one approval click.</div>
          </div>
        </div>
      </div>

      <dl className="hero__facts">
        {facts.map((fact) => (
          <div key={fact.label}>
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

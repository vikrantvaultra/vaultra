import { Cta } from "@/components/Cta";
import { Folio } from "@/components/Folio";
import { Stamp } from "@/components/Stamp";
import { reassurance, siteConfig } from "@/lib/siteConfig";

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap">
        <Folio n="00" label={siteConfig.tagline} direction="ईशान्य · NE" quality="clarity" />

        <div className="hero__grid">
          <div>
            <h1>Your team is still typing invoices by hand.</h1>
            <p className="lede">
              We find the repetitive work eating your staff&apos;s hours — invoice entry,
              quotations, weekly reports, after-hours enquiries — and replace it with software
              built around whatever you already run. Two to four weeks. One fixed price, agreed
              in writing before anyone starts.
            </p>

            <div className="anchor" data-reveal>
              <span>
                Typical manual waste <b>₹3–6 lakh a year</b>
              </span>
              <span className="is-pay">
                Typical build pays for itself <b>in under 4 months</b>
              </span>
            </div>

            <div className="hero__ctas">
              <Cta glint>Book my free 20-minute call</Cta>
              <a className="btn-ghost" href="#hours">
                Count my hours first
              </a>
            </div>
            <p className="reassure">
              {reassurance} And we&apos;ll leave you alone if it won&apos;t.
            </p>

            <div className="hero__trust" data-reveal>
              <Stamp>NDA first</Stamp>
              <Stamp>Fixed price</Stamp>
              <Stamp>No lock-in</Stamp>
              <p>Works with Tally, Zoho, SAP, Excel, WhatsApp — or whatever you run.</p>
            </div>
          </div>

          {/* One vendor invoice, and the Tally voucher it becomes. */}
          <div
            className="ruled voucher"
            data-reveal
            aria-label="Example: a vendor invoice staged as a Tally purchase voucher"
            role="img"
          >
            <div className="voucher__head">
              <span>Vendor mail · attachment.pdf</span>
              <span>Read</span>
            </div>
            <div className="voucher__body">
              <div className="v-row">
                <span className="v-row__l">Shree Metals Pvt Ltd</span>
                <span className="v-row__r">Inv SM/2114</span>
              </div>
              <div className="v-row">
                <span className="v-row__l">Against purchase order</span>
                <span className="v-row__r">PO 4471 ✓ matched</span>
              </div>
              <div className="v-row v-row--strong">
                <span className="v-row__l">Invoice total</span>
                <span className="v-row__r">₹ 4,18,600.00</span>
              </div>
              <div className="v-sep">
                <span>— staged in Tally as purchase voucher —</span>
              </div>
              <div className="v-row">
                <span className="v-row__l">Purchase A/c</span>
                <span className="v-row__r">Dr 4,18,600.00</span>
              </div>
              <div className="v-row">
                <span className="v-row__l">Shree Metals Pvt Ltd</span>
                <span className="v-row__r is-credit">Cr 4,18,600.00</span>
              </div>
              <span className="voucher__stamp">
                <Stamp strike="scroll">Staged</Stamp>
              </span>
            </div>
            <div className="voucher__foot">
              <span>Waiting on one approval click. Nothing posts unseen.</span>
              <span className="voucher__ok">HUMAN APPROVES</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

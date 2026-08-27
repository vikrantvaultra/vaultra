import Image from "next/image";
import { BookCallButton } from "@/components/BookCallButton";
import { reassurance } from "@/lib/siteConfig";
import heroOffice from "@/public/images/hero-office.jpg";

export function Hero() {
  return (
    <section id="top" className="hero">
      <div className="shell">
        <div className="hero__head">
          <p className="hero__eyebrow">Automation consultancy · Mumbai</p>
          <h1 className="hero__title">
            Your team is still typing invoices by hand.
          </h1>
        </div>

        <div className="hero__row">
          <p className="hero__copy">
            We find the repetitive work eating your staff&rsquo;s hours &mdash;
            invoice entry, quotations, weekly reports, after-hours enquiries
            &mdash; and replace it with software. Two to four weeks. A fixed
            price agreed before anyone starts.
          </p>
          <div className="hero__cta">
            <BookCallButton variant="hero" />
            <p className="note">{reassurance}</p>
          </div>
        </div>

        <Image
          className="photo hero__photo"
          src={heroOffice}
          alt="A quiet mid-market office in Mumbai: rows of desks, a bundle of tied paper files and an open laptop on the front table"
          sizes="(max-width: 1080px) 100vw, 1080px"
          priority
        />
      </div>
    </section>
  );
}

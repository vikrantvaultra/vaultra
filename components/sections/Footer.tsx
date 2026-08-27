import { Cta } from "@/components/Cta";
import { Logo } from "@/components/Logo";
import { siteConfig } from "@/lib/siteConfig";

export function Footer() {
  return (
    <footer className="dark footer">
      <div className="shell">
        <div className="footer__top">
          <div className="footer__logo">
            <Logo size={30} fill="#3fa39a" />
            <span className="footer__wordmark">{siteConfig.name}</span>
          </div>
          <Cta size="sm" onDark>
            Book a 20-minute call
          </Cta>
        </div>
        <div className="footer__bottom">
          <p>
            We replace the repetitive work in mid-market Indian businesses with software.
          </p>
          <p className="footer__place">{siteConfig.city}, India</p>
        </div>
        {/* Clearance for the mobile bar. */}
        <div className="footer__spacer" aria-hidden="true" />
      </div>
    </footer>
  );
}

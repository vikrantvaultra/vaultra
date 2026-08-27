import { Logo } from "@/components/Logo";
import { siteConfig } from "@/lib/siteConfig";
import { whatsappHref } from "@/lib/siteConfig";

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <a className="brand" href="#top">
          <Logo size={20} />
          {siteConfig.name}
        </a>
        <span>
          Automation for mid-market operations · {siteConfig.city}, India ·{" "}
          <a href={whatsappHref}>WhatsApp</a>
        </span>
        <span>© {new Date().getFullYear()} {siteConfig.name}</span>
      </div>
    </footer>
  );
}

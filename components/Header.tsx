import { Cta } from "@/components/Cta";
import { Logo } from "@/components/Logo";
import { siteConfig } from "@/lib/siteConfig";

export function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <a href="#top" className="header__logo">
          <Logo />
          {siteConfig.name}
        </a>
        <div className="header__right">
          <span className="header__place">{siteConfig.city}</span>
          <Cta size="xs">Book a 20-minute call</Cta>
        </div>
      </div>
    </header>
  );
}

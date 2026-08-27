import { Cta } from "@/components/Cta";
import { Logo } from "@/components/Logo";
import { MobileMenu } from "@/components/MobileMenu";

const links = [
  { href: "#solutions", label: "Solutions" },
  { href: "#calculator", label: "ROI calculator" },
  { href: "#proof", label: "Case studies" },
  { href: "#about", label: "About" },
  { href: "tel:+919876543210", label: "Call us ↗" },
];

export function Header() {
  return (
    <header className="header">
      <div className="wrap header__inner">
        <a className="brand" href="#top" aria-label="Vaultra home">
          <Logo />
          vaultra
        </a>
        <nav className="header__nav" aria-label="Sections">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="header__cta">
          <Cta href="#calculator" size="sm">
            Audit my workflows
          </Cta>
        </div>
        <MobileMenu links={links} />
      </div>
    </header>
  );
}

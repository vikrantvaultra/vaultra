import { Cta } from "@/components/Cta";
import { Logo } from "@/components/Logo";
import { Slots } from "@/components/Slots";
import { siteConfig } from "@/lib/siteConfig";

const links = [
  { href: "#hours", label: "The cost" },
  { href: "#build", label: "What we build" },
  { href: "#proof", label: "Proof" },
  { href: "#process", label: "How it works" },
  { href: "#answers", label: "Answers" },
];

export function Header() {
  return (
    <header className="header">
      <div className="wrap header__inner">
        <a className="brand" href="#top" aria-label={`${siteConfig.name} — home`}>
          <Logo />
          {siteConfig.name}
        </a>
        <nav className="header__nav" aria-label="Sections">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="header__right">
          <Slots compact />
          <Cta size="sm">Book my free call</Cta>
        </div>
      </div>
    </header>
  );
}

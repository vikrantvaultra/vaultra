"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import { BookCallButton } from "./BookCallButton";
import { useBooking } from "./BookingProvider";
import { reassurance } from "@/lib/siteConfig";

const links = [
  { href: "#problem", label: "The problem" },
  { href: "#build", label: "What we build" },
  { href: "#process", label: "How we work" },
  { href: "#answers", label: "Answers" },
];

export function Header() {
  const { menuOpen, toggleMenu, closeMenu } = useBooking();

  return (
    <>
      <header className="header">
        <div className="header__inner">
          <a className="wordmark" href="#top">
            <Logo size={26} />
            <span className="wordmark__text">Vaultra</span>
          </a>

          <nav className="nav">
            {links.map((link) => (
              <Link key={link.href} className="nav__link" href={link.href}>
                {link.label}
              </Link>
            ))}
            <BookCallButton variant="nav" />
          </nav>

          <button
            type="button"
            className="hamburger"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={toggleMenu}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      {menuOpen ? (
        <div className="menu" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="menu__bar">
            <span className="menu__brand">
              <Logo size={24} />
              <span className="menu__brand-text">Vaultra</span>
            </span>
            <button
              type="button"
              className="menu__close"
              aria-label="Close menu"
              onClick={closeMenu}
            >
              CLOSE
            </button>
          </div>

          <nav className="menu__nav">
            {[...links, { href: "#contact", label: "Contact" }].map((link) => (
              <a
                key={link.href}
                className="menu__link"
                href={link.href}
                onClick={closeMenu}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="menu__foot">
            <BookCallButton variant="menu" />
            <p className="note">{reassurance}</p>
          </div>
        </div>
      ) : null}
    </>
  );
}

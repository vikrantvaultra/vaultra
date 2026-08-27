"use client";

import { useState } from "react";

/** The hamburger and its dropdown panel, on screens too narrow for the nav. */
export function MobileMenu({ links }: { links: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="menu-btn"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
      <div id="mobile-menu" className={`mobilemenu${open ? " is-open" : ""}`}>
        <nav aria-label="Sections">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>
        <a href="#calculator" className="btn" onClick={() => setOpen(false)}>
          <span>Audit my workflows</span>
          <span className="btn__arrow" aria-hidden="true">
            ↗
          </span>
        </a>
      </div>
    </>
  );
}

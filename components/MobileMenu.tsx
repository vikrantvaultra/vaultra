"use client";

import { useState } from "react";
import { AuditTrigger } from "@/components/AuditModal";

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
        <div onClick={() => setOpen(false)}>
          <AuditTrigger label="Book free audit" />
        </div>
      </div>
    </>
  );
}

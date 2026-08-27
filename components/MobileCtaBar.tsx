"use client";

import { useEffect, useState } from "react";
import { BookCallButton } from "./BookCallButton";
import { useBooking } from "./BookingProvider";
import { reassurance, siteConfig } from "@/lib/siteConfig";

/**
 * Sticky call to action for phones — but only while the visitor has no other
 * way to book in front of them. Any `[data-cta]` on screen (the hero button,
 * the two section buttons, the contact form's own submit) stands the bar down,
 * so the same button is never shown twice at once.
 */
function useNoCtaOnScreen() {
  const [clear, setClear] = useState(false);

  useEffect(() => {
    const targets = document.querySelectorAll("[data-cta]");
    if (!targets.length || !("IntersectionObserver" in window)) {
      setClear(true);
      return;
    }

    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        });
        setClear(visible.size === 0);
      },
      // Ignore a CTA that is only just clipping the edge of the screen.
      { threshold: 0.35 },
    );

    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return clear;
}

export function MobileCtaBar() {
  const { menuOpen } = useBooking();
  const noCtaOnScreen = useNoCtaOnScreen();

  if (!siteConfig.mobileCtaBar || menuOpen || !noCtaOnScreen) return null;

  return (
    <>
      <div className="mobile-bar-spacer" aria-hidden="true" />
      <div className="mobile-bar">
        <BookCallButton variant="bar" />
        <p className="note">{reassurance}</p>
      </div>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Cta } from "@/components/Cta";
import { whatsappHref } from "@/lib/siteConfig";

/**
 * Two bars, one per form factor — which one shows is decided in CSS, at 768px,
 * so neither can flash on first paint.
 *
 * The desktop bar appears once the visitor is a screen or so down the page,
 * hides again inside the booking section (the same call to action is already
 * there), and stays hidden for the rest of the visit once dismissed.
 */
export function StickyBars() {
  const [scrolled, setScrolled] = useState(false);
  const [inBooking, setInBooking] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const book = document.getElementById("book");
    let io: IntersectionObserver | undefined;
    if (book && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        ([entry]) => setInBooking(entry.isIntersecting || entry.boundingClientRect.top < 0),
        { threshold: 0.08 },
      );
      io.observe(book);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, []);

  const showDesktopBar = scrolled && !inBooking && !dismissed;

  return (
    <>
      {showDesktopBar ? (
        <div className="deskbar">
          <div className="deskbar__inner">
            <p>Fixed price in writing within two working days. No pitch on the call.</p>
            <div className="deskbar__right">
              <Cta size="bar">Book a 20-minute call</Cta>
              <button
                type="button"
                className="deskbar__dismiss"
                aria-label="Dismiss"
                onClick={() => setDismissed(true)}
              >
                ×
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mobilebar">
        <a href="#book" className="mobilebar__book">
          Book 20 min
        </a>
        <a href={whatsappHref} className="mobilebar__wa" aria-label="Message us on WhatsApp">
          WA
        </a>
      </div>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";

/**
 * The ask, kept within reach once the hero has gone by — and taken away
 * again inside the booking section, where the same ask already is.
 *
 * On phones it becomes the full-width bar at the foot of the screen; that is
 * decided in CSS at 640px, so it cannot flash the wrong shape on first paint.
 */
export function FloatCta() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const book = document.getElementById("book");

    const update = () => {
      const past = window.scrollY > window.innerHeight * 0.85;
      const rect = book?.getBoundingClientRect();
      const atForm = rect ? rect.top < window.innerHeight * 0.7 : false;
      setShown(past && !atForm);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className={`float-cta${shown ? " is-shown" : ""}`} aria-hidden={!shown}>
      <a href="#book" className="btn" tabIndex={shown ? 0 : -1}>
        <span>Book my free call</span>
        <span className="btn__arrow" aria-hidden="true">
          →
        </span>
      </a>
    </div>
  );
}

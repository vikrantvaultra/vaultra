"use client";

import { useBooking } from "./BookingProvider";

export function BookCallButton({
  variant,
  label = "Book a 20-minute call",
}: {
  variant: "nav" | "hero" | "section" | "menu" | "bar";
  label?: string;
}) {
  const { openBooking } = useBooking();

  return (
    <button
      type="button"
      className={`btn btn--${variant}`}
      // The sticky mobile bar stands down while one of these is on screen,
      // so two identical calls to action are never visible at once.
      data-cta={variant === "hero" || variant === "section" ? "" : undefined}
      onClick={openBooking}
    >
      {label}
    </button>
  );
}

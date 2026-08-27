"use client";

import { useEffect, useRef } from "react";
import { useBooking } from "./BookingProvider";
import { LeadForm } from "./LeadForm";

export function BookingModal() {
  const { open, booked, closeBooking, markBooked } = useBooking();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-title"
      onClick={closeBooking}
    >
      <div
        className="modal__panel"
        ref={panelRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__head">
          <div>
            <p className="modal__eyebrow">20 minutes, free</p>
            <h2 className="modal__title" id="book-title">
              Book a 20-minute call
            </h2>
          </div>
          <button
            type="button"
            className="modal__close"
            aria-label="Close"
            onClick={closeBooking}
          >
            CLOSE
          </button>
        </div>

        {booked ? (
          <div className="modal__done">
            <div className="modal__rule" />
            <span className="done__mark" aria-hidden="true" />
            <h3 className="modal__done-title">Request received.</h3>
            <p className="modal__done-body">
              We reply within one working day and propose two slots. Nothing is
              sent between now and then.
            </p>
            <button
              type="button"
              className="btn modal__back"
              onClick={closeBooking}
            >
              Back to the page
            </button>
          </div>
        ) : (
          <LeadForm
            idPrefix="b"
            variant="modal"
            source="Booking dialog"
            onSuccess={markBooked}
          />
        )}
      </div>
    </div>
  );
}

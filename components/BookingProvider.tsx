"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { siteConfig } from "@/lib/siteConfig";

type BookingContextValue = {
  open: boolean;
  booked: boolean;
  menuOpen: boolean;
  openBooking: () => void;
  closeBooking: () => void;
  markBooked: () => void;
  toggleMenu: () => void;
  closeMenu: () => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [booked, setBooked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((v) => !v), []);
  const closeBooking = useCallback(() => setOpen(false), []);
  const markBooked = useCallback(() => setBooked(true), []);

  const openBooking = useCallback(() => {
    setMenuOpen(false);

    if (siteConfig.bookingCta === "contact") {
      const el = document.getElementById("contact");
      if (el) {
        window.scrollTo({
          top: el.getBoundingClientRect().top + window.scrollY - 68,
          behavior: "smooth",
        });
      }
      return;
    }

    setBooked(false);
    setOpen(true);
  }, []);

  // Escape closes whichever overlay is up.
  useEffect(() => {
    if (!open && !menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, menuOpen]);

  // Freeze the page behind an overlay.
  useEffect(() => {
    document.body.classList.toggle("is-locked", open || menuOpen);
    return () => document.body.classList.remove("is-locked");
  }, [open, menuOpen]);

  const value = useMemo(
    () => ({
      open,
      booked,
      menuOpen,
      openBooking,
      closeBooking,
      markBooked,
      toggleMenu,
      closeMenu,
    }),
    [
      open,
      booked,
      menuOpen,
      openBooking,
      closeBooking,
      markBooked,
      toggleMenu,
      closeMenu,
    ],
  );

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}

"use client";

import { useEffect } from "react";

/**
 * Fade-and-rise on scroll for anything carrying `data-reveal="<delay-ms>"`.
 *
 * Nothing is hidden until an IntersectionObserver probe proves callbacks
 * actually fire, and a scroll sweeper clears anything left hidden on screen.
 * Elements already in view at mount are never hidden, so the first paint of
 * the server-rendered page is what the visitor sees.
 */
export function Reveal() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let io: IntersectionObserver | null = null;
    let broken = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const show = (el: Element) => {
      const node = el as HTMLElement;
      delete node.dataset.revealHidden;
      node.style.willChange = "auto";
      io?.unobserve(node);
    };

    const sweep = () => {
      const pending = document.querySelectorAll("[data-reveal-hidden]");
      pending.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.94) show(el);
      });
      if (!pending.length) {
        window.removeEventListener("scroll", sweep);
        window.removeEventListener("resize", sweep);
      }
    };

    const clearAll = () => {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        delete el.dataset.revealHidden;
        el.style.transitionDelay = "";
        el.style.willChange = "";
      });
    };

    const arm = () => {
      if (broken) return;

      io ??= new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) show(en.target);
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.06 },
      );

      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        if (el.dataset.revealArmed) return;
        el.dataset.revealArmed = "1";
        el.style.transitionDelay = `${Number(el.dataset.reveal) || 0}ms`;

        if (el.getBoundingClientRect().top > window.innerHeight * 0.94) {
          el.dataset.revealHidden = "1";
          el.style.willChange = "opacity, transform";
        }
        io!.observe(el);
      });

      window.addEventListener("scroll", sweep, { passive: true });
      window.addEventListener("resize", sweep, { passive: true });
      timers.push(setTimeout(sweep, 900), setTimeout(sweep, 1400));
    };

    // Probe: some embedding contexts never fire IO callbacks. Only start
    // hiding things once we have seen one land.
    let probeFired = false;
    const probeTarget = document.querySelector("header") || document.body;
    const probe = new IntersectionObserver(() => {
      probeFired = true;
      probe.disconnect();
      arm();
    });
    probe.observe(probeTarget);

    timers.push(
      setTimeout(() => {
        if (probeFired) return;
        probe.disconnect();
        broken = true;
        clearAll();
      }, 450),
    );

    return () => {
      probe.disconnect();
      io?.disconnect();
      window.removeEventListener("scroll", sweep);
      window.removeEventListener("resize", sweep);
      timers.forEach(clearTimeout);
    };
  }, []);

  return null;
}

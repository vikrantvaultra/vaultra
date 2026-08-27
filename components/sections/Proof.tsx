"use client";

import { useState } from "react";
import { Eyebrow } from "@/components/Eyebrow";

const slides = [
  {
    quote: "We got back two full days every week. The ROI was obvious within the first month.",
    initials: "AM",
    bg: "#bd9a6f",
    name: "Aarav Mehta",
    role: "COO, Orbit Commerce",
  },
  {
    quote: "Vaultra understood our messy operations and made them feel beautifully simple.",
    initials: "MS",
    bg: "#273f51",
    name: "Maya Shah",
    role: "Founder, Northstar Realty",
  },
  {
    quote: "No more chasing updates. Our workflows now move faster than our team can.",
    initials: "RK",
    bg: "#6f967c",
    name: "Rhea Kapoor",
    role: "Head of Ops, Tandem Finance",
  },
];

export function Proof() {
  const [active, setActive] = useState(0);
  const slide = slides[active];
  const step = (delta: number) =>
    setActive((i) => (i + delta + slides.length) % slides.length);

  return (
    <section className="section section--band" id="proof">
      <div className="wrap">
        <div className="proof__head">
          <div>
            <Eyebrow>Real people. Real operating leverage.</Eyebrow>
            <h2 data-reveal>
              <span className="line">They got their</span>
              <span className="line line--sage">time back.</span>
            </h2>
          </div>
          <p className="stars" data-reveal>
            <span aria-hidden="true">★★★★★</span> 5.0 average rating
          </p>
        </div>

        <div className="proof__grid" data-reveal>
          <figure className="tcard" aria-live="polite">
            <span className="tcard__mark" aria-hidden="true">
              &ldquo;
            </span>
            <blockquote>
              <p>&ldquo;{slide.quote}&rdquo;</p>
            </blockquote>
            <figcaption className="tcard__foot">
              <span className="tcard__by">
                <span
                  className="face face--lg"
                  style={{ background: slide.bg }}
                  aria-hidden="true"
                >
                  {slide.initials}
                </span>
                <span>
                  <b>{slide.name}</b>
                  <span className="tcard__role">
                    {slide.role} <i>✓ verified</i>
                  </span>
                </span>
              </span>

              <span className="tctrl">
                <button
                  type="button"
                  aria-label="Previous testimonial"
                  onClick={() => step(-1)}
                >
                  ←
                </button>
                <span className="tdots" role="tablist" aria-label="Testimonials">
                  {slides.map((s, i) => (
                    <button
                      key={s.name}
                      type="button"
                      role="tab"
                      aria-selected={active === i}
                      aria-label={`Testimonial ${i + 1}: ${s.name}`}
                      className={active === i ? "is-active" : ""}
                      onClick={() => setActive(i)}
                    />
                  ))}
                </span>
                <button
                  type="button"
                  aria-label="Next testimonial"
                  onClick={() => step(1)}
                >
                  →
                </button>
              </span>
            </figcaption>
          </figure>

          <div className="proof__stat on-dark">
            <span className="proof__mark" aria-hidden="true">
              &ldquo;
            </span>
            <span className="proof__n">+42%</span>
            <p>average operating margin improvement across our first 90 days together.</p>
            <p className="proof__statfoot">Sample figure · measured over 90 days</p>
          </div>
        </div>
      </div>
    </section>
  );
}

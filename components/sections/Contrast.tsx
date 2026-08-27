"use client";

import { useRef, useState } from "react";
import { Eyebrow } from "@/components/Eyebrow";

const without = [
  "Slow handoffs & scattered tools",
  "Expensive, error-prone payroll",
  "Work stops when people do",
];

const withUs = [
  "Instant execution, every time",
  "Clean data, zero rework",
  "24/7 operational reliability",
];

const MIN = 20;
const MAX = 80;

export function Contrast() {
  /** The mint rule is draggable: it sets how much of the row each panel gets. */
  const [split, setSplit] = useState(50);
  const wrapRef = useRef<HTMLDivElement>(null);

  const setFromX = (clientX: number) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setSplit(Math.min(MAX, Math.max(MIN, Math.round(pct))));
  };

  const onPointerDown = (event: React.PointerEvent) => {
    event.preventDefault();
    setFromX(event.clientX);
    const move = (e: PointerEvent) => setFromX(e.clientX);
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") setSplit((v) => Math.max(MIN, v - 2));
    if (event.key === "ArrowRight") setSplit((v) => Math.min(MAX, v + 2));
  };

  return (
    <section className="section" id="difference">
      <div className="wrap">
        <div className="contrast__head">
          <div>
            <Eyebrow>The Vaultra difference</Eyebrow>
            <h2 data-reveal>
              <span className="line">Same team.</span>
              <span className="line line--sage">More output.</span>
            </h2>
          </div>
          <p data-reveal>
            Your best people shouldn&rsquo;t be spending their sharpest hours moving data
            between tabs.
          </p>
        </div>

        <div
          className="vs"
          data-reveal
          ref={wrapRef}
          style={{ gridTemplateColumns: `${split}fr 36px ${100 - split}fr` }}
        >
          <div className="vs__panel vs__panel--without">
            <span className="vs__label">Without Vaultra</span>
            <h3>Manual operations</h3>
            <ul>
              {without.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
          <div
            className="vs__gutter"
            role="slider"
            tabIndex={0}
            aria-label="Drag to compare manual and automated operations"
            aria-valuemin={MIN}
            aria-valuemax={MAX}
            aria-valuenow={split}
            onPointerDown={onPointerDown}
            onKeyDown={onKeyDown}
          >
            <span className="vs__rule" aria-hidden="true" />
          </div>
          <div className="vs__panel vs__panel--with on-dark">
            <span className="vs__label">With Vaultra</span>
            <h3>Automated systems</h3>
            <ul>
              {withUs.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

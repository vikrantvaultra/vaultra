"use client";

import { useState } from "react";
import { Eyebrow } from "@/components/Eyebrow";

/** ~9.5 hours returned per person per month, per the reference's own maths. */
const HOURS_PER_PERSON = 9.5;

/** Static silhouette behind the number, as in the reference. */
const BARS = [34, 52, 44, 72, 58, 54, 88];

function usd(n: number) {
  return "$" + Math.round(n).toLocaleString("en-US");
}

function Slider({
  id,
  label,
  min,
  max,
  value,
  display,
  onChange,
}: {
  id: string;
  label: string;
  min: number;
  max: number;
  value: number;
  display: string;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="slider">
      <div className="slider__row">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id}>{display}</output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(parseInt(event.target.value, 10))}
        style={{
          background: `linear-gradient(to right, var(--mint) ${pct}%, rgba(255,255,255,0.18) ${pct}%)`,
        }}
      />
    </div>
  );
}

export function Roi() {
  const [team, setTeam] = useState(24);
  const [rate, setRate] = useState(22);

  const hours = Math.round(team * HOURS_PER_PERSON);
  const monthly = hours * rate;

  return (
    <section className="section section--forest on-dark" id="calculator">
      <div className="wrap roi__grid">
        <div>
          <Eyebrow light>The ROI, in plain numbers</Eyebrow>
          <h2 data-reveal>
            <span className="roi__mint">What could you do with</span>{" "}
            <span className="roi__white">more time?</span>
          </h2>
          <p className="roi__lede" data-reveal>
            Move the sliders. Get a directional estimate of what automation could return to
            your business every month.
          </p>

          <div data-reveal>
            <Slider
              id="team"
              label="Team size"
              min={1}
              max={100}
              value={team}
              display={`${team} people`}
              onChange={setTeam}
            />
            <Slider
              id="rate"
              label="Average hourly rate"
              min={10}
              max={100}
              value={rate}
              display={`$${rate}/hr`}
              onChange={setRate}
            />
          </div>
        </div>

        <div className="roi__out" data-reveal aria-live="polite">
          <p className="roi__k">
            <span className="live-dot" aria-hidden="true" />
            Estimated monthly impact
          </p>
          <div className="big-num">{usd(monthly)}</div>
          <p className="roi__sub">potential savings per month</p>

          <div className="bars" aria-hidden="true">
            {BARS.map((h, i) => (
              <span key={i} style={{ height: `${h}%` }} />
            ))}
          </div>

          <div className="roi__foot">
            <span>{hours.toLocaleString("en-US")} hours returned</span>
            <span>
              12-month upside <b>{usd(monthly * 12)}</b>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { AuditTrigger } from "@/components/AuditModal";
import { Eyebrow } from "@/components/Eyebrow";

/** ~9.5 hours returned per person per month — the same maths as the cards. */
const HOURS_PER_PERSON = 9.5;

const MONTHS = 12;

/** Rupees at the scale an Indian reader expects: thousands, lakh, crore. */
function inr(n: number) {
  if (n >= 1e7) return "₹" + (n / 1e7).toFixed(n < 5e7 ? 1 : 0).replace(/\.0$/, "") + " crore";
  if (n >= 1e5) return "₹" + (n / 1e5).toFixed(n < 1e6 ? 1 : 0).replace(/\.0$/, "") + " lakh";
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

function Slider({
  id,
  label,
  min,
  max,
  step,
  value,
  display,
  minLabel,
  maxLabel,
  onChange,
}: {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  display: string;
  minLabel: string;
  maxLabel: string;
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
        step={step}
        value={value}
        onChange={(event) => onChange(parseInt(event.target.value, 10))}
        style={{
          background: `linear-gradient(to right, var(--mint) ${pct}%, rgba(255,255,255,0.18) ${pct}%)`,
        }}
      />
      <div className="slider__bounds" aria-hidden="true">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}

export function Roi() {
  const [team, setTeam] = useState(24);
  const [rate, setRate] = useState(350);

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
              step={1}
              value={team}
              display={`${team} ${team === 1 ? "person" : "people"}`}
              minLabel="1"
              maxLabel="100 people"
              onChange={setTeam}
            />
            <Slider
              id="rate"
              label="Average cost per hour"
              min={100}
              max={1000}
              step={25}
              value={rate}
              display={`₹${rate}/hr`}
              minLabel="₹100"
              maxLabel="₹1,000"
              onChange={setRate}
            />
            <p className="roi__basis">
              Assumes ~{HOURS_PER_PERSON} hours of repetitive work automated per person, per
              month
            </p>
          </div>
        </div>

        <div className="roi__out" data-reveal>
          <div aria-live="polite">
            <p className="roi__k">
              <span className="live-dot" aria-hidden="true" />
              Estimated monthly impact
            </p>
            <div className="big-num">{inr(monthly)}</div>
            <p className="roi__sub">potential savings per month</p>

            <div
              className="bars"
              role="img"
              aria-label={`Cumulative savings grow to ${inr(monthly * MONTHS)} over twelve months`}
            >
              {Array.from({ length: MONTHS }, (_, i) => (
                <span key={i} style={{ height: `${((i + 1) / MONTHS) * 100}%` }} />
              ))}
            </div>
            <p className="bars__caption" aria-hidden="true">
              Cumulative savings, month 1 → 12
            </p>

            <div className="roi__foot">
              <span>
                {hours.toLocaleString("en-IN")} hours returned <b>every month</b>
              </span>
              <span>
                12-month upside <b>{inr(monthly * MONTHS)}</b>
              </span>
            </div>
          </div>

          <AuditTrigger label="Get my exact number" block />
          <p className="roi__note">
            Directional estimate · one number in writing after the audit
          </p>
        </div>
      </div>
    </section>
  );
}

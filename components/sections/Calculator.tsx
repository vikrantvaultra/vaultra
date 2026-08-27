"use client";

import Image from "next/image";
import { useState } from "react";
import { Cta } from "@/components/Cta";

/** Hours a week, per person, for each task — the figures quoted in the rows. */
const TASKS = [
  { label: "Typing vendor invoices into Tally", hours: 15, aria: "People typing vendor invoices" },
  { label: "Making quotations by hand", hours: 5, aria: "People making quotations" },
  { label: "Assembling the MIS report", hours: 4, aria: "People assembling the MIS report" },
  { label: "Checking tender portals", hours: 4, aria: "People checking tender portals" },
];

/** Rupees, at the scale an Indian reader expects: thousands, lakh, crore. */
function money(n: number) {
  if (n >= 10000000) return "₹" + (n / 10000000).toFixed(2).replace(/\.00$/, "") + " cr";
  if (n >= 100000) return "₹" + (n / 100000).toFixed(1).replace(/\.0$/, "") + " lakh";
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

const clamp = (value: string, min: number, max: number) =>
  Math.max(min, Math.min(max, parseInt(value, 10) || 0));

export function Calculator() {
  const [on, setOn] = useState([true, true, false, false]);
  const [people, setPeople] = useState([2, 1, 1, 1]);
  const [rate, setRate] = useState(400);

  let weekly = 0;
  let heads = 0;
  let picked = 0;
  TASKS.forEach((task, i) => {
    if (on[i]) {
      weekly += task.hours * people[i];
      heads += people[i];
      picked += 1;
    }
  });

  const hoursMonth = Math.round(weekly * 4.33);
  const annual = hoursMonth * 12 * rate;

  const headcountLine =
    picked === 0
      ? "Nothing ticked yet."
      : `${heads} ${heads === 1 ? "person" : "people"} across ${picked} ${
          picked === 1 ? "task" : "tasks"
        }, at ${Math.round(weekly).toLocaleString("en-IN")} hrs a week.`;

  const sentence =
    picked === 0
      ? "Tick a task to see the number."
      : `That's roughly ${money(annual)} a year spent retyping things that already exist.`;

  const toggle = (i: number) =>
    setOn((prev) => prev.map((value, index) => (index === i ? !value : value)));

  const setCount = (i: number, value: string) =>
    setPeople((prev) => prev.map((n, index) => (index === i ? clamp(value, 0, 50) : n)));

  return (
    <section className="dark calc">
      <div className="shell">
        <p className="eyebrow" data-reveal>
          <span>01</span>
          <span>The cost of doing nothing</span>
        </p>
        <h2 className="h2" data-reveal>
          Do the arithmetic on your own week.
        </h2>

        <figure className="figure calc__figure" data-reveal>
          <Image
            src="/images/invoice-row.jpg"
            alt="A long row of identical printed invoices spread edge to edge across a dark green surface"
            width={1600}
            height={686}
            sizes="(max-width: 1180px) 100vw, 1132px"
            priority={false}
          />
        </figure>

        <div className="calc__grid">
          <div data-reveal>
            <p className="calc__hint">Tick what applies · set how many people</p>
            <div className="calc__tasks">
              {TASKS.map((task, i) => (
                <label className="calc__task" key={task.label}>
                  <input type="checkbox" checked={on[i]} onChange={() => toggle(i)} />
                  <span className="calc__task-text">
                    {task.label}
                    <span className="calc__task-hours">{task.hours} HRS / WEEK / PERSON</span>
                  </span>
                  <input
                    type="number"
                    className="calc__count"
                    min={0}
                    max={50}
                    value={people[i]}
                    onChange={(e) => setCount(i, e.target.value)}
                    aria-label={task.aria}
                  />
                </label>
              ))}
            </div>

            <label className="calc__rate">
              Assumed cost per hour
              <span className="calc__rate-field">
                ₹
                <input
                  type="number"
                  min={50}
                  max={5000}
                  step={25}
                  value={rate}
                  onChange={(e) => setRate(clamp(e.target.value, 0, 5000))}
                  aria-label="Assumed cost per hour in rupees"
                />
              </span>
            </label>
          </div>

          <div className="calc__panel" data-reveal>
            <span className="calc__panel-label">Hours lost per month</span>
            <div className="calc__hours" aria-live="polite">
              {hoursMonth.toLocaleString("en-IN")}
            </div>
            <div className="calc__heads">{headcountLine}</div>
            <span className="calc__panel-label calc__panel-label--spaced">
              Annualised salary cost
            </span>
            <div className="calc__annual">{money(annual)}</div>
            <p className="calc__sentence">{sentence}</p>
            <p className="calc__aside">
              Plus the 13 hours a day when nobody answers a WhatsApp enquiry.
            </p>
            <Cta size="md" onDark>
              Get this quoted in 20 minutes
            </Cta>
          </div>
        </div>
      </div>
    </section>
  );
}

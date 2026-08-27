"use client";

import { useState } from "react";
import { Cta } from "@/components/Cta";
import { Folio } from "@/components/Folio";
import { Plate } from "@/components/Plate";
import { siteConfig } from "@/lib/siteConfig";

/** The work people describe on the call, and the hours a week each one eats. */
const TASKS = [
  { label: "Typing vendor invoices into Tally", hours: 15 },
  { label: "Making quotations by hand", hours: 5 },
  { label: "Assembling the MIS report", hours: 4 },
  { label: "Checking tender portals", hours: 4 },
];

const PAINS = [
  {
    text: "Your accounts person spends the first three hours of every day typing vendor invoices into Tally.",
    hrs: "15 HRS / WEEK RETYPING",
  },
  {
    text: "A quotation takes forty minutes to put together, and your sales team sends eight a week.",
    hrs: "5 HRS / WEEK REBUILDING",
  },
  {
    text: "Monday's MIS report is stitched together from five spreadsheets before anyone can look at it.",
    hrs: "½ DAY / WEEK ASSEMBLING",
  },
  {
    text: "An enquiry lands on your sales WhatsApp at 9:40 pm and gets a reply at 11 am the next day.",
    hrs: "13 HRS OF SILENCE",
  },
];

/** Rupees at the scale an Indian reader expects: thousands, lakh, crore. */
function inr(n: number) {
  if (n >= 1e7) return "₹" + (n / 1e7).toFixed(n < 5e7 ? 1 : 0).replace(/\.0$/, "") + " crore";
  if (n >= 1e5) return "₹" + (n / 1e5).toFixed(n < 1e6 ? 1 : 0).replace(/\.0$/, "") + " lakh";
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

export function Hours() {
  const [on, setOn] = useState([true, true, false, false]);
  const [people, setPeople] = useState([1, 1, 1, 1]);
  const [rate, setRate] = useState("350");

  let weekly = 0;
  let heads = 0;
  let any = false;
  TASKS.forEach((task, i) => {
    if (on[i]) {
      any = true;
      weekly += task.hours * people[i];
      heads += people[i];
    }
  });

  const perHour = Math.max(0, parseInt(rate.replace(/[^\d]/g, ""), 10) || 0);
  const monthly = Math.round((weekly * 52) / 12);
  const annual = weekly * 52 * perHour;
  const counted = any && perHour > 0 && annual > 0;
  const months = counted
    ? Math.max(1, Math.ceil(siteConfig.assumedBuildCost / (annual / 12)))
    : 0;

  const toggle = (i: number) =>
    setOn((prev) => prev.map((value, index) => (index === i ? !value : value)));

  /**
   * Nudging the count up on an unticked task ticks it — otherwise the number
   * moves and nothing else does, which reads as broken.
   */
  const step = (i: number, delta: number) => {
    setPeople((prev) =>
      prev.map((n, index) => (index === i ? Math.min(20, Math.max(1, n + delta)) : n)),
    );
    if (delta > 0) setOn((prev) => prev.map((v, index) => (index === i ? true : v)));
  };

  return (
    <section className="section" id="hours">
      <div className="wrap">
        <Folio
          n="01"
          label="The cost of doing nothing"
          direction="N"
          quality="wealth"
        />
        <h2 data-reveal>You already know which work this is.</h2>
        <p className="lede" data-reveal>
          None of it needs a bigger team. It needs the work to stop being manual.
        </p>

        <div className="pains" data-reveal>
          {PAINS.map((pain) => (
            <div className="pain" key={pain.hrs}>
              <p>{pain.text}</p>
              <span className="pain__hrs">{pain.hrs}</span>
            </div>
          ))}
        </div>

        <div className="calc" data-reveal>
          <div className="calc__in">
            <p className="calc__title">Do the arithmetic on your own week · tick what applies</p>

            {TASKS.map((task, i) => (
              <div className="task" key={task.label}>
                <label>
                  <input type="checkbox" checked={on[i]} onChange={() => toggle(i)} />
                  {task.label}
                </label>
                <span className="task__rate">{task.hours} h/wk ×</span>
                <span className="ppl">
                  <button
                    type="button"
                    onClick={() => step(i, -1)}
                    aria-label={`Fewer people, ${task.label}`}
                  >
                    −
                  </button>
                  <output>{people[i]}</output>
                  <button
                    type="button"
                    onClick={() => step(i, 1)}
                    aria-label={`More people, ${task.label}`}
                  >
                    +
                  </button>
                </span>
              </div>
            ))}

            <div className="rate-row">
              <label htmlFor="rate">Assumed cost per hour</label>
              <span className="rate-row__field">
                ₹
                <input
                  id="rate"
                  inputMode="numeric"
                  value={rate}
                  onChange={(event) => setRate(event.target.value)}
                  aria-label="Cost per hour in rupees"
                />
              </span>
            </div>
          </div>

          <div className="calc__out" aria-live="polite">
            <p className="calc__title">Your ledger, if nothing changes</p>
            <div>
              <span className="calc__k">Hours lost per month</span>
              <div className="big-num">{any ? monthly.toLocaleString("en-IN") : "0"}</div>
              <p className="calc__sub">
                {any
                  ? `across ${heads} ${heads === 1 ? "person" : "people"}`
                  : "tick a task on the left"}
              </p>
            </div>
            <div>
              <span className="calc__k">Annualised salary cost</span>
              <div className="big-num">{counted ? inr(annual) : "₹0"}</div>
            </div>
            <p className="payback">
              {counted ? (
                <>
                  At this rate, a {inr(siteConfig.assumedBuildCost)} build pays for itself in
                  about <b>{months === 1 ? "1 month" : `${months} months`}</b>, and then keeps
                  saving, year after year.
                </>
              ) : (
                "Tick the work your team does by hand, set how many people do it, and the ledger fills itself in."
              )}
            </p>
            <Cta block>
              {counted
                ? `Recover ${inr(annual)} a year. Book my free call`
                : "Book my free 20-minute call"}
            </Cta>
          </div>
        </div>

        <Plate
          src="/images/invoice-row.jpg"
          alt="A long row of identical printed invoices spread edge to edge"
          width={1600}
          height={686}
          n="01"
          caption="One week of vendor invoices, printed"
          sizes="(max-width: 1180px) 100vw, 1024px"
          dark
          className="plate--wide"
        />

        <div className="cta-band" data-reveal>
          <p className="cta-band__line">
            Every month this stays manual, the number above leaves with it.
          </p>
          <div className="cta-band__side">
            <Cta>Get this quoted in 20 minutes</Cta>
            <span className="cta-band__sub">
              One number, in writing, within two working days.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import { reassurance, siteConfig, whatsappHref } from "@/lib/siteConfig";

const ENDPOINT = "https://api.web3forms.com/submit";

/** 9:00 am to 8:00 pm, every half hour. */
const SLOTS = (() => {
  const out: string[] = [];
  for (let m = 9 * 60; m <= 20 * 60; m += 30) {
    const h = Math.floor(m / 60);
    const mm = m % 60;
    const h12 = h % 12 === 0 ? 12 : h % 12;
    out.push(`${h12}:${String(mm).padStart(2, "0")}${h < 12 ? " am" : " pm"}`);
  }
  return out;
})();

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type Day = { dow: string; num: number; mon: string; iso: string };

/** The next fortnight, today first. */
function buildDays(): Day[] {
  const now = new Date();
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(now.getTime() + i * 86400000);
    return {
      dow: DOW[d.getDay()].toUpperCase(),
      num: d.getDate(),
      mon: d.toLocaleString("en-GB", { month: "short" }).toUpperCase(),
      iso: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate(),
      ).padStart(2, "0")}`,
    };
  });
}

const title = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();

export function Booking() {
  /**
   * The dates depend on the visitor's own clock, so they are built after mount
   * — a server-rendered fortnight could be a day out, and would not match.
   */
  const [days, setDays] = useState<Day[] | null>(null);
  const [day, setDay] = useState(0);
  const [slot, setSlot] = useState("");
  const [more, setMore] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [sentTo, setSentTo] = useState("");
  const [sentWhen, setSentWhen] = useState("");

  useEffect(() => setDays(buildDays()), []);

  const chosenDay = days?.[day];
  const dayLabel = chosenDay ? `${title(chosenDay.dow)} ${chosenDay.num}` : "";
  const whenLabel =
    chosenDay && slot ? `${slot}, ${chosenDay.num} ${title(chosenDay.mon)} · IST` : "";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot: only a bot fills this in.
    if (data.get("botcheck")) return;

    const phone = String(data.get("phone") || "");

    if (!siteConfig.web3formsKey) {
      setError("This form isn't connected yet. Set NEXT_PUBLIC_WEB3FORMS_KEY and redeploy.");
      return;
    }

    setPending(true);
    setError(null);

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: siteConfig.web3formsKey,
          subject: `Call booked — ${data.get("name") || "no name"}${
            whenLabel ? ` · ${whenLabel}` : ""
          }`,
          from_name: "Vaultra website",
          name: data.get("name"),
          "whatsapp number": phone,
          "repetitive work": data.get("pain"),
          company: data.get("company") || "—",
          budget: data.get("budget") || "—",
          "requested slot": whenLabel || "No slot picked",
          "requested date": chosenDay?.iso || "—",
          source: "Booking section",
        }),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || "Submission failed");
      }

      setSentTo(phone.trim() || "the number you gave");
      setSentWhen(whenLabel || "We will confirm a time on WhatsApp.");
      setSent(true);
    } catch {
      setError(
        "We couldn't send that. Please try again, or WhatsApp us and we'll pick it up from there.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="booking" id="book">
      <div className="shell">
        <div className="head-split booking__head">
          <div className="head-split__text">
            <p className="eyebrow" data-reveal>
              <span>07</span>
              <span>Book the call</span>
            </p>
            <h2 className="h2" data-reveal>
              Pick a time. Twenty minutes, on the phone.
            </h2>
            <p className="booking__sub" data-reveal>
              Taking two builds for September. If both go, we will say so on the call rather than
              hold you in a queue.
            </p>
          </div>
          <figure className="figure booking__head-figure" data-reveal>
            <Image
              src="/images/chai-wall-clock.jpg"
              alt="A cup of chai on a sunlit ledge with a brass wall clock behind it"
              width={1600}
              height={1066}
              sizes="(max-width: 640px) 100vw, 340px"
            />
          </figure>
        </div>

        {sent ? (
          <div className="booking-confirm">
            <p className="booking-confirm__label">Slot held</p>
            <p className="booking-confirm__when">{sentWhen}</p>
            <ul>
              <li>
                {siteConfig.callers} calls you on {sentTo}.
              </li>
              <li>
                They will ask what repeats, who does it now, and which systems hold the data.
              </li>
              <li>Twenty minutes. If automation won&apos;t help, they will say so on the call.</li>
              <li>A WhatsApp confirmation follows in the next few minutes.</li>
            </ul>
          </div>
        ) : (
          <div className="booking__grid">
            <div className="booking-picker" data-reveal>
              <div className="booking-picker__head">
                <span className="label">Choose a day · next 2 weeks</span>
                <span className="booking-picker__tz">IST (GMT+5:30)</span>
              </div>

              <div className="booking-days" role="group" aria-label="Choose a day">
                {days
                  ? days.map((d, i) => (
                      <button
                        type="button"
                        key={d.iso}
                        className="booking-day"
                        aria-pressed={day === i}
                        onClick={() => {
                          setDay(i);
                          setSlot("");
                        }}
                      >
                        <span className="booking-day__dow">{d.dow}</span>
                        <span className="booking-day__num">{d.num}</span>
                        <span className="booking-day__mon">{d.mon}</span>
                      </button>
                    ))
                  : Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className="booking-day booking-day--skeleton"
                        aria-hidden="true"
                      >
                        <span className="booking-day__dow">···</span>
                        <span className="booking-day__num">·</span>
                        <span className="booking-day__mon">···</span>
                      </span>
                    ))}
              </div>

              <div className="booking-picker__time">
                <span className="label">Choose a time</span>
                <span className="booking-picker__range">
                  {dayLabel ? `9:00 am – 8:00 pm · ${dayLabel}` : "9:00 am – 8:00 pm"}
                </span>
              </div>
              <select
                aria-label="Choose a time"
                value={slot}
                onChange={(e) => setSlot(e.target.value)}
              >
                <option value="">Select a time</option>
                {SLOTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <form className="booking-form" data-reveal onSubmit={handleSubmit}>
              <label>
                <span className="label">Name</span>
                <input className="field" name="name" autoComplete="name" required />
              </label>
              <label>
                <span className="label">WhatsApp number</span>
                <input
                  className="field"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  placeholder="+91"
                  autoComplete="tel"
                  required
                />
              </label>
              <label>
                <span className="label">What repetitive work is eating the most time?</span>
                <textarea className="field" name="pain" rows={3} />
              </label>

              <button
                type="button"
                className="booking-form__more"
                aria-expanded={more}
                onClick={() => setMore((v) => !v)}
              >
                {more ? "Hide extra detail" : "Add more detail"}
              </button>
              {more ? (
                <div className="booking-form__extra">
                  <label>
                    <span className="label">Company (optional)</span>
                    <input className="field" name="company" autoComplete="organization" />
                  </label>
                  <label>
                    <span className="label">Budget in mind (optional)</span>
                    <input className="field" name="budget" />
                  </label>
                </div>
              ) : null}

              {/* Honeypot — hidden from people, irresistible to bots. */}
              <input
                type="checkbox"
                name="botcheck"
                className="visually-hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <button type="submit" className="cta cta--lg booking-form__submit" disabled={pending}>
                {pending ? "Sending…" : slot ? `Confirm ${slot}` : "Confirm the call"}
                <span className="cta__chip">20 MIN</span>
              </button>

              {error ? (
                <p className="booking-form__error" role="alert">
                  {error}
                </p>
              ) : null}

              <p className="booking-form__note">{reassurance}</p>
              <p className="booking-form__alt">
                Would rather type than talk?{" "}
                <a href={whatsappHref}>Message us on WhatsApp</a> — same people answer.
              </p>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}

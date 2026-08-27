"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Folio } from "@/components/Folio";
import { Plate } from "@/components/Plate";
import { Stamp } from "@/components/Stamp";
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

const DOW = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

type Day = { dow: string; num: number; mon: string; iso: string };

/** The next fortnight, today first. */
function buildDays(): Day[] {
  const now = new Date();
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(now.getTime() + i * 86400000);
    return {
      dow: DOW[d.getDay()],
      num: d.getDate(),
      mon: d.toLocaleString("en-GB", { month: "short" }).toUpperCase(),
      iso: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate(),
      ).padStart(2, "0")}`,
    };
  });
}

const title = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();

const REQUIRED = {
  name: "Please tell us your name.",
  company: "Please tell us your company.",
  phone: "We need a number to call you back on.",
  work: "One line is enough — what does your team do by hand?",
} as const;

type FieldName = keyof typeof REQUIRED;

export function Booking() {
  /**
   * The dates depend on the visitor's own clock, so they are built after
   * mount — a server-rendered fortnight could be a day out, and would not
   * match on rehydration.
   */
  const [days, setDays] = useState<Day[] | null>(null);
  const [day, setDay] = useState(0);
  const [slot, setSlot] = useState("");
  const [invalid, setInvalid] = useState<FieldName[]>([]);
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

  const clear = (name: FieldName) =>
    setInvalid((prev) => (prev.includes(name) ? prev.filter((f) => f !== name) : prev));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot: only a bot fills this in.
    if (data.get("website")) return;

    const missing = (Object.keys(REQUIRED) as FieldName[]).filter(
      (name) => !String(data.get(name) || "").trim(),
    );
    if (missing.length > 0) {
      setInvalid(missing);
      form.querySelector<HTMLElement>(`[name="${missing[0]}"]`)?.focus();
      return;
    }
    setInvalid([]);

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
          company: data.get("company"),
          "whatsapp number": phone,
          "repetitive work": data.get("work"),
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

  const fieldClass = (name: FieldName) =>
    `field${invalid.includes(name) ? " field--invalid" : ""}`;

  return (
    <section className="section book" id="book">
      <div className="wrap">
        <Folio n="06" label="Book the call" direction="आग्नेय · SE" quality="Agni · action" />

        {sent ? (
          <div className="received">
            <Stamp strike="now">Received</Stamp>
            <p className="received__when">{sentWhen}</p>
            <ul>
              <li>
                {siteConfig.callers} calls you on {sentTo}.
              </li>
              <li>
                They will ask what repeats, who does it now, and which systems hold the data.
              </li>
              <li>
                Twenty minutes. If automation won&apos;t help, they will say so on the call.
              </li>
              <li>A confirmation follows within one working day, Monday to Saturday.</li>
            </ul>
          </div>
        ) : (
          <div className="book__grid">
            <div className="book__side">
              <h2 data-reveal>Tell us what your team does by hand.</h2>
              <p data-reveal>
                Twenty minutes on a call is enough for us to say whether this is worth building.
                If it isn&apos;t, we&apos;ll tell you that and leave you alone.
              </p>
              <ul className="book__checks" data-reveal>
                <li>
                  <span aria-hidden="true">✓</span>We reply within one working day, Monday to
                  Saturday.
                </li>
                <li>
                  <span aria-hidden="true">✓</span>
                  {reassurance}
                </li>
                <li>
                  <span aria-hidden="true">✓</span>One number in writing within two working days
                  of the call.
                </li>
                <li>
                  <span aria-hidden="true">✓</span>If the software cannot do what the scope says,
                  you don&apos;t pay the balance.
                </li>
              </ul>
              <Plate
                src="/images/chai-wall-clock.jpg"
                alt="A cup of chai on a sunlit ledge with a brass wall clock behind it"
                width={1600}
                height={1066}
                n="07"
                caption="Twenty minutes, at a time you pick"
                sizes="(max-width: 900px) 100vw, 400px"
                className="plate--spaced"
              />
            </div>

            <form className="form" data-reveal onSubmit={handleSubmit} noValidate>
              <div className="form__top">
                <h3>Book the 20-minute call</h3>
              </div>

              <div className={fieldClass("name")}>
                <label htmlFor="fName">Name</label>
                <input id="fName" name="name" autoComplete="name" onInput={() => clear("name")} />
                {invalid.includes("name") ? <p className="field__err">{REQUIRED.name}</p> : null}
              </div>

              <div className={fieldClass("company")}>
                <label htmlFor="fCompany">Company</label>
                <input
                  id="fCompany"
                  name="company"
                  autoComplete="organization"
                  onInput={() => clear("company")}
                />
                {invalid.includes("company") ? (
                  <p className="field__err">{REQUIRED.company}</p>
                ) : null}
              </div>

              <div className={fieldClass("phone")}>
                <label htmlFor="fPhone">Phone or WhatsApp</label>
                <input
                  id="fPhone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  placeholder="+91"
                  autoComplete="tel"
                  onInput={() => clear("phone")}
                />
                {invalid.includes("phone") ? <p className="field__err">{REQUIRED.phone}</p> : null}
              </div>

              <div className={fieldClass("work")}>
                <label htmlFor="fWork">What repetitive work is eating the most time?</label>
                <textarea
                  id="fWork"
                  name="work"
                  onInput={() => clear("work")}
                  placeholder="One line is enough — e.g. “two people type vendor invoices into Tally all morning”"
                />
                {invalid.includes("work") ? <p className="field__err">{REQUIRED.work}</p> : null}
              </div>

              <div className="field">
                <label htmlFor="fBudget">Budget in mind (optional)</label>
                <select id="fBudget" name="budget" defaultValue="Not sure yet">
                  <option>Not sure yet</option>
                  <option>Under ₹1 lakh</option>
                  <option>₹1 – 2 lakh</option>
                  <option>₹2 – 3 lakh</option>
                  <option>Above ₹3 lakh</option>
                </select>
              </div>

              <div className="picker">
                <div className="picker__head">
                  <span>Pick a day · next 2 weeks</span>
                  <span className="picker__tz">IST (GMT+5:30)</span>
                </div>
                <div className="days" role="group" aria-label="Choose a day">
                  {days
                    ? days.map((d, i) => (
                        <button
                          type="button"
                          key={d.iso}
                          className="day"
                          aria-pressed={day === i}
                          onClick={() => {
                            setDay(i);
                            setSlot("");
                          }}
                        >
                          <span className="day__dow">{d.dow}</span>
                          <span className="day__num">{d.num}</span>
                          <span className="day__mon">{d.mon}</span>
                        </button>
                      ))
                    : Array.from({ length: 5 }, (_, i) => (
                        <span key={i} className="day day--skeleton" aria-hidden="true">
                          <span className="day__dow">···</span>
                          <span className="day__num">·</span>
                          <span className="day__mon">···</span>
                        </span>
                      ))}
                </div>
                <div className="field" style={{ marginTop: 14, marginBottom: 0 }}>
                  <label htmlFor="fSlot">
                    {dayLabel ? `Time · ${dayLabel}` : "Time"}
                  </label>
                  <select
                    id="fSlot"
                    value={slot}
                    onChange={(event) => setSlot(event.target.value)}
                  >
                    <option value="">No preference — call me any time</option>
                    {SLOTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Honeypot — hidden from people, irresistible to bots. */}
              <div className="visually-hidden" aria-hidden="true">
                <label>
                  Leave this field empty
                  <input name="website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              <button type="submit" className="btn btn--glint btn--block" disabled={pending}>
                <span>
                  {pending
                    ? "Sending…"
                    : slot
                      ? `Confirm ${slot}`
                      : "Book my free 20-minute call"}
                </span>
                <span className="btn__arrow" aria-hidden="true">
                  →
                </span>
              </button>

              {error ? (
                <p className="form__error" role="alert">
                  {error}
                </p>
              ) : null}

              <p className="reassure" style={{ textAlign: "center" }}>
                {reassurance}
              </p>
              <p className="form__alt">
                Would rather type than talk? <a href={whatsappHref}>Message us on WhatsApp</a> —
                the same people answer.
              </p>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { siteConfig } from "@/lib/siteConfig";

const OPEN_EVENT = "vaultra:audit";

/**
 * Any button on the page can open the shared audit modal: the trigger fires a
 * window event, and the single <AuditModal /> mounted in the page listens.
 */
export function AuditTrigger({
  label,
  variant = "solid",
  size = "lg",
  block = false,
}: {
  label: string;
  variant?: "solid" | "outline";
  size?: "lg" | "sm";
  block?: boolean;
}) {
  const classes = [
    "btn",
    variant === "outline" ? "btn--outline" : "",
    size === "sm" ? "btn--sm" : "",
    block ? "btn--block" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={classes}
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN_EVENT))}
    >
      <span>{label}</span>
      <span className="btn__arrow" aria-hidden="true">
        ↗
      </span>
    </button>
  );
}

const BUSINESSES = ["E-commerce", "Real Estate", "Finance", "Healthcare", "Agency"];

const DRAINS = [
  "Too much manual data entry",
  "Slow lead follow-ups",
  "Invoice & payroll admin",
  "Customer support backlog",
];

const FIELDS = [
  { name: "name", placeholder: "Your name", type: "text", autoComplete: "name" },
  { name: "email", placeholder: "Work email", type: "email", autoComplete: "email" },
  { name: "phone", placeholder: "Phone number", type: "tel", autoComplete: "tel" },
  { name: "company", placeholder: "Company name", type: "text", autoComplete: "organization" },
  { name: "size", placeholder: "Company size", type: "text", autoComplete: "off" },
] as const;

const ENDPOINT = "https://api.web3forms.com/submit";

export function AuditModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [business, setBusiness] = useState("");
  const [drain, setDrain] = useState("");
  const [form, setForm] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, show);
    return () => window.removeEventListener(OPEN_EVENT, show);
  }, []);

  const close = () => {
    setOpen(false);
    setStep(1);
    setBusiness("");
    setDrain("");
    setForm({});
    setError(null);
    setSent(false);
    setPending(false);
  };

  useEffect(() => {
    if (!open) return;
    dialogRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const emailOk = /.+@.+\..+/.test(form.email || "");
  const canSubmit = (form.name || "").trim() !== "" && emailOk;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || !canSubmit) return;
    setError(null);

    /* Without a Web3Forms key the flow still completes, like the reference
       mock — set NEXT_PUBLIC_WEB3FORMS_KEY to actually receive the leads. */
    if (!siteConfig.web3formsKey) {
      setSent(true);
      return;
    }

    setPending(true);
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: siteConfig.web3formsKey,
          subject: `Workflow audit: ${form.name}${form.company ? ` · ${form.company}` : ""}`,
          from_name: "Vaultra website",
          "business type": business,
          "time drain": drain,
          name: form.name,
          email: form.email,
          phone: form.phone || "Not given",
          company: form.company || "Not given",
          "company size": form.size || "Not given",
          source: "Audit my workflows modal",
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) throw new Error();
      setSent(true);
    } catch {
      setError("We couldn't send that. Please try again in a moment.");
    } finally {
      setPending(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label="Automation score"
        tabIndex={-1}
        ref={dialogRef}
      >
        <button type="button" className="modal__close" aria-label="Close" onClick={close}>
          ✕
        </button>

        {sent ? (
          <div className="modal__done">
            <span className="modal__check" aria-hidden="true">
              ✓
            </span>
            <p className="modal__eyebrow">Automation score · done</p>
            <h3 className="modal__title">
              <span className="line">Your roadmap is</span>
              <span className="line line--sage">on its way.</span>
            </h3>
            <p className="modal__q">
              We&rsquo;ll reply on {form.email}
              {business ? ` with a plan for your ${business.toLowerCase()} workflows` : ""} within
              one working day.
            </p>
            <button type="button" className="btn btn--block" onClick={close}>
              <span>Done</span>
              <span className="btn__arrow" aria-hidden="true">
                ↗
              </span>
            </button>
          </div>
        ) : (
          <>
            <p className="modal__eyebrow">Automation score · 0{step}/3</p>
            <h3 className="modal__title">
              <span className="line">Let&rsquo;s find your</span>
              <span className="line line--sage">unlocked hours.</span>
            </h3>
            <div className="modal__progress" aria-hidden="true">
              <span style={{ width: `${(step / 3) * 100}%` }} />
            </div>

            {step === 1 ? (
              <>
                <p className="modal__q">What kind of business are you building?</p>
                <div className="modal__options">
                  {BUSINESSES.map((option) => (
                    <button
                      type="button"
                      key={option}
                      className={`opt${business === option ? " is-picked" : ""}`}
                      aria-pressed={business === option}
                      onClick={() => setBusiness(option)}
                    >
                      {option}
                      <span aria-hidden="true">›</span>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="btn btn--block"
                  disabled={!business}
                  onClick={() => setStep(2)}
                >
                  <span>Next step</span>
                  <span className="btn__arrow" aria-hidden="true">
                    ↗
                  </span>
                </button>
              </>
            ) : null}

            {step === 2 ? (
              <>
                <p className="modal__q">Where does time disappear today?</p>
                <div className="modal__options">
                  {DRAINS.map((option) => (
                    <button
                      type="button"
                      key={option}
                      className={`opt${drain === option ? " is-picked" : ""}`}
                      aria-pressed={drain === option}
                      onClick={() => setDrain(option)}
                    >
                      {option}
                      <span aria-hidden="true">›</span>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="btn btn--block"
                  disabled={!drain}
                  onClick={() => setStep(3)}
                >
                  <span>Almost there</span>
                  <span className="btn__arrow" aria-hidden="true">
                    ↗
                  </span>
                </button>
              </>
            ) : null}

            {step === 3 ? (
              <form onSubmit={handleSubmit} noValidate>
                <p className="modal__q">Where should we send your custom plan?</p>
                <div className="modal__fields">
                  {FIELDS.map((field) => (
                    <input
                      key={field.name}
                      name={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      autoComplete={field.autoComplete}
                      aria-label={field.placeholder}
                      value={form[field.name] || ""}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, [field.name]: e.target.value }))
                      }
                    />
                  ))}
                </div>
                <button type="submit" className="btn btn--block" disabled={!canSubmit || pending}>
                  <span>{pending ? "Sending…" : "Get my roadmap"}</span>
                  <span className="btn__arrow" aria-hidden="true">
                    ↗
                  </span>
                </button>
                {error ? (
                  <p className="modal__error" role="alert">
                    {error}
                  </p>
                ) : null}
              </form>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

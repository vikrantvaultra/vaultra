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

const FIELDS = [
  { name: "name", label: "Name", type: "text", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "phone", label: "Phone number", type: "tel", autoComplete: "tel" },
] as const;

const ENDPOINT = "https://api.web3forms.com/submit";

export function AuditModal() {
  const [open, setOpen] = useState(false);
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
    setForm({});
    setError(null);
    setSent(false);
    setPending(false);
  };

  useEffect(() => {
    if (!open) return;
    dialogRef.current?.querySelector("input")?.focus();
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

  const name = (form.name || "").trim();
  const emailOk = /.+@.+\..+/.test(form.email || "");
  const phoneOk = (form.phone || "").replace(/\D/g, "").length >= 7;
  const canSubmit = name !== "" && emailOk && phoneOk;

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
          subject: `Free plan request: ${name}`,
          from_name: "Vaultra website",
          name,
          email: form.email,
          phone: form.phone,
          source: "Free plan form",
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
        aria-labelledby="audit-modal-title"
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
            <h3 className="modal__title" id="audit-modal-title">
              <span className="line">Thanks, {name}.</span>
              <span className="line line--sage">We&rsquo;ll be in touch.</span>
            </h3>
            <p className="modal__q">
              We&rsquo;ll contact you at {form.email} within one working day.
            </p>
            <button type="button" className="btn btn--block" onClick={close}>
              <span>Done</span>
              <span className="btn__arrow" aria-hidden="true">
                ↗
              </span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <h3 className="modal__title" id="audit-modal-title">
              <span className="line">Get your</span>
              <span className="line line--sage">free plan.</span>
            </h3>
            <p className="modal__q">
              Leave your details and we&rsquo;ll show you what we can automate for you.
            </p>
            <div className="modal__fields">
              {FIELDS.map((field) => (
                <label key={field.name} className="modal__field">
                  <span>{field.label}</span>
                  <input
                    name={field.name}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    required
                    value={form[field.name] || ""}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, [field.name]: e.target.value }))
                    }
                  />
                </label>
              ))}
            </div>
            <button type="submit" className="btn btn--block" disabled={!canSubmit || pending}>
              <span>{pending ? "Sending…" : "Submit"}</span>
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
        )}
      </div>
    </div>
  );
}

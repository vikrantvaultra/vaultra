"use client";

import { useState, type FormEvent } from "react";
import { budgetOptions, reassurance, siteConfig } from "@/lib/siteConfig";

const ENDPOINT = "https://api.web3forms.com/submit";

type Props = {
  /** Prefix for input ids so the page form and the modal form never collide. */
  idPrefix: string;
  variant: "page" | "modal";
  /** Names the source in the email subject line. */
  source: string;
  onSuccess: () => void;
};

export function LeadForm({ idPrefix, variant, source, onSuccess }: Props) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isModal = variant === "modal";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot: only a bot fills this in.
    if (data.get("botcheck")) return;

    if (!siteConfig.web3formsKey) {
      setError(
        "This form isn't connected yet. Set NEXT_PUBLIC_WEB3FORMS_KEY and redeploy.",
      );
      return;
    }

    const budgetValue = String(data.get("budget") || "unsure");
    const budgetLabel =
      budgetOptions.find((o) => o.value === budgetValue)?.label ?? budgetValue;

    setPending(true);
    setError(null);

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: siteConfig.web3formsKey,
          subject: `New Vaultra enquiry — ${data.get("company")}`,
          from_name: "Vaultra website",
          name: data.get("name"),
          company: data.get("company"),
          phone: data.get("phone"),
          "repetitive work": data.get("work"),
          budget: budgetLabel,
          source,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || "Submission failed");
      }

      form.reset();
      onSuccess();
    } catch {
      setError(
        "We couldn't send that. Please try again, or WhatsApp us and we'll pick it up from there.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      className={isModal ? "form form--modal" : "form"}
      onSubmit={handleSubmit}
      noValidate={false}
    >
      <div className="field">
        <label className="field__label" htmlFor={`${idPrefix}-name`}>
          Name
        </label>
        <input
          className="field__input"
          id={`${idPrefix}-name`}
          name="name"
          autoComplete="name"
          required
          placeholder="Your name"
        />
      </div>

      <div className="field">
        <label className="field__label" htmlFor={`${idPrefix}-company`}>
          Company
        </label>
        <input
          className="field__input"
          id={`${idPrefix}-company`}
          name="company"
          autoComplete="organization"
          required
          placeholder="Company name"
        />
      </div>

      <div className="field">
        <label className="field__label" htmlFor={`${idPrefix}-phone`}>
          Phone or WhatsApp
        </label>
        <input
          className="field__input"
          id={`${idPrefix}-phone`}
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          placeholder="+91"
        />
      </div>

      <div className="field">
        <label className="field__label" htmlFor={`${idPrefix}-work`}>
          What repetitive work is eating the most time?
        </label>
        <textarea
          className="field__textarea"
          id={`${idPrefix}-work`}
          name="work"
          rows={isModal ? 3 : 4}
          required
          placeholder={
            isModal
              ? "One or two lines is plenty."
              : "e.g. Two people entering purchase invoices into Tally every morning."
          }
        />
      </div>

      <div className="field">
        <label className="field__label" htmlFor={`${idPrefix}-budget`}>
          Budget in mind (optional)
        </label>
        <select
          className="field__select"
          id={`${idPrefix}-budget`}
          name="budget"
          defaultValue="unsure"
        >
          {budgetOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <label className="form__honeypot" aria-hidden="true">
        Leave this field empty
        <input type="checkbox" name="botcheck" tabIndex={-1} />
      </label>

      {error ? (
        <p className="form__error" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        className={`btn ${isModal ? "btn--modal" : "btn--submit"} form__submit`}
        // The page form counts as an on-screen CTA; the one inside the
        // booking dialog does not, since the dialog covers the bar anyway.
        data-cta={isModal ? undefined : ""}
        disabled={pending}
      >
        {pending ? "Sending…" : "Book a 20-minute call"}
      </button>

      <p className="form__note">{reassurance}</p>

      {!isModal ? (
        <p className="form__hours">
          We reply within one working day, Monday to Saturday.
        </p>
      ) : null}
    </form>
  );
}

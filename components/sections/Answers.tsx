"use client";

import Image from "next/image";
import { useState } from "react";

const faqs = [
  {
    q: "What does it cost?",
    a: "One fixed price for the whole build, quoted in writing within two working days of the call. Most first builds are a single workflow, not a platform. Payment is split, with the balance due on delivery of what the scope says.",
  },
  {
    q: "Is our data safe?",
    a: "The software runs on your accounts and your infrastructure. Credentials stay with you. We sign an NDA before the first file moves, and access ends when the build ends unless you keep us on support.",
  },
  {
    q: "Our systems are different — we don't run Tally.",
    a: "Tally, Zoho, SAP B1, Busy, a custom ERP or plain Excel — the approach is the same: we read and write through whatever interface the system gives us. On the call we will tell you which of your systems are straightforward and which are not.",
  },
  {
    q: "Do we have to change the software we use?",
    a: "No. We build around what your team already uses. Nobody learns a new screen unless removing one saves them time.",
  },
  {
    q: "What if it breaks?",
    a: "Anything that fails stops and tells a named person, and the manual route still works — no silent errors, no half-posted vouchers. Fixes to the delivered scope are ours. Monthly support covers changes after that.",
  },
  {
    q: "What if it doesn't work?",
    a: "If the software cannot do what the scope says, you do not pay the balance. You also see the halfway review before that point.",
  },
];

export function Answers() {
  /** One answer open at a time; -1 is all closed. The first opens by default. */
  const [open, setOpen] = useState(0);

  return (
    <section className="answers">
      <p className="eyebrow" data-reveal>
        <span>06</span>
        <span>Questions we get</span>
      </p>
      <h2 className="h2" data-reveal>
        Straight answers.
      </h2>

      <figure className="figure answers__figure" data-reveal>
        <Image
          src="/images/ledger-ruler.jpg"
          alt="A closed dark green hardbound ledger with a brass ruler laid diagonally across the cover"
          width={1600}
          height={900}
          sizes="(max-width: 868px) 100vw, 772px"
        />
      </figure>

      <div className="answers__list" data-reveal>
        {faqs.map((faq, i) => {
          const isOpen = open === i;
          return (
            <div className="answers__item" key={faq.q}>
              <h3>
                <button
                  type="button"
                  className="answers__q"
                  aria-expanded={isOpen}
                  aria-controls={`answer-${i}`}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  {faq.q}
                  <span className="answers__sign" aria-hidden="true">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
              </h3>
              {isOpen ? (
                <p className="answers__a" id={`answer-${i}`}>
                  {faq.a}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

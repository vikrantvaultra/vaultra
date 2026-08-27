"use client";

import { useState } from "react";
import { Folio } from "@/components/Folio";
import { Plate } from "@/components/Plate";

const faqs = [
  {
    q: "What does it cost?",
    a: "One fixed price for the whole build, quoted in writing within two working days of the call. One process in one system sits at the low end; several processes, or a system with no clean way in, costs more. Most first builds are a single workflow, not a platform. Payment is split, with the balance due on delivery of what the scope says. The number only changes if you change the scope.",
  },
  {
    q: "Is our data safe?",
    a: "The software runs on your accounts and your infrastructure. Credentials stay with you. We sign an NDA before the first file moves, take the least access the job needs, and access ends when the build ends unless you keep us on support. Your documents are not used to train anything.",
  },
  {
    q: "Our systems aren't Tally or Zoho. Can you still help?",
    a: "Yes. We start from the workflow, not the software. Tally, Zoho, SAP B1, Busy, a custom ERP, a legacy database, or a screen someone types into by hand. If the data can be read and written, we can work with it. On the call we tell you which of your systems are straightforward and which need a workaround.",
  },
  {
    q: "Do we have to change the software we use?",
    a: "No. We build around what your team already uses. Nobody learns a new screen unless removing one saves them time. If a system has no safe way in, we tell you on the first call rather than after you have paid.",
  },
  {
    q: "What if it breaks?",
    a: "You call us, not a ticket queue. Anything that fails stops and tells a named person, and the manual route still works. No silent errors, no half-posted vouchers. Failures are fixed the same working day. Fixes to the delivered scope are ours; monthly support covers changes after that.",
  },
  {
    q: "What if it doesn't work for us?",
    a: "The scope is agreed in writing before the build, with a review at the halfway point. If the software cannot do what the scope says, you do not pay the balance.",
  },
];

export function Answers() {
  /** One answer open at a time; -1 is all closed. The first opens by default. */
  const [open, setOpen] = useState(0);

  return (
    <section className="section" id="answers">
      <div className="wrap">
        <Folio n="05" label="Straight answers" direction="NE" quality="clarity" />
        <h2 data-reveal>The questions everyone asks on the call.</h2>

        <div className="faq" data-reveal>
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div className="faq__item" key={faq.q}>
                <h3>
                  <button
                    type="button"
                    className="faq__q"
                    aria-expanded={isOpen}
                    aria-controls={`answer-${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    {faq.q}
                    <span className="faq__sign" aria-hidden="true">
                      +
                    </span>
                  </button>
                </h3>
                {isOpen ? (
                  <p className="faq__a" id={`answer-${i}`}>
                    {faq.a}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>

        <Plate
          src="/images/envelope-unsealed.jpg"
          alt="An unsealed cream envelope beside a brass clip"
          width={1600}
          height={900}
          n="06"
          caption="Nothing sealed until you have read it"
          sizes="(max-width: 1180px) 100vw, 1024px"
          className="plate--wide"
        />
      </div>
    </section>
  );
}

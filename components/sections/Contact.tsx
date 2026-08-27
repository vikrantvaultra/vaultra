"use client";

import Image from "next/image";
import { useState } from "react";
import { LeadForm } from "@/components/LeadForm";
import chairWindow from "@/public/images/chair-window.jpg";

export function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <section id="contact" className="section">
      <div className="shell">
        <div className="section__head" data-reveal="0">
          <p className="eyebrow">05 · Book the call</p>
          <h2 className="h2">Tell us what your team does by hand.</h2>
        </div>

        <div className="split">
          <div className="split__media" data-reveal="0">
            <Image
              className="photo photo--tall"
              src={chairWindow}
              alt="An empty wooden chair and small round table by a barred window, with a notebook and a cup of tea"
              sizes="(max-width: 700px) 62vw, 420px"
            />
            <p className="contact__aside">
              Twenty minutes on a call is enough for us to say whether this is
              worth building. If it isn&rsquo;t, we&rsquo;ll tell you that and
              leave you alone.
            </p>
          </div>

          <div className="contact__panel" data-reveal="100">
            {sent ? (
              <div className="done">
                <span className="done__mark" aria-hidden="true" />
                <h3 className="done__title">Request received.</h3>
                <p className="done__body">
                  We reply within one working day and propose two slots. The
                  call is 20 minutes, and we come with questions about your
                  process rather than a presentation.
                </p>
                <button
                  type="button"
                  className="done__again"
                  onClick={() => setSent(false)}
                >
                  Send another request
                </button>
              </div>
            ) : (
              <LeadForm
                idPrefix="c"
                variant="page"
                source="Contact section"
                onSuccess={() => setSent(true)}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

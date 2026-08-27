import Image from "next/image";
import { BookCallButton } from "@/components/BookCallButton";
import { reassurance } from "@/lib/siteConfig";
import ledger from "@/public/images/ledger-invoices.jpg";

const pains = [
  {
    text: "Your accounts person spends the first three hours of every day typing vendor invoices into Tally.",
    stat: "15 hours a week retyping numbers that already exist",
  },
  {
    text: "A quotation takes 40 minutes to put together, and your sales team sends eight a week.",
    stat: "5 hours a week rebuilding the same document",
  },
  {
    text: "Monday's MIS report is stitched together from five spreadsheets before anyone can look at it.",
    stat: "Half a day a week, and the totals still get questioned",
  },
  {
    text: "An enquiry lands on your sales WhatsApp at 9:40pm and gets a reply at 11am the next day.",
    stat: "13 hours of silence on every after-hours enquiry",
  },
];

export function Problem() {
  return (
    <section id="problem" className="section section--ruled">
      <div className="shell">
        <div className="section__head" data-reveal="0">
          <p className="eyebrow">01 · Where the hours go</p>
          <h2 className="h2">You already know which work this is.</h2>
        </div>

        <div className="split">
          <div className="split__media" data-reveal="0">
            <Image
              className="photo photo--tall"
              src={ledger}
              alt="A ledger open on a desk beside a tall stack of vendor invoices, a calculator and a phone showing WhatsApp messages"
              sizes="(max-width: 700px) 62vw, 420px"
            />
          </div>

          <div className="split__body" data-reveal="100">
            {pains.map((pain) => (
              <div className="pain" key={pain.stat}>
                <p className="pain__text">{pain.text}</p>
                <p className="stat">{pain.stat}</p>
              </div>
            ))}
            <p className="pain__close">
              None of this needs a bigger team. It needs the work to stop being
              manual.
            </p>
          </div>
        </div>

        <div className="section__foot btn-stack" data-reveal="0">
          <BookCallButton variant="section" />
          <p className="note">{reassurance}</p>
        </div>
      </div>
    </section>
  );
}

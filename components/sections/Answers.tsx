import Image from "next/image";
import deskConversation from "@/public/images/desk-conversation.jpg";

const answers = [
  {
    q: "What does this typically cost?",
    a: "It depends on how many workflows are involved and how easily your systems give up their data. One process in one system sits at the low end; several processes, or a system with no clean way in, costs more. You get one number in writing within two working days of the call, and it only changes if you change the scope.",
    delay: 0,
  },
  {
    q: "What if it breaks?",
    a: "You call us, not a ticket queue. Runs are monitored and failures are fixed the same working day. If something stops, the work falls back to the manual process you have now, so nothing is stuck.",
    delay: 70,
  },
  {
    q: "Do we need to change our existing software?",
    a: "No. We build around Tally, Zoho, Excel and WhatsApp as they are. If a system has no safe way in, we tell you on the first call rather than after you have paid.",
    delay: 70,
  },
  {
    q: "Is our data safe?",
    a: "Your data stays in your accounts. We sign an NDA, take the least access the job needs, and hand back every credential at the end. Your documents are not used to train anything.",
    delay: 0,
  },
  {
    q: "Our systems aren't Tally or Zoho — can you still help?",
    a: "Yes. We start from the workflow, not the software. An ERP, in-house software, a legacy database, or a screen someone types into by hand — if the data can be read and written, we can work with it. On the call we say which parts are straightforward and which need a workaround.",
    delay: 0,
  },
  {
    q: "What if it doesn't work for us?",
    a: "The scope is agreed in writing before the build, with a review at the halfway point. If the software cannot do what the scope says, you do not pay the balance.",
    delay: 70,
  },
];

export function Answers() {
  return (
    <section id="answers" className="section section--dark">
      <div className="shell">
        <div className="answers__head" data-reveal="0">
          <div className="answers__intro">
            <p className="eyebrow eyebrow--light">04 · Straight answers</p>
            <h2 className="answers__title">
              The questions everyone asks on the call.
            </h2>
          </div>
          <Image
            className="answers__photo"
            src={deskConversation}
            alt="Two people talking across a desk in a dark room, lit by a single lamp"
            sizes="(max-width: 860px) 100vw, 470px"
          />
        </div>

        <div className="qa-grid">
          {answers.map((item) => (
            <div className="qa" key={item.q} data-reveal={item.delay}>
              <h3 className="qa__q">{item.q}</h3>
              <p className="qa__a">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

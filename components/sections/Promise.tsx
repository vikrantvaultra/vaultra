import Image from "next/image";
import { Cta } from "@/components/Cta";

export function Promise() {
  return (
    <section className="dark promise">
      <div className="shell">
        <figure className="figure promise__figure" data-reveal>
          <Image
            src="/images/envelope-unsealed.jpg"
            alt="An unsealed cream envelope on a dark green surface beside a brass clip"
            width={1600}
            height={900}
            sizes="(max-width: 600px) 100vw, 560px"
          />
        </figure>
        <p className="promise__eyebrow" data-reveal>
          05 · If it doesn&apos;t work
        </p>
        <p className="promise__claim" data-reveal>
          If the software cannot do what the scope says, you do not pay the balance.
        </p>
        <p className="promise__sub" data-reveal>
          There is a review at the halfway mark. If it is going the wrong way, you see it then,
          not at the end.
        </p>
        <div className="promise__cta" data-reveal>
          <Cta size="lg" onDark>
            Book a 20-minute call
          </Cta>
        </div>
      </div>
    </section>
  );
}

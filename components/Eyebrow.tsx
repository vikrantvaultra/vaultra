import type { ReactNode } from "react";

/** The head of every section: a mint dot and a mono label. */
export function Eyebrow({ light = false, children }: { light?: boolean; children: ReactNode }) {
  return (
    <p className={`eyebrow${light ? " eyebrow--light" : ""}`} data-reveal>
      <span className="eyebrow__dot" aria-hidden="true" />
      {children}
    </p>
  );
}

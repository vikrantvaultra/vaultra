import type { ReactNode } from "react";

/**
 * A rubber stamp, struck at four degrees off true — the one flourish on the
 * page.
 *
 * `strike="scroll"` holds it back until the element scrolls into view, which
 * is what the Reveal observer watches for. `strike="now"` hits it as soon as
 * it renders, for stamps that appear in response to something the visitor
 * just did and so are never scrolled into view.
 */
export function Stamp({
  tone = "leaf",
  strike,
  children,
}: {
  tone?: "leaf" | "fire" | "gold";
  strike?: "scroll" | "now";
  children: ReactNode;
}) {
  const classes = [
    "stamp",
    tone === "fire" ? "stamp--fire" : "",
    tone === "gold" ? "stamp--gold" : "",
    strike ? "stamp--strike" : "",
    strike === "now" ? "stamp--now" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes} {...(strike === "scroll" ? { "data-strike": "" } : {})}>
      {children}
    </span>
  );
}

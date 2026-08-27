import type { ReactNode } from "react";

/**
 * The one call to action on the site. Saffron is Agni's colour and it is
 * reserved for this — nothing else on the page is ever allowed to be it, so
 * that "book the call" is unmistakable wherever it appears.
 */
export function Cta({
  href = "#book",
  size = "lg",
  glint = false,
  block = false,
  tag = null,
  children,
}: {
  href?: string;
  size?: "lg" | "sm";
  glint?: boolean;
  block?: boolean;
  tag?: string | null;
  children: ReactNode;
}) {
  const classes = [
    "btn",
    size === "sm" ? "btn--sm" : "",
    glint ? "btn--glint" : "",
    block ? "btn--block" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <a href={href} className={classes}>
      <span>{children}</span>
      {tag ? <span className="btn__tag">{tag}</span> : null}
      <span className="btn__arrow" aria-hidden="true">
        →
      </span>
    </a>
  );
}

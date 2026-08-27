import type { ReactNode } from "react";

type Size = "lg" | "md" | "sm" | "xs" | "bar";

/**
 * The one call to action on the site, in the five sizes the design uses.
 * `onDark` only changes the drop shadow and the chip, which need more contrast
 * against the ink sections.
 */
export function Cta({
  href = "#book",
  size = "lg",
  onDark = false,
  chip = "20 MIN",
  className = "",
  children,
}: {
  href?: string;
  size?: Size;
  onDark?: boolean;
  chip?: string | null;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className={`cta cta--${size}${onDark ? " cta--on-dark" : ""}${className ? ` ${className}` : ""}`}
    >
      {children}
      {chip ? <span className="cta__chip">{chip}</span> : null}
    </a>
  );
}

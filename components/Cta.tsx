import type { ReactNode } from "react";

/** Mint pill with the diagonal arrow — the reference's one button shape. */
export function Cta({
  href,
  outline = false,
  size = "lg",
  children,
}: {
  href: string;
  outline?: boolean;
  size?: "lg" | "sm";
  children: ReactNode;
}) {
  const classes = ["btn", outline ? "btn--outline" : "", size === "sm" ? "btn--sm" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <a href={href} className={classes}>
      <span>{children}</span>
      <span className="btn__arrow" aria-hidden="true">
        ↗
      </span>
    </a>
  );
}

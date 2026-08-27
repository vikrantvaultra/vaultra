/**
 * The head of every section: a folio number, what the page is about, and the
 * vastu direction the section is placed in — north for wealth, east for
 * growth, south-east for action.
 */
export function Folio({
  n,
  label,
  direction,
  quality,
}: {
  n: string;
  label: string;
  direction: string;
  quality: string;
}) {
  return (
    <p className="eyebrow" data-reveal>
      <span className="folio">FOLIO {n}</span>
      <span>{label}</span>
      <span className="dir">
        {direction} — <b>{quality}</b>
      </span>
    </p>
  );
}

const claims = [
  "100% data privacy",
  "SOC2-aligned workflows",
  "Zero downtime architecture",
];

function Shield() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1 1 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function TrustStrip() {
  return (
    <aside className="trust" id="about" aria-label="Commitments">
      <div className="wrap trust__grid">
        {claims.map((claim) => (
          <span className="trust__item" key={claim}>
            <Shield />
            {claim}
          </span>
        ))}
      </div>
    </aside>
  );
}

/** The mark: a speech-bubble squircle with a mint dot. */
export function Logo({ size = 30, stroke = "#0d3b2e" }: { size?: number; stroke?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
      <path
        d="M4 9.2C4 5.8 6.4 3.6 10 3.4c1.3-.1 2.7-.1 4 0 3.6.2 6 2.4 6 5.8v2c0 3.4-2.4 5.6-6 5.8-1 .06-2 .06-3 0L6.2 20c-1.3.5-2.2-.3-2.2-1.6z"
        stroke={stroke}
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <circle cx="10.6" cy="10.4" r="3.1" fill="#00e599" />
    </svg>
  );
}

export function Logo({ size = 26 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="#0d6a70"
      aria-hidden="true"
    >
      <rect x="30" y="24" width="40" height="13" rx="6.5" />
      <rect x="20" y="43.5" width="60" height="13" rx="6.5" />
      <rect x="10" y="63" width="80" height="13" rx="6.5" />
    </svg>
  );
}

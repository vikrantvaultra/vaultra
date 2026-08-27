/** The three-bar mark: a stack narrowing towards the top. */
export function Logo({ size = 24, fill = "#a9821b" }: { size?: number; fill?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} fill={fill} aria-hidden="true">
      <rect x="30" y="24" width="40" height="13" rx="6.5" />
      <rect x="20" y="43.5" width="60" height="13" rx="6.5" />
      <rect x="10" y="63" width="80" height="13" rx="6.5" />
    </svg>
  );
}

type StayLogoProps = {
  size?: number;
  className?: string;
  showWordmark?: boolean;
};

export function StayLogo({ size = 40, className, showWordmark = true }: StayLogoProps) {
  const icon = Math.round(size * 0.8);
  return (
    <span className={className ?? ""} style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
      <svg width={icon} height={icon} viewBox="0 0 32 32" fill="none" aria-hidden>
        <path
          d="M16 4c-4 6-10 11.2-10 17.4C6 25 9.8 28 14 28c2.2 0 4.2-.9 5.6-2.4.6 1.5 1.8 2.4 3.4 2.4 2.2 0 4-1.8 4-4 0-6.2-6-11.4-11-17.4z"
          fill="#FF385C"
        />
      </svg>
      {showWordmark ? (
        <span style={{ fontWeight: 700, fontSize: size * 0.42, color: "#FF385C", letterSpacing: "-0.02em" }}>
          stay
        </span>
      ) : null}
    </span>
  );
}

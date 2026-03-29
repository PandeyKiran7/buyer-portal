import Link from "next/link";
import { StayMarkSvg } from "./StayIcons";

type Props = {
  href?: string;
  variant?: "full" | "wordmark";
  className?: string;
  "aria-label"?: string;
};

export function StayBrandLink({
  href = "/",
  variant = "full",
  className = "stayBrand",
  "aria-label": ariaLabel = "Home",
}: Props) {
  return (
    <Link href={href} className={className} aria-label={ariaLabel}>
      {variant === "full" ? (
        <>
          <span className="stayLogo" aria-hidden>
            <StayMarkSvg />
          </span>
          <span className="stayWordmark">stay</span>
        </>
      ) : (
        <span className="stayWordmark">stay</span>
      )}
    </Link>
  );
}

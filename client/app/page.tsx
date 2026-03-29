import { Suspense } from "react";
import { StayHome } from "@/components/stay/StayHome";

function HomeFallback() {
  return (
    <div className="stayPage">
      <p className="stayMain" style={{ padding: "2rem 1.5rem" }}>
        Loading…
      </p>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomeFallback />}>
      <StayHome />
    </Suspense>
  );
}

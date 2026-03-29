"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StayBrowseExperience } from "@/components/stay/StayBrowseExperience";
import { getToken, setToken } from "@/lib/auth-token";

function DashboardLoading() {
  return (
    <div className="stayPage">
      <header className="stayHeader">
        <div className="stayHeaderInner" style={{ minHeight: "72px" }} />
      </header>
      <main className="stayMain">
        <div className="stayGrid stayGridSkeleton" aria-busy="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="stayCard stayCardSkeleton" />
          ))}
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const logout = useCallback(() => {
    setToken(null);
    router.replace("/login");
    router.refresh();
  }, [router]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!getToken()) {
      router.replace("/login?next=/dashboard");
    }
  }, [mounted, router]);

  if (!mounted || !getToken()) {
    return <DashboardLoading />;
  }

  return <StayBrowseExperience mode="dashboard" onLogout={logout} />;
}

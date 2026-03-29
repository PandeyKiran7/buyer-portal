"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ApiError, api } from "@/lib/api";
import { getToken } from "@/lib/auth-token";
import type { PublicProperty, User } from "@/lib/types";
import {
  applyCategory,
  fetchFavouritePropertyIds,
  filterBySearch,
  mergeListings,
} from "@/lib/stay";
import { StayBrowseHeader } from "./StayBrowseHeader";
import type { BrowseCategoryId } from "./StayCategoryStrip";
import { StayCategoryStrip } from "./StayCategoryStrip";
import { StayFooter } from "./StayFooter";
import { StayInspireSection } from "./StayInspireSection";
import { StayListingCard } from "./StayListingCard";

export type StayBrowseMode = "public" | "dashboard";

type Props = {
  mode: StayBrowseMode;
  onLogout?: () => void;
};

export function StayBrowseExperience({ mode, onLogout }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const globeRef = useRef<HTMLDivElement>(null);
  const [rawListings, setRawListings] = useState<PublicProperty[]>([]);
  const [favouriteIds, setFavouriteIds] = useState<Set<number>>(() => new Set());
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [me, setMe] = useState<User | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [activeCategory, setActiveCategory] = useState<BrowseCategoryId>("trending");

  const [globeOpen, setGlobeOpen] = useState(false);
  const [favBanner, setFavBanner] = useState<string | null>(null);
  const [actionBanner, setActionBanner] = useState<string | null>(null);

  const isDashboard = mode === "dashboard";
  const firstName = me?.name?.split(" ")[0] ?? me?.name ?? null;

  const refreshAuth = useCallback(() => {
    setLoggedIn(!!getToken());
  }, []);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null) setSearchQuery(q);
  }, [searchParams]);

  useEffect(() => {
    refreshAuth();
    function onStorage(e: StorageEvent) {
      if (e.key === "buyer_portal_token" || e.key === null) refreshAuth();
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refreshAuth]);

  useEffect(() => {
    function closeGlobe(e: MouseEvent) {
      if (globeRef.current && !globeRef.current.contains(e.target as Node)) {
        setGlobeOpen(false);
      }
    }
    if (globeOpen) {
      document.addEventListener("mousedown", closeGlobe);
      return () => document.removeEventListener("mousedown", closeGlobe);
    }
  }, [globeOpen]);

  useEffect(() => {
    if (!isDashboard) return;
    let cancelled = false;
    (async () => {
      try {
        const { user } = await api.me();
        if (!cancelled) setMe(user);
      } catch {
        if (!cancelled) setMe(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isDashboard]);

  const loadListings = useCallback(async () => {
    setLoadError(null);
    try {
      const { properties: pub } = await api.publicProperties();
      setRawListings(pub);
      const token = getToken();
      if (isDashboard && !token) {
        router.replace("/login?next=/dashboard");
        return;
      }
      if (token) {
        try {
          setFavouriteIds(await fetchFavouritePropertyIds());
        } catch (err) {
          if (err instanceof ApiError && err.status === 401) {
            setFavouriteIds(new Set());
            if (isDashboard) {
              router.replace("/login?next=/dashboard");
              return;
            }
          } else {
            throw err;
          }
        }
      } else {
        setFavouriteIds(new Set());
      }
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : "Could not load listings.");
    } finally {
      setLoading(false);
    }
  }, [isDashboard, router]);

  useEffect(() => {
    void loadListings();
  }, [loadListings]);

  const listings = useMemo(
    () => mergeListings(rawListings, favouriteIds),
    [rawListings, favouriteIds]
  );

  const filteredListings = useMemo(() => {
    const searched = filterBySearch(rawListings, searchQuery);
    if (activeCategory === "saved") {
      return mergeListings(searched, favouriteIds).filter((p) => p.isFavourite);
    }
    return mergeListings(applyCategory(searched, activeCategory), favouriteIds);
  }, [rawListings, searchQuery, activeCategory, favouriteIds]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    document.getElementById("homes-heading")?.scrollIntoView({ behavior: "smooth" });
  }

  const toggleFavourite = useCallback(
    async (propertyId: number, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!getToken()) {
        router.push("/login?next=/");
        return;
      }
      const was = favouriteIds.has(propertyId);
      try {
        if (was) {
          await api.removeFavourite(propertyId);
          setFavouriteIds((prev) => {
            const n = new Set(prev);
            n.delete(propertyId);
            return n;
          });
          setActionBanner("Removed from saved.");
        } else {
          await api.addFavourite(propertyId);
          setFavouriteIds((prev) => new Set(prev).add(propertyId));
          setActionBanner("Saved to your list.");
        }
        setFavBanner(null);
        window.setTimeout(() => setActionBanner(null), 2800);
      } catch (err) {
        setFavBanner(
          err instanceof ApiError ? err.message : "Could not update favourites."
        );
      }
    },
    [favouriteIds, router]
  );

  function handleLogout() {
    onLogout?.();
  }

  const showSavedTab = loggedIn || isDashboard;

  return (
    <div className="stayPage">
      <StayBrowseHeader
        globeRef={globeRef}
        globeOpen={globeOpen}
        setGlobeOpen={setGlobeOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        checkIn={checkIn}
        setCheckIn={setCheckIn}
        checkOut={checkOut}
        setCheckOut={setCheckOut}
        guests={guests}
        setGuests={setGuests}
        onSearchSubmit={handleSearchSubmit}
        isDashboard={isDashboard}
        loggedIn={loggedIn}
        firstName={firstName}
        me={me}
        onLogout={handleLogout}
      />

      <main className="stayMain">
        {actionBanner ? (
          <p className="stayActionToast" role="status">
            {actionBanner}
          </p>
        ) : null}
        {favBanner ? (
          <p className="stayInlineBanner" role="alert">
            {favBanner}
          </p>
        ) : null}

        <StayCategoryStrip
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          savedCount={favouriteIds.size}
          showSavedTab={showSavedTab}
        />

        <section className="stayListingsSection" aria-labelledby="homes-heading">
          <h1 id="homes-heading" className="staySectionTitle">
            {activeCategory === "saved"
              ? "Your saved homes"
              : isDashboard
                ? "Homes for you"
                : "Popular homes in Australia"}
            {!loading &&
            (activeCategory === "saved" || filteredListings.length !== listings.length) ? (
              <span className="staySectionCount"> ({filteredListings.length} places)</span>
            ) : null}
          </h1>
          {loadError ? (
            <p className="stayError" role="alert">
              {loadError}
            </p>
          ) : loading ? (
            <div className="stayGrid stayGridSkeleton" aria-busy="true">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="stayCard stayCardSkeleton" />
              ))}
            </div>
          ) : filteredListings.length === 0 ? (
            <p className="stayEmpty">
              {activeCategory === "saved" ? (
                <>No saved homes yet — tap the heart on a listing to add it here. </>
              ) : (
                <>No homes match your filters. </>
              )}
              <button
                type="button"
                className="stayLinkButton"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("trending");
                }}
              >
                {activeCategory === "saved" ? "Browse all homes" : "Clear search and categories"}
              </button>
            </p>
          ) : (
            <div className="stayGrid">
              {filteredListings.map((p, index) => (
                <StayListingCard
                  key={p.id}
                  listing={p}
                  index={index}
                  guests={guests}
                  onToggleFavourite={toggleFavourite}
                />
              ))}
            </div>
          )}
        </section>

        <StayInspireSection onPickCategory={setActiveCategory} />
      </main>

      <StayFooter isDashboard={isDashboard} onLogout={handleLogout} />
    </div>
  );
}

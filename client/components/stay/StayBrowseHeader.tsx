import Link from "next/link";
import type { RefObject } from "react";
import type { User } from "@/lib/types";
import { GlobeIcon } from "./StayIcons";
import { StayBrandLink } from "./StayBrandLink";
import { StaySearchBar } from "./StaySearchBar";

type Props = {
  globeRef: RefObject<HTMLDivElement | null>;
  globeOpen: boolean;
  setGlobeOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  checkIn: string;
  setCheckIn: (v: string) => void;
  checkOut: string;
  setCheckOut: (v: string) => void;
  guests: number;
  setGuests: (n: number) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  isDashboard: boolean;
  loggedIn: boolean;
  firstName: string | null;
  me: User | null;
  onLogout: () => void;
};

export function StayBrowseHeader({
  globeRef,
  globeOpen,
  setGlobeOpen,
  searchQuery,
  setSearchQuery,
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
  guests,
  setGuests,
  onSearchSubmit,
  isDashboard,
  loggedIn,
  firstName,
  me,
  onLogout,
}: Props) {
  return (
    <header className="stayHeader">
      <div className="stayHeaderInner">
        <StayBrandLink />

        <StaySearchBar
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          checkIn={checkIn}
          onCheckInChange={setCheckIn}
          checkOut={checkOut}
          onCheckOutChange={setCheckOut}
          guests={guests}
          onGuestsChange={setGuests}
          onSubmit={onSearchSubmit}
        />

        <nav className="stayHeaderNav" aria-label="Account">
          <Link href="/register" className="stayHostBtnLink">
            Become a host
          </Link>
          <div className="stayGlobeWrap" ref={globeRef}>
            <button
              type="button"
              className="stayGlobe"
              aria-expanded={globeOpen}
              aria-haspopup="true"
              aria-label="Language and region"
              onClick={() => setGlobeOpen((o) => !o)}
            >
              <GlobeIcon />
            </button>
            {globeOpen ? (
              <div className="stayGlobeMenu" role="menu">
                <button type="button" className="stayGlobeMenuItem" role="menuitem">
                  English (AU)
                </button>
                <button type="button" className="stayGlobeMenuItem" role="menuitem">
                  AUD ($)
                </button>
              </div>
            ) : null}
          </div>
          {isDashboard ? (
            <div className="stayDashAccount">
              {firstName ? (
                <span className="stayDashGreeting" title={me?.email}>
                  Hi, {firstName}
                </span>
              ) : null}
              <span className="stayDashAvatar" aria-hidden>
                {(firstName ?? me?.email ?? "?").charAt(0).toUpperCase()}
              </span>
              <button type="button" className="stayLogoutBtn" onClick={onLogout}>
                Log out
              </button>
            </div>
          ) : (
            <div className="stayMenuCluster">
              <Link href={loggedIn ? "/dashboard" : "/login"} className="stayMenuBtn">
                <span className="stayMenuLines" aria-hidden>
                  <span />
                  <span />
                  <span />
                </span>
                <span className="stayAvatar" aria-hidden>
                  {loggedIn ? "✓" : "⌂"}
                </span>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

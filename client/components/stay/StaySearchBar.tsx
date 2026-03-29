import { SearchIcon } from "./StayIcons";

type Props = {
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  checkIn: string;
  onCheckInChange: (v: string) => void;
  checkOut: string;
  onCheckOutChange: (v: string) => void;
  guests: number;
  onGuestsChange: (n: number) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export function StaySearchBar({
  searchQuery,
  onSearchQueryChange,
  checkIn,
  onCheckInChange,
  checkOut,
  onCheckOutChange,
  guests,
  onGuestsChange,
  onSubmit,
}: Props) {
  return (
    <div className="staySearchWrap" role="search">
      <form className="staySearchPill staySearchForm" onSubmit={onSubmit}>
        <label className="staySearchSeg staySearchSegInput">
          <span className="staySearchLabel">Where</span>
          <input
            className="staySearchField"
            type="search"
            name="q"
            placeholder="Search destinations"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            autoComplete="off"
          />
        </label>
        <span className="staySearchDivider" aria-hidden />
        <label className="staySearchSeg staySearchSegMuted">
          <span className="staySearchLabel">Check in</span>
          <input
            className="staySearchField staySearchFieldDate"
            type="date"
            value={checkIn}
            onChange={(e) => onCheckInChange(e.target.value)}
          />
        </label>
        <span className="staySearchDivider" aria-hidden />
        <label className="staySearchSeg staySearchSegMuted">
          <span className="staySearchLabel">Check out</span>
          <input
            className="staySearchField staySearchFieldDate"
            type="date"
            value={checkOut}
            min={checkIn || undefined}
            onChange={(e) => onCheckOutChange(e.target.value)}
          />
        </label>
        <span className="staySearchDivider" aria-hidden />
        <label className="staySearchSeg staySearchSegMuted">
          <span className="staySearchLabel">Guests</span>
          <select
            className="staySearchField staySearchFieldGuests"
            value={guests}
            onChange={(e) => onGuestsChange(Number(e.target.value))}
            aria-label="Number of guests"
          >
            {Array.from({ length: 16 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} guest{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="staySearchGo" aria-label="Search">
          <SearchIcon />
        </button>
      </form>
    </div>
  );
}

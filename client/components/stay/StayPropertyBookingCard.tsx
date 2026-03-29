import { addDaysYmd, parseYmdStrict } from "@/lib/stay";
import type { StayBookingFormState } from "@/hooks/useStayBookingForm";

type Props = {
  pricePerNight: number;
  form: StayBookingFormState;
};

export function StayPropertyBookingCard({ pricePerNight, form }: Props) {
  const {
    bookingOpen,
    checkIn,
    checkOut,
    guests,
    setGuests,
    bookingDone,
    setBookingDone,
    todayYmd,
    maxYmd,
    nights,
    datesValid,
    estimatedTotal,
    openBooking,
    closeBookingPanel,
    requestDemoBook,
    onCheckInChange,
    onCheckOutChange,
  } = form;

  const checkInValid = parseYmdStrict(checkIn);

  return (
    <aside className="stayDetailBooking" aria-label="Booking">
      <div className="stayDetailBookingCard">
        <p className="stayDetailPriceBig">
          <strong>${pricePerNight}</strong> <span>night</span>
        </p>
        {!bookingOpen ? (
          <button type="button" className="stayDetailReserveBtn" onClick={openBooking}>
            Check availability
          </button>
        ) : bookingDone ? (
          <div className="stayDetailBookSuccess" role="status">
            <p className="stayDetailBookSuccessTitle">Request received (demo)</p>
            <p className="stayDetailBookSuccessLine">
              <strong>${pricePerNight}</strong> / night · <strong>{nights}</strong> night
              {nights !== 1 ? "s" : ""} · <strong>{guests}</strong> guest{guests !== 1 ? "s" : ""}
            </p>
            {estimatedTotal !== null ? (
              <p className="stayDetailBookSuccessTotal">
                Estimated <strong>${estimatedTotal.toLocaleString()}</strong> total before taxes
              </p>
            ) : null}
            <p className="stayDetailBookSuccessDates">
              {checkIn} → {checkOut}
            </p>
            <p className="stayDetailBookSuccessNote">
              This is a practice flow only. <strong>No payment was taken</strong> and{" "}
              <strong>no real reservation</strong> was created or sent to a host.
            </p>
            <div className="stayDetailBookSuccessActions">
              <button type="button" className="stayDetailReserveBtn" onClick={() => setBookingDone(false)}>
                Edit dates
              </button>
              <button type="button" className="stayDetailCollapseBtn" onClick={closeBookingPanel}>
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="stayDetailBookForm">
            <label className="stayDetailBookField">
              <span>Check-in</span>
              <input
                type="date"
                value={checkIn}
                min={todayYmd}
                max={maxYmd}
                onChange={(e) => onCheckInChange(e.target.value)}
              />
            </label>
            <label className="stayDetailBookField">
              <span>Check-out</span>
              <input
                type="date"
                value={checkOut}
                min={checkIn && parseYmdStrict(checkIn) ? (addDaysYmd(checkIn, 1) ?? todayYmd) : todayYmd}
                max={maxYmd}
                disabled={!checkInValid}
                aria-disabled={!checkInValid}
                onChange={(e) => onCheckOutChange(e.target.value)}
              />
            </label>
            <label className="stayDetailBookField">
              <span>Guests</span>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                aria-label="Guests"
              >
                {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            {estimatedTotal !== null && datesValid ? (
              <p className="stayDetailEstimate">
                <strong>${estimatedTotal.toLocaleString()}</strong> total before taxes (est.)
              </p>
            ) : (
              <p className="stayDetailEstimate stayDetailEstimateMuted">
                {!parseYmdStrict(checkIn)
                  ? "Choose a valid check-in date (today or later)."
                  : "Choose check-out at least one night after check-in."}
              </p>
            )}
            <button
              type="button"
              className="stayDetailReserveBtn"
              disabled={!datesValid}
              onClick={requestDemoBook}
            >
              Request to book
            </button>
            <button type="button" className="stayDetailCollapseBtn" onClick={closeBookingPanel}>
              Cancel
            </button>
          </div>
        )}
        {!bookingOpen || !bookingDone ? (
          <p className="stayDetailBookingHint">
            {!bookingOpen
              ? "Pick dates next — you won’t be charged (this is a demo)."
              : "Demo only — no real payment or reservation is processed."}
          </p>
        ) : null}
      </div>
    </aside>
  );
}

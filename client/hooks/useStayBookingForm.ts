import { useCallback, useState } from "react";
import {
  addDaysYmd,
  clampYmdToRange,
  nightsBetweenYmd,
  parseYmdStrict,
  todayYmdLocal,
} from "@/lib/stay";

export function useStayBookingForm(pricePerNight: number) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [bookingDone, setBookingDone] = useState(false);

  const todayYmd = todayYmdLocal();
  const maxYmd = addDaysYmd(todayYmd, 730) ?? todayYmd;

  const nights = nightsBetweenYmd(checkIn, checkOut);
  const datesValid = nights > 0;
  const estimatedTotal = datesValid ? nights * pricePerNight : null;

  const openBooking = useCallback(() => {
    setBookingDone(false);
    const t = todayYmdLocal();
    const inD = addDaysYmd(t, 1);
    const outD = inD ? addDaysYmd(inD, 2) : "";
    setCheckIn(inD ?? "");
    setCheckOut(outD ?? "");
    setBookingOpen(true);
  }, []);

  const closeBookingPanel = useCallback(() => {
    setBookingOpen(false);
    setBookingDone(false);
    setCheckIn("");
    setCheckOut("");
  }, []);

  const requestDemoBook = useCallback(() => {
    if (nightsBetweenYmd(checkIn, checkOut) <= 0) return;
    setBookingDone(true);
  }, [checkIn, checkOut]);

  const onCheckInChange = useCallback(
    (raw: string) => {
      setBookingDone(false);
      if (!raw) {
        setCheckIn("");
        return;
      }
      if (!parseYmdStrict(raw)) return;
      const t0 = todayYmdLocal();
      const max = addDaysYmd(t0, 730) ?? t0;
      const v = clampYmdToRange(raw, t0, max);
      setCheckIn(v);
      const minOut = addDaysYmd(v, 1);
      if (checkOut) {
        if (!parseYmdStrict(checkOut) || nightsBetweenYmd(v, checkOut) === 0) {
          setCheckOut(minOut ?? "");
        } else if (minOut && checkOut < minOut) {
          setCheckOut(minOut);
        }
      }
    },
    [checkOut]
  );

  const onCheckOutChange = useCallback(
    (raw: string) => {
      setBookingDone(false);
      if (!raw) {
        setCheckOut("");
        return;
      }
      if (!parseYmdStrict(raw)) return;
      const t0 = todayYmdLocal();
      const max = addDaysYmd(t0, 730) ?? t0;
      const minOut =
        checkIn && parseYmdStrict(checkIn)
          ? (addDaysYmd(checkIn, 1) ?? t0)
          : t0;
      let v = clampYmdToRange(raw, minOut, max);
      if (checkIn && nightsBetweenYmd(checkIn, v) === 0) {
        v = addDaysYmd(checkIn, 1) ?? v;
      }
      setCheckOut(v);
    },
    [checkIn]
  );

  return {
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
  };
}

export type StayBookingFormState = ReturnType<typeof useStayBookingForm>;

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ApiError, api } from "@/lib/api";
import { getToken } from "@/lib/auth-token";
import type { PublicProperty } from "@/lib/types";
import { listingGallerySecondUrl, listingImageUrl } from "@/lib/stay";
import { useStayBookingForm } from "@/hooks/useStayBookingForm";
import { StayBrandLink } from "./StayBrandLink";
import { StayPropertyBookingCard } from "./StayPropertyBookingCard";

type Props = {
  propertyId: number;
};

export function StayPropertyDetail({ propertyId }: Props) {
  const router = useRouter();
  const [property, setProperty] = useState<PublicProperty | null>(null);
  const [isFavourite, setIsFavourite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const bookingForm = useStayBookingForm(property?.pricePerNight ?? 0);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { property: p } = await api.publicProperty(propertyId);
      setProperty(p);
      if (getToken()) {
        try {
          const { properties } = await api.properties();
          const row = properties.find((x) => x.id === propertyId);
          setIsFavourite(row?.isFavourite ?? false);
        } catch {
          setIsFavourite(false);
        }
      } else {
        setIsFavourite(false);
      }
      if (typeof document !== "undefined") {
        document.title = `${p.title} · Stay`;
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setError("notfound");
      } else {
        setError(err instanceof ApiError ? err.message : "Could not load this home.");
      }
      setProperty(null);
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    void load();
  }, [load]);

  const toggleFavourite = useCallback(async () => {
    if (!getToken()) {
      router.push(`/login?next=/${propertyId}`);
      return;
    }
    try {
      if (isFavourite) {
        await api.removeFavourite(propertyId);
        setIsFavourite(false);
        setActionMsg("Removed from saved.");
      } else {
        await api.addFavourite(propertyId);
        setIsFavourite(true);
        setActionMsg("Saved to your list.");
      }
      window.setTimeout(() => setActionMsg(null), 2400);
    } catch (err) {
      setActionMsg(err instanceof ApiError ? err.message : "Something went wrong.");
    }
  }, [isFavourite, propertyId, router]);

  if (loading) {
    return (
      <div className="stayPage stayDetailPage">
        <header className="stayHeader">
          <div className="stayHeaderInner stayDetailHeaderInner">
            <StayBrandLink />
          </div>
        </header>
        <main className="stayDetailMain">
          <div className="stayDetailHeroSkeleton" aria-busy="true" />
        </main>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="stayPage stayDetailPage">
        <header className="stayHeader">
          <div className="stayHeaderInner stayDetailHeaderInner">
            <StayBrandLink variant="wordmark" />
          </div>
        </header>
        <main className="stayDetailMain">
          <p className="stayError">
            {error === "notfound" ? "This listing is not available." : (error ?? "Something went wrong.")}
          </p>
          <Link href="/" className="stayDetailBackLink">
            ← Back to homes
          </Link>
        </main>
      </div>
    );
  }

  const p = property;

  return (
    <div className="stayPage stayDetailPage">
      <header className="stayHeader">
        <div className="stayHeaderInner stayDetailHeaderInner">
          <StayBrandLink />
          <nav className="stayDetailHeaderNav">
            <Link href="/" className="stayDetailBackBtn">
              ← All homes
            </Link>
            {getToken() ? (
              <Link href="/dashboard" className="stayDetailBackBtn">
                Dashboard
              </Link>
            ) : null}
          </nav>
        </div>
      </header>

      <main className="stayDetailMain">
        {actionMsg ? <p className="stayActionToast">{actionMsg}</p> : null}

        <div className="stayDetailGallery">
          <div className="stayDetailHero">
            <Image
              src={listingImageUrl(p.id)}
              alt=""
              fill
              className="stayDetailHeroImg"
              sizes="(max-width: 1100px) 100vw, 70vw"
              priority
            />
          </div>
          <div className="stayDetailSide">
            <div className="stayDetailSideImg">
              <Image
                src={listingGallerySecondUrl(p.id)}
                alt=""
                fill
                className="stayDetailHeroImg"
                sizes="(max-width: 1100px) 50vw, 30vw"
              />
            </div>
            <div className="stayDetailSideImg">
              <Image
                src={listingImageUrl(p.id + 100)}
                alt=""
                fill
                className="stayDetailHeroImg"
                sizes="(max-width: 1100px) 50vw, 30vw"
              />
            </div>
          </div>
        </div>

        <div className="stayDetailContent">
          <div className="stayDetailPrimary">
            <div className="stayDetailTitleRow">
              <div>
                <h1 className="stayDetailTitle">{p.title}</h1>
                <p className="stayDetailAddress">{p.address}</p>
              </div>
              <div className="stayDetailTitleActions">
                <button
                  type="button"
                  className={`stayFavBtn stayDetailFav${isFavourite ? " stayFavBtnOn" : ""}`}
                  onClick={() => void toggleFavourite()}
                  aria-label={isFavourite ? "Remove from saved" : "Save"}
                >
                  {isFavourite ? "♥" : "♡"}
                </button>
              </div>
            </div>
            <p className="stayDetailMeta">
              <span className="stayDetailRating">
                <span aria-hidden>★</span> {p.rating} · {p.reviewCount} reviews
              </span>
            </p>
            <div className="stayDetailDivider" />
            <section className="stayDetailSection">
              <h2>About this place</h2>
              <p className="stayDetailDesc">
                Relax in this thoughtfully designed space. Great location, natural light, and everything you need
                for a comfortable stay. Self check-in and flexible cancellation on select dates.
              </p>
            </section>
            <section className="stayDetailSection">
              <h2>Where you&apos;ll be</h2>
              <p className="stayDetailDesc">{p.address}</p>
            </section>
          </div>

          <StayPropertyBookingCard pricePerNight={p.pricePerNight} form={bookingForm} />
        </div>
      </main>
    </div>
  );
}

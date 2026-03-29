import Image from "next/image";
import Link from "next/link";
import { listingImageUrl, type ListingRow } from "@/lib/stay";

type Props = {
  listing: ListingRow;
  index: number;
  guests: number;
  onToggleFavourite: (propertyId: number, e: React.MouseEvent) => void;
};

export function StayListingCard({ listing: p, index, guests, onToggleFavourite }: Props) {
  return (
    <article className="stayCard">
      <Link href={`/${p.id}`} className="stayCardLink">
        <div className="stayCardImageWrap">
          <Image
            src={listingImageUrl(p.id)}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 25vw"
            className="stayCardImage"
            priority={index < 4}
          />
          <button
            type="button"
            className={`stayFavBtn${p.isFavourite ? " stayFavBtnOn" : ""}`}
            aria-label={p.isFavourite ? "Remove from favourites" : "Save to favourites"}
            onClick={(e) => void onToggleFavourite(p.id, e)}
          >
            {p.isFavourite ? "♥" : "♡"}
          </button>
        </div>
        <div className="stayCardBody">
          <div className="stayCardTop">
            <h2 className="stayCardTitle">{p.title}</h2>
            <div className="stayCardRating" title={`${p.rating} out of 5`}>
              <span aria-hidden>★</span> {p.rating}{" "}
              <span className="stayCardReviews">({p.reviewCount})</span>
            </div>
          </div>
          <p className="stayCardAddress">{p.address}</p>
          <p className="stayCardPrice">
            <strong>${p.pricePerNight}</strong> <span>night</span>
            {guests > 1 ? (
              <span className="stayCardGuestHint">
                {" "}
                · est. ${p.pricePerNight * guests} for {guests} guests
              </span>
            ) : null}
          </p>
        </div>
      </Link>
    </article>
  );
}

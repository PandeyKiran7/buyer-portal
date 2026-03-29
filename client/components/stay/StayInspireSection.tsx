import Link from "next/link";
import type { BrowseCategoryId } from "./StayCategoryStrip";

type Props = {
  onPickCategory: (c: BrowseCategoryId) => void;
};

export function StayInspireSection({ onPickCategory }: Props) {
  return (
    <section className="stayInspire">
      <div className="stayInspireInner">
        <h2>Inspiration for future getaways</h2>
        <div className="stayInspireGrid">
          <div>
            <h3>Popular</h3>
            <ul>
              <li>
                <Link href="/?q=Melbourne">Melbourne</Link>
              </li>
              <li>
                <Link href="/?q=Sydney">Sydney</Link>
              </li>
              <li>
                <Link href="/?q=Brisbane">Brisbane</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3>Arts & culture</h3>
            <ul>
              <li>
                <button type="button" className="stayLinkButton" onClick={() => onPickCategory("design")}>
                  Design stays
                </button>
              </li>
              <li>
                <button type="button" className="stayLinkButton" onClick={() => onPickCategory("city")}>
                  City breaks
                </button>
              </li>
              <li>
                <button type="button" className="stayLinkButton" onClick={() => onPickCategory("country")}>
                  Countryside
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h3>Outdoors</h3>
            <ul>
              <li>
                <button type="button" className="stayLinkButton" onClick={() => onPickCategory("beach")}>
                  Beach
                </button>
              </li>
              <li>
                <button type="button" className="stayLinkButton" onClick={() => onPickCategory("camping")}>
                  Camping
                </button>
              </li>
              <li>
                <button type="button" className="stayLinkButton" onClick={() => onPickCategory("cabins")}>
                  Cabins
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

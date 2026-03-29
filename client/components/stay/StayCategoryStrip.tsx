import { STAY_CATEGORIES, type StayCategoryId } from "@/lib/stay";

export type BrowseCategoryId = StayCategoryId | "saved";

type Props = {
  activeCategory: BrowseCategoryId;
  onSelectCategory: (c: BrowseCategoryId) => void;
  savedCount: number;
  showSavedTab: boolean;
};

export function StayCategoryStrip({
  activeCategory,
  onSelectCategory,
  savedCount,
  showSavedTab,
}: Props) {
  return (
    <section className="stayCategories" aria-label="Browse by category">
      <div className="stayCatScroll">
        {showSavedTab ? (
          <button
            type="button"
            className={`stayCatItem${activeCategory === "saved" ? " stayCatItemActive" : ""}`}
            onClick={() => onSelectCategory("saved")}
            aria-pressed={activeCategory === "saved"}
          >
            <span className="stayCatIcon" aria-hidden>
              ♥
            </span>
            <span className="stayCatLabel">
              Saved{savedCount > 0 ? ` (${savedCount})` : ""}
            </span>
          </button>
        ) : null}
        {STAY_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`stayCatItem${activeCategory === c.id ? " stayCatItemActive" : ""}`}
            onClick={() => onSelectCategory(c.id)}
            aria-pressed={activeCategory === c.id}
          >
            <span className="stayCatIcon" aria-hidden>
              {c.icon}
            </span>
            <span className="stayCatLabel">{c.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

import type { PublicProperty } from "@/lib/types";

export const STAY_CATEGORIES = [
  { id: "trending", label: "Trending", icon: "✦" },
  { id: "beach", label: "Beach", icon: "⌂" },
  { id: "cabins", label: "Cabins", icon: "▣" },
  { id: "country", label: "Countryside", icon: "◇" },
  { id: "pools", label: "Amazing pools", icon: "◎" },
  { id: "design", label: "Design", icon: "◈" },
  { id: "city", label: "City", icon: "▤" },
  { id: "camping", label: "Camping", icon: "△" },
] as const;

export type StayCategoryId = (typeof STAY_CATEGORIES)[number]["id"];

export type ListingRow = PublicProperty & { isFavourite: boolean };

export function listingImageUrl(id: number) {
  return `https://picsum.photos/seed/stayhub${id}/640/480`;
}

export function listingGallerySecondUrl(id: number) {
  return `https://picsum.photos/seed/stayhub${id}b/960/640`;
}

export function filterBySearch(items: PublicProperty[], q: string) {
  const s = q.trim().toLowerCase();
  if (!s) return items;
  return items.filter(
    (p) => p.title.toLowerCase().includes(s) || p.address.toLowerCase().includes(s)
  );
}

const CATEGORY_RULES: Partial<Record<StayCategoryId, RegExp>> = {
  beach: /coastal|ocean|beach|sea|surf/i,
  cabins: /loft|cabin|wood/i,
  country: /garden|terrace|cottage|country|rural/i,
  pools: /pool/i,
  design: /view|design|apartment|loft|modern/i,
  city: /city|queen|brisbane|sydney|melbourne|perth|wharf|cbd/i,
  camping: /camp|coastal|trail/i,
};

export function applyCategory(items: PublicProperty[], cat: StayCategoryId): PublicProperty[] {
  if (cat === "trending") {
    return [...items].sort(
      (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount
    );
  }
  const rx = CATEGORY_RULES[cat];
  if (!rx) return items;
  return items.filter((p) => rx.test(`${p.title} ${p.address}`));
}

export function mergeListings(
  publicRows: PublicProperty[],
  favouriteIds: Set<number>
): ListingRow[] {
  return publicRows.map((p) => ({
    ...p,
    isFavourite: favouriteIds.has(p.id),
  }));
}

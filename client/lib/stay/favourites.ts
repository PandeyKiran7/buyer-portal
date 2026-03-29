import { api } from "@/lib/api";
import { getToken } from "@/lib/auth-token";

export async function fetchFavouritePropertyIds(): Promise<Set<number>> {
  if (!getToken()) return new Set();
  const { properties } = await api.properties();
  return new Set(properties.filter((p) => p.isFavourite).map((p) => p.id));
}

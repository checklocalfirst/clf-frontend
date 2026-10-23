import { apiFetch, type Paginated } from "../api";

// One row per distinct miss, sorted by `misses`. `query` is null for category- or
// location-only browses that came back empty.
export interface SearchMissSummary {
  query: string | null;
  category_slug: string | null;
  misses: number;
  last_seen: string;
  did_you_mean: string | null;
}

export interface SearchMiss {
  id: number;
  query: string | null;
  category_slug: string | null;
  had_location: boolean;
  did_you_mean: string | null;
  created_at: string;
}

export function getTopSearchMisses(
  token: string,
  params: { days?: number; limit?: number } = {}
): Promise<SearchMissSummary[]> {
  const qs = new URLSearchParams();
  if (params.days) qs.set("days", String(params.days));
  if (params.limit) qs.set("limit", String(params.limit));
  const query = qs.toString();
  return apiFetch<SearchMissSummary[]>(`/admin/search-misses${query ? `?${query}` : ""}`, { token });
}

export function getRecentSearchMisses(
  token: string,
  params: { page?: number; limit?: number } = {}
): Promise<Paginated<SearchMiss>> {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  const query = qs.toString();
  return apiFetch<Paginated<SearchMiss>>(`/admin/search-misses/recent${query ? `?${query}` : ""}`, { token });
}

import { apiFetch } from "./api";
import type { Business } from "./directory";

export interface Favorite {
  id: number;
  user_id: string;
  business_id: number;
  created_at: string;
  businesses: Business;
}

export function getFavorites(token: string): Promise<Favorite[]> {
  return apiFetch<Favorite[]>("/favorites", { token });
}

export function addFavorite(token: string, business_id: number): Promise<Favorite> {
  return apiFetch<Favorite>("/favorites", {
    method: "POST",
    token,
    body: JSON.stringify({ business_id }),
  });
}

export function removeFavorite(token: string, business_id: number): Promise<void> {
  return apiFetch<void>(`/favorites/${business_id}`, {
    method: "DELETE",
    token,
  });
}

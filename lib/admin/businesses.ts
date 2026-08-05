import { apiFetch, type Paginated } from "../api";
import type { Business, BusinessStatus, BusinessTier, Category, Service, Photo } from "../directory";
import type { BusinessProfileInput } from "../business-dashboard";

export function listAdminBusinesses(
  token: string,
  params: { page?: number; limit?: number } = {}
): Promise<Paginated<Business>> {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  const query = qs.toString();
  return apiFetch<Paginated<Business>>(`/admin/businesses${query ? `?${query}` : ""}`, { token });
}

export function getAdminBusiness(token: string, id: number): Promise<Business> {
  return apiFetch<Business>(`/admin/businesses/${id}`, { token });
}

export interface BusinessFull extends Business {
  categories: Category[];
  services: Service[];
  photos: Photo[];
}

// The backend nests the business row under `business` alongside its related
// arrays, rather than merging it flat — unwrap that shape here so every
// consumer of getAdminBusinessFull can keep treating BusinessFull as flat.
interface AdminBusinessFullResponse {
  business: Business;
  categories: Category[];
  services: Service[];
  photos: Photo[];
}

export async function getAdminBusinessFull(token: string, id: number): Promise<BusinessFull> {
  const { business, categories, services, photos } = await apiFetch<AdminBusinessFullResponse>(
    `/admin/businesses/${id}/full`,
    { token }
  );
  return { ...business, categories, services, photos };
}

export function updateBusinessStatus(
  token: string,
  id: number,
  status: BusinessStatus
): Promise<Business> {
  return apiFetch<Business>(`/admin/businesses/${id}/status`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ status }),
  });
}

export interface AdminBusinessEditInput extends BusinessProfileInput {
  business_tier?: BusinessTier;
  is_comped?: boolean;
  latitude?: number;
  longitude?: number;
  neighborhood?: string;
}

export function updateBusinessFull(
  token: string,
  id: number,
  patch: AdminBusinessEditInput
): Promise<Business> {
  return apiFetch<Business>(`/admin/businesses/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(patch),
  });
}

export function setPilot(token: string, id: number, pilot_business: boolean): Promise<Business> {
  return apiFetch<Business>(`/admin/businesses/${id}/pilot`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ pilot_business }),
  });
}

export function setFeatured(token: string, id: number, is_featured: boolean): Promise<Business> {
  return apiFetch<Business>(`/admin/businesses/${id}/featured`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ is_featured }),
  });
}

export function setCarousel(token: string, id: number, in_carousel: boolean): Promise<Business> {
  return apiFetch<Business>(`/admin/businesses/${id}/carousel`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ in_carousel }),
  });
}

export function updateAdminBusinessCategories(
  token: string,
  id: number,
  category_ids: number[]
): Promise<Category[]> {
  return apiFetch<Category[]>(`/admin/businesses/${id}/categories`, {
    method: "PUT",
    token,
    body: JSON.stringify({ category_ids }),
  });
}

export function deleteAdminBusiness(token: string, id: number): Promise<void> {
  return apiFetch<void>(`/admin/businesses/${id}`, {
    method: "DELETE",
    token,
  });
}

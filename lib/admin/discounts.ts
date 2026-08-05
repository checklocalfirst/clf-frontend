import { apiFetch, type Paginated } from "../api";
import type { Discount, DiscountInput, Redemption } from "../business-dashboard";

export interface AdminDiscount extends Discount {
  businesses: { name: string; slug: string };
}

export function listAdminDiscounts(
  token: string,
  params: { page?: number; limit?: number } = {}
): Promise<Paginated<AdminDiscount>> {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  const query = qs.toString();
  return apiFetch<Paginated<AdminDiscount>>(`/admin/discounts${query ? `?${query}` : ""}`, { token });
}

export function getAdminDiscount(token: string, id: number): Promise<AdminDiscount> {
  return apiFetch<AdminDiscount>(`/admin/discounts/${id}`, { token });
}

export function updateAdminDiscount(
  token: string,
  id: number,
  patch: Partial<DiscountInput>
): Promise<AdminDiscount> {
  return apiFetch<AdminDiscount>(`/admin/discounts/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(patch),
  });
}

export function deleteAdminDiscount(token: string, id: number): Promise<void> {
  return apiFetch<void>(`/admin/discounts/${id}`, {
    method: "DELETE",
    token,
  });
}

export function createBusinessDiscount(
  token: string,
  businessId: number,
  input: DiscountInput
): Promise<Discount> {
  return apiFetch<Discount>(`/admin/businesses/${businessId}/discounts`, {
    method: "POST",
    token,
    body: JSON.stringify(input),
  });
}

export function listBusinessDiscounts(token: string, businessId: number): Promise<Discount[]> {
  return apiFetch<Discount[]>(`/admin/businesses/${businessId}/discounts`, { token });
}

// Read-only — no admin-side mark-used/delete route exists yet.
export function getAdminDiscountRedemptions(token: string, discountId: number): Promise<Redemption[]> {
  return apiFetch<Redemption[]>(`/admin/discounts/${discountId}/redemptions`, { token });
}

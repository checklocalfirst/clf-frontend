import { apiFetch } from "./api";
import type { Business, Category, Service } from "./directory";

export interface BusinessProfileInput {
  name?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  email?: string;
  website_url?: string;
  about_owner?: string;
  facebook_url?: string;
  instagram_url?: string;
  yelp_url?: string;
  // premium-only — a basic-tier business gets a 403 if these are present at all,
  // so omit the keys entirely rather than sending them as empty/undefined
  timeline_year_1?: string;
  timeline_year_2?: string;
  timeline_year_3?: string;
  timeline_description_1?: string;
  timeline_description_2?: string;
  timeline_description_3?: string;
}

export function getMyBusiness(token: string): Promise<Business> {
  return apiFetch<Business>("/businesses/me", { token });
}

export function updateMyBusiness(
  token: string,
  slug: string,
  patch: BusinessProfileInput
): Promise<Business> {
  return apiFetch<Business>(`/businesses/${encodeURIComponent(slug)}`, {
    method: "PUT",
    token,
    body: JSON.stringify(patch),
  });
}

export function updateMyCategories(
  token: string,
  slug: string,
  category_ids: number[]
): Promise<Category[]> {
  return apiFetch<Category[]>(`/businesses/${encodeURIComponent(slug)}/categories`, {
    method: "PUT",
    token,
    body: JSON.stringify({ category_ids }),
  });
}

export interface ServiceInput {
  name: string;
  description?: string;
  category_id: number;
}

export function createService(token: string, slug: string, input: ServiceInput): Promise<Service> {
  return apiFetch<Service>(`/businesses/${encodeURIComponent(slug)}/services`, {
    method: "POST",
    token,
    body: JSON.stringify(input),
  });
}

export function updateService(
  token: string,
  slug: string,
  id: number,
  input: ServiceInput
): Promise<Service> {
  return apiFetch<Service>(`/businesses/${encodeURIComponent(slug)}/services/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(input),
  });
}

export function deleteService(token: string, slug: string, id: number): Promise<void> {
  return apiFetch<void>(`/businesses/${encodeURIComponent(slug)}/services/${id}`, {
    method: "DELETE",
    token,
  });
}

export interface Discount {
  id: number;
  business_id: number;
  code: string;
  description: string;
  discount_type: "percent" | "fixed";
  value: number;
  starts_at: string | null;
  expires_at: string | null;
  max_redemptions: number | null;
  times_redeemed: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// Public discount cards omit `code` and only ever show active, in-window discounts —
// this is what the business dashboard falls back to for its own listing (see note in
// app/dashboard/discounts/page.tsx: there's no owner-scoped GET route documented yet).
export interface PublicDiscount {
  id: number;
  description: string;
  discount_type: "percent" | "fixed";
  value: number;
  starts_at: string | null;
  expires_at: string | null;
  active: boolean;
}

export function getPublicDiscounts(slug: string): Promise<PublicDiscount[]> {
  return apiFetch<PublicDiscount[]>(`/businesses/${encodeURIComponent(slug)}/discounts`);
}

// The "reveal code" button on a business's public page. Gated on the requesting
// user's own premium status (403 PREMIUM_REQUIRED otherwise). Idempotent — hitting
// it again after already redeeming just re-returns the same code.
export function redeemDiscount(
  token: string,
  slug: string,
  discountId: number
): Promise<{ code: string }> {
  return apiFetch<{ code: string }>(
    `/businesses/${encodeURIComponent(slug)}/discounts/${discountId}/redeem`,
    { method: "POST", token }
  );
}

export interface DiscountInput {
  code: string;
  description: string;
  discount_type: "percent" | "fixed";
  value: number;
  starts_at?: string;
  expires_at?: string;
  max_redemptions?: number;
  active?: boolean;
}

export function createDiscount(
  token: string,
  slug: string,
  input: DiscountInput
): Promise<Discount> {
  return apiFetch<Discount>(`/businesses/${encodeURIComponent(slug)}/discounts`, {
    method: "POST",
    token,
    body: JSON.stringify(input),
  });
}

export function updateDiscount(
  token: string,
  slug: string,
  id: number,
  input: Partial<DiscountInput>
): Promise<Discount> {
  return apiFetch<Discount>(`/businesses/${encodeURIComponent(slug)}/discounts/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(input),
  });
}

export function deleteDiscount(token: string, slug: string, id: number): Promise<void> {
  return apiFetch<void>(`/businesses/${encodeURIComponent(slug)}/discounts/${id}`, {
    method: "DELETE",
    token,
  });
}

export type AnalyticsEventType =
  | "call_click"
  | "email_click"
  | "page_view"
  | "address_click"
  | "website_click"
  | "discount_click"
  | "facebook_click"
  | "instagram_click"
  | "yelp_click";

export type AnalyticsSeries = Partial<Record<AnalyticsEventType, Record<string, number>>>;

export function getBusinessAnalytics(
  token: string,
  slug: string,
  from?: string,
  to?: string
): Promise<AnalyticsSeries> {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  const qs = params.toString();
  return apiFetch<AnalyticsSeries>(
    `/businesses/${encodeURIComponent(slug)}/analytics${qs ? `?${qs}` : ""}`,
    { token }
  );
}

// Unlike the checkout routes, upgrade charges the card already on file immediately —
// no client_secret/Stripe Elements step, per doc §3 ("charges the prorated difference
// immediately"). Caller must handle 409 (already premium) and 402 (card declined).
export function upgradeBusinessTier(token: string, slug: string): Promise<Business> {
  return apiFetch<Business>(`/stripe/business/${encodeURIComponent(slug)}/upgrade`, {
    method: "POST",
    token,
  });
}

export function cancelBusinessTier(token: string, slug: string): Promise<{ cancel_at: string }> {
  return apiFetch<{ cancel_at: string }>(`/stripe/business/${encodeURIComponent(slug)}/cancel`, {
    method: "POST",
    token,
  });
}

export function deleteMyBusiness(token: string, slug: string): Promise<void> {
  return apiFetch<void>(`/businesses/${encodeURIComponent(slug)}`, {
    method: "DELETE",
    token,
  });
}

export interface Redemption {
  id: number;
  discount_id: number;
  user_id: string;
  redeemed_at: string;
  used: boolean;
  used_at: string | null;
  users: { first_name: string; last_name: string; email: string };
  // present on the aggregate route (getAllRedemptions) and the admin route, not the per-discount one
  discounts?: { code: string; description: string };
}

export function getDiscountRedemptions(
  token: string,
  slug: string,
  discountId: number
): Promise<Redemption[]> {
  return apiFetch<Redemption[]>(
    `/businesses/${encodeURIComponent(slug)}/discounts/${discountId}/redemptions`,
    { token }
  );
}

// Convenience aggregate — every redemption across all of this business's discounts.
// Preferred over per-discount fetches when building one unified redemptions table.
export function getAllRedemptions(token: string, slug: string): Promise<Redemption[]> {
  return apiFetch<Redemption[]>(`/businesses/${encodeURIComponent(slug)}/redemptions`, { token });
}

// Bookkeeping only — marks that the business saw the customer redeem in person.
// Does not affect the underlying one-redemption-per-user-per-discount rule.
export function markRedemptionUsed(
  token: string,
  slug: string,
  discountId: number,
  redemptionId: number,
  used: boolean
): Promise<Redemption> {
  return apiFetch<Redemption>(
    `/businesses/${encodeURIComponent(slug)}/discounts/${discountId}/redemptions/${redemptionId}`,
    { method: "PATCH", token, body: JSON.stringify({ used }) }
  );
}

// Unlike marking used, this frees the customer to redeem the same discount again —
// it deletes the uniqueness-check record, not just a bookkeeping flag.
export function deleteRedemption(
  token: string,
  slug: string,
  discountId: number,
  redemptionId: number
): Promise<void> {
  return apiFetch<void>(
    `/businesses/${encodeURIComponent(slug)}/discounts/${discountId}/redemptions/${redemptionId}`,
    { method: "DELETE", token }
  );
}

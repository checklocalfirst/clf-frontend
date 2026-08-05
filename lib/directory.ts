import { apiFetch, type Paginated } from "./api";
import type { AnalyticsEventType } from "./business-dashboard";

export type BusinessStatus = "pending" | "approved" | "suspended" | "rejected";
export type BusinessTier = "basic" | "premium";

export interface Business {
  id: number;
  owner_user_id: string;
  name: string;
  description: string | null;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  slug: string;
  status: BusinessStatus;
  business_tier: BusinessTier;
  is_comped: boolean;
  is_featured: boolean;
  featured_since: string | null;
  in_carousel: boolean;
  pilot_business?: boolean;
  website_url: string | null;
  about_owner: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  yelp_url: string | null;
  // premium-only fields — present on the row regardless of tier, but the backend
  // rejects writes to them from a basic-tier business (doc §5)
  timeline_year_1: string | null;
  timeline_year_2: string | null;
  timeline_year_3: string | null;
  timeline_description_1: string | null;
  timeline_description_2: string | null;
  timeline_description_3: string | null;
  latitude?: number | null;
  longitude?: number | null;
  neighborhood?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: number;
  business_id: number;
  category_id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ServiceWithBusiness extends Service {
  businesses: { name: string; slug: string };
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface SearchResult {
  business: Business;
  bestMatch: Service;
  matchingServices: Service[];
  matchCount: number;
}

export interface EnrichedBusiness extends Business {
  categoryNames: string[];
  isNew: boolean;
}

export type PhotoType = "listing" | "owner" | "gallery" | "timeline";

export interface Photo {
  id: number;
  business_id: number;
  photo_url: string;
  photo_type: PhotoType;
  timeline_slot: 1 | 2 | 3 | null;
  display_order: number;
  approved: boolean;
  created_at: string;
}

export function getBusinessPhotos(slug: string): Promise<Photo[]> {
  return apiFetch<Photo[]>(`/businesses/${encodeURIComponent(slug)}/photos`);
}

// Best-effort thumbnail for cards/listings — falls back to undefined so callers can
// show a placeholder background instead of breaking when a business has no photos yet.
export async function getListingPhotoUrl(slug: string): Promise<string | undefined> {
  const photos = await getBusinessPhotos(slug).catch(() => [] as Photo[]);
  const approved = photos
    .filter((p) => p.approved)
    .sort((a, b) => a.display_order - b.display_order);
  const listing = approved.find((p) => p.photo_type === "listing") ?? approved[0];
  return listing?.photo_url;
}

export function getBusinesses(): Promise<Business[]> {
  return apiFetch<Business[]>("/businesses");
}

export function getBusinessBySlug(slug: string): Promise<Business> {
  return apiFetch<Business>(`/businesses/${encodeURIComponent(slug)}`);
}

// Only one business can be featured at a time — null when none is set.
export function getFeaturedBusiness(): Promise<Business | null> {
  return apiFetch<Business | null>("/businesses/featured");
}

// Public, no auth, fire-and-forget — never throws, so a tracking failure can't
// break the page or delay whatever action (dialer, navigation) triggered it.
export async function trackBusinessEvent(
  slug: string,
  event_type: AnalyticsEventType
): Promise<void> {
  await apiFetch<void>(`/businesses/${encodeURIComponent(slug)}/track`, {
    method: "POST",
    body: JSON.stringify({ event_type }),
  }).catch(() => {});
}

export function getBusinessServices(slug: string): Promise<Service[]> {
  return apiFetch<Service[]>(`/businesses/${encodeURIComponent(slug)}/services`);
}

export function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>("/categories");
}

export function getBusinessCategories(slug: string): Promise<Category[]> {
  return apiFetch<Category[]>(`/businesses/${encodeURIComponent(slug)}/categories`);
}

export function getAllServices(): Promise<ServiceWithBusiness[]> {
  return apiFetch<ServiceWithBusiness[]>("/services");
}

export function searchBusinesses(
  q?: string,
  category?: string,
  page?: number
): Promise<Paginated<SearchResult>> {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (category) params.set("category", category);
  if (page) params.set("page", String(page));
  return apiFetch<Paginated<SearchResult>>(`/search?${params.toString()}`);
}

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export function isNewBusiness(createdAt: string): boolean {
  return Date.now() - new Date(createdAt).getTime() < THIRTY_DAYS_MS;
}

// Categories live on services, not businesses — join in memory (small, unpaginated dataset)
export async function getEnrichedBusinesses(): Promise<EnrichedBusiness[]> {
  const [businesses, services, categories] = await Promise.all([
    getBusinesses(),
    getAllServices(),
    getCategories(),
  ]);

  const categoryNameById = new Map(categories.map((c) => [c.id, c.name]));
  const categoryNamesBySlug = new Map<string, Set<string>>();
  for (const service of services) {
    const slug = service.businesses?.slug;
    const categoryName = categoryNameById.get(service.category_id);
    if (!slug || !categoryName) continue;
    const set = categoryNamesBySlug.get(slug) ?? new Set<string>();
    set.add(categoryName);
    categoryNamesBySlug.set(slug, set);
  }

  return businesses
    .map((business) => ({
      ...business,
      categoryNames: Array.from(categoryNamesBySlug.get(business.slug) ?? []),
      isNew: isNewBusiness(business.created_at),
    }))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

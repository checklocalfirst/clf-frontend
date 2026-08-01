import { apiFetch } from "./api";

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

export function getBusinesses(): Promise<Business[]> {
  return apiFetch<Business[]>("/businesses");
}

export function getBusinessBySlug(slug: string): Promise<Business> {
  return apiFetch<Business>(`/businesses/${encodeURIComponent(slug)}`);
}

export function getBusinessServices(slug: string): Promise<Service[]> {
  return apiFetch<Service[]>(`/businesses/${encodeURIComponent(slug)}/services`);
}

export function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>("/categories");
}

export function getAllServices(): Promise<ServiceWithBusiness[]> {
  return apiFetch<ServiceWithBusiness[]>("/services");
}

export function searchBusinesses(q?: string, category?: string): Promise<SearchResult[]> {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (category) params.set("category", category);
  return apiFetch<SearchResult[]>(`/search?${params.toString()}`);
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

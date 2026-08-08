import type { MetadataRoute } from "next";
import { getBusinesses } from "@/lib/directory";
import { getSiteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/businesses`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/search`, changeFrequency: "daily", priority: 0.8 },
    { url: `${siteUrl}/membership/businesses`, changeFrequency: "monthly", priority: 0.5 },
  ];

  // GET /businesses only ever returns approved businesses (lib/directory.ts), so
  // nothing pending/suspended/rejected — and therefore un-viewable — ends up here.
  const businesses = await getBusinesses().catch(() => []);
  const businessRoutes: MetadataRoute.Sitemap = businesses.map((business) => ({
    url: `${siteUrl}/businesses/${business.slug}`,
    lastModified: business.updated_at,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...businessRoutes];
}

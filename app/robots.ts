import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Vercel sets VERCEL_ENV to "production" | "preview" | "development" — keep
  // preview/branch deployments out of search entirely so they don't compete with
  // (or get mistaken for) the real site.
  const isProduction = !process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production";

  if (!isProduction) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Auth-gated dashboards — nothing here is meaningful to a crawler without a session.
      disallow: ["/dashboard", "/admin", "/account"],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}

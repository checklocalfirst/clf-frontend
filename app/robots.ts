import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
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

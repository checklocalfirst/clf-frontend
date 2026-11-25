import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Vercel bills each unique (image × width × quality × format) as a
    // transformation, and re-transforms when the cache expires. Keep the
    // number of variants small and cache them for a long time.
    // Note: if a file is ever overwritten at the same URL, the old optimized
    // version can be served for up to the TTL — upload replacements under a new name.
    minimumCacheTTL: 2678400, // 31 days (default is 4 hours)
    deviceSizes: [640, 828, 1200, 1920], // default has 8 widths up to 3840
    imageSizes: [128, 256, 384], // default has 7 widths
    qualities: [75],
    formats: ["image/webp"],
    remotePatterns: [
      // Supabase Storage — business listing/owner/gallery/timeline photos
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // Figma CDN — placeholder assets referenced directly by URL
      {
        protocol: "https",
        hostname: "www.figma.com",
        pathname: "/api/mcp/asset/**",
      },
    ],
  },
};

export default nextConfig;

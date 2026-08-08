// Vercel injects VERCEL_PROJECT_PRODUCTION_URL automatically — no manual config needed
// on Vercel. Set NEXT_PUBLIC_SITE_URL to override (e.g. once a custom domain is live).
export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000")
  );
}

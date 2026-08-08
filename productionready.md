# Production Readiness — Outstanding Items

Audited 2026-08-05 by reading the actual code (not `plan.md`, which is stale —
most of its "still needed" items are already built).

## Real blockers before going live

1. **Stripe is in test mode.** `.env.local` has `pk_test_...`. Swap to a live
   publishable key in production env vars, and confirm the backend has its
   live secret key + live webhook endpoint configured too.
2. **Backend CORS allowlist.** Per `clfbackendroutesandinfo.md`, the Render
   backend locks CORS to an allowlist. The real production domain (and
   Vercel's domain) must be added to its `ALLOWED_ORIGINS` env var or every
   fetch will fail with a CORS error once live. This is a backend-side change.
3. **No global 401 handling.** `apiFetch` (`lib/api.ts`) throws `ApiError` on
   a 401, but nothing catches it app-wide — access tokens expire in ~1hr with
   no refresh flow (per backend docs), so users will hit dead pages/broken
   fetches until they manually log back in. Add one interceptor that clears
   the session and redirects to `/login` on any 401.
4. **No root-level `error.tsx` / `global-error.tsx`.** `account`, `dashboard`,
   and `admin` have error boundaries, but a crash on `/`, `/businesses`,
   `/search`, etc. shows Next's default error screen, not app UI.

## Worth fixing, not launch-blocking

5. **11 ESLint errors**, all `react-hooks/set-state-in-effect` (in
   `Header.tsx`, `lib/auth.tsx`, `lib/useApiResource.ts`). `next build`
   doesn't fail on them currently, but they flag a real pattern (setState
   synchronously inside effects) more likely to bite under React 19. Cheap
   fix.
6. **No OG/social share image.** `app/layout.tsx` metadata has title/
   description but no image — shared links on iMessage/Slack/Twitter will
   look bare. Add an `opengraph-image` file/route.
7. **Session token lives in `localStorage`** (`lib/auth.tsx`), readable by
   any injected script. Reasonable given the separate-backend architecture
   and seemingly intentional, but an XSS bug anywhere becomes a full
   account-takeover bug — keep dependencies patched, avoid
   `dangerouslySetInnerHTML`.
8. **No tests, no CI.** No `.github/workflows`, no test files anywhere. At
   minimum, add a CI step running `npm run build` and `npm run lint` on PRs.
9. **No error monitoring** (Sentry or similar) — a production bug currently
   fails silently with no signal reaching the team.

## Pre-launch housekeeping

- Confirm `NEXT_PUBLIC_SITE_URL` (or Vercel's auto
  `VERCEL_PROJECT_PRODUCTION_URL`) resolves correctly once the custom domain
  is live — `robots.ts`/`sitemap.ts` depend on `lib/site.ts` getting this
  right.
- Double-check `next.config.ts`'s Supabase Storage `remotePatterns` hostname
  matches the actual production Supabase project.
- Decide whether Vercel preview deployments should be `noindex`ed — `robots.ts`
  currently allows everything unconditionally, which is fine for prod but
  would also apply to crawled preview URLs.
- 14 files had uncommitted SEO work (robots/sitemap/metadata) as of this
  audit — get those committed so nothing gets lost.

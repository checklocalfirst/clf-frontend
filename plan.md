# Check Local First — Frontend Build Plan

## Phase 1: Auth (in progress)

### Done
- [x] `lib/api.ts` — `apiFetch<T>()` utility, `ApiError` class, handles both backend error envelope shapes
- [x] `lib/auth.tsx` — `AuthProvider`, `useAuth()`, `useToken()`, localStorage persistence
- [x] `app/layout.tsx` — wrapped with `<AuthProvider>`
- [x] `.env.local` — API base URL, Supabase URL + anon key
- [x] Login page wired to `POST /auth/login` → redirects by accountType (user → /account, business → /dashboard, admin → /admin)
- [x] Personal signup wired to `POST /auth/signup/user` → redirects to /login?registered=1
- [x] `lib/supabaseClient.ts` + `app/reset-password/page.tsx` — handles incoming Supabase reset link, `updateUser({ password })`, auto-redirects to /login on success

### Still needed in Phase 1
- [ ] `/forgot-password` page — form where user enters email to request a reset link (calls `supabase.auth.resetPasswordForEmail()`)
- [ ] Business signup Stripe flow (see Phase 1b below)

---

## Phase 1b: Stripe Business Signup

Business signup is a multi-step payment flow, distinct from personal signup.

### How it works
1. User fills out business info form on `/signup` (business tab)
2. Frontend POSTs to `POST /stripe/signup/business/checkout` → backend returns `{ client_secret }`
3. Frontend shows Stripe Elements (payment card form) using that `client_secret`
4. User completes payment
5. Stripe webhook fires → backend creates the business account + sends an email with a password setup link
6. Frontend shows "Check your email to finish setting up your account"

### What needs to be built
- [ ] Install `@stripe/react-stripe-js` and `@stripe/stripe-js`
- [ ] Add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to `.env.local`
- [ ] `/signup/payment` page (or inline step 2 on `/signup`) — loads Stripe Elements with the `client_secret` from sessionStorage, collects card, confirms payment
- [ ] Success state after payment — "Check your email" message

---

## Phase 2: Live Data (replace hardcoded content)

Replace all static arrays and placeholder data with real API calls.

- [ ] `/businesses` page — fetch from `GET /businesses` (with search/filter params)
- [ ] `/businesses/[slug]` page — fetch from `GET /businesses/:slug`
- [ ] `/search` page — wire search bar to `GET /businesses?search=...`
- [ ] Homepage "Meet Your Neighbors" carousel — fetch featured businesses from API
- [ ] Handle loading skeletons and empty states on all data pages

---

## Phase 3: Dashboards

Three separate dashboard experiences.

### User Dashboard (`/account`)
- [ ] View profile (name, email, phone)
- [ ] Edit profile info → `PATCH /users/me`
- [ ] Saved/favorited businesses list
- [ ] Logout button → calls `POST /auth/logout`, clears session

### Business Dashboard (`/dashboard`)
- [ ] View and edit business profile (name, description, address, phone, email, photos)
- [ ] Upload/manage business photos
- [ ] View membership status and billing info
- [ ] Logout button

### Admin Panel (`/admin`)
- [ ] List all businesses (approve / reject / flag)
- [ ] List all users
- [ ] Manage featured businesses (homepage carousel)
- [ ] Basic stats (user count, business count, recent signups)
- [ ] Protected route — redirect to /login if accountType !== "admin"

---

## Phase 4: Polish + Hardening

- [ ] Protected route wrapper component — redirect unauthenticated users on /account, /dashboard, /admin
- [ ] Token expiry handling — if API returns 401, clear session and redirect to /login
- [ ] Loading states on all protected pages (don't flash content before auth check resolves)
- [ ] Business signup email link → lands on `/reset-password` to let business owner set their password for first login
- [ ] Error boundary / fallback UI for failed API fetches

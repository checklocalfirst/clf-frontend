import type { AuthUser } from "./auth";
import { accountHomeFor } from "./auth";

// Where a "Join Now" CTA should send someone, based on session state.
// The target pages (/account/membership, /dashboard/billing) already show
// their own "already Premium" state when hit directly, so this only needs
// to route by account type, not premium status.
export function getJoinNowHref(user: AuthUser | null): string {
  if (!user) return "/signup";
  if (user.accountType === "business") return "/dashboard/billing";
  if (user.accountType === "user") return "/account/membership";
  return accountHomeFor(user.accountType);
}

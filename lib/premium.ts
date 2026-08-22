import { apiFetch } from "./api";

export interface StripeIntent {
  client_secret: string;
  // 'setup' when a coupon fully covers the first billing period — nothing to
  // charge today, so confirm a SetupIntent (save the card) instead of a
  // PaymentIntent. A checkout with no coupon always comes back 'payment'.
  mode: "payment" | "setup";
  customer_id: string;
  discount_applied?: boolean;
}

export interface CancelResult {
  cancel_at: string;
}

// couponCode is optional — omit the body entirely rather than sending an empty
// string when the user didn't enter one.
export function startPremiumUpgrade(token: string, couponCode?: string): Promise<StripeIntent> {
  return apiFetch<StripeIntent>("/stripe/premium-user/checkout", {
    method: "POST",
    token,
    ...(couponCode ? { body: JSON.stringify({ coupon_code: couponCode }) } : {}),
  });
}

export function cancelPremium(token: string): Promise<CancelResult> {
  return apiFetch<CancelResult>("/stripe/premium-user/cancel", {
    method: "POST",
    token,
  });
}

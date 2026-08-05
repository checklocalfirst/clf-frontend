import { apiFetch } from "./api";

export interface StripeIntent {
  client_secret: string;
  customer_id: string;
}

export interface CancelResult {
  cancel_at: string;
}

export function startPremiumUpgrade(token: string): Promise<StripeIntent> {
  return apiFetch<StripeIntent>("/stripe/premium-user/checkout", {
    method: "POST",
    token,
  });
}

export function cancelPremium(token: string): Promise<CancelResult> {
  return apiFetch<CancelResult>("/stripe/premium-user/cancel", {
    method: "POST",
    token,
  });
}

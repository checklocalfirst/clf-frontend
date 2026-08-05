import { apiFetch } from "./api";
import type { AccountType } from "./auth";

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  account_type: AccountType;
  created_at: string;
  updated_at: string;
  // Premium-status fields aren't spelled out in the API doc's GET /users/me shape —
  // read defensively (optional chaining) until confirmed against a live response.
  is_premium?: boolean;
  premium_cancel_at?: string | null;
}

export interface UserProfileInput {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

export function getMe(token: string): Promise<UserProfile> {
  return apiFetch<UserProfile>("/users/me", { token });
}

export function updateMe(token: string, patch: UserProfileInput): Promise<UserProfile> {
  return apiFetch<UserProfile>("/users/me", {
    method: "PUT",
    token,
    body: JSON.stringify(patch),
  });
}

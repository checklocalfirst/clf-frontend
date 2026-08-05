import { apiFetch, type Paginated } from "../api";
import type { AccountType } from "../auth";

export interface AdminUser {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  account_type: AccountType;
  created_at: string;
  updated_at: string;
}

export function listAdminUsers(
  token: string,
  params: { page?: number; limit?: number } = {}
): Promise<Paginated<AdminUser>> {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  const query = qs.toString();
  return apiFetch<Paginated<AdminUser>>(`/admin/users${query ? `?${query}` : ""}`, { token });
}

export function getAdminUser(token: string, id: string): Promise<AdminUser> {
  return apiFetch<AdminUser>(`/admin/users/${id}`, { token });
}

export function deleteAdminUser(token: string, id: string): Promise<void> {
  return apiFetch<void>(`/admin/users/${id}`, {
    method: "DELETE",
    token,
  });
}

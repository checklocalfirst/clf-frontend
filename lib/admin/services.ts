import { apiFetch, type Paginated } from "../api";
import type { Service, ServiceWithBusiness } from "../directory";

export function listAdminServices(
  token: string,
  params: { page?: number; limit?: number } = {}
): Promise<Paginated<ServiceWithBusiness>> {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  const query = qs.toString();
  return apiFetch<Paginated<ServiceWithBusiness>>(`/admin/services${query ? `?${query}` : ""}`, { token });
}

export function getAdminService(token: string, id: number): Promise<ServiceWithBusiness> {
  return apiFetch<ServiceWithBusiness>(`/admin/services/${id}`, { token });
}

export function updateAdminService(
  token: string,
  id: number,
  patch: { name?: string; description?: string; category_id?: number }
): Promise<Service> {
  return apiFetch<Service>(`/admin/services/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(patch),
  });
}

export function deleteAdminService(token: string, id: number): Promise<void> {
  return apiFetch<void>(`/admin/services/${id}`, {
    method: "DELETE",
    token,
  });
}

import { apiFetch, type Paginated } from "../api";

export type ChangeActorRole = "owner" | "admin" | "system";

export const CHANGE_ACTIONS = [
  "profile_updated",
  "hours_updated",
  "categories_updated",
  "service_created",
  "service_updated",
  "service_deleted",
  "status_changed",
  "business_created",
  "business_deleted",
] as const;

export type ChangeAction = (typeof CHANGE_ACTIONS)[number];

export interface ChangeLogEntry {
  id: number;
  // null once the business itself has been deleted — business_name still carries the name
  business_id: number | null;
  business_name: string;
  actor_user_id: string | null;
  actor_role: ChangeActorRole;
  action: ChangeAction;
  // The service id for service_* actions
  entity_id: number | null;
  changes: Record<string, { from: unknown; to: unknown }> | null;
  created_at: string;
}

export interface ChangeLogFilters {
  page?: number;
  limit?: number;
  actor_role?: ChangeActorRole;
  action?: ChangeAction;
}

function toQuery(params: ChangeLogFilters & { business_id?: number }): string {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") qs.set(key, String(value));
  }
  const query = qs.toString();
  return query ? `?${query}` : "";
}

// Newest first. An unknown actor_role is a 400.
export function getChangeLog(
  token: string,
  params: ChangeLogFilters & { business_id?: number } = {}
): Promise<Paginated<ChangeLogEntry>> {
  return apiFetch<Paginated<ChangeLogEntry>>(`/admin/change-log${toQuery(params)}`, { token });
}

export function getBusinessChangeLog(
  token: string,
  businessId: number,
  params: ChangeLogFilters = {}
): Promise<Paginated<ChangeLogEntry>> {
  return apiFetch<Paginated<ChangeLogEntry>>(
    `/admin/businesses/${businessId}/change-log${toQuery(params)}`,
    { token }
  );
}

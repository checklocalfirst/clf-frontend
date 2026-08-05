import { apiFetch } from "../api";

export interface AdminStats {
  totalBusinesses: number;
  totalUsers: number;
  newSignupsLast24Hours: number;
}

export function getAdminStats(token: string): Promise<AdminStats> {
  return apiFetch<AdminStats>("/admin/stats", { token });
}

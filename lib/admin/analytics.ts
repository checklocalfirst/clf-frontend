import { apiFetch } from "../api";
import type { AnalyticsEventType, AnalyticsSeries } from "../business-dashboard";

export function getAdminBusinessAnalytics(
  token: string,
  businessId: number,
  from?: string,
  to?: string
): Promise<AnalyticsSeries> {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  const qs = params.toString();
  return apiFetch<AnalyticsSeries>(`/admin/businesses/${businessId}/analytics${qs ? `?${qs}` : ""}`, {
    token,
  });
}

export interface AdminAnalyticsOverview {
  totalsByType: Partial<Record<AnalyticsEventType, number>>;
  topBusinesses: { business: { name: string; slug: string }; total: number }[];
}

export function getAdminAnalyticsOverview(token: string): Promise<AdminAnalyticsOverview> {
  return apiFetch<AdminAnalyticsOverview>("/admin/analytics", { token });
}

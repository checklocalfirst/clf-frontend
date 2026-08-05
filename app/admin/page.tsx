"use client";

import Link from "next/link";
import { useApiResource } from "@/lib/useApiResource";
import { getAdminStats, type AdminStats } from "@/lib/admin/stats";
import { getAdminAnalyticsOverview, type AdminAnalyticsOverview } from "@/lib/admin/analytics";
import StatCard from "@/components/dashboard/StatCard";

export default function AdminOverviewPage() {
  const { data: stats, loading: statsLoading } = useApiResource<AdminStats>((t) => getAdminStats(t));
  const { data: overview, loading: overviewLoading } = useApiResource<AdminAnalyticsOverview>((t) =>
    getAdminAnalyticsOverview(t)
  );

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display font-bold text-[24px] text-[#423926]">Overview</h2>

      {statsLoading && <p className="font-body text-[14px] text-[#596155]">Loading stats…</p>}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard label="Total Businesses" value={stats.totalBusinesses} />
          <StatCard label="Total Users" value={stats.totalUsers} />
          <StatCard label="New Signups (24h)" value={stats.newSignupsLast24Hours} />
        </div>
      )}

      <div className="flex flex-col gap-3">
        <h3 className="font-display font-bold text-[18px] text-[#423926]">Most Active Businesses (30 days)</h3>
        {overviewLoading && <p className="font-body text-[14px] text-[#596155]">Loading…</p>}
        {overview && overview.topBusinesses.length === 0 && (
          <p className="font-body text-[14px] text-[#596155]">No analytics activity yet.</p>
        )}
        <div className="flex flex-col gap-2">
          {overview?.topBusinesses.map((entry, i) => (
            <Link
              key={entry.business.slug}
              href={`/businesses/${entry.business.slug}`}
              className="flex items-center justify-between bg-white border border-[#dbe0d9] rounded-[12px] px-4 py-3 hover:border-[#b7a78c] transition-colors"
            >
              <span className="font-body text-[13px] text-[#423926]">
                <span className="text-[#b7a78c] mr-2">#{i + 1}</span>
                {entry.business.name}
              </span>
              <span className="font-display font-bold text-[13px] text-[#253022]">
                {entry.total.toLocaleString()}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

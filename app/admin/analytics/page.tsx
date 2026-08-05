"use client";

import Link from "next/link";
import { useApiResource } from "@/lib/useApiResource";
import { getAdminAnalyticsOverview, type AdminAnalyticsOverview } from "@/lib/admin/analytics";
import StatCard from "@/components/dashboard/StatCard";

const EVENT_LABEL: Record<string, string> = {
  call_click: "Calls",
  email_click: "Emails",
  page_view: "Page Views",
  address_click: "Address Clicks",
  website_click: "Website Clicks",
  discount_click: "Discount Reveals",
  facebook_click: "Facebook Clicks",
  instagram_click: "Instagram Clicks",
  yelp_click: "Yelp Clicks",
};

export default function AdminAnalyticsPage() {
  const { data, loading, error } = useApiResource<AdminAnalyticsOverview>((t) => getAdminAnalyticsOverview(t));

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display font-bold text-[24px] text-[#423926]">Analytics Overview</h2>
      <p className="font-body text-[13px] text-[#596155]">Last 30 days, across every business.</p>

      {loading && <p className="font-body text-[14px] text-[#596155]">Loading…</p>}
      {error && <p className="font-body text-[14px] text-red-600">{error}</p>}

      {data && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(data.totalsByType).map(([type, total]) => (
              <StatCard key={type} label={EVENT_LABEL[type] ?? type} value={(total ?? 0).toLocaleString()} />
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-display font-bold text-[18px] text-[#423926]">Top 10 Businesses</h3>
            {data.topBusinesses.length === 0 && (
              <p className="font-body text-[14px] text-[#596155]">No activity yet.</p>
            )}
            <div className="flex flex-col gap-2">
              {data.topBusinesses.map((entry, i) => (
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
        </>
      )}
    </div>
  );
}

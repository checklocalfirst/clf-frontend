"use client";

import { useMemo, useState } from "react";
import { useBusiness } from "@/components/dashboard/BusinessContext";
import { useApiResource } from "@/lib/useApiResource";
import { getBusinessAnalytics, type AnalyticsSeries } from "@/lib/business-dashboard";
import TimeSeriesChart from "@/components/dashboard/TimeSeriesChart";

const PRESETS = [
  { label: "Last 7 Days", days: 7 },
  { label: "Last 30 Days", days: 30 },
  { label: "Last 90 Days", days: 90 },
];

// Full timestamps, not date-only strings — a date-only "to" would parse on the
// backend as midnight UTC (start of day), silently excluding everything that
// happened today from the range.
function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export default function AnalyticsPage() {
  const { business } = useBusiness();
  const [days, setDays] = useState(30);

  const from = useMemo(() => isoDaysAgo(days), [days]);
  const to = useMemo(() => new Date().toISOString(), []);

  const { data: series, loading, error } = useApiResource<AnalyticsSeries>(
    (t) => getBusinessAnalytics(t, business.slug, from, to),
    [business.slug, from, to]
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-display font-bold text-[24px] text-[#423926]">Analytics</h2>
        <div className="flex gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.days}
              type="button"
              onClick={() => setDays(p.days)}
              className={`px-4 py-2 rounded-full border font-display font-bold text-[12px] uppercase transition-colors cursor-pointer ${
                days === p.days
                  ? "bg-[#2c4a34] border-[#2c4a34] text-white"
                  : "bg-white border-[#dbe0d9] text-[#423926] hover:border-[#b7a78c]"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="font-body text-[14px] text-[#596155]">Loading analytics…</p>}
      {error && <p className="font-body text-[14px] text-red-600">{error}</p>}
      {series && <TimeSeriesChart series={series} />}
    </div>
  );
}

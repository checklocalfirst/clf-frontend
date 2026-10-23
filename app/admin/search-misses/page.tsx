"use client";

import { useState } from "react";
import Link from "next/link";
import { useApiResource } from "@/lib/useApiResource";
import {
  getTopSearchMisses,
  getRecentSearchMisses,
  type SearchMiss,
  type SearchMissSummary,
} from "@/lib/admin/searchMisses";
import DataTable, { type Column } from "@/components/dashboard/DataTable";
import Pager from "@/components/dashboard/Pager";

const DAY_OPTIONS = [7, 30, 90] as const;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

// What the shopper actually searched for — the text when there was one, otherwise the
// category (and/or location) they were browsing.
function MissLabel({ query, category_slug, had_location }: { query: string | null; category_slug: string | null; had_location?: boolean }) {
  if (query) return <span className="font-display font-bold text-[14px] text-[#253022]">&ldquo;{query}&rdquo;</span>;
  const parts = [category_slug && `Category: ${category_slug}`, had_location && "near me"].filter(Boolean);
  return (
    <span className="font-body text-[13px] text-[#596155] italic">
      {parts.length > 0 ? parts.join(" · ") : "Browse with no filters"}
    </span>
  );
}

export default function AdminSearchMissesPage() {
  const [days, setDays] = useState<(typeof DAY_OPTIONS)[number]>(30);
  const [page, setPage] = useState(1);

  const top = useApiResource((t) => getTopSearchMisses(t, { days, limit: 50 }), [days]);
  const recent = useApiResource((t) => getRecentSearchMisses(t, { page, limit: 20 }), [page]);

  const topColumns: Column<SearchMissSummary>[] = [
    {
      key: "query",
      header: "Search",
      render: (m) => (
        <div className="flex flex-col gap-1">
          <MissLabel query={m.query} category_slug={m.category_slug} />
          {m.query && m.category_slug && (
            <span className="font-body text-[12px] text-[#b7a78c]">in {m.category_slug}</span>
          )}
        </div>
      ),
    },
    { key: "misses", header: "Misses", render: (m) => m.misses },
    { key: "did_you_mean", header: "Suggested", render: (m) => m.did_you_mean ?? "—" },
    { key: "last_seen", header: "Last seen", render: (m) => formatDate(m.last_seen) },
    {
      key: "actions",
      header: "",
      render: (m) =>
        m.query ? (
          <Link
            href={`/admin/search-synonyms?term=${encodeURIComponent(m.query)}`}
            className="font-display font-bold text-[11px] text-[#2c4a34] uppercase whitespace-nowrap hover:text-[#253022] transition-colors"
          >
            + Add synonym
          </Link>
        ) : null,
    },
  ];

  const recentColumns: Column<SearchMiss>[] = [
    {
      key: "query",
      header: "Search",
      render: (m) => <MissLabel query={m.query} category_slug={m.category_slug} had_location={m.had_location} />,
    },
    {
      key: "filters",
      header: "Filters",
      render: (m) =>
        [m.query && m.category_slug && m.category_slug, m.query && m.had_location && "near me"].filter(Boolean).join(", ") ||
        "—",
    },
    { key: "did_you_mean", header: "Suggested", render: (m) => m.did_you_mean ?? "—" },
    { key: "created_at", header: "When", render: (m) => formatDate(m.created_at) },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="font-display font-bold text-[24px] text-[#423926]">Missed searches</h2>
        <p className="font-body text-[13px] text-[#596155] max-w-[640px]">
          Searches that returned no results. Common misses are good candidates for a synonym, a new category, or a
          nudge to a business to list that offering.
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display font-bold text-[18px] text-[#423926]">Top misses</h3>
          <div className="flex gap-2" role="group" aria-label="Time range">
            {DAY_OPTIONS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDays(d)}
                aria-pressed={days === d}
                className={`px-4 py-2 rounded-full border font-display font-bold text-[12px] uppercase transition-colors cursor-pointer ${
                  days === d
                    ? "bg-[#2c4a34] border-[#2c4a34] text-white"
                    : "bg-white border-[#dbe0d9] text-[#423926] hover:border-[#b7a78c]"
                }`}
              >
                {d} days
              </button>
            ))}
          </div>
        </div>
        {top.loading && <p className="font-body text-[14px] text-[#596155]">Loading…</p>}
        {top.error && <p className="font-body text-[14px] text-red-600">{top.error}</p>}
        {top.data && (
          <DataTable
            columns={topColumns}
            rows={top.data}
            rowKey={(m) => `${m.query ?? ""}|${m.category_slug ?? ""}`}
            emptyMessage={`No missed searches in the last ${days} days.`}
          />
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="font-display font-bold text-[18px] text-[#423926]">Recent misses</h3>
        {recent.loading && <p className="font-body text-[14px] text-[#596155]">Loading…</p>}
        {recent.error && <p className="font-body text-[14px] text-red-600">{recent.error}</p>}
        {recent.data && (
          <>
            <DataTable
              columns={recentColumns}
              rows={recent.data.data}
              rowKey={(m) => m.id}
              emptyMessage="No missed searches yet."
            />
            <Pager page={page} totalPages={recent.data.pagination.totalPages} onPageChange={setPage} />
          </>
        )}
      </section>
    </div>
  );
}

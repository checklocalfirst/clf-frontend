"use client";

import { useState } from "react";
import Link from "next/link";
import { useApiResource } from "@/lib/useApiResource";
import { listAdminBusinesses } from "@/lib/admin/businesses";
import type { Business, BusinessStatus } from "@/lib/directory";
import DataTable, { type Column } from "@/components/dashboard/DataTable";
import Pager from "@/components/dashboard/Pager";

const STATUSES: BusinessStatus[] = ["pending", "approved", "suspended", "rejected"];

const STATUS_BADGE: Record<BusinessStatus, string> = {
  pending: "bg-[#faf6e9] text-[#8a6d1f] border-[#e0c56b]",
  approved: "bg-[#f0f5ee] text-[#2c4a34] border-[#9ca889]",
  suspended: "bg-red-50 text-red-700 border-red-200",
  rejected: "bg-[#f4f3ee] text-[#596155] border-[#dbe0d9]",
};

export default function AdminBusinessesPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<BusinessStatus | "all">("all");

  const { data, loading, error } = useApiResource(
    (t) => listAdminBusinesses(t, { page, limit: 20 }),
    [page]
  );

  const rows = (data?.data ?? []).filter((b) => statusFilter === "all" || b.status === statusFilter);

  const columns: Column<Business>[] = [
    {
      key: "name",
      header: "Name",
      render: (b) => (
        <Link
          href={`/admin/businesses/${b.id}`}
          className="font-display font-bold text-[13px] text-[#253022] hover:underline"
        >
          {b.name}
        </Link>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (b) => (
        <span
          className={`inline-block px-2 py-1 rounded-full border text-[11px] font-display font-bold uppercase ${STATUS_BADGE[b.status]}`}
        >
          {b.status}
        </span>
      ),
    },
    { key: "tier", header: "Tier", render: (b) => (b.business_tier === "premium" ? "Premium" : "Basic") },
    { key: "city", header: "City", render: (b) => `${b.city}, ${b.state}` },
    { key: "created", header: "Created", render: (b) => new Date(b.created_at).toLocaleDateString() },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-display font-bold text-[24px] text-[#423926]">Businesses</h2>
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-2 rounded-full border font-display font-bold text-[12px] uppercase transition-colors cursor-pointer ${
              statusFilter === "all"
                ? "bg-[#2c4a34] border-[#2c4a34] text-white"
                : "bg-white border-[#dbe0d9] text-[#423926] hover:border-[#b7a78c]"
            }`}
          >
            All
          </button>
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-full border font-display font-bold text-[12px] uppercase transition-colors cursor-pointer ${
                statusFilter === s
                  ? "bg-[#2c4a34] border-[#2c4a34] text-white"
                  : "bg-white border-[#dbe0d9] text-[#423926] hover:border-[#b7a78c]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <p className="font-body text-[12px] text-[#b7a78c]">
        The status filter narrows what&apos;s shown on the current page — the backend doesn&apos;t support
        server-side status filtering yet.
      </p>

      {loading && <p className="font-body text-[14px] text-[#596155]">Loading businesses…</p>}
      {error && <p className="font-body text-[14px] text-red-600">{error}</p>}

      {data && (
        <>
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(b) => b.id}
            emptyMessage="No businesses match this filter on this page."
          />
          <Pager page={data.pagination.page} totalPages={data.pagination.totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

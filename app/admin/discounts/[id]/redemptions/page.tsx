"use client";

import { use } from "react";
import Link from "next/link";
import { useApiResource } from "@/lib/useApiResource";
import { getAdminDiscount, getAdminDiscountRedemptions } from "@/lib/admin/discounts";
import type { Redemption } from "@/lib/business-dashboard";
import DataTable, { type Column } from "@/components/dashboard/DataTable";

export default function AdminDiscountRedemptionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const discountId = Number(id);

  const { data: discount } = useApiResource((t) => getAdminDiscount(t, discountId), [discountId]);
  const { data: redemptions, loading, error } = useApiResource<Redemption[]>(
    (t) => getAdminDiscountRedemptions(t, discountId),
    [discountId]
  );

  const columns: Column<Redemption>[] = [
    {
      key: "customer",
      header: "Customer",
      render: (r) => (
        <div>
          <p className="font-body text-[13px] text-[#423926]">
            {r.users.first_name} {r.users.last_name}
          </p>
          <p className="font-body text-[12px] text-[#898781]">{r.users.email}</p>
        </div>
      ),
    },
    {
      key: "redeemed_at",
      header: "Redeemed",
      render: (r) => new Date(r.redeemed_at).toLocaleDateString(),
    },
    {
      key: "used",
      header: "Used",
      render: (r) => (
        <span
          className={`px-2 py-1 rounded-full border text-[11px] font-display font-bold uppercase ${
            r.used
              ? "bg-[#f0f5ee] text-[#2c4a34] border-[#9ca889]"
              : "bg-[#f4f3ee] text-[#596155] border-[#dbe0d9]"
          }`}
        >
          {r.used ? `Used${r.used_at ? ` ${new Date(r.used_at).toLocaleDateString()}` : ""}` : "Not used"}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin/discounts"
        className="font-body text-[13px] text-[#b7a78c] hover:text-[#423926] transition-colors w-fit"
      >
        ← Back to Discounts
      </Link>

      <div>
        <h2 className="font-display font-bold text-[24px] text-[#423926]">Redemptions</h2>
        {discount && (
          <p className="font-body text-[13px] text-[#596155] mt-1">
            {discount.businesses.name} — {discount.description}
          </p>
        )}
        <p className="font-body text-[12px] text-[#b7a78c] mt-1">
          Read-only. Marking used or deleting a redemption is done from the business&apos;s own dashboard.
        </p>
      </div>

      {loading && <p className="font-body text-[14px] text-[#596155]">Loading redemptions…</p>}
      {error && <p className="font-body text-[14px] text-red-600">{error}</p>}

      {redemptions && (
        <DataTable
          columns={columns}
          rows={redemptions}
          rowKey={(r) => r.id}
          emptyMessage="No one has redeemed this discount yet."
        />
      )}
    </div>
  );
}

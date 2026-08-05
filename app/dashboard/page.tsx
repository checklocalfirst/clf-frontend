"use client";

import Link from "next/link";
import { useBusiness } from "@/components/dashboard/BusinessContext";
import StatCard from "@/components/dashboard/StatCard";

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending Review",
  approved: "Live",
  suspended: "Suspended",
  rejected: "Rejected",
};

export default function DashboardOverviewPage() {
  const { business } = useBusiness();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display font-bold text-[24px] text-[#423926]">{business.name}</h2>
        <p className="font-body text-[14px] text-[#596155]">
          {business.address}, {business.city}, {business.state} {business.zip}
        </p>
      </div>

      {business.status === "pending" && (
        <div className="bg-[#faf6e9] border border-[#b7a78c] rounded-[12px] px-5 py-4">
          <p className="font-body text-[13px] text-[#423926]">
            Your listing is pending admin review and won&apos;t appear in search or browse until approved.
          </p>
        </div>
      )}
      {business.status === "suspended" && (
        <div className="bg-red-50 border border-red-200 rounded-[12px] px-5 py-4">
          <p className="font-body text-[13px] text-red-700">
            Your listing is currently suspended. Contact support for details.
          </p>
        </div>
      )}
      {business.status === "rejected" && (
        <div className="bg-red-50 border border-red-200 rounded-[12px] px-5 py-4">
          <p className="font-body text-[13px] text-red-700">
            Your listing was not approved. Contact support for details.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Status" value={STATUS_LABEL[business.status] ?? business.status} />
        <StatCard label="Plan" value={business.business_tier === "premium" ? "Premium" : "Basic"} />
        <StatCard label="Featured" value={business.is_featured ? "Yes" : "No"} />
        <StatCard label="In Carousel" value={business.in_carousel ? "Yes" : "No"} />
      </div>

      <div className="flex flex-wrap gap-3">
        {business.status === "approved" && (
          <Link
            href={`/businesses/${business.slug}`}
            className="border border-[#dbe0d9] rounded-[8px] px-5 py-3 font-display font-bold text-[13px] text-[#423926] uppercase hover:border-[#b7a78c] transition-colors"
          >
            View Public Listing
          </Link>
        )}
        <Link
          href="/dashboard/analytics"
          className="bg-[#2c4a34] text-white rounded-[8px] px-5 py-3 font-display font-bold text-[13px] uppercase hover:bg-[#253022] transition-colors"
        >
          View Analytics
        </Link>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";

export default function PremiumUpsell({
  message,
  href = "/dashboard/billing",
  ctaLabel = "Upgrade to Premium",
}: {
  message: string;
  href?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="bg-[#f0f5ee] border border-[#9ca889] rounded-[12px] p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
      <p className="font-body text-[13px] text-[#2c4a34]">{message}</p>
      <Link
        href={href}
        className="flex-shrink-0 bg-[#2c4a34] text-white font-display font-bold text-[12px] uppercase px-4 py-2 rounded-[6px] hover:bg-[#253022] transition-colors whitespace-nowrap"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}

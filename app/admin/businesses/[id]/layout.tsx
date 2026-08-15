"use client";

import { use, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminBusinessProvider } from "@/components/dashboard/AdminBusinessContext";

export default function AdminBusinessLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const pathname = usePathname();
  const numericId = Number(id);

  const tabs = [
    { label: "Profile", href: `/admin/businesses/${id}` },
    { label: "Categories", href: `/admin/businesses/${id}/categories` },
    { label: "Services", href: `/admin/businesses/${id}/services` },
    { label: "Photos", href: `/admin/businesses/${id}/photos` },
    { label: "Discounts", href: `/admin/businesses/${id}/discounts` },
    { label: "Analytics", href: `/admin/businesses/${id}/analytics` },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin/businesses"
        className="font-body text-[13px] text-[#b7a78c] hover:text-[#423926] transition-colors w-fit"
      >
        ← Back to Businesses
      </Link>

      <div className="flex gap-1 border-b border-[#dbe0d9] overflow-x-auto">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`whitespace-nowrap font-display font-bold text-[12px] uppercase px-4 py-3 border-b-2 transition-colors ${
              pathname === tab.href
                ? "border-[#2c4a34] text-[#253022]"
                : "border-transparent text-[#b7a78c] hover:text-[#596155]"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <AdminBusinessProvider id={numericId}>{children}</AdminBusinessProvider>
    </div>
  );
}

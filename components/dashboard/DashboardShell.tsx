"use client";

import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SidebarNav from "@/components/dashboard/SidebarNav";

const LINKS = [
  { label: "Overview", href: "/dashboard" },
  { label: "Preview Listing", href: "/dashboard/me" },
  { label: "Profile", href: "/dashboard/profile" },
  { label: "Services", href: "/dashboard/services" },
  { label: "Photos", href: "/dashboard/photos" },
  { label: "Discounts", href: "/dashboard/discounts" },
  { label: "Redemptions", href: "/dashboard/discounts/redemptions" },
  { label: "Analytics", href: "/dashboard/analytics" },
  { label: "Billing", href: "/dashboard/billing" },
];

export default function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="bg-[#faf8f5] min-h-[calc(100vh-96px)] px-4 md:px-16 py-10 md:py-14">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row gap-8 md:gap-12">
          <aside className="md:w-[220px] flex-shrink-0">
            <h1 className="font-display font-bold text-[13px] text-[#b7a78c] uppercase tracking-widest mb-4 px-4 md:px-0">
              Business Dashboard
            </h1>
            <SidebarNav links={LINKS} />
          </aside>
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}

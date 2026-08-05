"use client";

import { createContext, useContext, type ReactNode } from "react";
import Link from "next/link";
import { useApiResource } from "@/lib/useApiResource";
import { getAdminBusinessFull, type BusinessFull } from "@/lib/admin/businesses";

interface AdminBusinessContextValue {
  business: BusinessFull;
  refetch: () => void;
  setBusiness: (b: BusinessFull) => void;
}

const AdminBusinessContext = createContext<AdminBusinessContextValue | null>(null);

export function useAdminBusiness(): AdminBusinessContextValue {
  const ctx = useContext(AdminBusinessContext);
  if (!ctx) throw new Error("useAdminBusiness must be used inside <AdminBusinessProvider>");
  return ctx;
}

/** Fetches GET /admin/businesses/:id/full once and exposes it via context —
 * the one-call review screen the doc asks for, shared by every tab under [id]. */
export function AdminBusinessProvider({ id, children }: { id: number; children: ReactNode }) {
  const { data: business, loading, error, refetch, setData } = useApiResource<BusinessFull>(
    (t) => getAdminBusinessFull(t, id),
    [id]
  );

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#dbe0d9] border-t-[#2c4a34] rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="bg-white border border-[#dbe0d9] rounded-[16px] p-8 text-center flex flex-col gap-3">
        <p className="font-body text-[14px] text-red-600">{error ?? "Business not found."}</p>
        <Link
          href="/admin/businesses"
          className="font-display font-bold text-[13px] text-[#2c4a34] uppercase underline w-fit mx-auto"
        >
          Back to Businesses
        </Link>
      </div>
    );
  }

  return (
    <AdminBusinessContext.Provider value={{ business, refetch, setBusiness: setData }}>
      {children}
    </AdminBusinessContext.Provider>
  );
}

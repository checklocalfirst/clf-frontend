"use client";

import { createContext, useContext, type ReactNode } from "react";
import Link from "next/link";
import { useApiResource } from "@/lib/useApiResource";
import { getMyBusiness } from "@/lib/business-dashboard";
import type { Business } from "@/lib/directory";
import EmptyState from "./EmptyState";

interface BusinessContextValue {
  business: Business;
  refetch: () => void;
  setBusiness: (b: Business) => void;
}

const BusinessContext = createContext<BusinessContextValue | null>(null);

export function useBusiness(): BusinessContextValue {
  const ctx = useContext(BusinessContext);
  if (!ctx) throw new Error("useBusiness must be used inside <BusinessProvider>");
  return ctx;
}

/** Fetches GET /businesses/me once and exposes it via context — a 404 means this
 * account isn't attached to a business, which is a legitimate state, not an error. */
export function BusinessProvider({ children }: { children: ReactNode }) {
  const { data: business, loading, error, refetch, setData } = useApiResource<Business>((t) =>
    getMyBusiness(t)
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#faf8f5]">
        <div className="w-8 h-8 border-2 border-[#dbe0d9] border-t-[#2c4a34] rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#faf8f5] px-4 py-16">
        <EmptyState
          title="No business yet"
          message="This account isn't attached to a business listing. If you believe this is a mistake, contact support."
          action={
            <Link
              href="/"
              className="bg-[#2c4a34] text-white font-display font-bold text-[13px] uppercase px-5 py-3 rounded-[8px] hover:bg-[#253022] transition-colors"
            >
              Back to Home
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <BusinessContext.Provider value={{ business, refetch, setBusiness: setData }}>
      {children}
    </BusinessContext.Provider>
  );
}

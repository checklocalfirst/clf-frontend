"use client";

import Link from "next/link";
import { useState } from "react";
import { useToken } from "@/lib/auth";
import { useApiResource } from "@/lib/useApiResource";
import { getFavorites, removeFavorite, type Favorite } from "@/lib/favorites";
import { useToast } from "@/components/dashboard/ToastProvider";
import { ApiError } from "@/lib/api";

export default function FavoritesPage() {
  const token = useToken();
  const { data: favorites, loading, error, setData } = useApiResource<Favorite[]>((t) => getFavorites(t));
  const toast = useToast();
  const [removingId, setRemovingId] = useState<number | null>(null);

  async function handleRemove(businessId: number) {
    if (!token) return;
    setRemovingId(businessId);
    try {
      await removeFavorite(token, businessId);
      setData((prev) => (prev ? prev.filter((f) => f.business_id !== businessId) : prev));
      toast.success("Removed from favorites.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't remove favorite.");
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display font-bold text-[24px] text-[#423926]">Favorites</h2>

      {loading && <p className="font-body text-[14px] text-[#596155]">Loading your favorites…</p>}
      {error && <p className="font-body text-[14px] text-red-600">{error}</p>}

      {!loading && !error && favorites?.length === 0 && (
        <div className="bg-white border border-[#dbe0d9] rounded-[16px] p-8 text-center">
          <p className="font-body text-[14px] text-[#596155]">
            You haven&apos;t saved any businesses yet.{" "}
            <Link href="/businesses" className="text-[#2c4a34] underline hover:text-[#253022]">
              Browse local businesses
            </Link>
            .
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {favorites?.map((fav) => (
          <div
            key={fav.id}
            className="flex items-center justify-between gap-4 bg-white border border-[#dbe0d9] rounded-[12px] p-4"
          >
            <Link href={`/businesses/${fav.businesses.slug}`} className="flex-1 min-w-0">
              <p className="font-display font-bold text-[16px] text-[#253022] truncate">
                {fav.businesses.name}
              </p>
              <p className="font-body text-[13px] text-[#596155] truncate">
                {fav.businesses.city}, {fav.businesses.state}
              </p>
            </Link>
            <button
              type="button"
              onClick={() => handleRemove(fav.business_id)}
              disabled={removingId === fav.business_id}
              className="flex-shrink-0 font-display font-bold text-[12px] text-[#b7a78c] uppercase hover:text-red-600 transition-colors cursor-pointer disabled:opacity-60"
            >
              {removingId === fav.business_id ? "Removing…" : "Remove"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

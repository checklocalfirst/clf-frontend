"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { getFavorites, addFavorite, removeFavorite } from "@/lib/favorites";
import { useToast } from "@/components/dashboard/ToastProvider";
import { ApiError } from "@/lib/api";

interface FavoriteButtonProps {
  businessId: number;
  slug: string;
  className?: string;
}

/** Bookmark toggle for a business's public page — signed-in users save/unsave via
 * /favorites, signed-out visitors get routed to sign up (same `?next=` convention
 * as DiscountRedeemButton) instead of the toggle firing. */
export default function FavoriteButton({ businessId, slug, className = "" }: FavoriteButtonProps) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [isFavorited, setIsFavorited] = useState(false);
  const [checking, setChecking] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- no fetch to run when signed out, just settling the initial "checking" state
      setChecking(false);
      return;
    }
    let cancelled = false;
    getFavorites(user.access_token)
      .then((favorites) => {
        if (!cancelled) setIsFavorited(favorites.some((f) => f.business_id === businessId));
      })
      .catch(() => {
        // Best-effort — leave it unfavorited-looking rather than blocking the page.
      })
      .finally(() => {
        if (!cancelled) setChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user, businessId]);

  async function handleClick() {
    if (!user) {
      router.push(`/signup?next=${encodeURIComponent(`/businesses/${slug}`)}`);
      return;
    }
    if (checking || saving) return;

    setSaving(true);
    try {
      if (isFavorited) {
        await removeFavorite(user.access_token, businessId);
        setIsFavorited(false);
        toast.success("Removed from favorites.");
      } else {
        await addFavorite(user.access_token, businessId);
        setIsFavorited(true);
        toast.success("Saved to favorites.");
      }
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't update favorites.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={authLoading || saving || (!!user && checking)}
      aria-label={!user ? "Sign up to save this business" : isFavorited ? "Remove from favorites" : "Save this business"}
      aria-pressed={!!user && isFavorited}
      className={className}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M4.5 2C4.22 2 4 2.22 4 2.5V13.5C4 13.69 4.11 13.86 4.28 13.94C4.45 14.02 4.66 14 4.8 13.87L8 11.15L11.2 13.87C11.34 14 11.55 14.02 11.72 13.94C11.89 13.86 12 13.69 12 13.5V2.5C12 2.22 11.78 2 11.5 2H4.5Z"
          fill={user && isFavorited ? "white" : "none"}
          stroke="white"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

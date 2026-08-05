"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToken } from "@/lib/auth";
import { useToast } from "@/components/dashboard/ToastProvider";
import { trackBusinessEvent } from "@/lib/directory";
import { redeemDiscount } from "@/lib/business-dashboard";
import { ApiError } from "@/lib/api";

interface DiscountRedeemButtonProps {
  slug: string;
  discountId: number;
  className?: string;
  textClassName?: string;
}

export default function DiscountRedeemButton({
  slug,
  discountId,
  className = "",
  textClassName = "",
}: DiscountRedeemButtonProps) {
  const token = useToken();
  const router = useRouter();
  const toast = useToast();
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    trackBusinessEvent(slug, "discount_click");

    if (!token) {
      router.push(`/signup?next=${encodeURIComponent(`/businesses/${slug}`)}`);
      return;
    }

    // Redeem is idempotent server-side, but skip the extra network round trip
    // once we already have the code displayed.
    if (code || loading) return;

    setLoading(true);
    try {
      const result = await redeemDiscount(token, slug, discountId);
      setCode(result.code);
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        toast.error("Premium membership required to use this discount.");
      } else {
        toast.error(err instanceof ApiError ? err.message : "Couldn't reveal your discount code.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button type="button" onClick={handleClick} disabled={loading} className={className}>
      <span className={textClassName}>
        {code ? `CODE: ${code}` : loading ? "..." : token ? "REVEAL CODE" : "SIGN UP TO USE DISCOUNT"}
      </span>
    </button>
  );
}

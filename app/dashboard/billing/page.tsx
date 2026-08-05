"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useToken } from "@/lib/auth";
import { useBusiness } from "@/components/dashboard/BusinessContext";
import { upgradeBusinessTier, cancelBusinessTier, deleteMyBusiness } from "@/lib/business-dashboard";
import { useConfirm } from "@/components/dashboard/ConfirmDialog";
import { useToast } from "@/components/dashboard/ToastProvider";
import { ApiError } from "@/lib/api";

export default function BillingPage() {
  const token = useToken();
  const router = useRouter();
  const { logout } = useAuth();
  const { business, setBusiness } = useBusiness();
  const toast = useToast();
  const confirm = useConfirm();

  const [upgrading, setUpgrading] = useState(false);
  const [cancelAt, setCancelAt] = useState<string | null>(null);
  const isPremium = business.business_tier === "premium";

  async function handleUpgrade() {
    if (!token) return;
    setUpgrading(true);
    try {
      const updated = await upgradeBusinessTier(token, business.slug);
      setBusiness(updated);
      toast.success("Upgraded to Premium!");
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        toast.error("This business is already Premium.");
      } else if (err instanceof ApiError && err.status === 402) {
        toast.error("Your card was declined. Update your payment method and try again.");
      } else {
        toast.error(err instanceof ApiError ? err.message : "Couldn't upgrade. Please try again.");
      }
    } finally {
      setUpgrading(false);
    }
  }

  function handleCancelPremium() {
    confirm.ask({
      title: "Cancel Premium?",
      body: "Premium features stay active until the end of your current billing period, then this listing reverts to Basic.",
      confirmLabel: "Cancel Premium",
      onConfirm: async () => {
        if (!token) return;
        const result = await cancelBusinessTier(token, business.slug);
        setCancelAt(result.cancel_at);
        toast.success("Premium set to cancel.");
      },
    });
  }

  function handleDeleteBusiness() {
    confirm.ask({
      title: "Delete this business permanently?",
      body: `This deletes "${business.name}", all of its services, photos, and discounts, and your owner login — permanently. This cannot be undone.`,
      confirmLabel: "Delete Everything",
      onConfirm: async () => {
        if (!token) return;
        await deleteMyBusiness(token, business.slug);
        await logout();
        router.push("/");
      },
    });
  }

  return (
    <div className="flex flex-col gap-6 max-w-[560px]">
      <h2 className="font-display font-bold text-[24px] text-[#423926]">Billing</h2>

      <div className="bg-white border border-[#dbe0d9] rounded-[16px] p-6 md:p-8 flex flex-col gap-4">
        <p className="font-display font-bold text-[13px] text-[#9ca889] uppercase tracking-widest">Current Plan</p>
        <p className="font-body text-[16px] text-[#423926]">
          {isPremium ? "Premium" : "Basic"}
          {cancelAt ? ` — reverts to Basic on ${new Date(cancelAt).toLocaleDateString()}.` : "."}
        </p>

        {!isPremium && (
          <button
            type="button"
            onClick={handleUpgrade}
            disabled={upgrading}
            className="self-start bg-[#2c4a34] rounded-[8px] px-6 py-[12px] font-display font-bold text-[14px] text-white uppercase hover:bg-[#253022] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {upgrading ? "Upgrading..." : "Upgrade to Premium"}
          </button>
        )}

        {isPremium && !cancelAt && (
          <button
            type="button"
            onClick={handleCancelPremium}
            className="self-start font-display font-bold text-[13px] text-red-600 uppercase hover:text-red-700 transition-colors cursor-pointer"
          >
            Cancel Premium
          </button>
        )}
      </div>

      <div className="bg-white border border-red-200 rounded-[16px] p-6 md:p-8 flex flex-col gap-4">
        <p className="font-display font-bold text-[13px] text-red-600 uppercase tracking-widest">Danger Zone</p>
        <p className="font-body text-[13px] text-[#596155]">
          Permanently delete this business listing, its services, photos, discounts, and your owner login.
        </p>
        <button
          type="button"
          onClick={handleDeleteBusiness}
          className="self-start border border-red-300 text-red-600 rounded-[8px] px-6 py-[12px] font-display font-bold text-[14px] uppercase hover:bg-red-50 transition-colors cursor-pointer"
        >
          Delete Business
        </button>
      </div>

      {confirm.dialog}
    </div>
  );
}

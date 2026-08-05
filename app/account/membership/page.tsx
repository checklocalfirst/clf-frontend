"use client";

import { useState } from "react";
import { useToken } from "@/lib/auth";
import { useApiResource } from "@/lib/useApiResource";
import { getMe, type UserProfile } from "@/lib/users";
import { startPremiumUpgrade, cancelPremium } from "@/lib/premium";
import StripeCheckout from "@/components/StripeCheckout";
import { useConfirm } from "@/components/dashboard/ConfirmDialog";
import { useToast } from "@/components/dashboard/ToastProvider";
import { ApiError } from "@/lib/api";

const PERKS = [
  "Reveal discount codes at participating businesses",
  "Support local businesses at the premium tier",
  "Early access to new features",
];

export default function MembershipPage() {
  const token = useToken();
  const { data: user, loading, refetch } = useApiResource<UserProfile>((t) => getMe(t));
  const toast = useToast();
  const confirm = useConfirm();

  const [starting, setStarting] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [cancelAt, setCancelAt] = useState<string | null>(null);

  async function handleStartUpgrade() {
    if (!token) return;
    setStarting(true);
    try {
      const { client_secret } = await startPremiumUpgrade(token);
      setClientSecret(client_secret);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't start checkout.");
    } finally {
      setStarting(false);
    }
  }

  function handleCancel() {
    confirm.ask({
      title: "Cancel Premium Membership?",
      body: "Your premium perks stay active until the end of your current billing period, then your account reverts to free.",
      confirmLabel: "Cancel Membership",
      danger: true,
      onConfirm: async () => {
        if (!token) return;
        const result = await cancelPremium(token);
        setCancelAt(result.cancel_at);
        toast.success("Membership set to cancel.");
        refetch();
      },
    });
  }

  const isPremium = Boolean(user?.is_premium);

  if (loading) return <p className="font-body text-[14px] text-[#596155]">Loading…</p>;

  return (
    <div className="flex flex-col gap-6 max-w-[520px]">
      <h2 className="font-display font-bold text-[24px] text-[#423926]">Membership</h2>

      {isPremium ? (
        <div className="bg-white border border-[#dbe0d9] rounded-[16px] p-6 md:p-8 flex flex-col gap-4">
          <p className="font-display font-bold text-[13px] text-[#9ca889] uppercase tracking-widest">
            Current Plan
          </p>
          <p className="font-body text-[16px] text-[#423926]">
            You&apos;re a Premium member
            {cancelAt ? ` — access ends ${new Date(cancelAt).toLocaleDateString()}.` : "."}
          </p>
          {!cancelAt && (
            <button
              type="button"
              onClick={handleCancel}
              className="self-start font-display font-bold text-[13px] text-red-600 uppercase hover:text-red-700 transition-colors cursor-pointer"
            >
              Cancel Membership
            </button>
          )}
        </div>
      ) : clientSecret ? (
        <div className="bg-white border border-[#dbe0d9] rounded-[16px] p-6 md:p-8">
          <StripeCheckout
            clientSecret={clientSecret}
            returnPath="/account/membership"
            submitLabel="UPGRADE TO PREMIUM"
            onSuccess={() => {
              toast.success("Welcome to Premium!");
              setClientSecret("");
              refetch();
            }}
          />
        </div>
      ) : (
        <div className="bg-white border border-[#dbe0d9] rounded-[16px] p-6 md:p-8 flex flex-col gap-5">
          <ul className="flex flex-col gap-2">
            {PERKS.map((perk) => (
              <li key={perk} className="font-body text-[14px] text-[#596155] flex gap-2">
                <span className="text-[#2c4a34]">•</span> {perk}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={handleStartUpgrade}
            disabled={starting}
            className="self-start bg-[#2c4a34] rounded-[8px] px-6 py-[12px] font-display font-bold text-[14px] text-white uppercase hover:bg-[#253022] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {starting ? "Starting..." : "Upgrade to Premium"}
          </button>
        </div>
      )}

      {confirm.dialog}
    </div>
  );
}

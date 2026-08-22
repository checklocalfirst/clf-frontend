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

const COPY = {
  couponLabel: "Have a coupon code?",
  couponPlaceholder: "Enter a code",
  noChargeNotice:
    "No charge today — we'll save your card and start billing automatically once your free period ends.",
  discountApplied: "Coupon applied — your discount is reflected below.",
};

export default function MembershipPage() {
  const token = useToken();
  const { data: user, loading, refetch } = useApiResource<UserProfile>((t) => getMe(t));
  const toast = useToast();
  const confirm = useConfirm();

  const [starting, setStarting] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [mode, setMode] = useState<"payment" | "setup">("payment");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [cancelAt, setCancelAt] = useState<string | null>(null);

  const [showCoupon, setShowCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");

  async function handleStartUpgrade() {
    if (!token) return;
    setCouponError("");
    setStarting(true);
    try {
      const data = await startPremiumUpgrade(token, couponCode.trim() || undefined);
      setDiscountApplied(Boolean(data.discount_applied));
      setMode(data.mode);
      setClientSecret(data.client_secret);
    } catch (err) {
      // A bad coupon code is a 400 on this route with just a message (no
      // fieldErrors) — surface it next to the field rather than a page toast,
      // and leave the rest of the form (and the code they typed) untouched.
      if (err instanceof ApiError && err.status === 400) {
        setCouponError(err.message);
      } else {
        toast.error(err instanceof ApiError ? err.message : "Couldn't start checkout.");
      }
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
        <div className="bg-white border border-[#dbe0d9] rounded-[16px] p-6 md:p-8 flex flex-col gap-5">
          {discountApplied && (
            <div className="bg-[#f0f5ee] border border-[#9ca889] rounded-[8px] px-4 py-3">
              <p className="font-body text-[13px] text-[#2c4a34]">
                {mode === "setup" ? COPY.noChargeNotice : COPY.discountApplied}
              </p>
            </div>
          )}
          <StripeCheckout
            clientSecret={clientSecret}
            returnPath="/account/membership"
            submitLabel="UPGRADE TO PREMIUM"
            mode={mode}
            onSuccess={() => {
              toast.success("Welcome to Premium!");
              setClientSecret("");
              refetch();
            }}
          />
        </div>
      ) : (
        <div className="bg-white border border-[#dbe0d9] rounded-[16px] p-6 md:p-8 flex flex-col gap-5">
          <p className="font-display font-bold text-[20px] text-[#423926]">$10/month</p>
          <ul className="flex flex-col gap-2">
            {PERKS.map((perk) => (
              <li key={perk} className="font-body text-[14px] text-[#596155] flex gap-2">
                <span className="text-[#2c4a34]">•</span> {perk}
              </li>
            ))}
          </ul>

          {showCoupon ? (
            <div className="flex flex-col gap-2">
              <label htmlFor="couponCode" className="font-body font-semibold text-[13px] text-[#423926]">
                {COPY.couponLabel}
              </label>
              <input
                id="couponCode"
                type="text"
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value);
                  setCouponError("");
                }}
                placeholder={COPY.couponPlaceholder}
                className={`h-[44px] w-full bg-white border rounded-[8px] px-4 font-body text-[14px] text-[#423926] placeholder:text-[#b7a78c] outline-none transition-colors ${
                  couponError ? "border-red-400 focus:border-red-500" : "border-[#dbe0d9] focus:border-[#2c4a34]"
                }`}
              />
              {couponError && <p className="font-body text-[12px] text-red-600">{couponError}</p>}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowCoupon(true)}
              className="self-start font-body text-[13px] text-[#2c4a34] underline hover:opacity-70 transition-opacity cursor-pointer"
            >
              {COPY.couponLabel}
            </button>
          )}

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

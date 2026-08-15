"use client";

import { useState } from "react";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";
import { getStripe } from "@/lib/stripe";

const appearance: StripeElementsOptions["appearance"] = {
  variables: {
    colorPrimary: "#2c4a34",
    colorBackground: "#ffffff",
    colorText: "#423926",
    colorDanger: "#dc2626",
    fontFamily: "'Fragment Mono', monospace",
    borderRadius: "8px",
  },
};

const fonts: StripeElementsOptions["fonts"] = [
  { cssSrc: "https://fonts.googleapis.com/css2?family=Fragment+Mono&display=swap" },
];

function PayButton({
  loading,
  submitLabel,
}: {
  loading: boolean;
  submitLabel: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  return (
    <button
      type="submit"
      disabled={!stripe || !elements || loading}
      className="w-full bg-[#2c4a34] rounded-[8px] py-[14px] font-display font-bold text-[16px] text-white uppercase hover:bg-[#253022] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? "Processing..." : submitLabel}
    </button>
  );
}

function CheckoutForm({
  onSuccess,
  returnPath,
  submitLabel = "PAY NOW",
  mode = "payment",
}: {
  onSuccess: () => void;
  returnPath: string;
  submitLabel?: string;
  mode?: "payment" | "setup";
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError("");

    const confirmParams = {
      elements,
      confirmParams: {
        return_url: `${window.location.origin}${returnPath}`,
      },
      redirect: "if_required" as const,
    };

    let confirmError, status;
    if (mode === "setup") {
      const result = await stripe.confirmSetup(confirmParams);
      confirmError = result.error;
      status = result.setupIntent?.status;
    } else {
      const result = await stripe.confirmPayment(confirmParams);
      confirmError = result.error;
      status = result.paymentIntent?.status;
    }

    if (confirmError) {
      setError(confirmError.message ?? "Payment failed. Please try again.");
      setLoading(false);
      return;
    }

    if (status === "succeeded" || status === "processing") {
      onSuccess();
    } else {
      setError("Payment could not be completed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-[8px] px-4 py-3">
          <p className="font-body text-[13px] text-red-700">{error}</p>
        </div>
      )}
      <PaymentElement />
      <PayButton loading={loading} submitLabel={submitLabel} />
    </form>
  );
}

/**
 * Mounts a Stripe Payment Element for the given client_secret.
 * `mode: "setup"` confirms a SetupIntent (card saved, not charged) instead of
 * a PaymentIntent — used when a coupon fully discounts the first invoice.
 * Shared by business signup checkout and the premium-user upgrade flow.
 */
export default function StripeCheckout({
  clientSecret,
  onSuccess,
  returnPath,
  submitLabel,
  mode,
}: {
  clientSecret: string;
  onSuccess: () => void;
  returnPath: string;
  submitLabel?: string;
  mode?: "payment" | "setup";
}) {
  const options: StripeElementsOptions = { clientSecret, appearance, fonts };

  return (
    <Elements stripe={getStripe()} options={options}>
      <CheckoutForm onSuccess={onSuccess} returnPath={returnPath} submitLabel={submitLabel} mode={mode} />
    </Elements>
  );
}

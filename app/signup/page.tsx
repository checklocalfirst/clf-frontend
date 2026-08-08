"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StripeCheckout from "@/components/StripeCheckout";
import { apiFetch, ApiError } from "@/lib/api";
import { useAuth, accountHomeFor } from "@/lib/auth";

type AccountType = "personal" | "business";

const inputCls =
  "h-[44px] w-full bg-white border border-[#dbe0d9] rounded-[8px] px-4 font-body text-[14px] text-[#423926] placeholder:text-[#b7a78c] outline-none focus:border-[#2c4a34] transition-colors";

const inputErrCls =
  "h-[44px] w-full bg-white border border-red-400 rounded-[8px] px-4 font-body text-[14px] text-[#423926] placeholder:text-[#b7a78c] outline-none focus:border-red-500 transition-colors";

const labelCls = "font-body font-semibold text-[13px] text-[#423926]";

function Field({
  label,
  id,
  type = "text",
  autoComplete,
  placeholder,
  className = "",
  error,
}: {
  label: string;
  id: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  className?: string;
  error?: string;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={id} className={labelCls}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={error ? inputErrCls : inputCls}
      />
      {error && <p className="font-body text-[12px] text-red-600">{error}</p>}
    </div>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [accountType, setAccountType] = useState<AccountType>("personal");

  // Already signed in — bounce to the account home rather than showing the form again.
  useEffect(() => {
    if (!authLoading && user) {
      router.replace(accountHomeFor(user.accountType));
    }
  }, [authLoading, user, router]);

  // personal form state
  const [personalLoading, setPersonalLoading] = useState(false);
  const [personalError, setPersonalError] = useState("");
  const [personalFieldErrors, setPersonalFieldErrors] = useState<Record<string, string>>({});

  // business form state
  const [businessLoading, setBusinessLoading] = useState(false);
  const [businessError, setBusinessError] = useState("");
  const [businessFieldErrors, setBusinessFieldErrors] = useState<Record<string, string>>({});
  const [businessStep, setBusinessStep] = useState<"form" | "payment" | "success">("form");
  const [businessClientSecret, setBusinessClientSecret] = useState("");
  const [businessTier, setBusinessTier] = useState<"basic" | "premium">("basic");

  async function handlePersonalSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPersonalError("");
    setPersonalFieldErrors({});

    const fd = new FormData(e.currentTarget);
    const password = fd.get("password") as string;
    const confirmPassword = fd.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setPersonalFieldErrors({ confirmPassword: "Passwords do not match." });
      return;
    }

    setPersonalLoading(true);
    try {
      await apiFetch("/auth/signup/user", {
        method: "POST",
        body: JSON.stringify({
          firstname: fd.get("firstName"),
          lastname: fd.get("lastName"),
          email: fd.get("email"),
          phone: fd.get("phone"),
          password,
        }),
      });
      router.push("/login?registered=1");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.fieldErrors) {
          const flat: Record<string, string> = {};
          for (const [k, msgs] of Object.entries(err.fieldErrors)) {
            flat[k] = Array.isArray(msgs) ? msgs[0] : String(msgs);
          }
          setPersonalFieldErrors(flat);
        } else {
          setPersonalError(err.message);
        }
      } else {
        setPersonalError("Something went wrong. Please try again.");
      }
    } finally {
      setPersonalLoading(false);
    }
  }

  async function handleBusinessSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusinessError("");
    setBusinessFieldErrors({});
    setBusinessLoading(true);

    const fd = new FormData(e.currentTarget);
    try {
      const data = await apiFetch<{ client_secret: string }>("/stripe/signup/business/checkout", {
        method: "POST",
        body: JSON.stringify({
          firstname: fd.get("ownerFirstName"),
          lastname: fd.get("ownerLastName"),
          name: fd.get("businessName"),
          email: fd.get("businessEmail"),
          phone: fd.get("businessPhone"),
          description: fd.get("description"),
          address: fd.get("streetAddress"),
          city: fd.get("city"),
          state: fd.get("state"),
          zip: fd.get("zip"),
          business_tier: businessTier,
        }),
      });
      setBusinessClientSecret(data.client_secret);
      setBusinessStep("payment");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.fieldErrors) {
          const flat: Record<string, string> = {};
          for (const [k, msgs] of Object.entries(err.fieldErrors)) {
            flat[k] = Array.isArray(msgs) ? msgs[0] : String(msgs);
          }
          setBusinessFieldErrors(flat);
        } else {
          setBusinessError(err.message);
        }
      } else {
        setBusinessError("Something went wrong. Please try again.");
      }
    } finally {
      setBusinessLoading(false);
    }
  }

  return (
    <>
      <Header />

      <main className="bg-[#faf6e9] min-h-[calc(100vh-96px)] flex flex-col items-center py-8 px-4 md:py-14">
        <div className="bg-[#faf6e9] border border-[#dbe0d9] rounded-[16px] p-8 md:p-12 flex flex-col gap-5 w-full max-w-[520px]">

          <Link
            href="/"
            className="font-body text-[13px] text-[#b7a78c] hover:text-[#423926] transition-colors"
          >
            ← Back to home
          </Link>

          <h1 className="font-display font-bold text-[32px] text-[#423926] leading-none">
            CREATE YOUR ACCOUNT
          </h1>

          <p className="font-body text-[14px] text-[#b7a78c]">
            Join the Check Local First community.
          </p>

          {/* Toggle */}
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setAccountType("personal")}
              className={`px-5 py-[10px] rounded-full font-display font-bold text-[13px] transition-colors cursor-pointer ${
                accountType === "personal"
                  ? "bg-[#2c4a34] text-white"
                  : "bg-white border border-[#dbe0d9] text-[#423926]"
              }`}
            >
              PERSONAL ACCOUNT
            </button>
            <button
              type="button"
              onClick={() => setAccountType("business")}
              className={`px-5 py-[10px] rounded-full font-display font-bold text-[13px] transition-colors cursor-pointer ${
                accountType === "business"
                  ? "bg-[#2c4a34] text-white"
                  : "bg-white border border-[#dbe0d9] text-[#423926]"
              }`}
            >
              BUSINESS ACCOUNT
            </button>
          </div>

          {/* ── Personal Account Form ── */}
          {accountType === "personal" && (
            <form onSubmit={handlePersonalSubmit} className="flex flex-col gap-5 w-full">
              {personalError && (
                <div className="bg-red-50 border border-red-200 rounded-[8px] px-4 py-3">
                  <p className="font-body text-[13px] text-red-700">{personalError}</p>
                </div>
              )}

              <div className="flex flex-col gap-4 sm:flex-row sm:gap-4">
                <Field
                  label="First Name"
                  id="firstName"
                  autoComplete="given-name"
                  className="flex-1"
                  error={personalFieldErrors.firstname}
                />
                <Field
                  label="Last Name"
                  id="lastName"
                  autoComplete="family-name"
                  className="flex-1"
                  error={personalFieldErrors.lastname}
                />
              </div>
              <Field
                label="Email"
                id="email"
                type="email"
                autoComplete="email"
                error={personalFieldErrors.email}
              />
              <Field
                label="Phone"
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder="10 digits, no dashes"
                error={personalFieldErrors.phone}
              />
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-4">
                <Field
                  label="Password"
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  className="flex-1"
                  error={personalFieldErrors.password}
                />
                <Field
                  label="Confirm Password"
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  className="flex-1"
                  error={personalFieldErrors.confirmPassword}
                />
              </div>
              <button
                type="submit"
                disabled={personalLoading}
                className="w-full bg-[#2c4a34] rounded-[8px] py-[14px] font-display font-bold text-[16px] text-white uppercase hover:bg-[#253022] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {personalLoading ? "Creating account..." : "CREATE ACCOUNT"}
              </button>
            </form>
          )}

          {/* ── Business Account Form ── */}
          {accountType === "business" && businessStep === "form" && (
            <form onSubmit={handleBusinessSubmit} className="flex flex-col gap-5 w-full">
              {businessError && (
                <div className="bg-red-50 border border-red-200 rounded-[8px] px-4 py-3">
                  <p className="font-body text-[13px] text-red-700">{businessError}</p>
                </div>
              )}

              <p className="font-display font-bold text-[11px] text-[#b7a78c] uppercase tracking-widest">
                ACCOUNT OWNER
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-4">
                <Field
                  label="First Name"
                  id="ownerFirstName"
                  autoComplete="given-name"
                  className="flex-1"
                  error={businessFieldErrors.firstname}
                />
                <Field
                  label="Last Name"
                  id="ownerLastName"
                  autoComplete="family-name"
                  className="flex-1"
                  error={businessFieldErrors.lastname}
                />
              </div>

              <p className="font-display font-bold text-[11px] text-[#b7a78c] uppercase tracking-widest">
                BUSINESS INFO
              </p>
              <Field
                label="Business Name"
                id="businessName"
                autoComplete="organization"
                error={businessFieldErrors.name}
              />
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-4">
                <Field
                  label="Business Email"
                  id="businessEmail"
                  type="email"
                  autoComplete="email"
                  className="flex-1"
                  error={businessFieldErrors.email}
                />
                <Field
                  label="Business Phone"
                  id="businessPhone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="10 digits"
                  className="flex-1"
                  error={businessFieldErrors.phone}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="description" className={labelCls}>
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="w-full h-[80px] bg-white border border-[#dbe0d9] rounded-[8px] px-4 py-3 font-body text-[14px] text-[#423926] placeholder:text-[#b7a78c] outline-none focus:border-[#2c4a34] transition-colors resize-none"
                />
              </div>

              <Field
                label="Street Address"
                id="streetAddress"
                autoComplete="street-address"
                error={businessFieldErrors.address}
              />

              <div className="flex gap-3">
                <Field
                  label="City"
                  id="city"
                  autoComplete="address-level2"
                  className="flex-1"
                  error={businessFieldErrors.city}
                />
                <Field
                  label="State"
                  id="state"
                  autoComplete="address-level1"
                  className="flex-1"
                  error={businessFieldErrors.state}
                />
                <Field
                  label="Zip"
                  id="zip"
                  autoComplete="postal-code"
                  className="flex-1"
                  error={businessFieldErrors.zip}
                />
              </div>

              <div className="flex flex-col gap-2">
                <p className={labelCls}>Plan</p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setBusinessTier("basic")}
                    className={`flex-1 border rounded-[8px] px-4 py-3 text-left transition-colors cursor-pointer ${
                      businessTier === "basic"
                        ? "border-[#2c4a34] bg-[#f0f5ee]"
                        : "border-[#dbe0d9] bg-white hover:border-[#b7a78c]"
                    }`}
                  >
                    <p className="font-display font-bold text-[14px] text-[#423926]">BASIC</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBusinessTier("premium")}
                    className={`flex-1 border rounded-[8px] px-4 py-3 text-left transition-colors cursor-pointer ${
                      businessTier === "premium"
                        ? "border-[#2c4a34] bg-[#f0f5ee]"
                        : "border-[#dbe0d9] bg-white hover:border-[#b7a78c]"
                    }`}
                  >
                    <p className="font-display font-bold text-[14px] text-[#423926]">PREMIUM</p>
                  </button>
                </div>
                {businessFieldErrors.business_tier && (
                  <p className="font-body text-[12px] text-red-600">{businessFieldErrors.business_tier}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={businessLoading}
                className="w-full bg-[#2c4a34] rounded-[8px] py-[14px] font-display font-bold text-[16px] text-white uppercase hover:bg-[#253022] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {businessLoading ? "Submitting..." : "CONTINUE TO PAYMENT"}
              </button>
            </form>
          )}

          {/* ── Business: payment step ── */}
          {accountType === "business" && businessStep === "payment" && (
            <div className="flex flex-col gap-5 w-full">
              <p className="font-body text-[13px] text-[#596155]">
                Your business info is saved — enter payment details to finish signing up.
              </p>
              <StripeCheckout
                clientSecret={businessClientSecret}
                returnPath="/signup"
                submitLabel="COMPLETE SIGNUP"
                onSuccess={() => setBusinessStep("success")}
              />
            </div>
          )}

          {/* ── Business: success step ── */}
          {accountType === "business" && businessStep === "success" && (
            <div className="flex flex-col gap-4 items-center text-center py-4">
              <div className="w-12 h-12 rounded-full bg-[#f0f5ee] border border-[#9ca889] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 10h14M10 3l7 7-7 7" stroke="#2c4a34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="font-display font-bold text-[20px] text-[#423926]">
                Payment received!
              </h2>
              <p className="font-body text-[14px] text-[#596155]">
                Check your email for a link to set up your login and finish activating your business account.
              </p>
            </div>
          )}

          <p className="font-body text-[13px] text-[#b7a78c]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#2c4a34] underline hover:text-[#253022] transition-colors"
            >
              Log in
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}

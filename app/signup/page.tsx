"use client";

import Link from "next/link";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type AccountType = "personal" | "business";

const inputCls =
  "h-[44px] w-full bg-white border border-[#dbe0d9] rounded-[8px] px-4 font-body text-[14px] text-[#423926] placeholder:text-[#b7a78c] outline-none focus:border-[#2c4a34] transition-colors";

const labelCls = "font-body font-semibold text-[13px] text-[#423926]";

function Field({
  label,
  id,
  type = "text",
  autoComplete,
  className = "",
}: {
  label: string;
  id: string;
  type?: string;
  autoComplete?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={id} className={labelCls}>
        {label}
      </label>
      <input id={id} name={id} type={type} autoComplete={autoComplete} className={inputCls} />
    </div>
  );
}

export default function SignupPage() {
  const [accountType, setAccountType] = useState<AccountType>("personal");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Auth will be wired up when API routes are provided
  }

  return (
    <>
      <Header />

      {/* Form Wrap */}
      <main className="bg-[#faf6e9] min-h-[calc(100vh-96px)] flex flex-col items-center py-8 px-4 md:py-14">
        <div className="bg-[#faf6e9] border border-[#dbe0d9] rounded-[16px] p-8 md:p-12 flex flex-col gap-5 w-full max-w-[520px]">

          {/* Back link */}
          <Link
            href="/"
            className="font-body text-[13px] text-[#b7a78c] hover:text-[#423926] transition-colors"
          >
            ← Back to home
          </Link>

          {/* Heading */}
          <h1 className="font-display font-bold text-[32px] text-[#423926] leading-none">
            CREATE YOUR ACCOUNT
          </h1>

          {/* Subtitle */}
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
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-4">
                <Field label="First Name" id="firstName" autoComplete="given-name" className="flex-1" />
                <Field label="Last Name" id="lastName" autoComplete="family-name" className="flex-1" />
              </div>
              <Field label="Email" id="email" type="email" autoComplete="email" />
              <Field label="Phone" id="phone" type="tel" autoComplete="tel" />
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-4">
                <Field label="Password" id="password" type="password" autoComplete="new-password" className="flex-1" />
                <Field label="Confirm Password" id="confirmPassword" type="password" autoComplete="new-password" className="flex-1" />
              </div>
              <button
                type="submit"
                className="w-full bg-[#2c4a34] rounded-[8px] py-[14px] font-display font-bold text-[16px] text-white uppercase hover:bg-[#253022] transition-colors cursor-pointer"
              >
                CREATE ACCOUNT
              </button>
            </form>
          )}

          {/* ── Business Account Form ── */}
          {accountType === "business" && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
              <p className="font-display font-bold text-[11px] text-[#b7a78c] uppercase tracking-widest">
                ACCOUNT OWNER
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-4">
                <Field label="First Name" id="ownerFirstName" autoComplete="given-name" className="flex-1" />
                <Field label="Last Name" id="ownerLastName" autoComplete="family-name" className="flex-1" />
              </div>
              <p className="font-display font-bold text-[11px] text-[#b7a78c] uppercase tracking-widest">
                BUSINESS INFO
              </p>
              <Field label="Business Name" id="businessName" autoComplete="organization" />
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-4">
                <Field label="Business Email" id="businessEmail" type="email" autoComplete="email" className="flex-1" />
                <Field label="Business Phone" id="businessPhone" type="tel" autoComplete="tel" className="flex-1" />
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

              <Field label="Street Address" id="streetAddress" autoComplete="street-address" />

              <div className="flex gap-3">
                <Field label="City" id="city" autoComplete="address-level2" className="flex-1" />
                <Field label="State" id="state" autoComplete="address-level1" className="flex-1" />
                <Field label="Zip" id="zip" autoComplete="postal-code" className="flex-1" />
              </div>

              <button
                type="submit"
                className="w-full bg-[#2c4a34] rounded-[8px] py-[14px] font-display font-bold text-[16px] text-white uppercase hover:bg-[#253022] transition-colors cursor-pointer"
              >
                CREATE BUSINESS ACCOUNT
              </button>
            </form>
          )}

          {/* Log in link */}
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

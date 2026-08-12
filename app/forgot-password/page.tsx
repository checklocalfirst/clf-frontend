"use client";

import Link from "next/link";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";

const COPY = {
  heading: "FORGOT PASSWORD",
  subheading: "Enter your email and we'll send you a link to reset your password.",
  emailLabel: "Email",
  submitIdle: "SEND RESET LINK",
  submitLoading: "Sending...",
  rememberedPrompt: "Remembered it?",
  logIn: "Log in",
  genericError: "Something went wrong. Please try again.",
  sentHeading: "Check Your Email",
  sentBodyPrefix: "If an account exists for ",
  sentBodySuffix: ", we've sent a link to reset your password.",
  backToLogin: "Back to Log In",
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (resetError) throw resetError;
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : COPY.genericError);
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    "h-[44px] w-full bg-white border border-[#dbe0d9] rounded-[8px] px-4 font-body text-[14px] text-[#423926] placeholder:text-[#b7a78c] outline-none focus:border-[#2c4a34] transition-colors";

  return (
    <>
      <Header />

      <main className="bg-[#faf6e9] min-h-[calc(100vh-96px)] flex flex-col items-center justify-center py-8 px-4 md:py-14">
        <div className="w-full max-w-[480px]">
          <div className="bg-[#faf6e9] border border-[#dbe0d9] rounded-[16px] p-8 md:p-12 flex flex-col gap-6 w-full">

            {!sent ? (
              <>
                <div className="flex flex-col items-center gap-3">
                  <h1 className="font-display font-bold text-[32px] text-[#423926] leading-none text-center">
                    {COPY.heading}
                  </h1>
                  <p className="font-body text-[14px] text-[#b7a78c] text-center">
                    {COPY.subheading}
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-[8px] px-4 py-3">
                    <p className="font-body text-[13px] text-red-700">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="font-body font-semibold text-[13px] text-[#423926]">
                      {COPY.emailLabel}
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={inputCls}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#2c4a34] rounded-[8px] py-[14px] font-display font-bold text-[16px] text-white uppercase hover:bg-[#253022] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? COPY.submitLoading : COPY.submitIdle}
                  </button>
                </form>

                <p className="font-body text-[13px] text-[#b7a78c] text-center">
                  {COPY.rememberedPrompt}{" "}
                  <Link
                    href="/login"
                    className="text-[#2c4a34] underline hover:text-[#253022] transition-colors"
                  >
                    {COPY.logIn}
                  </Link>
                </p>
              </>
            ) : (
              <div className="flex flex-col items-center gap-4 text-center py-4">
                <div className="w-12 h-12 rounded-full bg-[#f0f5ee] border border-[#9ca889] flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10l4 4 8-8" stroke="#2c4a34" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 className="font-display font-bold text-[24px] text-[#423926]">
                  {COPY.sentHeading}
                </h2>
                <p className="font-body text-[14px] text-[#596155]">
                  {COPY.sentBodyPrefix}{email}{COPY.sentBodySuffix}
                </p>
                <Link
                  href="/login"
                  className="w-full bg-[#2c4a34] rounded-[8px] py-[14px] font-display font-bold text-[16px] text-white uppercase text-center hover:bg-[#253022] transition-colors"
                >
                  {COPY.backToLogin}
                </Link>
              </div>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";

type PageState = "waiting" | "form" | "success" | "expired";

const COPY = {
  verifying: "Verifying your reset link…",
  expiredHeading: "Link Expired",
  expiredBody: "This password reset link has expired or is invalid. Request a new one from the login page.",
  backToLogin: "Back to Log In",
  heading: "NEW PASSWORD",
  subheading: "Choose a strong password for your account.",
  passwordMismatch: "Passwords do not match.",
  passwordTooShort: "Password must be at least 8 characters.",
  genericError: "Something went wrong. Please try again.",
  newPasswordLabel: "New Password",
  confirmPasswordLabel: "Confirm Password",
  submitIdle: "SET NEW PASSWORD",
  submitLoading: "Saving...",
  successHeading: "Password Updated",
  successBody: "You're all set. Redirecting you to log in…",
};

export default function ResetPasswordPage() {
  const router = useRouter();
  const [pageState, setPageState] = useState<PageState>("waiting");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Supabase fires PASSWORD_RECOVERY when the user lands via the reset link
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setPageState("form");
      }
    });

    // If no event fires within 3 seconds the link is likely invalid/expired
    const timeout = setTimeout(() => {
      setPageState((prev) => (prev === "waiting" ? "expired" : prev));
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError(COPY.passwordMismatch);
      return;
    }
    if (password.length < 8) {
      setError(COPY.passwordTooShort);
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setPageState("success");
      setTimeout(() => router.push("/login"), 2500);
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

            {/* Waiting for Supabase event */}
            {pageState === "waiting" && (
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="w-8 h-8 border-2 border-[#2c4a34] border-t-transparent rounded-full animate-spin" />
                <p className="font-body text-[14px] text-[#b7a78c] text-center">
                  {COPY.verifying}
                </p>
              </div>
            )}

            {/* Expired / invalid link */}
            {pageState === "expired" && (
              <div className="flex flex-col items-center gap-4 text-center">
                <h1 className="font-display font-bold text-[28px] text-[#423926]">
                  {COPY.expiredHeading}
                </h1>
                <p className="font-body text-[14px] text-[#596155]">
                  {COPY.expiredBody}
                </p>
                <Link
                  href="/login"
                  className="w-full bg-[#2c4a34] rounded-[8px] py-[14px] font-display font-bold text-[16px] text-white uppercase text-center hover:bg-[#253022] transition-colors"
                >
                  {COPY.backToLogin}
                </Link>
              </div>
            )}

            {/* New password form */}
            {pageState === "form" && (
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
                    <label htmlFor="password" className="font-body font-semibold text-[13px] text-[#423926]">
                      {COPY.newPasswordLabel}
                    </label>
                    <input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      className={inputCls}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="confirm" className="font-body font-semibold text-[13px] text-[#423926]">
                      {COPY.confirmPasswordLabel}
                    </label>
                    <input
                      id="confirm"
                      type="password"
                      autoComplete="new-password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
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
              </>
            )}

            {/* Success */}
            {pageState === "success" && (
              <div className="flex flex-col items-center gap-4 text-center py-4">
                <div className="w-12 h-12 rounded-full bg-[#f0f5ee] border border-[#9ca889] flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10l4 4 8-8" stroke="#2c4a34" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 className="font-display font-bold text-[24px] text-[#423926]">
                  {COPY.successHeading}
                </h2>
                <p className="font-body text-[14px] text-[#596155]">
                  {COPY.successBody}
                </p>
              </div>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth";
import { ApiError } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [justRegistered, setJustRegistered] = useState(false);

  useEffect(() => {
    setJustRegistered(new URLSearchParams(window.location.search).has("registered"));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(email, password);
      if (data.accountType === "admin") router.push("/admin");
      else if (data.accountType === "business") router.push("/dashboard");
      else router.push("/account");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message || "Invalid email or password."
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />

      <main className="bg-[#faf6e9] min-h-[calc(100vh-96px)] flex flex-col items-center justify-center py-8 px-4 md:py-14">
        <div className="w-full max-w-[480px]">
          <div className="bg-[#faf6e9] border border-[#dbe0d9] rounded-[16px] p-8 md:p-12 flex flex-col gap-6 w-full">

            <div className="flex flex-col items-center gap-3">
              <h1 className="font-display font-bold text-[32px] text-[#423926] leading-none text-center">
                LOG IN
              </h1>
              <p className="font-body text-[14px] text-[#b7a78c] text-center">
                Welcome back to Check Local First.
              </p>
            </div>

            {justRegistered && (
              <div className="bg-[#f0f5ee] border border-[#9ca889] rounded-[8px] px-4 py-3">
                <p className="font-body text-[13px] text-[#2c4a34]">
                  Account created! Log in below.
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-[8px] px-4 py-3">
                <p className="font-body text-[13px] text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="font-body font-semibold text-[13px] text-[#423926]">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-[44px] w-full bg-white border border-[#dbe0d9] rounded-[8px] px-4 font-body text-[14px] text-[#423926] placeholder:text-[#b7a78c] outline-none focus:border-[#2c4a34] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="font-body font-semibold text-[13px] text-[#423926]">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="font-body text-[12px] text-[#b7a78c] hover:text-[#2c4a34] transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-[44px] w-full bg-white border border-[#dbe0d9] rounded-[8px] px-4 font-body text-[14px] text-[#423926] placeholder:text-[#b7a78c] outline-none focus:border-[#2c4a34] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2c4a34] rounded-[8px] py-[14px] font-display font-bold text-[16px] text-white uppercase hover:bg-[#253022] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "LOG IN"}
              </button>
            </form>

            <p className="font-body text-[13px] text-[#b7a78c] text-center">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-[#2c4a34] underline hover:text-[#253022] transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

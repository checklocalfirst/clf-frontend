"use client";

import Link from "next/link";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Auth will be wired up when API routes are provided
  }

  return (
    <>
      <Header />

      {/* ── Login Form Wrap ── */}
      <main className="bg-[#faf6e9] min-h-[calc(100vh-96px)] flex flex-col items-center justify-center py-8 px-4 md:py-14">
        <div className="w-full max-w-[480px]">
        <div className="bg-[#faf6e9] border border-[#dbe0d9] rounded-[16px] p-8 md:p-12 flex flex-col gap-6 w-full">

          {/* Heading */}
          <div className="flex flex-col items-center gap-3">
            <h1 className="font-display font-bold text-[32px] text-[#423926] leading-none text-center">
              LOG IN
            </h1>
            <p className="font-body text-[14px] text-[#b7a78c] text-center">
              Welcome back to Check Local First.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="font-body font-semibold text-[13px] text-[#423926]"
              >
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

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="font-body font-semibold text-[13px] text-[#423926]"
              >
                Password
              </label>
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

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#2c4a34] rounded-[8px] py-[14px] font-display font-bold text-[16px] text-white uppercase hover:bg-[#253022] transition-colors cursor-pointer"
            >
              LOG IN
            </button>
          </form>

          {/* Sign up link */}
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

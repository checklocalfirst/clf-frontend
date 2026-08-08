"use client";

import { useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function GlobalPageError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <Header />
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-[#faf6e9] px-4 text-center">
        <p className="font-display font-bold text-[24px] text-[#423926]">Something went wrong.</p>
        <p className="font-body text-[14px] text-[#596155]">
          We hit an unexpected error loading this page. Please try again.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={reset}
            className="bg-[#2c4a34] rounded-[8px] px-6 py-[12px] font-display font-bold text-[14px] text-white uppercase hover:bg-[#253022] transition-colors cursor-pointer"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="border border-[#253022] rounded-[8px] px-6 py-[12px] font-display font-bold text-[14px] text-[#253022] uppercase hover:opacity-80 transition-opacity"
          >
            Go Home
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}

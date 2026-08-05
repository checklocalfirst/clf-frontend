"use client";

import { useEffect } from "react";

export default function DashboardErrorScreen({
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
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-[#faf8f5] px-4 text-center">
      <p className="font-display font-bold text-[20px] text-[#423926]">Something went wrong.</p>
      <p className="font-body text-[14px] text-[#596155]">Please try again.</p>
      <button
        type="button"
        onClick={reset}
        className="bg-[#2c4a34] rounded-[8px] px-6 py-[12px] font-display font-bold text-[14px] text-white uppercase hover:bg-[#253022] transition-colors cursor-pointer"
      >
        Try Again
      </button>
    </div>
  );
}

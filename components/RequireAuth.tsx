"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth, accountHomeFor, type AccountType } from "@/lib/auth";

/**
 * Client-side route gate. Sessions live in localStorage only (no cookies, no refresh
 * token), so Next's Proxy can't see them — this has to run after hydration.
 */
export default function RequireAuth({
  allow,
  children,
}: {
  allow: AccountType[];
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!allow.includes(user.accountType)) {
      router.replace(accountHomeFor(user.accountType));
    }
    // allow is expected to be a stable literal array at each call site
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user, pathname, router]);

  if (loading || !user || !allow.includes(user.accountType)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#faf8f5]">
        <div className="w-8 h-8 border-2 border-[#dbe0d9] border-t-[#2c4a34] rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}

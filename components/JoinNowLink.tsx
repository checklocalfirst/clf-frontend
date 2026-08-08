"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { getJoinNowHref } from "@/lib/join-now";

export default function JoinNowLink({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const { user } = useAuth();
  return (
    <Link href={getJoinNowHref(user)} className={className}>
      {children}
    </Link>
  );
}

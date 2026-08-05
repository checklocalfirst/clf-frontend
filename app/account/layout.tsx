import type { Metadata } from "next";
import type { ReactNode } from "react";
import RequireAuth from "@/components/RequireAuth";
import AccountShell from "@/components/dashboard/AccountShell";

export const metadata: Metadata = {
  title: "My Account — Check Local First",
};

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth allow={["user"]}>
      <AccountShell>{children}</AccountShell>
    </RequireAuth>
  );
}

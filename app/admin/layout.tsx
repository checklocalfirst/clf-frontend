import type { Metadata } from "next";
import type { ReactNode } from "react";
import RequireAuth from "@/components/RequireAuth";
import AdminShell from "@/components/dashboard/AdminShell";

export const metadata: Metadata = {
  title: "Admin — Check Local First",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth allow={["admin"]}>
      <AdminShell>{children}</AdminShell>
    </RequireAuth>
  );
}

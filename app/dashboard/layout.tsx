import type { Metadata } from "next";
import type { ReactNode } from "react";
import RequireAuth from "@/components/RequireAuth";
import { BusinessProvider } from "@/components/dashboard/BusinessContext";
import DashboardShell from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: "Business Dashboard — Check Local First",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth allow={["business"]}>
      <BusinessProvider>
        <DashboardShell>{children}</DashboardShell>
      </BusinessProvider>
    </RequireAuth>
  );
}

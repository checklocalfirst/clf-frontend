"use client";

import { useAdminBusiness } from "@/components/dashboard/AdminBusinessContext";
import ChangeLogView from "@/components/dashboard/ChangeLogView";

export default function AdminBusinessActivityPage() {
  const { business } = useAdminBusiness();
  return (
    <div className="max-w-[880px]">
      <ChangeLogView businessId={business.id} />
    </div>
  );
}

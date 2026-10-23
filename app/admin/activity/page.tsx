"use client";

import ChangeLogView from "@/components/dashboard/ChangeLogView";

export default function AdminActivityPage() {
  return (
    <div className="flex flex-col gap-6 max-w-[880px]">
      <div className="flex flex-col gap-2">
        <h2 className="font-display font-bold text-[24px] text-[#423926]">Activity</h2>
        <p className="font-body text-[13px] text-[#596155]">
          Every change to a business — by its owner, an admin, or the system — newest first.
        </p>
      </div>
      <ChangeLogView />
    </div>
  );
}

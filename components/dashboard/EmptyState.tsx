import type { ReactNode } from "react";

export default function EmptyState({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="bg-white border border-[#dbe0d9] rounded-[16px] p-10 flex flex-col items-center text-center gap-3 max-w-[480px] mx-auto">
      <p className="font-display font-bold text-[20px] text-[#423926]">{title}</p>
      <p className="font-body text-[14px] text-[#596155]">{message}</p>
      {action}
    </div>
  );
}

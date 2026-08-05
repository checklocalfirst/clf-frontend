"use client";

export default function Pager({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-4 pt-2">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="px-4 py-2 rounded-[8px] border border-[#dbe0d9] font-display font-bold text-[12px] text-[#423926] uppercase hover:border-[#b7a78c] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Prev
      </button>
      <p className="font-body text-[13px] text-[#596155]">
        Page {page} of {totalPages}
      </p>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="px-4 py-2 rounded-[8px] border border-[#dbe0d9] font-display font-bold text-[12px] text-[#423926] uppercase hover:border-[#b7a78c] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}

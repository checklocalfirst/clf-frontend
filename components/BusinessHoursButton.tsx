"use client";

import { useState } from "react";
import type { BusinessHours } from "@/lib/directory";
import { DAY_KEYS, DAY_LABELS, formatDayRange, isOpenNow, todayKey } from "@/lib/hours";

interface BusinessHoursButtonProps {
  hours: BusinessHours;
  businessName: string;
  className: string;
}

export default function BusinessHoursButton({ hours, businessName, className }: BusinessHoursButtonProps) {
  const [open, setOpen] = useState(false);
  const today = todayKey();
  const openNow = isOpenNow(hours);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        View Hours
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-[380px] bg-[#faf6e9] border border-[#dbe0d9] rounded-[16px] p-6 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display font-bold text-[20px] text-[#423926] truncate">{businessName}</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="flex-shrink-0 text-[#423926] hover:opacity-70 transition-opacity text-[22px] leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            {openNow !== null && (
              <span
                className={`self-start font-display font-bold text-[11px] uppercase tracking-wide px-3 py-1 rounded-full ${
                  openNow ? "bg-[#2c4a34] text-white" : "bg-[#dbe0d9] text-[#596155]"
                }`}
              >
                {openNow ? "Open now" : "Closed now"}
              </span>
            )}

            <ul className="flex flex-col gap-2">
              {DAY_KEYS.map((day) => (
                <li
                  key={day}
                  className={`flex items-center justify-between font-body text-[14px] ${
                    day === today ? "font-bold text-[#253022]" : "text-[#596155]"
                  }`}
                >
                  <span>{DAY_LABELS[day]}</span>
                  <span>{formatDayRange(hours[day])}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

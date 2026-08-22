"use client";

import type { BusinessHours, BusinessHoursDay, DayKey } from "@/lib/directory";
import { DAY_KEYS, DAY_LABELS } from "@/lib/hours";
import Toggle from "@/components/dashboard/Toggle";

const timeInputCls =
  "h-[38px] bg-white border border-[#dbe0d9] rounded-[8px] px-3 font-body text-[13px] text-[#423926] outline-none focus:border-[#2c4a34] transition-colors";
const timeInputErrCls =
  "h-[38px] bg-white border border-red-400 rounded-[8px] px-3 font-body text-[13px] text-[#423926] outline-none focus:border-red-500 transition-colors";

interface HoursEditorProps {
  value: BusinessHours;
  onChange: (next: BusinessHours) => void;
  errors?: Partial<Record<DayKey, string>>;
}

/** 7-row weekly hours editor, shared by the business owner and admin dashboards. */
export default function HoursEditor({ value, onChange, errors }: HoursEditorProps) {
  function patchDay(day: DayKey, patch: Partial<BusinessHoursDay>) {
    onChange({ ...value, [day]: { ...value[day], ...patch } });
  }

  function toggleOpen(day: DayKey, open: boolean) {
    if (open) {
      patchDay(day, { closed: false, open: value[day]?.open ?? "09:00", close: value[day]?.close ?? "17:00" });
    } else {
      patchDay(day, { closed: true, open: undefined, close: undefined });
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {DAY_KEYS.map((day) => {
        const d = value[day] ?? { closed: true };
        const error = errors?.[day];
        return (
          <div key={day} className="flex flex-col gap-1">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-body font-semibold text-[13px] text-[#423926] w-[92px] flex-shrink-0">
                {DAY_LABELS[day]}
              </span>
              <Toggle
                checked={!d.closed}
                onChange={(next) => toggleOpen(day, next)}
                label={`${DAY_LABELS[day]} open`}
              />
              {d.closed ? (
                <span className="font-body text-[13px] text-[#b7a78c]">Closed</span>
              ) : (
                <>
                  <input
                    type="time"
                    aria-label={`${DAY_LABELS[day]} opening time`}
                    value={d.open ?? ""}
                    onChange={(e) => patchDay(day, { open: e.target.value })}
                    className={error ? timeInputErrCls : timeInputCls}
                  />
                  <span className="font-body text-[12px] text-[#596155]">to</span>
                  <input
                    type="time"
                    aria-label={`${DAY_LABELS[day]} closing time`}
                    value={d.close ?? ""}
                    onChange={(e) => patchDay(day, { close: e.target.value })}
                    className={error ? timeInputErrCls : timeInputCls}
                  />
                </>
              )}
            </div>
            {error && <p className="font-body text-[12px] text-red-600 ml-[104px]">{error}</p>}
          </div>
        );
      })}
    </div>
  );
}

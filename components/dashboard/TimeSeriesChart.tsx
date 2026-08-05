"use client";

import { useMemo, useState, type PointerEvent } from "react";
import type { AnalyticsEventType, AnalyticsSeries } from "@/lib/business-dashboard";

const EVENT_ORDER: AnalyticsEventType[] = [
  "call_click",
  "email_click",
  "page_view",
  "address_click",
  "website_click",
  "discount_click",
  "facebook_click",
  "instagram_click",
  "yelp_click",
];

const EVENT_LABEL: Record<AnalyticsEventType, string> = {
  call_click: "Calls",
  email_click: "Emails",
  page_view: "Page Views",
  address_click: "Address Clicks",
  website_click: "Website Clicks",
  discount_click: "Discount Reveals",
  facebook_click: "Facebook Clicks",
  instagram_click: "Instagram Clicks",
  yelp_click: "Yelp Clicks",
};

// Fixed categorical order (validated colorblind-safe adjacent pairs) — assigned by
// event type, never by rank, so a series keeps its color no matter which others
// are present for a given date range.
const EVENT_COLOR: Record<AnalyticsEventType, string> = {
  call_click: "#2a78d6",
  email_click: "#eb6834",
  page_view: "#1baf7a",
  address_click: "#eda100",
  website_click: "#e87ba4",
  discount_click: "#008300",
  facebook_click: "#7b5ec9",
  instagram_click: "#d6336c",
  yelp_click: "#c1440e",
};

function niceCeil(value: number): number {
  if (value <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const normalized = value / magnitude;
  const step = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return step * magnitude;
}

function formatDateLabel(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

const WIDTH = 760;
const HEIGHT = 280;
const PAD_LEFT = 44;
const PAD_RIGHT = 16;
const PAD_TOP = 16;
const PAD_BOTTOM = 32;

export default function TimeSeriesChart({ series }: { series: AnalyticsSeries }) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const { activeTypes, dates, maxValue } = useMemo(() => {
    const types = EVENT_ORDER.filter((type) => {
      const s = series[type];
      return s && Object.keys(s).length > 0;
    });
    const dateSet = new Set<string>();
    let max = 0;
    for (const type of types) {
      for (const [date, value] of Object.entries(series[type] ?? {})) {
        dateSet.add(date);
        max = Math.max(max, value);
      }
    }
    return { activeTypes: types, dates: Array.from(dateSet).sort(), maxValue: niceCeil(max) };
  }, [series]);

  if (dates.length === 0 || activeTypes.length === 0) {
    return (
      <div className="bg-white border border-[#dbe0d9] rounded-[16px] p-8 text-center">
        <p className="font-body text-[14px] text-[#596155]">No analytics data for this range yet.</p>
      </div>
    );
  }

  const plotWidth = WIDTH - PAD_LEFT - PAD_RIGHT;
  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;

  const xFor = (i: number) =>
    dates.length === 1 ? PAD_LEFT + plotWidth / 2 : PAD_LEFT + (i / (dates.length - 1)) * plotWidth;
  const yFor = (v: number) => PAD_TOP + plotHeight - (v / maxValue) * plotHeight;

  const yTicks = [0, maxValue / 2, maxValue];
  const xLabelStep = Math.max(1, Math.ceil(dates.length / 6));

  function handlePointerMove(e: PointerEvent<SVGRectElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    setHoverIndex(Math.round(ratio * (dates.length - 1)));
  }

  const hovered = hoverIndex !== null ? dates[hoverIndex] : null;

  return (
    <div className="bg-white border border-[#dbe0d9] rounded-[16px] p-6 flex flex-col gap-4">
      {/* Legend — always present for 2+ series */}
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {activeTypes.map((type) => (
          <div key={type} className="flex items-center gap-2">
            <span className="w-3 h-[2px] rounded-full" style={{ backgroundColor: EVENT_COLOR[type] }} />
            <span className="font-body text-[12px] text-[#596155]">{EVENT_LABEL[type]}</span>
          </div>
        ))}
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full h-auto min-w-[480px]"
          role="img"
          aria-label="Analytics over time"
        >
          {yTicks.map((tick) => (
            <line
              key={`grid-${tick}`}
              x1={PAD_LEFT}
              x2={WIDTH - PAD_RIGHT}
              y1={yFor(tick)}
              y2={yFor(tick)}
              stroke="#e1e0d9"
              strokeWidth={1}
            />
          ))}

          {yTicks.map((tick) => (
            <text
              key={`ytick-${tick}`}
              x={PAD_LEFT - 8}
              y={yFor(tick)}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize={11}
              fill="#898781"
            >
              {Math.round(tick).toLocaleString()}
            </text>
          ))}

          {dates.map((date, i) =>
            i % xLabelStep === 0 ? (
              <text key={date} x={xFor(i)} y={HEIGHT - PAD_BOTTOM + 18} textAnchor="middle" fontSize={11} fill="#898781">
                {formatDateLabel(date)}
              </text>
            ) : null
          )}

          {activeTypes.map((type) => {
            const points = dates.map((date, i) => `${xFor(i)},${yFor(series[type]?.[date] ?? 0)}`).join(" ");
            return (
              <polyline
                key={type}
                points={points}
                fill="none"
                stroke={EVENT_COLOR[type]}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            );
          })}

          {activeTypes.map((type) => {
            const lastDate = dates[dates.length - 1];
            const v = series[type]?.[lastDate] ?? 0;
            return (
              <circle
                key={`end-${type}`}
                cx={xFor(dates.length - 1)}
                cy={yFor(v)}
                r={4}
                fill={EVENT_COLOR[type]}
                stroke="#ffffff"
                strokeWidth={2}
              />
            );
          })}

          {hoverIndex !== null && (
            <line
              x1={xFor(hoverIndex)}
              x2={xFor(hoverIndex)}
              y1={PAD_TOP}
              y2={HEIGHT - PAD_BOTTOM}
              stroke="#c3c2b7"
              strokeWidth={1}
            />
          )}

          <rect
            x={PAD_LEFT}
            y={PAD_TOP}
            width={plotWidth}
            height={plotHeight}
            fill="transparent"
            onPointerMove={handlePointerMove}
            onPointerLeave={() => setHoverIndex(null)}
          />
        </svg>

        {hovered && hoverIndex !== null && (
          <div
            className="absolute top-2 bg-[#253022] text-white rounded-[8px] px-3 py-2 pointer-events-none shadow-lg text-[12px] flex flex-col gap-1 z-10"
            style={{
              left: `${Math.min(85, Math.max(5, (xFor(hoverIndex) / WIDTH) * 100))}%`,
              transform: "translateX(-50%)",
            }}
          >
            <p className="font-display font-bold text-[11px] uppercase text-[#b7a78c]">
              {formatDateLabel(hovered)}
            </p>
            {activeTypes.map((type) => (
              <div key={type} className="flex items-center gap-2 justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: EVENT_COLOR[type] }} />
                  <span className="text-[#e8ebe6]">{EVENT_LABEL[type]}</span>
                </span>
                <span className="font-semibold">{(series[type]?.[hovered] ?? 0).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Table view — same data, always reachable without hovering */}
      <details className="text-[13px]">
        <summary className="font-body text-[#b7a78c] cursor-pointer hover:text-[#596155] transition-colors">
          View as table
        </summary>
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="font-display text-[11px] uppercase text-[#b7a78c] pb-2 pr-4">Date</th>
                {activeTypes.map((type) => (
                  <th key={type} className="font-display text-[11px] uppercase text-[#b7a78c] pb-2 pr-4">
                    {EVENT_LABEL[type]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dates.map((date) => (
                <tr key={date} className="border-t border-[#f0edd8]">
                  <td className="font-body text-[13px] text-[#423926] py-1.5 pr-4">{date}</td>
                  {activeTypes.map((type) => (
                    <td key={type} className="font-body text-[13px] text-[#423926] py-1.5 pr-4 tabular-nums">
                      {(series[type]?.[date] ?? 0).toLocaleString()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

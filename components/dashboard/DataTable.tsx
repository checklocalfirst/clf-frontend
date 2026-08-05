"use client";

import type { ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

export default function DataTable<T>({
  columns,
  rows,
  rowKey,
  emptyMessage = "Nothing here yet.",
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  emptyMessage?: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="bg-white border border-[#dbe0d9] rounded-[16px] p-8 text-center">
        <p className="font-body text-[14px] text-[#596155]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#dbe0d9] rounded-[16px] overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[560px]">
        <thead>
          <tr className="border-b border-[#dbe0d9]">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`font-display text-[11px] text-[#b7a78c] uppercase tracking-wide px-4 py-3 ${col.className ?? ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              className="border-b border-[#f0edd8] last:border-0 hover:bg-[#faf8f5] transition-colors"
            >
              {columns.map((col) => (
                <td key={col.key} className={`font-body text-[13px] text-[#423926] px-4 py-3 ${col.className ?? ""}`}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

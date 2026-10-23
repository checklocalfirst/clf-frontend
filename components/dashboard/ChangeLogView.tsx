"use client";

import { useState } from "react";
import Link from "next/link";
import { useApiResource } from "@/lib/useApiResource";
import {
  CHANGE_ACTIONS,
  getBusinessChangeLog,
  getChangeLog,
  type ChangeAction,
  type ChangeActorRole,
  type ChangeLogEntry,
} from "@/lib/admin/changeLog";
import FormField from "@/components/FormField";
import Pager from "@/components/dashboard/Pager";

const ACTION_LABELS: Record<ChangeAction, string> = {
  profile_updated: "Profile updated",
  hours_updated: "Hours updated",
  categories_updated: "Categories updated",
  service_created: "Service added",
  service_updated: "Service updated",
  service_deleted: "Service deleted",
  status_changed: "Status changed",
  business_created: "Business created",
  business_deleted: "Business deleted",
};

const ROLE_STYLES: Record<ChangeActorRole, string> = {
  owner: "bg-[#e7ede4] text-[#2c4a34]",
  admin: "bg-[#f3e6dc] text-[#9a4a26]",
  system: "bg-[#ecebe6] text-[#596155]",
};

const EMPTY = "(empty)";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function isEmpty(v: unknown): boolean {
  return v === null || v === undefined || v === "";
}

// A readable name for one item of an array value (e.g. a category object or a plain id).
function itemLabel(item: unknown): string {
  if (item && typeof item === "object") {
    const o = item as Record<string, unknown>;
    return String(o.name ?? o.slug ?? o.id ?? JSON.stringify(o));
  }
  return String(item);
}

function formatScalar(v: unknown): string {
  if (isEmpty(v)) return EMPTY;
  if (Array.isArray(v)) return v.length ? v.map(itemLabel).join(", ") : EMPTY;
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

// One day of a hours object: { closed, open?, close? } → "09:00–17:00" / "closed".
function formatDay(v: unknown): string {
  if (!v || typeof v !== "object") return EMPTY;
  const d = v as { closed?: boolean; open?: string; close?: string };
  if (d.closed) return "closed";
  return d.open && d.close ? `${d.open}–${d.close}` : EMPTY;
}

// Hours is a seven-day object, so list just the days that actually changed.
function hoursSummary(from: unknown, to: unknown): string[] {
  const f = (from && typeof from === "object" ? from : {}) as Record<string, unknown>;
  const t = (to && typeof to === "object" ? to : {}) as Record<string, unknown>;
  if (isEmpty(from) && !isEmpty(to)) return ["hours set"];
  if (!isEmpty(from) && isEmpty(to)) return ["hours cleared"];
  const days = Array.from(new Set([...Object.keys(f), ...Object.keys(t)]));
  return days
    .filter((day) => formatDay(f[day]) !== formatDay(t[day]))
    .map((day) => `${day}: ${formatDay(f[day])} → ${formatDay(t[day])}`);
}

// Arrays (categories) read best as what was added and removed.
function arraySummary(from: unknown, to: unknown): string {
  const before = (Array.isArray(from) ? from : []).map(itemLabel);
  const after = (Array.isArray(to) ? to : []).map(itemLabel);
  const added = after.filter((x) => !before.includes(x));
  const removed = before.filter((x) => !after.includes(x));
  const parts = [added.length && `added ${added.join(", ")}`, removed.length && `removed ${removed.join(", ")}`].filter(
    Boolean
  );
  return parts.length ? parts.join(" · ") : "reordered";
}

function ChangeRow({ field, from, to }: { field: string; from: unknown; to: unknown }) {
  const isHours = field === "hours";
  const isList = Array.isArray(from) || Array.isArray(to);
  const isObject = !isList && [from, to].some((v) => v !== null && typeof v === "object");

  if (isHours || isList || isObject) {
    const summary = isHours ? hoursSummary(from, to) : isList ? [arraySummary(from, to)] : ["changed"];
    return (
      <li className="font-body text-[13px] text-[#423926]">
        <span className="font-semibold">{field}:</span>{" "}
        {summary.length === 0 ? "no visible change" : summary.length === 1 ? summary[0] : null}
        {summary.length > 1 && (
          <ul className="ml-4 list-disc text-[12px] text-[#596155]">
            {summary.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        )}
        <details className="mt-1">
          <summary className="font-body text-[12px] text-[#b7a78c] cursor-pointer w-fit">Before / after</summary>
          <div className="grid sm:grid-cols-2 gap-2 mt-2">
            {(["Before", "After"] as const).map((label, i) => (
              <div key={label} className="min-w-0">
                <p className="font-display font-bold text-[10px] text-[#b7a78c] uppercase tracking-widest">{label}</p>
                <pre className="font-mono text-[11px] text-[#423926] bg-[#faf8f5] border border-[#dbe0d9] rounded-[8px] p-2 overflow-x-auto whitespace-pre-wrap break-words">
                  {isEmpty(i === 0 ? from : to) ? EMPTY : JSON.stringify(i === 0 ? from : to, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </details>
      </li>
    );
  }

  return (
    <li className="font-body text-[13px] text-[#423926] break-words">
      <span className="font-semibold">{field}:</span> <span className="text-[#596155]">{formatScalar(from)}</span>{" "}
      <span className="text-[#b7a78c]">→</span> {formatScalar(to)}
    </li>
  );
}

function EntryCard({ entry, showBusiness }: { entry: ChangeLogEntry; showBusiness: boolean }) {
  const changes = Object.entries(entry.changes ?? {});
  const isService = entry.action.startsWith("service_");

  return (
    <div className="bg-white border border-[#dbe0d9] rounded-[12px] p-4 flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="font-display font-bold text-[14px] text-[#253022]">
          {ACTION_LABELS[entry.action] ?? entry.action}
          {isService && entry.entity_id != null && (
            <span className="font-body font-normal text-[12px] text-[#b7a78c]"> · service #{entry.entity_id}</span>
          )}
        </span>
        <span
          className={`px-2 py-[2px] rounded-full font-display font-bold text-[10px] uppercase tracking-wide ${ROLE_STYLES[entry.actor_role] ?? ROLE_STYLES.system}`}
        >
          {entry.actor_role}
        </span>
        {showBusiness &&
          (entry.business_id != null ? (
            <Link
              href={`/admin/businesses/${entry.business_id}`}
              className="font-body text-[13px] text-[#2c4a34] underline hover:text-[#253022]"
            >
              {entry.business_name}
            </Link>
          ) : (
            <span className="font-body text-[13px] text-[#596155]">
              {entry.business_name} <span className="text-[#b7a78c]">(deleted)</span>
            </span>
          ))}
        <span className="font-body text-[12px] text-[#b7a78c] ml-auto">{formatDate(entry.created_at)}</span>
      </div>
      {changes.length > 0 && (
        <ul className="flex flex-col gap-1">
          {changes.map(([field, change]) => (
            <ChangeRow key={field} field={field} from={change?.from} to={change?.to} />
          ))}
        </ul>
      )}
    </div>
  );
}

/** Paged, filterable business change log — site-wide, or for one business when `businessId` is set. */
export default function ChangeLogView({ businessId }: { businessId?: number }) {
  const [page, setPage] = useState(1);
  const [role, setRole] = useState<ChangeActorRole | "">("");
  const [action, setAction] = useState<ChangeAction | "">("");

  const filters = { page, limit: 20, actor_role: role || undefined, action: action || undefined };
  const { data, loading, error } = useApiResource(
    (t) => (businessId != null ? getBusinessChangeLog(t, businessId, filters) : getChangeLog(t, filters)),
    [businessId, page, role, action]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <FormField
          label="Who"
          id="change_log_role"
          as="select"
          value={role}
          onChange={(e) => {
            setRole(e.target.value as ChangeActorRole | "");
            setPage(1);
          }}
          className="sm:w-48"
        >
          <option value="">Everyone</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
          <option value="system">System</option>
        </FormField>
        <FormField
          label="What"
          id="change_log_action"
          as="select"
          value={action}
          onChange={(e) => {
            setAction(e.target.value as ChangeAction | "");
            setPage(1);
          }}
          className="sm:w-64"
        >
          <option value="">All changes</option>
          {CHANGE_ACTIONS.map((a) => (
            <option key={a} value={a}>
              {ACTION_LABELS[a]}
            </option>
          ))}
        </FormField>
      </div>

      {loading && <p className="font-body text-[14px] text-[#596155]">Loading activity…</p>}
      {error && <p className="font-body text-[14px] text-red-600">{error}</p>}

      {data && (
        <>
          {data.data.length === 0 ? (
            <div className="bg-white border border-[#dbe0d9] rounded-[16px] p-8 text-center">
              <p className="font-body text-[14px] text-[#596155]">No activity matches these filters.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {data.data.map((entry) => (
                <EntryCard key={entry.id} entry={entry} showBusiness={businessId == null} />
              ))}
            </div>
          )}
          <Pager page={page} totalPages={data.pagination.totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

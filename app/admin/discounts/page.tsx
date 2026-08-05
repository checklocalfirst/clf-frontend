"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useToken } from "@/lib/auth";
import { useApiResource } from "@/lib/useApiResource";
import {
  listAdminDiscounts,
  updateAdminDiscount,
  deleteAdminDiscount,
  type AdminDiscount,
} from "@/lib/admin/discounts";
import type { DiscountInput } from "@/lib/business-dashboard";
import DataTable, { type Column } from "@/components/dashboard/DataTable";
import Pager from "@/components/dashboard/Pager";
import FormField from "@/components/FormField";
import { useConfirm } from "@/components/dashboard/ConfirmDialog";
import { useToast } from "@/components/dashboard/ToastProvider";
import { ApiError } from "@/lib/api";

export default function AdminDiscountsPage() {
  const token = useToken();
  const toast = useToast();
  const confirm = useConfirm();
  const [page, setPage] = useState(1);

  const { data, loading, error, refetch } = useApiResource(
    (t) => listAdminDiscounts(t, { page, limit: 20 }),
    [page]
  );

  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<DiscountInput>>({});
  const [saving, setSaving] = useState(false);

  function startEdit(d: AdminDiscount) {
    setForm({
      description: d.description,
      discount_type: d.discount_type,
      value: d.value,
      starts_at: d.starts_at ?? "",
      expires_at: d.expires_at ?? "",
      active: d.active,
    });
    setEditingId(d.id);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token || editingId === null) return;
    setSaving(true);
    try {
      await updateAdminDiscount(token, editingId, form);
      toast.success("Discount updated.");
      setEditingId(null);
      refetch();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't update discount.");
    } finally {
      setSaving(false);
    }
  }

  function handleDelete(d: AdminDiscount) {
    confirm.ask({
      title: "Delete this discount?",
      body: `"${d.description}" from ${d.businesses.name} will be removed permanently.`,
      confirmLabel: "Delete",
      onConfirm: async () => {
        if (!token) return;
        await deleteAdminDiscount(token, d.id);
        toast.success("Discount deleted.");
        refetch();
      },
    });
  }

  const columns: Column<AdminDiscount>[] = [
    { key: "business", header: "Business", render: (d) => d.businesses.name },
    { key: "description", header: "Description", render: (d) => d.description },
    {
      key: "value",
      header: "Value",
      render: (d) => (d.discount_type === "percent" ? `${d.value}%` : `$${d.value}`),
    },
    { key: "redeemed", header: "Redeemed", render: (d) => d.times_redeemed },
    {
      key: "active",
      header: "Active",
      render: (d) => (
        <span
          className={`px-2 py-1 rounded-full border text-[11px] font-display font-bold uppercase ${
            d.active
              ? "bg-[#f0f5ee] text-[#2c4a34] border-[#9ca889]"
              : "bg-[#f4f3ee] text-[#596155] border-[#dbe0d9]"
          }`}
        >
          {d.active ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (d) => (
        <div className="flex gap-3">
          <Link
            href={`/admin/discounts/${d.id}/redemptions`}
            className="font-display font-bold text-[11px] text-[#596155] uppercase hover:text-[#253022] transition-colors"
          >
            Redemptions
          </Link>
          <button
            type="button"
            onClick={() => startEdit(d)}
            className="font-display font-bold text-[11px] text-[#596155] uppercase hover:text-[#253022] transition-colors cursor-pointer"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => handleDelete(d)}
            className="font-display font-bold text-[11px] text-[#b7a78c] uppercase hover:text-red-600 transition-colors cursor-pointer"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display font-bold text-[24px] text-[#423926]">Discounts</h2>

      {editingId !== null && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 bg-white border border-[#dbe0d9] rounded-[16px] p-6 max-w-[520px]"
        >
          <FormField
            label="Description"
            id="edit_discount_description"
            as="textarea"
            value={form.description ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
          <div className="flex gap-3">
            <FormField
              label="Type"
              id="edit_discount_type"
              as="select"
              value={form.discount_type ?? "percent"}
              onChange={(e) => setForm((f) => ({ ...f, discount_type: e.target.value as "percent" | "fixed" }))}
              className="flex-1"
            >
              <option value="percent">Percent off</option>
              <option value="fixed">Fixed amount off</option>
            </FormField>
            <FormField
              label="Value"
              id="edit_discount_value"
              type="number"
              value={form.value ?? 0}
              onChange={(e) => setForm((f) => ({ ...f, value: Number(e.target.value) }))}
              className="flex-1"
            />
          </div>
          <label className="flex items-center gap-2 font-body text-[13px] text-[#423926]">
            <input
              type="checkbox"
              checked={form.active ?? true}
              onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
            />
            Active
          </label>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#2c4a34] rounded-[8px] px-6 py-[10px] font-display font-bold text-[13px] text-white uppercase hover:bg-[#253022] transition-colors cursor-pointer disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="border border-[#dbe0d9] rounded-[8px] px-6 py-[10px] font-display font-bold text-[13px] text-[#423926] uppercase hover:border-[#b7a78c] transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading && <p className="font-body text-[14px] text-[#596155]">Loading discounts…</p>}
      {error && <p className="font-body text-[14px] text-red-600">{error}</p>}

      {data && (
        <>
          <DataTable columns={columns} rows={data.data} rowKey={(d) => d.id} emptyMessage="No discounts yet." />
          <Pager page={data.pagination.page} totalPages={data.pagination.totalPages} onPageChange={setPage} />
        </>
      )}

      {confirm.dialog}
    </div>
  );
}

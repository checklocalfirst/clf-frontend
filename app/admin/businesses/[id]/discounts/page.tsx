"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useToken } from "@/lib/auth";
import { useAdminBusiness } from "@/components/dashboard/AdminBusinessContext";
import { useApiResource } from "@/lib/useApiResource";
import { listBusinessDiscounts, createBusinessDiscount } from "@/lib/admin/discounts";
import type { Discount, DiscountInput } from "@/lib/business-dashboard";
import FormField from "@/components/FormField";
import { useToast } from "@/components/dashboard/ToastProvider";
import { ApiError } from "@/lib/api";

const emptyForm: DiscountInput = {
  code: "",
  description: "",
  discount_type: "percent",
  value: 0,
  active: true,
};

export default function AdminBusinessDiscountsPage() {
  const token = useToken();
  const { business } = useAdminBusiness();
  const toast = useToast();

  const { data: discounts, loading, error, setData: setDiscounts } = useApiResource<Discount[]>(
    (t) => listBusinessDiscounts(t, business.id),
    [business.id]
  );

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<DiscountInput>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setFieldErrors({});
    setSaving(true);
    try {
      const created = await createBusinessDiscount(token, business.id, form);
      setDiscounts((prev) => [...(prev ?? []), created]);
      toast.success("Discount created.");
      setShowForm(false);
      setForm(emptyForm);
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) {
        const flat: Record<string, string> = {};
        for (const [k, msgs] of Object.entries(err.fieldErrors)) {
          flat[k] = Array.isArray(msgs) ? msgs[0] : String(msgs);
        }
        setFieldErrors(flat);
      } else {
        toast.error(err instanceof ApiError ? err.message : "Something went wrong.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-[560px]">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-[18px] text-[#423926]">Discounts</h3>
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="bg-[#2c4a34] text-white rounded-[8px] px-4 py-2 font-display font-bold text-[12px] uppercase hover:bg-[#253022] transition-colors cursor-pointer"
          >
            + Add Discount
          </button>
        )}
      </div>

      <p className="font-body text-[12px] text-[#b7a78c]">
        Full moderation and editing of every discount lives under{" "}
        <Link href="/admin/discounts" className="underline">
          Admin → Discounts
        </Link>
        . This creates a new one for this business.
      </p>

      {loading && <p className="font-body text-[14px] text-[#596155]">Loading discounts…</p>}
      {error && <p className="font-body text-[14px] text-red-600">{error}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white border border-[#dbe0d9] rounded-[16px] p-6">
          <FormField
            label="Code"
            id="ab_discount_code"
            value={form.code}
            onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
            error={fieldErrors.code}
          />
          <FormField
            label="Description"
            id="ab_discount_description"
            as="textarea"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            error={fieldErrors.description}
          />
          <div className="flex gap-3">
            <FormField
              label="Type"
              id="ab_discount_type"
              as="select"
              value={form.discount_type}
              onChange={(e) => setForm((f) => ({ ...f, discount_type: e.target.value as "percent" | "fixed" }))}
              className="flex-1"
            >
              <option value="percent">Percent off</option>
              <option value="fixed">Fixed amount off</option>
            </FormField>
            <FormField
              label="Value"
              id="ab_discount_value"
              type="number"
              value={form.value}
              onChange={(e) => setForm((f) => ({ ...f, value: Number(e.target.value) }))}
              error={fieldErrors.value}
              className="flex-1"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#2c4a34] rounded-[8px] px-6 py-[10px] font-display font-bold text-[13px] text-white uppercase hover:bg-[#253022] transition-colors cursor-pointer disabled:opacity-60"
            >
              {saving ? "Saving..." : "Create"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="border border-[#dbe0d9] rounded-[8px] px-6 py-[10px] font-display font-bold text-[13px] text-[#423926] uppercase hover:border-[#b7a78c] transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-3">
        {discounts?.length === 0 && (
          <p className="font-body text-[14px] text-[#596155]">No discounts for this business yet.</p>
        )}
        {discounts?.map((d) => (
          <div key={d.id} className="flex items-center justify-between gap-4 bg-white border border-[#dbe0d9] rounded-[12px] p-4">
            <div className="min-w-0">
              <p className="font-display font-bold text-[15px] text-[#253022]">
                {d.code} — {d.discount_type === "percent" ? `${d.value}% off` : `$${d.value} off`}
              </p>
              <p className="font-body text-[13px] text-[#596155] mt-1">{d.description}</p>
            </div>
            <span
              className={`flex-shrink-0 px-2 py-1 rounded-full border text-[11px] font-display font-bold uppercase ${
                d.active
                  ? "bg-[#f0f5ee] text-[#2c4a34] border-[#9ca889]"
                  : "bg-[#f4f3ee] text-[#596155] border-[#dbe0d9]"
              }`}
            >
              {d.active ? "Active" : "Inactive"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

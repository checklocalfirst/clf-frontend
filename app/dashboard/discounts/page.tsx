"use client";

import { useState, type FormEvent } from "react";
import { useToken } from "@/lib/auth";
import { useBusiness } from "@/components/dashboard/BusinessContext";
import { useApiResource } from "@/lib/useApiResource";
import {
  getMyDiscounts,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  type Discount,
  type DiscountInput,
} from "@/lib/business-dashboard";
import FormField from "@/components/FormField";
import { useConfirm } from "@/components/dashboard/ConfirmDialog";
import { useToast } from "@/components/dashboard/ToastProvider";
import { ApiError } from "@/lib/api";

const emptyForm: DiscountInput = {
  code: "",
  description: "",
  discount_type: "percent",
  value: 0,
  starts_at: "",
  expires_at: "",
  max_redemptions: undefined,
  active: true,
};

export default function DiscountsPage() {
  const token = useToken();
  const { business } = useBusiness();
  const toast = useToast();
  const confirm = useConfirm();

  const { data: discounts, loading, error, refetch } = useApiResource<Discount[]>(
    (token) => getMyDiscounts(token, business.slug),
    [business.slug]
  );

  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<DiscountInput>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  function startEdit(d: Discount) {
    setForm({
      code: "",
      description: d.description,
      discount_type: d.discount_type,
      value: d.value,
      starts_at: d.starts_at ?? "",
      expires_at: d.expires_at ?? "",
      max_redemptions: undefined,
      active: d.active,
    });
    setFieldErrors({});
    setEditingId(d.id);
  }

  function startCreate() {
    setForm(emptyForm);
    setFieldErrors({});
    setEditingId("new");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setFieldErrors({});
    setSaving(true);
    try {
      if (editingId === "new") {
        await createDiscount(token, business.slug, form);
        toast.success("Discount created.");
      } else if (typeof editingId === "number") {
        // Leave code blank on edit to keep the current one.
        const patch: Partial<DiscountInput> = { ...form };
        if (!patch.code) delete patch.code;
        await updateDiscount(token, business.slug, editingId, patch);
        toast.success("Discount updated.");
      }
      setEditingId(null);
      refetch();
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) {
        const flat: Record<string, string> = {};
        for (const [k, msgs] of Object.entries(err.fieldErrors)) {
          flat[k] = Array.isArray(msgs) ? msgs[0] : String(msgs);
        }
        setFieldErrors(flat);
      } else {
        toast.error(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  }

  function handleDelete(d: Discount) {
    confirm.ask({
      title: "Delete this discount?",
      body: "Customers will no longer be able to redeem it. This can't be undone.",
      confirmLabel: "Delete",
      onConfirm: async () => {
        if (!token) return;
        await deleteDiscount(token, business.slug, d.id);
        toast.success("Discount deleted.");
        refetch();
      },
    });
  }

  return (
    <div className="flex flex-col gap-6 max-w-[640px]">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-[24px] text-[#423926]">Discounts</h2>
        {editingId === null && (
          <button
            type="button"
            onClick={startCreate}
            className="bg-[#2c4a34] text-white rounded-[8px] px-4 py-2 font-display font-bold text-[12px] uppercase hover:bg-[#253022] transition-colors cursor-pointer"
          >
            + Add Discount
          </button>
        )}
      </div>

      <div className="bg-[#faf6e9] border border-[#b7a78c] rounded-[12px] px-5 py-4">
        <p className="font-body text-[12px] text-[#423926]">
          This list shows all of your discounts, including inactive/expired ones. Editing a discount without
          entering a new code keeps the existing one.
        </p>
      </div>

      {loading && <p className="font-body text-[14px] text-[#596155]">Loading discounts…</p>}
      {error && <p className="font-body text-[14px] text-red-600">{error}</p>}

      {editingId !== null && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white border border-[#dbe0d9] rounded-[16px] p-6">
          <FormField
            label={editingId === "new" ? "Code" : "New Code (leave blank to keep current)"}
            id="discount_code"
            value={form.code}
            onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
            error={fieldErrors.code}
          />
          <FormField
            label="Description"
            id="discount_description"
            as="textarea"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            error={fieldErrors.description}
          />
          <div className="flex gap-3">
            <FormField
              label="Type"
              id="discount_type"
              as="select"
              value={form.discount_type}
              onChange={(e) => setForm((f) => ({ ...f, discount_type: e.target.value as "percent" | "fixed" }))}
              error={fieldErrors.discount_type}
              className="flex-1"
            >
              <option value="percent">Percent off</option>
              <option value="fixed">Fixed amount off</option>
            </FormField>
            <FormField
              label="Value"
              id="discount_value"
              type="number"
              min={0}
              max={form.discount_type === "percent" ? 100 : undefined}
              value={form.value}
              onChange={(e) => setForm((f) => ({ ...f, value: Number(e.target.value) }))}
              error={fieldErrors.value}
              className="flex-1"
            />
          </div>
          <div className="flex gap-3">
            <FormField
              label="Starts"
              id="discount_starts_at"
              type="date"
              value={form.starts_at ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, starts_at: e.target.value }))}
              error={fieldErrors.starts_at}
              className="flex-1"
            />
            <FormField
              label="Expires"
              id="discount_expires_at"
              type="date"
              value={form.expires_at ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, expires_at: e.target.value }))}
              error={fieldErrors.expires_at}
              className="flex-1"
            />
          </div>
          <FormField
            label="Max Redemptions (optional)"
            id="discount_max"
            type="number"
            min={1}
            value={form.max_redemptions ?? ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, max_redemptions: e.target.value ? Number(e.target.value) : undefined }))
            }
            error={fieldErrors.max_redemptions}
          />
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
              className="bg-[#2c4a34] rounded-[8px] px-6 py-[10px] font-display font-bold text-[13px] text-white uppercase hover:bg-[#253022] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setEditingId(null)}
              disabled={saving}
              className="border border-[#dbe0d9] rounded-[8px] px-6 py-[10px] font-display font-bold text-[13px] text-[#423926] uppercase hover:border-[#b7a78c] transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-3">
        {discounts?.length === 0 && editingId === null && (
          <p className="font-body text-[14px] text-[#596155]">No discounts yet.</p>
        )}
        {discounts?.map((d) => (
          <div key={d.id} className="flex items-center justify-between gap-4 bg-white border border-[#dbe0d9] rounded-[12px] p-4">
            <div className="min-w-0">
              <p className="font-display font-bold text-[15px] text-[#253022]">
                {d.discount_type === "percent" ? `${d.value}% off` : `$${d.value} off`}
                {!d.active && <span className="text-[#b7a78c] font-normal"> · Inactive</span>}
              </p>
              <p className="font-body text-[13px] text-[#596155] mt-1">{d.description}</p>
              <p className="font-body text-[12px] text-[#b7a78c] mt-1">Code: {d.code}</p>
            </div>
            <div className="flex-shrink-0 flex gap-3">
              <button
                type="button"
                onClick={() => startEdit(d)}
                className="font-display font-bold text-[12px] text-[#596155] uppercase hover:text-[#253022] transition-colors cursor-pointer"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(d)}
                className="font-display font-bold text-[12px] text-[#b7a78c] uppercase hover:text-red-600 transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {confirm.dialog}
    </div>
  );
}

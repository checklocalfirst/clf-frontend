"use client";

import { useState, type FormEvent } from "react";
import { useToken } from "@/lib/auth";
import { useApiResource } from "@/lib/useApiResource";
import { getCategories, type Category } from "@/lib/directory";
import { updateAdminCategory, createCategory, deleteCategory } from "@/lib/admin/categories";
import FormField from "@/components/FormField";
import { useConfirm } from "@/components/dashboard/ConfirmDialog";
import { useToast } from "@/components/dashboard/ToastProvider";
import { ApiError } from "@/lib/api";

const emptyForm = { name: "", slug: "" };

export default function AdminCategoriesPage() {
  const token = useToken();
  const toast = useToast();
  const confirm = useConfirm();

  const { data: categories, loading, error, setData: setCategories } = useApiResource<Category[]>(() =>
    getCategories()
  );

  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  function startEdit(c: Category) {
    setForm({ name: c.name, slug: c.slug });
    setFieldErrors({});
    setEditingId(c.id);
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
        const created = await createCategory(token, form);
        setCategories((prev) => [...(prev ?? []), created]);
        toast.success("Category created.");
      } else if (typeof editingId === "number") {
        const updated = await updateAdminCategory(token, editingId, form);
        setCategories((prev) => prev?.map((c) => (c.id === editingId ? updated : c)) ?? null);
        toast.success("Category updated.");
      }
      setEditingId(null);
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

  function handleDelete(c: Category) {
    confirm.ask({
      title: "Delete this category?",
      body: `"${c.name}" will be removed. This fails if any service is still assigned to it.`,
      confirmLabel: "Delete",
      onConfirm: async () => {
        if (!token) return;
        await deleteCategory(token, c.id);
        setCategories((prev) => prev?.filter((cat) => cat.id !== c.id) ?? null);
        toast.success("Category deleted.");
      },
    });
  }

  return (
    <div className="flex flex-col gap-6 max-w-[560px]">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-[24px] text-[#423926]">Categories</h2>
        {editingId === null && (
          <button
            type="button"
            onClick={startCreate}
            className="bg-[#2c4a34] text-white rounded-[8px] px-4 py-2 font-display font-bold text-[12px] uppercase hover:bg-[#253022] transition-colors cursor-pointer"
          >
            + Add Category
          </button>
        )}
      </div>

      {loading && <p className="font-body text-[14px] text-[#596155]">Loading categories…</p>}
      {error && <p className="font-body text-[14px] text-red-600">{error}</p>}

      {editingId !== null && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white border border-[#dbe0d9] rounded-[16px] p-6">
          <FormField
            label="Name"
            id="category_name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            error={fieldErrors.name}
          />
          <FormField
            label="Slug"
            id="category_slug"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            error={fieldErrors.slug}
            hint="lowercase-hyphenated, e.g. home-repair"
          />
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

      <div className="flex flex-col gap-2">
        {categories?.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between gap-4 bg-white border border-[#dbe0d9] rounded-[12px] px-4 py-3"
          >
            <div>
              <p className="font-display font-bold text-[14px] text-[#253022]">{c.name}</p>
              <p className="font-body text-[12px] text-[#b7a78c]">{c.slug}</p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => startEdit(c)}
                className="font-display font-bold text-[11px] text-[#596155] uppercase hover:text-[#253022] transition-colors cursor-pointer"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(c)}
                className="font-display font-bold text-[11px] text-[#b7a78c] uppercase hover:text-red-600 transition-colors cursor-pointer"
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

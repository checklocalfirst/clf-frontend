"use client";

import { useState } from "react";
import { useToken } from "@/lib/auth";
import { useAdminBusiness } from "@/components/dashboard/AdminBusinessContext";
import { useApiResource } from "@/lib/useApiResource";
import { getCategories, type Category } from "@/lib/directory";
import { updateAdminBusinessCategories } from "@/lib/admin/businesses";
import MultiSelect from "@/components/dashboard/MultiSelect";
import { useToast } from "@/components/dashboard/ToastProvider";
import { ApiError } from "@/lib/api";

export default function AdminBusinessCategoriesPage() {
  const token = useToken();
  const { business, refetch } = useAdminBusiness();
  const toast = useToast();
  const { data: allCategories } = useApiResource<Category[]>(() => getCategories());

  const [categoryIds, setCategoryIds] = useState<number[]>(business.categories.map((c) => c.id));
  const [saving, setSaving] = useState(false);

  // Resync the selection whenever the business's categories change underneath us.
  const [prevCategories, setPrevCategories] = useState(business.categories);
  if (business.categories !== prevCategories) {
    setPrevCategories(business.categories);
    setCategoryIds(business.categories.map((c) => c.id));
  }

  async function handleSave() {
    if (!token) return;
    setSaving(true);
    try {
      // Don't trust the PUT response's shape for the list — just re-fetch the full
      // business, which is known to return `categories` as a `{ id, name, slug }[]`.
      await updateAdminBusinessCategories(token, business.id, categoryIds);
      refetch();
      toast.success("Categories updated.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't update categories.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 bg-white border border-[#dbe0d9] rounded-[16px] p-6 md:p-8 max-w-[640px]">
      <div>
        <h3 className="font-display font-bold text-[18px] text-[#423926]">Categories</h3>
        <p className="font-body text-[13px] text-[#596155] mt-1">
          1–20 categories. Zero categories blocks approval.
        </p>
      </div>
      <MultiSelect options={allCategories ?? []} selected={categoryIds} onChange={setCategoryIds} min={1} max={20} />
      <button
        type="button"
        onClick={handleSave}
        disabled={saving || categoryIds.length === 0}
        className="self-start bg-[#2c4a34] rounded-[8px] px-6 py-[12px] font-display font-bold text-[14px] text-white uppercase hover:bg-[#253022] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {saving ? "Saving..." : "Save Categories"}
      </button>
    </div>
  );
}

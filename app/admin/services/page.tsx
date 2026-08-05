"use client";

import { useState, type FormEvent } from "react";
import { useToken } from "@/lib/auth";
import { useApiResource } from "@/lib/useApiResource";
import { listAdminServices, updateAdminService, deleteAdminService } from "@/lib/admin/services";
import { getCategories, type Category, type ServiceWithBusiness } from "@/lib/directory";
import DataTable, { type Column } from "@/components/dashboard/DataTable";
import Pager from "@/components/dashboard/Pager";
import FormField from "@/components/FormField";
import { useConfirm } from "@/components/dashboard/ConfirmDialog";
import { useToast } from "@/components/dashboard/ToastProvider";
import { ApiError } from "@/lib/api";

export default function AdminServicesPage() {
  const token = useToken();
  const toast = useToast();
  const confirm = useConfirm();
  const [page, setPage] = useState(1);

  const { data, loading, error, refetch } = useApiResource(
    (t) => listAdminServices(t, { page, limit: 20 }),
    [page]
  );
  const { data: categories } = useApiResource<Category[]>(() => getCategories());

  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<{ name: string; description: string; category_id: number }>({
    name: "",
    description: "",
    category_id: 0,
  });
  const [saving, setSaving] = useState(false);

  function startEdit(s: ServiceWithBusiness) {
    setForm({ name: s.name, description: s.description ?? "", category_id: s.category_id });
    setEditingId(s.id);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token || editingId === null) return;
    setSaving(true);
    try {
      await updateAdminService(token, editingId, form);
      toast.success("Service updated.");
      setEditingId(null);
      refetch();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't update service.");
    } finally {
      setSaving(false);
    }
  }

  function handleDelete(s: ServiceWithBusiness) {
    confirm.ask({
      title: "Delete this service?",
      body: `"${s.name}" from ${s.businesses.name} will be removed permanently.`,
      confirmLabel: "Delete",
      onConfirm: async () => {
        if (!token) return;
        await deleteAdminService(token, s.id);
        toast.success("Service deleted.");
        refetch();
      },
    });
  }

  const columns: Column<ServiceWithBusiness>[] = [
    { key: "name", header: "Name", render: (s) => s.name },
    { key: "business", header: "Business", render: (s) => s.businesses.name },
    {
      key: "category",
      header: "Category",
      render: (s) => categories?.find((c) => c.id === s.category_id)?.name ?? "—",
    },
    {
      key: "actions",
      header: "",
      render: (s) => (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => startEdit(s)}
            className="font-display font-bold text-[11px] text-[#596155] uppercase hover:text-[#253022] transition-colors cursor-pointer"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => handleDelete(s)}
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
      <h2 className="font-display font-bold text-[24px] text-[#423926]">Services</h2>

      {editingId !== null && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 bg-white border border-[#dbe0d9] rounded-[16px] p-6 max-w-[480px]"
        >
          <FormField
            label="Name"
            id="edit_service_name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <FormField
            label="Description"
            id="edit_service_description"
            as="textarea"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
          <FormField
            label="Category"
            id="edit_service_category"
            as="select"
            value={form.category_id}
            onChange={(e) => setForm((f) => ({ ...f, category_id: Number(e.target.value) }))}
          >
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </FormField>
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

      {loading && <p className="font-body text-[14px] text-[#596155]">Loading services…</p>}
      {error && <p className="font-body text-[14px] text-red-600">{error}</p>}

      {data && (
        <>
          <DataTable columns={columns} rows={data.data} rowKey={(s) => s.id} emptyMessage="No services yet." />
          <Pager page={data.pagination.page} totalPages={data.pagination.totalPages} onPageChange={setPage} />
        </>
      )}

      {confirm.dialog}
    </div>
  );
}

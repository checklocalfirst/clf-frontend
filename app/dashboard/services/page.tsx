"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useToken } from "@/lib/auth";
import { useBusiness } from "@/components/dashboard/BusinessContext";
import { useApiResource } from "@/lib/useApiResource";
import { getBusinessServices, getCategories, type Service, type Category } from "@/lib/directory";
import { createService, updateService, deleteService, type ServiceInput } from "@/lib/business-dashboard";
import FormField from "@/components/FormField";
import { useConfirm } from "@/components/dashboard/ConfirmDialog";
import { useToast } from "@/components/dashboard/ToastProvider";
import { ApiError } from "@/lib/api";

const emptyForm: ServiceInput = { name: "", description: "", category_id: 0 };

export default function ServicesPage() {
  const token = useToken();
  const { business } = useBusiness();
  const toast = useToast();
  const confirm = useConfirm();

  const { data: services, loading, error, setData: setServices } = useApiResource<Service[]>(
    () => getBusinessServices(business.slug),
    [business.slug]
  );
  const { data: categories } = useApiResource<Category[]>(() => getCategories());

  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<ServiceInput>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingId === "new") setForm(emptyForm);
  }, [editingId]);

  function startEdit(service: Service) {
    setForm({ name: service.name, description: service.description ?? "", category_id: service.category_id });
    setFieldErrors({});
    setEditingId(service.id);
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
        const created = await createService(token, business.slug, form);
        setServices((prev) => [...(prev ?? []), created]);
        toast.success("Service added.");
      } else if (typeof editingId === "number") {
        const updated = await updateService(token, business.slug, editingId, form);
        setServices((prev) => prev?.map((s) => (s.id === editingId ? updated : s)) ?? null);
        toast.success("Service updated.");
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
        toast.error(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  }

  function handleDelete(service: Service) {
    confirm.ask({
      title: "Delete this service?",
      body: `"${service.name}" will be removed from your listing. This can't be undone.`,
      confirmLabel: "Delete",
      onConfirm: async () => {
        if (!token) return;
        await deleteService(token, business.slug, service.id);
        setServices((prev) => prev?.filter((s) => s.id !== service.id) ?? null);
        toast.success("Service deleted.");
      },
    });
  }

  const categoryName = (id: number) => categories?.find((c) => c.id === id)?.name ?? "—";

  return (
    <div className="flex flex-col gap-6 max-w-[640px]">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-[24px] text-[#423926]">Services</h2>
        {editingId === null && (
          <button
            type="button"
            onClick={startCreate}
            className="bg-[#2c4a34] text-white rounded-[8px] px-4 py-2 font-display font-bold text-[12px] uppercase hover:bg-[#253022] transition-colors cursor-pointer"
          >
            + Add Service
          </button>
        )}
      </div>

      <p className="font-body text-[13px] text-[#596155] -mt-2">
        Services double as your search terms — customers find you by what you list here, so the more you
        add the easier it is to appear in search. There&apos;s no limit, so list everything you offer.
      </p>

      {loading && <p className="font-body text-[14px] text-[#596155]">Loading services…</p>}
      {error && <p className="font-body text-[14px] text-red-600">{error}</p>}

      {editingId !== null && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white border border-[#dbe0d9] rounded-[16px] p-6">
          <FormField
            label="Name"
            id="service_name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            error={fieldErrors.name}
          />
          <FormField
            label="Description"
            id="service_description"
            as="textarea"
            value={form.description ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            error={fieldErrors.description}
          />
          <FormField
            label="Category"
            id="service_category"
            as="select"
            value={form.category_id || ""}
            onChange={(e) => setForm((f) => ({ ...f, category_id: Number(e.target.value) }))}
            error={fieldErrors.category_id}
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </FormField>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving || !form.category_id}
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
        {services?.length === 0 && editingId === null && (
          <p className="font-body text-[14px] text-[#596155]">No services yet — add your first one above.</p>
        )}
        {services?.map((service) => (
          <div key={service.id} className="flex items-center justify-between gap-4 bg-white border border-[#dbe0d9] rounded-[12px] p-4">
            <div className="min-w-0">
              <p className="font-display font-bold text-[15px] text-[#253022]">{service.name}</p>
              <p className="font-body text-[12px] text-[#b7a78c] uppercase">{categoryName(service.category_id)}</p>
              {service.description && <p className="font-body text-[13px] text-[#596155] mt-1">{service.description}</p>}
            </div>
            <div className="flex-shrink-0 flex gap-3">
              <button
                type="button"
                onClick={() => startEdit(service)}
                className="font-display font-bold text-[12px] text-[#596155] uppercase hover:text-[#253022] transition-colors cursor-pointer"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(service)}
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

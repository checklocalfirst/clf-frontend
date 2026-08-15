"use client";

import { useState, type FormEvent } from "react";
import { useToken } from "@/lib/auth";
import { useAdminBusiness } from "@/components/dashboard/AdminBusinessContext";
import { useApiResource } from "@/lib/useApiResource";
import { getCategories, type Category, type Service } from "@/lib/directory";
import { createAdminService, updateAdminService, deleteAdminService } from "@/lib/admin/services";
import FormField from "@/components/FormField";
import { useConfirm } from "@/components/dashboard/ConfirmDialog";
import { useToast } from "@/components/dashboard/ToastProvider";
import { ApiError } from "@/lib/api";

interface ServiceFormState {
  name: string;
  description: string;
  category_id: number | "";
}

const emptyForm: ServiceFormState = { name: "", description: "", category_id: "" };

function flattenFieldErrors(fieldErrors: Record<string, string[]>): Record<string, string> {
  const flat: Record<string, string> = {};
  for (const [k, msgs] of Object.entries(fieldErrors)) {
    flat[k] = Array.isArray(msgs) ? msgs[0] : String(msgs);
  }
  return flat;
}

function ServiceRow({
  service,
  categories,
  onSave,
  onDelete,
}: {
  service: Service;
  categories: Category[];
  onSave: (id: number, patch: { name: string; description: string; category_id: number }) => Promise<void>;
  onDelete: (service: Service) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<ServiceFormState>({
    name: service.name,
    description: service.description ?? "",
    category_id: service.category_id,
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const categoryName = categories.find((c) => c.id === service.category_id)?.name ?? "Uncategorized";

  function cancelEdit() {
    setEditing(false);
    setFieldErrors({});
    setForm({ name: service.name, description: service.description ?? "", category_id: service.category_id });
  }

  async function handleSave() {
    if (form.category_id === "") return;
    setFieldErrors({});
    setSaving(true);
    try {
      await onSave(service.id, { name: form.name, description: form.description, category_id: form.category_id });
      setEditing(false);
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) {
        setFieldErrors(flattenFieldErrors(err.fieldErrors));
      } else {
        toast.error(err instanceof ApiError ? err.message : "Couldn't update service.");
      }
    } finally {
      setSaving(false);
    }
  }

  if (!editing) {
    return (
      <div className="flex items-start justify-between gap-4 bg-white border border-[#dbe0d9] rounded-[12px] p-4">
        <div className="min-w-0">
          <p className="font-display font-bold text-[15px] text-[#253022]">{service.name}</p>
          {service.description && (
            <p className="font-body text-[13px] text-[#596155] mt-1">{service.description}</p>
          )}
          <span className="inline-block mt-2 px-2 py-1 rounded-full border border-[#dbe0d9] font-display font-bold text-[11px] text-[#596155] uppercase">
            {categoryName}
          </span>
        </div>
        <div className="flex flex-col gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="font-display font-bold text-[11px] text-[#2c4a34] uppercase hover:text-[#253022] transition-colors cursor-pointer"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(service)}
            className="font-display font-bold text-[11px] text-[#b7a78c] uppercase hover:text-red-600 transition-colors cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 bg-white border border-[#dbe0d9] rounded-[12px] p-4">
      <FormField
        label="Name"
        id={`svc-name-${service.id}`}
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        error={fieldErrors.name}
      />
      <FormField
        label="Description"
        id={`svc-desc-${service.id}`}
        as="textarea"
        value={form.description}
        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        error={fieldErrors.description}
      />
      <FormField
        label="Category"
        id={`svc-cat-${service.id}`}
        as="select"
        value={form.category_id}
        onChange={(e) => setForm((f) => ({ ...f, category_id: Number(e.target.value) }))}
        error={fieldErrors.category_id}
      >
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </FormField>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-[#2c4a34] rounded-[8px] px-5 py-2 font-display font-bold text-[12px] text-white uppercase hover:bg-[#253022] transition-colors cursor-pointer disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={cancelEdit}
          className="border border-[#dbe0d9] rounded-[8px] px-5 py-2 font-display font-bold text-[12px] text-[#423926] uppercase hover:border-[#b7a78c] transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function AdminBusinessServicesPage() {
  const token = useToken();
  const { business } = useAdminBusiness();
  const toast = useToast();
  const confirm = useConfirm();

  const { data: categories } = useApiResource<Category[]>(() => getCategories());

  // business.services is the source of truth on load; mutations below keep this
  // local copy in sync directly from each call's response rather than refetching.
  const [services, setServices] = useState<Service[]>(business.services);
  const [prevServices, setPrevServices] = useState(business.services);
  if (business.services !== prevServices) {
    setPrevServices(business.services);
    setServices(business.services);
  }

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ServiceFormState>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token || form.category_id === "") return;
    setFieldErrors({});
    setSaving(true);
    try {
      const created = await createAdminService(token, business.id, {
        name: form.name,
        description: form.description || undefined,
        category_id: form.category_id,
      });
      setServices((prev) => [...prev, created]);
      toast.success("Service added.");
      setShowForm(false);
      setForm(emptyForm);
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) {
        setFieldErrors(flattenFieldErrors(err.fieldErrors));
        toast.error(Object.values(err.fieldErrors).flat().join(" "));
      } else {
        toast.error(err instanceof ApiError ? err.message : "Couldn't add service.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleServiceSave(
    id: number,
    patch: { name: string; description: string; category_id: number }
  ) {
    if (!token) return;
    const updated = await updateAdminService(token, id, patch);
    setServices((prev) => prev.map((s) => (s.id === id ? updated : s)));
    toast.success("Service updated.");
  }

  function handleDelete(service: Service) {
    confirm.ask({
      title: "Delete this service?",
      body: `This removes "${service.name}" from the business's listing permanently.`,
      confirmLabel: "Delete",
      onConfirm: async () => {
        if (!token) return;
        await deleteAdminService(token, service.id);
        setServices((prev) => prev.filter((s) => s.id !== service.id));
        toast.success("Service deleted.");
      },
    });
  }

  return (
    <div className="flex flex-col gap-6 max-w-[640px]">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-[18px] text-[#423926]">Services</h3>
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="bg-[#2c4a34] text-white rounded-[8px] px-4 py-2 font-display font-bold text-[12px] uppercase hover:bg-[#253022] transition-colors cursor-pointer"
          >
            + Add Service
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 bg-white border border-[#dbe0d9] rounded-[16px] p-6"
        >
          <FormField
            label="Name"
            id="svc_new_name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            error={fieldErrors.name}
          />
          <FormField
            label="Description"
            id="svc_new_description"
            as="textarea"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            error={fieldErrors.description}
          />
          <FormField
            label="Category"
            id="svc_new_category"
            as="select"
            value={form.category_id}
            onChange={(e) =>
              setForm((f) => ({ ...f, category_id: e.target.value ? Number(e.target.value) : "" }))
            }
            error={fieldErrors.category_id}
          >
            <option value="">Select a category…</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </FormField>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving || form.category_id === ""}
              className="bg-[#2c4a34] rounded-[8px] px-6 py-[10px] font-display font-bold text-[13px] text-white uppercase hover:bg-[#253022] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Adding..." : "Add Service"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setForm(emptyForm);
                setFieldErrors({});
              }}
              className="border border-[#dbe0d9] rounded-[8px] px-6 py-[10px] font-display font-bold text-[13px] text-[#423926] uppercase hover:border-[#b7a78c] transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-3">
        {services.length === 0 && (
          <p className="font-body text-[14px] text-[#596155]">No services for this business yet.</p>
        )}
        {services.map((service) => (
          <ServiceRow
            key={service.id}
            service={service}
            categories={categories ?? []}
            onSave={handleServiceSave}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {confirm.dialog}
    </div>
  );
}

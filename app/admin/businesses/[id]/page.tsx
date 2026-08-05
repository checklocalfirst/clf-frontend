"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useToken } from "@/lib/auth";
import { useAdminBusiness } from "@/components/dashboard/AdminBusinessContext";
import {
  updateBusinessStatus,
  updateBusinessFull,
  setPilot,
  setFeatured,
  setCarousel,
  deleteAdminBusiness,
  type AdminBusinessEditInput,
} from "@/lib/admin/businesses";
import type { BusinessStatus, BusinessTier } from "@/lib/directory";
import FormField from "@/components/FormField";
import Toggle from "@/components/dashboard/Toggle";
import { useConfirm } from "@/components/dashboard/ConfirmDialog";
import { useToast } from "@/components/dashboard/ToastProvider";
import { ApiError } from "@/lib/api";

const STATUSES: BusinessStatus[] = ["pending", "approved", "suspended", "rejected"];

export default function AdminBusinessProfilePage() {
  const token = useToken();
  const router = useRouter();
  const { business, setBusiness } = useAdminBusiness();
  const toast = useToast();
  const confirm = useConfirm();

  const [statusSaving, setStatusSaving] = useState(false);
  const [form, setForm] = useState<AdminBusinessEditInput>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      name: business.name ?? "",
      description: business.description ?? "",
      address: business.address ?? "",
      city: business.city ?? "",
      state: business.state ?? "",
      zip: business.zip ?? "",
      phone: business.phone ?? "",
      email: business.email ?? "",
      website_url: business.website_url ?? "",
      about_owner: business.about_owner ?? "",
      facebook_url: business.facebook_url ?? "",
      instagram_url: business.instagram_url ?? "",
      yelp_url: business.yelp_url ?? "",
      timeline_year_1: business.timeline_year_1 ?? "",
      timeline_year_2: business.timeline_year_2 ?? "",
      timeline_year_3: business.timeline_year_3 ?? "",
      timeline_description_1: business.timeline_description_1 ?? "",
      timeline_description_2: business.timeline_description_2 ?? "",
      timeline_description_3: business.timeline_description_3 ?? "",
      business_tier: business.business_tier,
      is_comped: business.is_comped,
      latitude: business.latitude ?? undefined,
      longitude: business.longitude ?? undefined,
      neighborhood: business.neighborhood ?? "",
    });
  }, [business]);

  function set<K extends keyof AdminBusinessEditInput>(key: K, value: AdminBusinessEditInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleStatusChange(status: BusinessStatus) {
    if (!token) return;
    setStatusSaving(true);
    try {
      const updated = await updateBusinessStatus(token, business.id, status);
      setBusiness({ ...business, ...updated });
      toast.success(`Status set to ${status}.`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't update status.");
    } finally {
      setStatusSaving(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setFieldErrors({});
    setSaving(true);
    try {
      // Omit empty-string optional fields entirely rather than sending "" — the backend
      // validates url/number fields whenever they're present at all, and "" fails both
      // (e.g. an unset website_url, or a blank timeline_year coercing to 0).
      const patch: AdminBusinessEditInput = {};
      for (const [key, value] of Object.entries(form) as [keyof AdminBusinessEditInput, unknown][]) {
        if (value === "") continue;
        if (value !== undefined) (patch as Record<string, unknown>)[key] = value;
      }
      const updated = await updateBusinessFull(token, business.id, patch);
      setBusiness({ ...business, ...updated });
      toast.success("Business updated.");
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) {
        const flat: Record<string, string> = {};
        for (const [k, msgs] of Object.entries(err.fieldErrors)) {
          flat[k] = Array.isArray(msgs) ? msgs[0] : String(msgs);
        }
        setFieldErrors(flat);
        // The backend doesn't always key fieldErrors by actual field name (e.g. a
        // top-level "body" key), so inline field highlighting can silently miss —
        // always surface the raw messages in a toast too.
        toast.error(Object.values(err.fieldErrors).flat().join(" "));
      } else {
        toast.error(err instanceof ApiError ? err.message : "Something went wrong.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handlePilotToggle(next: boolean) {
    if (!token) return;
    try {
      const updated = await setPilot(token, business.id, next);
      setBusiness({ ...business, ...updated });
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't update pilot status.");
    }
  }

  function handleFeaturedToggle(next: boolean) {
    if (!token) return;
    if (!next) {
      setFeatured(token, business.id, false)
        .then((updated) => setBusiness({ ...business, ...updated }))
        .catch((err) => toast.error(err instanceof ApiError ? err.message : "Couldn't update."));
      return;
    }
    confirm.ask({
      title: "Feature this business?",
      body: "Only one business can be featured at a time — this will remove the current featured business, if any.",
      danger: false,
      confirmLabel: "Feature This Business",
      onConfirm: async () => {
        const updated = await setFeatured(token, business.id, true);
        setBusiness({ ...business, ...updated });
        toast.success("Business featured.");
      },
    });
  }

  async function handleCarouselToggle(next: boolean) {
    if (!token) return;
    try {
      const updated = await setCarousel(token, business.id, next);
      setBusiness({ ...business, ...updated });
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't update carousel status.");
    }
  }

  function handleDelete() {
    confirm.ask({
      title: "Delete this business permanently?",
      body: `This deletes "${business.name}", all of its services, photos, discounts, and the owner's login — permanently.`,
      confirmLabel: "Delete Everything",
      onConfirm: async () => {
        if (!token) return;
        await deleteAdminBusiness(token, business.id);
        toast.success("Business deleted.");
        router.push("/admin/businesses");
      },
    });
  }

  const isPremium = business.business_tier === "premium";

  return (
    <div className="flex flex-col gap-8 max-w-[680px]">
      <div className="bg-white border border-[#dbe0d9] rounded-[16px] p-6 flex flex-col gap-4">
        <p className="font-display font-bold text-[13px] text-[#b7a78c] uppercase tracking-widest">Status</p>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleStatusChange(s)}
              disabled={statusSaving || business.status === s}
              className={`px-4 py-2 rounded-full border font-display font-bold text-[12px] uppercase transition-colors cursor-pointer disabled:cursor-default ${
                business.status === s
                  ? "bg-[#2c4a34] border-[#2c4a34] text-white"
                  : "bg-white border-[#dbe0d9] text-[#423926] hover:border-[#b7a78c]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <p className="font-body text-[12px] text-[#b7a78c]">
          Approval is blocked if this business has zero categories set.
        </p>
      </div>

      <div className="bg-white border border-[#dbe0d9] rounded-[16px] p-6 flex flex-col gap-4">
        <p className="font-display font-bold text-[13px] text-[#b7a78c] uppercase tracking-widest">Flags</p>
        <div className="flex items-center justify-between">
          <span className="font-body text-[14px] text-[#423926]">Pilot Business</span>
          <Toggle checked={!!business.pilot_business} onChange={handlePilotToggle} />
        </div>
        <div className="flex items-center justify-between">
          <span className="font-body text-[14px] text-[#423926]">Featured (homepage hero)</span>
          <Toggle checked={business.is_featured} onChange={handleFeaturedToggle} disabled={!isPremium} />
        </div>
        <div className="flex items-center justify-between">
          <span className="font-body text-[14px] text-[#423926]">In Carousel</span>
          <Toggle checked={business.in_carousel} onChange={handleCarouselToggle} disabled={!isPremium} />
        </div>
        {!isPremium && (
          <p className="font-body text-[12px] text-[#b7a78c]">Featured and Carousel require Premium tier.</p>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 bg-white border border-[#dbe0d9] rounded-[16px] p-6 md:p-8"
      >
        <p className="font-display font-bold text-[13px] text-[#b7a78c] uppercase tracking-widest">Full Editor</p>

        <div className="flex gap-3 items-end">
          <FormField
            label="Tier"
            id="business_tier"
            as="select"
            value={form.business_tier ?? "basic"}
            onChange={(e) => set("business_tier", e.target.value as BusinessTier)}
            className="flex-1"
          >
            <option value="basic">Basic</option>
            <option value="premium">Premium</option>
          </FormField>
          <label className="flex-1 flex items-center gap-2 font-body text-[13px] text-[#423926] pb-3">
            <input
              type="checkbox"
              checked={!!form.is_comped}
              onChange={(e) => set("is_comped", e.target.checked)}
            />
            Comped (free premium)
          </label>
        </div>

        <FormField label="Business Name" id="admin_name" value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} error={fieldErrors.name} />
        <FormField label="Description" id="admin_description" as="textarea" value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} error={fieldErrors.description} />
        <FormField label="Street Address" id="admin_address" value={form.address ?? ""} onChange={(e) => set("address", e.target.value)} error={fieldErrors.address} />
        <div className="flex gap-3">
          <FormField label="City" id="admin_city" value={form.city ?? ""} onChange={(e) => set("city", e.target.value)} error={fieldErrors.city} className="flex-1" />
          <FormField label="State" id="admin_state" value={form.state ?? ""} onChange={(e) => set("state", e.target.value)} error={fieldErrors.state} className="w-24" />
          <FormField label="Zip" id="admin_zip" value={form.zip ?? ""} onChange={(e) => set("zip", e.target.value)} error={fieldErrors.zip} className="w-28" />
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <FormField label="Phone" id="admin_phone" value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} error={fieldErrors.phone} className="flex-1" />
          <FormField label="Email" id="admin_email" value={form.email ?? ""} onChange={(e) => set("email", e.target.value)} error={fieldErrors.email} className="flex-1" />
        </div>

        <p className="font-display font-bold text-[11px] text-[#b7a78c] uppercase tracking-widest pt-2">
          Geocoding Override
        </p>
        <div className="flex gap-3">
          <FormField
            label="Latitude"
            id="admin_lat"
            type="number"
            step="any"
            value={form.latitude ?? ""}
            onChange={(e) => set("latitude", e.target.value ? Number(e.target.value) : undefined)}
            className="flex-1"
          />
          <FormField
            label="Longitude"
            id="admin_lng"
            type="number"
            step="any"
            value={form.longitude ?? ""}
            onChange={(e) => set("longitude", e.target.value ? Number(e.target.value) : undefined)}
            className="flex-1"
          />
          <FormField
            label="Neighborhood"
            id="admin_neighborhood"
            value={form.neighborhood ?? ""}
            onChange={(e) => set("neighborhood", e.target.value)}
            className="flex-1"
          />
        </div>

        <p className="font-display font-bold text-[11px] text-[#b7a78c] uppercase tracking-widest pt-2">
          Links &amp; About
        </p>
        <FormField label="Website" id="admin_website" value={form.website_url ?? ""} onChange={(e) => set("website_url", e.target.value)} />
        <FormField label="About the Owner" id="admin_about" as="textarea" value={form.about_owner ?? ""} onChange={(e) => set("about_owner", e.target.value)} />
        <div className="flex flex-col gap-4 sm:flex-row">
          <FormField label="Facebook" id="admin_fb" value={form.facebook_url ?? ""} onChange={(e) => set("facebook_url", e.target.value)} className="flex-1" />
          <FormField label="Instagram" id="admin_ig" value={form.instagram_url ?? ""} onChange={(e) => set("instagram_url", e.target.value)} className="flex-1" />
          <FormField label="Yelp" id="admin_yelp" value={form.yelp_url ?? ""} onChange={(e) => set("yelp_url", e.target.value)} className="flex-1" />
        </div>

        <p className="font-display font-bold text-[11px] text-[#b7a78c] uppercase tracking-widest pt-2">
          Timeline (admin can set regardless of tier)
        </p>
        {([1, 2, 3] as const).map((n) => (
          <div key={n} className="flex gap-3">
            <FormField
              label={`Timeline Year ${n}`}
              id={`admin_timeline_year_${n}`}
              value={(form[`timeline_year_${n}` as keyof AdminBusinessEditInput] as string) ?? ""}
              onChange={(e) => set(`timeline_year_${n}` as keyof AdminBusinessEditInput, e.target.value as never)}
              className="w-32"
            />
            <FormField
              label={`Timeline ${n} Description`}
              id={`admin_timeline_description_${n}`}
              value={(form[`timeline_description_${n}` as keyof AdminBusinessEditInput] as string) ?? ""}
              onChange={(e) =>
                set(`timeline_description_${n}` as keyof AdminBusinessEditInput, e.target.value as never)
              }
              className="flex-1"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={saving}
          className="self-start bg-[#2c4a34] rounded-[8px] px-6 py-[12px] font-display font-bold text-[14px] text-white uppercase hover:bg-[#253022] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <div className="bg-white border border-red-200 rounded-[16px] p-6 flex flex-col gap-4">
        <p className="font-display font-bold text-[13px] text-red-600 uppercase tracking-widest">Danger Zone</p>
        <button
          type="button"
          onClick={handleDelete}
          className="self-start border border-red-300 text-red-600 rounded-[8px] px-6 py-[10px] font-display font-bold text-[13px] uppercase hover:bg-red-50 transition-colors cursor-pointer"
        >
          Delete Business
        </button>
      </div>

      {confirm.dialog}
    </div>
  );
}

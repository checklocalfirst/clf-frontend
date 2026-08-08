"use client";

import { useState, type FormEvent } from "react";
import { useToken } from "@/lib/auth";
import { useBusiness } from "@/components/dashboard/BusinessContext";
import { useApiResource } from "@/lib/useApiResource";
import { getCategories, getBusinessCategories, type Category, type Business } from "@/lib/directory";
import {
  updateMyBusiness,
  updateMyCategories,
  type BusinessProfileInput,
} from "@/lib/business-dashboard";
import FormField from "@/components/FormField";
import MultiSelect from "@/components/dashboard/MultiSelect";
import PremiumUpsell from "@/components/dashboard/PremiumUpsell";
import { useToast } from "@/components/dashboard/ToastProvider";
import { ApiError } from "@/lib/api";

const BASIC_FIELD_KEYS: (keyof BusinessProfileInput)[] = [
  "name",
  "description",
  "address",
  "city",
  "state",
  "zip",
  "phone",
  "email",
  "website_url",
  "about_owner",
  "facebook_url",
  "instagram_url",
  "yelp_url",
];

const PREMIUM_FIELD_KEYS: (keyof BusinessProfileInput)[] = [
  "timeline_year_1",
  "timeline_description_1",
  "timeline_year_2",
  "timeline_description_2",
  "timeline_year_3",
  "timeline_description_3",
];

function buildForm(business: Business): BusinessProfileInput {
  return {
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
  };
}

export default function BusinessProfilePage() {
  const token = useToken();
  const { business, setBusiness } = useBusiness();
  const toast = useToast();
  const isPremium = business.business_tier === "premium";

  const { data: allCategories } = useApiResource<Category[]>(() => getCategories());
  const { data: myCategories, refetch: refetchMyCategories } = useApiResource<Category[]>(
    () => getBusinessCategories(business.slug),
    [business.slug]
  );

  const [form, setForm] = useState<BusinessProfileInput>(() => buildForm(business));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [savingCategories, setSavingCategories] = useState(false);

  // Reset the editable form whenever the loaded business changes underneath us.
  const [prevBusiness, setPrevBusiness] = useState(business);
  if (business !== prevBusiness) {
    setPrevBusiness(business);
    setForm(buildForm(business));
  }

  // Sync the category selection once it arrives from its own (async) fetch.
  const [prevMyCategories, setPrevMyCategories] = useState(myCategories);
  if (myCategories !== prevMyCategories) {
    setPrevMyCategories(myCategories);
    if (myCategories) setCategoryIds(myCategories.map((c) => c.id));
  }

  function set<K extends keyof BusinessProfileInput>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setFieldErrors({});
    setSaving(true);
    try {
      const keys = isPremium ? [...BASIC_FIELD_KEYS, ...PREMIUM_FIELD_KEYS] : BASIC_FIELD_KEYS;
      const patch: BusinessProfileInput = {};
      for (const key of keys) {
        const value = form[key];
        // Omit empty-string optional fields entirely rather than sending "" — the
        // backend validates url/number fields whenever they're present at all.
        if (value !== undefined && value !== "") (patch as Record<string, string>)[key] = value;
      }
      const updated = await updateMyBusiness(token, business.slug, patch);
      setBusiness(updated);
      toast.success("Business profile updated.");
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
        toast.error(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveCategories() {
    if (!token) return;
    setSavingCategories(true);
    try {
      // Don't trust the PUT response's shape for the list — just re-fetch from the
      // GET route, which is known to return the `{ id, name, slug }[]` array.
      await updateMyCategories(token, business.slug, categoryIds);
      refetchMyCategories();
      toast.success("Categories updated.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't update categories.");
    } finally {
      setSavingCategories(false);
    }
  }

  return (
    <div className="flex flex-col gap-8 max-w-[640px]">
      <div>
        <h2 className="font-display font-bold text-[24px] text-[#423926]">Business Profile</h2>
        <p className="font-body text-[13px] text-[#596155] mt-1">
          Changes to your address trigger re-geocoding for &quot;near me&quot; search.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 bg-white border border-[#dbe0d9] rounded-[16px] p-6 md:p-8">
        <FormField label="Business Name" id="name" value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} error={fieldErrors.name} />
        <FormField
          label="Description"
          id="description"
          as="textarea"
          value={form.description ?? ""}
          onChange={(e) => set("description", e.target.value)}
          error={fieldErrors.description}
        />
        <FormField label="Street Address" id="address" value={form.address ?? ""} onChange={(e) => set("address", e.target.value)} error={fieldErrors.address} />
        <div className="flex gap-3">
          <FormField label="City" id="city" value={form.city ?? ""} onChange={(e) => set("city", e.target.value)} error={fieldErrors.city} className="flex-1" />
          <FormField label="State" id="state" value={form.state ?? ""} onChange={(e) => set("state", e.target.value)} error={fieldErrors.state} className="w-24" />
          <FormField label="Zip" id="zip" value={form.zip ?? ""} onChange={(e) => set("zip", e.target.value)} error={fieldErrors.zip} className="w-28" />
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <FormField label="Phone" id="phone" type="tel" value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} error={fieldErrors.phone} className="flex-1" />
          <FormField label="Email" id="email" type="email" value={form.email ?? ""} onChange={(e) => set("email", e.target.value)} error={fieldErrors.email} className="flex-1" />
        </div>

        <p className="font-display font-bold text-[11px] text-[#b7a78c] uppercase tracking-widest pt-2">
          Links &amp; About
        </p>
        <FormField label="Website" id="website_url" value={form.website_url ?? ""} onChange={(e) => set("website_url", e.target.value)} error={fieldErrors.website_url} />
        <FormField
          label="About the Owner"
          id="about_owner"
          as="textarea"
          value={form.about_owner ?? ""}
          onChange={(e) => set("about_owner", e.target.value)}
          error={fieldErrors.about_owner}
        />
        <div className="flex flex-col gap-4 sm:flex-row">
          <FormField label="Facebook" id="facebook_url" value={form.facebook_url ?? ""} onChange={(e) => set("facebook_url", e.target.value)} error={fieldErrors.facebook_url} className="flex-1" />
          <FormField label="Instagram" id="instagram_url" value={form.instagram_url ?? ""} onChange={(e) => set("instagram_url", e.target.value)} error={fieldErrors.instagram_url} className="flex-1" />
          <FormField label="Yelp" id="yelp_url" value={form.yelp_url ?? ""} onChange={(e) => set("yelp_url", e.target.value)} error={fieldErrors.yelp_url} className="flex-1" />
        </div>

        <p className="font-display font-bold text-[11px] text-[#b7a78c] uppercase tracking-widest pt-2">
          Premium Timeline
        </p>
        {isPremium ? (
          <>
            {([1, 2, 3] as const).map((n) => (
              <div key={n} className="flex gap-3">
                <FormField
                  label={`Timeline Year ${n}`}
                  id={`timeline_year_${n}`}
                  value={form[`timeline_year_${n}` as keyof BusinessProfileInput] ?? ""}
                  onChange={(e) => set(`timeline_year_${n}` as keyof BusinessProfileInput, e.target.value)}
                  error={fieldErrors[`timeline_year_${n}`]}
                  className="w-32"
                />
                <FormField
                  label={`Timeline ${n} Description`}
                  id={`timeline_description_${n}`}
                  value={form[`timeline_description_${n}` as keyof BusinessProfileInput] ?? ""}
                  onChange={(e) => set(`timeline_description_${n}` as keyof BusinessProfileInput, e.target.value)}
                  error={fieldErrors[`timeline_description_${n}`]}
                  className="flex-1"
                />
              </div>
            ))}
          </>
        ) : (
          <PremiumUpsell message="The timeline section is available on Premium — show your business's history on your public page." />
        )}

        <button
          type="submit"
          disabled={saving}
          className="self-start bg-[#2c4a34] rounded-[8px] px-6 py-[12px] font-display font-bold text-[14px] text-white uppercase hover:bg-[#253022] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <div className="flex flex-col gap-4 bg-white border border-[#dbe0d9] rounded-[16px] p-6 md:p-8">
        <div>
          <h3 className="font-display font-bold text-[18px] text-[#423926]">Categories</h3>
          <p className="font-body text-[13px] text-[#596155] mt-1">
            Pick 1–20 categories. This drives what shows up when customers filter search by category.
          </p>
        </div>
        <MultiSelect
          options={allCategories ?? []}
          selected={categoryIds}
          onChange={setCategoryIds}
          min={1}
          max={20}
        />
        <button
          type="button"
          onClick={handleSaveCategories}
          disabled={savingCategories || categoryIds.length === 0}
          className="self-start bg-[#2c4a34] rounded-[8px] px-6 py-[12px] font-display font-bold text-[14px] text-white uppercase hover:bg-[#253022] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {savingCategories ? "Saving..." : "Save Categories"}
        </button>
      </div>
    </div>
  );
}

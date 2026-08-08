"use client";

import { useState, type FormEvent } from "react";
import { useToken } from "@/lib/auth";
import { useApiResource } from "@/lib/useApiResource";
import { getMe, updateMe, type UserProfile } from "@/lib/users";
import { useToast } from "@/components/dashboard/ToastProvider";
import { ApiError } from "@/lib/api";
import FormField from "@/components/FormField";

export default function AccountProfilePage() {
  const token = useToken();
  const { data: user, loading, error, setData } = useApiResource<UserProfile>((t) => getMe(t));
  const toast = useToast();

  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", phone: "" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Reset the editable form whenever a freshly-fetched user comes in, adjusted
  // during render instead of in an effect so it lands in the same commit.
  const [prevUser, setPrevUser] = useState(user);
  if (user !== prevUser) {
    setPrevUser(user);
    if (user) {
      setForm({
        first_name: user.first_name ?? "",
        last_name: user.last_name ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
      });
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setFieldErrors({});
    setSaving(true);
    try {
      const updated = await updateMe(token, form);
      setData(updated);
      toast.success("Profile updated.");
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

  if (loading) {
    return <p className="font-body text-[14px] text-[#596155]">Loading your profile…</p>;
  }

  if (error) {
    return <p className="font-body text-[14px] text-red-600">{error}</p>;
  }

  return (
    <div className="flex flex-col gap-6 max-w-[520px]">
      <h2 className="font-display font-bold text-[24px] text-[#423926]">Profile</h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 bg-white border border-[#dbe0d9] rounded-[16px] p-6 md:p-8"
      >
        <div className="flex flex-col gap-4 sm:flex-row">
          <FormField
            label="First Name"
            id="first_name"
            value={form.first_name}
            onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
            error={fieldErrors.first_name}
            className="flex-1"
          />
          <FormField
            label="Last Name"
            id="last_name"
            value={form.last_name}
            onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
            error={fieldErrors.last_name}
            className="flex-1"
          />
        </div>
        <FormField
          label="Email"
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          error={fieldErrors.email}
        />
        <FormField
          label="Phone"
          id="phone"
          type="tel"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          error={fieldErrors.phone}
          hint="10 digits, no dashes"
        />
        <button
          type="submit"
          disabled={saving}
          className="self-start bg-[#2c4a34] rounded-[8px] px-6 py-[12px] font-display font-bold text-[14px] text-white uppercase hover:bg-[#253022] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

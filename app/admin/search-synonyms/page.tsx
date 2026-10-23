"use client";

import { use, useState, type FormEvent } from "react";
import { useToken } from "@/lib/auth";
import { useApiResource } from "@/lib/useApiResource";
import {
  getSearchSynonyms,
  createSearchSynonym,
  deleteSearchSynonym,
  type SearchSynonym,
} from "@/lib/admin/synonyms";
import FormField from "@/components/FormField";
import { useConfirm } from "@/components/dashboard/ConfirmDialog";
import { useToast } from "@/components/dashboard/ToastProvider";
import { ApiError } from "@/lib/api";

const emptyForm = { term: "", synonym: "" };

export default function AdminSearchSynonymsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // ?term= prefills the form — the "Add synonym" shortcut on Missed searches links here.
  const rawTerm = use(searchParams).term;
  const initialTerm = typeof rawTerm === "string" ? rawTerm : "";
  const token = useToken();
  const toast = useToast();
  const confirm = useConfirm();

  const { data: synonyms, loading, error, setData: setSynonyms } = useApiResource<SearchSynonym[]>((token) =>
    getSearchSynonyms(token)
  );

  const [form, setForm] = useState({ ...emptyForm, term: initialTerm });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setFieldErrors({});
    setSaving(true);
    try {
      const created = await createSearchSynonym(token, { term: form.term.trim(), synonym: form.synonym.trim() });
      setSynonyms((prev) => [...(prev ?? []), created]);
      setForm(emptyForm);
      toast.success("Synonym added.");
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) {
        const flat: Record<string, string> = {};
        for (const [k, msgs] of Object.entries(err.fieldErrors)) {
          flat[k] = Array.isArray(msgs) ? msgs[0] : String(msgs);
        }
        setFieldErrors(flat);
      } else if (err instanceof ApiError && err.status === 409) {
        toast.error("That pair already exists (in one order or the other).");
      } else {
        toast.error(err instanceof ApiError ? err.message : "Something went wrong.");
      }
    } finally {
      setSaving(false);
    }
  }

  function handleDelete(s: SearchSynonym) {
    confirm.ask({
      title: "Delete this synonym?",
      body: `Searches for "${s.term}" will stop matching "${s.synonym}", and the other way around.`,
      confirmLabel: "Delete",
      onConfirm: async () => {
        if (!token) return;
        await deleteSearchSynonym(token, s.id);
        setSynonyms((prev) => prev?.filter((x) => x.id !== s.id) ?? null);
        toast.success("Synonym deleted.");
      },
    });
  }

  return (
    <div className="flex flex-col gap-6 max-w-[560px]">
      <div className="flex flex-col gap-2">
        <h2 className="font-display font-bold text-[24px] text-[#423926]">Search synonyms</h2>
        <p className="font-body text-[13px] text-[#596155]">
          Each pair works in both directions: adding &ldquo;chili crunch&rdquo; &harr; &ldquo;chili crisp&rdquo; means a
          search for either one also finds businesses that list the other. You only need to add a pair once.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white border border-[#dbe0d9] rounded-[16px] p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <FormField
            label="Term"
            id="synonym_term"
            value={form.term}
            onChange={(e) => setForm((f) => ({ ...f, term: e.target.value }))}
            error={fieldErrors.term}
            placeholder="chili crunch"
            className="flex-1"
          />
          <FormField
            label="Synonym"
            id="synonym_synonym"
            value={form.synonym}
            onChange={(e) => setForm((f) => ({ ...f, synonym: e.target.value }))}
            error={fieldErrors.synonym}
            placeholder="chili crisp"
            className="flex-1"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={saving || !form.term.trim() || !form.synonym.trim()}
            className="bg-[#2c4a34] rounded-[8px] px-6 py-[10px] font-display font-bold text-[13px] text-white uppercase hover:bg-[#253022] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? "Adding..." : "+ Add Pair"}
          </button>
        </div>
      </form>

      {loading && <p className="font-body text-[14px] text-[#596155]">Loading synonyms…</p>}
      {error && <p className="font-body text-[14px] text-red-600">{error}</p>}

      <div className="flex flex-col gap-2">
        {synonyms?.length === 0 && (
          <p className="font-body text-[14px] text-[#596155]">No synonyms yet — add your first pair above.</p>
        )}
        {synonyms?.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between gap-4 bg-white border border-[#dbe0d9] rounded-[12px] px-4 py-3"
          >
            <p className="font-display font-bold text-[14px] text-[#253022] min-w-0 break-words">
              {s.term} <span className="text-[#b7a78c] font-normal">&harr;</span> {s.synonym}
            </p>
            <button
              type="button"
              onClick={() => handleDelete(s)}
              className="flex-shrink-0 font-display font-bold text-[11px] text-[#b7a78c] uppercase hover:text-red-600 transition-colors cursor-pointer"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {confirm.dialog}
    </div>
  );
}

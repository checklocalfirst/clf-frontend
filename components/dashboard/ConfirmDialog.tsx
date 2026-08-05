"use client";

import { useCallback, useState } from "react";
import { ApiError } from "@/lib/api";
import { useToast } from "./ToastProvider";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  body: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = true,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-[420px] bg-[#faf6e9] border border-[#dbe0d9] rounded-[16px] p-6 flex flex-col gap-4">
        <h2 className="font-display font-bold text-[20px] text-[#423926]">{title}</h2>
        <p className="font-body text-[14px] text-[#596155] leading-[1.5]">{body}</p>
        <div className="flex gap-3 justify-end pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-[10px] rounded-[8px] border border-[#dbe0d9] font-display font-bold text-[13px] text-[#423926] uppercase hover:border-[#b7a78c] transition-colors cursor-pointer disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-5 py-[10px] rounded-[8px] font-display font-bold text-[13px] text-white uppercase transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
              danger ? "bg-red-600 hover:bg-red-700" : "bg-[#2c4a34] hover:bg-[#253022]"
            }`}
          >
            {loading ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

interface AskOptions {
  title: string;
  body: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void | Promise<void>;
}

/** Imperative helper: `const confirm = useConfirm(); confirm.ask({...}); return <>{confirm.dialog}</>` */
export function useConfirm() {
  const [options, setOptions] = useState<AskOptions | null>(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const ask = useCallback((opts: AskOptions) => setOptions(opts), []);

  const close = useCallback(() => {
    if (loading) return;
    setOptions(null);
  }, [loading]);

  const confirm = useCallback(async () => {
    if (!options) return;
    setLoading(true);
    try {
      await options.onConfirm();
      setOptions(null);
    } catch (err) {
      // Caller's onConfirm doesn't need its own try/catch — failures land here,
      // get a toast, and leave the dialog open so the user can retry or cancel.
      toast.error(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [options, toast]);

  const dialog = (
    <ConfirmDialog
      open={!!options}
      title={options?.title ?? ""}
      body={options?.body ?? ""}
      confirmLabel={options?.confirmLabel}
      cancelLabel={options?.cancelLabel}
      danger={options?.danger}
      loading={loading}
      onConfirm={confirm}
      onCancel={close}
    />
  );

  return { ask, dialog };
}

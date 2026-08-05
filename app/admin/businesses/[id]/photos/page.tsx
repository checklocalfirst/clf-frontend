"use client";

import { useState } from "react";
import { useToken } from "@/lib/auth";
import { useAdminBusiness } from "@/components/dashboard/AdminBusinessContext";
import { useApiResource } from "@/lib/useApiResource";
import { listAdminPhotos, uploadPhoto, approvePhoto, deletePhoto } from "@/lib/admin/photos";
import type { Photo, PhotoType } from "@/lib/directory";
import FileUpload from "@/components/dashboard/FileUpload";
import Toggle from "@/components/dashboard/Toggle";
import { useConfirm } from "@/components/dashboard/ConfirmDialog";
import { useToast } from "@/components/dashboard/ToastProvider";
import { ApiError } from "@/lib/api";

const TYPE_LABEL: Record<PhotoType, string> = {
  listing: "Listing",
  owner: "Owner",
  gallery: "Gallery",
  timeline: "Timeline",
};

export default function AdminBusinessPhotosPage() {
  const token = useToken();
  const { business } = useAdminBusiness();
  const toast = useToast();
  const confirm = useConfirm();

  const { data: photos, loading, error, setData: setPhotos } = useApiResource<Photo[]>(
    (t) => listAdminPhotos(t, business.id),
    [business.id]
  );

  const [uploading, setUploading] = useState(false);

  async function handleUpload(
    file: File,
    photoType: PhotoType,
    displayOrder?: number,
    timelineSlot?: 1 | 2 | 3
  ) {
    if (!token) return;
    setUploading(true);
    try {
      const photo = await uploadPhoto(token, business.id, file, photoType, displayOrder, timelineSlot);
      // Uploading to an occupied timeline slot replaces the old photo server-side —
      // drop any existing row for that slot instead of appending a duplicate.
      setPhotos((prev) => [
        ...(prev ?? []).filter(
          (p) => !(photoType === "timeline" && p.photo_type === "timeline" && p.timeline_slot === timelineSlot)
        ),
        photo,
      ]);
      toast.success("Photo uploaded.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleApproveToggle(photo: Photo, approved: boolean) {
    if (!token) return;
    try {
      const updated = await approvePhoto(token, photo.id, approved);
      setPhotos((prev) => prev?.map((p) => (p.id === photo.id ? updated : p)) ?? null);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't update photo.");
    }
  }

  function handleDelete(photo: Photo) {
    confirm.ask({
      title: "Delete this photo?",
      body: "This removes it from the business's public listing permanently.",
      confirmLabel: "Delete",
      onConfirm: async () => {
        if (!token) return;
        await deletePhoto(token, photo.id);
        setPhotos((prev) => prev?.filter((p) => p.id !== photo.id) ?? null);
        toast.success("Photo deleted.");
      },
    });
  }

  return (
    <div className="flex flex-col gap-6 max-w-[720px]">
      <h3 className="font-display font-bold text-[18px] text-[#423926]">Photos</h3>

      <FileUpload onUpload={handleUpload} uploading={uploading} existingPhotos={photos ?? undefined} />

      {loading && <p className="font-body text-[14px] text-[#596155]">Loading photos…</p>}
      {error && <p className="font-body text-[14px] text-red-600">{error}</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {photos?.map((photo) => (
          <div key={photo.id} className="flex flex-col gap-2 bg-white border border-[#dbe0d9] rounded-[12px] p-3">
            <div className="relative aspect-square rounded-[8px] overflow-hidden bg-[#b7a78c]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.photo_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <p className="font-display font-bold text-[11px] text-[#b7a78c] uppercase">
              {TYPE_LABEL[photo.photo_type]}
              {photo.photo_type === "timeline" && photo.timeline_slot ? ` · Slot ${photo.timeline_slot}` : ""}
            </p>
            <div className="flex items-center justify-between">
              <span className="font-body text-[12px] text-[#596155]">Approved</span>
              <Toggle checked={photo.approved} onChange={(next) => handleApproveToggle(photo, next)} />
            </div>
            <button
              type="button"
              onClick={() => handleDelete(photo)}
              className="font-display font-bold text-[11px] text-[#b7a78c] uppercase hover:text-red-600 transition-colors cursor-pointer"
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

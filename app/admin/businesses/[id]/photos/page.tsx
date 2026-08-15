"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useToken } from "@/lib/auth";
import { useAdminBusiness } from "@/components/dashboard/AdminBusinessContext";
import { useApiResource } from "@/lib/useApiResource";
import { listAdminPhotos, uploadPhoto, approvePhoto, updatePhoto, deletePhoto } from "@/lib/admin/photos";
import type { Photo, PhotoType } from "@/lib/directory";
import FileUpload from "@/components/dashboard/FileUpload";
import FormField from "@/components/FormField";
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

function PhotoTypeEditor({
  photo,
  allPhotos,
  onSave,
}: {
  photo: Photo;
  allPhotos: Photo[];
  onSave: (photo: Photo, newType: PhotoType, newSlot: 1 | 2 | 3 | null) => Promise<void>;
}) {
  const [pendingType, setPendingType] = useState<PhotoType>(photo.photo_type);
  const [pendingSlot, setPendingSlot] = useState<1 | 2 | 3>(photo.timeline_slot ?? 1);
  const [saving, setSaving] = useState(false);

  // Keep local selection in sync once a save round-trips and the saved row changes underneath us
  useEffect(() => {
    setPendingType(photo.photo_type);
    setPendingSlot(photo.timeline_slot ?? 1);
  }, [photo.photo_type, photo.timeline_slot]);

  const isTimeline = pendingType === "timeline";
  const changed = pendingType !== photo.photo_type || (isTimeline && pendingSlot !== photo.timeline_slot);
  const occupant = isTimeline
    ? allPhotos.find((p) => p.id !== photo.id && p.photo_type === "timeline" && p.timeline_slot === pendingSlot)
    : undefined;

  async function handleSave() {
    setSaving(true);
    try {
      await onSave(photo, pendingType, isTimeline ? pendingSlot : null);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <FormField
          label="Type"
          id={`photo-type-${photo.id}`}
          as="select"
          value={pendingType}
          onChange={(e) => setPendingType(e.target.value as PhotoType)}
          className="flex-1"
        >
          {Object.entries(TYPE_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </FormField>
        {isTimeline && (
          <FormField
            label="Slot"
            id={`photo-slot-${photo.id}`}
            as="select"
            value={pendingSlot}
            onChange={(e) => setPendingSlot(Number(e.target.value) as 1 | 2 | 3)}
            className="flex-1"
          >
            {([1, 2, 3] as const).map((slot) => (
              <option key={slot} value={slot}>
                Slot {slot}
                {allPhotos.some((p) => p.id !== photo.id && p.photo_type === "timeline" && p.timeline_slot === slot)
                  ? " (occupied)"
                  : ""}
              </option>
            ))}
          </FormField>
        )}
      </div>
      {occupant && (
        <p className="font-body text-[11px] text-amber-700">
          Slot {pendingSlot} is already used by another photo — saving will replace it.
        </p>
      )}
      {changed && (
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="self-start font-display font-bold text-[11px] text-[#2c4a34] uppercase hover:text-[#253022] transition-colors cursor-pointer disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      )}
    </div>
  );
}

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

  async function handleTypeChange(photo: Photo, newType: PhotoType, newSlot: 1 | 2 | 3 | null) {
    if (!token) return;

    const patch: { photo_type?: PhotoType; timeline_slot?: 1 | 2 | 3 } = { photo_type: newType };
    if (newType === "timeline" && newSlot) patch.timeline_slot = newSlot;

    // Moving into an occupied timeline slot silently deletes the photo already there server-side —
    // confirm with the admin first so they aren't surprised, then drop it from local state too.
    const occupant =
      newType === "timeline"
        ? (photos ?? []).find((p) => p.id !== photo.id && p.photo_type === "timeline" && p.timeline_slot === newSlot)
        : undefined;

    const commit = async () => {
      const updated = await updatePhoto(token, photo.id, patch);
      setPhotos((prev) =>
        (prev ?? [])
          .filter((p) => !(occupant && p.id === occupant.id))
          .map((p) => (p.id === photo.id ? updated : p))
      );
      toast.success("Photo type updated.");
    };

    if (occupant) {
      confirm.ask({
        title: `Replace photo in Slot ${newSlot}?`,
        body: `Slot ${newSlot} is currently used by another photo. Moving this photo there will delete the existing one — this can't be undone.`,
        confirmLabel: "Replace",
        onConfirm: commit,
      });
      return;
    }

    try {
      await commit();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't update photo.");
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
              <Image
                src={photo.photo_url}
                alt=""
                fill
                sizes="(min-width: 640px) 33vw, 50vw"
                className="object-cover"
              />
            </div>
            <PhotoTypeEditor photo={photo} allPhotos={photos ?? []} onSave={handleTypeChange} />
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

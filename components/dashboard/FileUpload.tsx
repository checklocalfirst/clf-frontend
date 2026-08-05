"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import type { Photo, PhotoType } from "@/lib/directory";
import FormField from "@/components/FormField";

// Must match the backend's multer fileFilter allowlist (api/middleware/upload.js)
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export default function FileUpload({
  onUpload,
  uploading,
  existingPhotos,
}: {
  onUpload: (file: File, photoType: PhotoType, displayOrder?: number, timelineSlot?: 1 | 2 | 3) => void;
  uploading: boolean;
  // Used only to detect whether the selected timeline slot already has a photo,
  // so the submit button can say "Replace" instead of "Upload".
  existingPhotos?: Photo[];
}) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [photoType, setPhotoType] = useState<PhotoType>("gallery");
  const [displayOrder, setDisplayOrder] = useState("");
  const [timelineSlot, setTimelineSlot] = useState<1 | 2 | 3>(1);
  const [fileError, setFileError] = useState<string | null>(null);

  const isTimeline = photoType === "timeline";
  const slotHasPhoto = isTimeline
    ? (existingPhotos ?? []).some((p) => p.photo_type === "timeline" && p.timeline_slot === timelineSlot)
    : false;

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (f && !ALLOWED_TYPES.includes(f.type)) {
      setFile(null);
      setPreviewUrl(null);
      setFileError("Unsupported file type. Please choose a JPEG, PNG, WebP, or GIF image.");
      e.target.value = "";
      return;
    }
    setFileError(null);
    setFile(f);
    setPreviewUrl(f ? URL.createObjectURL(f) : null);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file) return;
    onUpload(
      file,
      photoType,
      displayOrder ? Number(displayOrder) : undefined,
      isTimeline ? timelineSlot : undefined
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white border border-[#dbe0d9] rounded-[16px] p-6">
      <div className="flex flex-col gap-2">
        <label className="font-body font-semibold text-[13px] text-[#423926]">Photo</label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="font-body text-[13px]"
        />
        <p className="font-body text-[12px] text-[#b7a78c]">JPEG, PNG, WebP, or GIF only.</p>
        {fileError && <p className="font-body text-[12px] text-red-600">{fileError}</p>}
      </div>
      {previewUrl && (
        <div className="w-32 h-32 rounded-[8px] overflow-hidden bg-[#b7a78c]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex gap-3">
        <FormField
          label="Type"
          id="photo_type"
          as="select"
          value={photoType}
          onChange={(e) => setPhotoType(e.target.value as PhotoType)}
          className="flex-1"
        >
          <option value="listing">Listing</option>
          <option value="owner">Owner</option>
          <option value="gallery">Gallery</option>
          <option value="timeline">Timeline</option>
        </FormField>
        {isTimeline ? (
          <FormField
            label="Slot"
            id="timeline_slot"
            as="select"
            value={timelineSlot}
            onChange={(e) => setTimelineSlot(Number(e.target.value) as 1 | 2 | 3)}
            className="flex-1"
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </FormField>
        ) : (
          <FormField
            label="Display Order (optional)"
            id="display_order"
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(e.target.value)}
            className="flex-1"
          />
        )}
      </div>
      <button
        type="submit"
        disabled={!file || uploading}
        className="self-start bg-[#2c4a34] rounded-[8px] px-6 py-[10px] font-display font-bold text-[13px] text-white uppercase hover:bg-[#253022] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {uploading ? "Uploading..." : slotHasPhoto ? "Replace Photo" : "Upload Photo"}
      </button>
    </form>
  );
}

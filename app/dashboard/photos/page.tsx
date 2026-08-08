"use client";

import Image from "next/image";
import { useBusiness } from "@/components/dashboard/BusinessContext";
import { useApiResource } from "@/lib/useApiResource";
import { getBusinessPhotos, type Photo } from "@/lib/directory";

const TYPE_LABEL: Record<Photo["photo_type"], string> = {
  listing: "Listing",
  owner: "Owner",
  gallery: "Gallery",
  timeline: "Timeline",
};

export default function PhotosPage() {
  const { business } = useBusiness();
  const { data: photos, loading, error } = useApiResource<Photo[]>(() => getBusinessPhotos(business.slug), [
    business.slug,
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display font-bold text-[24px] text-[#423926]">Photos</h2>
        <p className="font-body text-[13px] text-[#596155] mt-1">
          Photo uploads are handled by our team to keep listings on-brand. To add or change photos, contact support —
          new uploads will show up here once approved.
        </p>
      </div>

      {loading && <p className="font-body text-[14px] text-[#596155]">Loading photos…</p>}
      {error && <p className="font-body text-[14px] text-red-600">{error}</p>}

      {!loading && !error && photos?.length === 0 && (
        <div className="bg-white border border-[#dbe0d9] rounded-[16px] p-8 text-center">
          <p className="font-body text-[14px] text-[#596155]">No photos on your listing yet.</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {photos?.map((photo) => (
          <div key={photo.id} className="flex flex-col gap-2">
            <div className="relative aspect-square rounded-[12px] overflow-hidden bg-[#b7a78c]">
              <Image
                src={photo.photo_url}
                alt=""
                fill
                sizes="(min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover"
              />
            </div>
            <p className="font-display font-bold text-[11px] text-[#b7a78c] uppercase tracking-wide">
              {TYPE_LABEL[photo.photo_type]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

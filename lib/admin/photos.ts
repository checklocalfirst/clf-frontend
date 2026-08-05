import { apiFetch } from "../api";
import type { Photo, PhotoType } from "../directory";

export function listAdminPhotos(token: string, businessId: number): Promise<Photo[]> {
  return apiFetch<Photo[]>(`/admin/businesses/${businessId}/photos`, { token });
}

export function uploadPhoto(
  token: string,
  businessId: number,
  file: File,
  photo_type: PhotoType,
  display_order?: number,
  timeline_slot?: 1 | 2 | 3
): Promise<Photo> {
  const form = new FormData();
  form.append("photo", file);
  form.append("photo_type", photo_type);
  if (display_order !== undefined) form.append("display_order", String(display_order));
  // Required by the backend when photo_type is "timeline", must be omitted otherwise
  if (photo_type === "timeline" && timeline_slot !== undefined) {
    form.append("timeline_slot", String(timeline_slot));
  }
  return apiFetch<Photo>(`/admin/businesses/${businessId}/photos`, {
    method: "POST",
    token,
    body: form,
  });
}

export function approvePhoto(token: string, photoId: number, approved: boolean): Promise<Photo> {
  return apiFetch<Photo>(`/admin/photos/${photoId}/approve`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ approved }),
  });
}

export function updatePhoto(
  token: string,
  photoId: number,
  patch: { photo_type?: PhotoType; display_order?: number; timeline_slot?: 1 | 2 | 3 }
): Promise<Photo> {
  return apiFetch<Photo>(`/admin/photos/${photoId}`, {
    method: "PUT",
    token,
    body: JSON.stringify(patch),
  });
}

export function deletePhoto(token: string, photoId: number): Promise<void> {
  return apiFetch<void>(`/admin/photos/${photoId}`, {
    method: "DELETE",
    token,
  });
}

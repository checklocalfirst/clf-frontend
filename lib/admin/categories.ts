import { apiFetch } from "../api";
import type { Category } from "../directory";

export function updateAdminCategory(
  token: string,
  id: number,
  patch: { name: string; slug: string }
): Promise<Category> {
  return apiFetch<Category>(`/admin/categories/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(patch),
  });
}

export function createCategory(
  token: string,
  input: { name: string; slug: string }
): Promise<Category> {
  return apiFetch<Category>("/categories", {
    method: "POST",
    token,
    body: JSON.stringify(input),
  });
}

export function deleteCategory(token: string, id: number): Promise<void> {
  return apiFetch<void>(`/categories/${id}`, {
    method: "DELETE",
    token,
  });
}

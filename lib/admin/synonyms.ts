import { apiFetch } from "../api";

// A pair matches in both directions — searching either word also finds the other.
export interface SearchSynonym {
  id: number;
  term: string;
  synonym: string;
}

export function getSearchSynonyms(token: string): Promise<SearchSynonym[]> {
  return apiFetch<SearchSynonym[]>("/admin/search-synonyms", { token });
}

// 409 when the pair already exists, in either order.
export function createSearchSynonym(
  token: string,
  input: { term: string; synonym: string }
): Promise<SearchSynonym> {
  return apiFetch<SearchSynonym>("/admin/search-synonyms", {
    method: "POST",
    token,
    body: JSON.stringify(input),
  });
}

export function deleteSearchSynonym(token: string, id: number): Promise<void> {
  return apiFetch<void>(`/admin/search-synonyms/${id}`, {
    method: "DELETE",
    token,
  });
}

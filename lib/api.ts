const BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

// Shared with lib/auth.tsx so both sides agree on where the session lives.
export const SESSION_STORAGE_KEY = "clf_session";

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  data: T[];
  pagination: Pagination;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public fieldErrors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Parses both error envelope shapes the backend can return
function extractError(body: Record<string, unknown>): string {
  if (typeof body.error === "string") return body.error;
  return "Something went wrong.";
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, headers: extraHeaders, ...rest } = options;

  // Skip Content-Type for FormData bodies — the browser needs to set its own multipart boundary
  const isFormData = typeof FormData !== "undefined" && rest.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(extraHeaders as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...rest, headers });

  // No body on 204
  if (res.status === 204) return undefined as T;

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    // Authenticated request rejected — there's no refresh-token flow, so the only recovery
    // is a fresh login. Only fires when this call actually carried a token (an anonymous
    // 401, e.g. bad login credentials, must fall through and stay on the calling page).
    if (res.status === 401 && token && typeof window !== "undefined") {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login?expired=1";
      }
    }

    if (res.status === 429) {
      throw new ApiError(429, "Too many requests — please slow down and try again shortly.");
    }

    // Validation failure shape: { success: false, error, details: { fieldErrors } }
    if (body.details?.fieldErrors) {
      throw new ApiError(res.status, extractError(body), body.details.fieldErrors);
    }

    throw new ApiError(res.status, extractError(body));
  }

  // Success envelope: { success: true, data }, { success: true, data, pagination }, or { success: true, message }
  if ("data" in body) {
    if ("pagination" in body) return { data: body.data, pagination: body.pagination } as T;
    return body.data as T;
  }
  return body as T;
}

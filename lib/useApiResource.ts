"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useToken } from "./auth";
import { ApiError } from "./api";

/**
 * Fetches a resource with the current session token, re-running whenever `deps` change.
 * On a 401 (no refresh-token flow exists — see backend doc §0/§10), logs out and bounces
 * to /login?expired=1 instead of leaving the caller to handle it individually.
 */
export function useApiResource<T>(
  fetcher: (token: string) => Promise<T>,
  deps: unknown[] = []
) {
  const token = useToken();
  const { logout } = useAuth();
  const router = useRouter();

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const refetch = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetcher(token)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 401) {
          logout();
          router.replace("/login?expired=1");
          return;
        }
        setError(err instanceof ApiError ? err.message : "Something went wrong.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // deps is caller-controlled and typically a list of primitives (slug/id/date range) —
    // serialize so the array itself can stay a fixed-length dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, reloadKey, JSON.stringify(deps)]);

  return { data, loading, error, refetch, setData };
}

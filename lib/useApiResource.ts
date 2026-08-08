"use client";

import { useCallback, useEffect, useState } from "react";
import { useToken } from "./auth";
import { ApiError } from "./api";

/**
 * Fetches a resource with the current session token, re-running whenever `deps` change.
 * A 401 is handled globally by apiFetch itself (clears the session and redirects to
 * /login?expired=1), so this only needs to handle everything else.
 */
export function useApiResource<T>(
  fetcher: (token: string) => Promise<T>,
  deps: unknown[] = []
) {
  const token = useToken();

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const refetch = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting loading/error state ahead of an async fetch, the standard data-fetching-effect shape
    setLoading(true);
    setError(null);

    fetcher(token)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (cancelled) return;
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

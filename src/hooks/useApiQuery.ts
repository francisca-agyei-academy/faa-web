"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";

interface QueryState<T> {
  /** The path this data belongs to; a different path means "loading". */
  path: string | null;
  data: T | null;
  error: ApiError | null;
}

/**
 * Loads an authenticated API path and reloads whenever the path changes.
 * Pass null to skip. `setData` updates the cached result after a mutation.
 */
export function useApiQuery<T>(path: string | null) {
  const [state, setState] = useState<QueryState<T>>({ path: null, data: null, error: null });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!path) return;
    let cancelled = false;
    api<T>(path)
      .then((data) => !cancelled && setState({ path, data, error: null }))
      .catch((err: unknown) => {
        if (cancelled) return;
        const error = err instanceof ApiError ? err : new ApiError(0, "UNKNOWN", "Something went wrong.");
        setState({ path, data: null, error });
      });
    return () => {
      cancelled = true;
    };
  }, [path, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  const setData = useCallback((data: T) => setState((s) => ({ ...s, data })), []);

  const current = state.path === path;
  return {
    data: current ? state.data : null,
    error: current ? state.error : null,
    loading: path !== null && !current,
    reload,
    setData,
  };
}

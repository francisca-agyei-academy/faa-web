import type { ApiErrorBody, AuthResponse, FieldIssue } from "@/types";
import { clearSession, getAccessToken, markLoading, markOffline, setSession } from "./auth";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/$/, "");
const API_BASE = `${API_URL}/api/v1`;

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
    public readonly requestId?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }

  /** Per-field messages from a VALIDATION_FAILED response, keyed by field name. */
  get fieldErrors(): Record<string, string> {
    if (this.code !== "VALIDATION_FAILED" || !Array.isArray(this.details)) return {};
    const errors: Record<string, string> = {};
    for (const issue of this.details as FieldIssue[]) {
      if (issue.path && !errors[issue.path]) errors[issue.path] = issue.message;
    }
    return errors;
  }
}

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  /** Send the access token, refreshing it first if needed. Defaults to true. */
  auth?: boolean;
  signal?: AbortSignal;
}

async function send<T>(path: string, options: RequestOptions, token: string | null): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method: options.method ?? "GET",
      // Sends and accepts the refresh cookie on /auth routes.
      credentials: "include",
      headers: {
        ...(options.body !== undefined && { "Content-Type": "application/json" }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: options.signal,
    });
  } catch (err) {
    if ((err as Error).name === "AbortError") throw err;
    throw new ApiError(0, "NETWORK_ERROR", "Can't reach the server. Check your connection and try again.");
  }

  if (res.status === 204) return undefined as T;

  const data = (await res.json().catch(() => null)) as T | ApiErrorBody | null;
  if (!res.ok) {
    const error = (data as ApiErrorBody | null)?.error;
    throw new ApiError(
      res.status,
      error?.code ?? "HTTP_ERROR",
      error?.message ?? `Request failed (${res.status})`,
      error?.details,
      error?.requestId,
    );
  }
  return data as T;
}

let refreshing: Promise<AuthResponse | null> | null = null;

/**
 * Trades the httpOnly refresh cookie for a new access token. Concurrent callers share
 * one request. Resolves null (and clears the session) when the user is not logged in.
 */
export function refreshSession(): Promise<AuthResponse | null> {
  markLoading();
  refreshing ??= send<AuthResponse>("/auth/refresh", { method: "POST" }, null)
    .then((session) => {
      setSession(session.user, session.accessToken);
      return session;
    })
    .catch((err: unknown) => {
      if (err instanceof ApiError && err.status === 401) {
        clearSession();
        return null;
      }
      markOffline();
      throw err;
    })
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

/**
 * Calls the API. Authenticated calls attach the in-memory access token; when it has
 * expired the session is refreshed once and the call retried.
 */
export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (options.auth === false) return send<T>(path, options, null);

  let token = getAccessToken();
  if (!token) token = (await refreshSession())?.accessToken ?? null;
  if (!token) throw new ApiError(401, "SESSION_EXPIRED", "Please log in to continue.");

  try {
    return await send<T>(path, options, token);
  } catch (err) {
    if (!(err instanceof ApiError) || err.code !== "TOKEN_EXPIRED") throw err;
    const session = await refreshSession();
    if (!session) throw new ApiError(401, "SESSION_EXPIRED", "Your session has expired. Please log in again.");
    return send<T>(path, options, session.accessToken);
  }
}

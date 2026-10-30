import type { Role, User } from "@/types";

/**
 * Session state for the browser. The access token lives only in this module's memory,
 * never in localStorage, so injected scripts cannot read it from storage. A page reload
 * starts empty, and `refreshSession()` (lib/api.ts) restores it from the httpOnly cookie.
 */
/** "offline": the API could not be reached, so the session is unknown (not logged out). */
export type AuthStatus = "loading" | "authenticated" | "unauthenticated" | "offline";

export interface AuthState {
  status: AuthStatus;
  user: User | null;
  accessToken: string | null;
}

const LOADING: AuthState = { status: "loading", user: null, accessToken: null };

let state: AuthState = LOADING;
const listeners = new Set<() => void>();

function emit(next: AuthState) {
  state = next;
  for (const listener of listeners) listener();
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const getAuthState = () => state;
/** What the server renders: unknown until the browser has refreshed. */
export const getServerAuthState = () => LOADING;
export const getAccessToken = () => state.accessToken;

export function setSession(user: User, accessToken: string) {
  emit({ status: "authenticated", user, accessToken });
}

export function updateUser(user: User) {
  if (state.status === "authenticated") emit({ ...state, user });
}

export function clearSession() {
  emit({ status: "unauthenticated", user: null, accessToken: null });
}

export function markOffline() {
  if (state.status === "loading") emit({ ...state, status: "offline" });
}

export function markLoading() {
  if (state.status === "offline") emit({ ...state, status: "loading" });
}

/** Where a user lands after logging in. */
export function homeFor(role: Role) {
  return role === "ADMIN" ? "/admin" : "/dashboard";
}

/** Accepts only same-site paths, so `?next=` can't send users to another website. */
export function safeNextPath(next: string | null | undefined): string | null {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return null;
  return next;
}

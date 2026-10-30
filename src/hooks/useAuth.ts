"use client";

import { useSyncExternalStore } from "react";
import { api, refreshSession } from "@/lib/api";
import {
  clearSession,
  getAuthState,
  getServerAuthState,
  setSession,
  subscribe,
  updateUser,
} from "@/lib/auth";
import type { AuthResponse, MessageResponse, User } from "@/types";

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

async function login(email: string, password: string) {
  const session = await api<AuthResponse>("/auth/login", { method: "POST", body: { email, password }, auth: false });
  setSession(session.user, session.accessToken);
  return session.user;
}

async function register(input: RegisterInput) {
  const session = await api<AuthResponse>("/auth/register", { method: "POST", body: input, auth: false });
  setSession(session.user, session.accessToken);
  return session.user;
}

async function logout() {
  try {
    await api<void>("/auth/logout", { method: "POST", auth: false });
  } finally {
    clearSession();
  }
}

async function logoutAll() {
  try {
    await api<void>("/auth/logout-all", { method: "POST" });
  } finally {
    clearSession();
  }
}

/** Re-reads the user, e.g. after verifying their email in another tab. */
async function reloadUser() {
  const { user } = await api<{ user: User }>("/auth/me");
  updateUser(user);
  return user;
}

function resendVerification() {
  return api<MessageResponse>("/auth/resend-verification", { method: "POST" });
}

/** Current session plus the auth actions. The state is shared across every component. */
export function useAuth() {
  const state = useSyncExternalStore(subscribe, getAuthState, getServerAuthState);
  return {
    ...state,
    login,
    register,
    logout,
    logoutAll,
    reloadUser,
    resendVerification,
    refresh: refreshSession,
  };
}

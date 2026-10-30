"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * False during server rendering and until React has hydrated, then true.
 * Forms use it to keep their submit button disabled until their JavaScript handler
 * is attached, so an early submit can't fall back to a native form post.
 */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

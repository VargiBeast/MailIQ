import { useSyncExternalStore } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const listeners = new Set<() => void>();
let media: MediaQueryList | null = null;

function ensureMedia() {
  if (media || typeof window === "undefined") return;
  media = window.matchMedia(REDUCED_MOTION_QUERY);
  media.addEventListener("change", () => {
    listeners.forEach((listener) => listener());
  });
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  ensureMedia();
  return () => {
    listeners.delete(onStoreChange);
  };
}

function getSnapshot() {
  ensureMedia();
  return media?.matches ?? false;
}

/**
 * True when the OS asks for reduced motion.
 * One module-level MediaQueryList is shared by every caller.
 * JS-driven motion checks this; CSS animations are collapsed by the global rule.
 * Foundation may also export scrollBehavior from this module — keep that helper if it lands.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

/** Tooltip open delay. Mirrors --delay-tooltip in styles/index.css. */
export const TOOLTIP_DELAY_MS = 400;

import { useSyncExternalStore } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const listeners = new Set<() => void>();
let media: MediaQueryList | null = null;
let boundMatchMedia: typeof window.matchMedia | null = null;

function notify() {
  listeners.forEach((listener) => listener());
}

/** addEventListener where it exists; Safari 13 and older only have addListener. */
function attachMedia(query: MediaQueryList) {
  if (typeof query.addEventListener === "function") {
    query.addEventListener("change", notify);
    return;
  }
  query.addListener(notify);
}

function ensureMedia() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    media = null;
    boundMatchMedia = null;
    return;
  }
  if (media && boundMatchMedia === window.matchMedia) return;
  media = window.matchMedia(REDUCED_MOTION_QUERY);
  boundMatchMedia = window.matchMedia;
  attachMedia(media);
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

/** True when the OS asks for reduced motion. False if matchMedia is unavailable. */
export function prefersReducedMotion(): boolean {
  return getSnapshot();
}

/**
 * Follows prefers-reduced-motion, including changes after the component mounts.
 * One module-level MediaQueryList is shared by every caller.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

/**
 * Behavior for element.scrollTo().
 * CSS `scroll-behavior` does not affect the JS `behavior` option, so callers must pass this.
 */
export function scrollBehavior(): ScrollBehavior {
  return prefersReducedMotion() ? "auto" : "smooth";
}

/** Tooltip open delay. Mirrors --delay-tooltip in styles/index.css. */
export const TOOLTIP_DELAY_MS = 400;

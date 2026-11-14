import { useCallback, useSyncExternalStore } from "react";

type Entry = {
  media: MediaQueryList | null;
  bound: typeof window.matchMedia | null;
  listeners: Set<() => void>;
};

const entries = new Map<string, Entry>();

function entryFor(query: string): Entry {
  let entry = entries.get(query);
  if (!entry) {
    entry = { media: null, bound: null, listeners: new Set() };
    entries.set(query, entry);
  }
  return entry;
}

function notify(entry: Entry) {
  entry.listeners.forEach((listener) => listener());
}

/** addEventListener where it exists; Safari 13 and older only have addListener. */
function attachMedia(query: MediaQueryList, entry: Entry) {
  const onChange = () => notify(entry);
  if (typeof query.addEventListener === "function") {
    query.addEventListener("change", onChange);
    return;
  }
  query.addListener(onChange);
}

function ensureMedia(query: string, entry: Entry) {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    entry.media = null;
    entry.bound = null;
    return;
  }
  if (entry.media && entry.bound === window.matchMedia) return;
  entry.media = window.matchMedia(query);
  entry.bound = window.matchMedia;
  attachMedia(entry.media, entry);
}

/** Tracks a media query. One MediaQueryList is shared by every caller of the same query. */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback((onStoreChange: () => void) => {
    const entry = entryFor(query);
    entry.listeners.add(onStoreChange);
    ensureMedia(query, entry);
    return () => {
      entry.listeners.delete(onStoreChange);
    };
  }, [query]);
  const getSnapshot = useCallback(() => {
    const entry = entryFor(query);
    ensureMedia(query, entry);
    return entry.media?.matches ?? false;
  }, [query]);
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

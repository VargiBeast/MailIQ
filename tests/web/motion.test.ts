import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { prefersReducedMotion, scrollBehavior, usePrefersReducedMotion } from "@/lib/motion";

const original = window.matchMedia;

afterEach(() => {
  window.matchMedia = original;
});

function installMatchMedia(matches: boolean) {
  let listener: ((event: MediaQueryListEvent) => void) | null = null;
  const query = {
    matches,
    media: "(prefers-reduced-motion: reduce)",
    addEventListener: (_type: string, cb: (event: MediaQueryListEvent) => void) => {
      listener = cb;
    },
    removeEventListener: () => {
      listener = null;
    },
    set(next: boolean) {
      query.matches = next;
      listener?.({ matches: next } as MediaQueryListEvent);
    },
  };
  window.matchMedia = (() => query) as unknown as typeof window.matchMedia;
  return query;
}

describe("scrollBehavior", () => {
  it("stays smooth when the user has not requested reduced motion", () => {
    installMatchMedia(false);
    expect(prefersReducedMotion()).toBe(false);
    expect(scrollBehavior()).toBe("smooth");
  });

  it("switches to auto under prefers-reduced-motion", () => {
    installMatchMedia(true);
    expect(scrollBehavior()).toBe("auto");
  });

  it("does not assume reduced motion when matchMedia is missing", () => {
    window.matchMedia = undefined as unknown as typeof window.matchMedia;
    expect(prefersReducedMotion()).toBe(false);
    expect(scrollBehavior()).toBe("smooth");
  });
});

describe("usePrefersReducedMotion", () => {
  it("updates when the media query change listener fires", async () => {
    const query = installMatchMedia(false);
    const host = document.createElement("div");
    document.body.appendChild(host);
    function Probe() {
      return createElement("span", null, usePrefersReducedMotion() ? "reduced" : "full");
    }
    const root = createRoot(host);
    await act(async () => {
      root.render(createElement(Probe));
    });
    expect(host.textContent).toBe("full");
    await act(async () => {
      query.set(true);
    });
    expect(host.textContent).toBe("reduced");
    await act(async () => root.unmount());
    host.remove();
  });
});

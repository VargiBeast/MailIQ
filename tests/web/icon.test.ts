import { createElement, act } from "react";
import { createRoot } from "react-dom/client";
import { Sparkles } from "lucide-react";
import { describe, expect, it } from "vitest";
import { Icon, ICON_SIZE, ICON_STROKE } from "@/components/ui/Icon";

async function renderIcon(props: { size?: "xs" | "sm" | "md" | "lg"; active?: boolean; label?: string }) {
  const host = document.createElement("div");
  document.body.appendChild(host);
  const root = createRoot(host);
  await act(async () => {
    root.render(createElement(Icon, { icon: Sparkles, ...props }));
  });
  const svg = host.querySelector("svg");
  if (!svg) throw new Error("icon did not render an svg");
  return {
    svg,
    async cleanup() {
      await act(async () => root.unmount());
      host.remove();
    },
  };
}

describe("Icon", () => {
  it("is decorative at the default size and stroke", async () => {
    const { svg, cleanup } = await renderIcon({});
    expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(svg.getAttribute("aria-label")).toBeNull();
    expect(svg.getAttribute("width")).toBe(String(ICON_SIZE.md));
    expect(svg.getAttribute("stroke-width")).toBe(String(ICON_STROKE.default));
    await cleanup();
  });

  it("exposes a labelled icon and uses the active stroke", async () => {
    const { svg, cleanup } = await renderIcon({ label: "Suggestions", active: true, size: "lg" });
    expect(svg.getAttribute("aria-hidden")).toBeNull();
    expect(svg.getAttribute("aria-label")).toBe("Suggestions");
    expect(svg.getAttribute("role")).toBe("img");
    expect(svg.getAttribute("width")).toBe(String(ICON_SIZE.lg));
    expect(svg.getAttribute("stroke-width")).toBe(String(ICON_STROKE.active));
    await cleanup();
  });
});

import type { ReactNode } from "react";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { faq, PREVIEW_NOTE } from "@/pages/marketing/content/copy";
import { CONTACT_EMAIL } from "@/pages/Legal";
import MarketingNav from "@/pages/marketing/nav/MarketingNav";
import AiFeatures from "@/pages/marketing/sections/AiFeatures";
import DailyBriefSection from "@/pages/marketing/sections/DailyBriefSection";
import UnifiedInbox from "@/pages/marketing/sections/UnifiedInbox";
import SearchSection from "@/pages/marketing/sections/SearchSection";
import CopilotSection from "@/pages/marketing/sections/CopilotSection";
import PrivacySection from "@/pages/marketing/sections/PrivacySection";
import Workflow from "@/pages/marketing/sections/Workflow";
import Faq from "@/pages/marketing/sections/Faq";
import PreviewNote from "@/pages/marketing/sections/PreviewNote";
import FinalCta from "@/pages/marketing/sections/FinalCta";
import MarketingFooter from "@/pages/marketing/sections/MarketingFooter";

afterEach(() => {
  cleanup();
});

function SignIn() {
  return <a href="#sign-in">Sign in with Google</a>;
}

function Page({ demo }: { demo?: ReactNode }) {
  return (
    <>
      <MarketingNav signIn={<SignIn />} />
      <main id="main">
        <PreviewNote />
        <AiFeatures demo={demo} />
        <DailyBriefSection demo={demo} />
        <UnifiedInbox />
        <SearchSection />
        <CopilotSection />
        <PrivacySection />
        <Workflow />
        <Faq />
        <FinalCta signIn={<SignIn />} />
      </main>
      <MarketingFooter />
    </>
  );
}

const forbidden = [
  /end-to-end/i,
  /zero[-\s]?knowledge/i,
  /one-click delete/i,
  /one click delete/i,
  /stores nothing/i,
  /store nothing/i,
  /\bpricing\b/i,
];

describe("marketing sections", () => {
  it("builds a landmark outline of h2 sections and no page h1", () => {
    const { container, getByRole, getAllByRole } = render(<Page />);
    expect(getByRole("banner")).toBeTruthy();
    expect(getByRole("main")).toBeTruthy();
    expect(getByRole("contentinfo")).toBeTruthy();
    expect(getByRole("navigation", { name: "Primary" })).toBeTruthy();
    expect(getByRole("navigation", { name: "Footer" })).toBeTruthy();
    expect(container.querySelector("h1")).toBeNull();
    const titles = getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent);
    expect(titles).toContain("Summaries that get to the point");
    expect(titles).toContain("Your mail stays yours");
    expect(titles).toContain("Questions");
    expect(container.querySelector("#features")).toBeTruthy();
    expect(container.querySelector("#privacy")).toBeTruthy();
    expect(container.querySelector("#faq")).toBeTruthy();
  });

  it("keeps privacy, preview and product claims inside the documented facts", () => {
    const { container, getByRole } = render(<Page />);
    const text = container.textContent ?? "";
    for (const pattern of forbidden) expect(text).not.toMatch(pattern);
    expect(text).toContain(PREVIEW_NOTE);
    expect(text).toContain("AES-256-GCM");
    expect(text).toContain("httpOnly");
    expect(text).toContain("Delete my account");
    expect(text).toContain("Gemini");
    expect(text).not.toMatch(/\bfree\b/i);
    const privacy = container.querySelector("#privacy");
    expect(privacy?.querySelector('a[href="/privacy"]')?.textContent).toMatch(/Privacy policy/);
    expect(privacy?.querySelector('a[href="/terms"]')?.textContent).toMatch(/Terms of service/);
    expect(getByRole("link", { name: CONTACT_EMAIL }).getAttribute("href")).toBe(`mailto:${CONTACT_EMAIL}`);
    expect(getByRole("link", { name: "Skip to content" }).getAttribute("href")).toBe("#main");
  });

  it("renders a placeholder frame until a demo is passed", () => {
    const empty = render(<AiFeatures />);
    expect(empty.getAllByText("Illustration").length).toBeGreaterThan(0);
    expect(empty.queryByText("Demo slot")).toBeNull();
    empty.unmount();
    const filled = render(<AiFeatures demo={<p>Demo slot</p>} />);
    expect(filled.getByText("Demo slot")).toBeTruthy();
    expect(filled.queryByText("Illustration")).toBeNull();
  });

  it("uses native details for six to eight FAQ answers", () => {
    expect(faq.length).toBeGreaterThanOrEqual(6);
    expect(faq.length).toBeLessThanOrEqual(8);
    const { container, getByRole } = render(<Faq />);
    const details = [...container.querySelectorAll("details")];
    expect(details).toHaveLength(faq.length);
    for (const item of details) {
      expect(item.querySelector("summary")).toBeTruthy();
      expect(item.open).toBe(false);
    }
    const question = getByRole("heading", { name: "Where is my mail stored?" });
    const row = question.closest("details");
    expect(row).toBeTruthy();
    fireEvent.click(question);
    expect(row?.open).toBe(true);
    expect(row?.textContent).toMatch(/fetched live/);
  });

  it("opens the nav menu from the keyboard and closes it with Escape", () => {
    const { getByRole } = render(<MarketingNav signIn={<SignIn />} />);
    const toggle = getByRole("button", { name: "Open menu" });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(toggle.getAttribute("aria-controls")).toBeTruthy();
    for (const href of ["#product", "#features", "#privacy", "#faq"]) {
      expect(document.querySelector(`nav[aria-label="Primary"] a[href="${href}"]`)).toBeTruthy();
    }
    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(document.activeElement?.textContent).toBe("Product");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(toggle);
    expect(toggle.textContent).toMatch(/Open menu/);
  });

  it("highlights a shortcut in the workflow preview without leaving the widget", () => {
    const { getByRole } = render(<Workflow />);
    const preview = getByRole("region", { name: "Shortcut preview" });
    preview.focus();
    fireEvent.keyDown(preview, { key: "e" });
    const archive = [...preview.querySelectorAll("li")].find((row) => row.textContent?.includes("Archive"));
    expect(archive?.getAttribute("data-active")).toBe("true");
    fireEvent.keyDown(preview, { key: "k", metaKey: true });
    const palette = [...preview.querySelectorAll("li")].find((row) => row.textContent?.includes("Command palette"));
    expect(palette?.getAttribute("data-active")).toBe("true");
    expect(archive?.getAttribute("data-active")).toBe("false");
  });
});

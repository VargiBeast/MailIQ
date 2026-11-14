import { act } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Hero from "@/pages/marketing/hero/Hero";
import Showcase from "@/pages/marketing/showcase/Showcase";
import InboxDemo from "@/pages/marketing/demos/InboxDemo";
import ReaderDemo from "@/pages/marketing/demos/ReaderDemo";
import SummaryDemo from "@/pages/marketing/demos/SummaryDemo";
import RepliesDemo from "@/pages/marketing/demos/RepliesDemo";
import BriefDemo from "@/pages/marketing/demos/BriefDemo";
import SearchDemo from "@/pages/marketing/demos/SearchDemo";
import CopilotDemo from "@/pages/marketing/demos/CopilotDemo";
import LazyDemo from "@/pages/marketing/demos/LazyDemo";
import { ILLUSTRATION_NOTE, resolveSampleSearch } from "@/pages/marketing/demos/fixtures";

const originalMatchMedia = window.matchMedia;

const BANNED = /end-to-end encrypted|zero-knowledge|one-click delete|model vendor stores nothing/i;

class MockObserver {
  static instances: MockObserver[] = [];
  observed: Element[] = [];
  root: Element | Document | null = null;
  rootMargin: string;
  thresholds: number[] = [];
  constructor(
    public callback: IntersectionObserverCallback,
    public options?: IntersectionObserverInit,
  ) {
    MockObserver.instances.push(this);
    this.rootMargin = options?.rootMargin ?? "";
  }
  observe(element: Element) {
    this.observed.push(element);
  }
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

function installObserver() {
  MockObserver.instances = [];
  vi.stubGlobal("IntersectionObserver", MockObserver);
}

function installMatchMedia(options?: { reduced?: boolean; coarse?: boolean; desktop?: boolean }) {
  const state = {
    reduced: options?.reduced ?? false,
    coarse: options?.coarse ?? false,
    desktop: options?.desktop ?? true,
  };
  const queries: Array<{ media: string; listeners: Set<() => void> }> = [];
  window.matchMedia = ((query: string) => {
    const listeners = new Set<() => void>();
    queries.push({ media: query, listeners });
    const read = () => {
      if (query.includes("prefers-reduced-motion")) return state.reduced;
      if (query.includes("pointer: coarse")) return state.coarse;
      if (query.includes("min-width: 1024")) return state.desktop;
      return false;
    };
    return {
      get matches() {
        return read();
      },
      media: query,
      onchange: null,
      addEventListener: (_type: string, cb: () => void) => {
        listeners.add(cb);
      },
      removeEventListener: (_type: string, cb: () => void) => {
        listeners.delete(cb);
      },
      addListener: (cb: () => void) => {
        listeners.add(cb);
      },
      removeListener: (cb: () => void) => {
        listeners.delete(cb);
      },
      dispatchEvent: () => true,
    };
  }) as unknown as typeof window.matchMedia;

  return {
    setReduced(next: boolean) {
      state.reduced = next;
      for (const query of queries) {
        if (query.media.includes("prefers-reduced-motion")) query.listeners.forEach((cb) => cb());
      }
    },
  };
}

function rect(): DOMRect {
  return {
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    right: 800,
    bottom: 420,
    width: 800,
    height: 420,
    toJSON() {
      return {};
    },
  };
}

function renderHero(notice?: string) {
  return render(
    <Hero
      signIn={<a href="/api/auth/google/start">Sign in with Google</a>}
      notice={notice ? <p role="alert">{notice}</p> : undefined}
    />,
  );
}

beforeEach(() => {
  installMatchMedia();
});

afterEach(() => {
  cleanup();
  window.matchMedia = originalMatchMedia;
  vi.unstubAllGlobals();
  MockObserver.instances = [];
});

describe("marketing hero", () => {
  it("keeps the inbox headline, sign-in slot, notice and product link", () => {
    renderHero("Your sign-in link expired.");
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.textContent).toContain("Your inbox");
    expect(heading.textContent).toContain("understood.");
    expect(screen.getByText(/AI proposes, you confirm/)).toBeTruthy();
    expect(screen.getByRole("link", { name: "Sign in with Google" }).getAttribute("href")).toBe("/api/auth/google/start");
    expect(screen.getByRole("link", { name: "See how it works" }).getAttribute("href")).toBe("#product");
    expect(screen.getByRole("alert").textContent).toContain("expired");
    expect(screen.getByText(ILLUSTRATION_NOTE)).toBeTruthy();
    expect(document.body.textContent).not.toMatch(BANNED);
  });

  it("reveals the selected sample’s summary", () => {
    renderHero();
    expect(screen.getByRole("region", { name: "AI summary" }).textContent).not.toMatch(/invoice 1842/i);
    fireEvent.click(screen.getByRole("option", { name: /Invoice 1842/ }));
    expect(screen.getByRole("region", { name: "AI summary" }).textContent).toMatch(/invoice 1842/i);
  });

  it("tilts on pointer move and settles back", () => {
    installMatchMedia({ reduced: false, coarse: false });
    const { container } = renderHero();
    const frame = container.querySelector("[data-tilt]") as HTMLDivElement;
    expect(frame.getAttribute("data-tilt")).toBe("on");
    vi.spyOn(frame, "getBoundingClientRect").mockReturnValue(rect());
    fireEvent.pointerMove(frame, { clientX: 800, clientY: 210 });
    expect(frame.style.transform).toContain("rotateY(2.5deg)");
    fireEvent.pointerLeave(frame);
    expect(frame.style.transform).toContain("rotateY(0deg)");
  });

  it("does not tilt when motion is reduced or the pointer is coarse", () => {
    installMatchMedia({ reduced: true, coarse: false });
    const reducedView = renderHero();
    const reducedFrame = reducedView.container.querySelector("[data-tilt]") as HTMLDivElement;
    expect(reducedFrame.getAttribute("data-tilt")).toBe("off");
    vi.spyOn(reducedFrame, "getBoundingClientRect").mockReturnValue(rect());
    fireEvent.pointerMove(reducedFrame, { clientX: 800, clientY: 210 });
    expect(reducedFrame.style.transform).toBe("none");
    expect(screen.getByRole("region", { name: "AI summary" }).className).not.toContain("animate-fade-in");
    reducedView.unmount();

    installMatchMedia({ reduced: false, coarse: true });
    const coarseView = renderHero();
    expect(coarseView.container.querySelector("[data-tilt]")?.getAttribute("data-tilt")).toBe("off");
  });

  it("drops the tilt immediately when reduced motion turns on", () => {
    const media = installMatchMedia({ reduced: false, coarse: false });
    const { container } = renderHero();
    const frame = container.querySelector("[data-tilt]") as HTMLDivElement;
    vi.spyOn(frame, "getBoundingClientRect").mockReturnValue(rect());
    fireEvent.pointerMove(frame, { clientX: 800, clientY: 210 });
    expect(frame.style.transform).toContain("rotateY(2.5deg)");
    act(() => {
      media.setReduced(true);
    });
    expect(frame.getAttribute("data-tilt")).toBe("off");
    expect(frame.style.transform).toBe("none");
  });
});

describe("marketing showcase", () => {
  it("uses step buttons when motion is reduced, including on a desktop width", () => {
    installMatchMedia({ reduced: true, desktop: true });
    installObserver();
    render(<Showcase />);
    const section = document.getElementById("product");
    expect(section?.getAttribute("data-showcase-mode")).toBe("steps");
    expect(MockObserver.instances).toHaveLength(0);
    expect(screen.getByRole("button", { name: /Open the thread/ }).textContent).toContain("fetches the message live");
    expect(screen.queryByRole("region", { name: "AI summary" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /Read the summary/ }));
    expect(section?.getAttribute("data-active-step")).toBe("summary");
    expect(screen.getByRole("region", { name: "AI summary" }).textContent).toContain("Thursday");
    fireEvent.click(screen.getByRole("button", { name: /Preview a reply/ }));
    expect(screen.getByText("You review before sending")).toBeTruthy();
    expect(document.body.textContent).not.toMatch(BANNED);
  });

  it("follows the visible step while scrolling on a large screen", () => {
    installMatchMedia({ reduced: false, desktop: true, coarse: false });
    installObserver();
    render(<Showcase />);
    expect(document.getElementById("product")?.getAttribute("data-showcase-mode")).toBe("scroll");
    const io = MockObserver.instances[0];
    expect(io).toBeTruthy();
    const summary = io?.observed.find((element) => element.getAttribute("data-step") === "summary");
    expect(summary).toBeTruthy();
    act(() => {
      io?.callback(
        [{ isIntersecting: true, intersectionRatio: 0.8, target: summary! } as IntersectionObserverEntry],
        io as unknown as IntersectionObserver,
      );
    });
    expect(document.getElementById("product")?.getAttribute("data-active-step")).toBe("summary");
    expect(screen.getByRole("region", { name: "AI summary" })).toBeTruthy();
  });

  it("stacks the steps below the desktop width", () => {
    installMatchMedia({ reduced: false, desktop: false });
    render(<Showcase />);
    expect(document.getElementById("product")?.getAttribute("data-showcase-mode")).toBe("steps");
    expect(screen.getByRole("button", { name: /A calm inbox/ }).textContent).toContain("j and k");
  });
});

describe("marketing demos", () => {
  it("moves the inbox with j and k only after the list is focused, and marks the row read", () => {
    render(<InboxDemo />);
    const list = screen.getByRole("listbox", { name: "Sample inbox" });
    const invoice = screen.getByRole("option", { name: /Invoice 1842/ });
    expect(invoice.getAttribute("data-read-state")).toBe("unread");
    fireEvent.keyDown(list, { key: "j" });
    expect(invoice.getAttribute("aria-selected")).not.toBe("true");
    list.focus();
    fireEvent.keyDown(list, { key: "j" });
    expect(invoice.getAttribute("aria-selected")).toBe("true");
    expect(invoice.getAttribute("data-read-state")).toBe("read");
    fireEvent.keyDown(list, { key: "k" });
    expect(screen.getAllByRole("option")[0]?.getAttribute("aria-selected")).toBe("true");
    expect(screen.getByText(ILLUSTRATION_NOTE)).toBeTruthy();
  });

  it("opens a sample message and marks it read", () => {
    render(<ReaderDemo />);
    const invoice = screen.getByRole("option", { name: /Invoice 1842/ });
    expect(invoice.querySelector("[data-read-state]")?.getAttribute("data-read-state")).toBe("unread");
    fireEvent.click(invoice);
    expect(invoice.querySelector("[data-read-state]")?.getAttribute("data-read-state")).toBe("read");
    expect(screen.getByRole("article", { name: "Opened message" }).textContent).toContain("not a real invoice");
  });

  it("shows summary, key points, action items and deadlines", () => {
    render(<SummaryDemo />);
    expect(screen.getByRole("heading", { name: "Summary" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Key points" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Action items" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Deadlines" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Action items" }).parentElement?.textContent).toContain("Confirm the final cut");
    fireEvent.click(screen.getByRole("button", { name: "Priya" }));
    expect(screen.getByRole("heading", { name: "Deadlines" }).nextElementSibling?.textContent).toBe("None in this sample.");
  });

  it("fills a draft preview and never offers send", () => {
    render(<RepliesDemo />);
    expect(screen.getByText("You review before sending")).toBeTruthy();
    expect(screen.queryByRole("button", { name: /send/i })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Confirm Thursday" }));
    const preview = screen.getByLabelText("Draft preview") as HTMLTextAreaElement;
    expect(preview.value).toContain("Thursday at 16:00");
    expect(screen.queryByRole("button", { name: /send/i })).toBeNull();
    expect(preview.className).toContain("animate-fade-in");
  });

  it("skips the draft animation when motion is reduced", () => {
    installMatchMedia({ reduced: true });
    render(<RepliesDemo />);
    fireEvent.click(screen.getByRole("button", { name: "Confirm Thursday" }));
    expect(screen.getByLabelText("Draft preview").className).not.toContain("animate-fade-in");
    expect(screen.getByLabelText("Replies illustration").getAttribute("data-reduced-motion")).toBe("true");
  });

  it("confirms a local archive and undoes it", () => {
    render(<BriefDemo />);
    expect(screen.getByRole("region", { name: "Important" }).textContent).toContain("Launch film");
    expect(screen.getByRole("region", { name: "Awaiting reply" }).textContent).toContain("workshop");
    const archive = screen.getByRole("region", { name: "Safe to archive" });
    expect(archive.textContent).toContain("Lumen weekly");
    fireEvent.click(screen.getByRole("button", { name: "Archive sample" }));
    expect(screen.getByText("Archive 2 sample messages?")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByText("Archive 2 sample messages?")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Archive sample" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm archive" }));
    expect(screen.getByRole("status").textContent).toContain("Archived in this illustration.");
    expect(screen.getByRole("region", { name: "Safe to archive" }).textContent).not.toContain("Lumen weekly");
    fireEvent.click(screen.getByRole("button", { name: "Undo" }));
    expect(screen.getByRole("region", { name: "Safe to archive" }).textContent).toContain("Harbor weekly");
  });

  it("shows a Gmail-style query for a picked or typed phrase", () => {
    const { container } = render(<SearchDemo />);
    const query = () => container.querySelector("[data-gmail-query]")?.textContent;
    expect(query()).toBe("invoice newer_than:30d");
    expect(screen.getByRole("list", { name: "Sample results" }).textContent).toContain("Invoice 1842");
    expect(screen.getByRole("list", { name: "Sample results" }).textContent).not.toContain("Lumen weekly");
    fireEvent.click(screen.getByRole("button", { name: "from Maya about the launch" }));
    expect(query()).toBe("from:maya.chen@northwind.example launch");
    expect(screen.getByRole("list", { name: "Sample results" }).textContent).toContain("Launch film");
    fireEvent.change(screen.getByLabelText("Search sample mail"), { target: { value: "workshop" } });
    fireEvent.click(screen.getByRole("button", { name: "Search" }));
    expect(query()).toBe("workshop");
    expect(screen.getByRole("list", { name: "Sample results" }).textContent).toContain("workshop times");
  });

  it("confirms a toggleable Copilot plan locally and undoes it", () => {
    render(<CopilotDemo />);
    expect(screen.getByText("Archive newsletters from this week")).toBeTruthy();
    const launch = screen.getByRole("checkbox", { name: /Launch film/i }) as HTMLInputElement;
    expect(launch.checked).toBe(false);
    fireEvent.click(launch);
    expect(launch.checked).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Confirm plan" }));
    expect(screen.getByRole("status").textContent).toContain("Done in this illustration.");
    expect(screen.getByRole("status").textContent).toContain("3 sample conversations");
    expect(screen.getByRole("status").textContent).toContain("Nothing changed in a real mailbox.");
    fireEvent.click(screen.getByRole("button", { name: "Undo" }));
    expect((screen.getByRole("checkbox", { name: /Launch film/i }) as HTMLInputElement).checked).toBe(true);
    expect(screen.queryByRole("button", { name: /send/i })).toBeNull();
  });

  it("labels every illustration and avoids claims the product does not make", () => {
    const views = [InboxDemo, ReaderDemo, SummaryDemo, RepliesDemo, BriefDemo, SearchDemo, CopilotDemo];
    for (const Demo of views) {
      const view = render(<Demo />);
      expect(view.container.textContent).toContain(ILLUSTRATION_NOTE);
      expect(view.container.textContent).not.toMatch(BANNED);
      view.unmount();
    }
  });
});

describe("LazyDemo", () => {
  it("waits until the placeholder is near the viewport, then loads that demo", async () => {
    installObserver();
    render(<LazyDemo name="inbox" />);
    expect(screen.getByRole("status", { name: "Loading illustration" })).toBeTruthy();
    expect(screen.queryByRole("listbox", { name: "Sample inbox" })).toBeNull();
    const io = MockObserver.instances[0];
    expect(io?.options?.rootMargin).toBe("400px");
    const target = io?.observed[0];
    expect(target).toBeTruthy();
    act(() => {
      io?.callback(
        [
          {
            isIntersecting: true,
            intersectionRatio: 1,
            target: target!,
            boundingClientRect: rect(),
            intersectionRect: rect(),
            rootBounds: null,
            time: 0,
          } as IntersectionObserverEntry,
        ],
        io as unknown as IntersectionObserver,
      );
    });
    expect(await screen.findByRole("listbox", { name: "Sample inbox" })).toBeTruthy();
  });

  it("loads the named demo", async () => {
    installObserver();
    render(<LazyDemo name="search" />);
    const io = MockObserver.instances[0];
    const target = io?.observed[0];
    act(() => {
      io?.callback(
        [{ isIntersecting: true, intersectionRatio: 1, target: target! } as IntersectionObserverEntry],
        io as unknown as IntersectionObserver,
      );
    });
    expect(await screen.findByRole("heading", { name: "See the Gmail query" })).toBeTruthy();
    expect(screen.getByText("invoice newer_than:30d")).toBeTruthy();
  });
});

describe("resolveSampleSearch", () => {
  it("maps known phrases to visible Gmail queries and ignores blank input", () => {
    expect(resolveSampleSearch("invoice from last month").gmailQuery).toBe("invoice newer_than:30d");
    expect(resolveSampleSearch("unread deadlines").results.map((thread) => thread.id)).toEqual(["launch", "invoice"]);
    expect(resolveSampleSearch("workshop").results.map((thread) => thread.id)).toEqual(["workshop"]);
    expect(resolveSampleSearch("   ")).toEqual({ gmailQuery: "", results: [] });
  });
});

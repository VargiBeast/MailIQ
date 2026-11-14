import { Component, lazy, Suspense, type ReactNode } from "react";
import useInView from "./useInView";

const DEMOS = {
  inbox: lazy(() => import("./InboxDemo")),
  reader: lazy(() => import("./ReaderDemo")),
  summary: lazy(() => import("./SummaryDemo")),
  replies: lazy(() => import("./RepliesDemo")),
  brief: lazy(() => import("./BriefDemo")),
  search: lazy(() => import("./SearchDemo")),
  copilot: lazy(() => import("./CopilotDemo")),
} as const;

export type DemoName = keyof typeof DEMOS;

function DemoSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading illustration"
      className="mk-frame rounded-[var(--radius-xl)] border border-line bg-surface p-4"
    >
      <span className="sr-only">Loading illustration</span>
      <div className="shimmer h-3 w-1/3 rounded-[var(--radius-sm)]" />
      <div className="shimmer mt-3 h-28 w-full rounded-[var(--radius-lg)]" />
    </div>
  );
}

class DemoBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  override state = { failed: false };

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  override render() {
    if (this.state.failed) {
      return (
        <p role="alert" className="rounded-[var(--radius-lg)] border border-line px-4 py-3 text-[13.5px] text-fg-2">
          This illustration couldn’t be loaded.
        </p>
      );
    }
    return this.props.children;
  }
}

/** Loads a demo when it is within about 400px of the viewport. */
export default function LazyDemo({ name }: { name: DemoName }) {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "400px", threshold: 0, once: true });
  const Demo = DEMOS[name];
  return (
    <div ref={ref} data-demo={name} className="min-w-0">
      {inView ? (
        <DemoBoundary>
          <Suspense fallback={<DemoSkeleton />}>
            <Demo />
          </Suspense>
        </DemoBoundary>
      ) : (
        <DemoSkeleton />
      )}
    </div>
  );
}

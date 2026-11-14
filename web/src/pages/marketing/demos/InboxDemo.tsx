import { useState, type KeyboardEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { Kbd } from "@/components/ui/misc";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/motion";
import { Keyboard } from "lucide-react";
import { SAMPLE_THREADS, type SampleThread } from "./fixtures";
import ProductFrame, { DemoShell, PersonMark } from "./ProductFrame";

export default function InboxDemo() {
  const reduced = usePrefersReducedMotion();
  const threads = SAMPLE_THREADS;
  const first = threads[0];
  const [selectedId, setSelectedId] = useState(first?.id ?? "");
  const [readIds, setReadIds] = useState<string[]>(() => {
    const read = threads.filter((thread) => !thread.unread).map((thread) => thread.id);
    if (first && !read.includes(first.id)) read.push(first.id);
    return read;
  });

  const select = (id: string) => {
    setSelectedId(id);
    setReadIds((ids) => (ids.includes(id) ? ids : [...ids, id]));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const focus = document.activeElement;
    if (focus !== event.currentTarget && !event.currentTarget.contains(focus)) return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const target = event.target;
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return;
    const index = threads.findIndex((thread) => thread.id === selectedId);
    const key = event.key.toLowerCase();
    let next: SampleThread | undefined;
    if (key === "j" || event.key === "ArrowDown") next = threads[Math.min(threads.length - 1, index + 1)];
    else if (key === "k" || event.key === "ArrowUp") next = threads[Math.max(0, index - 1)];
    if (!next || next.id === selectedId) return;
    event.preventDefault();
    select(next.id);
  };

  return (
    <DemoShell
      label="Inbox illustration"
      title="Move through a sample inbox"
      lede="Select a conversation. Focus the list and press j or k to move, the same keys as the app. Opening a row marks it read in this illustration."
      reduced={reduced}
    >
      <ProductFrame caption="Inbox">
        <div
          role="listbox"
          tabIndex={0}
          aria-label="Sample inbox"
          aria-activedescendant={selectedId ? `inbox-option-${selectedId}` : undefined}
          onKeyDown={onKeyDown}
          className="max-h-[420px] overflow-y-auto scroll-thin"
        >
          {threads.map((thread) => {
            const selected = thread.id === selectedId;
            const read = readIds.includes(thread.id);
            return (
              <button
                key={thread.id}
                id={`inbox-option-${thread.id}`}
                type="button"
                role="option"
                aria-selected={selected}
                data-read-state={read ? "read" : "unread"}
                tabIndex={-1}
                onClick={() => select(thread.id)}
                className={cn(
                  "flex w-full min-h-11 min-w-0 items-center gap-2.5 px-3 py-2 text-left",
                  "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]",
                  selected ? "bg-accent-soft" : "hover:bg-surface-2",
                )}
              >
                <PersonMark name={thread.from.name} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-2">
                    <span className={cn("truncate text-[13px]", read ? "font-medium text-fg-2" : "font-semibold text-fg")}>
                      {thread.from.name}
                    </span>
                    <span className="ml-auto shrink-0 text-[11.5px] text-fg-2">{thread.time}</span>
                  </span>
                  <span className="mt-0.5 block truncate text-[12.5px] text-fg-2">{thread.subject}</span>
                </span>
                {read ? (
                  <span className="sr-only">Read</span>
                ) : (
                  <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-accent-ink">Unread</span>
                )}
              </button>
            );
          })}
        </div>
      </ProductFrame>
      <p className="mt-3 flex flex-wrap items-center gap-1.5 text-[12.5px] text-fg-2">
        <Icon icon={Keyboard} size="sm" className="text-accent-ink" />
        Focus the list, then <Kbd>j</Kbd> or <Kbd>k</Kbd>.
      </p>
    </DemoShell>
  );
}

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Mail } from "lucide-react";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/motion";
import { threadById } from "./fixtures";
import ProductFrame, { DemoShell, PersonMark } from "./ProductFrame";

const IDS = ["launch", "invoice"] as const;

export default function ReaderDemo() {
  const reduced = usePrefersReducedMotion();
  const messages = IDS.map((id) => threadById(id));
  const [openId, setOpenId] = useState<string>("launch");
  const [readIds, setReadIds] = useState<string[]>(["launch"]);
  const open = messages.find((message) => message.id === openId) ?? null;

  const openMessage = (id: string) => {
    setOpenId(id);
    setReadIds((ids) => (ids.includes(id) ? ids : [...ids, id]));
  };

  return (
    <DemoShell
      label="Reader illustration"
      title="Open a sample message"
      lede="Choose a message to read it. In the app, HTML is sanitized and remote images stay off until you allow them. This sample is plain text."
      reduced={reduced}
    >
      <ProductFrame caption="Reader">
        <div className="grid min-w-0 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <div className="min-w-0 border-b border-line md:border-b-0 md:border-r" role="listbox" aria-label="Sample messages">
            {messages.map((message) => {
              const selected = message.id === openId;
              const read = readIds.includes(message.id);
              return (
                <button
                  key={message.id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => openMessage(message.id)}
                  className={cn(
                    "flex w-full min-h-11 min-w-0 items-center gap-2.5 px-3 py-2.5 text-left",
                    "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]",
                    selected ? "bg-accent-soft" : "hover:bg-surface-2",
                  )}
                >
                  <PersonMark name={message.from.name} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium text-fg">{message.from.name}</span>
                    <span className="mt-0.5 block truncate text-[12.5px] text-fg-2">{message.subject}</span>
                  </span>
                  <span data-read-state={read ? "read" : "unread"} className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-accent-ink">
                    {read ? "Read" : "Unread"}
                  </span>
                </button>
              );
            })}
          </div>
          <article aria-label="Opened message" className={cn("min-w-0 p-4", !reduced && open && "animate-fade-in")} key={open?.id}>
            {open ? (
              <>
                <p className="flex items-center gap-1.5 text-[12px] font-medium text-ai-title">
                  <Icon icon={Mail} size="sm" />
                  Opened
                </p>
                <h4 className="mt-2 text-pretty text-[16px] font-semibold tracking-tight text-fg">{open.subject}</h4>
                <p className="mt-1 truncate text-[12.5px] text-fg-2">
                  {open.from.name} · {open.from.email}
                </p>
                <div className="mt-3 space-y-2">
                  {open.body.map((paragraph) => (
                    <p key={paragraph} className="text-pretty text-[13.5px] leading-relaxed text-fg-2">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-[13.5px] text-fg-2">Select a message to read it.</p>
            )}
          </article>
        </div>
      </ProductFrame>
    </DemoShell>
  );
}

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Archive, Clock3, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/motion";
import { BRIEF, threadById } from "./fixtures";
import { DemoShell } from "./ProductFrame";

const GROUPS = [
  { id: "important", title: "Important", icon: Star, ids: BRIEF.important },
  { id: "awaiting", title: "Awaiting reply", icon: Clock3, ids: BRIEF.awaitingReply },
  { id: "archive", title: "Safe to archive", icon: Archive, ids: BRIEF.safeToArchive },
] as const;

export default function BriefDemo() {
  const reduced = usePrefersReducedMotion();
  const [confirming, setConfirming] = useState(false);
  const [archived, setArchived] = useState(false);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const safeCount = BRIEF.safeToArchive.length;

  useEffect(() => {
    if (confirming) confirmRef.current?.focus();
  }, [confirming]);

  return (
    <DemoShell
      label="Daily brief illustration"
      title="What needs you, and what can wait"
      lede="Important, awaiting your reply, and safe to archive. Archiving asks for a confirm, then you can undo — here, only the illustration changes. Starred or important mail is not in the archive group."
      reduced={reduced}
    >
      <div className="grid min-w-0 gap-3">
        {GROUPS.map((group) => {
          const hidden = group.id === "archive" && archived;
          const items = hidden ? [] : group.ids.map((id) => threadById(id));
          return (
            <section key={group.id} aria-label={group.title} className="min-w-0 rounded-[var(--radius-xl)] border border-line bg-surface p-4">
              <h4 className="flex items-center gap-2 text-[14px] font-semibold text-fg">
                <Icon icon={group.icon} size="sm" className="text-accent-ink" />
                {group.title}
              </h4>
              {items.length > 0 ? (
                <ul className="mt-2 space-y-2">
                  {items.map((item) => (
                    <li key={item.id} className="min-w-0">
                      <p className="text-pretty text-[13.5px] font-medium text-fg">{item.subject}</p>
                      <p className="text-pretty text-[12.5px] text-fg-2">{item.snippet}</p>
                    </li>
                  ))}
                </ul>
              ) : group.id === "archive" && archived ? null : (
                <p className="mt-2 text-[13px] text-fg-2">Nothing in this group.</p>
              )}
              {group.id === "archive" && !archived && !confirming && (
                <Button className="mt-3" variant="secondary" onClick={() => setConfirming(true)}>
                  Archive sample
                </Button>
              )}
              {group.id === "archive" && confirming && !archived && (
                <div className="mt-3 rounded-[var(--radius-lg)] border border-[var(--ai-border)] bg-accent-soft p-3">
                  <p className="text-[13.5px] font-medium text-fg">Archive {safeCount} sample messages?</p>
                  <p className="mt-1 text-[12.5px] text-fg-2">This only updates the illustration.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      ref={confirmRef}
                      variant="primary"
                      onClick={() => {
                        setArchived(true);
                        setConfirming(false);
                      }}
                    >
                      Confirm archive
                    </Button>
                    <Button variant="ghost" onClick={() => setConfirming(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
              {group.id === "archive" && archived && (
                <div className={cn("mt-3", !reduced && "animate-fade-in")} role="status">
                  <p className="text-[13.5px] font-medium text-fg">Archived in this illustration.</p>
                  <Button className="mt-3" variant="secondary" onClick={() => setArchived(false)}>
                    Undo
                  </Button>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </DemoShell>
  );
}

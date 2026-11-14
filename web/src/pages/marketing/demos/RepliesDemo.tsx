import { useState } from "react";
import { Chip } from "@/components/ui/misc";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/motion";
import { SAMPLE_THREADS } from "./fixtures";
import { DemoShell } from "./ProductFrame";

const THREADS = SAMPLE_THREADS.filter((thread) => thread.replies.length > 0);

export default function RepliesDemo() {
  const reduced = usePrefersReducedMotion();
  const [threadId, setThreadId] = useState(THREADS[0]?.id ?? "");
  const [draftId, setDraftId] = useState<string | null>(null);
  const thread = THREADS.find((item) => item.id === threadId) ?? THREADS[0];
  const draft = thread?.replies.find((reply) => reply.id === draftId) ?? null;

  const chooseThread = (id: string) => {
    setThreadId(id);
    setDraftId(null);
  };

  if (!thread) return null;

  return (
    <DemoShell
      label="Replies illustration"
      title="A suggestion fills a draft"
      lede="Pick a suggested reply. It only fills the preview below. MailIQ does not send AI-written text without your confirmation."
      reduced={reduced}
    >
      <p className="text-[14px] font-medium text-fg">{thread.subject}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {THREADS.map((item) => (
          <Chip key={item.id} active={item.id === thread.id} onClick={() => chooseThread(item.id)}>
            {item.from.name.split(" ")[0]}
          </Chip>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Suggested replies">
        {thread.replies.map((reply) => (
          <Chip key={reply.id} active={draft?.id === reply.id} onClick={() => setDraftId(reply.id)}>
            {reply.label}
          </Chip>
        ))}
      </div>
      <label className="mt-4 block">
        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-fg-2">Draft preview</span>
        <textarea
          readOnly
          value={draft?.draft ?? ""}
          placeholder="Choose a suggestion to fill this preview."
          aria-label="Draft preview"
          className={cn(
            "mt-2 min-h-28 w-full resize-none rounded-[var(--radius-lg)] border border-line bg-surface-2 px-3 py-3 text-[16px] leading-relaxed text-fg",
            "placeholder:text-fg-3",
            !reduced && draft && "animate-fade-in",
          )}
        />
      </label>
      <p className="mt-3 text-[14.5px] font-medium text-fg">You review before sending</p>
    </DemoShell>
  );
}

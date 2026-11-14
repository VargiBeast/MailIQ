import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { CalendarClock, CheckCircle2, Sparkles } from "lucide-react";
import { Chip } from "@/components/ui/misc";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/motion";
import { SAMPLE_THREADS } from "./fixtures";
import { DemoShell } from "./ProductFrame";

export default function SummaryDemo() {
  const reduced = usePrefersReducedMotion();
  const [id, setId] = useState(SAMPLE_THREADS[0]?.id ?? "");
  const thread = SAMPLE_THREADS.find((item) => item.id === id) ?? SAMPLE_THREADS[0];
  if (!thread) return null;

  return (
    <DemoShell
      label="Summary illustration"
      title="Summary, points, actions, deadlines"
      lede="The same blocks a thread summary shows in MailIQ. The text is sample copy — in the app you still check the important details."
      reduced={reduced}
    >
      <div className="flex flex-wrap gap-2">
        {SAMPLE_THREADS.map((item) => (
          <Chip key={item.id} active={item.id === thread.id} onClick={() => setId(item.id)}>
            {item.from.name.split(" ")[0]}
          </Chip>
        ))}
      </div>
      <div
        key={thread.id}
        className={cn("ai-block mt-4 rounded-[var(--radius-xl)] p-4 sm:p-5", !reduced && "animate-fade-in")}
      >
        <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ai-title">
          <Icon icon={Sparkles} size="sm" />
          Summary of {thread.from.name}’s email
        </p>
        <h4 className="mt-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-ai-title">Summary</h4>
        <p className="mt-1 text-pretty text-[14.5px] leading-relaxed text-fg">{thread.summary}</p>

        <h4 className="mt-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-ai-title">Key points</h4>
        {thread.keyPoints.length > 0 ? (
          <ul className="mt-1 list-disc space-y-1 pl-5 text-[14px] leading-relaxed text-fg-2">
            {thread.keyPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-[14px] text-fg-2">None in this sample.</p>
        )}

        <h4 className="mt-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-ai-title">Action items</h4>
        {thread.actionItems.length > 0 ? (
          <ul className="mt-1 space-y-1.5">
            {thread.actionItems.map((item) => (
              <li key={item.task} className="flex gap-2 text-[14px] leading-relaxed text-fg-2">
                <Icon icon={CheckCircle2} size="sm" className="mt-0.5 shrink-0 text-accent-ink" />
                <span>
                  {item.task}
                  {item.owner ? <span className="text-fg-2"> · {item.owner}</span> : null}
                  {item.due ? <span className="text-fg-2"> · {item.due}</span> : null}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-[14px] text-fg-2">None in this sample.</p>
        )}

        <h4 className="mt-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-ai-title">Deadlines</h4>
        {thread.deadlines.length > 0 ? (
          <ul className="mt-1 space-y-1.5">
            {thread.deadlines.map((item) => (
              <li key={item.what} className="flex gap-2 text-[14px] leading-relaxed text-fg-2">
                <Icon icon={CalendarClock} size="sm" className="mt-0.5 shrink-0 text-accent-ink" />
                <span>
                  {item.what} — <span className="text-fg">{item.when}</span>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-[14px] text-fg-2">None in this sample.</p>
        )}
      </div>
    </DemoShell>
  );
}

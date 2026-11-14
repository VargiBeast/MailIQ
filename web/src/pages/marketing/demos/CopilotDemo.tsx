import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { CheckCircle2, ShieldCheck, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/motion";
import { COPILOT_INSTRUCTION, COPILOT_ROWS } from "./fixtures";
import { DemoShell } from "./ProductFrame";

export default function CopilotDemo() {
  const reduced = usePrefersReducedMotion();
  const [included, setIncluded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(COPILOT_ROWS.map((row) => [row.id, row.defaultOn])),
  );
  const [done, setDone] = useState(false);
  const selected = COPILOT_ROWS.filter((row) => included[row.id]);

  const toggle = (id: string) => {
    setIncluded((current) => ({ ...current, [id]: !current[id] }));
  };

  return (
    <DemoShell
      label="Copilot illustration"
      title="A plan you can edit, then undo"
      lede="The instruction is fixed. Turn rows on or off, confirm, and undo. Trash and send ask a second time in the app; this sample only archives, and only on this page."
      reduced={reduced}
    >
      <p className="ml-auto max-w-[28rem] rounded-[var(--radius-lg)] bg-accent px-3 py-2 text-[14px] leading-relaxed text-accent-fg sm:ml-10">
        {COPILOT_INSTRUCTION}
      </p>
      {!done ? (
        <div className="mt-4 rounded-[var(--radius-xl)] border border-line bg-surface p-3 sm:p-4">
          <p className="flex items-center gap-1.5 text-[12.5px] text-fg-2">
            <Icon icon={ShieldCheck} size="sm" className="text-accent-ink" />
            Nothing runs until you confirm.
          </p>
          <ul className="mt-3 space-y-2">
            {COPILOT_ROWS.map((row) => {
              const on = included[row.id] ?? false;
              return (
                <li key={row.id}>
                  <label
                    className={cn(
                      "flex min-h-11 cursor-pointer items-start gap-3 rounded-[var(--radius-lg)] border px-3 py-2.5",
                      "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]",
                      on ? "border-[var(--ai-border)] bg-accent-soft" : "border-line bg-surface-2",
                    )}
                  >
                    <input
                      type="checkbox"
                      className="mt-1 size-4 shrink-0 accent-accent"
                      checked={on}
                      onChange={() => toggle(row.id)}
                    />
                    <span className="min-w-0">
                      <span className="block text-[13.5px] font-medium text-fg">{row.title}</span>
                      <span className="mt-0.5 block text-[12.5px] text-fg-2">{row.detail}</span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
          <Button className="mt-3" variant="primary" disabled={selected.length === 0} onClick={() => setDone(true)}>
            Confirm plan
          </Button>
        </div>
      ) : (
        <div className={cn("mt-4 rounded-[var(--radius-xl)] border border-line bg-surface p-4", !reduced && "animate-fade-in")} role="status">
          <p className="flex items-start gap-2 text-[14.5px] font-medium text-fg">
            <Icon icon={CheckCircle2} className="mt-0.5 shrink-0 text-success" />
            Done in this illustration. {selected.length} sample {selected.length === 1 ? "conversation" : "conversations"} updated.
            Nothing changed in a real mailbox.
          </p>
          <Button className="mt-3" variant="secondary" icon={<Icon icon={Undo2} size="sm" />} onClick={() => setDone(false)}>
            Undo
          </Button>
        </div>
      )}
    </DemoShell>
  );
}

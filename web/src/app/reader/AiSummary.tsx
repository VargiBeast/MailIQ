import { useQuery } from "@tanstack/react-query";
import { Icon } from "@/components/ui/Icon";
import { CalendarClock, CheckCircle2, CircleHelp, Gavel, ShieldOff, Sparkles, TriangleAlert, UserRound } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import type { ThreadDetail } from "@shared/mail";
import { api, ApiError, errorMessage } from "@/lib/api";
import { useSession } from "@/lib/session";
import { Skeleton } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { displayName } from "@/lib/format";
import { useMediaQuery } from "@/lib/useMediaQuery";

export interface Insights {
  summary: string;
  keyPoints: string[];
  actionItems: Array<{ task: string; owner: string | null; due: string | null }>;
  deadlines: Array<{ what: string; when: string }>;
  needsReply: boolean;
  quickReplies: string[];
  /** Long threads only. */
  asks?: Array<{ who: string; wants: string }>;
  decisions?: string[];
  openQuestions?: string[];
}

export function useInsights(thread: ThreadDetail | undefined, enabled: boolean) {
  return useQuery({
    queryKey: ["insights", thread?.accountId, thread?.id, thread?.messages.length],
    enabled: Boolean(thread) && enabled,
    queryFn: () => api.post<Insights>("/ai/insights", { accountId: thread!.accountId, threadId: thread!.id }),
    staleTime: 10 * 60_000,
    retry: false,
  });
}

export function AiSummary({ thread, insights, autoEnabled, onRequest }: {
  thread: ThreadDetail;
  insights: ReturnType<typeof useInsights>;
  autoEnabled: boolean;
  onRequest: () => void;
}) {
  const { config, session } = useSession();
  const desktop = useMediaQuery("(min-width: 1024px)");
  const [expanded, setExpanded] = useState(desktop);
  useEffect(() => {
    setExpanded(desktop);
  }, [desktop]);

  const lastOther = [...thread.messages].reverse().find((m) => !m.isFromMe) ?? thread.messages[thread.messages.length - 1];
  const title = `Summary of ${lastOther ? displayName(lastOther.from) : "this"}’s email`;

  // One Block for every state so the enter animation does not replay when the skeleton swaps to text.
  let heading = "AI summary";
  let busy = false;
  let body: ReactNode;
  if (!config?.ai) {
    body = <p className="text-fg-3">AI isn’t configured on this server yet. Add an AI provider key to enable summaries, drafting and smart search.</p>;
  } else if (session?.settings?.ai.enabled === false) {
    body = <p className="text-fg-3">AI features are turned off in your settings.</p>;
  } else if (!autoEnabled && !insights.data && !insights.isFetching && !insights.isError) {
    heading = title;
    body = (
      <div className="flex items-center justify-between gap-3">
        <p className="text-fg-3">Get a summary, action items and deadlines for this conversation.</p>
        <Button size="sm" variant="ai" icon={<Icon icon={Sparkles} size="sm" />} onClick={onRequest}>Summarize</Button>
      </div>
    );
  } else if (insights.isLoading || (insights.isFetching && !insights.data)) {
    heading = title;
    busy = true;
    body = (
      <div className="space-y-2" role="status" aria-live="polite" aria-busy="true">
        <span className="sr-only">Loading…</span>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-11/12" />
        <Skeleton className="h-3 w-3/5" />
      </div>
    );
  } else if (insights.isError) {
    const e = insights.error;
    if (e instanceof ApiError && e.code === "ai_excluded") {
      body = <p className="flex items-center gap-2 text-fg-3"><Icon icon={ShieldOff} />This conversation is excluded from AI by your privacy settings.</p>;
    } else {
      heading = title;
      body = (
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-fg-3"><Icon icon={TriangleAlert} className="text-warning" />{errorMessage(e)}</p>
          <Button size="sm" variant="ghost" onClick={() => void insights.refetch()}>Retry</Button>
        </div>
      );
    }
  } else if (!insights.data) {
    return null;
  } else {
    const d = insights.data;
    heading = title;
    const hasMore = d.keyPoints.length > 0 || d.actionItems.length > 0 || d.deadlines.length > 0;
    body = (
      <>
        <p className="max-w-[70ch] text-fg-2">{d.summary}</p>
        <ThreadDigest d={d} />
        {hasMore && expanded && (
          <div className="animate-reveal mt-3 grid gap-3 sm:grid-cols-2">
            {d.actionItems.length > 0 && (
              <div>
                <p className="mb-1 text-[11.5px] font-medium uppercase tracking-wide text-ai-title">Action items</p>
                <ul className="space-y-1">
                  {d.actionItems.map((a, i) => (
                    <li key={i} className="flex gap-2 text-fg-2"><Icon icon={CheckCircle2} size="sm" className="mt-0.5 shrink-0 text-accent-ink" /><span>{a.task}{a.due ? <span className="text-fg-3"> · {a.due}</span> : null}</span></li>
                  ))}
                </ul>
              </div>
            )}
            {d.deadlines.length > 0 && (
              <div>
                <p className="mb-1 text-[11.5px] font-medium uppercase tracking-wide text-ai-title">Deadlines</p>
                <ul className="space-y-1">
                  {d.deadlines.map((a, i) => (
                    <li key={i} className="flex gap-2 text-fg-2"><Icon icon={CalendarClock} size="sm" className="mt-0.5 shrink-0 text-accent-ink" /><span>{a.what} — <span className="text-fg">{a.when}</span></span></li>
                  ))}
                </ul>
              </div>
            )}
            {d.keyPoints.length > 0 && (
              <div className="sm:col-span-2">
                <p className="mb-1 text-[11.5px] font-medium uppercase tracking-wide text-ai-title">Key points</p>
                <ul className="list-disc space-y-0.5 pl-5 text-fg-2">{d.keyPoints.map((k, i) => <li key={i}>{k}</li>)}</ul>
              </div>
            )}
          </div>
        )}
        {hasMore && (
          <button type="button" onClick={() => setExpanded((v) => !v)} className="mt-2 text-[12px] font-medium text-ai-title hover:underline" aria-expanded={expanded}>
            {expanded ? "Show less" : `Show action items & deadlines (${d.actionItems.length + d.deadlines.length})`}
          </button>
        )}
        <p className="mt-2 text-[11px] text-fg-3">AI-generated from this conversation. Check important details.</p>
      </>
    );
  }
  return (
    <Block title={heading} busy={busy}>{body}</Block>
  );
}

function Block({ title, children, busy }: { title: string; children: React.ReactNode; busy?: boolean }) {
  return (
    <section aria-label="AI summary" aria-busy={busy} className="ai-block rounded-2xl px-4 py-3.5 text-[13.5px] leading-relaxed animate-in">
      <h2 className="mb-1.5 flex items-center gap-2 text-[13px] font-semibold text-ai-title">
        <Icon icon={Sparkles} size="sm" />
        {title}
      </h2>
      {children}
    </section>
  );
}

/** "Who wants what, what's decided" for long threads. Shown open: it's the point of summarising a long thread. */
function ThreadDigest({ d }: { d: Insights }) {
  const asks = d.asks ?? [];
  const decisions = d.decisions ?? [];
  const open = d.openQuestions ?? [];
  if (!asks.length && !decisions.length && !open.length) return null;
  return (
    <div className="mt-3 grid gap-3 border-t border-[var(--ai-border)] pt-3 sm:grid-cols-2" data-testid="thread-digest">
      {asks.length > 0 && (
        <div className="sm:col-span-2">
          <p className="mb-1 text-[11.5px] font-medium uppercase tracking-wide text-ai-title">Who wants what</p>
          <ul className="space-y-1">
            {asks.map((a, i) => (
              <li key={i} className="flex gap-2 text-fg-2"><Icon icon={UserRound} size="sm" className="mt-0.5 shrink-0 text-accent-ink" /><span><span className="font-medium text-fg">{a.who}</span> — {a.wants}</span></li>
            ))}
          </ul>
        </div>
      )}
      {decisions.length > 0 && (
        <div>
          <p className="mb-1 text-[11.5px] font-medium uppercase tracking-wide text-ai-title">Decided</p>
          <ul className="space-y-1">
            {decisions.map((x, i) => <li key={i} className="flex gap-2 text-fg-2"><Icon icon={Gavel} size="sm" className="mt-0.5 shrink-0 text-success" /><span>{x}</span></li>)}
          </ul>
        </div>
      )}
      {open.length > 0 && (
        <div>
          <p className="mb-1 text-[11.5px] font-medium uppercase tracking-wide text-ai-title">Still open</p>
          <ul className="space-y-1">
            {open.map((x, i) => <li key={i} className="flex gap-2 text-fg-2"><Icon icon={CircleHelp} size="sm" className="mt-0.5 shrink-0 text-warning" /><span>{x}</span></li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

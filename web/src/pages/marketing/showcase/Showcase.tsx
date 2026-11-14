import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import { scrollBehavior, usePrefersReducedMotion } from "@/lib/motion";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { SAMPLE_THREADS, threadById } from "../demos/fixtures";
import ProductFrame, { IllustrationNote, PersonMark } from "../demos/ProductFrame";

const STEPS = [
  {
    id: "inbox",
    kicker: "01 — Inbox",
    title: "A calm inbox",
    body: "Connected accounts sit in one list, with unread mail easy to spot. In the app, j and k move the selection.",
  },
  {
    id: "thread",
    kicker: "02 — Thread",
    title: "Open the thread",
    body: "Opening a conversation fetches the message live. MailIQ does not store the message body in its database.",
  },
  {
    id: "summary",
    kicker: "03 — Summary",
    title: "Read the summary",
    body: "Key points, action items and deadlines sit with the thread. You still check the important details.",
  },
  {
    id: "replies",
    kicker: "04 — Reply",
    title: "Preview a reply",
    body: "A suggestion fills a draft. You review before sending. Nothing is sent until you confirm.",
  },
] as const;

type StepId = (typeof STEPS)[number]["id"];

function isStepId(value: string | null): value is StepId {
  return value === "inbox" || value === "thread" || value === "summary" || value === "replies";
}

export default function Showcase() {
  const reduced = usePrefersReducedMotion();
  const desktop = useMediaQuery("(min-width: 1024px)");
  const scrollMode = desktop && !reduced;
  const [active, setActive] = useState<StepId>("inbox");
  const stepNodes = useRef(new Map<StepId, HTMLElement>());

  useEffect(() => {
    if (!scrollMode) return;
    if (typeof IntersectionObserver === "undefined") return;
    const nodes = [...stepNodes.current.values()];
    if (nodes.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        const top = visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!top) return;
        const id = top.target.getAttribute("data-step");
        if (isStepId(id)) setActive(id);
      },
      { threshold: [0.45, 0.7], rootMargin: "-10% 0px -20% 0px" },
    );
    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, [scrollMode]);

  const showStep = (id: StepId) => {
    setActive(id);
    if (!scrollMode) return;
    const node = stepNodes.current.get(id);
    if (typeof node?.scrollIntoView === "function") {
      node.scrollIntoView({ behavior: scrollBehavior(), block: "center" });
    }
  };

  return (
    <section
      id="product"
      data-showcase-mode={scrollMode ? "scroll" : "steps"}
      data-active-step={active}
      data-reduced-motion={reduced ? "true" : "false"}
      className="mk-section mk-reveal is-visible relative mx-auto w-full max-w-6xl px-5 py-16 sm:py-24"
    >
      <header className="mx-auto max-w-2xl">
        <p className="mk-eyebrow text-[11px] font-semibold uppercase tracking-[0.16em] text-ai-title">Product</p>
        <h2 className="mk-title mt-3 text-balance text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
          From the inbox to a reply you still approve
        </h2>
        <p className="mk-lede mt-4 text-pretty text-[16px] leading-relaxed text-fg-2">
          Four steps through one sample conversation. On a large screen the frame follows the page. On a smaller screen, or
          when motion is reduced, pick a step.
        </p>
      </header>
      <p className="sr-only" aria-live="polite">
        {STEPS.find((step) => step.id === active)?.title}
      </p>

      {scrollMode ? (
        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
          <ol className="min-w-0">
            {STEPS.map((step) => (
              <li
                key={step.id}
                id={`showcase-step-${step.id}`}
                data-step={step.id}
                ref={(node) => {
                  if (node) stepNodes.current.set(step.id, node);
                  else stepNodes.current.delete(step.id);
                }}
                className={cn(
                  "flex min-h-[68vh] flex-col justify-center border-l-2 py-10 pl-5",
                  active === step.id ? "border-l-accent" : "border-l-line",
                )}
              >
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ai-title">{step.kicker}</p>
                <h3 className="mt-2 text-balance text-[1.65rem] font-semibold tracking-tight text-fg">{step.title}</h3>
                <p className="mt-3 max-w-md text-pretty text-[15px] leading-relaxed text-fg-2">{step.body}</p>
              </li>
            ))}
          </ol>
          <div className="min-w-0 lg:sticky lg:top-16">
            <Stage step={active} reduced={reduced} />
            <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Product steps">
              {STEPS.map((step, index) => (
                <button
                  key={step.id}
                  type="button"
                  aria-pressed={active === step.id}
                  aria-label={`Show ${step.title}`}
                  onClick={() => showStep(step.id)}
                  className={cn(
                    "inline-flex h-11 items-center rounded-full border px-3 text-[13px] font-medium",
                    "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]",
                    active === step.id
                      ? "border-accent bg-accent text-accent-fg"
                      : "border-line bg-surface-2 text-fg-2 hover:border-line-strong hover:text-fg",
                  )}
                >
                  {String(index + 1).padStart(2, "0")} {step.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-10 min-w-0">
          <Stage step={active} reduced={reduced} />
          <ol className="mt-4 space-y-3">
            {STEPS.map((step) => {
              const pressed = active === step.id;
              return (
                <li key={step.id}>
                  <button
                    type="button"
                    aria-pressed={pressed}
                    onClick={() => showStep(step.id)}
                    className={cn(
                      "w-full min-h-11 rounded-[var(--radius-lg)] border px-4 py-3 text-left",
                      "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]",
                      pressed ? "border-[var(--ai-border)] bg-accent-soft" : "border-line bg-surface hover:bg-surface-2",
                    )}
                  >
                    <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ai-title">{step.kicker}</span>
                    <span className="mt-1 block text-[15px] font-semibold text-fg">{step.title}</span>
                    <span className="mt-1 block text-pretty text-[13.5px] leading-relaxed text-fg-2">{step.body}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      )}
      <IllustrationNote className="mt-6" />
    </section>
  );
}

function Stage({ step, reduced }: { step: StepId; reduced: boolean }) {
  const thread = threadById("launch");
  const rows = SAMPLE_THREADS.slice(0, 4);
  const showReader = step !== "inbox";
  const showSummary = step === "summary" || step === "replies";
  const showReplies = step === "replies";
  const index = STEPS.findIndex((item) => item.id === step);
  const lead = thread.body[0];
  const deadline = thread.deadlines[0];
  const action = thread.actionItems[0];
  const preview = thread.replies[0];

  return (
    <ProductFrame caption={`Step ${index + 1} of ${STEPS.length}`}>
      <div
        data-stage={step}
        className="grid grid-cols-1 sm:min-h-[320px] sm:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)]"
      >
        <div className="min-w-0 border-b border-line sm:border-b-0 sm:border-r">
          <p className="px-3 pt-3 text-[12px] font-medium text-fg-2">Primary</p>
          <ul aria-label="Sample conversations" className="py-1">
            {rows.map((row) => {
              const selected = showReader && row.id === thread.id;
              return (
                <li key={row.id} className={cn("flex min-w-0 items-center gap-2.5 px-3 py-2", selected && "bg-accent-soft")}>
                  <PersonMark name={row.from.name} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium text-fg">{row.from.name}</span>
                    <span className="block truncate text-[12.5px] text-fg-2">{row.subject}</span>
                  </span>
                  {row.unread && !selected ? <span className="size-2 shrink-0 rounded-full bg-accent" /> : null}
                </li>
              );
            })}
          </ul>
        </div>
        <div key={step} className={cn("min-w-0 p-4", !reduced && "animate-fade-in")}>
          {!showReader ? (
            <div className="flex min-h-36 flex-col justify-center">
              <p className="text-[15px] font-medium text-fg">Choose a conversation</p>
              <p className="mt-1 max-w-xs text-pretty text-[13px] leading-relaxed text-fg-2">Open a message to read it here.</p>
            </div>
          ) : (
            <>
              <p className="truncate text-[12.5px] text-fg-2">
                {thread.from.name} · {thread.from.email}
              </p>
              <h3 className="mt-1 text-pretty text-[16px] font-semibold tracking-tight text-fg">{thread.subject}</h3>
              {lead ? <p className="mt-2 text-pretty text-[13px] leading-relaxed text-fg-2">{lead}</p> : null}
              {showSummary ? (
                <section aria-label="AI summary" className="ai-block mt-3 rounded-[var(--radius-lg)] px-3 py-2.5">
                  <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ai-title">
                    <Icon icon={Sparkles} size="sm" />
                    AI summary
                  </p>
                  <p className="mt-1.5 text-pretty text-[13px] leading-relaxed text-fg-2">{thread.summary}</p>
                  {action ? <p className="mt-2 text-[12.5px] text-fg-2">Action: {action.task}</p> : null}
                  {deadline ? (
                    <p className="text-[12.5px] text-fg-2">
                      Deadline: {deadline.what} — {deadline.when}
                    </p>
                  ) : null}
                </section>
              ) : null}
              {showReplies ? (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-2">
                    {thread.replies.map((reply) => (
                      <span
                        key={reply.id}
                        className="inline-flex min-h-8 items-center rounded-full border border-line bg-surface-2 px-3 text-[12.5px] text-fg-2"
                      >
                        {reply.label}
                      </span>
                    ))}
                  </div>
                  {preview ? (
                    <p className="mt-3 rounded-[var(--radius-md)] border border-line bg-surface-2 px-3 py-2 text-[13px] leading-relaxed text-fg">
                      {preview.draft}
                    </p>
                  ) : null}
                  <p className="mt-2 text-[13.5px] font-medium text-fg">You review before sending</p>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </ProductFrame>
  );
}

import { useEffect, useId, useRef, useState, type ReactNode, type Ref } from "react";
import { CheckCircle2, type LucideIcon } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/misc";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/motion";

export function useReveal<T extends HTMLElement>(): { ref: Ref<T>; className: string } {
  const ref = useRef<T>(null);
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(() => reduced || typeof IntersectionObserver === "undefined");

  useEffect(() => {
    const node = ref.current;
    if (!node || reduced || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -4% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced]);

  return { ref, className: visible ? "mk-reveal is-visible" : "mk-reveal" };
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
  titleId,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  titleId: string;
}) {
  return (
    <>
      <p className="mk-eyebrow">{eyebrow}</p>
      <h2 id={titleId} className="mk-title">{title}</h2>
      {lede ? <p className="mk-lede">{lede}</p> : null}
    </>
  );
}

export function Section({
  id,
  eyebrow,
  title,
  lede,
  children,
  className,
  glow = false,
  center = false,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  lede?: string;
  children?: ReactNode;
  className?: string;
  glow?: boolean;
  center?: boolean;
}) {
  const titleId = useId();
  const reveal = useReveal<HTMLDivElement>();
  return (
    <section id={id} className={cn("mk-section", glow && "mk-glow", className)} aria-labelledby={titleId}>
      <div ref={reveal.ref} className={cn(reveal.className, center && "mk-center")}>
        <SectionHeading eyebrow={eyebrow} title={title} lede={lede} titleId={titleId} />
        {children}
      </div>
    </section>
  );
}

export function CardGrid({
  items,
  className,
}: {
  items: readonly { title: string; text: string; icon: LucideIcon }[];
  className?: string;
}) {
  return (
    <ul className={cn("mk-grid is-cards", className)}>
      {items.map((item) => (
        <li key={item.title} className="mk-card">
          <span className="mk-icon"><Icon icon={item.icon} size="lg" /></span>
          <h3 className="mk-card-title">{item.title}</h3>
          <p className="mk-card-text">{item.text}</p>
        </li>
      ))}
    </ul>
  );
}

export function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mk-bullets">
      {items.map((item) => (
        <li key={item}>
          <Icon icon={CheckCircle2} size="sm" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export type StageKind = "summary" | "brief" | "inbox" | "search" | "plan";

export function VisualSlot({ demo, stage }: { demo?: ReactNode; stage: StageKind }) {
  if (demo) return <div className="mk-slot">{demo}</div>;
  return (
    <div className="mk-slot">
      <div className="mk-frame">
        <div className="mk-frame-body">
          <Stage kind={stage} />
        </div>
      </div>
    </div>
  );
}

function Stage({ kind }: { kind: StageKind }) {
  return (
    <div className="mk-stage" aria-hidden="true">
      <Badge tone="muted">Illustration</Badge>
      {kind === "summary" ? <SummaryStage /> : null}
      {kind === "brief" ? <BriefStage /> : null}
      {kind === "inbox" ? <InboxStage /> : null}
      {kind === "search" ? <SearchStage /> : null}
      {kind === "plan" ? <PlanStage /> : null}
    </div>
  );
}

function SummaryStage() {
  return (
    <>
      <div className="mk-stage-block">
        <span className="mk-stage-label">Summary</span>
        <span className="mk-stage-line" />
        <span className="mk-stage-line is-short" />
      </div>
      <div className="mk-stage-row"><span className="mk-stage-swatch" /><span>Key point</span></div>
      <div className="mk-stage-row"><span className="mk-stage-swatch" /><span>Action</span></div>
      <div className="mk-stage-row"><span className="mk-stage-swatch" /><span>Deadline</span></div>
    </>
  );
}

function BriefStage() {
  return (
    <>
      <div className="mk-stage-block">
        <span className="mk-stage-label">Daily brief</span>
        <span className="mk-stage-line" />
      </div>
      <div className="mk-stage-row"><span className="mk-stage-swatch" /><span>Needs a reply</span></div>
      <div className="mk-stage-row"><span className="mk-stage-swatch" /><span>Safe to archive</span></div>
    </>
  );
}

function InboxStage() {
  return (
    <>
      <div className="mk-stage-row"><span className="mk-stage-swatch" /><span className="mk-stage-line" /><span className="mk-stage-line is-short" /></div>
      <div className="mk-stage-row"><span className="mk-stage-swatch" /><span className="mk-stage-line" /><span className="mk-stage-line is-short" /></div>
      <div className="mk-stage-row"><span className="mk-stage-swatch" /><span className="mk-stage-line" /><span className="mk-stage-line is-short" /></div>
      <div className="mk-stage-row"><span className="mk-stage-swatch" /><span className="mk-stage-line" /><span className="mk-stage-line is-short" /></div>
    </>
  );
}

function SearchStage() {
  return (
    <>
      <div className="mk-stage-pill"><span className="mk-stage-swatch" /><span>Your words</span></div>
      <div className="mk-stage-query">Visible query</div>
    </>
  );
}

function PlanStage() {
  return (
    <>
      <div className="mk-stage-block">
        <span className="mk-stage-label">Plan</span>
        <span className="mk-stage-line" />
        <span className="mk-stage-line is-short" />
      </div>
      <div className="mk-stage-row"><span className="mk-stage-swatch" /><span>You confirm</span></div>
      <div className="mk-stage-row"><span className="mk-stage-swatch" /><span>Trash and send confirm again</span></div>
    </>
  );
}

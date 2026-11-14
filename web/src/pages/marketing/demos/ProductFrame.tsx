import { forwardRef, type CSSProperties, type PointerEventHandler, type ReactNode } from "react";
import { Logo } from "@/components/ui/misc";
import { cn } from "@/lib/cn";
import { ILLUSTRATION_NOTE } from "./fixtures";

export type ProductFrameProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Present only when the frame participates in pointer tilt. */
  tilt?: "on" | "off";
  caption?: string;
  onPointerMove?: PointerEventHandler<HTMLDivElement>;
  onPointerLeave?: PointerEventHandler<HTMLDivElement>;
};

const ProductFrame = forwardRef<HTMLDivElement, ProductFrameProps>(function ProductFrame(
  { children, className, style, tilt, caption = "Sample data", onPointerMove, onPointerLeave },
  ref,
) {
  return (
    <div
      ref={ref}
      data-tilt={tilt}
      style={style}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn(
        "mk-frame mk-glass surface-glass relative overflow-hidden rounded-[var(--radius-xl)] border border-line-strong shadow-[var(--shadow-lg)]",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]"
      />
      <div className="relative flex h-11 items-center gap-2 border-b border-line px-3.5">
        <span aria-hidden className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </span>
        <Logo className="ml-1.5" />
        <span className="ml-auto truncate text-[12px] text-fg-2">{caption}</span>
      </div>
      <div className="relative min-w-0 bg-bg">{children}</div>
    </div>
  );
});

export default ProductFrame;

export function PersonMark({ name }: { name: string }) {
  const letters = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
  return (
    <span
      aria-hidden
      className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[11px] font-semibold text-accent-ink"
    >
      {letters}
    </span>
  );
}

export function IllustrationNote({ className }: { className?: string }) {
  return <p className={cn("text-[12.5px] leading-relaxed text-fg-2", className)}>{ILLUSTRATION_NOTE}</p>;
}

export function DemoShell({
  label,
  title,
  lede,
  reduced,
  children,
}: {
  label: string;
  title: string;
  lede: string;
  reduced: boolean;
  children: ReactNode;
}) {
  return (
    <section data-reduced-motion={reduced ? "true" : "false"} aria-label={label} className="mx-auto w-full min-w-0 max-w-3xl">
      <div className="mb-4">
        <p className="mk-eyebrow text-[11px] font-semibold uppercase tracking-[0.16em] text-ai-title">Illustration</p>
        <h3 className="mk-title mt-1 text-balance text-[1.35rem] font-semibold tracking-tight text-fg">{title}</h3>
        <p className="mk-lede mt-1.5 max-w-2xl text-pretty text-[14.5px] leading-relaxed text-fg-2">{lede}</p>
      </div>
      {children}
      <IllustrationNote className="mt-3" />
    </section>
  );
}

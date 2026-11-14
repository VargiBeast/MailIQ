import * as T from "@radix-ui/react-tooltip";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Compact tooltip for icon-only controls.
 * Opens on hover and keyboard focus. A long-press reveals it on touch without
 * taking the tap away from the button (Radix ignores touch hover).
 * Requires Tooltip.Provider (already mounted in main.tsx).
 */
export function Tooltip({
  content,
  children,
  side = "bottom",
  delayDuration,
}: {
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  delayDuration?: number;
}) {
  const [open, setOpen] = useState(false);
  const hold = useRef(0);
  const held = useRef(false);
  useEffect(() => () => window.clearTimeout(hold.current), []);
  if (content == null || content === "") return <>{children}</>;
  return (
    <T.Root open={open} onOpenChange={setOpen} delayDuration={delayDuration}>
      <T.Trigger
        asChild
        onPointerDown={(e) => {
          if (e.pointerType !== "touch") return;
          held.current = false;
          window.clearTimeout(hold.current);
          hold.current = window.setTimeout(() => {
            held.current = true;
            setOpen(true);
          }, 450);
        }}
        onPointerUp={() => window.clearTimeout(hold.current)}
        onPointerCancel={() => window.clearTimeout(hold.current)}
        onClick={(e) => {
          // Radix closes a tooltip on click. Keep the long-press label up;
          // the button's own click handler has already run.
          if (held.current) {
            e.preventDefault();
            held.current = false;
          }
        }}
      >
        {children}
      </T.Trigger>
      <T.Portal>
        <T.Content
          side={side}
          sideOffset={6}
          className={cn(
            "z-[60] max-w-xs rounded-[var(--radius-sm)] border border-line-strong bg-surface px-2.5 py-1.5",
            "origin-[var(--radix-tooltip-content-transform-origin)] text-[12px] leading-snug text-fg shadow-[var(--shadow-md)]",
            "data-[state=delayed-open]:animate-scale-in data-[state=instant-open]:animate-scale-in data-[state=closed]:animate-scale-out",
          )}
        >
          {content}
          <T.Arrow className="fill-surface" width={10} height={5} />
        </T.Content>
      </T.Portal>
    </T.Root>
  );
}

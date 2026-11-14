import * as DM from "@radix-ui/react-dropdown-menu";
import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

/** md icon token (16px) and the default stroke, applied on the glyph rather than a parent size override. */
function menuIcon(icon: ReactNode) {
  if (!isValidElement(icon)) return icon;
  const el = icon as ReactElement<{ className?: string; strokeWidth?: number; "aria-hidden"?: boolean }>;
  return cloneElement(el, {
    className: cn("size-4", el.props.className),
    strokeWidth: el.props.strokeWidth ?? 1.75,
    "aria-hidden": el.props["aria-hidden"] ?? true,
  });
}

export const Menu = DM.Root;
export const MenuTrigger = DM.Trigger;

export function MenuContent({
  children,
  align = "end",
  className,
}: {
  children: ReactNode;
  align?: "start" | "end" | "center";
  className?: string;
}) {
  return (
    <DM.Portal>
      <DM.Content
        align={align}
        sideOffset={6}
        className={cn(
          "z-50 min-w-[200px] rounded-[var(--radius-lg)] border border-line-strong bg-surface p-1",
          "shadow-[var(--shadow-md)] animate-scale-in",
          className,
        )}
      >
        {children}
      </DM.Content>
    </DM.Portal>
  );
}

export function MenuItem({
  children,
  onSelect,
  icon,
  danger,
  disabled,
}: {
  children: ReactNode;
  onSelect: () => void;
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <DM.Item
      disabled={disabled}
      onSelect={onSelect}
      className={cn(
        "flex cursor-default items-center gap-2.5 rounded-[var(--radius-sm)] px-2.5 py-2 text-[13px] outline-none",
        "transition-colors duration-[var(--duration-fast)]",
        "data-[highlighted]:bg-surface-2 data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
        danger ? "text-danger data-[highlighted]:bg-danger/10" : "text-fg-2 data-[highlighted]:text-fg",
      )}
    >
      {icon && <span className="inline-flex shrink-0 text-fg-3">{menuIcon(icon)}</span>}
      {children}
    </DM.Item>
  );
}

export function MenuCheckbox({
  children,
  checked,
  onCheckedChange,
}: {
  children: ReactNode;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <DM.CheckboxItem
      checked={checked}
      onCheckedChange={onCheckedChange}
      onSelect={(e) => e.preventDefault()}
      className={cn(
        "flex cursor-default items-center gap-2.5 rounded-[var(--radius-sm)] px-2.5 py-2 text-[13px] text-fg-2 outline-none",
        "transition-colors duration-[var(--duration-fast)]",
        "data-[highlighted]:bg-surface-2 data-[highlighted]:text-fg",
      )}
    >
      <span
        className={cn(
          "flex size-4 items-center justify-center rounded border",
          checked ? "border-accent bg-accent text-white" : "border-line-strong bg-surface-2",
        )}
        aria-hidden
      >
        {checked && <Check className="size-3" strokeWidth={2.25} aria-hidden />}
      </span>
      {children}
    </DM.CheckboxItem>
  );
}

export function MenuLabel({ children }: { children: ReactNode }) {
  return (
    <DM.Label className="px-2.5 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wide text-fg-3">
      {children}
    </DM.Label>
  );
}

export function MenuSeparator() {
  return <DM.Separator className="my-1 h-px bg-line" />;
}

import { forwardRef } from "react";
import type { LucideIcon, LucideProps } from "lucide-react";

/** Standard icon box. Call sites still use ad-hoc sizes; migrate onto these. */
export const ICON_SIZE = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
} as const;

export type IconSize = keyof typeof ICON_SIZE;

/**
 * One resting stroke (Lucide's default, and the common value in the app)
 * and a heavier stroke for the selected state.
 */
export const ICON_STROKE = {
  default: 2,
  active: 2.25,
} as const;

export interface IconProps extends Omit<LucideProps, "size" | "strokeWidth" | "aria-hidden" | "aria-label" | "role"> {
  icon: LucideIcon;
  size?: IconSize;
  /** Heavier stroke for a selected or pressed icon. */
  active?: boolean;
  /** Accessible name. Without it the icon is decorative. */
  label?: string;
}

export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  { icon: Glyph, size = "md", active = false, label, ...rest },
  ref,
) {
  const labelled = typeof label === "string" && label.length > 0;
  return (
    <Glyph
      ref={ref}
      {...rest}
      size={ICON_SIZE[size]}
      strokeWidth={active ? ICON_STROKE.active : ICON_STROKE.default}
      {...(labelled ? { role: "img" as const, "aria-label": label } : { "aria-hidden": true as const })}
    />
  );
});

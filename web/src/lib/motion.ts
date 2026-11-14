import { useEffect, useState } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function systemReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/**
 * True when the OS asks for reduced motion.
 * JS-driven motion (swipe snap, composer close) checks this; CSS animations
 * are already collapsed by the global prefers-reduced-motion rule.
 * Foundation may also export scrollBehavior from this module — keep that helper if it lands.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(systemReducedMotion);
  useEffect(() => {
    const mq = window.matchMedia(REDUCED_MOTION_QUERY);
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/** Tooltip open delay. Mirrors --delay-tooltip in styles/index.css. */
export const TOOLTIP_DELAY_MS = 400;

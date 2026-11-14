import { useRef } from "react";

/**
 * Remember the control that was focused when `open` became true, and put focus
 * back there when a Radix dialog closes.
 *
 * Radix only restores focus to Dialog.Trigger. These overlays are controlled
 * and have no trigger, and the built-in close handler cancels the default
 * restore, so Escape would otherwise leave focus on the document body.
 */
export function useOverlayReturnFocus(open: boolean) {
  const returnTo = useRef<HTMLElement | null>(null);
  const wasOpen = useRef(false);
  if (typeof document !== "undefined" && open && !wasOpen.current) {
    const previous = document.activeElement;
    returnTo.current =
      previous instanceof HTMLElement && previous !== document.body && previous !== document.documentElement
        ? previous
        : null;
  }
  wasOpen.current = open;

  return (event: Event) => {
    event.preventDefault();
    const back = returnTo.current;
    returnTo.current = null;
    if (!back?.isConnected) return;
    const focus = () => {
      if (back.isConnected) back.focus();
    };
    // The dialog may still be hiding the rest of the page when this runs.
    focus();
    if (document.activeElement !== back) requestAnimationFrame(focus);
  };
}

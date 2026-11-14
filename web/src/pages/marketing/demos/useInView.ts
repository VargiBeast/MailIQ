import { useEffect, useRef, useState } from "react";

/**
 * True once `ref` is within the observer root.
 * If IntersectionObserver is missing, the node is treated as in view so content still appears.
 */
export default function useInView<T extends Element = HTMLDivElement>({
  rootMargin = "0px",
  threshold = 0,
  once = false,
}: {
  rootMargin?: string;
  threshold?: number;
  once?: boolean;
} = {}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    let cancelled = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (cancelled) return;
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold },
    );
    observer.observe(element);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [once, rootMargin, threshold]);

  return { ref, inView };
}

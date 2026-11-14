import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import type { MessageDetail, ThreadDetail } from "@shared/mail";

export type ComposeRequest =
  | { mode: "new"; accountId?: string; to?: string; subject?: string; bodyText?: string; aiGenerated?: boolean; voice?: boolean }
  | { mode: "reply" | "replyAll" | "forward"; thread: ThreadDetail; message: MessageDetail; bodyText?: string; aiGenerated?: boolean; voice?: boolean }
  | { mode: "draft"; accountId: string; draftId: string };

interface ComposerState {
  requests: Array<ComposeRequest & { key: number }>;
  open: (r: ComposeRequest) => void;
  close: (key: number) => void;
  /** Control that opened the composer. It may unmount while the composer is up (mobile nav). */
  returnFocus: RefObject<HTMLElement | null>;
}

const Ctx = createContext<ComposerState | null>(null);

export function ComposerProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<Array<ComposeRequest & { key: number }>>([]);
  const returnFocus = useRef<HTMLElement | null>(null);
  // Only one composer at a time keeps the UI calm; opening another replaces it after its own unsaved-check.
  const open = useCallback((r: ComposeRequest) => {
    const previous = document.activeElement;
    returnFocus.current = previous instanceof HTMLElement && previous !== document.body ? previous : null;
    setRequests([{ ...r, key: Date.now() }]);
  }, []);
  const close = useCallback((key: number) => setRequests((rs) => rs.filter((r) => r.key !== key)), []);
  const value = useMemo(() => ({ requests, open, close, returnFocus }), [requests, open, close]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useComposer() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useComposer outside provider");
  return v;
}

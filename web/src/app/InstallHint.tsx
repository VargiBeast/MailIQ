import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/motion";

/** Soft prompt to install MailIQ as a PWA on supported browsers. */
export function InstallHint() {
  const reducedMotion = usePrefersReducedMotion();
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(() => localStorage.getItem("mailiq-install-dismissed") === "1");
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    if (!closing) return;
    const timer = window.setTimeout(() => setDismissed(true), 480);
    return () => window.clearTimeout(timer);
  }, [closing]);

  if (dismissed || !deferred) return null;

  const dismiss = () => {
    localStorage.setItem("mailiq-install-dismissed", "1");
    if (reducedMotion) setDismissed(true);
    else setClosing(true);
  };

  return (
    <div
      className={cn(
        "fixed bottom-4 left-4 right-4 z-40 mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-line bg-surface p-3 shadow-lg sm:left-auto",
        closing ? "pointer-events-none animate-out" : "animate-in",
      )}
      onAnimationEnd={(e) => {
        if (!closing || e.target !== e.currentTarget || e.animationName !== "fade-out") return;
        setDismissed(true);
      }}
    >
      <div className="min-w-0 flex-1 text-[13px]">
        <p className="font-medium text-fg">Install MailIQ</p>
        <p className="text-fg-3">Add to your home screen for a faster, app-like experience.</p>
      </div>
      <button
        type="button"
        className="shrink-0 rounded-lg bg-accent px-3 py-1.5 text-[12.5px] font-medium text-accent-fg"
        onClick={async () => {
          await deferred.prompt();
          setDeferred(null);
        }}
      >
        Install
      </button>
      <button
        type="button"
        aria-label="Dismiss"
        className="shrink-0 rounded-md p-1 text-fg-3 transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:bg-surface-2"
        onClick={dismiss}
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

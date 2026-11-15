import type { ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { useSession } from "@/lib/session";
import { cn } from "@/lib/cn";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={cn("size-5", className)} aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.3 26.7 36 24 36c-5.2 0-9.6-3.3-11.2-7.9l-6.5 5C9.5 39.1 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.5 5.5-6.5 6.9l6.2 5.2C38.9 36.7 44 31.1 44 24c0-1.3-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}

function MicrosoftIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 21 21" className={cn("size-5", className)} aria-hidden>
      <path fill="#f25022" d="M1 1h9v9H1z" />
      <path fill="#00a4ef" d="M1 11h9v9H1z" />
      <path fill="#7fba00" d="M11 1h9v9h-9z" />
      <path fill="#ffb900" d="M11 11h9v9h-9z" />
    </svg>
  );
}

function nextQuery(next: string | null): string {
  return next && next.startsWith("/app") ? `?next=${encodeURIComponent(next)}` : "";
}

export type SignInLinkProps = {
  /** Visual size: primary for hero/CTA, compact for the nav. */
  variant?: "primary" | "compact";
  className?: string;
};

/**
 * Sign-in controls for marketing pages.
 * Google: GET /api/auth/google/start
 * Microsoft (when configured): GET /api/auth/microsoft/start
 * `next` is appended only when it starts with `/app`.
 */
export default function SignInLink({ variant = "primary", className }: SignInLinkProps): ReactNode {
  const { config } = useSession();
  const [params] = useSearchParams();
  const next = params.get("next");
  const googleReady = config?.google !== false;
  const microsoftReady = Boolean(config?.microsoft);
  const googleHref = `/api/auth/google/start${nextQuery(next)}`;
  const microsoftHref = `/api/auth/microsoft/start${nextQuery(next)}`;

  if (variant === "compact") {
    if (!googleReady && !microsoftReady) {
      return (
        <span
          aria-disabled="true"
          className={cn(
            "inline-flex min-h-11 cursor-not-allowed items-center justify-center rounded-[var(--radius-md)] border border-line px-3.5 text-[13.5px] font-medium text-fg-3",
            className,
          )}
        >
          Sign in
        </span>
      );
    }
    return (
      <a
        href={googleReady ? googleHref : microsoftHref}
        className={cn(
          "inline-flex min-h-11 items-center justify-center rounded-[var(--radius-md)] border border-line-strong px-3.5 text-[13.5px] font-medium text-fg transition hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          className,
        )}
      >
        Sign in
      </a>
    );
  }

  return (
    <div className={cn("flex w-full max-w-sm flex-col items-stretch gap-3", className)}>
      {googleReady ? (
        <a
          href={googleHref}
          className="inline-flex min-h-12 items-center justify-center gap-3 rounded-[var(--radius-lg)] bg-white px-6 text-[15px] font-medium text-[#1f1f1f] shadow-[0_10px_40px_-12px_rgba(139,92,246,0.7)] transition hover:bg-[#f2f2f2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <GoogleIcon />
          Sign in with Google
        </a>
      ) : (
        <span
          aria-disabled="true"
          className="inline-flex min-h-12 cursor-not-allowed items-center justify-center gap-3 rounded-[var(--radius-lg)] bg-white/60 px-6 text-[15px] font-medium text-[#1f1f1f]/70"
        >
          <GoogleIcon />
          Sign in with Google
        </span>
      )}
      {microsoftReady ? (
        <a
          href={microsoftHref}
          className="inline-flex min-h-12 items-center justify-center gap-3 rounded-[var(--radius-lg)] border border-line-strong bg-surface/80 px-6 text-[15px] font-medium text-fg transition hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <MicrosoftIcon />
          Sign in with Microsoft
        </a>
      ) : null}
    </div>
  );
}

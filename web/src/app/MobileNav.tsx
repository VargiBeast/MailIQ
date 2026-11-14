import { NavLink, useLocation, useMatch, useNavigate, useSearchParams } from "react-router-dom";
import { Inbox, Menu, Pencil, Search, Sparkles, type LucideIcon } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { useComposer } from "./composer/context";
import { useCopilot } from "./copilot/context";
import { SidebarContext } from "./AppLayout";

/**
 * Mobile-only bottom navigation (lg:hidden).
 * Five primary destinations: Inbox, Search, Compose, Copilot, More (folder drawer).
 */
export function MobileNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const composer = useComposer();
  const copilot = useCopilot();
  const inThread = useMatch("/app/:folder/:accountId/:threadId");
  const inSettings = location.pathname.startsWith("/app/settings");
  const inOnboarding = location.pathname.startsWith("/app/onboarding");
  const inAccount = location.pathname.startsWith("/app/account");

  if (inOnboarding || inThread || composer.requests.length > 0 || copilot.isOpen) return null;

  const account = params.get("account");
  const inboxTo = account ? `/app/inbox?account=${encodeURIComponent(account)}` : "/app/inbox";
  const folder = location.pathname.split("/")[2] ?? "inbox";
  const searchBase = ["overview", "settings", "account", "stats", "newsletters", "onboarding"].includes(folder)
    ? "inbox"
    : folder;
  const searchTo = (() => {
    const p = new URLSearchParams();
    if (account) p.set("account", account);
    p.set("focus", "search");
    return `/app/${searchBase}?${p}`;
  })();

  const inboxActive = folder === "inbox" && !params.get("focus") && !inSettings && !inAccount;
  const searchActive = params.get("focus") === "search" || folder === "search";
  const composeActive = composer.requests.length > 0;
  const copilotActive = copilot.isOpen;
  const moreActive = inSettings || inAccount;

  const tab = (active: boolean) =>
    cn(
      "flex min-h-[48px] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 text-[10.5px] font-medium",
      "transition-colors duration-[var(--duration-fast)]",
      "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--accent-ring)]",
      active ? "text-accent-ink" : "text-fg-3 active:text-fg-2",
    );
  const glyph = (icon: LucideIcon, active: boolean) => <Icon icon={icon} size="lg" active={active} />;

  return (
    <nav
      aria-label="Primary"
      data-mobile-nav=""
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface pb-[var(--sab)] lg:hidden",
        "shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.25)]",
      )}
    >
      <div className="mx-auto flex h-14 max-w-lg items-stretch">
        <NavLink to={inboxTo} className={() => tab(inboxActive)} aria-current={inboxActive ? "page" : undefined} end>
          {glyph(Inbox, inboxActive)}
          Inbox
        </NavLink>

        <button
          type="button"
          className={tab(searchActive)}
          onClick={() => navigate(searchTo)}
          aria-label="Search mail"
          aria-current={searchActive ? "page" : undefined}
        >
          {glyph(Search, searchActive)}
          Search
        </button>

        <button
          type="button"
          className={cn(tab(composeActive), "-mt-2 text-accent-ink")}
          onClick={() => composer.open({ mode: "new" })}
          aria-label="Compose"
          aria-current={composeActive ? "page" : undefined}
        >
          <span className={cn("flex size-10 items-center justify-center rounded-full bg-accent text-accent-fg shadow-[0_4px_14px_-4px_var(--accent)]", composeActive && "ring-2 ring-accent-ink ring-offset-2 ring-offset-surface")}>
            {glyph(Pencil, composeActive)}
          </span>
          Compose
        </button>

        <button type="button" className={tab(copilotActive)} onClick={() => copilot.open()} aria-label="Open Copilot" aria-current={copilotActive ? "page" : undefined}>
          {glyph(Sparkles, copilotActive)}
          Copilot
        </button>

        <button
          type="button"
          className={tab(moreActive)}
          onClick={() => SidebarContext.open()}
          aria-label="More navigation"
          aria-current={moreActive ? "page" : undefined}
        >
          {glyph(Menu, moreActive)}
          More
        </button>
      </div>
    </nav>
  );
}

import { useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { Badge, Kbd } from "@/components/ui/misc";
import { cn } from "@/lib/cn";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { usePrefersReducedMotion } from "@/lib/motion";
import { Archive, ArrowDown, CalendarClock, Inbox, Send, Sparkles, Star } from "lucide-react";
import { SAMPLE_THREADS, type SampleThread } from "../demos/fixtures";
import ProductFrame, { IllustrationNote, PersonMark } from "../demos/ProductFrame";

const HERO_THREADS = SAMPLE_THREADS.slice(0, 4);

const FOLDERS = [
  { icon: Inbox, label: "Inbox" },
  { icon: Star, label: "Starred" },
  { icon: Send, label: "Sent" },
  { icon: Archive, label: "Archive" },
] as const;

function clamp(value: number) {
  return Math.max(-0.5, Math.min(0.5, value));
}

export default function Hero({ signIn, notice }: { signIn: ReactNode; notice?: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const coarse = useMediaQuery("(pointer: coarse)");
  const allowTilt = !reduced && !coarse;
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 0, gy: 0 });
  const [selectedId, setSelectedId] = useState(() => HERO_THREADS[0]?.id ?? "");
  const [readIds, setReadIds] = useState<string[]>(() => {
    const read = HERO_THREADS.filter((thread) => !thread.unread).map((thread) => thread.id);
    const first = HERO_THREADS[0];
    if (first && !read.includes(first.id)) read.push(first.id);
    return read;
  });
  const selected = HERO_THREADS.find((thread) => thread.id === selectedId) ?? HERO_THREADS[0];
  const unreadCount = HERO_THREADS.filter((thread) => !readIds.includes(thread.id)).length;

  const select = (id: string) => {
    setSelectedId(id);
    setReadIds((ids) => (ids.includes(id) ? ids : [...ids, id]));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const focus = document.activeElement;
    if (focus !== event.currentTarget && !event.currentTarget.contains(focus)) return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const target = event.target;
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return;
    const key = event.key.toLowerCase();
    const moving = key === "j" || key === "k" || event.key === "ArrowDown" || event.key === "ArrowUp";
    if (!moving) return;
    event.preventDefault();
    const index = HERO_THREADS.findIndex((thread) => thread.id === selectedId);
    const delta = key === "j" || event.key === "ArrowDown" ? 1 : -1;
    const next = HERO_THREADS[Math.max(0, Math.min(HERO_THREADS.length - 1, index + delta))];
    if (next && next.id !== selectedId) select(next.id);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!allowTilt) return;
    const frame = event.currentTarget;
    const rect = frame.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    const px = clamp((event.clientX - rect.left) / rect.width - 0.5);
    const py = clamp((event.clientY - rect.top) / rect.height - 0.5);
    setTilt({
      rx: Number((-py * 4).toFixed(2)),
      ry: Number((px * 5).toFixed(2)),
      gx: Number((px * -18).toFixed(1)),
      gy: Number((py * -14).toFixed(1)),
    });
  };

  return (
    <section
      data-reduced-motion={reduced ? "true" : "false"}
      className="mk-section mk-reveal is-visible relative mx-auto w-full max-w-6xl px-5 pb-12 pt-8 sm:pb-20 sm:pt-16"
    >
      <div
        aria-hidden
        className="mk-glow pointer-events-none absolute inset-x-0 -top-20 h-[440px] bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.22),transparent_68%)]"
      />
      <div className="relative mx-auto max-w-3xl text-center">
        <p className="mk-eyebrow inline-flex items-center rounded-full border border-[var(--ai-border)] bg-accent-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-ai-title">
          Public preview
        </p>
        <h1 className="mk-title mx-auto mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-fg sm:text-6xl">
          Your inbox, <span className="bg-gradient-to-r from-accent-300 to-accent-400 bg-clip-text text-transparent">understood.</span>
        </h1>
        <p className="mk-lede mx-auto mt-5 max-w-xl text-pretty text-[16px] leading-relaxed text-fg-2 sm:text-[17px]">
          MailIQ summarizes threads, drafts replies and answers questions about your mail — AI proposes, you confirm.
        </p>
        {notice ? <div className="mx-auto mt-6 max-w-md text-left">{notice}</div> : null}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
          {signIn}
          <a
            href="#product"
            className="inline-flex h-12 min-h-11 items-center justify-center gap-2 rounded-[var(--radius-lg)] border border-line-strong bg-surface/50 px-5 text-[15px] font-medium text-fg transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:border-[var(--ai-border)] hover:bg-surface-2"
          >
            See how it works
            <Icon icon={ArrowDown} size="sm" />
          </a>
        </div>
        <p className="mt-3 text-[12.5px] text-fg-2">You approve every send.</p>
      </div>

      {selected ? (
        <figure className="relative mx-auto mt-12 w-full max-w-5xl sm:mt-16">
          <div className="relative isolate">
            <div
              aria-hidden
              className="mk-glow pointer-events-none absolute -inset-x-2 -inset-y-8 -z-10 bg-[radial-gradient(45%_55%_at_50%_42%,rgba(139,92,246,0.34),transparent_72%),radial-gradient(28%_40%_at_82%_18%,rgba(196,181,253,0.18),transparent_70%)] transition-transform duration-[var(--duration-normal)] ease-[var(--ease-out)]"
              style={{ transform: allowTilt ? `translate3d(${tilt.gx}px, ${tilt.gy}px, 0)` : "none" }}
            />
            <ProductFrame
              tilt={allowTilt ? "on" : "off"}
              caption="Inbox"
              onPointerMove={onPointerMove}
              onPointerLeave={() => setTilt({ rx: 0, ry: 0, gx: 0, gy: 0 })}
              className={cn(allowTilt && "will-change-transform", "transition-transform duration-[var(--duration-fast)] ease-[var(--ease-out)]")}
              style={{
                transform: allowTilt ? `perspective(1100px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)` : "none",
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:grid-cols-[9.5rem_minmax(0,0.88fr)_minmax(0,1.16fr)]">
                <div aria-hidden className="hidden flex-col gap-1 border-r border-line p-3 lg:flex">
                  {FOLDERS.map((folder) => {
                    const active = folder.label === "Inbox";
                    return (
                      <div
                        key={folder.label}
                        className={cn(
                          "flex min-h-9 items-center gap-2 rounded-[var(--radius-md)] px-2.5 text-[13px]",
                          active ? "bg-accent-soft font-medium text-fg" : "text-fg-2",
                        )}
                      >
                        <Icon icon={folder.icon} size="sm" className={active ? "text-accent-ink" : undefined} />
                        <span className="truncate">{folder.label}</span>
                        {active && unreadCount > 0 ? (
                          <span className="ml-auto">
                            <Badge>{unreadCount}</Badge>
                          </span>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
                <div
                  role="listbox"
                  tabIndex={0}
                  aria-label="Sample inbox"
                  aria-activedescendant={`hero-option-${selected.id}`}
                  onKeyDown={onKeyDown}
                  className="max-h-[440px] min-w-0 overflow-y-auto border-b border-line scroll-thin md:border-b-0 md:border-r"
                >
                  <div aria-hidden className="flex h-10 items-center gap-2 px-3 text-[12.5px] text-fg-2">
                    Primary
                  </div>
                  {HERO_THREADS.map((thread) => (
                    <HeroRow
                      key={thread.id}
                      thread={thread}
                      selected={thread.id === selected.id}
                      read={readIds.includes(thread.id)}
                      onSelect={select}
                    />
                  ))}
                </div>
                <div className="min-w-0 p-4 sm:p-5">
                  <p className="truncate text-[12.5px] text-fg-2">
                    {selected.from.name} · {selected.time}
                  </p>
                  <p className="mt-1 text-pretty text-[16px] font-semibold tracking-tight text-fg sm:text-[18px]">{selected.subject}</p>
                  <section
                    aria-label="AI summary"
                    key={selected.id}
                    className={cn("ai-block mt-3 rounded-[var(--radius-lg)] px-3 py-2.5", !reduced && "animate-fade-in")}
                  >
                    <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ai-title">
                      <Icon icon={Sparkles} size="sm" />
                      AI summary
                    </p>
                    <p className="mt-1.5 text-pretty text-[13px] leading-relaxed text-fg-2">{selected.summary}</p>
                    {selected.deadlines[0] ? (
                      <p className="mt-2 flex items-center gap-1.5 text-[12.5px] text-fg-2">
                        <Icon icon={CalendarClock} size="sm" className="shrink-0 text-accent-ink" />
                        <span className="min-w-0 truncate">
                          {selected.deadlines[0].what}: {selected.deadlines[0].when}
                        </span>
                      </p>
                    ) : null}
                  </section>
                  <p className="mt-3 line-clamp-3 text-pretty text-[13px] leading-relaxed text-fg-2">{selected.body[0]}</p>
                </div>
              </div>
            </ProductFrame>
          </div>
          <figcaption className="mt-4 flex flex-col items-center gap-2 text-center">
            <IllustrationNote />
            <p className="flex flex-wrap items-center justify-center gap-1.5 text-[12.5px] text-fg-2">
              Focus the list, then <Kbd>j</Kbd> or <Kbd>k</Kbd>.
            </p>
          </figcaption>
        </figure>
      ) : null}
    </section>
  );
}

function HeroRow({
  thread,
  selected,
  read,
  onSelect,
}: {
  thread: SampleThread;
  selected: boolean;
  read: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      id={`hero-option-${thread.id}`}
      type="button"
      role="option"
      aria-selected={selected}
      tabIndex={-1}
      onClick={() => onSelect(thread.id)}
      className={cn(
        "flex w-full min-h-11 min-w-0 items-center gap-2.5 px-3 py-2 text-left",
        "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]",
        selected ? "bg-accent-soft" : "hover:bg-surface-2",
      )}
    >
      <PersonMark name={thread.from.name} />
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline gap-2">
          <span className={cn("truncate text-[13px]", read ? "font-medium text-fg-2" : "font-semibold text-fg")}>{thread.from.name}</span>
          <span className="ml-auto shrink-0 text-[11.5px] text-fg-2">{thread.time}</span>
        </span>
        <span className="mt-0.5 block truncate text-[12.5px] text-fg-2">{thread.subject}</span>
      </span>
      {!read && <span className="size-2 shrink-0 rounded-full bg-accent" />}
    </button>
  );
}

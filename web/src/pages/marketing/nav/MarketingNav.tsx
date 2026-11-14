import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/misc";
import { navLinks } from "@/pages/marketing/content/copy";

export default function MarketingNav({ signIn }: { signIn: ReactNode }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const barRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const toggle = toggleRef.current;
    panel?.querySelector<HTMLElement>("a[href], button:not([disabled])")?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
      toggle?.focus();
    };
    const onPointer = (event: PointerEvent) => {
      const bar = barRef.current;
      if (!bar || !(event.target instanceof Node) || bar.contains(event.target)) return;
      setOpen(false);
      toggle?.focus();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <header className="mk-nav">
      <a className="mk-skip" href="#main">Skip to content</a>
      <div ref={barRef} className="mk-nav-bar mk-glass">
        <a className="mk-nav-logo" href="/" aria-label="MailIQ home">
          <Logo />
        </a>
        <button
          ref={toggleRef}
          type="button"
          className="mk-nav-toggle"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((value) => !value)}
        >
          <Icon icon={open ? X : Menu} size="lg" />
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
        <nav
          ref={panelRef}
          id={menuId}
          className="mk-nav-panel"
          data-open={open ? "true" : "false"}
          aria-label="Primary"
        >
          {navLinks.map((link) => (
            <a key={link.href} className="mk-nav-link" href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <div className="mk-nav-signin">{signIn}</div>
        </nav>
      </div>
    </header>
  );
}

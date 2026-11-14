# Phase 3 foundation

Shared primitives for the motion and UI work. Nothing here is applied to existing screens except Copilot’s message-list scroll and the global focus ring. Do not add dependencies for these helpers (`tailwind-merge` is not used).

Tokens and keyframes live in `web/src/styles/index.css` (`@theme`).

## Motion

| Token | Value | Use |
| --- | --- | --- |
| `--duration-fast` | 120ms | Color and small transitions already in the app |
| `--duration-normal` | 160ms | Enter animations |
| `--duration-slow` | 240ms | Longer enters. Emitted when something references it |
| `--duration-exit` | 100ms | Exits. Shorter than enter |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Enters |
| `--ease-in` | `cubic-bezier(0.7, 0, 0.84, 0)` | Exits. Mirror of ease-out |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Loops such as shimmer |
| `--motion-distance-sm` | 4px | Fade offset (same distance `.animate-in` already used) |
| `--motion-distance-md` | 8px | Default slide |
| `--motion-distance-lg` | 16px | Opt-in slide via `.motion-distance-lg` |

Enter utilities use `--duration-normal` and `--ease-out`. Exit utilities use `--duration-exit` and `--ease-in`.

### Keyframes and Tailwind translate

Keyframes animate `transform` and opacity. They do not set the `translate` property. Tailwind v4’s `-translate-x-1/2` / `-translate-y-1/2` set `translate`, which is a separate property, so a centered dialog stays centered while a fade or slide plays. End the enter at `transform: none` so only the offset is cleared.

Do not rewrite these keyframes to `translate:` or to `transform: translate(-50%, -50%)`. Both fight centering.

### How to use them

Radix sets `data-state="open"` and `data-state="closed"`. One class is enough:

```html
<Dialog.Overlay class="motion-overlay" />
<Dialog.Content class="motion-scale" />
<Menu.Content class="motion-slide-from-top" />
```

`motion-fade`, `motion-scale`, `motion-overlay`, and `motion-slide-from-top|bottom|left|right` play the enter animation while open and the exit animation while closed. Add `motion-distance-lg` to slide 16px instead of 8px.

The same animations are Tailwind utilities, so variants work once the class is in a scanned file:

```html
data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out
data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out
data-[state=open]:animate-overlay-in data-[state=closed]:animate-overlay-out
data-[state=open]:animate-slide-in-from-top data-[state=closed]:animate-slide-out-to-top
```

Slide utilities also exist for `bottom`, `left`, and `right` (`animate-slide-in-from-*` / `animate-slide-out-to-*`). Overlay fade is opacity only.

`.animate-in` and `.animate-scale-in` stay plain classes with the same timing as before. Do not register an `animate-in` utility: Copilot’s overlay already has `data-[state=open]:animate-in`, and that class is intentionally not an animation yet.

### Reduced motion

The global `prefers-reduced-motion: reduce` rule collapses animation and transition durations and forces CSS `scroll-behavior: auto`. It does not affect `element.scrollTo({ behavior: "smooth" })`.

`web/src/lib/motion.ts`:

- `usePrefersReducedMotion()` — `matchMedia` plus a `change` listener
- `prefersReducedMotion()` — the same check outside React
- `scrollBehavior()` — `"auto"` when reduced, otherwise `"smooth"`

Copilot’s message list uses `scrollBehavior()`.

## Focus

The default keyboard ring is in `@layer base`:

```css
:focus-visible {
  outline: 2px solid var(--accent-ring);
  outline-offset: 2px;
}
```

It no longer sets `border-radius`, so round controls keep their own radius (the outline follows that radius). Because the rule is in the base layer, utilities such as `focus-visible:outline-none`, `focus-visible:ring-2`, and `focus-visible:outline-offset-*` override it. Mouse focus stays unoutlined via `:focus:not(:focus-visible)`.

## Icons

`web/src/components/ui/Icon.tsx` is the size and stroke contract. Existing `<Star className="size-[18px]" />` call sites are unchanged.

| Prop | Values |
| --- | --- |
| `size` | `xs` 12, `sm` 14, `md` 16 (default), `lg` 20 |
| `active` | stroke `2.25`. Resting stroke is `2` |
| `label` | Accessible name. Omit it and the icon is `aria-hidden` |

```tsx
<Icon icon={Sparkles} />
<Icon icon={Inbox} size="lg" active label="Inbox" />
```

`ICON_SIZE` and `ICON_STROKE` are exported for call sites that cannot use the component yet. Drop the ad-hoc 1.75 / 1.8 / 2.25 strokes when migrating; use `active` for the heavier one.

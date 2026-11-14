# Phase 4 landing page & marketing

Marketing-only landing at `/`. Signed-in users still redirect to `/app` (or the safe `next` path). No pricing, no invented social proof, no new dependencies.

## Architecture

| Piece | Role |
| --- | --- |
| `web/src/pages/Landing.tsx` | Session gate, Splash, signed-in redirect, error/`deleted`/`not_configured` notice. Lazily loads `MarketingPage` so marketing code stays out of the entry chunk. |
| `web/src/pages/marketing/MarketingPage.tsx` | Assembles nav → hero → sections → footer. Imports `marketing.css`. |
| `web/src/pages/marketing/SignInLink.tsx` | Google CTA. `GET /api/auth/google/start`; appends `next` only when it starts with `/app`. Disabled when `config.google === false`. |
| `web/src/pages/marketing/nav/MarketingNav.tsx` | Sticky nav, skip link to `#main`, Product / Features / Privacy / FAQ, sign-in slot, mobile menu. |
| `web/src/pages/marketing/hero/Hero.tsx` | H1 “Your inbox, understood.”, signIn + notice slots, interactive sample three-pane. |
| `web/src/pages/marketing/showcase/Showcase.tsx` | `#product` scrollytelling (desktop) / step buttons (small / reduced motion). |
| `web/src/pages/marketing/demos/*` | Self-contained illustrations (sample data only). `LazyDemo` loads when near the viewport. |
| `web/src/pages/marketing/sections/*` | Feature, privacy, FAQ, workflow, final CTA, marketing footer. Demo sections accept an optional `demo` node. |
| `web/src/pages/marketing/content/copy.ts` | All marketing strings; claims checked against privacy policy, terms, SECURITY.md, README. |
| `web/src/pages/marketing/marketing.css` | `.mk-*` layout, glass, reveal, nav, frames. Uses existing design tokens; does not edit `styles/index.css`. |

`/privacy` and `/terms` keep `PublicFooter`. The marketing footer is used only on the landing page.

## File ownership (Phase 4)

- **Lisa (PR #39):** identity, nav, sections, copy, privacy, FAQ, footer, `marketing.css`, section tests.
- **John (PR #40):** hero, showcase, demos, fixtures, LazyDemo, demo tests.
- **Integration (this branch):** `SignInLink`, `MarketingPage`, wire `Landing.tsx`, `index.html` meta, e2e copy updates, this doc.

## How to add a demo

1. Add a component under `web/src/pages/marketing/demos/` that renders only sample data (no `/api`).
2. Register it in `LazyDemo.tsx` `DEMOS` map.
3. Pass `<LazyDemo name="yourName" />` into the matching section’s `demo` prop from `MarketingPage.tsx`.
4. Prefer `ProductFrame` / existing `.mk-frame` chrome so the illustration matches the rest of the page.
5. Cover interactions in `tests/web/marketing-demos.test.tsx`.

## Bundle

Marketing modules are loaded via `React.lazy` from `Landing.tsx`. They must not be imported from `main.tsx` or the app route tree. Keep first-load chunks (`index`, `AppRoutes`) under the existing 300 KiB budget.

## Constraints (do not regress)

- No pricing section or nav item.
- No social-proof logos, quotes, or counts beyond the factual preview line (`PreviewNote`).
- Privacy copy must stay accurate (no “end-to-end”, “zero-knowledge”, “one-click delete”, “vendor stores nothing”).
- CTA remains Google sign-in only; disabled when Google is not configured.
- Prefer existing tokens; do not edit `web/src/styles/index.css` unless a token is truly missing.

# fjml-studio — working notes

## What this repo deploys

The root Astro app is the site at **https://fjml-studio.web.app**. `firebase.json` declares
`hosting.public = "dist"` with no `target`, so it publishes to the *default* site of the
Firebase project `fjml-studio`.

The sibling repo `studio-knowledge` shares that Firebase project but deploys to the
`knowledge` target. It is a different site. Do not confuse them.

The `apps/*` workspaces (`dashboard-remix`, `portfolio-nextjs`, `portfolio-next-signal`) are
**not** part of the hosted site.

```bash
npm run dev      # astro dev
npm run build    # astro build
npm test         # playwright, all viewports
npm run deploy   # firebase deploy --only hosting
```

`@astrojs/sitemap` is pinned to exactly `3.2.1`. Later 3.x releases target Astro 5 and crash
this Astro 4 build at `astro:build:done` with `Cannot read properties of undefined (reading
'reduce')`. Do not widen that range without upgrading Astro.

## Architecture: one page, nine views

The site is a **single route** (`/`) with client-side view switching, not a multi-page site.
`main#views` holds nine `.view[data-view]` panels; exactly one carries `.is-active`.

Views: `home, about, work, services, skills, styles, learning, contact, dashboard`.

The overlay menu lists **seven** of them. `styles` and `dashboard` are reachable only by hash
(`/#styles`) or easter egg — that is deliberate. Deep links (`/#about`, `/#work`, …) are mapped
in `ID_TO_VIEW` in `src/layouts/Layout.astro`.

## The view scroll contract — load-bearing, break it and mobile dies

Each `.view` is `position: fixed; inset: 0; overflow: hidden`. Its **direct-child `<section>`
is the only scroller**:

```css
.view > section,
.view > section[id] {
  flex: 1;
  min-height: 0;      /* ← load-bearing */
  overflow-y: auto;
}
```

Two ways this has already been broken, both silent, both mobile-only in appearance:

1. **`min-height: auto` on a view section.** A flex item defaults to `min-height: auto`, which
   forbids it shrinking below its content. `overflow-y: auto` then never engages, the section
   grows past the fixed-height `.view`, and `overflow: hidden` clips the remainder permanently
   out of reach. `About`, `Skills` and `Learning` each re-declared it inside a
   `max-width: 900px` block — vestigial leftovers from an older `min-height: 100vh` design —
   which is why those views could not be scrolled on a phone.

2. **A bare `section[id]` rule setting `overflow`.** `section[id]` and `.view > section` have
   **identical specificity (0,1,1)**, so a later `section[id] { overflow: visible }` won
   outright and disabled scrolling on *all nine views*, desktop included.

   The defence is the `.view > section[id]` entry in the scroller's selector list. At
   **(0,2,1)** it outranks the decorative rule's (0,1,1), and because the cascade resolves
   **per longhand**, its `overflow-y`/`overflow-x` beat the shorthand `overflow: visible`
   whichever rule is declared first. That entry looks redundant next to `.view > section`.
   It is not — deleting it re-arms the bug.

   Do **not** solve this with `section[id]:not(.view > section)` instead. `:not()` holding a
   combinator is Selectors Level 4, which Safari only shipped in **16.4**, so older iOS drops
   the entire rule — and `#configurator`, the one id-bearing section that is not a view child,
   depends on it for `position: relative`.

The same trap applies to any nested flex child in the scroll chain — see
`.services-container`, which needs its own `min-height: 0`.

`tests/scroll-contract.spec.ts` guards both cases against the built CSS. If it fails, read the
message before "fixing" it by loosening the assertion.

## Touch targets

Rules under `@media (pointer: coarse)` in `src/components/Nav.astro` give the menu toggle and
links a 44px minimum. They are scoped to coarse pointers so desktop layout is unaffected.

## Landscape is intentionally blocked

`src/components/LandscapeBlocker.astro` hard-blocks the UI below `980×600` in landscape
("PORTRAIT VIEW ONLY"). This is a product decision, not a bug. Phone support means **portrait**.

## Testing

```bash
npm test              # all four viewports
npm run test:mobile   # 320 / 375 / Pixel 5
npm run test:desktop  # 1440x900 baseline
```

Each of these builds first: `tests/scroll-contract.spec.ts` asserts against
`dist/_astro/*.css`, and the preview server serves `dist/`.

Mobile projects run WebKit (iOS is the engine that matters here); desktop runs Chromium. Both
browsers must be installed: `npx playwright install webkit chromium`.

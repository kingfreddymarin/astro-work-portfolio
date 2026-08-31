# Observability — fjml-studio

This is a **static site**. There is no server, no request path, and no runtime to instrument, so
there are no metrics endpoints, no distributed traces, and no alerting integrations here. Saying
otherwise would be a fiction. What this repo has instead is a rendering harness, because the
failure mode that actually bites this project is *layout silently breaking on a device nobody
tested*, and the only meaningful signal for that is a browser measuring the real page.

## What is instrumented

`npm test` builds the site and drives the real thing in a real browser at four viewports —
`mobile-320` (320×568), `mobile-375` (iPhone SE), `pixel-5`, and `desktop` (1440×900). Mobile
projects run **WebKit**, desktop runs **Chromium**.

Per view, the suite measures and asserts:

| Signal | Assertion |
|---|---|
| Section bottom vs. viewport height | content is contained and reachable |
| `scrollHeight` vs. `clientHeight`, then actual `scrollTop` advance | the view genuinely scrolls when it overflows |
| `document.documentElement.scrollWidth` vs. `innerWidth` | the page never pans sideways |
| Touch-target box (mobile only) | menu toggle and links are ≥44px |
| Menu inventory and routing | all seven menu destinations open their view |

`tests/scroll-contract.spec.ts` additionally reads the **built** CSS in `dist/_astro/` and fails
if the load-bearing scroll contract has been re-broken — either by a `min-height: auto` on a view
section, or by losing the `.view > section[id]` specificity pin. See `CLAUDE.md` for why both
matter; both regressions have shipped to production before.

## Failure capture

- Non-zero exit from `npm test`. This is the gate.
- `test-results/<test>/error-context.md` — a DOM snapshot at the point of failure, written
  automatically.
- `trace: 'retain-on-failure'` — a full Playwright trace (DOM, network, console, timeline) for
  failing tests only. Open with `npx playwright show-trace <path>`.
- `screenshot: 'only-on-failure'` — the rendered page at failure. For a layout bug this is
  usually the fastest read.
- `playwright-report/` — the HTML report. `npx playwright show-report`.

A green run writes none of the above, so the failure-only capture costs nothing in the normal
case.

## What is deliberately absent

- **Metrics / traces / alerting in the production sense.** Nothing runs at request time. Firebase
  Hosting serves static files; there is no application process to emit telemetry.
- **Runtime error reporting.** No Sentry or equivalent is wired up. Client-side JS is limited to
  view switching and decorative effects. If that changes — a form, an auth flow, anything that can
  fail for a user in a way the user notices — this section is where that decision should be
  revisited.

## Validation

```bash
npm test    # astro build && playwright test — the observability validation command
```

Last validated 2026-08-30: **exit 0, 135 passed, 1 skipped**.

The harness has been verified against known-bad input, not only known-good: reverting the source
fixes fails 8 of 27 tests on both `mobile-375` and `desktop`, and deleting the
`.view > section[id]` pin fails both the static guard and 8 navigation tests. A check that passes
in both states proves nothing, so this repo treats the known-bad run as part of validation.

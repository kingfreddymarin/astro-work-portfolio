import { test, expect, type Page } from '@playwright/test';

/**
 * The nine client-side views, keyed by the deep-link hash that activates them.
 * `src/layouts/Layout.astro` maps `location.hash` → view name on first paint.
 */
const VIEWS = [
  { hash: '', view: 'home' },
  { hash: '#about', view: 'about' },
  { hash: '#work', view: 'work' },
  { hash: '#services', view: 'services' },
  { hash: '#skills', view: 'skills' },
  { hash: '#styles', view: 'styles' },
  { hash: '#learning', view: 'learning' },
  { hash: '#contact', view: 'contact' },
  { hash: '#dashboard', view: 'dashboard' },
] as const;

/**
 * Skip the two first-run gates so tests land directly on the view under test.
 * ModeGate persists to localStorage('site-mode'); IntroLoader to
 * sessionStorage('fjml-intro-seen').
 */
async function skipGates(page: Page) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('site-mode', 'full');
      sessionStorage.setItem('fjml-intro-seen', '1');
    } catch {
      /* storage unavailable — the gates will show, and the test will say so */
    }
  });
}

async function gotoView(page: Page, hash: string) {
  await skipGates(page);
  await page.goto(`/${hash}`);
  await page.waitForSelector('.view.is-active', { state: 'attached' });
  // let the clip-path reveal and any ResizeObserver settle
  await page.waitForTimeout(400);
}

/** Geometry of the active view and its scroller, measured in the browser. */
async function measure(page: Page) {
  return page.evaluate(() => {
    const view = document.querySelector<HTMLElement>('.view.is-active');
    if (!view) return null;
    const section = view.querySelector<HTMLElement>(':scope > section');
    const vh = window.innerHeight;

    const base = {
      viewName: view.dataset.view ?? '(unknown)',
      innerWidth: window.innerWidth,
      innerHeight: vh,
      docScrollWidth: document.documentElement.scrollWidth,
      hasSection: !!section,
    };
    if (!section) return { ...base, sectionBottom: 0, sectionHeight: 0, scrollHeight: 0, clientHeight: 0 };

    const rect = section.getBoundingClientRect();
    return {
      ...base,
      sectionBottom: rect.bottom,
      sectionHeight: rect.height,
      scrollHeight: section.scrollHeight,
      clientHeight: section.clientHeight,
    };
  });
}

for (const { hash, view } of VIEWS) {
  test.describe(`view: ${view}`, () => {
    test(`is contained within the viewport and reachable`, async ({ page }) => {
      await gotoView(page, hash);
      const m = await measure(page);

      expect(m, 'no active view rendered').not.toBeNull();
      expect(m!.viewName, `deep link ${hash || '/'} did not activate the expected view`).toBe(view);
      expect(m!.hasSection, `view "${view}" has no direct-child <section>, so .view > section gives it no scroller`).toBe(true);

      // THE REGRESSION UNDER TEST.
      // `.view` is `position: fixed; inset: 0; overflow: hidden`. If its section
      // grows past the viewport, the overflow is clipped and permanently
      // unreachable — this is exactly what `min-height: auto` caused on mobile.
      expect(
        m!.sectionBottom,
        `view "${view}": section extends ${Math.round(m!.sectionBottom - m!.innerHeight)}px below the viewport ` +
          `and .view{overflow:hidden} clips it — content is unreachable`,
      ).toBeLessThanOrEqual(m!.innerHeight + 2);
    });

    test(`scrolls to the bottom of its content`, async ({ page }) => {
      await gotoView(page, hash);

      const result = await page.evaluate(async () => {
        const view = document.querySelector<HTMLElement>('.view.is-active')!;
        const section = view.querySelector<HTMLElement>(':scope > section');
        if (!section) return { overflows: false, scrolled: 0, target: 0, ok: false };

        const target = section.scrollHeight - section.clientHeight;
        if (target <= 1) return { overflows: false, scrolled: 0, target, ok: true };

        section.scrollTop = target;
        await new Promise((r) => requestAnimationFrame(() => r(null)));
        return { overflows: true, scrolled: section.scrollTop, target, ok: section.scrollTop > 0 };
      });

      if (result.overflows) {
        expect(
          result.ok,
          `view "${view}": content overflows by ${Math.round(result.target)}px but the section did not scroll`,
        ).toBe(true);
      }
    });

    // SCOPE: this asserts the *page* never pans sideways. It does NOT detect content
    // clipped inside a view. Every `.view` is `position: fixed` and its section is
    // `overflow-x: hidden`, so horizontal overflow within a section can never reach the
    // document and this assertion cannot fail for it.
    //
    // That clipping was checked by hand on 2026-08-30 across all nine views at 375px:
    // only `.work-banner-chunk` (a marquee) and `.code-lines` (decorative code-rain)
    // exceed their section, and both are meant to. No real content is lost. If wide
    // content is added later — a table, a code block, a horizontal card row — this test
    // will still pass while the overflow is silently cut off. Measure the section's own
    // scrollWidth against its clientWidth to catch that.
    test(`does not scroll horizontally`, async ({ page }) => {
      await gotoView(page, hash);
      const m = await measure(page);
      expect(
        m!.docScrollWidth,
        `view "${view}": document is ${m!.docScrollWidth}px wide in a ${m!.innerWidth}px viewport`,
      ).toBeLessThanOrEqual(m!.innerWidth + 1);
    });
  });
}

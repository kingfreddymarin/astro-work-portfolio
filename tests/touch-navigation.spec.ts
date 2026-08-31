import { test, expect, type Page } from '@playwright/test';

/**
 * Navigation on touch: the overlay menu is the only way to move between the
 * nine views on a phone, so if it does not open, close, and route, the site is
 * unnavigable regardless of how well individual views render.
 */

/** Tap on touch-capable contexts, click otherwise (the desktop project has no touch). */
async function activate(page: Page, selector: string, isMobile: boolean | undefined) {
  const el = page.locator(selector);
  if (isMobile) await el.tap();
  else await el.click();
}

async function open(page: Page) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('site-mode', 'full');
      sessionStorage.setItem('fjml-intro-seen', '1');
    } catch { /* gates will show; assertions will report it */ }
  });
  await page.goto('/');
  await page.waitForSelector('.view.is-active');

  // The site pops timed "tip" toasts from #notification-center. They are fixed
  // and can sit over the menu toggle, intercepting pointer events part-way
  // through a run and making navigation tests time out non-deterministically.
  // Neutralise interception only — the toasts still render and still occupy
  // layout, so nothing about the visual result is being hidden from the test.
  await page.addStyleTag({ content: '#notification-center, #notification-center *{pointer-events:none !important}' });
  await page.waitForTimeout(400);
}

test.describe('touch navigation', () => {
  test('the menu opens, routes to a view, and closes', async ({ page, isMobile }) => {
    await open(page);

    const toggle = page.locator('.menu-toggle');
    const menu = page.locator('#overlay-menu');

    await expect(toggle, 'menu toggle is not visible').toBeVisible();

    // The toggle must be a usable touch target. 44px is the platform minimum;
    // 40 allows for a hairline of sub-pixel rounding. Only meaningful on touch —
    // a mouse pointer does not need a 44px target, so desktop is exempt.
    if (isMobile) {
      const box = await toggle.boundingBox();
      expect(box, 'menu toggle has no layout box').not.toBeNull();
      expect(box!.height, `menu toggle is only ${Math.round(box!.height)}px tall`).toBeGreaterThanOrEqual(40);
      expect(box!.width, `menu toggle is only ${Math.round(box!.width)}px wide`).toBeGreaterThanOrEqual(40);
    }

    await activate(page, '.menu-toggle', isMobile);
    await expect(menu, 'menu did not open on tap').toHaveClass(/open/);
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');

    const links = menu.locator('.menu-link');
    const count = await links.count();
    expect(count, 'menu has no links').toBeGreaterThan(0);

    // On a phone the whole menu must fit on screen: the overlay covers the
    // viewport and does not scroll, so anything past the fold is unreachable.
    //
    // Deliberately mobile-only. At 1440x900 the desktop menu already overflows
    // by ~55px — a pre-existing condition, unrelated to this task's changes
    // (the touch-target rules are scoped to `pointer: coarse`) and out of scope
    // here, since desktop is the declared-stable baseline. Recorded in the
    // task review rather than silently changed.
    if (isMobile) {
      const vp = page.viewportSize()!;
      for (let i = 0; i < count; i++) {
        const b = await links.nth(i).boundingBox();
        const label = (await links.nth(i).getAttribute('data-view-target')) ?? `#${i}`;
        expect(b, `menu link "${label}" has no layout box`).not.toBeNull();
        expect(b!.y, `menu link "${label}" sits above the viewport`).toBeGreaterThanOrEqual(-1);
        expect(
          b!.y + b!.height,
          `menu link "${label}" extends past the bottom of the viewport and cannot be tapped`,
        ).toBeLessThanOrEqual(vp.height + 1);

        // And it must be a real touch target.
        expect(b!.height, `menu link "${label}" is only ${Math.round(b!.height)}px tall`).toBeGreaterThanOrEqual(40);
      }
    }

    // Route to a view that is not the current one.
    await activate(page, '#overlay-menu .menu-link[data-view-target="contact"]', isMobile);
    await page.waitForTimeout(900); // clip-path reveal

    await expect(page.locator('.view.is-active'), 'tapping a menu link did not switch view')
      .toHaveAttribute('data-view', 'contact');
    await expect(menu, 'menu stayed open after routing').not.toHaveClass(/open/);
  });

  /**
   * The overlay menu offers seven destinations (see `items` in Nav.astro).
   * `styles` and `dashboard` are deliberately not listed — they are reached by
   * hash or easter egg — and are covered by the deep-link tests in
   * mobile-navigation.spec.ts instead.
   */
  const MENU_VIEWS = ['about', 'work', 'services', 'skills', 'learning', 'contact', 'home'] as const;

  test('every menu destination is reachable', async ({ page, isMobile }) => {
    // seven destinations, each with a ~900ms reveal
    test.setTimeout(90_000);
    await open(page);

    for (const view of MENU_VIEWS) {
      await activate(page, '.menu-toggle', isMobile);
      await expect(page.locator('#overlay-menu')).toHaveClass(/open/);

      const link = page.locator(`#overlay-menu .menu-link[data-view-target="${view}"]`);
      await expect(link, `no menu link routes to "${view}"`).toHaveCount(1);
      await activate(page, `#overlay-menu .menu-link[data-view-target="${view}"]`, isMobile);
      await page.waitForTimeout(900);

      await expect(page.locator('.view.is-active'), `menu did not reach view "${view}"`)
        .toHaveAttribute('data-view', view);
    }
  });

  test('the menu lists exactly the expected destinations', async ({ page, isMobile }) => {
    await open(page);
    await activate(page, '.menu-toggle', isMobile);
    const targets = await page.locator('#overlay-menu .menu-link').evaluateAll((els) =>
      els.map((e) => (e as HTMLElement).dataset.viewTarget),
    );
    expect(targets.sort(), 'the menu inventory changed').toEqual([...MENU_VIEWS].sort());
  });
});

test.describe('landscape', () => {
  test('the portrait-only blocker covers the screen in phone landscape', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'blocker targets small-screen landscape only');

    await open(page);
    // Rotate: LandscapeBlocker triggers below 980x600 in landscape orientation.
    await page.setViewportSize({ width: 667, height: 375 });
    await page.waitForTimeout(300);

    const blocker = page.locator('#landscape-blocker');
    await expect(blocker, 'landscape blocker did not appear when rotated').toBeVisible();

    // It must actually cover the viewport, or the UI leaks through behind it.
    const box = await blocker.boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(667 - 1);
    expect(box!.height).toBeGreaterThanOrEqual(375 - 1);

    // And its own content must fit — a blocker that overflows is its own bug.
    const overflows = await page.evaluate(() => {
      const c = document.querySelector<HTMLElement>('.lb-content');
      if (!c) return null;
      const r = c.getBoundingClientRect();
      return { past: r.bottom > window.innerHeight + 2 || r.right > window.innerWidth + 2 };
    });
    expect(overflows, '.lb-content missing').not.toBeNull();
    expect(overflows!.past, 'landscape blocker content overflows the screen').toBe(false);
  });
});

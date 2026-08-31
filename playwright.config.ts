import { defineConfig, devices } from '@playwright/test';

/**
 * Mobile-first verification for the fjml-studio single-page site.
 *
 * The site is one route (`/`) with nine client-side views. Each view is a
 * `position: fixed; inset: 0` panel whose direct-child `<section>` is the
 * scroller — see `.view > section` in `src/styles/global.css`. These tests
 * assert that contract holds at phone widths, where it previously did not.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL: 'http://localhost:4321',
    // A layout failure is invisible in a text log — you need to see the page. Both are
    // failure-only, so a green run writes nothing and stays fast.
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    // 320px — the narrowest phone width we support.
    {
      name: 'mobile-320',
      use: { ...devices['iPhone SE'], viewport: { width: 320, height: 568 }, isMobile: true, hasTouch: true },
    },
    // 375px — iPhone SE / the most common small-phone width.
    {
      name: 'mobile-375',
      use: { ...devices['iPhone SE'] },
    },
    // 393px — a representative Android device.
    {
      name: 'pixel-5',
      use: { ...devices['Pixel 5'] },
    },
    // The stable desktop baseline. These must keep passing unchanged.
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
  ],
  webServer: {
    command: 'npx astro preview --port 4321',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});

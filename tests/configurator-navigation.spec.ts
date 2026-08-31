import { test, expect, type Page } from '@playwright/test';

async function openConfigurator(page: Page, isMobile: boolean | undefined) {
  await page.addInitScript(() => {
    localStorage.setItem('site-mode', 'full');
    sessionStorage.setItem('fjml-intro-seen', '1');
  });
  await page.goto('/');
  await page.waitForSelector('.view.is-active');
  await page.addStyleTag({ content: '#notification-center,#notification-center *{pointer-events:none!important}' });

  const activate = async (selector: string) => {
    const target = page.locator(selector);
    if (isMobile) await target.tap();
    else await target.click();
  };

  await activate('.menu-toggle');
  await activate('#overlay-menu .menu-link[data-view-target="services"]');
  await page.waitForTimeout(900);
  await activate('[data-open-configurator]');
  await expect(page.locator('#configurator-overlay')).toHaveClass(/is-open/);
}

test('configurator does not turn a logo click into trapped About navigation', async ({ page, isMobile }) => {
  await openConfigurator(page, isMobile);

  const logo = page.locator('.nav-logo');
  const box = await logo.boundingBox();
  expect(box, 'top-bar logo has no clickable box').not.toBeNull();

  const target = await page.evaluate(({ x, y }) => {
    const node = document.elementFromPoint(x, y);
    return {
      tag: node?.tagName ?? null,
      className: node instanceof HTMLElement ? node.className : null,
      isLogo: node instanceof Element ? Boolean(node.closest('.nav-logo')) : false,
    };
  }, { x: box!.x + box!.width / 2, y: box!.y + box!.height / 2 });
  expect(target, `logo coordinate is intercepted by ${target.tag}.${target.className}`).toMatchObject({ isLogo: true });

  if (isMobile) await logo.tap();
  else await logo.click();
  await page.waitForTimeout(900);

  await expect(page.locator('.view.is-active')).toHaveAttribute('data-view', 'home');
  await expect(page.locator('#configurator-overlay')).not.toHaveClass(/is-open/);
  await expect(page.locator('.menu-toggle')).toBeVisible();
  await expect(page.locator('.menu-toggle')).toHaveCSS('pointer-events', 'auto');

  if (isMobile) await page.locator('.menu-toggle').tap();
  else await page.locator('.menu-toggle').click();
  await expect(page.locator('#overlay-menu')).toHaveClass(/open/);
});

test('logo navigation preserves another overlay owner when configurator is closed', async ({ page, isMobile }) => {
  await page.addInitScript(() => {
    localStorage.setItem('site-mode', 'full');
    sessionStorage.setItem('fjml-intro-seen', '1');
  });
  await page.goto('/');
  await page.waitForSelector('.view.is-active');
  await page.waitForTimeout(900);
  await page.evaluate(() => document.body.classList.add('overlay-active'));

  const logo = page.locator('.nav-logo');
  if (isMobile) await logo.tap();
  else await logo.click();

  await expect(page.locator('body')).toHaveClass(/overlay-active/);
});

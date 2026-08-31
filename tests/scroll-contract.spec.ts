import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Static guard on the view scroll contract.
 *
 * Two rules in `src/styles/global.css` are load-bearing and have been broken
 * before, both silently and only at mobile widths:
 *
 *  1. `.view > section { min-height: 0 }` — a flex item defaults to
 *     `min-height: auto`, which stops it shrinking below its content, so
 *     `overflow-y: auto` never engages and `.view{overflow:hidden}` clips the
 *     rest away. `About`, `Skills` and `Learning` each re-declared
 *     `min-height: auto` inside a `max-width: 900px` block.
 *
 *  2. `section[id] { overflow: visible }` has the *same* specificity (0,1,1) as
 *     `.view > section`, so being declared later it won outright and disabled
 *     scrolling on every view.
 *
 * These assertions read the built CSS, so they catch the regression however it
 * is reintroduced — component style, global rule, or new selector.
 */

function builtCss(): string {
  const dir = join(process.cwd(), 'dist', '_astro');
  return readdirSync(dir)
    .filter((f) => f.endsWith('.css'))
    .map((f) => readFileSync(join(dir, f), 'utf8'))
    .join('\n');
}

// Independent static assertions — each must be able to fail on its own, so no
// serial mode: a first failure must not mask the others.
test.describe('view scroll contract', () => {
  test('no rule re-introduces min-height:auto', () => {
    const css = builtCss();
    const hits = css.match(/min-height:\s*auto/g) ?? [];
    expect(
      hits.length,
      'A rule declares `min-height: auto`. On a `.view > section` this disables the ' +
        'scroller and clips the view. Remove it, or scope it away from view sections.',
    ).toBe(0);
  });

  test('no bare section[id] rule re-declares overflow', () => {
    const css = builtCss();
    // `section[id]{...overflow...}` without a `.view` qualifier or :not() guard
    const bare = css.match(/(^|[},])section\[id\]\{[^}]*overflow[^}]*\}/g) ?? [];
    expect(
      bare.length,
      'A bare `section[id]` rule sets `overflow`. It has the same specificity as ' +
        '`.view > section` and, declared later, silently disables scrolling on every view.',
    ).toBe(0);
  });

  test('the scroller rule still declares overflow-y:auto and min-height:0', () => {
    const css = builtCss();
    expect(css, 'the .view > section scroller rule is missing overflow-y:auto').toMatch(/overflow-y:\s*auto/);
    expect(css, 'the .view > section scroller rule is missing min-height:0').toMatch(/min-height:\s*0/);
  });
});

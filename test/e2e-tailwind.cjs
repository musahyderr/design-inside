// End-to-end for Tailwind: panel changes become utility-class swaps in the HTML.
//   node test/e2e-tailwind.cjs http://localhost:<editor port> /path/to/site
// The site is a git copy of test/fixtures/tailwind-site (Tailwind from its CDN).
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const [base, site] = process.argv.slice(2);
const read = (f) => fs.readFileSync(path.join(site, f), 'utf8');
const check = (cond, msg) => { if (!cond) { console.error('✗', msg); process.exitCode = 1; } else console.log('✓', msg); };

(async () => {
  const browser = await chromium.launch(process.env.EM_BROWSER ? { channel: process.env.EM_BROWSER } : {});
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const ui = (sel) => page.locator('design-inside-root').locator(sel);

  await page.goto(base);
  await page.waitForTimeout(1500); // let the Tailwind CDN script generate its styles
  await page.keyboard.press('Alt+e');
  await page.click('h2');
  await ui('[data-hex="color"]').fill('#ea580c'); await ui('[data-hex="color"]').press('Enter');
  await ui('[data-prop="font-size"]').fill('32'); await ui('[data-prop="font-size"]').press('Enter');
  const where = (await ui('footer li small').allTextContents()).join(' | ');
  check(/class|Tailwind/i.test(where), `tailwind: pending list says it will swap classes ("${where.trim()}")`);
  await Promise.all([page.waitForEvent('load'), ui('.save').click()]);
  await page.waitForTimeout(800);
  const html = read('index.html');
  check(/<h2 class="[^"]*text-\[#ea580c\][^"]*text-\[32px\][^"]*"|<h2 class="[^"]*text-\[32px\][^"]*text-\[#ea580c\][^"]*"/.test(html), 'tailwind: color and size written as utility classes');
  check(!/text-slate-900|text-2xl/.test(html), 'tailwind: conflicting utilities removed');
  check(html.includes('font-bold'), 'tailwind: unrelated utilities kept');
  check(errors.length === 0, `tailwind: no page errors ${errors.join(' | ')}`);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });

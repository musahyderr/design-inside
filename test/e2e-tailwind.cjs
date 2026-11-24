const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(process.env.EM_BROWSER ? { channel: process.env.EM_BROWSER } : {}); const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:4410/'); await p.waitForTimeout(1500);
  await p.keyboard.press('Alt+e');
  const ui = s => p.locator('editor-mode-root').locator(s);
  await p.click('h2');
  await ui('[data-hex="color"]').fill('#ea580c'); await ui('[data-hex="color"]').press('Enter');
  await ui('[data-prop="font-size"]').fill('32'); await ui('[data-prop="font-size"]').press('Enter');
  console.log('where:', (await ui('footer li small').allTextContents()).join(' | '));
  await Promise.all([p.waitForEvent('load'), ui('.save').click()]); await p.waitForTimeout(1500);
  console.log('rendered color:', await p.$eval('h2', e => getComputedStyle(e).color), 'size:', await p.$eval('h2', e => getComputedStyle(e).fontSize));
  console.log('errors:', errs.length);
  await b.close();
})();

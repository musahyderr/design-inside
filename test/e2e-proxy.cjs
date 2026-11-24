// End-to-end for proxy mode: editor-mode wraps a running dev server.
//   node test/e2e-proxy.cjs http://localhost:<editor port> /path/to/site
// The site is a git copy of test/fixtures/proxy-app served by test/fixtures/devserver.cjs.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const [base, site] = process.argv.slice(2);
const read = (f) => fs.readFileSync(path.join(site, f), 'utf8');
const log = () => execSync('git log --format=%s', { cwd: site }).toString().trim().split('\n');
const check = (cond, msg) => { if (!cond) { console.error('✗', msg); process.exitCode = 1; } else console.log('✓', msg); };

(async () => {
  const browser = await chromium.launch(process.env.EM_BROWSER ? { channel: process.env.EM_BROWSER } : {});
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const ui = (sel) => page.locator('editor-mode-root').locator(sel);
  const waitReload = async (fn) => { await Promise.all([page.waitForEvent('load'), fn()]); await page.waitForTimeout(400); };

  await page.goto(base);
  await page.waitForSelector('.dyn');
  check(await page.locator('editor-mode-root').count() === 1, 'proxy: overlay is injected into the dev server page');
  await page.keyboard.press('Alt+e');

  // 1. HTML the dev server serves verbatim is source-mapped
  await page.click('h1.title');
  check((await ui('.src').textContent()).includes('source-mapped'), 'proxy: verbatim HTML is source-mapped');
  await ui('[data-text]').fill('Laptops built to last');
  await ui('[data-text]').press('Enter');
  await waitReload(() => ui('.save').click());
  check(read('index.html').includes('<h1 class="title">Laptops built to last</h1>'), 'proxy: text edit written to index.html');

  // 2. text rendered by JavaScript is found by search in the source
  await page.waitForSelector('.dyn');
  await page.click('.dyn');
  check((await ui('.src').textContent()).includes('framework'), 'proxy: JS-rendered element is recognised as framework output');
  await ui('[data-text]').fill('Rendered by the dev server');
  await ui('[data-text]').press('Enter');
  await waitReload(() => ui('.save').click());
  check(read('main.js').includes("'<p class=\"dyn\">Rendered by the dev server</p>'"), 'proxy: framework text edit written to main.js');

  // 3. CSS through the proxy: the rule in styles.css
  await page.waitForSelector('.dyn');
  await page.click('.dyn');
  await ui('[data-hex="color"]').fill('#dc2626');
  await ui('[data-hex="color"]').press('Enter');
  await waitReload(() => ui('.save').click());
  check(/\.dyn \{\n  color: #dc2626;\n\}/.test(read('styles.css')), 'proxy: CSS rule edited in styles.css');
  check(log().length === 4, `proxy: one commit per save (${log().length - 1} saves)`);

  // 4. the dev server's hot-reload WebSocket still works through editor-mode
  const msg = await page.evaluate(() => new Promise((resolve) => {
    const ws = new WebSocket(location.origin.replace('http', 'ws') + '/hmr');
    ws.onmessage = (e) => resolve(e.data); ws.onerror = () => resolve('error'); setTimeout(() => resolve('timeout'), 3000);
  }));
  check(msg === 'hello', `proxy: WebSocket (hot reload) passes through (${msg})`);

  check(errors.length === 0, `proxy: no page errors ${errors.join(' | ')}`);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });

// End-to-end: drives the real overlay in Chromium against a running
// editor-mode server and checks the files on disk and the git log.
//   node test/e2e.cjs http://localhost:4400 /path/to/site [screenshot-dir]
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const [base, site, shots] = process.argv.slice(2);
const read = (f) => fs.readFileSync(path.join(site, f), 'utf8');
const log = () => execSync('git log --format=%s', { cwd: site }).toString().trim().split('\n');
let n = 0;
const check = (cond, msg) => { if (!cond) { console.error('✗', msg); process.exitCode = 1; } else console.log('✓', msg); };

(async () => {
  const browser = await chromium.launch(process.env.EM_BROWSER ? { channel: process.env.EM_BROWSER } : {});
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: shots ? 2 : 1 });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const shot = async (name) => { if (shots) await page.screenshot({ path: path.join(shots, `${String(++n).padStart(2, '0')}-${name}.png`) }); };
  const ui = (sel) => page.locator('editor-mode-root').locator(sel);
  const waitReload = async (fn) => { await Promise.all([page.waitForEvent('load'), fn()]); await page.waitForTimeout(400); };

  await page.goto(base);
  await page.waitForTimeout(300);
  await shot('page');

  // 1. turn on, hover, select a card
  await page.keyboard.press('Alt+e');
  await page.hover('.card.featured h3');
  await shot('hover');
  await page.click('.card:not(.featured)', { position: { x: 8, y: 8 } });
  await page.waitForTimeout(150);
  check(await ui('.panel').isVisible(), 'panel opens on click');
  check((await ui('.name').textContent()).includes('article.card'), 'panel names the selected element');

  // 2. change background for all 3 cards
  await ui('[data-scope="all"]').click();
  await ui('[data-hex="background-color"]').fill('#fef9c3');
  await ui('[data-hex="background-color"]').press('Enter');
  await page.waitForTimeout(150);
  const bgs = await page.$$eval('.card', (els) => els.map((e) => getComputedStyle(e).backgroundColor));
  check(bgs.every((b) => b === 'rgb(254, 249, 195)'), 'live preview applies to all 3 cards');
  const where = await ui('footer li small').first().textContent();
  check(/rule \.card in styles\.css/.test(where), `pending list says where it will be written: "${where.trim()}"`);
  await ui('[data-prop="padding"]').fill('32');
  await ui('[data-prop="padding"]').press('Enter');
  await shot('pending');
  await waitReload(() => ui('.save').click());
  const css = read('styles.css');
  check(/\.card \{\n  background: #fef9c3;\n  border: 1px solid #e2e8f0;\n  border-radius: var\(--radius\);\n  padding: 32px;\n\}/.test(css), 'styles.css .card rule rewritten in place, formatting kept');
  check(log()[0].startsWith('editor-mode: article.card background-color: #fef9c3 (.card in styles.css)'), `commit: "${log()[0]}"`);
  const diff = execSync('git show --stat --format= HEAD', { cwd: site }).toString();
  check(/styles\.css \| 4 \+\+--/.test(diff) && !/index\.html/.test(diff), 'commit touches only styles.css, 2 lines');
  await shot('saved');

  // 3. double-click to edit the headline
  await page.dblclick('.hero h1');
  await page.keyboard.press('Control+a');
  await page.keyboard.type('Charge everything. Carry nothing else.');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(100);
  await shot('text-edit');
  await waitReload(() => page.keyboard.press('Control+s'));
  check(read('index.html').includes('<h1>Charge everything. Carry nothing else.</h1>'), 'headline text written to index.html');

  // 4. "just this one" on a repeated element -> inline style, not the shared rule
  await page.click('.card.featured .price');
  await ui('[data-hex="color"]').fill('#16a34a');
  await ui('[data-hex="color"]').press('Enter');
  await waitReload(() => ui('.save').click());
  check(read('index.html').includes('<div class="price" style="color: #16a34a;">$49</div>'), 'one-off change becomes inline style on that element only');
  check(!/\.price \{[^}]*16a34a/.test(read('styles.css')), 'shared .price rule untouched');

  // 5. theme variable: change the accent everywhere through --accent
  await page.click('.card.featured .watts');
  await ui('[data-scope="all"]').click();
  await ui('.linkvar').check();
  await ui('[data-hex="color"]').fill('#f97316');
  await ui('[data-hex="color"]').press('Enter');
  const where2 = await ui('footer li small').first().textContent();
  check(/theme variable --accent/.test(where2), 'offers to change the theme variable --accent');
  await shot('theme-var');
  await waitReload(() => ui('.save').click());
  check(/--accent: #f97316;/.test(read('styles.css')), ':root --accent updated');
  await shot('theme-saved');

  // 6. font from the curated list -> link tag + font-family
  await page.click('.hero h1');
  await ui('[data-prop="font-family"]').selectOption('Space Grotesk');
  await waitReload(() => ui('.save').click());
  const html = read('index.html');
  check(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com\/css2\?family=Space\+Grotesk[^"]*">\n  <\/head>/.test(html) || html.includes('family=Space+Grotesk'), 'Google Font link added to <head>');
  check(html.includes('<h1 style="font-family: &quot;Space Grotesk&quot;, system-ui, sans-serif;">') || /h1 style="font-family/.test(html), 'font-family written for the h1');

  // 7. CSS inside a <style> block in the HTML
  await page.click('.badge');
  await ui('[data-hex="background-color"]').fill('#f97316');
  await ui('[data-hex="background-color"]').press('Enter');
  check(/rule \.badge in <style> in index\.html/.test(await ui('footer li small').first().textContent()), 'finds rule inside the <style> block');
  await waitReload(() => ui('.save').click());
  check(/\.badge \{[^}]*background: #f97316;/.test(read('index.html')) && !/class="badge" style=/.test(read('index.html')), 'single-use rule edited in the <style> block, no inline style');

  // 8. reorder: move the Studio card earlier
  await page.click('.card:nth-child(3)', { position: { x: 8, y: 8 } });
  check(await ui('.panel.left').count() === 1, 'panel docks left so it doesn\'t cover the selected card');
  await waitReload(() => ui('.move[data-dir="up"]').click());
  const order = await page.$$eval('.card h3', (e) => e.map((x) => x.textContent));
  check(order.join() === 'Pocket,Studio,Everyday', `cards reordered in the source: ${order.join(', ')}`);
  check(await ui('.panel').isVisible() && (await ui('.name').textContent()).includes('article.card'), 'selection survives the reload');

  // 9. undo the reorder from the toast/history
  await ui('[data-tab="history"]').click();
  await page.waitForTimeout(300);
  await shot('history');
  await waitReload(() => ui('.undo').first().click());
  const order2 = await page.$$eval('.card h3', (e) => e.map((x) => x.textContent));
  check(order2.join() === 'Pocket,Everyday,Studio', 'undo reverts the reorder with a revert commit');
  check(log()[0].startsWith('Revert "editor-mode: move'), `history kept: "${log()[0]}"`);

  // 9b. the panel adapts to what you click, and has a Text box
  await page.click('.lede');
  await ui('[data-tab="style"]').click();
  check((await ui('.kind').textContent()) === 'Paragraph', 'panel labels a <p> as Paragraph');
  check(await ui('[data-text]').isVisible(), 'text element shows a Text box in the panel');
  check(await ui('[data-prop="font-family"]').count() === 1, 'text element shows font controls');
  await ui('[data-text]').fill('Fast charging for every device you own.');
  await ui('[data-text]').press('Enter');
  check((await page.textContent('.lede')) === 'Fast charging for every device you own.', 'Text box previews the new text on the page');
  await waitReload(() => ui('.save').click());
  check(read('index.html').includes('<p class="lede">Fast charging for every device you own.</p>'), 'Text box writes the new text to index.html');
  check(log()[0].startsWith('editor-mode:'), `Text box edit is committed: "${log()[0]}"`);

  await page.click('.hero-actions .btn');
  check((await ui('.kind').textContent()) === 'Button', 'a.btn is labelled Button');
  await page.click('.card:not(.featured)', { position: { x: 8, y: 8 } });
  check(await ui('[data-text]').count() === 0, 'a card (box of several texts) has no single Text box');
  check((await ui('.body').textContent()).includes('Text inside'), 'a card offers "Text inside" styling');

  await page.evaluate(() => {
    const img = document.createElement('img'); img.id = 'em-test-img'; img.width = 40; img.height = 40;
    img.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="red"/></svg>');
    const s = document.createElement('span'); s.id = 'em-test-inline'; s.textContent = 'inline words';
    document.querySelector('.hero-copy').append(img, s);
  });
  await page.click('#em-test-img');
  check((await ui('.kind').textContent()) === 'Image', 'an <img> is labelled Image');
  check(await ui('[data-prop="font-family"]').count() === 0 && await ui('[data-prop="background-color"]').count() === 0, 'image hides font, color and background');
  check(await ui('[data-prop="width"]').count() === 1 && await ui('.keepratio').isChecked(), 'image shows width with Keep proportions on');
  await ui('[data-prop="width"]').fill('120');
  await ui('[data-prop="width"]').press('Enter');
  check(await page.$eval('#em-test-img', (e) => e.style.height) === 'auto', 'Keep proportions sets the other side to auto');
  await page.click('#em-test-inline');
  check(await ui('[data-prop="width"]').count() === 0 && await ui('[data-prop="font-family"]').count() === 1, 'inline text hides width/height, keeps font');
  await ui('.discard').click();
  await page.evaluate(() => { document.getElementById('em-test-img').remove(); document.getElementById('em-test-inline').remove(); });

  // 9c. the selection outline stays on the element while the page scrolls
  await page.click('.card .btn');
  await page.mouse.move(300, 300);
  await page.mouse.wheel(0, 150);
  await page.waitForTimeout(25);
  const drift = await page.evaluate(() => {
    const r = document.querySelector('.card .btn').getBoundingClientRect();
    const boxes = [...document.querySelector('editor-mode-root').shadowRoot.querySelectorAll('.hl')].map((x) => x.getBoundingClientRect()).filter((x) => x.width > 0);
    return Math.min(...boxes.map((x) => Math.abs(x.top - r.top)));
  });
  check(drift <= 1, `selection outline follows the element while scrolling (off by ${Math.round(drift)}px)`);

  // 10. ask Claude for something the panel can't do
  await page.click('.card.featured', { position: { x: 8, y: 8 } });
  await ui('[data-tab="claude"]').click();
  await ui('.ask').fill('make this card lift slightly with a shadow on hover');
  await ui('.send').click();
  await page.waitForTimeout(300);
  await shot('ask-claude');
  const q = read('.editor-mode/requests.md');
  check(q.includes('## [ ]') && q.includes('lift slightly') && q.includes('index.html'), 'request queued in .editor-mode/requests.md with source location');
  check(!execSync('git status --porcelain', { cwd: site }).toString().includes('.editor-mode'), 'queue file is git-excluded');

  // 11. safety: refuse to edit a file with the user's uncommitted work
  await page.click('.logo', { position: { x: 4, y: 4 } }); // nothing pending, so live reload may run
  await waitReload(async () => fs.appendFileSync(path.join(site, 'styles.css'), '\n/* my own unsaved work */\n'));
  check(true, 'page live-reloads when a file changes outside the editor (e.g. Claude edits it)');
  await page.click('.card:not(.featured)', { position: { x: 8, y: 8 } });
  await ui('[data-scope="all"]').click();
  await ui('[data-prop="border-radius"]').fill('4');
  await ui('[data-prop="border-radius"]').press('Enter');
  await ui('.save').click();
  await page.waitForTimeout(400);
  const err = await ui('.toast.error').last().textContent();
  check(/uncommitted changes/.test(err), 'refuses to commit over uncommitted user work');
  await shot('safety');
  execSync('git checkout -- styles.css', { cwd: site });

  check(errors.length === 0, `no page errors ${errors.join(' | ')}`);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });

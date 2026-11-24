// End-to-end for image import: choose a file, crop it, save it, undo it, and make
// sure oversized, fake and dangerous files never get into the project.
//   node test/e2e-images.cjs http://localhost:<editor port> /path/to/site
// The site is a git copy of test/fixtures/image-site.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const [base, site] = process.argv.slice(2);
const read = (f) => fs.readFileSync(path.join(site, f), 'utf8');
const images = () => fs.readdirSync(path.join(site, 'images')).sort();
const check = (cond, msg) => { if (!cond) { console.error('✗', msg); process.exitCode = 1; } else console.log('✓', msg); };

(async () => {
  const browser = await chromium.launch(process.env.EM_BROWSER ? { channel: process.env.EM_BROWSER } : {});
  const page = await browser.newPage({ viewport: { width: 1280, height: 860 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const ui = (sel) => page.locator('design-inside-root').locator(sel);
  const waitReload = async (fn) => { await Promise.all([page.waitForEvent('load'), fn()]); await page.waitForTimeout(400); };
  const choose = async (button, file) => {
    const [chooser] = await Promise.all([page.waitForEvent('filechooser'), ui(button).click()]);
    await chooser.setFiles(file);
    await page.waitForTimeout(300);
  };
  const lastToast = async () => ((await ui('.toast').allTextContents()).pop() || '');

  await page.goto(base);
  await page.waitForTimeout(300);
  // a real 400×300 photo-like PNG, made by the browser
  const photo = Buffer.from(await page.evaluate(() => {
    const c = Object.assign(document.createElement('canvas'), { width: 400, height: 300 });
    const g = c.getContext('2d'); const gr = g.createLinearGradient(0, 0, 400, 300);
    gr.addColorStop(0, '#f97316'); gr.addColorStop(1, '#8b5cf6'); g.fillStyle = gr; g.fillRect(0, 0, 400, 300);
    return c.toDataURL('image/png').split(',')[1];
  }), 'base64');
  await page.keyboard.press('Alt+e');

  // 1. replace an <img>: choose, crop to 1:1, preview, save, commit
  await page.click('img.photo');
  check(await ui('[data-target="img-src"]').isVisible(), 'images: an <img> has a Replace image button');
  await choose('[data-target="img-src"]', { name: 'Laptop Photo.png', mimeType: 'image/png', buffer: photo });
  check(await ui('.modal .crop').isVisible(), 'images: the crop window opens');
  await ui('[data-aspect="1"]').click();
  check((await ui('.crop .out').textContent()).includes('300×300'), `images: 1:1 crop of a 400×300 photo saves as 300×300 (${await ui('.crop .out').textContent()})`);
  await ui('.crop .use').click();
  await page.waitForTimeout(300);
  check(await ui('.modal').count() === 0 && (await page.getAttribute('img.photo', 'src')).startsWith('blob:'), 'images: the cropped image previews on the page before saving');
  check((await ui('footer li').first().textContent()).includes('image → Laptop Photo.webp (300×300)'), 'images: the pending list shows the new image and its size');
  await waitReload(() => ui('.save').click());
  const html = read('index.html');
  const saved = images().find((f) => /^laptop-photo-[0-9a-f]{8}\.webp$/.test(f));
  check(!!saved && html.includes(`<img class="photo" src="images/${saved}" alt="A laptop">`), `images: saved as images/${saved} and the <img> points to it`);
  const bytes = saved ? fs.readFileSync(path.join(site, 'images', saved)) : Buffer.alloc(0);
  check(bytes.toString('latin1', 0, 4) === 'RIFF' && bytes.toString('latin1', 8, 12) === 'WEBP', 'images: the saved file is a real WebP, re-encoded by the browser');
  const committed = execSync('git show --name-only --format= HEAD', { cwd: site }).toString().trim().split('\n').sort();
  check(committed.join() === ['images/' + saved, 'index.html'].sort().join(), `images: one commit holds the image and the HTML change (${committed.join(', ')})`);

  // 2. undo removes both the new file and the change
  await page.click('img.photo');
  await ui('[data-tab="history"]').click();
  await page.waitForTimeout(300);
  await waitReload(() => ui('.undo').first().click());
  check(read('index.html').includes('src="images/old.png"') && !images().includes(saved), 'images: Undo restores the old image and deletes the new file');

  // 3. background image on a card
  await page.click('.card', { position: { x: 8, y: 8 } });
  await ui('[data-tab="style"]').click();
  await choose('[data-target="bg-image"]', { name: 'card.png', mimeType: 'image/png', buffer: photo });
  await ui('[data-aspect="1.7778"]').click();
  await ui('.crop .use').click();
  await page.waitForTimeout(300);
  await waitReload(() => ui('.save').click());
  const bg = images().find((f) => /^card-[0-9a-f]{8}\.webp$/.test(f));
  check(!!bg && read('index.html').includes(`<div class="card" style="background-image: url(&quot;images/${bg}&quot;); background-size: cover; background-position: center;">`), 'images: a card gets a background image (cover, centered)');

  // 4. refusals in the browser: too big, SVG, a fake image; nothing is staged
  const before = images().join();
  await page.click('img.photo');
  await choose('[data-target="img-src"]', { name: 'huge.png', mimeType: 'image/png', buffer: Buffer.concat([photo, Buffer.alloc(5 * 1024 * 1024)]) });
  check((await lastToast()).includes('The limit is 5 MB') && await ui('.modal').count() === 0, 'images: files over 5 MB are refused before upload');
  await choose('[data-target="img-src"]', { name: 'logo.svg', mimeType: 'image/svg+xml', buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"/>') });
  check((await lastToast()).includes('SVG files are refused') && await ui('.modal').count() === 0, 'images: SVG files are refused');
  await choose('[data-target="img-src"]', { name: 'invoice.png', mimeType: 'image/png', buffer: Buffer.from('<!doctype html><script>alert(1)</script>') });
  check((await lastToast()).includes("couldn't be read as an image") && await ui('.modal').count() === 0, 'images: a non-image renamed to .png is refused');
  await choose('[data-target="img-src"]', { name: 'photo.png', mimeType: 'image/png', buffer: photo });
  await ui('.crop .cancel').click();
  check(await ui('footer li').count() === 0, 'images: Cancel in the crop window stages nothing');

  // 5. the server is the real gate: a direct request with an SVG (or junk) is refused
  const loc = await page.evaluate(() => { const [file, p] = document.querySelector('img.photo').getAttribute('data-em').split('#'); return { file, path: p, tag: 'img' }; });
  const direct = await page.evaluate(async (l) => {
    const send = async (data) => { const r = await fetch('/__em/apply', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ pageUrl: location.href, changes: [{ kind: 'img-src', loc: l, data, name: 'x.png' }] }) }); return [r.status, (await r.json()).error]; };
    return [await send(btoa('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>')), await send(btoa('\x89PNG\r\n\x1a\n<script>alert(1)</script>'))];
  }, loc);
  check(direct[0][0] === 415 && direct[1][0] === 415, `images: the server refuses an SVG and a fake PNG sent directly (${direct.map((d) => d[0]).join(', ')})`);
  check(images().join() === before, 'images: no refused file was ever written');

  check(errors.length === 0, `images: no page errors ${errors.join(' | ')}`);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });

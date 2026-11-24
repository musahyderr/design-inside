// Imported images: only real, reasonably sized raster images get into the project,
// whatever the file claims to be, and the server always chooses where they go.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
import * as H from '../src/html.js';
import { checkImage, sniff, dimensions, assetName, MAX_IMAGE_BYTES } from '../src/image.js';
import { applyPlan } from '../src/apply.js';

// A real, valid PNG of any size (solid color), built by hand.
function png(w, h) {
  const crcTable = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
  const crc = (b) => { let c = 0xffffffff; for (const x of b) c = crcTable[(c ^ x) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (type, data) => { const t = Buffer.from(type, 'latin1'); const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const c = Buffer.alloc(4); c.writeUInt32BE(crc(Buffer.concat([t, data]))); return Buffer.concat([len, t, data, c]); };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2;
  const raw = Buffer.alloc((w * 3 + 1) * h); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) raw[y * (w * 3 + 1) + 1 + x * 3] = 200;
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}
const b64 = (buf) => buf.toString('base64');
const refused = (data, re) => assert.throws(() => checkImage(data), re);

test('a real PNG is accepted, with its size read from the header', () => {
  const img = checkImage(b64(png(40, 30)));
  assert.equal(img.ext, 'png'); assert.equal(img.w, 40); assert.equal(img.h, 30);
});

test('formats are recognised by their bytes: PNG, JPEG, GIF, WebP, AVIF', () => {
  assert.equal(sniff(png(2, 2)).ext, 'png');
  const jpg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x04, 0x00, 0x00, 0xff, 0xc0, 0x00, 0x11, 0x08, 0x00, 0x20, 0x00, 0x40, 0x03, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  assert.equal(sniff(jpg).ext, 'jpg'); assert.deepEqual(dimensions(jpg, 'jpg'), { w: 64, h: 32 });
  const gif = Buffer.concat([Buffer.from('GIF89a', 'latin1'), Buffer.from([10, 0, 20, 0])]);
  assert.equal(sniff(gif).ext, 'gif'); assert.deepEqual(dimensions(gif, 'gif'), { w: 10, h: 20 });
  const webp = Buffer.alloc(30); webp.write('RIFF', 0, 'latin1'); webp.write('WEBPVP8X', 8, 'latin1'); webp.writeUIntLE(99, 24, 3); webp.writeUIntLE(49, 27, 3);
  assert.equal(sniff(webp).ext, 'webp'); assert.deepEqual(dimensions(webp, 'webp'), { w: 100, h: 50 });
  const avif = Buffer.alloc(40); avif.write('ftypavif', 4, 'latin1'); avif.write('ispe', 20, 'latin1'); avif.writeUInt32BE(300, 28); avif.writeUInt32BE(200, 32);
  assert.equal(sniff(avif).ext, 'avif'); assert.deepEqual(dimensions(avif, 'avif'), { w: 300, h: 200 });
});

test('SVG, HTML, scripts and executables are refused, whatever they are named', () => {
  refused(b64(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"></svg>')), /not a PNG.*SVG/s);
  refused(b64(Buffer.from('<!doctype html><script>alert(1)</script>')), /not a PNG/);
  refused(b64(Buffer.from('MZ\x90\x00 this is an exe')), /not a PNG/);
  refused(b64(Buffer.from('#!/bin/sh\nrm -rf ~')), /not a PNG/);
});

test('an image with code hidden inside it (a polyglot) is refused', () => {
  refused(b64(Buffer.concat([png(4, 4), Buffer.from('<script>fetch("//evil")</script>')])), /hidden code/);
  refused(b64(Buffer.concat([png(4, 4), Buffer.from('<?php system($_GET[1]); ?>')])), /hidden code/);
});

test('images over 5 MB are refused', () => {
  const big = Buffer.concat([png(4, 4), Buffer.alloc(MAX_IMAGE_BYTES)]);
  refused(b64(big), /larger than 5 MB/);
});

test('images over 8000×8000 pixels are refused (decompression bombs)', () => {
  const bomb = png(2, 2); bomb.writeUInt32BE(9000, 16); bomb.writeUInt32BE(9000, 20);
  refused(b64(bomb), /limit is 8000×8000/);
});

test('empty, damaged and missing data are refused', () => {
  refused('', /No image/);
  refused('not base64 at all!!', /damaged/);
  refused(b64(Buffer.from([0x89, 0x50])), /not a PNG/);
});

test('file names are chosen by the server: safe slug plus content hash', () => {
  const buf = png(2, 2);
  const a = assetName('../../etc/passwd.png', buf, 'png');
  assert.match(a, /^etc-passwd-[0-9a-f]{8}\.png$/);
  assert.match(assetName('Mein Foto (1).JPG', buf, 'jpg'), /^mein-foto-1-[0-9a-f]{8}\.jpg$/);
  assert.match(assetName('', buf, 'webp'), /^image-[0-9a-f]{8}\.webp$/);
  assert.match(assetName('.htaccess', buf, 'png'), /^image-[0-9a-f]{8}\.png$/);
});

test('replacing an <img> and setting a background image write the file and update the HTML', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'em-img-'));
  try {
    const page = '<!doctype html><html><body><img src="old.png" alt="x"><div class="card">Hi</div></body></html>';
    fs.writeFileSync(path.join(dir, 'index.html'), page);
    const pathOf = (pred) => { let p; H.walk(H.parseHtml(page), (el, p2) => { if (!p && pred(el)) p = p2; }); return p; };
    const inRoot = (r) => { const abs = path.resolve(dir, r); return abs.startsWith(dir + path.sep) && !r.split('/').some((s) => s.startsWith('.')) ? abs : null; };
    const rel = (abs) => path.relative(dir, abs).split(path.sep).join('/');
    const data = b64(png(20, 20));
    const { writes } = await applyPlan({ root: dir, inRoot, rel, resolveSheet: () => null, pageUrl: 'http://localhost/', changes: [
      { kind: 'img-src', loc: { file: 'index.html', path: pathOf((e) => e.tagName === 'img'), tag: 'img' }, data, name: 'Hero Photo.png' },
      { kind: 'bg-image', loc: { file: 'index.html', path: pathOf((e) => e.tagName === 'div'), tag: 'div' }, data, name: 'card bg.png' },
    ] });
    const names = Object.keys(writes).map(rel).sort();
    assert.equal(names.length, 3, names.join(', '));
    const html = writes[path.join(dir, 'index.html')];
    const [hero] = names.filter((n) => n.startsWith('images/hero-photo-'));
    assert.ok(hero, names.join(', '));
    assert.match(html, new RegExp(`<img src="${hero}" alt="x">`));
    assert.match(html, /<div class="card" style="background-image: url\(&quot;images\/card-bg-[0-9a-f]{8}\.png&quot;\); background-size: cover; background-position: center;">/);
    assert.ok(Buffer.isBuffer(writes[path.join(dir, hero)]));
    await assert.rejects(applyPlan({ root: dir, inRoot, rel, resolveSheet: () => null, pageUrl: 'http://localhost/', changes: [
      { kind: 'img-src', loc: { file: 'index.html', path: pathOf((e) => e.tagName === 'img'), tag: 'img' }, data: b64(Buffer.from('<svg/>')), name: 'x.png' },
    ] }), /not a PNG/);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

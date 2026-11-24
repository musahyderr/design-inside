// Other websites and DNS-rebinding pages must not be able to drive the editor,
// and edits must not be able to smuggle markup or extra CSS into the user's files.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createServer } from '../src/server.js';
import { validateChange } from '../src/apply.js';

let dir, server, close, port;
before(async () => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'em-sec-'));
  fs.writeFileSync(path.join(dir, 'index.html'), '<!doctype html><html><head></head><body><h1>Hi</h1></body></html>');
  fs.writeFileSync(path.join(dir, '.env'), 'SECRET=1');
  ({ server, close } = createServer({ root: dir, log: () => {} }));
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  port = server.address().port;
});
after(async () => { await close(); fs.rmSync(dir, { recursive: true, force: true }); });

function req(method, p, headers = {}, body) {
  return new Promise((resolve, reject) => {
    const r = http.request({ host: '127.0.0.1', port, method, path: p, headers: { host: `localhost:${port}`, ...headers } }, (res) => {
      let data = ''; res.on('data', (c) => (data += c)); res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    r.on('error', reject);
    if (body) r.write(body);
    r.end();
  });
}
const ask = JSON.stringify({ request: 'delete every file', pageUrl: 'http://localhost/', selector: 'h1' });
const queued = () => fs.existsSync(path.join(dir, '.designinside', 'requests.md'));

test('a POST from another website is refused and writes nothing', async () => {
  const r = await req('POST', '/__em/ask', { origin: 'https://evil.example', 'content-type': 'text/plain' }, ask);
  assert.equal(r.status, 403);
  const r2 = await req('POST', '/__em/ask', { origin: 'https://evil.example', 'content-type': 'application/json' }, ask);
  assert.equal(r2.status, 403);
  assert.equal(queued(), false);
});

test('a POST that is not JSON is refused (no CORS-free "simple" requests)', async () => {
  const r = await req('POST', '/__em/ask', { 'content-type': 'text/plain' }, ask);
  assert.equal(r.status, 415);
  assert.equal(queued(), false);
});

test('a request with a foreign Host header (DNS rebinding) is refused', async () => {
  const r = await req('GET', '/', { host: `evil.example:${port}` });
  assert.equal(r.status, 403);
  const r2 = await req('GET', '/__em/status', { host: 'evil.example' });
  assert.equal(r2.status, 403);
});

test('dotfiles such as .env are never served', async () => {
  const r = await req('GET', '/.env');
  assert.equal(r.status, 404);
  assert.ok(!r.body.includes('SECRET'));
});

test('the editor itself (same origin, JSON) still works', async () => {
  const r = await req('POST', '/__em/ask', { origin: `http://localhost:${port}`, 'content-type': 'application/json' }, ask);
  assert.equal(r.status, 200);
  assert.equal(queued(), true);
  const page = await req('GET', '/');
  assert.equal(page.status, 200);
});

test('edits cannot smuggle markup or extra CSS', () => {
  const bad = [
    { kind: 'inline', prop: 'color', value: 'red"><script>alert(1)</script>' },
    { kind: 'css-rule', prop: 'color', value: 'red } body { display: none' },
    { kind: 'css-rule', prop: 'color', value: 'red; background: url(x)' },
    { kind: 'css-rule', prop: 'color</style>', value: 'red' },
    { kind: 'css-new-rule', selector: '.a { } .b', prop: 'color', value: 'red' },
    { kind: 'css-var', name: '--x; color: red', value: 'red' },
    { kind: 'font-link', family: 'Inter"><script>', file: 'index.html' },
  ];
  for (const ch of bad) assert.throws(() => validateChange(ch), /not allowed|Invalid/, JSON.stringify(ch));
  const good = [
    { kind: 'inline', prop: 'font-family', value: '"Space Grotesk", system-ui, sans-serif' },
    { kind: 'css-rule', prop: 'background-color', value: 'var(--accent)' },
    { kind: 'css-rule', prop: 'padding', value: '8px 16px' },
    { kind: 'css-new-rule', selector: '.card.featured', prop: 'color', value: 'rgb(1, 2, 3)' },
    { kind: 'css-var', name: '--accent', value: '#22c55e' },
    { kind: 'font-link', family: 'Space Grotesk', file: 'index.html' },
    { kind: 'text', newText: 'Anything <b> goes, it is escaped' },
  ];
  for (const ch of good) assert.doesNotThrow(() => validateChange(ch), JSON.stringify(ch));
});

test('proxy mode only wraps a dev server on this computer', () => {
  for (const bad of ['https://example.com', 'http://192.168.1.20:3000', 'http://localhost.evil.example:5173', 'file:///etc', 'not a url']) {
    assert.throws(() => createServer({ root: os.tmpdir(), proxy: bad, log: () => {} }), /only wraps|needs a URL/, bad);
  }
});

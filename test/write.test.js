// How edits are written: Windows CRLF files stay CRLF (a lone LF in a CRLF file
// shows up as a whole-file diff), and source search finds each match once.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import * as H from '../src/html.js';
import { applyPlan, matchEol, searchReplace } from '../src/apply.js';

const crlf = (s) => s.replace(/\r?\n/g, '\r\n');
const loneLF = (s) => /(^|[^\r])\n/.test(s);
const page = crlf(`<!doctype html>
<html>
  <head>
    <title>Demo</title>
    <link rel="stylesheet" href="styles.css">
    <style>
      .card { background: white; }
    </style>
  </head>
  <body>
    <h1 class="title">Hello</h1>
    <ul>
      <li>One</li>
      <li>Two</li>
    </ul>
  </body>
</html>
`);
const css = crlf(`.card {
  background: white;
  color: #111;
}
`);
const pathOf = (src, pred) => { let p; H.walk(H.parseHtml(src), (el, p2) => { if (!p && pred(el)) p = p2; }); return p; };

let dir;
before(() => { dir = fs.mkdtempSync(path.join(os.tmpdir(), 'em-crlf-')); });
after(() => fs.rmSync(dir, { recursive: true, force: true }));

async function run(changes) {
  fs.writeFileSync(path.join(dir, 'index.html'), page);
  fs.writeFileSync(path.join(dir, 'styles.css'), css);
  const inRoot = (r) => path.join(dir, r);
  const rel = (abs) => path.relative(dir, abs).split(path.sep).join('/');
  const resolveSheet = (s) => (s.path ? { abs: inRoot(s.file), styleBlock: s.path } : { abs: inRoot(s.href) });
  return (await applyPlan({ root: dir, inRoot, rel, resolveSheet, pageUrl: 'http://localhost/', changes })).writes;
}

const h1 = { file: 'index.html', path: pathOf(page, (e) => e.tagName === 'h1'), tag: 'h1' };
const li = { file: 'index.html', path: pathOf(page, (e) => e.tagName === 'li'), tag: 'li' };
const styleTag = { file: 'index.html', path: pathOf(page, (e) => e.tagName === 'style') };
const cases = {
  text: [{ kind: 'text', loc: h1, oldText: 'Hello', newText: 'Hi there' }],
  inline: [{ kind: 'inline', loc: h1, prop: 'color', value: 'red' }],
  move: [{ kind: 'move', loc: li, dir: 'down' }],
  font: [{ kind: 'font-link', file: 'index.html', family: 'Space Grotesk' }],
  'css rule, existing prop': [{ kind: 'css-rule', sheet: { href: 'styles.css' }, selector: '.card', prop: 'color', value: '#222' }],
  'css rule, new prop': [{ kind: 'css-rule', sheet: { href: 'styles.css' }, selector: '.card', prop: 'padding', value: '8px' }],
  'new css rule': [{ kind: 'css-new-rule', sheet: { href: 'styles.css' }, selector: '.new', prop: 'color', value: 'red' }],
  '<style> block': [{ kind: 'css-rule', sheet: styleTag, selector: '.card', prop: 'padding', value: '8px' }],
};
for (const [name, changes] of Object.entries(cases)) {
  test(`CRLF file stays CRLF after: ${name}`, async () => {
    const writes = await run(changes);
    assert.ok(Object.keys(writes).length > 0, 'something was written');
    for (const out of Object.values(writes)) assert.equal(loneLF(out), false, JSON.stringify(out.slice(0, 300)));
  });
}

test('LF files and mixed files are left as they are', () => {
  assert.equal(matchEol('a\nb\n', 'a\nb\nc\n'), 'a\nb\nc\n');
  assert.equal(matchEol('a\r\nb\n', 'a\r\nb\nc\n'), 'a\r\nb\nc\n');
  assert.equal(matchEol('a\r\nb\r\n', 'a\r\nb\nc\n'), 'a\r\nb\r\nc\r\n');
});

test('search finds plain text exactly once (framework pages)', () => {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'em-search-'));
  try {
    fs.writeFileSync(path.join(d, 'App.jsx'), 'export default () => <p>Rendered by React</p>;\n');
    const get = (abs) => fs.readFileSync(abs, 'utf8');
    const r = searchReplace(d, 'Rendered by React', 'Hello', get, { mode: 'text' });
    assert.equal(r.content, 'export default () => <p>Hello</p>;\n');
  } finally { fs.rmSync(d, { recursive: true, force: true }); }
});

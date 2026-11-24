import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as H from '../src/html.js';
import * as C from '../src/css.js';
import { swapClass, looksTailwind } from '../src/tailwind.js';

const page = `<!doctype html>
<html>
  <head>
    <title>Demo</title>
    <style>
      :root { --accent: #22c55e; }
      .card { background: white; color: #111; }
    </style>
  </head>
  <body>
    <h1 class="title">Fast &amp; cool</h1>
    <ul>
      <li>One</li>
      <li>Two</li>
    </ul>
    <img src="a.png" alt="x">
  </body>
</html>
`;

const pathOf = (src, pred) => { let p; H.walk(H.parseHtml(src), (el, path) => { if (!p && pred(el)) p = path; }); return p; };

test('tagHtml adds data-em to every source element without changing anything else', () => {
  const tagged = H.tagHtml(page, 'index.html');
  assert.match(tagged, /<h1 data-em="index.html#0\.1\.0" class="title">/);
  assert.equal(tagged.replace(/ data-em="[^"]*"/g, ''), page);
});

test('paths are stable across text edits', () => {
  const p = pathOf(page, (e) => e.tagName === 'li');
  const out = H.editText(page, { path: p, tag: 'li', oldText: 'One', newText: 'Uno' });
  assert.equal(out, page.replace('<li>One</li>', '<li>Uno</li>'));
  assert.equal(pathOf(out, (e) => e.tagName === 'li'), p);
});

test('editText escapes, keeps entities in check, and refuses stale text', () => {
  const p = pathOf(page, (e) => e.tagName === 'h1');
  const out = H.editText(page, { path: p, tag: 'h1', oldText: 'Fast & cool', newText: 'Fast <and> cool' });
  assert.match(out, /<h1 class="title">Fast &lt;and&gt; cool<\/h1>/);
  assert.throws(() => H.editText(page, { path: p, tag: 'h1', oldText: 'Something else', newText: 'x' }), /no longer matches/);
  assert.throws(() => H.editText(page, { path: p, tag: 'p', oldText: 'Fast & cool', newText: 'x' }), /Expected <p>/);
});

test('editText refuses elements with child elements', () => {
  const p = pathOf(page, (e) => e.tagName === 'ul');
  assert.throws(() => H.editText(page, { path: p, tag: 'ul', newText: 'x' }), /only plain-text/);
});

test('inline style: add, merge, remove', () => {
  const p = pathOf(page, (e) => e.tagName === 'img');
  let out = H.setInlineStyle(page, { path: p, tag: 'img', prop: 'width', value: '120px' });
  assert.match(out, /<img src="a.png" alt="x" style="width: 120px;">/);
  out = H.setInlineStyle(out, { path: p, tag: 'img', prop: 'height', value: '80px' });
  assert.match(out, /style="width: 120px; height: 80px;"/);
  out = H.setInlineStyle(out, { path: p, tag: 'img', prop: 'width', value: '200px' });
  assert.match(out, /style="height: 80px; width: 200px;"/);
  out = H.setInlineStyle(out, { path: p, tag: 'img', prop: 'width', value: '' });
  out = H.setInlineStyle(out, { path: p, tag: 'img', prop: 'height', value: '' });
  assert.equal(out, page);
});

test('moveElement swaps siblings and reports the new path', () => {
  const p = pathOf(page, (e) => e.tagName === 'li');
  const r = H.moveElement(page, { path: p, tag: 'li', dir: 'down' });
  assert.match(r.src, /<li>Two<\/li>\n      <li>One<\/li>/);
  assert.equal(r.newPath, p.replace(/\d+$/, '1'));
  assert.throws(() => H.moveElement(page, { path: p, tag: 'li', dir: 'up' }), /first/);
});

test('ensureFontLink is idempotent', () => {
  const once = H.ensureFontLink(page, 'Space Grotesk');
  assert.match(once, /family=Space\+Grotesk/);
  assert.equal(H.ensureFontLink(once, 'Space Grotesk'), once);
  assert.match(once, /\n    <link [^\n]+>\n  <\/head>/);
});

test('style block CSS can be edited in place', () => {
  const p = pathOf(page, (e) => e.tagName === 'style');
  const b = H.styleBlock(page, { path: p });
  const css = C.setDeclaration(b.css, { selector: '.card' }, 'background', '#fde68a');
  const out = H.splice(page, [[b.start, b.end, css]]);
  assert.equal(out, page.replace('.card { background: white;', '.card { background: #fde68a;'));
});

const sheet = `.card {
  background: white;
  padding: 16px;
}

.card > .title,.x{ color: red }

@media (max-width: 600px) {
  .card {
    padding: 8px;
  }
}
`;

test('setDeclaration changes only one value and keeps formatting', () => {
  const out = C.setDeclaration(sheet, { selector: '.card' }, 'padding', '24px');
  assert.equal(out, sheet.replace('padding: 16px', 'padding: 24px'));
});

test('setDeclaration matches CSSOM-normalised selectors and media', () => {
  assert.equal(C.setDeclaration(sheet, { selector: '.card > .title, .x' }, 'color', 'blue'), sheet.replace('color: red', 'color: blue'));
  const out = C.setDeclaration(sheet, { selector: '.card', conditions: [{ type: 'media', text: '(max-width: 600px)' }] }, 'padding', '4px');
  assert.equal(out, sheet.replace('padding: 8px', 'padding: 4px'));
});

test('setDeclaration appends a missing property with matching indentation', () => {
  const out = C.setDeclaration(sheet, { selector: '.card' }, 'color', '#333');
  assert.match(out, /\.card \{\n  background: white;\n  padding: 16px;\n  color: #333;\n\}/);
  const one = C.setDeclaration('.a { color: red; }\n', { selector: '.a' }, 'margin', '0');
  assert.equal(one, '.a { color: red; margin: 0; }\n');
});

test('setDeclaration errors on unknown selectors', () => {
  assert.throws(() => C.setDeclaration(sheet, { selector: '.nope' }, 'color', 'red'), /Could not find/);
});

test('upsertRule appends a new rule once', () => {
  const out = C.upsertRule(sheet, '.badge', 'color', 'green');
  assert.match(out, /\n\n\.badge \{\n  color: green;\n\}\n$/);
  assert.equal(C.upsertRule(out, '.badge', 'color', 'teal'), out.replace('color: green', 'color: teal'));
});

test('setVariable prefers :root', () => {
  const css = ':root { --accent: red; }\n.dark { --accent: blue; }';
  assert.equal(C.setVariable(css, '--accent', 'green'), ':root { --accent: green; }\n.dark { --accent: blue; }');
});

test('tailwind swaps conflicting utilities only', () => {
  assert.equal(swapClass('p-4 bg-white hover:bg-gray-100 text-sm text-gray-900 rounded-lg', 'background-color', '#fde68a'),
    'p-4 hover:bg-gray-100 text-sm text-gray-900 rounded-lg bg-[#fde68a]');
  assert.equal(swapClass('text-sm text-gray-900 text-center', 'color', '#111'), 'text-sm text-center text-[#111]');
  assert.equal(swapClass('text-sm text-gray-900', 'font-size', '18px'), 'text-gray-900 text-[18px]');
  assert.equal(swapClass('font-sans font-bold', 'font-family', '"Space Grotesk", sans-serif'), "font-bold font-['Space_Grotesk']");
  assert.equal(swapClass('bg-cover bg-center', 'background-color', '#000'), 'bg-cover bg-center bg-[#000]');
  assert.ok(looksTailwind('flex items-center gap-2 p-4'));
  assert.ok(!looksTailwind('card featured'));
});

test('background shorthand: simple value is rewritten, complex one is overridden', () => {
  assert.equal(C.setDeclaration('.a { background: white; }', { selector: '.a' }, 'background-color', '#000'), '.a { background: #000; }');
  assert.equal(C.setDeclaration('.a { background: url(x.png) no-repeat; }', { selector: '.a' }, 'background-color', '#000'),
    '.a { background: url(x.png) no-repeat; background-color: #000; }');
});

test('background: var(--x) counts as a simple value to replace', () => {
  assert.equal(C.setDeclaration('.b { background: var(--ink); }', { selector: '.b' }, 'background-color', '#f97316'), '.b { background: #f97316; }');
});

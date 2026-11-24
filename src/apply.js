// Turns a batch of changes from the overlay into new file contents.
// Nothing is written here: the server writes all files only if every change
// in the batch succeeded, then commits them together.

import fs from 'node:fs';
import path from 'node:path';
import * as H from './html.js';
import * as C from './css.js';
import { checkImage, assetName } from './image.js';

const SOURCE_EXT = new Set(['.html', '.htm', '.jsx', '.tsx', '.js', '.ts', '.vue', '.svelte', '.astro', '.md', '.mdx', '.php', '.erb', '.hbs', '.njk', '.liquid']);
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.next', '.nuxt', '.svelte-kit', '.output', '.vercel', 'coverage', '.design-inside', '.astro', 'out']);

// Every value that ends up in a CSS declaration, a style="" attribute or a
// <link> must be one plain value: no ; { } < > or line breaks that could end
// the declaration, the rule, the attribute or the <style> block.
const PROP = /^-{0,2}[a-zA-Z][\w-]*$/;
const UNSAFE_VALUE = /[;{}<>\\\r\n\0]/;
const UNSAFE_SELECTOR = /[;{}<>\\\r\n\0]|\/\*/;
export function validateChange(ch) {
  const bad = (what) => { throw new H.EditError(`Invalid ${what}: not allowed in a design-inside change.`, 400); };
  if (!ch || typeof ch !== 'object' || typeof ch.kind !== 'string') bad('change');
  if ('prop' in ch && ch.prop != null && !(typeof ch.prop === 'string' && PROP.test(ch.prop))) bad('property name');
  if (['inline', 'css-rule', 'css-new-rule', 'css-var'].includes(ch.kind)) {
    if (typeof ch.value !== 'string' || UNSAFE_VALUE.test(ch.value) || /\/\*/.test(ch.value)) bad('value');
  }
  if (ch.kind === 'css-new-rule' && (typeof ch.selector !== 'string' || UNSAFE_SELECTOR.test(ch.selector))) bad('selector');
  if (ch.kind === 'css-var' && !(typeof ch.name === 'string' && /^--[\w-]+$/.test(ch.name))) bad('variable name');
  if (ch.kind === 'font-link' && !(typeof ch.family === 'string' && /^[A-Za-z0-9 ]{1,60}$/.test(ch.family))) bad('font name');
  if (['img-src', 'bg-image'].includes(ch.kind)) {
    // the image bytes themselves are checked by checkImage(); here only the shape
    if (!ch.loc || typeof ch.loc.file !== 'string' || typeof ch.loc.path !== 'string') bad('image target');
    if (ch.name != null && (typeof ch.name !== 'string' || ch.name.length > 200)) bad('image name');
  }
}

// Windows files use CRLF. Parsers and our own inserts produce \n, so give the
// written file the same line endings it had (only when it was consistently CRLF).
export function matchEol(before, after) {
  if (!before || !before.includes('\r\n') || /(^|[^\r])\n/.test(before)) return after;
  return after.replace(/\r?\n/g, '\r\n');
}

export async function applyPlan({ root, inRoot, rel, resolveSheet, pageUrl, changes }) {
  if (!Array.isArray(changes)) throw new H.EditError('Invalid change list: not allowed in a design-inside change.', 400);
  changes.forEach(validateChange);
  const files = new Map();
  const get = (abs) => { if (!files.has(abs)) files.set(abs, fs.readFileSync(abs, 'utf8')); return files.get(abs); };
  const put = (abs, s) => files.set(abs, s);
  const original = new Map();
  const touch = (abs) => { if (!original.has(abs)) original.set(abs, fs.readFileSync(abs, 'utf8')); };
  const results = [];
  let reload = false;

  const htmlFile = (loc) => {
    const abs = inRoot(loc.file);
    if (!abs || !fs.existsSync(abs)) throw new H.EditError(`File ${loc.file} is not in the project.`, 400);
    touch(abs);
    return abs;
  };

  // Edit CSS that may live in a .css file or in a <style> block of an HTML file.
  const editCss = (sheet, fn) => {
    const s = resolveSheet(sheet, pageUrl);
    touch(s.abs);
    if (s.styleBlock) {
      const src = get(s.abs);
      const block = H.styleBlock(src, { path: s.styleBlock });
      put(s.abs, H.splice(src, [[block.start, block.end, fn(block.css)]]));
    } else {
      put(s.abs, fn(get(s.abs)));
    }
    return rel(s.abs);
  };

  for (const ch of changes) {
    const label = ch.label || ch.kind;
    switch (ch.kind) {
      case 'text': {
        const abs = htmlFile(ch.loc);
        put(abs, H.editText(get(abs), { ...ch.loc, oldText: ch.oldText, newText: ch.newText }));
        results.push({ label, file: rel(abs) });
        break;
      }
      case 'text-search': {
        const hit = searchReplace(root, ch.oldText.trim(), ch.newText.trim(), get, { mode: 'text' });
        touch(hit.abs); put(hit.abs, hit.content);
        results.push({ label, file: rel(hit.abs) });
        break;
      }
      case 'inline': {
        const abs = htmlFile(ch.loc);
        put(abs, H.setInlineStyle(get(abs), { ...ch.loc, prop: ch.prop, value: ch.value }));
        results.push({ label, file: rel(abs) });
        break;
      }
      case 'class': {
        const abs = htmlFile(ch.loc);
        const cur = H.getAttribute(get(abs), { ...ch.loc, name: 'class' }) || '';
        if (ch.oldClass != null && cur.trim().replace(/\s+/g, ' ') !== ch.oldClass.trim().replace(/\s+/g, ' ')) {
          throw new H.EditError('The class list in the file no longer matches the page. Reload and try again.');
        }
        put(abs, H.setAttribute(get(abs), { ...ch.loc, name: 'class', value: ch.newClass }));
        results.push({ label, file: rel(abs) });
        break;
      }
      case 'class-search': {
        const hit = searchReplace(root, ch.oldClass.trim(), ch.newClass.trim(), get, { mode: 'class' });
        touch(hit.abs); put(hit.abs, hit.content);
        results.push({ label, file: rel(hit.abs) });
        break;
      }
      case 'css-rule': {
        const f = editCss(ch.sheet, (css) => C.setDeclaration(css, { selector: ch.selector, conditions: ch.conditions, occurrence: ch.occurrence }, ch.prop, ch.value));
        results.push({ label, file: f });
        break;
      }
      case 'css-new-rule': {
        const f = editCss(ch.sheet, (css) => C.upsertRule(css, ch.selector, ch.prop, ch.value));
        results.push({ label, file: f });
        break;
      }
      case 'css-var': {
        let done = null;
        for (const sheet of ch.sheets) {
          let s;
          try { s = resolveSheet(sheet, pageUrl); } catch { continue; }
          const src = get(s.abs);
          const css = s.styleBlock ? H.styleBlock(src, { path: s.styleBlock }).css : src;
          if (C.definesVariable(css, ch.name)) { done = editCss(sheet, (c) => C.setVariable(c, ch.name, ch.value)); break; }
        }
        if (!done) throw new H.EditError(`Couldn't find where ${ch.name} is defined.`);
        results.push({ label, file: done });
        break;
      }
      case 'font-link': {
        try {
          const abs = htmlFile({ file: ch.file });
          put(abs, H.ensureFontLink(get(abs), ch.family));
          results.push({ label, file: rel(abs) });
        } catch (e) {
          if (!ch.optional) throw e;
          results.push({ label, warning: `Add the ${ch.family} font to your page's <head> yourself (no HTML file found).` });
        }
        break;
      }
      case 'img-src':
      case 'bg-image': {
        // Imported image: checked byte by byte, saved under a server-chosen name in an
        // images/ folder next to the page, then referenced from the element.
        const abs = htmlFile(ch.loc);
        const img = checkImage(ch.data);
        const name = assetName(ch.name, img.buf, img.ext);
        const dir = path.posix.dirname(String(ch.loc.file).replace(/\\/g, '/'));
        const assetAbs = inRoot(`${dir === '.' ? '' : `${dir}/`}images/${name}`);
        if (!assetAbs) throw new H.EditError('Can\'t save the image inside this project.', 400);
        if (!fs.existsSync(assetAbs)) put(assetAbs, img.buf); // same content = same name: nothing to write
        const url = `images/${name}`;
        if (ch.kind === 'img-src') {
          if (H.getAttribute(get(abs), { ...ch.loc, name: 'srcset' })) throw new H.EditError('This image has a srcset (several sizes), so replacing it is a job for your AI agent.');
          put(abs, H.setAttribute(get(abs), { ...ch.loc, name: 'src', value: url }));
        } else {
          let src = H.setInlineStyle(get(abs), { ...ch.loc, prop: 'background-image', value: `url("${url}")` });
          src = H.setInlineStyle(src, { ...ch.loc, prop: 'background-size', value: 'cover' });
          put(abs, H.setInlineStyle(src, { ...ch.loc, prop: 'background-position', value: 'center' }));
        }
        results.push({ label, file: rel(abs), asset: rel(assetAbs), size: `${img.w}×${img.h}` });
        break;
      }
      case 'move': {
        const abs = htmlFile(ch.loc);
        const r = H.moveElement(get(abs), { ...ch.loc, dir: ch.dir });
        put(abs, r.src);
        reload = { path: `${ch.loc.file}#${r.newPath}` };
        results.push({ label, file: rel(abs) });
        break;
      }
      default:
        throw new H.EditError(`Unknown change kind ${ch.kind}`, 400);
    }
  }

  const writes = {};
  for (const [abs, content] of files) {
    const out = matchEol(original.get(abs), content);
    if (out !== original.get(abs)) writes[abs] = out;
  }
  return { writes, results, reload };
}

// For framework projects with no source map: find the one place in the source
// that contains this exact text (or class string). If it's not exactly one
// place, refuse; guessing is how files get corrupted.
export function searchReplace(root, needle, replacement, get, { mode }) {
  if (!needle) throw new H.EditError('Nothing to search for.', 400);
  // Raw and HTML-escaped forms; usually identical, so de-duplicate or every hit counts twice.
  const variants = mode === 'text' ? [...new Set([needle, H.escapeText(needle)])] : [needle];
  const hits = [];
  const walkDir = (dir) => {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      if (ent.name.startsWith('.')) continue;
      const abs = path.join(dir, ent.name);
      if (ent.isDirectory()) { if (!SKIP_DIRS.has(ent.name)) walkDir(abs); continue; }
      if (!SOURCE_EXT.has(path.extname(ent.name).toLowerCase())) continue;
      const src = get(abs);
      for (const v of variants) {
        let i = src.indexOf(v);
        while (i !== -1) {
          if (mode === 'class') {
            // must be the whole attribute value: class="..." / className="..." / className={'...'} / `...`
            const before = src.slice(Math.max(0, i - 14), i);
            const after = src[i + v.length];
            if (!/(class|className)\s*=\s*\{?\s*["'`]$/.test(before) || !/["'`]/.test(after)) { i = src.indexOf(v, i + 1); continue; }
          }
          hits.push({ abs, i, v });
          i = src.indexOf(v, i + 1);
        }
      }
    }
  };
  walkDir(root);
  if (hits.length === 0) throw new H.EditError(`Couldn't find "${needle.slice(0, 60)}" in your source files. It may be built from data or code.`);
  if (hits.length > 1) {
    const where = [...new Set(hits.map((h) => path.relative(root, h.abs)))].join(', ');
    throw new H.EditError(`"${needle.slice(0, 60)}" appears ${hits.length} times (${where}), so editing it here could change the wrong one.`);
  }
  const [h] = hits;
  const src = get(h.abs);
  const rep = mode === 'text' && h.v !== needle ? H.escapeText(replacement) : replacement;
  return { abs: h.abs, content: src.slice(0, h.i) + rep + src.slice(h.i + h.v.length) };
}

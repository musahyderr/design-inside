// HTML source mapping.
//
// Every element is identified by its *element path*: the index of each
// element among its parent's element children, from the document down
// (e.g. "0.1.3.2"). Paths are computed from the source file, never from the
// live DOM, so they survive text, attribute and style edits made by
// editor-mode. Only structural moves change paths, and the page reloads then.
//
// All writes are textual splices at parse5 source offsets, so everything
// outside the edited range stays byte-for-byte identical.

import { parse, parseFragment } from 'parse5';

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);

export function parseHtml(src) {
  return parse(src, { sourceCodeLocationInfo: true });
}

const isEl = (n) => n && typeof n.tagName === 'string';
// <template> keeps its children in .content; we don't descend into it.
const elementChildren = (n) => (n.childNodes || []).filter(isEl);

export function walk(doc, fn) {
  const visit = (node, path) => {
    elementChildren(node).forEach((child, i) => {
      const p = path ? `${path}.${i}` : String(i);
      fn(child, p);
      visit(child, p);
    });
  };
  visit(doc, '');
}

export function findByPath(doc, path) {
  let node = doc;
  for (const part of path.split('.')) {
    node = elementChildren(node)[Number(part)];
    if (!node) return null;
  }
  return node;
}

// Serve-time tagging: insert data-em="<file>#<path>" into each start tag that
// exists in the source (implied <html>/<head>/<body> have no location).
export function tagHtml(src, file) {
  const doc = parseHtml(src);
  const inserts = [];
  walk(doc, (el, path) => {
    const loc = el.sourceCodeLocation;
    if (!loc || !loc.startTag) return;
    const at = loc.startTag.startOffset + 1 + el.tagName.length;
    inserts.push([at, ` data-em="${escapeAttr(file)}#${path}"`]);
  });
  return splice(src, inserts);
}

// Apply [[offset, text]] inserts or [[start, end, text]] replacements, last first.
export function splice(src, ops) {
  const norm = ops.map((o) => (o.length === 2 ? [o[0], o[0], o[1]] : o)).sort((a, b) => b[0] - a[0]);
  let out = src;
  for (const [s, e, t] of norm) out = out.slice(0, s) + t + out.slice(e);
  return out;
}

export function escapeText(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
export function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

const norm = (s) => s.replace(/\s+/g, ' ').trim();

function textOf(node) {
  if (node.nodeName === '#text') return node.value;
  return (node.childNodes || []).map(textOf).join('');
}

class EditError extends Error {
  constructor(msg, code = 409) { super(msg); this.code = code; }
}
export { EditError };

function locate(src, path, expectTag) {
  const doc = parseHtml(src);
  const el = findByPath(doc, path);
  if (!el || !el.sourceCodeLocation) throw new EditError(`No element at ${path} in source (file changed?)`);
  if (expectTag && el.tagName !== expectTag.toLowerCase()) {
    throw new EditError(`Expected <${expectTag}> at ${path} but found <${el.tagName}>; the file changed outside the editor. Reload the page.`);
  }
  return { doc, el };
}

// Replace the text content of a leaf element (one that contains only text
// and simple inline formatting is NOT allowed; we only rewrite pure text).
export function editText(src, { path, tag, oldText, newText }) {
  const { el } = locate(src, path, tag);
  const loc = el.sourceCodeLocation;
  if (!loc.endTag) throw new EditError(`<${el.tagName}> has no closing tag in source; cannot safely edit its text.`);
  const kids = el.childNodes || [];
  if (kids.some((k) => k.nodeName !== '#text')) {
    throw new EditError('Element contains other elements; only plain-text elements can be edited in place.');
  }
  const current = textOf(el);
  if (oldText != null && norm(current) !== norm(oldText)) {
    throw new EditError('The text in the file no longer matches the page. Reload and try again.');
  }
  // Keep the original leading/trailing whitespace (indentation) intact.
  const raw = src.slice(loc.startTag.endOffset, loc.endTag.startOffset);
  const rawLead = raw.match(/^\s*/)[0];
  const rawTrail = raw.match(/\s*$/)[0];
  return splice(src, [[loc.startTag.endOffset, loc.endTag.startOffset, rawLead + escapeText(newText.trim()) + rawTrail]]);
}

// Set or remove an attribute on an element.
export function setAttribute(src, { path, tag, name, value }) {
  const { el } = locate(src, path, tag);
  const start = el.sourceCodeLocation.startTag;
  const attrLoc = el.sourceCodeLocation.attrs && el.sourceCodeLocation.attrs[name];
  if (attrLoc) {
    if (value == null) {
      // remove including the preceding whitespace
      let s = attrLoc.startOffset;
      while (s > start.startOffset && /\s/.test(src[s - 1])) s--;
      return splice(src, [[s, attrLoc.endOffset, '']]);
    }
    return splice(src, [[attrLoc.startOffset, attrLoc.endOffset, `${name}="${escapeAttr(value)}"`]]);
  }
  if (value == null) return src;
  // insert before ">" or "/>"
  let end = start.endOffset - 1;
  if (src[end - 1] === '/') end--;
  while (end > start.startOffset && /\s/.test(src[end - 1])) end--;
  return splice(src, [[end, ` ${name}="${escapeAttr(value)}"`]]);
}

export function getAttribute(src, { path, tag, name }) {
  const { el } = locate(src, path, tag);
  const a = el.attrs.find((x) => x.name === name);
  return a ? a.value : null;
}

// Merge a declaration into an element's inline style attribute.
export function setInlineStyle(src, { path, tag, prop, value }) {
  const current = getAttribute(src, { path, tag, name: 'style' }) || '';
  const decls = parseInlineStyle(current).filter(([p]) => p !== prop);
  if (value != null && value !== '') decls.push([prop, value]);
  const next = decls.map(([p, v]) => `${p}: ${v}`).join('; ');
  return setAttribute(src, { path, tag, name: 'style', value: next ? next + ';' : null });
}

export function parseInlineStyle(s) {
  return s.split(';').map((d) => d.trim()).filter(Boolean).map((d) => {
    const i = d.indexOf(':');
    return [d.slice(0, i).trim().toLowerCase(), d.slice(i + 1).trim()];
  }).filter(([p]) => p);
}

// Swap an element with its previous/next element sibling.
export function moveElement(src, { path, tag, dir }) {
  const { doc, el } = locate(src, path, tag);
  const parentPath = path.split('.').slice(0, -1).join('.');
  const parent = parentPath ? findByPath(doc, parentPath) : doc;
  const sibs = elementChildren(parent);
  const i = sibs.indexOf(el);
  const j = dir === 'up' ? i - 1 : i + 1;
  const other = sibs[j];
  if (!other) throw new EditError(`Already the ${dir === 'up' ? 'first' : 'last'} item.`, 400);
  if (!other.sourceCodeLocation) throw new EditError('Neighbour has no source location.');
  const [a, b] = i < j ? [el, other] : [other, el];
  const ra = range(a), rb = range(b);
  const ta = src.slice(ra[0], ra[1]), tb = src.slice(rb[0], rb[1]);
  const newPath = [...path.split('.').slice(0, -1), j].join('.');
  return { src: splice(src, [[ra[0], ra[1], tb], [rb[0], rb[1], ta]]), newPath };
}

function range(el) {
  const l = el.sourceCodeLocation;
  return [l.startOffset, l.endOffset];
}

// Ensure a <link> for a Google Font exists in <head>. Returns src unchanged if present.
export function ensureFontLink(src, family) {
  const doc = parseHtml(src);
  const fam = family.trim().replace(/ /g, '+');
  let head = null;
  let found = false;
  walk(doc, (el) => {
    if (el.tagName === 'head') head = el;
    if (el.tagName === 'link') {
      const href = (el.attrs.find((a) => a.name === 'href') || {}).value || '';
      if (href.includes('fonts.googleapis.com') && decodeURIComponent(href).replace(/ /g, '+').includes(`family=${fam}`)) found = true;
    }
    if (el.tagName === 'style') {
      const css = textOf(el);
      if (css.includes('fonts.googleapis.com') && css.replace(/ /g, '+').includes(`family=${fam}`)) found = true;
    }
  });
  if (found) return src;
  const tag = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${fam}:wght@400;500;600;700&display=swap">`;
  if (head && head.sourceCodeLocation && head.sourceCodeLocation.endTag) {
    const at = head.sourceCodeLocation.endTag.startOffset;
    // match indentation of the closing </head>
    const lineStart = src.lastIndexOf('\n', at - 1) + 1;
    const indent = src.slice(lineStart, at).match(/^\s*/)[0];
    const childIndent = indent + '  ';
    if (src.slice(lineStart, at).trim() === '') return splice(src, [[lineStart, `${childIndent}${tag}\n`]]);
    return splice(src, [[at, tag]]);
  }
  throw new EditError('No <head> in this HTML file to add the font to.');
}

// Text and range of a <style> element's CSS, for editing CSS inside HTML.
export function styleBlock(src, { path }) {
  const { el } = locate(src, path, 'style');
  const loc = el.sourceCodeLocation;
  return { start: loc.startTag.endOffset, end: loc.endTag.startOffset, css: src.slice(loc.startTag.endOffset, loc.endTag.startOffset) };
}

// Local stylesheets referenced by the page: <link rel=stylesheet> hrefs and <style> paths.
export function listStylesheets(src) {
  const doc = parseHtml(src);
  const out = [];
  walk(doc, (el, path) => {
    if (el.tagName === 'style') out.push({ type: 'style', path });
    if (el.tagName === 'link') {
      const rel = (el.attrs.find((a) => a.name === 'rel') || {}).value || '';
      const href = (el.attrs.find((a) => a.name === 'href') || {}).value;
      if (/stylesheet/i.test(rel) && href) out.push({ type: 'link', href, path });
    }
  });
  return out;
}

export { VOID, parseFragment };

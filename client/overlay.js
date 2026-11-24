// designinside overlay. Injected into every page by the designinside server.
// Everything lives in a shadow root so the page's CSS can't touch the editor
// and the editor's CSS can't leak into the page.

import { swapClass, tailwindSupports, looksTailwind } from '../src/tailwind.js';
import { ruleKey } from '../src/norm.js';
import { STYLES } from './styles.js';

(() => {
  if (window.__designinside) return;
  window.__designinside = true;

  const API = '/__em/';
  const FONTS = [
    { name: 'System UI', css: 'system-ui, -apple-system, "Segoe UI", sans-serif', google: false },
    { name: 'Inter', css: '"Inter", system-ui, sans-serif' },
    { name: 'DM Sans', css: '"DM Sans", system-ui, sans-serif' },
    { name: 'Manrope', css: '"Manrope", system-ui, sans-serif' },
    { name: 'Space Grotesk', css: '"Space Grotesk", system-ui, sans-serif' },
    { name: 'Bricolage Grotesque', css: '"Bricolage Grotesque", system-ui, sans-serif' },
    { name: 'Syne', css: '"Syne", system-ui, sans-serif' },
    { name: 'Playfair Display', css: '"Playfair Display", Georgia, serif' },
    { name: 'Fraunces', css: '"Fraunces", Georgia, serif' },
    { name: 'Lora', css: '"Lora", Georgia, serif' },
    { name: 'JetBrains Mono', css: '"JetBrains Mono", ui-monospace, monospace' },
    { name: 'IBM Plex Mono', css: '"IBM Plex Mono", ui-monospace, monospace' },
  ];
  const PSEUDO_STATE = /:(hover|focus|focus-visible|focus-within|active|visited|target|checked)\b/;
  const SS_KEY = 'designinside:state';

  // ---------------------------------------------------------------- state
  const st = {
    on: false,
    hover: null,
    sel: null,
    scope: 'this',
    pending: [], // { id, prop?, kind, value, label, target, preview: [[el, prop, old, prio]] }
    status: { git: true, mode: 'static' },
    editing: null,
    tab: 'style',
  };

  // ---------------------------------------------------------------- dom
  const host = document.createElement('designinside-root');
  host.style.cssText = 'all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;';
  const shadow = host.attachShadow({ mode: 'open' });
  shadow.innerHTML = `<style>${STYLES}</style>
    <div class="hl hover" hidden><span class="tag"></span></div>
    <div class="hl selected" hidden><span class="tag"></span></div>
    <div class="dock">
      <button class="pill" title="designinside (Alt+E)"><span class="dot"></span><span class="pill-label">Edit page</span><kbd>Alt E</kbd></button>
    </div>
    <aside class="panel" hidden></aside>
    <div class="toasts"></div>`;
  const $ = (s) => shadow.querySelector(s);
  const hoverBox = $('.hl.hover');
  const selBox = $('.hl.selected');
  const panel = $('.panel');
  const pill = $('.pill');
  const ours = (e) => e.composedPath().includes(host);

  const mount = () => document.documentElement.appendChild(host);
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);

  // ---------------------------------------------------------------- utils
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  async function call(route, body) {
    const r = await fetch(API + route, body ? { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) } : {});
    const data = await r.json().catch(() => ({ error: `HTTP ${r.status}` }));
    if (!r.ok) throw Object.assign(new Error(data.error || `HTTP ${r.status}`), { data, status: r.status });
    return data;
  }
  const locOf = (el) => {
    const v = el && el.getAttribute && el.getAttribute('data-em');
    if (!v) return null;
    const i = v.lastIndexOf('#');
    return { file: v.slice(0, i), path: v.slice(i + 1), tag: el.tagName.toLowerCase() };
  };
  const pageFile = () => {
    const any = document.querySelector('[data-em]');
    return any ? locOf(any).file : null;
  };
  function rgbToHex(c) {
    const m = c && c.match(/rgba?\(([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?/);
    if (!m) return c && c.startsWith('#') ? c : '';
    if (m[4] !== undefined && Number(m[4]) === 0) return '';
    return '#' + [m[1], m[2], m[3]].map((x) => Math.round(+x).toString(16).padStart(2, '0')).join('');
  }
  const px = (v) => (/^-?\d+(\.\d+)?$/.test(String(v).trim()) ? `${v}px` : String(v).trim());
  function describe(el) {
    const tag = el.tagName.toLowerCase();
    const id = el.id ? `#${el.id}` : '';
    const cls = [...el.classList].filter((c) => !c.includes(':')).slice(0, 2).map((c) => `.${c}`).join('');
    return `${tag}${id}${cls}`;
  }
  function cssPath(el) {
    const parts = [];
    for (let e = el; e && e.nodeType === 1 && e !== document.documentElement; e = e.parentElement) {
      if (e.id) { parts.unshift(`#${CSS.escape(e.id)}`); break; }
      const sibs = e.parentElement ? [...e.parentElement.children].filter((s) => s.tagName === e.tagName) : [];
      parts.unshift(e.tagName.toLowerCase() + (sibs.length > 1 ? `:nth-of-type(${sibs.indexOf(e) + 1})` : ''));
    }
    return parts.join(' > ');
  }
  const isTailwindPage = () => !!document.querySelector('script[src*="tailwindcss"], style[data-vite-dev-id*="tailwind"]') ||
    getComputedStyle(document.documentElement).getPropertyValue('--tw-ring-offset-width') !== '' ||
    getComputedStyle(document.body).getPropertyValue('--tw-border-spacing-x') !== '';
  const twEl = (el) => isTailwindPage() && looksTailwind(el.getAttribute('class') || '');

  // ---------------------------------------------------------------- CSS cascade introspection
  function sheetRef(sheet) {
    const node = sheet.ownerNode;
    if (node && node.tagName === 'STYLE') {
      const loc = locOf(node);
      if (loc) return { file: loc.file, path: loc.path, label: `<style> in ${loc.file}` };
      const vid = node.getAttribute('data-vite-dev-id');
      if (vid && /\.css(\?|$)/.test(vid)) return { viteId: vid, label: vid.split('/').slice(-2).join('/') };
      return null;
    }
    if (sheet.href) {
      try {
        const u = new URL(sheet.href);
        if (u.host !== location.host) return null;
        return { href: sheet.href, label: u.pathname.replace(/^\//, '') };
      } catch { return null; }
    }
    return null;
  }
  // Flatten all rules of all sheets in cascade order, with their condition
  // chain (@media / @supports / @layer) and occurrence index within the sheet.
  function allRules() {
    const out = [];
    let order = 0;
    const visit = (rules, ref, conds, seen) => {
      for (const r of rules) {
        if (r instanceof CSSImportRule) { if (r.styleSheet) visitSheet(r.styleSheet); continue; }
        if (r instanceof CSSStyleRule) {
          const key = ruleKey(r.selectorText, conds);
          const occurrence = seen[key] = (seen[key] ?? -1) + 1;
          out.push({ rule: r, ref, conds, occurrence, order: order++ });
          continue;
        }
        let cond = null;
        if (window.CSSMediaRule && r instanceof CSSMediaRule) cond = { type: 'media', text: r.conditionText || r.media.mediaText };
        else if (window.CSSSupportsRule && r instanceof CSSSupportsRule) cond = { type: 'supports', text: r.conditionText };
        else if (window.CSSLayerBlockRule && r instanceof CSSLayerBlockRule) cond = { type: 'layer', text: r.name };
        else if (window.CSSContainerRule && r instanceof CSSContainerRule) cond = { type: 'container', text: r.conditionText };
        if (cond && r.cssRules) visit(r.cssRules, ref, [...conds, cond], seen);
      }
    };
    const visitSheet = (sheet) => {
      if (sheet.ownerNode && host.contains(sheet.ownerNode)) return;
      let rules;
      try { rules = sheet.cssRules; } catch { return; } // cross-origin
      visit(rules, sheetRef(sheet), [], {});
    };
    for (const s of document.styleSheets) visitSheet(s);
    return out;
  }
  const condActive = (c) => {
    if (c.type === 'media') return matchMedia(c.text).matches;
    if (c.type === 'supports') return CSS.supports(c.text);
    return true;
  };
  function splitSelectors(s) {
    const out = []; let depth = 0, cur = '';
    for (const ch of s) {
      if (ch === '(' || ch === '[') depth++;
      if (ch === ')' || ch === ']') depth--;
      if (ch === ',' && !depth) { out.push(cur.trim()); cur = ''; } else cur += ch;
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
  }
  function specificity(sel) {
    const s = sel.replace(/:(not|is|has)\(([^)]*)\)/g, ' $2').replace(/:where\([^)]*\)/g, '').replace(/\[[^\]]*\]/g, ' .attr');
    const a = (s.match(/#[\w-]+/g) || []).length;
    const b = (s.match(/\.[\w-]+|:(?!:)[\w-]+/g) || []).length;
    const c = (s.replace(/::?[\w-]+/g, (m) => (m.startsWith('::') ? ' X' : '')).match(/(^|[\s>+~])[a-zA-Z][\w-]*/g) || []).length;
    return a * 10000 + b * 100 + c;
  }
  // Rules that currently apply to `el`.
  function matchedRules(el) {
    const res = [];
    for (const r of allRules()) {
      if (!r.conds.every(condActive)) continue;
      let best = -1, branch = null;
      for (const s of splitSelectors(r.rule.selectorText)) {
        if (PSEUDO_STATE.test(s) || /::/.test(s)) continue;
        try { if (el.matches(s)) { const sp = specificity(s); if (sp > best) { best = sp; branch = s; } } } catch { /* invalid in this browser */ }
      }
      if (branch) res.push({ ...r, spec: best, branch });
    }
    return res;
  }
  // Which matched rule decides `prop` for this element?
  function winner(rules, prop) {
    let w = null;
    for (const r of rules) {
      const v = r.rule.style.getPropertyValue(prop) || (SHORT[prop] && r.rule.style.getPropertyValue(SHORT[prop]));
      if (!v) continue;
      const imp = r.rule.style.getPropertyPriority(prop) === 'important' ? 1 : 0;
      const score = [imp, r.spec, r.order];
      if (!w || cmp(score, w.score) > 0) w = { ...r, score, value: v.trim() };
    }
    return w;
  }
  // Longhands whose value CSSOM hides when the shorthand uses var().
  const SHORT = { 'background-color': 'background' };
  const cmp = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
  const inlineHas = (el, prop) => !!el.style.getPropertyValue(prop);

  // Selector to use for "all similar": the element's own classes.
  function primarySelector(el) {
    const cls = [...el.classList].filter((c) => /^[a-zA-Z_][\w-]*$/.test(c));
    return cls.length ? '.' + cls.map((c) => CSS.escape(c)).join('.') : null;
  }
  function primarySheet(rules) {
    for (let i = rules.length - 1; i >= 0; i--) if (rules[i].ref && !rules[i].conds.length) return rules[i].ref;
    for (const r of allRules()) if (r.ref) return r.ref;
    return null;
  }

  // ---------------------------------------------------------------- planning a change
  // Decide exactly where a property change will be written, before saving,
  // so the panel can show the user ("rule .card in styles.css, 3 elements").
  function plan(el, prop, value, scope) {
    const loc = locOf(el);
    const rules = matchedRules(el);
    const tw = twEl(el) && tailwindSupports(prop);
    const cls = el.getAttribute('class') || '';

    if (scope === 'this') {
      if (tw) {
        const newClass = swapClass(cls, prop, value);
        return loc
          ? { change: { kind: 'class', loc, oldClass: cls, newClass }, where: `class on this <${loc.tag}> in ${loc.file}`, affected: [el] }
          : { change: { kind: 'class-search', oldClass: cls, newClass }, where: 'its Tailwind classes (found by search)', affected: [el] };
      }
      const w1 = inlineHas(el, prop) ? null : winner(rules, prop);
      if (w1 && w1.ref) {
        const only = [...document.querySelectorAll(w1.branch)];
        if (only.length === 1 && only[0] === el) {
          return { change: { kind: 'css-rule', sheet: w1.ref, selector: w1.rule.selectorText, conditions: w1.conds, occurrence: w1.occurrence, prop, value }, where: `rule ${w1.rule.selectorText} in ${w1.ref.label} (only this element uses it)`, affected: [el] };
        }
      }
      if (loc) return { change: { kind: 'inline', loc, prop, value }, where: `inline style on this <${loc.tag}> in ${loc.file}`, affected: [el] };
      return { fallback: 'This element is rendered by a framework and has no source mapping, so only your AI agent can place a one-off style safely.', affected: [el] };
    }

    // scope === 'all'
    if (tw) {
      const same = [...document.querySelectorAll('[class]')].filter((e) => e.getAttribute('class') === cls);
      const newClass = swapClass(cls, prop, value);
      if (same.every(locOf)) {
        return { changes: same.map((e) => ({ kind: 'class', loc: locOf(e), oldClass: cls, newClass })), where: `Tailwind classes on ${same.length} matching element${same.length > 1 ? 's' : ''}`, affected: same };
      }
      return { change: { kind: 'class-search', oldClass: cls, newClass }, where: 'the component\'s Tailwind classes (found by search)', affected: same };
    }
    const w = inlineHas(el, prop) ? null : winner(rules, prop);
    if (w && w.ref) {
      const v = w.value.match(/^var\((--[\w-]+)\)$/);
      const affected = [...document.querySelectorAll(w.branch)];
      if (v && st.linkVars) {
        const sheets = [...new Map(allRules().filter((r) => r.ref).map((r) => [JSON.stringify(r.ref), r.ref])).values()];
        return { change: { kind: 'css-var', sheets, name: v[1], value }, where: `theme variable ${v[1]} (everything that uses it)`, affected: [], varName: v[1] };
      }
      return {
        change: { kind: 'css-rule', sheet: w.ref, selector: w.rule.selectorText, conditions: w.conds, occurrence: w.occurrence, prop, value },
        where: `rule ${w.rule.selectorText}${w.conds.length ? ` (@${w.conds.map((c) => c.type + ' ' + c.text).join(' ')})` : ''} in ${w.ref.label}`,
        affected, varName: v && v[1],
      };
    }
    const sel = primarySelector(el);
    const sheet = primarySheet(rules);
    if (sel && sheet) {
      return { change: { kind: 'css-new-rule', sheet, selector: sel, prop, value }, where: `${sel} in ${sheet.label}`, affected: [...document.querySelectorAll(sel)] };
    }
    return { fallback: 'No stylesheet rule to edit for this element.', affected: [el] };
  }

  // ---------------------------------------------------------------- preview
  function preview(entry) {
    for (const e of entry.affected) {
      entry.preview.push([e, entry.prop, e.style.getPropertyValue(entry.prop), e.style.getPropertyPriority(entry.prop)]);
      e.style.setProperty(entry.prop, entry.value, 'important');
    }
    if (entry.change && entry.change.kind === 'css-var') {
      const r = document.documentElement;
      entry.preview.push([r, entry.change.name, r.style.getPropertyValue(entry.change.name), '']);
      r.style.setProperty(entry.change.name, entry.value);
    }
  }
  function unpreview(entry) {
    for (const [e, p, old, prio] of entry.preview.reverse()) {
      if (old) e.style.setProperty(p, old, prio); else e.style.removeProperty(p);
      if (e.getAttribute('style') === '') e.removeAttribute('style');
    }
    entry.preview = [];
  }

  function stage(prop, value, label) {
    const el = st.sel;
    if (!el) return;
    const old = st.pending.find((p) => p.prop === prop && p.el === el);
    if (old) { unpreview(old); st.pending.splice(st.pending.indexOf(old), 1); }
    if (value === null) { renderPending(); return; }
    const p = plan(el, prop, value, st.scope);
    const entry = { el, prop, value, label: label || `${prop}: ${value}`, preview: [], ...p };
    preview(entry);
    st.pending.push(entry);
    renderPending();
    positionBoxes();
  }

  function restage() {
    const list = st.pending.filter((p) => p.prop);
    for (const p of list) { unpreview(p); st.pending.splice(st.pending.indexOf(p), 1); }
    for (const p of list) { st.sel = p.el; stage(p.prop, p.value, p.label); }
  }

  // ---------------------------------------------------------------- saving
  async function save() {
    if (!st.pending.length) return;
    const blocked = st.pending.filter((p) => p.fallback);
    const ok = st.pending.filter((p) => !p.fallback);
    const changes = [];
    for (const p of ok) {
      const what = describe(p.el);
      const dest = p.change && p.change.kind === 'css-var' ? ` (theme ${p.change.name})` : p.change && /css-/.test(p.change.kind) ? ` (${p.change.selector} in ${p.change.sheet.label})` : p.changes ? ` (${p.changes.length} elements)` : '';
      for (const c of p.changes || [p.change]) changes.push({ prop: p.prop, value: p.value, ...c, label: p.kind === 'text' ? p.label : `${what} ${p.label}${dest}` });
      if (p.prop === 'font-family') {
        const f = FONTS.find((x) => x.css === p.value);
        if (f && f.google !== false) changes.unshift({ kind: 'font-link', file: pageFile() || 'index.html', family: f.name, optional: true, label: `load ${f.name}` });
      }
    }
    if (blocked.length) {
      for (const b of blocked) await askAI(`set ${b.prop} to ${b.value} on ${st.scope === 'all' ? 'all elements like' : 'this'} ${describe(b.el)}`, b.el, b.fallback, true);
      blocked.forEach((b) => { st.pending.splice(st.pending.indexOf(b), 1); });
    }
    if (!changes.length) { renderPending(); return; }
    // Several Tailwind tweaks on one element must become ONE class rewrite,
    // each swap applied on top of the previous one.
    const merged = [];
    const byKey = new Map();
    for (const c of changes) {
      if (c.kind !== 'class' && c.kind !== 'class-search') { merged.push(c); continue; }
      const key = c.kind === 'class' ? `${c.loc.file}#${c.loc.path}` : `search:${c.oldClass}`;
      const prev = byKey.get(key);
      if (!prev) { byKey.set(key, c); merged.push(c); continue; }
      prev.newClass = swapClass(prev.newClass, c.prop, c.value);
      prev.label += `; ${c.prop}: ${c.value}`;
    }
    changes.length = 0; changes.push(...merged);
    setBusy(true);
    try {
      const res = await call('apply', { pageUrl: location.href, changes });
      if (res.noop) { toast('Nothing changed in the files.'); discard(); return; }
      remember({ toast: { text: `Saved ${res.sha} · ${res.message}`, sha: res.sha, files: res.files }, reselect: res.reload && res.reload.path });
      location.reload();
    } catch (e) {
      setBusy(false);
      const failed = changes.map((c) => c.label).join('; ');
      toast(e.message, { kind: 'error', actions: e.data && e.data.fallback ? [{ label: 'Hand to AI', run: () => askAI(failed, st.sel, e.message) }] : [] });
    }
  }
  function discard() {
    for (const p of st.pending) unpreview(p);
    st.pending = [];
    renderPending();
    if (st.sel) renderPanel();
    positionBoxes();
  }
  async function undo(sha) {
    try {
      const r = await call('undo', sha ? { sha } : {});
      remember({ toast: { text: `Undid ${r.reverted}` } });
      location.reload();
    } catch (e) { toast(e.message, { kind: 'error' }); }
  }

  async function askAI(request, el, reason, quiet) {
    const target = el || st.sel;
    const styles = {};
    if (target) {
      const cs = getComputedStyle(target);
      for (const k of ['color', 'background-color', 'font-family', 'font-size', 'font-weight', 'width', 'height', 'padding', 'margin', 'border-radius', 'display']) styles[k] = cs.getPropertyValue(k);
    }
    try {
      const r = await call('ask', {
        request, reason, pageUrl: location.href,
        loc: target && locOf(target), selector: target ? cssPath(target) : 'page',
        html: target ? target.outerHTML.replace(/ data-em="[^"]*"/g, '') : '',
        rules: target ? matchedRules(target).map((m) => m.rule.selectorText).slice(-6) : [],
        styles,
      });
      st.status.pending = (st.status.pending || 0) + 1;
      toast(`${quiet ? 'Couldn\'t do this directly, so it\'s queued' : 'Queued'} for your AI agent: “${request}”. Ask it to apply .designinside/requests.md (Claude Code: /designinside:apply), or copy the prompt into any AI chat.`, {
        actions: [{ label: 'Copy prompt', run: () => navigator.clipboard.writeText(r.prompt).then(() => toast('Prompt copied')) }],
      });
      renderDockBadge();
    } catch (e) { toast(e.message, { kind: 'error' }); }
  }

  // ---------------------------------------------------------------- selection + highlight
  function place(box, el) {
    if (!el || !el.isConnected) { box.hidden = true; return; }
    const r = el.getBoundingClientRect();
    box.hidden = false;
    Object.assign(box.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
    const tag = box.querySelector('.tag');
    tag.textContent = `${describe(el)}  ${Math.round(r.width)}×${Math.round(r.height)}`;
    tag.classList.toggle('below', r.top < 24);
  }
  // ---------------------------------------------------------------- panel layout
  // The panel can be docked (auto/left/right/top/center), dragged anywhere by its
  // top bar, resized from its corner and collapsed. The layout is remembered per site.
  const LAYOUT_KEY = 'designinside:layout';
  const LAYOUT_DEFAULT = { dock: 'auto', w: 312, h: 560, x: null, y: null, min: false };
  st.layout = (() => {
    try { return { ...LAYOUT_DEFAULT, ...JSON.parse(localStorage.getItem(LAYOUT_KEY) || '{}') }; } catch { return { ...LAYOUT_DEFAULT }; }
  })();
  const saveLayout = () => { try { localStorage.setItem(LAYOUT_KEY, JSON.stringify(st.layout)); } catch { /* storage blocked */ } };
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  function applyLayout() {
    const L = st.layout, M = 12, s = panel.style;
    const w = clamp(L.w, 260, Math.max(260, innerWidth - 2 * M));
    const h = clamp(L.h, 200, Math.max(200, innerHeight - 2 * M));
    s.left = s.right = s.top = s.bottom = s.transform = s.height = '';
    s.width = `${w}px`;
    panel.classList.toggle('min', !!L.min);
    panel.dataset.dock = L.dock;
    const side = L.dock === 'left' || (L.dock === 'auto' && st.autoLeft) ? 'left' : 'right';
    panel.classList.toggle('anchor-right', ['auto', 'right'].includes(L.dock) && side === 'right');
    if (['auto', 'left', 'right'].includes(L.dock)) {
      s.top = `${M}px`; s[side] = `${M}px`;
      if (!L.min) s.bottom = `${M}px`;
    } else if (L.dock === 'top') {
      s.top = `${M}px`; s.left = '50%'; s.transform = 'translateX(-50%)';
      if (!L.min) s.height = `${h}px`;
    } else if (L.dock === 'center') {
      s.top = '50%'; s.left = '50%'; s.transform = 'translate(-50%, -50%)';
      if (!L.min) s.height = `${h}px`;
    } else { // free: wherever it was dragged, kept on screen
      s.left = `${clamp(L.x ?? innerWidth - w - M, 0, Math.max(0, innerWidth - w))}px`;
      s.top = `${clamp(L.y ?? M, 0, Math.max(0, innerHeight - 48))}px`;
      if (!L.min) s.height = `${Math.min(h, innerHeight - clamp(L.y ?? M, 0, innerHeight - 48) - M)}px`;
    }
  }
  function dockPanel() {
    if (!st.sel || panel.hidden) return;
    if (st.layout.dock === 'auto') { // stay out of the way of the selected element
      const r = st.sel.getBoundingClientRect();
      const w = st.layout.w + 24;
      st.autoLeft = r.right > innerWidth - w && r.left > w;
    }
    applyLayout();
  }
  // drag the top bar to move, drag the corner to resize
  panel.addEventListener('pointerdown', (e) => {
    const grip = e.target.closest('.grip');
    const bar = !grip && e.target.closest('header') && !e.target.closest('button, input, select, textarea');
    if (!grip && !bar) return;
    e.preventDefault();
    const r = panel.getBoundingClientRect();
    const start = { x: e.clientX, y: e.clientY, left: r.left, top: r.top, w: r.width, h: r.height };
    const anchorRight = panel.classList.contains('anchor-right');
    if (bar) Object.assign(st.layout, { dock: 'free', x: r.left, y: r.top, w: r.width, h: st.layout.min ? st.layout.h : r.height });
    panel.setPointerCapture(e.pointerId);
    panel.classList.add('dragging');
    const move = (ev) => {
      const dx = ev.clientX - start.x, dy = ev.clientY - start.y;
      if (bar) { st.layout.x = start.left + dx; st.layout.y = start.top + dy; } else {
        st.layout.w = clamp(start.w + (anchorRight ? -dx : dx), 260, innerWidth - 24);
        if (!['auto', 'left', 'right'].includes(st.layout.dock)) st.layout.h = clamp(start.h + dy, 200, innerHeight - 24);
      }
      applyLayout();
    };
    const up = () => {
      panel.removeEventListener('pointermove', move);
      panel.classList.remove('dragging');
      saveLayout();
    };
    panel.addEventListener('pointermove', move);
    panel.addEventListener('pointerup', up, { once: true });
    panel.addEventListener('pointercancel', up, { once: true });
  });
  function positionBoxes() {
    dockPanel();
    place(hoverBox, st.on && st.hover && st.hover !== st.sel ? st.hover : null);
    place(selBox, st.on ? st.sel : null);
    const others = shadow.querySelectorAll('.hl.affected');
    others.forEach((o) => o.remove());
    if (st.on && st.sel && st.scope === 'all') {
      const sel = primarySelector(st.sel);
      const same = sel ? [...document.querySelectorAll(sel)].filter((e) => e !== st.sel).slice(0, 40) : [];
      for (const e of same) {
        const b = document.createElement('div');
        b.className = 'hl affected';
        const r = e.getBoundingClientRect();
        Object.assign(b.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
        shadow.insertBefore(b, panel);
      }
    }
  }
  addEventListener('scroll', positionBoxes, true);
  addEventListener('resize', positionBoxes);

  function pick(el) {
    if (st.editing) finishText();
    if (el !== st.sel) st.tab = 'style';
    st.sel = el;
    st.scope = 'this';
    renderPanel();
    positionBoxes();
  }

  const targetAt = (e) => {
    const t = e.target;
    return t && t.nodeType === 1 && t !== document.documentElement && t !== document.body ? t : null;
  };
  document.addEventListener('mousemove', (e) => {
    if (!st.on || ours(e)) { if (st.hover) { st.hover = null; positionBoxes(); } return; }
    const t = targetAt(e);
    if (t !== st.hover) { st.hover = t; positionBoxes(); }
  }, true);
  const swallow = (e) => {
    if (!st.on || ours(e)) return;
    if (st.editing && st.editing.el.contains(e.target)) return;
    e.preventDefault(); e.stopPropagation();
  };
  for (const ev of ['mousedown', 'mouseup', 'pointerdown', 'pointerup', 'submit', 'auxclick']) document.addEventListener(ev, swallow, true);
  document.addEventListener('click', (e) => {
    if (!st.on || ours(e)) return;
    if (st.editing && st.editing.el.contains(e.target)) return;
    e.preventDefault(); e.stopPropagation();
    const t = targetAt(e);
    if (t) pick(t);
  }, true);
  document.addEventListener('dblclick', (e) => {
    if (!st.on || ours(e)) return;
    e.preventDefault(); e.stopPropagation();
    const t = targetAt(e);
    if (t) startText(t);
  }, true);

  // ---------------------------------------------------------------- inline text editing
  const isTextLeaf = (el) => el.childNodes.length > 0 && [...el.childNodes].every((n) => n.nodeType === 3) && el.textContent.trim().length > 0;
  // What kind of element is this? Decides which panel controls make sense.
  const MEDIA = new Set(['img', 'video', 'svg', 'picture', 'canvas', 'iframe']);
  const FIELD = new Set(['input', 'textarea', 'select']);
  function kindOf(el, cs) {
    const tag = el.tagName.toLowerCase();
    const media = MEDIA.has(tag);
    const leaf = isTextLeaf(el);
    const hasText = !media && (FIELD.has(tag) || el.textContent.trim().length > 0);
    const inline = !media && cs.display === 'inline';
    const label = media ? { img: 'Image', video: 'Video', svg: 'Icon', picture: 'Image', canvas: 'Canvas', iframe: 'Embed' }[tag]
      : /^h[1-6]$/.test(tag) ? 'Heading'
      : tag === 'button' || el.getAttribute('role') === 'button' || (tag === 'a' && /\bbtn|button\b/i.test(el.className)) ? 'Button'
      : tag === 'a' ? 'Link'
      : tag === 'p' ? 'Paragraph'
      : FIELD.has(tag) ? 'Field'
      : tag === 'li' ? 'List item'
      : leaf ? 'Text'
      : /^(section|header|footer|main|nav|aside)$/.test(tag) ? 'Section'
      : 'Box';
    return { tag, media, leaf, hasText, inline, label, container: !leaf && !media && el.children.length > 0 };
  }
  function startText(el) {
    if (!isTextLeaf(el)) {
      const leaf = [...el.querySelectorAll('*')].find(isTextLeaf);
      if (!leaf || el.textContent.trim().length === 0) { toast('Double-click directly on a piece of text to edit it.'); return; }
      if (el.children.length) { toast('This text contains other elements (links, bold…). Edit each part separately, or ask AI.'); pick(el); return; }
    }
    pick(el);
    st.editing = { el, before: el.textContent };
    el.setAttribute('contenteditable', 'plaintext-only');
    if (el.contentEditable !== 'plaintext-only') el.setAttribute('contenteditable', 'true');
    el.classList.add('em-editing');
    el.style.setProperty('outline', 'none', 'important');
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = getSelection(); sel.removeAllRanges(); sel.addRange(range);
    el.addEventListener('keydown', textKeys, true);
    el.addEventListener('blur', finishText, { once: true });
  }
  function textKeys(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); st.editing.el.blur(); }
    if (e.key === 'Escape') { e.preventDefault(); st.editing.el.textContent = st.editing.before; st.editing.el.blur(); }
    e.stopPropagation();
  }
  function finishText() {
    const ed = st.editing;
    if (!ed) return;
    st.editing = null;
    const el = ed.el;
    el.removeAttribute('contenteditable');
    el.classList.remove('em-editing');
    el.style.removeProperty('outline');
    if (!el.getAttribute('style')) el.removeAttribute('style');
    if (!el.getAttribute('class')) el.removeAttribute('class');
    el.removeEventListener('keydown', textKeys, true);
    stageText(el, ed.before, el.textContent);
  }
  // Queue a text change. `before` is the element's original source text (raw).
  function stageText(el, before, text) {
    const after = text.replace(/\s+/g, ' ').trim();
    const ed = { before };
    st.pending = st.pending.filter((p) => !(p.kind === 'text' && p.el === el));
    if (after === before.replace(/\s+/g, ' ').trim()) { el.textContent = before; renderPending(); positionBoxes(); return; }
    const loc = locOf(el);
    const short = (s) => (s.length > 40 ? s.slice(0, 37) + '…' : s);
    const entry = {
      el, kind: 'text', before, label: `text “${short(ed.before.trim())}” → “${short(after)}”`, preview: [], affected: [],
      change: loc ? { kind: 'text', loc, oldText: ed.before, newText: after } : { kind: 'text-search', oldText: ed.before.trim(), newText: after },
      where: loc ? `text of this <${loc.tag}> in ${loc.file}` : 'source file containing this exact text (found by search)',
      undoPreview: () => { el.textContent = ed.before; },
    };
    el.textContent = after;
    st.pending.push(entry);
    renderPending();
    positionBoxes();
  }

  // ---------------------------------------------------------------- panel
  function current(el, prop) {
    const inline = el.style.getPropertyValue(prop);
    if (inline) return inline;
    const w = winner(matchedRules(el), prop);
    return w ? w.value : '';
  }
  function renderPanel() {
    const el = st.sel;
    if (!el || !st.on) { panel.hidden = true; return; }
    panel.hidden = false;
    const cs = getComputedStyle(el);
    const loc = locOf(el);
    const sel = primarySelector(el);
    const rules = matchedRules(el);
    const count = sel ? document.querySelectorAll(sel).length : 1;
    const tw = twEl(el);
    const famNow = cs.fontFamily.split(',')[0].replace(/["']/g, '').trim();
    const bgVal = current(el, 'background-color');
    const colorVal = current(el, 'color');
    const varOf = (v) => (v.match(/^var\((--[\w-]+)\)$/) || [])[1];
    const parent = el.parentElement;
    const sibs = parent ? [...parent.children].filter((c) => c !== host) : [];
    const idx = sibs.indexOf(el);
    const flex = /flex|grid/.test(cs.display);
    const k = kindOf(el, cs);

    panel.innerHTML = `
      <header>
        <div class="crumb">
          ${el.parentElement && el.parentElement !== document.body ? `<button class="ghost up" title="Select parent">↖</button>` : ''}
          <div>
            <div class="name"><span class="kind">${esc(k.label)}</span> ${esc(describe(el))}</div>
            <div class="src">${loc ? `${esc(loc.file)} · source-mapped` : tw ? 'Tailwind · found by search' : 'rendered by your framework'}</div>
          </div>
        </div>
        <div class="hd-actions">
          <button class="ghost layout-btn ${st.layoutOpen ? 'on' : ''}" title="Move or resize this panel">⇱</button>
          <button class="ghost min-btn" title="${st.layout.min ? 'Expand' : 'Collapse'} this panel">${st.layout.min ? '▢' : '–'}</button>
          <button class="ghost close" title="Close (Esc)">✕</button>
        </div>
      </header>
      ${st.layoutOpen ? `<div class="layout-row">
        <div class="seg">${[['left', '◧ Left'], ['top', '⬒ Top'], ['center', '▣ Center'], ['right', '◨ Right']].map(([d, t]) => `<button data-dock="${d}" class="${st.layout.dock === d ? 'on' : ''}">${t}</button>`).join('')}</div>
        <button class="mini reset-layout" title="Back to the default position and size">Reset</button>
        <p class="hint">Or drag this top bar to put the panel anywhere, and drag its corner to resize it.</p>
      </div>` : ''}
      <nav class="tabs">
        <button data-tab="style" class="${st.tab === 'style' ? 'on' : ''}">Design</button>
        <button data-tab="claude" class="${st.tab === 'claude' ? 'on' : ''}">Ask AI${st.status.pending ? ` <b>${st.status.pending}</b>` : ''}</button>
        <button data-tab="history" class="${st.tab === 'history' ? 'on' : ''}">History</button>
      </nav>
      ${!st.status.git ? `<div class="warn">Undo needs git, and this folder isn't a repository yet. <button class="mini gitinit">Turn on undo</button></div>` : ''}
      <div class="body">
      ${st.tab === 'style' ? `
        ${count > 1 || tw ? `<div class="scope">
          <button data-scope="this" class="${st.scope === 'this' ? 'on' : ''}">Just this one</button>
          <button data-scope="all" class="${st.scope === 'all' ? 'on' : ''}">All ${count} ${esc(sel || 'like it')}</button>
        </div>` : ''}
        ${k.leaf ? `<section>
          <h4>Text</h4>
          <textarea class="txt" data-text rows="${Math.min(4, Math.ceil(el.textContent.trim().length / 32) || 1)}" spellcheck="true">${esc(el.textContent.replace(/\s+/g, ' ').trim())}</textarea>
          <p class="hint">Press Enter or click away to apply. You can also double-click the text on the page.</p>
        </section>` : k.hasText && k.container ? `<section>
          <h4>Text</h4>
          <p class="hint">This ${esc(k.label.toLowerCase())} holds several pieces of text. Click one to rewrite it, or use ↖ to go up a level.</p>
        </section>` : ''}
        ${k.hasText ? `<section>
          <h4>${k.container ? 'Text inside' : 'Font & color'}</h4>
          ${k.container ? `<p class="hint">Changes the text style of everything inside, unless a piece sets its own.</p>` : ''}
          <label class="row"><span>Font</span><select data-prop="font-family">${FONTS.map((f) => `<option value="${esc(f.name)}" ${f.name === famNow ? 'selected' : ''}>${esc(f.name)}</option>`).join('')}${FONTS.some((f) => f.name === famNow) ? '' : `<option selected disabled>${esc(famNow)}</option>`}</select></label>
          <div class="grid2">
            <label class="row"><span>Size</span><input data-prop="font-size" value="${esc(current(el, 'font-size') || cs.fontSize)}"></label>
            <label class="row"><span>Weight</span><select data-prop="font-weight">${[300, 400, 500, 600, 700, 800].map((w) => `<option ${String(w) === cs.fontWeight ? 'selected' : ''}>${w}</option>`).join('')}</select></label>
          </div>
          <label class="row"><span>Color</span>${colorInput('color', rgbToHex(cs.color), varOf(colorVal))}</label>
          <div class="row"><span>Align</span><div class="seg">${['left', 'center', 'right'].map((a) => `<button data-align="${a}" class="${cs.textAlign === a || (a === 'left' && cs.textAlign === 'start') ? 'on' : ''}">${{ left: '⇤', center: '↔', right: '⇥' }[a]}</button>`).join('')}</div></div>
        </section>` : ''}
        <section>
          <h4>${k.media ? 'Shape' : 'Fill & shape'}</h4>
          ${k.media ? '' : `<label class="row"><span>Background</span>${colorInput('background-color', rgbToHex(cs.backgroundColor), varOf(bgVal))}</label>`}
          <label class="row"><span>Corners</span><input data-prop="border-radius" value="${esc(current(el, 'border-radius') || cs.borderRadius)}"></label>
        </section>
        <section>
          <h4>Size & spacing</h4>
          ${k.inline ? `<p class="hint">Width and height don't apply to text that flows inside a line. Use ↖ to size the box around it.</p>` : ''}
          <div class="grid2">
            ${k.inline ? '' : `<label class="row"><span>Width</span><input data-prop="width" value="${esc(current(el, 'width') || Math.round(el.getBoundingClientRect().width) + 'px')}"></label>
            <label class="row"><span>Height</span><input data-prop="height" value="${esc(current(el, 'height') || Math.round(el.getBoundingClientRect().height) + 'px')}"></label>`}
            ${k.media ? '' : `<label class="row"><span>Padding</span><input data-prop="padding" value="${esc(current(el, 'padding') || cs.padding)}"></label>`}
            <label class="row"><span>Margin</span><input data-prop="margin" value="${esc(current(el, 'margin') || cs.margin)}"></label>
            ${flex ? `<label class="row"><span>Gap</span><input data-prop="gap" value="${esc(current(el, 'gap') || cs.gap)}"></label>` : ''}
          </div>
          ${k.media ? `<label class="check"><input type="checkbox" class="keepratio" ${st.keepRatio !== false ? 'checked' : ''}> Keep proportions</label>` : ''}
        </section>
        <section>
          <h4>Position</h4>
          <div class="row"><span>Order</span>
            <div class="seg">
              <button class="move" data-dir="up" ${idx <= 0 || !loc ? 'disabled' : ''} title="Move before the previous item">↑ Earlier</button>
              <button class="move" data-dir="down" ${idx < 0 || idx >= sibs.length - 1 || !loc ? 'disabled' : ''} title="Move after the next item">↓ Later</button>
            </div>
          </div>
          ${!loc ? `<p class="hint">Reordering needs a source-mapped page. Ask AI instead.</p>` : ''}
        </section>
      ` : st.tab === 'claude' ? `
        <section>
          <h4>Describe a change</h4>
          <p class="hint">For anything the panel can't do (layout, new sections, hover effects, React components). It's queued in <code>.designinside/requests.md</code> with this element's source location and styles. Then ask your AI coding agent (Claude Code, Gemini CLI, Codex, Cursor…) to "apply .designinside/requests.md"; in Claude Code that's <code>/designinside:apply</code>.</p>
          <textarea class="ask" placeholder="e.g. make this card's image zoom slightly on hover"></textarea>
          <button class="primary send">Queue for AI</button>
        </section>
      ` : `<section class="history"><h4>Recent commits</h4><div class="hist">Loading…</div></section>`}
      </div>
      <footer class="pending"></footer>
      <div class="grip" title="Drag to resize"></div>`;

    if (st.tab === 'history') loadHistory();
    renderPending();
  }

  function colorInput(prop, hex, varName) {
    return `<span class="color"><input type="color" data-prop="${prop}" value="${hex || '#ffffff'}"><input class="hex" data-hex="${prop}" value="${hex || 'none'}" spellcheck="false">${varName ? `<label class="var" title="This color comes from a theme variable"><input type="checkbox" class="linkvar" ${st.linkVars ? 'checked' : ''}> ${esc(varName)}</label>` : ''}</span>`;
  }

  async function loadHistory() {
    const box = panel.querySelector('.hist');
    try {
      const { commits } = await call('history');
      box.innerHTML = commits.length ? commits.slice(0, 15).map((c) => `
        <div class="commit ${c.ours ? 'ours' : ''}">
          <div><code>${c.sha}</code> <span class="when">${esc(c.when)}</span><div class="subj">${esc(c.subject.replace(/^designinside: /, ''))}</div></div>
          ${c.ours && !c.subject.startsWith('Revert') ? `<button class="mini undo" data-sha="${c.sha}">Undo</button>` : ''}
        </div>`).join('') : '<p class="hint">No commits yet.</p>';
    } catch (e) { box.textContent = e.message; }
  }

  function renderPending() {
    const foot = panel.querySelector('.pending');
    renderDockBadge();
    if (!foot) return;
    if (!st.pending.length) {
      foot.innerHTML = `<p class="hint">Changes preview live. Nothing is written until you save.</p>`;
      return;
    }
    foot.innerHTML = `
      <ol>${st.pending.map((p, i) => `<li class="${p.fallback ? 'fb' : ''}"><div><b>${esc(p.label)}</b><small>${p.fallback ? '→ will be handed to your AI agent' : `→ ${esc(p.where)}${p.affected && p.affected.length > 1 ? ` · ${p.affected.length} elements` : ''}`}</small></div><button class="ghost drop" data-i="${i}" title="Remove">✕</button></li>`).join('')}</ol>
      <div class="actions"><button class="ghost discard">Discard</button><button class="primary save">Save & commit <kbd>⌘S</kbd></button></div>`;
  }
  function renderDockBadge() {
    const n = st.pending.length;
    pill.classList.toggle('on', st.on);
    pill.querySelector('.pill-label').textContent = st.on ? (n ? `${n} unsaved` : 'Editing') : 'Edit page';
  }

  // panel events (delegated)
  panel.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.classList.contains('close')) return pick(null);
    if (b.classList.contains('layout-btn')) { st.layoutOpen = !st.layoutOpen; return renderPanel(); }
    if (b.classList.contains('min-btn')) { st.layout.min = !st.layout.min; saveLayout(); renderPanel(); return applyLayout(); }
    if (b.dataset.dock) { st.layout.dock = b.dataset.dock; st.layout.min = false; saveLayout(); renderPanel(); return applyLayout(); }
    if (b.classList.contains('reset-layout')) { st.layout = { ...LAYOUT_DEFAULT }; saveLayout(); renderPanel(); return applyLayout(); }
    if (b.classList.contains('up')) return pick(st.sel.parentElement);
    if (b.dataset.tab) { st.tab = b.dataset.tab; return renderPanel(); }
    if (b.dataset.scope) { st.scope = b.dataset.scope; restage(); renderPanel(); positionBoxes(); return; }
    if (b.dataset.align) return stage('text-align', b.dataset.align);
    if (b.classList.contains('move')) return moveSel(b.dataset.dir);
    if (b.classList.contains('save')) return save();
    if (b.classList.contains('discard')) return discard();
    if (b.classList.contains('drop')) {
      const p = st.pending[+b.dataset.i];
      unpreview(p); if (p.undoPreview) p.undoPreview();
      st.pending.splice(+b.dataset.i, 1);
      return renderPending();
    }
    if (b.classList.contains('undo')) return undo(b.dataset.sha);
    if (b.classList.contains('gitinit')) return call('git-init', {}).then(() => { st.status.git = true; renderPanel(); toast('Git is on. Every save is now a commit you can undo.'); });
    if (b.classList.contains('send')) {
      const t = panel.querySelector('.ask').value.trim();
      if (t) { askAI(t, st.sel); panel.querySelector('.ask').value = ''; }
    }
  });
  panel.addEventListener('input', (e) => {
    const t = e.target;
    if (t.type === 'color') { const h = panel.querySelector(`[data-hex="${t.dataset.prop}"]`); if (h) h.value = t.value; stage(t.dataset.prop, t.value); }
  });
  panel.addEventListener('change', (e) => {
    const t = e.target;
    if (t.classList.contains('linkvar')) { st.linkVars = t.checked; restage(); return; }
    if (t.classList.contains('keepratio')) { st.keepRatio = t.checked; return; }
    if (t.hasAttribute('data-text')) {
      const p = st.pending.find((x) => x.kind === 'text' && x.el === st.sel);
      stageText(st.sel, p ? p.before : st.sel.textContent, t.value);
      return;
    }
    if (t.dataset.hex) {
      const v = t.value.trim();
      if (/^#?[0-9a-f]{3,8}$/i.test(v)) {
        const hex = v.startsWith('#') ? v : `#${v}`;
        const sw = panel.querySelector(`input[type=color][data-prop="${t.dataset.hex}"]`);
        if (sw && /^#[0-9a-f]{6}$/i.test(hex)) sw.value = hex.toLowerCase();
        stage(t.dataset.hex, hex);
      }
      return;
    }
    const prop = t.dataset.prop;
    if (!prop || t.type === 'color') return;
    if (prop === 'font-family') {
      const f = FONTS.find((x) => x.name === t.value);
      if (!f) return;
      if (f.google !== false) loadFont(f.name);
      stage('font-family', f.css, `font → ${f.name}`);
      return;
    }
    stage(prop, prop === 'font-weight' ? t.value : px(t.value));
    // Images keep their shape: setting one side lets the other follow.
    if ((prop === 'width' || prop === 'height') && st.keepRatio !== false && MEDIA.has(st.sel.tagName.toLowerCase())) {
      stage(prop === 'width' ? 'height' : 'width', 'auto');
    }
  });
  panel.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT') e.target.dispatchEvent(new Event('change', { bubbles: true }));
    if (e.key === 'Enter' && e.target.hasAttribute('data-text')) { e.preventDefault(); e.target.blur(); }
    e.stopPropagation();
  });
  const loadFont = (name) => {
    const href = `https://fonts.googleapis.com/css2?family=${name.replace(/ /g, '+')}:wght@400;500;600;700&display=swap`;
    if (![...document.querySelectorAll('link')].some((l) => l.href === href)) {
      const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = href; document.head.appendChild(l);
    }
  };

  async function moveSel(dir) {
    const loc = locOf(st.sel);
    if (!loc) return;
    if (st.pending.length) { toast('Save or discard your pending changes first.'); return; }
    setBusy(true);
    try {
      const res = await call('apply', { pageUrl: location.href, changes: [{ kind: 'move', loc, dir, label: `move ${describe(st.sel)} ${dir === 'up' ? 'earlier' : 'later'}` }] });
      remember({ toast: { text: `Saved ${res.sha} · ${res.message}`, sha: res.sha }, reselect: res.reload && res.reload.path });
      location.reload();
    } catch (e) { setBusy(false); toast(e.message, { kind: 'error' }); }
  }

  function setBusy(b) { panel.classList.toggle('busy', b); }

  // ---------------------------------------------------------------- toasts
  function toast(text, { kind = 'info', actions = [], sha } = {}) {
    const t = document.createElement('div');
    t.className = `toast ${kind}`;
    t.innerHTML = `<span>${esc(text)}</span>`;
    if (sha) actions = [{ label: 'Undo', run: () => undo(sha) }, ...actions];
    for (const a of actions) {
      const b = document.createElement('button');
      b.textContent = a.label; b.className = 'mini';
      b.onclick = () => { a.run(); t.remove(); };
      t.appendChild(b);
    }
    $('.toasts').appendChild(t);
    setTimeout(() => t.classList.add('out'), kind === 'error' ? 9000 : 6000);
    setTimeout(() => t.remove(), kind === 'error' ? 9400 : 6400);
  }

  // ---------------------------------------------------------------- mode + keys
  function setOn(on) {
    st.on = on;
    document.documentElement.classList.toggle('em-on', on);
    if (!on) { discard(); st.sel = null; st.hover = null; }
    renderPanel(); positionBoxes(); renderDockBadge();
    remember({});
  }
  pill.addEventListener('click', () => setOn(!st.on));
  addEventListener('keydown', (e) => {
    if (e.altKey && (e.key === 'e' || e.key === 'E' || e.code === 'KeyE')) { e.preventDefault(); setOn(!st.on); return; }
    if (!st.on || st.editing) return;
    const typing = /INPUT|TEXTAREA|SELECT/.test((e.composedPath()[0] || {}).tagName || '');
    if ((e.metaKey || e.ctrlKey) && e.key === 's') { e.preventDefault(); save(); return; }
    if (typing) return;
    if (e.key === 'Escape') { if (st.pending.length) discard(); else pick(null); }
    if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !st.pending.length) { e.preventDefault(); undo(); }
  }, true);

  // ---------------------------------------------------------------- persistence across reloads
  function remember(extra) {
    try {
      const sel = st.sel ? (st.sel.getAttribute('data-em') ? { em: st.sel.getAttribute('data-em') } : { css: cssPath(st.sel) }) : null;
      sessionStorage.setItem(SS_KEY, JSON.stringify({ on: st.on, sel, scrollY, tab: st.tab, ...extra }));
    } catch { /* storage blocked */ }
  }
  function restore() {
    let s = null;
    try { s = JSON.parse(sessionStorage.getItem(SS_KEY) || 'null'); } catch { /* ignore */ }
    if (!s) return;
    if (s.on) setOn(true);
    if (s.tab) st.tab = s.tab;
    if (typeof s.scrollY === 'number') requestAnimationFrame(() => scrollTo(0, s.scrollY));
    const em = s.reselect ? s.reselect.replace(/^\//, '') : s.sel && s.sel.em;
    let el = null;
    try {
      if (em) el = document.querySelector(`[data-em="${CSS.escape(em)}"]`);
      else if (s.sel && s.sel.css) el = document.querySelector(s.sel.css);
    } catch { /* stale */ }
    if (el && s.on) { pick(el); st.tab = s.tab || 'style'; renderPanel(); }
    if (s.toast) toast(s.toast.text, { kind: 'ok', sha: s.toast.sha });
    remember({});
  }

  // ---------------------------------------------------------------- live reload when files change outside the editor
  function listen() {
    try {
      const es = new EventSource(API + 'events');
      es.addEventListener('change', (ev) => {
        const { file } = JSON.parse(ev.data);
        if (st.mode === 'proxy') return; // the dev server's own HMR handles it
        if (st.pending.length || st.editing) {
          toast(`${file} changed on disk.`, { actions: [{ label: 'Reload', run: () => { remember({}); location.reload(); } }] });
        } else { remember({}); location.reload(); }
      });
    } catch { /* no SSE */ }
  }

  const boot = async () => {
    try { Object.assign(st.status, await call('status')); st.mode = st.status.mode; } catch { /* server too old */ }
    restore();
    listen();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();

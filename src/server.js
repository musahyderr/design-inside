import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as H from './html.js';
import * as C from './css.js';
import * as G from './git.js';
import { applyPlan, searchReplace } from './apply.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const MIME = {
  '.html': 'text/html; charset=utf-8', '.htm': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif',
  '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.txt': 'text/plain; charset=utf-8',
};

export function createServer({ root, proxy = null, log = console.log }) {
  root = path.resolve(root);
  const overlayPath = [path.join(here, 'overlay.js'), path.join(here, '..', 'dist', 'overlay.js')].find((p) => fs.existsSync(p));
  const recentWrites = new Map(); // file -> timestamp, to ignore our own writes in the watcher
  const clients = new Set();

  // ---------- helpers ----------
  const inRoot = (rel) => {
    const abs = path.resolve(root, rel.replace(/^\/+/, ''));
    if (abs !== root && !abs.startsWith(root + path.sep)) return null;
    const parts = path.relative(root, abs).split(path.sep);
    if (parts.includes('.git') || parts.includes('node_modules')) return null;
    return abs;
  };
  const rel = (abs) => path.relative(root, abs).split(path.sep).join('/');

  function fileForUrlPath(urlPath) {
    let p;
    try { p = decodeURIComponent(urlPath.split('?')[0]); } catch { return null; }
    let abs = inRoot(p);
    if (!abs) return null;
    if (fs.existsSync(abs) && fs.statSync(abs).isDirectory()) abs = path.join(abs, 'index.html');
    else if (!fs.existsSync(abs) && fs.existsSync(abs + '.html')) abs += '.html';
    return fs.existsSync(abs) ? abs : null;
  }

  const inject = (html) => {
    const tag = `<script src="/__em/overlay.js" data-em-mode="${proxy ? 'proxy' : 'static'}" defer></script>`;
    return /<\/body>/i.test(html) ? html.replace(/<\/body>(?![\s\S]*<\/body>)/i, `${tag}</body>`) : html + tag;
  };

  async function readJson(req) {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
  }
  const send = (res, code, body, type = 'application/json') => {
    res.writeHead(code, { 'content-type': type, 'cache-control': 'no-store' });
    res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body));
  };

  // Resolve a stylesheet reference from the page to a writable source.
  function resolveSheet(sheet, pageUrl) {
    if (sheet.file && sheet.path) { // a <style> block inside an HTML file
      const abs = inRoot(sheet.file);
      if (!abs) throw new H.EditError('Stylesheet is outside the project.', 400);
      return { abs, styleBlock: sheet.path };
    }
    if (sheet.viteId) { // Vite injects <style data-vite-dev-id="/abs/path/file.css">
      const abs = path.resolve(sheet.viteId.split('?')[0]);
      if (!abs.startsWith(root + path.sep) || !fs.existsSync(abs)) throw new H.EditError('Stylesheet is outside the project.', 400);
      return { abs };
    }
    if (sheet.href) {
      const u = new URL(sheet.href, pageUrl);
      const page = new URL(pageUrl);
      if (u.host !== page.host) throw new H.EditError('That stylesheet is loaded from another site; it can\'t be edited here.', 400);
      const abs = fileForUrlPath(u.pathname);
      if (!abs) throw new H.EditError(`Can't find ${u.pathname} inside the project folder.`, 400);
      return { abs };
    }
    throw new H.EditError('Unknown stylesheet.', 400);
  }

  // ---------- API ----------
  async function api(req, res, route) {
    try {
      if (route === 'overlay.js') {
        if (!overlayPath) return send(res, 500, '// overlay not built: run npm run build', MIME['.js']);
        return send(res, 200, await fsp.readFile(overlayPath), MIME['.js']);
      }
      if (route === 'status') {
        return send(res, 200, { root, mode: proxy ? 'proxy' : 'static', proxy, git: await G.isRepo(root), pending: await pendingCount() });
      }
      if (route === 'events') {
        res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-store', connection: 'keep-alive' });
        res.write('retry: 1000\n\n');
        clients.add(res);
        req.on('close', () => clients.delete(res));
        return;
      }
      if (route === 'history') return send(res, 200, { commits: await G.history(root) });
      if (route === 'git-init' && req.method === 'POST') {
        if (!(await G.isRepo(root))) await G.init(root);
        await excludeQueue();
        return send(res, 200, { ok: true });
      }
      if (route === 'apply' && req.method === 'POST') {
        const body = await readJson(req);
        if (!(await G.isRepo(root))) return send(res, 412, { error: 'This folder is not a git repository yet. Click "Turn on undo (git init)" first.' });
        const result = await applyPlan({ root, inRoot, rel, resolveSheet, pageUrl: body.pageUrl, changes: body.changes });
        const files = Object.keys(result.writes);
        if (!files.length) return send(res, 200, { ok: true, noop: true, results: result.results });
        const dirtyFiles = await G.dirty(root, files.map(rel));
        if (dirtyFiles.length) {
          return send(res, 409, { error: `These files have uncommitted changes, so editor-mode won't touch them (its commit would include your work): ${dirtyFiles.join(', ')}. Commit or stash them first.` });
        }
        for (const [abs, content] of Object.entries(result.writes)) {
          recentWrites.set(abs, Date.now());
          await fsp.writeFile(abs, content);
        }
        const labels = [...new Set(result.results.map((r) => r.label).filter(Boolean))];
        const message = body.message || (labels.join('; ').length > 160 ? `${labels[0]} (+${labels.length - 1} more)` : labels.join('; ')) || 'edit';
        const sha = await G.commit(root, files.map(rel), message);
        log(`  ✓ ${sha} ${message}`);
        return send(res, 200, { ok: true, sha, message, files: files.map(rel), results: result.results, reload: result.reload });
      }
      if (route === 'undo' && req.method === 'POST') {
        const { sha } = await readJson(req);
        const target = sha || (await G.history(root)).find((c) => c.ours)?.sha;
        if (!target) return send(res, 404, { error: 'Nothing to undo.' });
        for (const f of await G.filesIn(root, target)) recentWrites.set(path.join(root, f), Date.now());
        const head = await G.revert(root, target);
        log(`  ↶ reverted ${target}`);
        return send(res, 200, { ok: true, sha: head, reverted: target });
      }
      if (route === 'ask' && req.method === 'POST') {
        const body = await readJson(req);
        const entry = await queueForClaude(body);
        return send(res, 200, { ok: true, ...entry });
      }
      return send(res, 404, { error: 'unknown endpoint' });
    } catch (e) {
      const code = e.code && Number.isInteger(e.code) ? e.code : 500;
      if (code === 500) log(e);
      return send(res, code, { error: e.message, fallback: true });
    }
  }

  // ---------- Claude hand-off queue ----------
  const queueDir = path.join(root, '.editor-mode');
  const queueFile = path.join(queueDir, 'requests.md');
  async function excludeQueue() {
    try {
      const ex = path.join(root, '.git', 'info', 'exclude');
      const cur = fs.existsSync(ex) ? await fsp.readFile(ex, 'utf8') : '';
      if (!cur.includes('.editor-mode/')) { await fsp.mkdir(path.dirname(ex), { recursive: true }); await fsp.appendFile(ex, '\n.editor-mode/\n'); }
    } catch { /* not a repo yet */ }
  }
  async function pendingCount() {
    try { return ((await fsp.readFile(queueFile, 'utf8')).match(/^## \[ \]/gm) || []).length; } catch { return 0; }
  }
  async function queueForClaude(b) {
    await fsp.mkdir(queueDir, { recursive: true });
    await excludeQueue();
    const id = Date.now().toString(36);
    const lines = [
      `## [ ] ${id} — ${b.request.split('\n')[0].slice(0, 80)}`,
      '',
      `**Request:** ${b.request}`,
      '',
      `- Page: ${b.pageUrl}`,
      b.loc ? `- Source: \`${b.loc.file}\` (element path \`${b.loc.path}\`, a \`<${b.loc.tag}>\`)` : '- Source: unknown (rendered by a framework); search the project for the snippet below',
      `- Selector: \`${b.selector}\``,
      b.reason ? `- Why the editor couldn't do it directly: ${b.reason}` : null,
      b.rules?.length ? `- Matching CSS rules: ${b.rules.map((r) => `\`${r}\``).join(', ')}` : null,
      b.styles ? `- Current styles: ${Object.entries(b.styles).map(([k, v]) => `${k}: ${v}`).join('; ')}` : null,
      '',
      '```html',
      (b.html || '').slice(0, 1500),
      '```',
      '',
    ].filter((l) => l !== null);
    if (!fs.existsSync(queueFile)) {
      await fsp.writeFile(queueFile, '# editor-mode requests\n\nChanges the visual editor handed to Claude. Run `/editor-mode:apply` in Claude Code to apply them.\nClaude ticks each box when done.\n\n');
    }
    await fsp.appendFile(queueFile, lines.join('\n') + '\n');
    const prompt = `In this project, ${b.request}\n\nThe element is \`${b.selector}\`${b.loc ? ` in ${b.loc.file}` : ''}:\n\n\`\`\`html\n${(b.html || '').slice(0, 1500)}\n\`\`\`\n${b.styles ? `\nCurrent styles: ${Object.entries(b.styles).map(([k, v]) => `${k}: ${v}`).join('; ')}\n` : ''}\nChange only what is asked, keep the existing code style, and don't touch unrelated rules.`;
    log(`  → queued for Claude: ${b.request}`);
    return { id, file: rel(queueFile), prompt };
  }

  // ---------- live reload ----------
  // One non-recursive watcher per directory. Directory watches keep working
  // when git or an editor replaces a file (new inode); Node's recursive mode
  // on Linux watches files individually and silently loses replaced ones.
  const IGNORE = /(^|\/)(\.git|node_modules|\.editor-mode|dist|build|\.next|\.nuxt|\.svelte-kit|\.cache)(\/|$)/;
  const watchers = new Map();
  let watchTimer;
  const changed = (abs) => {
    const n = rel(abs);
    if (IGNORE.test(n)) return;
    const t = recentWrites.get(abs);
    if (t && Date.now() - t < 1500) return;
    clearTimeout(watchTimer);
    watchTimer = setTimeout(() => { for (const c of clients) c.write(`event: change\ndata: ${JSON.stringify({ file: n })}\n\n`); }, 120);
  };
  const watchDir = (dir) => {
    if (watchers.has(dir) || (dir !== root && IGNORE.test(rel(dir)))) return;
    try {
      const w = fs.watch(dir, (_ev, name) => {
        if (!name) return;
        const abs = path.join(dir, name.toString());
        try { if (fs.statSync(abs).isDirectory()) { watchDir(abs); return; } } catch { /* deleted */ }
        changed(abs);
      });
      w.on('error', () => { watchers.delete(dir); });
      watchers.set(dir, w);
      for (const ent of fs.readdirSync(dir, { withFileTypes: true })) if (ent.isDirectory()) watchDir(path.join(dir, ent.name));
    } catch { /* unreadable dir */ }
  };
  watchDir(root);

  // ---------- static + proxy ----------
  async function serveStatic(req, res, url) {
    const abs = fileForUrlPath(url.pathname);
    if (!abs) return send(res, 404, `Not found: ${url.pathname}`, 'text/plain');
    const ext = path.extname(abs).toLowerCase();
    if (ext === '.html' || ext === '.htm') {
      const src = await fsp.readFile(abs, 'utf8');
      return send(res, 200, inject(H.tagHtml(src, rel(abs))), MIME['.html']);
    }
    res.writeHead(200, { 'content-type': MIME[ext] || 'application/octet-stream', 'cache-control': 'no-store' });
    fs.createReadStream(abs).pipe(res);
  }

  function serveProxy(req, res, url) {
    const target = new URL(url.pathname + url.search, proxy);
    const headers = { ...req.headers, host: target.host, 'accept-encoding': 'identity' };
    const up = http.request(target, { method: req.method, headers }, async (ur) => {
      const type = ur.headers['content-type'] || '';
      if (!type.includes('text/html')) { res.writeHead(ur.statusCode, ur.headers); return ur.pipe(res); }
      const chunks = [];
      for await (const c of ur) chunks.push(c);
      let html = Buffer.concat(chunks).toString('utf8');
      // If the dev server is serving a file from this folder verbatim, tag it
      // so edits can be written precisely (live-server, http-server, etc.).
      const abs = fileForUrlPath(url.pathname);
      if (abs && /\.html?$/.test(abs)) {
        const src = await fsp.readFile(abs, 'utf8');
        if (src.trim() && html.includes(src.trim())) html = html.replace(src.trim(), H.tagHtml(src.trim(), rel(abs)));
      }
      const h = { ...ur.headers };
      delete h['content-length']; delete h['content-encoding']; delete h['content-security-policy'];
      res.writeHead(ur.statusCode, h);
      res.end(inject(html));
    });
    up.on('error', (e) => send(res, 502, `editor-mode could not reach ${proxy}: ${e.message}\nIs your dev server running?`, 'text/plain'));
    req.pipe(up);
  }

  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    if (url.pathname.startsWith('/__em/')) return api(req, res, url.pathname.slice(6));
    if (proxy) return serveProxy(req, res, url);
    return serveStatic(req, res, url).catch((e) => send(res, 500, e.message, 'text/plain'));
  });

  // Websocket passthrough so the dev server's hot reload keeps working.
  server.on('upgrade', (req, socket, head) => {
    if (!proxy) return socket.destroy();
    const t = new URL(proxy);
    const up = http.request({ host: t.hostname, port: t.port, path: req.url, method: req.method, headers: { ...req.headers, host: t.host } });
    up.on('upgrade', (ures, usock, uhead) => {
      socket.write(`HTTP/1.1 101 Switching Protocols\r\n${Object.entries(ures.headers).map(([k, v]) => `${k}: ${v}`).join('\r\n')}\r\n\r\n`);
      if (uhead?.length) socket.write(uhead);
      if (head?.length) usock.write(head);
      usock.pipe(socket).pipe(usock);
    });
    up.on('error', () => socket.destroy());
    up.end();
  });

  return { server, root, searchReplace };
}

export { H, C };

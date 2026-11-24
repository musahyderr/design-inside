import fs from 'node:fs';
import path from 'node:path';
import { createServer } from '../src/server.js';
import * as G from '../src/git.js';

const HELP = `
editor-mode: click any element on your localhost site, change it visually,
and the change is written into your source files and committed to git.

Usage
  editor-mode [folder]                 serve a plain HTML/CSS folder (default: .)
  editor-mode --proxy 5173 [folder]    wrap a running dev server (Vite, Next, Astro, …)

Options
  --port <n>      port for editor-mode (default 4400)
  --proxy <url>   dev server to wrap; a bare port means http://localhost:<port>
  --no-git-check  don't warn when the folder isn't a git repo
  -h, --help
`;

const args = process.argv.slice(2);
const opt = { port: 4400, proxy: null, root: '.' };
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '-h' || a === '--help') { console.log(HELP); process.exit(0); }
  else if (a === '--port') opt.port = Number(args[++i]);
  else if (a === '--proxy') { const v = args[++i]; opt.proxy = /^\d+$/.test(v) ? `http://localhost:${v}` : v; }
  else if (a === '--no-git-check') opt.noGit = true;
  else opt.root = a;
}
const root = path.resolve(opt.root);
if (!fs.existsSync(root)) { console.error(`No such folder: ${root}`); process.exit(1); }

const { server } = createServer({ root, proxy: opt.proxy });
const listen = (port, tries = 10) => {
  server.once('error', (e) => {
    if (e.code === 'EADDRINUSE' && tries > 0) return listen(port + 1, tries - 1);
    console.error(e.message); process.exit(1);
  });
  server.listen(port, '127.0.0.1', async () => {
    const url = `http://localhost:${port}/`;
    console.log(`\n  editor-mode  ${url}`);
    console.log(`  ${opt.proxy ? `wrapping     ${opt.proxy}` : 'serving     '} ${opt.proxy ? '' : root}`);
    if (opt.proxy) console.log(`  source       ${root}`);
    if (!opt.noGit && !(await G.isRepo(root))) console.log('  note         not a git repo yet; the editor will offer to turn on undo (git init)');
    console.log('\n  Open the URL, press Alt+E (or click "Edit page"), click anything.\n');
  });
};
listen(opt.port);

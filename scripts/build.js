// Bundles everything into dist/ so the tool (and the Claude Code plugin) runs with no npm install.
import { build } from 'esbuild';

await build({
  entryPoints: ['client/overlay.js'],
  bundle: true, minify: true, format: 'iife', target: 'es2020',
  outfile: 'dist/overlay.js', legalComments: 'none',
});
await build({
  entryPoints: ['bin/cli.js'],
  bundle: true, platform: 'node', format: 'esm', target: 'node22',
  outfile: 'dist/design-inside.mjs', legalComments: 'none',
  banner: { js: "#!/usr/bin/env node\nimport { createRequire as __cr } from 'node:module'; const require = __cr(import.meta.url);" },
});
console.log('built dist/overlay.js and dist/design-inside.mjs');

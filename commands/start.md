---
description: Open the visual editor on this project's localhost site
argument-hint: "[folder or dev-server port]"
allowed-tools: Bash, Read
---

Start designinside for the current project so the user can click elements on their site and change them visually.

1. Work out how the site is served:
   - If `$ARGUMENTS` is a number, it's the port of a dev server that's already running. Use proxy mode with that port.
   - Otherwise check whether a dev server is already running on a common port (5173, 3000, 3001, 4321, 8080, 8000, 5500), for example with `curl -s -o /dev/null -w "%{http_code}" http://localhost:PORT`. If one answers and the project has a framework (`package.json` with vite/next/astro/svelte/nuxt), use proxy mode.
   - Otherwise it's a plain HTML/CSS folder: use static mode on `$ARGUMENTS` or the folder that holds `index.html`.
2. If the folder isn't a git repository, tell the user that designinside commits every change so it can undo it, and offer to run `git init` plus an initial commit. Don't do it without their OK. (The editor also offers this button itself.)
3. Run it in the background (it's a single bundled file with no dependencies, Node 22+):
   - static: `node "${CLAUDE_PLUGIN_ROOT}/dist/designinside.mjs" <folder>`
   - proxy:  `node "${CLAUDE_PLUGIN_ROOT}/dist/designinside.mjs" --proxy <port> <project root>`
4. Read the first lines of its output for the URL (default http://localhost:4400, or the next free port) and give it to the user with these three tips:
   - Press **Alt+E** or click **Edit page** in the bottom-left corner, then click any element. Double-click text to rewrite it.
   - Choose **Just this one** or **All N similar**. The panel shows exactly which file and rule each change will be written to before saving.
   - **Save & commit** (⌘/Ctrl+S) writes the source and makes one git commit. Undo is in the toast and the History tab.
5. Mention that anything the panel can't do goes to the **Ask AI** tab, and they can run `/designinside:apply` here to have you apply those requests.

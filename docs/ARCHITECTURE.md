# How editor-mode works

Notes for contributors: the design rules, then how a clicked element is matched to the CSS it edits.

## Design

### Intent
People generate sites with AI and then dislike one small thing (a color, a size, some text, a font). editor-mode lets them click the thing, change it visually, and have the real source updated and committed. Simple changes cost zero AI tokens; anything else is handed to an AI coding agent with full context.

### Goals
- Turn on with one command (`/editor-mode:start`) on any localhost: plain folder (static) or a running dev server (proxy).
- Click to select, double-click text (or use the Text box) to edit, a panel that shows only the controls that fit the element (text, image, box, inline text) for font, size, weight, color, align, background, corners, width, height, padding, margin, gap and order.
- Writes go to the real files and become one git commit each, with revert-based undo.

### Anti-goals (failure even if it "works")
- Corrupting or unexpectedly rewriting user files.
- Committing without a clear undo, or sweeping the user's uncommitted work into a commit.
- Only working on the author's demo site.

### Architecture
- The server serves or proxies the page and injects `/__em/overlay.js`. Each source element gets `data-em="<file>#<element-path>"`, where the path is the element's index chain in the source parse tree. Text, attribute and style edits don't change paths.
- In proxy mode, HTML is tagged only if the dev server serves the file verbatim. Otherwise the page is "framework" mode, and edits fall back to unique-string search.
- `/__em/apply` takes a batch of changes, computes all new file contents in memory, refuses if any target file is dirty in git, writes, then commits only those files.
- Change kinds: `text`, `text-search`, `inline`, `class`, `class-search`, `css-rule`, `css-new-rule`, `css-var`, `font-link` (optional), `move`.
- After a save the page reloads, so what you see is what's in the file. The selection and scroll position are restored from sessionStorage.
- Per-directory `fs.watch` sends SSE so the page reloads when an AI agent edits files. The editor's own writes are suppressed for 1.5 s.
- Ask AI appends to `.editor-mode/requests.md` (git-excluded). The file starts with instructions, so any AI coding agent can apply it (Claude Code: `/editor-mode:apply`), one commit per request (`editor-mode (ai): …`).

### Safety rules
- Refuse rather than guess: stale text or class, element tag mismatch, zero or several search hits. Each refusal offers "Hand to AI".
- Minimal diffs: HTML byte-range splices; CSS through postcss with untouched formatting.
- Writes only inside the root; never `.git` or `node_modules`.
- Undo only reverts editor-mode commits, or AI-agent commits for queued requests, and aborts cleanly on conflict.

### Known limits
- Non-Tailwind framework components: styling goes to the AI agent.
- CSS nesting, `@scope`, CSS-in-JS and CSS-module hashes aren't edited directly.
- Text with inline markup is edited part by part.
- Position means order only, no drag.

## Matching a clicked element to its CSS

All of this runs in the browser (`client/overlay.js`), because the browser already knows the cascade. The server then finds the same rule with postcss (`src/css.js`), using the selector normalizer in `src/norm.js`, which both sides share.

### 1. Collect the rules that apply (`allRules`, `matchedRules`)
- Walk `document.styleSheets` in order; skip cross-origin sheets (reading their rules throws) and the editor's own sheet.
- Flatten into style rules with their condition chain (`@media`, `@supports`, `@layer`, `@container`) and an **occurrence** index: the nth rule in that sheet with the same normalized selector and conditions. The server flattens postcss rules the same way, so selector + conditions + occurrence identifies one rule.
- Keep a rule only if its `@media`/`@supports` conditions match now.
- Split selector lists at top-level commas, drop branches with state pseudo-classes (`:hover`, `:focus`, …) or pseudo-elements, keep the branches the element `matches()`, and record the most specific one.

### 2. Pick the winner for a property (`winner`)
- A rule counts if it sets the property. Longhands written through a shorthand that uses `var()` read as empty in CSSOM, so `background-color` also checks `background`.
- Rank by `!important`, then specificity, then order. An inline `style` on the element beats every rule.

### 3. Map the stylesheet to a file (`sheetRef`)
- `<link href>` on the same host → file path under the root.
- `<style data-em>` → the `<style>` block inside that HTML file (edited in place).
- `<style data-vite-dev-id>` for `.css` → that file (Vite dev).
- Anything else (e.g. Tailwind CDN's generated styles) → unmappable.

### 4. Choose the target by scope (`plan`)
- **Just this one:** Tailwind element → class swap on this element. Winning rule matches only this element → edit that rule. Source-mapped → inline `style`. Otherwise → AI agent.
- **All similar:** Tailwind → class swap on every element with the identical class string (or a unique search hit). Winning rule mappable → edit it, or edit the `:root` variable if the value is `var(--x)` and the user ticked the variable. No rule → add `.class.list { prop: value }` to the most relevant sheet. Otherwise → AI agent.
- The pending list shows the chosen destination and how many elements it affects before saving.

### 5. Server edit details (`src/css.js`)
- `setDeclaration` changes the last declaration of the property. If a later shorthand holds one simple value (`white`, `#fff`, `var(--x)`, `rgb(…)`), it rewrites the shorthand instead; otherwise it inserts the longhand after it.
- Appended declarations copy the indentation of their siblings, and single-line rules stay on one line.
- `setVariable` prefers the definition in `:root` or `html`.

### Pitfalls already hit
- Selecting a card by clicking its middle selects the inner `<p>`; the ↖ button selects the parent.
- Two Tailwind tweaks to one element must be merged into one class rewrite (done in `save()`).

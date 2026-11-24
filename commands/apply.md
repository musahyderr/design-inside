---
description: Apply the change requests queued from the visual editor
allowed-tools: Read, Edit, Write, Grep, Glob, Bash(git:*)
---

The visual editor (editor-mode) queues changes it can't make safely by itself in `.editor-mode/requests.md` at the project root. Each request is a `## [ ] <id> — <title>` section with:
- the user's request in their own words
- the page URL, the source file and element path (if known), and a CSS selector
- the rules that currently match the element and its current computed styles
- an HTML snippet of the element

Do this:

1. Read `.editor-mode/requests.md`. If it doesn't exist or has no unchecked `## [ ]` items, say there is nothing queued and stop.
2. For each unchecked request, in order:
   - Find the element in the source. Use the file and snippet given; for framework projects, search for distinctive text or class names from the snippet in components.
   - Make the smallest change that does what was asked, in the project's existing style (existing CSS file and naming, or Tailwind utilities if the project uses Tailwind). Don't reformat or touch unrelated code.
   - If the request is ambiguous or would need a design decision the user hasn't made, skip it and say why.
3. Commit each applied request separately with the message `editor-mode (claude): <short description>`, staging only the files you changed. This keeps every change undoable from the editor's History tab.
4. Tick each completed box in `requests.md` (`## [x]`) and add a line `Done in <sha>` under it. Leave skipped ones unchecked with a short note.
5. Report what you changed, file by file, and remind the user that the open editor page reloads by itself when files change.

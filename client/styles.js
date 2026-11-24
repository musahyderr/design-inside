export const STYLES = `
:host { all: initial; }
* { box-sizing: border-box; font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
:host {
  --bg: #16161a; --bg2: #1f1f25; --bg3: #2a2a32; --line: #33333d; --fg: #ececf1; --dim: #9a9aa8;
  --accent: #8b7bff; --accent2: #b3a8ff; --ok: #4ade80; --err: #f87171; --sel: #8b7bff; --hov: #38bdf8;
}
button { font: inherit; color: inherit; cursor: pointer; }
kbd { font: 10px/1 ui-monospace, monospace; padding: 3px 5px; border-radius: 4px; background: rgba(255,255,255,.1); color: var(--dim); }
code { font: 11px ui-monospace, SFMono-Regular, monospace; background: var(--bg3); padding: 1px 4px; border-radius: 4px; }

.hl { position: fixed; pointer-events: none; border-radius: 2px; transition: all .06s ease-out; }
.hl.hover { outline: 1.5px dashed var(--hov); background: rgba(56,189,248,.06); }
.hl.selected { outline: 2px solid var(--sel); box-shadow: 0 0 0 4px rgba(139,123,255,.18); }
.hl.affected { outline: 1.5px solid rgba(139,123,255,.55); background: rgba(139,123,255,.06); }
.hl .tag { position: absolute; left: -2px; bottom: 100%; margin-bottom: 4px; white-space: nowrap; font: 600 11px/1 ui-monospace, monospace;
  padding: 4px 6px; border-radius: 4px; background: var(--sel); color: white; }
.hl.hover .tag { background: var(--hov); color: #04222e; }
.hl .tag.below { bottom: auto; top: 100%; margin: 4px 0 0; }

.dock { position: fixed; left: 16px; bottom: 16px; pointer-events: auto; }
.pill { display: flex; align-items: center; gap: 8px; height: 38px; padding: 0 12px 0 14px; border-radius: 999px; border: 1px solid var(--line);
  background: var(--bg); color: var(--fg); font-size: 13px; font-weight: 600; box-shadow: 0 8px 30px rgba(0,0,0,.35); }
.pill .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--dim); }
.pill.on .dot { background: var(--accent); box-shadow: 0 0 0 4px rgba(139,123,255,.25); }
.pill:hover { border-color: var(--accent); }

.panel { position: fixed; top: 12px; right: 12px; bottom: 12px; width: 312px; max-width: calc(100vw - 24px); pointer-events: auto; display: flex; flex-direction: column;
  background: var(--bg); color: var(--fg); border: 1px solid var(--line); border-radius: 14px; box-shadow: 0 20px 60px rgba(0,0,0,.45); font-size: 12.5px; overflow: hidden; }
.panel.left { right: auto; left: 12px; }
.panel[hidden], .hl[hidden] { display: none; }
.panel.busy { opacity: .6; pointer-events: none; }
header { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; padding: 14px 14px 10px; }
.crumb { display: flex; gap: 8px; align-items: flex-start; min-width: 0; }
.name { font: 600 13px ui-monospace, monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 210px; }
.src { color: var(--dim); font-size: 11px; margin-top: 3px; }
.ghost { background: none; border: 0; color: var(--dim); padding: 4px 6px; border-radius: 6px; }
.ghost:hover { background: var(--bg3); color: var(--fg); }
.tabs { display: flex; gap: 2px; padding: 0 10px; border-bottom: 1px solid var(--line); }
.tabs button { background: none; border: 0; padding: 8px 8px 9px; color: var(--dim); border-bottom: 2px solid transparent; font-weight: 600; }
.tabs button.on { color: var(--fg); border-color: var(--accent); }
.tabs b { background: var(--accent); color: #fff; border-radius: 99px; padding: 0 6px; font-size: 10px; }
.warn { margin: 10px 12px 0; padding: 8px 10px; border-radius: 8px; background: #3b2f12; color: #fde68a; font-size: 12px; }
.body { flex: 1; overflow: auto; padding: 4px 0 8px; }
section { padding: 10px 14px; border-bottom: 1px solid var(--line); }
section:last-child { border-bottom: 0; }
h4 { margin: 0 0 8px; font-size: 11px; text-transform: uppercase; letter-spacing: .06em; color: var(--dim); font-weight: 700; }
.hint { color: var(--dim); margin: 0 0 8px; line-height: 1.45; font-size: 11.5px; }
.row { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin: 6px 0; min-height: 28px; }
.row > span { color: var(--dim); flex: 0 0 auto; min-width: 56px; }
.grid2 { display: grid; grid-template-columns: 1fr 1fr; column-gap: 10px; }
.grid2 .row > span { min-width: 0; }
input, select, textarea { font: 12px ui-monospace, SFMono-Regular, monospace; color: var(--fg); background: var(--bg2); border: 1px solid var(--line);
  border-radius: 7px; height: 28px; padding: 0 8px; width: 100%; min-width: 0; outline: none; }
select { font-family: inherit; }
.row > input, .row > select { max-width: 170px; }
.grid2 .row > input, .grid2 .row > select { max-width: 86px; }
input:focus, select:focus, textarea:focus { border-color: var(--accent); }
textarea { height: 90px; padding: 8px; resize: vertical; font-family: inherit; font-size: 12.5px; }
textarea.txt { height: auto; min-height: 34px; margin-bottom: 6px; line-height: 1.4; }
.kind { font: 600 10.5px system-ui, sans-serif; text-transform: uppercase; letter-spacing: .04em; color: var(--accent2); margin-right: 4px; }
.check { display: flex; gap: 6px; align-items: center; color: var(--dim); font-size: 12px; margin-top: 6px; }
.check input { width: auto; height: auto; }
.color { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; justify-content: flex-end; max-width: 190px; }
.color input[type=color] { width: 28px; height: 28px; padding: 2px; flex: 0 0 28px; }
.color .hex { width: 86px; }
.var { display: flex; gap: 4px; align-items: center; color: var(--accent2); font: 11px ui-monospace, monospace; width: 100%; justify-content: flex-end; }
.var input { width: auto; height: auto; }
.seg { display: inline-flex; background: var(--bg2); border: 1px solid var(--line); border-radius: 8px; padding: 2px; gap: 2px; }
.seg button { border: 0; background: none; padding: 4px 9px; border-radius: 6px; color: var(--dim); }
.seg button.on, .seg button:hover:not(:disabled) { background: var(--bg3); color: var(--fg); }
.seg button:disabled { opacity: .35; cursor: default; }
.scope { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin: 10px 14px 2px; background: var(--bg2); padding: 3px; border-radius: 9px; border: 1px solid var(--line); }
.scope button { border: 0; background: none; padding: 7px 6px; border-radius: 7px; color: var(--dim); font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.scope button.on { background: var(--accent); color: white; }
.primary { background: var(--accent); color: white; border: 0; border-radius: 8px; padding: 8px 12px; font-weight: 700; display: inline-flex; gap: 8px; align-items: center; }
.primary:hover { background: #7a68ff; }
.primary kbd { background: rgba(255,255,255,.2); color: white; }
section .primary { margin-top: 8px; width: 100%; justify-content: center; }
.mini { background: var(--bg3); border: 1px solid var(--line); border-radius: 6px; padding: 3px 8px; font-size: 11.5px; font-weight: 600; white-space: nowrap; }
.mini:hover { border-color: var(--accent); }

footer.pending { border-top: 1px solid var(--line); padding: 10px 14px 12px; background: var(--bg2); max-height: 45%; overflow: auto; }
footer .hint { margin: 0; }
footer ol { list-style: none; margin: 0 0 10px; padding: 0; display: grid; gap: 6px; }
footer li { display: flex; justify-content: space-between; align-items: flex-start; gap: 6px; padding: 7px 8px; border-radius: 8px; background: var(--bg); border: 1px solid var(--line); }
footer li b { display: block; font-weight: 600; word-break: break-word; }
footer li small { display: block; color: var(--dim); margin-top: 2px; font-size: 11px; line-height: 1.35; word-break: break-word; }
footer li.fb small { color: #fbbf24; }
.actions { display: flex; justify-content: space-between; align-items: center; }

.commit { display: flex; justify-content: space-between; gap: 8px; align-items: center; padding: 7px 0; border-bottom: 1px dashed var(--line); }
.commit .when { color: var(--dim); font-size: 11px; }
.commit .subj { margin-top: 3px; line-height: 1.35; }
.commit:not(.ours) { opacity: .55; }

.toasts { position: fixed; left: 16px; bottom: 64px; display: grid; gap: 8px; pointer-events: auto; max-width: min(440px, calc(100vw - 32px)); }
.toast { display: flex; gap: 10px; align-items: center; padding: 10px 12px; border-radius: 10px; background: var(--bg); color: var(--fg);
  border: 1px solid var(--line); box-shadow: 0 10px 30px rgba(0,0,0,.35); font-size: 12.5px; line-height: 1.4; transition: opacity .3s, transform .3s; }
.toast span { flex: 1; }
.toast.ok { border-left: 3px solid var(--ok); }
.toast.error { border-left: 3px solid var(--err); }
.toast.out { opacity: 0; transform: translateY(6px); }
`;

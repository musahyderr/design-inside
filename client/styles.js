// The editor UI, styled like an iOS sheet: frosted glass, Apple's system font,
// grouped rounded sections, segmented controls, switches and Apple-blue accents.
// Follows the computer's light or dark mode.
export const STYLES = `
:host { all: initial; }
:host {
  --sf: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif;
  --mono: "SF Mono", ui-monospace, Menlo, Consolas, monospace;
  /* dark (default) */
  --glass: rgba(28, 28, 30, .78); --glass-solid: #1c1c1e; --card: rgba(255, 255, 255, .07); --cell-on: #636366;
  --fill: rgba(118, 118, 128, .24); --fill2: rgba(118, 118, 128, .36); --sep: rgba(84, 84, 88, .55); --rim: rgba(255, 255, 255, .1);
  --fg: #fff; --dim: rgba(235, 235, 245, .6); --faint: rgba(235, 235, 245, .3);
  --accent: #0a84ff; --accent-hi: #409cff; --ok: #30d158; --err: #ff453a; --warn: #ffd60a; --warn-bg: rgba(255, 214, 10, .14);
  --sel: #0a84ff; --hov: #64d2ff; --knob: #fff; --shadow: 0 24px 70px rgba(0, 0, 0, .45), 0 2px 8px rgba(0, 0, 0, .25);
  --thumb: #3a3a3c; --chev: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' fill='none' stroke='%238e8e93' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
}
/* light glass on light sites (data-tone is set from the page's own background) */
:host([data-tone="light"]) {
  --glass: rgba(246, 246, 248, .82); --glass-solid: #f2f2f7; --card: rgba(255, 255, 255, .78); --cell-on: #fff;
  --fill: rgba(118, 118, 128, .12); --fill2: rgba(118, 118, 128, .2); --sep: rgba(60, 60, 67, .16); --rim: rgba(0, 0, 0, .08);
  --fg: #000; --dim: rgba(60, 60, 67, .6); --faint: rgba(60, 60, 67, .3);
  --accent: #007aff; --accent-hi: #0062cc; --ok: #34c759; --err: #ff3b30; --warn: #8a6100; --warn-bg: rgba(255, 204, 0, .18);
  --sel: #007aff; --hov: #32ade6; --shadow: 0 24px 70px rgba(0, 0, 0, .18), 0 2px 8px rgba(0, 0, 0, .08);
  --thumb: rgba(0, 0, 0, .28);
}
* { box-sizing: border-box; font-family: var(--sf); -webkit-font-smoothing: antialiased; }
button { font: inherit; color: inherit; cursor: pointer; }
kbd { font: 500 10px/1 var(--sf); padding: 3px 5px; border-radius: 5px; background: var(--fill); color: var(--dim); }
code { font: 11px var(--mono); background: var(--fill); padding: 1px 5px; border-radius: 5px; }

/* selection outlines on the page */
.hl { position: fixed; pointer-events: none; border-radius: 4px; } /* no transition: a sliding box lags behind the page while scrolling */
.hl.hover { outline: 1.5px solid var(--hov); background: rgba(100, 210, 255, .07); }
.hl.selected { outline: 2px solid var(--sel); box-shadow: 0 0 0 4px rgba(10, 132, 255, .2); }
.hl.affected { outline: 1.5px solid rgba(10, 132, 255, .55); background: rgba(10, 132, 255, .06); }
.hl .tag { position: absolute; left: -2px; bottom: 100%; margin-bottom: 5px; white-space: nowrap; font: 600 11px/1 var(--sf);
  padding: 5px 8px; border-radius: 7px; background: var(--sel); color: #fff; box-shadow: 0 2px 8px rgba(0, 0, 0, .2); }
.hl.hover .tag { background: var(--hov); color: #002433; }
.hl .tag.below { bottom: auto; top: 100%; margin: 5px 0 0; }

/* the floating "Edit page" pill */
.dock { position: fixed; left: 16px; bottom: 16px; pointer-events: auto; }
.pill { display: flex; align-items: center; gap: 9px; height: 40px; padding: 0 14px 0 15px; border-radius: 999px; border: .5px solid var(--rim);
  background: var(--glass); -webkit-backdrop-filter: blur(30px) saturate(180%); backdrop-filter: blur(30px) saturate(180%);
  color: var(--fg); font-size: 14px; font-weight: 600; box-shadow: var(--shadow); transition: transform .15s; }
.pill:hover { transform: translateY(-1px); }
.pill:active { transform: scale(.97); }
.pill .dot { width: 9px; height: 9px; border-radius: 50%; background: var(--faint); }
.pill.on .dot { background: var(--ok); box-shadow: 0 0 0 4px rgba(48, 209, 88, .22); }

/* the panel: a frosted-glass sheet */
.panel { position: fixed; top: 12px; right: 12px; width: 312px; max-width: calc(100vw - 24px); max-height: calc(100vh - 24px); pointer-events: auto;
  display: flex; flex-direction: column; color: var(--fg); font-size: 13px; overflow: hidden;
  background: var(--glass); -webkit-backdrop-filter: blur(40px) saturate(180%); backdrop-filter: blur(40px) saturate(180%);
  border: .5px solid var(--rim); border-radius: 20px; box-shadow: var(--shadow); }
@supports not (backdrop-filter: blur(1px)) { .panel, .pill, .toast, .crop { background: var(--glass-solid); } }
.panel[hidden], .hl[hidden] { display: none; }
.panel.busy { opacity: .6; pointer-events: none; }

/* header, with an iOS grabber that says "you can drag me" */
header { position: relative; display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; padding: 16px 14px 10px 16px; cursor: grab; touch-action: none; }
header::before { content: ''; position: absolute; top: 6px; left: 50%; width: 36px; height: 5px; margin-left: -18px; border-radius: 3px; background: var(--fill2); }
.panel.dragging, .panel.dragging * { cursor: grabbing !important; user-select: none; }
.panel.resizing, .panel.resizing * { user-select: none; }
.crumb { display: flex; gap: 8px; align-items: flex-start; min-width: 0; flex: 1 1 auto; }
.crumb > div { min-width: 0; flex: 1 1 auto; }
.name { font: 600 16px/1.25 var(--sf); letter-spacing: -.01em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.name .kind { font: inherit; color: var(--fg); margin-right: 5px; text-transform: none; letter-spacing: -.01em; }
.name .sel-name { font: 500 12px var(--mono); color: var(--dim); letter-spacing: 0; }
.src { color: var(--dim); font-size: 12px; margin-top: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ghost { background: none; border: 0; color: var(--accent); padding: 5px 8px; border-radius: 8px; font-weight: 500; }
.ghost:hover { background: var(--fill); }
.crumb .ghost.up { width: 28px; height: 28px; padding: 0; border-radius: 50%; background: var(--fill); color: var(--dim); font-size: 13px; flex: 0 0 auto; }
.hd-actions { display: flex; gap: 6px; flex: 0 0 auto; }
.hd-actions .ghost { width: 28px; height: 28px; padding: 0; border-radius: 50%; background: var(--fill); color: var(--dim); font-size: 12px; font-weight: 700; }
.hd-actions .ghost:hover { background: var(--fill2); color: var(--fg); }
.hd-actions .on { color: var(--accent); }

/* segmented controls: tabs, scope, position, alignment, crop shapes */
.tabs, .scope { position: relative; display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; gap: 2px; padding: 2px; border-radius: 10px; background: var(--fill); }
.tabs { --n: 3; } .scope { --n: 2; }
/* the selected option is a pill that springs between choices */
.seg-pill { position: absolute; top: 2px; bottom: 2px; left: 2px; width: calc((100% - 4px - (var(--n) - 1) * 2px) / var(--n)); border-radius: 8px; background: var(--cell-on);
  box-shadow: 0 3px 8px rgba(0, 0, 0, .12), 0 3px 1px rgba(0, 0, 0, .04); translate: calc(var(--i, 0) * (100% + 2px)) 0; transition: translate .42s cubic-bezier(.3, 1.35, .5, 1); pointer-events: none; }
.tabs { margin: 0 14px 4px; }
.scope { margin: 10px 0 0; }
.tabs button, .scope button { position: relative; z-index: 1; border: 0; background: none; padding: 6px 6px; border-radius: 8px; color: var(--fg); font-size: 13px; font-weight: 500;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; transition: opacity .15s; }
.tabs button:not(.on):hover, .scope button:not(.on):hover { opacity: .7; }
.tabs button.on, .scope button.on { font-weight: 600; }
/* a quiet dot instead of a number badge */
.dot-badge { display: inline-block; width: 7px; height: 7px; margin-left: 6px; border-radius: 50%; background: var(--accent); vertical-align: 1px; }
.seg { display: inline-flex; background: var(--fill); border-radius: 9px; padding: 2px; gap: 2px; }
.seg button { border: 0; background: none; padding: 5px 10px; border-radius: 7px; color: var(--fg); font-size: 12.5px; font-weight: 500; }
.seg button.on { background: var(--cell-on); font-weight: 600; box-shadow: 0 3px 8px rgba(0, 0, 0, .12), 0 3px 1px rgba(0, 0, 0, .04); }
.seg button:hover:not(:disabled):not(.on) { background: var(--fill); }
.seg button:disabled { opacity: .35; cursor: default; }

/* panel layout controls */
.layout-row { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin: 0 14px 10px; padding: 10px 12px; border-radius: 12px; background: var(--card); }
.layout-row .seg button { padding: 5px 8px; }
.layout-row .hint { margin: 0; width: 100%; }
.panel.min .tabs, .panel.min .body, .panel.min footer, .panel.min .warn, .panel.min .grip, .panel.min .layout-row { display: none; }
.grip { position: absolute; right: 2px; bottom: 2px; width: 18px; height: 18px; cursor: nwse-resize; touch-action: none; z-index: 3; border-bottom-right-radius: 16px;
  background: linear-gradient(135deg, transparent 50%, var(--faint) 50%, var(--faint) 58%, transparent 58%, transparent 68%, var(--faint) 68%, var(--faint) 76%, transparent 76%); }
.grip:hover { background-color: rgba(10, 132, 255, .15); }
.panel.anchor-right .grip { right: auto; left: 2px; cursor: nesw-resize; transform: scaleX(-1); }
.edge { position: absolute; top: 0; bottom: 18px; right: 0; width: 8px; cursor: ew-resize; touch-action: none; z-index: 2; }
.edge::after { content: ''; position: absolute; top: 18px; bottom: 18px; right: 1px; width: 3px; border-radius: 3px; background: transparent; transition: background .15s; }
.edge:hover::after, .panel.resizing .edge::after { background: var(--accent); }
.panel.anchor-right .edge { right: auto; left: 0; }
.panel.anchor-right .edge::after { right: auto; left: 1px; }
.panel.min .edge { display: none; }
.edge-b { position: absolute; left: 22px; right: 22px; bottom: 0; height: 8px; cursor: ns-resize; touch-action: none; z-index: 2; }
.edge-b::after { content: ''; position: absolute; left: 18px; right: 18px; bottom: 1px; height: 3px; border-radius: 3px; background: transparent; transition: background .15s; }
.edge-b:hover::after, .panel.resizing-b .edge-b::after { background: var(--accent); }
.panel.min .edge-b, .panel[data-dock="auto"] .edge-b, .panel[data-dock="left"] .edge-b, .panel[data-dock="right"] .edge-b { display: none; }

/* body: grouped, rounded sections like the Settings app */
.warn { margin: 8px 14px 0; padding: 10px 12px; border-radius: 12px; background: var(--warn-bg); color: var(--warn); font-size: 12.5px; line-height: 1.4; }
.body { flex: 1; min-height: 120px; overflow-y: auto; overflow-x: hidden; padding: 2px 14px 14px; }
.panel { container-type: inline-size; }
section { margin-top: 12px; padding: 4px 12px; border-radius: 12px; background: var(--card); }
section:has(> h4:only-child) { display: none; }
h4 { margin: 8px 0 4px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: .02em; color: var(--dim); }
.hint { color: var(--dim); margin: 4px 0 8px; line-height: 1.4; font-size: 12px; }
.row { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 6px 8px; min-height: 40px; padding: 5px 0; }
.row > .color, .row > .grad, .row > .border, .row > .range, .row > .seg { flex: 1 1 0; min-width: 0; }
.row > .seg { flex: 0 1 auto; }
section { min-width: 0; }
section > .row + .row, section > .row + .check, section > .check + .row, section > .grid2 + .row, section > .row + .grid2 { border-top: .5px solid var(--sep); }
.row > span { color: var(--fg); flex: 0 0 auto; min-width: 56px; font-size: 13px; }
.grid2 { display: grid; grid-template-columns: 1fr 1fr; column-gap: 12px; }
.grid2 .row > span { min-width: 0; color: var(--dim); font-size: 12.5px; }

/* inputs: soft filled fields */
input, select, textarea { font: 13px var(--sf); font-variant-numeric: tabular-nums; color: var(--fg); background: var(--fill); border: 0;
  border-radius: 9px; height: 32px; padding: 0 10px; width: 100%; min-width: 0; outline: none; transition: box-shadow .15s; }
select { -webkit-appearance: none; appearance: none; padding-right: 26px; background-image: var(--chev); background-repeat: no-repeat; background-position: right 10px center; cursor: pointer; }
.row > input, .row > select { max-width: 170px; }
.grid2 .row > input, .grid2 .row > select { max-width: 86px; }
input:focus, select:focus, textarea:focus { box-shadow: 0 0 0 3px rgba(10, 132, 255, .35); }
textarea { height: 96px; padding: 9px 11px; resize: vertical; font-size: 13.5px; line-height: 1.4; border-radius: 11px; margin: 4px 0; }
textarea.txt { height: auto; min-height: 40px; margin: 4px 0 2px; }
.color .hex, .border input:not([type=color]) { font-family: var(--mono); font-size: 12px; }

/* color swatches: round, like iOS */
input[type=color] { -webkit-appearance: none; appearance: none; width: 28px; height: 28px; flex: 0 0 28px; padding: 0; border-radius: 50%; background: none; cursor: pointer;
  box-shadow: inset 0 0 0 .5px var(--rim), 0 0 0 .5px var(--sep); overflow: hidden; }
input[type=color]::-webkit-color-swatch-wrapper { padding: 0; }
input[type=color]::-webkit-color-swatch { border: 0; border-radius: 50%; }
input[type=color]::-moz-color-swatch { border: 0; border-radius: 50%; }
.color { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; justify-content: flex-end; max-width: 190px; }
.color .hex { width: 90px; }

/* iOS switches for every checkbox */
.check { display: flex; flex-direction: row-reverse; justify-content: space-between; align-items: center; gap: 10px; min-height: 40px; padding: 5px 0; color: var(--fg); font-size: 13px; cursor: pointer; }
.var { display: flex; gap: 6px; align-items: center; color: var(--accent); font: 500 11.5px var(--mono); width: 100%; justify-content: flex-end; cursor: pointer; }
.check input[type=checkbox], .var input[type=checkbox] { -webkit-appearance: none; appearance: none; position: relative; flex: 0 0 auto; margin: 0; padding: 0;
  width: 46px; height: 28px; border-radius: 28px; background: var(--fill2); cursor: pointer; transition: background .2s; box-shadow: none; }
.var input[type=checkbox] { width: 34px; height: 20px; }
.check input[type=checkbox]::before, .var input[type=checkbox]::before { content: ''; position: absolute; top: 2px; left: 2px; width: 24px; height: 24px; border-radius: 50%;
  background: var(--knob); box-shadow: 0 3px 8px rgba(0, 0, 0, .15), 0 3px 1px rgba(0, 0, 0, .06); transition: transform .2s cubic-bezier(.3, .7, .4, 1.2); }
.var input[type=checkbox]::before { width: 16px; height: 16px; }
.check input[type=checkbox]:checked, .var input[type=checkbox]:checked { background: var(--ok); }
.check input[type=checkbox]:checked::before { transform: translateX(18px); }
.var input[type=checkbox]:checked::before { transform: translateX(14px); }

/* iOS sliders */
.range { display: flex; align-items: center; gap: 10px; flex: 1; justify-content: flex-end; }
.range input[type=range] { -webkit-appearance: none; appearance: none; width: 100%; max-width: 128px; min-width: 60px; height: 4px; padding: 0; border-radius: 4px; cursor: pointer;
  background: linear-gradient(to right, var(--accent) var(--p, 50%), var(--fill2) var(--p, 50%)); }
.range input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; border-radius: 50%; background: #fff;
  box-shadow: 0 0.5px 4px rgba(0, 0, 0, .12), 0 6px 13px rgba(0, 0, 0, .12), 0 0 0 .5px rgba(0, 0, 0, .04); }
.range input[type=range]::-moz-range-thumb { width: 22px; height: 22px; border: 0; border-radius: 50%; background: #fff; box-shadow: 0 3px 8px rgba(0, 0, 0, .2); }
.range input[type=range]:focus { box-shadow: none; }
.range output { width: 38px; text-align: right; color: var(--dim); font: 12px var(--sf); font-variant-numeric: tabular-nums; }
.grad, .border { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; justify-content: flex-end; }
.grad select { width: 52px; padding-right: 20px; background-position: right 7px center; }
.border input:not([type=color]) { width: 58px; }

/* buttons */
.primary { background: var(--accent); color: #fff; border: 0; border-radius: 12px; padding: 0 16px; height: 36px; white-space: nowrap; font-size: 14px; font-weight: 600;
  display: inline-flex; gap: 8px; align-items: center; justify-content: center; transition: filter .15s, transform .1s; }
.primary:hover { filter: brightness(1.08); }
.primary:active { transform: scale(.98); }
.primary kbd { background: rgba(255, 255, 255, .22); color: #fff; }
section .primary { margin: 8px 0 10px; width: 100%; }
.mini { background: var(--fill); color: var(--accent); border: 0; border-radius: 8px; padding: 6px 11px; font-size: 13px; font-weight: 500; white-space: nowrap; transition: background .15s; }
.mini:hover { background: var(--fill2); }
.row .mini { flex: 0 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.kind { font: 600 10.5px var(--sf); text-transform: uppercase; letter-spacing: .04em; color: var(--accent); }

/* pending changes and save bar */
footer.pending { border-top: .5px solid var(--sep); padding: 12px 14px 14px; max-height: 38%; overflow: auto; flex: 0 0 auto; }
footer .hint { margin: 0; text-align: center; }
footer ol { list-style: none; margin: 0 0 12px; padding: 0; display: grid; gap: 6px; }
footer li { display: flex; justify-content: space-between; align-items: flex-start; gap: 6px; padding: 9px 11px; border-radius: 12px; background: var(--card); }
footer li > div { min-width: 0; }
footer li b { display: block; font-weight: 600; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
footer li small { display: block; color: var(--dim); margin-top: 2px; font-size: 11.5px; line-height: 1.35; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
footer ol.collapsed { display: none; }
.pend-toggle { display: flex; width: 100%; align-items: center; justify-content: space-between; margin: 0 0 10px; padding: 9px 12px; border: 0; border-radius: 12px; background: var(--card); color: var(--fg); font-size: 13px; font-weight: 600; }
.pend-toggle .chev { width: 7px; height: 7px; border-right: 1.8px solid var(--faint); border-bottom: 1.8px solid var(--faint); rotate: 45deg; transition: rotate .3s cubic-bezier(.3, 1.3, .5, 1); }
.pend-toggle[aria-expanded="true"] .chev { rotate: 225deg; }
footer li.fb small { color: var(--warn); }
footer li .drop { width: 22px; height: 22px; padding: 0; border-radius: 50%; background: var(--fill); color: var(--dim); font-size: 10px; flex: 0 0 auto; }
.actions { display: flex; justify-content: space-between; align-items: center; }

/* history */
.commit { display: flex; justify-content: space-between; gap: 8px; align-items: center; padding: 10px 0; }
.commit + .commit { border-top: .5px solid var(--sep); }
.commit .when { color: var(--dim); font-size: 11.5px; }
.commit .when code { font-size: 10.5px; }
.commit .subj { margin-top: 3px; line-height: 1.35; font-size: 13px; }
.commit:not(.ours) { opacity: .5; }

/* toasts: small glass banners */
.toasts { position: fixed; left: 16px; bottom: 68px; display: grid; gap: 8px; pointer-events: auto; max-width: min(440px, calc(100vw - 32px)); }
.toast { display: flex; gap: 10px; align-items: center; padding: 11px 14px; border-radius: 16px; color: var(--fg); border: .5px solid var(--rim);
  background: var(--glass); -webkit-backdrop-filter: blur(30px) saturate(180%); backdrop-filter: blur(30px) saturate(180%);
  box-shadow: var(--shadow); font-size: 13px; line-height: 1.4; transition: opacity .3s, transform .3s; }
.toast::before { content: ''; flex: 0 0 8px; height: 8px; border-radius: 50%; background: var(--accent); }
.toast.ok::before { background: var(--ok); }
.toast.error::before { background: var(--err); }
.toast span { flex: 1; }
.toast .mini { padding: 5px 10px; }
.toast.out { opacity: 0; transform: translateY(6px); }

/* image crop window */
.modal { position: fixed; inset: 0; z-index: 10; pointer-events: auto; display: grid; place-items: center; background: rgba(0, 0, 0, .35);
  -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px); }
.crop { width: min(620px, 94vw); color: var(--fg); border: .5px solid var(--rim); border-radius: 22px; padding: 16px; display: grid; gap: 14px; font-size: 13px;
  background: var(--glass); -webkit-backdrop-filter: blur(40px) saturate(180%); backdrop-filter: blur(40px) saturate(180%); box-shadow: var(--shadow); }
.crop-head { display: flex; gap: 10px; align-items: baseline; }
.crop-head b { font-size: 16px; }
.crop .dim { color: var(--dim); font-size: 12px; }
.crop-stage { position: relative; justify-self: center; overflow: hidden; border-radius: 12px; background: repeating-conic-gradient(#2c2c2e 0 25%, #3a3a3c 0 50%) 0 0 / 16px 16px; touch-action: none; }
.crop-stage canvas { display: block; }
.crop-rect { position: absolute; border: 2px solid #fff; box-shadow: 0 0 0 9999px rgba(0, 0, 0, .5); cursor: move; border-radius: 2px; }
.crop-rect i { position: absolute; width: 14px; height: 14px; background: #fff; border-radius: 50%; box-shadow: 0 1px 4px rgba(0, 0, 0, .35); }
.crop-rect i[data-h=nw] { left: -8px; top: -8px; cursor: nwse-resize; } .crop-rect i[data-h=ne] { right: -8px; top: -8px; cursor: nesw-resize; }
.crop-rect i[data-h=sw] { left: -8px; bottom: -8px; cursor: nesw-resize; } .crop-rect i[data-h=se] { right: -8px; bottom: -8px; cursor: nwse-resize; }
.crop-tools, .crop-foot { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.crop-foot .grow { flex: 1; }

/* motion: springs, like iOS */
@keyframes di-pop { from { opacity: 0; scale: .94; translate: 0 10px; } to { opacity: 1; scale: 1; translate: 0 0; } }
@keyframes di-rise { from { opacity: 0; scale: .96; translate: 0 12px; } to { opacity: 1; scale: 1; translate: 0 0; } }
.panel.enter { animation: di-pop .5s cubic-bezier(.2, .9, .25, 1.12); transform-origin: top right; }
.panel.anchor-right.enter { transform-origin: top right; } .panel:not(.anchor-right).enter { transform-origin: top left; }
.panel.settle { transition: left .5s cubic-bezier(.2, .9, .3, 1.1), top .5s cubic-bezier(.2, .9, .3, 1.1), width .5s cubic-bezier(.2, .9, .3, 1.1), height .5s cubic-bezier(.2, .9, .3, 1.1); }
.toast { animation: di-rise .45s cubic-bezier(.2, .9, .25, 1.15); }
.crop { animation: di-pop .45s cubic-bezier(.2, .9, .25, 1.12); }
.primary, .mini, .seg button, .tabs button, .scope button, .hd-actions .ghost, .pill { transition: scale .12s, filter .15s, background .15s, opacity .15s; }
.primary:active, .mini:active, .seg button:active, .tabs button:active, .scope button:active, .hd-actions .ghost:active { scale: .95; }
@media (prefers-reduced-motion: reduce) { .panel.enter, .toast, .crop { animation: none; } .seg-pill, .panel.settle { transition: none; } }

/* narrow panel: one column, controls get the whole line */
@container (max-width: 300px) {
  .grid2 { grid-template-columns: 1fr; }
  .grid2 .row > input, .grid2 .row > select { max-width: none; flex: 1 1 0; }
  .row > span:first-child { min-width: 0; }
  .grad { justify-content: flex-start; }
  .primary kbd { display: none; }
  .hd-actions { gap: 4px; }
  .tabs button, .scope button { font-size: 12px; padding: 6px 4px; }
}

/* tap-to-open groups keep the panel short */
.fold:not(.open) > :not(h4) { display: none; }
.fold > h4 { margin: 0; }
.fold-btn { display: flex; width: 100%; align-items: center; justify-content: space-between; min-height: 40px; padding: 0; border: 0; background: none;
  font: inherit; color: inherit; text-transform: inherit; letter-spacing: inherit; cursor: pointer; }
.fold-btn .chev { width: 8px; height: 8px; border-right: 1.8px solid var(--faint); border-bottom: 1.8px solid var(--faint); rotate: -45deg; margin-right: 4px; transition: rotate .3s cubic-bezier(.3, 1.3, .5, 1); }
.fold.open .fold-btn .chev { rotate: 45deg; }
.fold.open > h4 + * { animation: di-rise .35s cubic-bezier(.2, .9, .25, 1.1); }
.lead { margin: 12px 4px 0; color: var(--dim); font-size: 12.5px; line-height: 1.4; }

/* Ask AI: requests waiting for the AI */
.reqs { padding-bottom: 6px; }
.req { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 40px; padding: 4px 0; font-size: 13px; }
.req + .req { border-top: .5px solid var(--sep); }
.req span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.req .req-remove { width: 24px; height: 24px; padding: 0; border-radius: 50%; background: var(--fill); color: var(--dim); font-size: 10px; flex: 0 0 auto; }

/* slim scrollbars, dark like iOS */
.panel, .panel * { scrollbar-width: thin; scrollbar-color: var(--thumb) transparent; }
.panel ::-webkit-scrollbar { width: 8px; height: 8px; }
.panel ::-webkit-scrollbar-track { background: transparent; }
.panel ::-webkit-scrollbar-thumb { background: var(--thumb); border-radius: 8px; border: 2px solid transparent; background-clip: padding-box; }
`;

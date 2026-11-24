(()=>{var et=/^text-(xs|sm|base|lg|[2-9]?xl|\[\d.*(px|rem|em|%)\])$/,Ht=/^text-(left|center|right|justify|start|end|wrap|nowrap|balance|pretty|ellipsis|clip)$/,Ut=/^bg-(fixed|local|scroll|clip-.*|origin-.*|no-repeat|repeat.*|auto|cover|contain|center|top|bottom|left.*|right.*|none|gradient-.*|blend-.*|opacity-.*|\[url.*)$/,Wt=/^font-(sans|serif|mono|\['.*'\]|\[".*"\])$/,tt={"background-color":{test:s=>s.startsWith("bg-")&&!Ut.test(s),make:s=>`bg-[${s}]`},color:{test:s=>s.startsWith("text-")&&!et.test(s)&&!Ht.test(s),make:s=>`text-[${s}]`},"font-size":{test:s=>et.test(s),make:s=>`text-[${s}]`},"font-family":{test:s=>Wt.test(s),make:s=>`font-['${_t(s).replace(/ /g,"_")}']`},"font-weight":{test:s=>/^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black|\[\d+\])$/.test(s),make:s=>`font-[${s}]`},width:{test:s=>/^w-/.test(s),make:s=>`w-[${s}]`},height:{test:s=>/^h-/.test(s),make:s=>`h-[${s}]`},padding:{test:s=>/^p-/.test(s),make:s=>`p-[${s.replace(/ /g,"_")}]`},margin:{test:s=>/^m-/.test(s),make:s=>`m-[${s.replace(/ /g,"_")}]`},"border-radius":{test:s=>/^rounded(-|$)/.test(s)&&!/^rounded-[trblse]{1,2}(-|$)/.test(s),make:s=>`rounded-[${s}]`},gap:{test:s=>/^gap-(?!x-|y-)/.test(s),make:s=>`gap-[${s}]`},"box-shadow":{test:s=>/^shadow(-(none|2xs|xs|sm|md|lg|xl|2xl|inner|\[.*\]))?$/.test(s),make:s=>s==="none"?"shadow-none":`shadow-[${s.replace(/ /g,"_")}]`},opacity:{test:s=>/^opacity-(\d+|\[.*\])$/.test(s),make:s=>`opacity-[${s}]`}};function _t(s){return s.split(",")[0].trim().replace(/^['"]|['"]$/g,"")}var nt=s=>s in tt;function de(s,q,B){let H=tt[q];if(!H)return null;let C=s.split(/\s+/).filter(Boolean).filter(X=>X.includes(":")||!H.test(X.replace(/^!/,""))),M=H.make(B.trim().replace(/\s*,\s*/g,","));return[...C,M].join(" ")}function at(s){return/(^|\s)(flex|grid|block|hidden|(p|m|px|py|mt|mb|w|h|gap|text|bg|rounded|font|shadow)-[\w[\]#.\/-]+)(\s|$)/.test(s||"")}function Gt(s){return s.replace(/\/\*[\s\S]*?\*\//g,"").replace(/\s*([>+~,])\s*/g,"$1").replace(/\s+/g," ").replace(/"/g,"'").trim()}var Yt=s=>(s||"").replace(/\s+/g," ").replace(/\(\s*/g,"(").replace(/\s*\)/g,")").replace(/\s*:\s*/g,":").trim().toLowerCase();function ot(s,q=[]){return`${q.map(B=>`${B.type} ${Yt(B.text)}`).join(" | ")}::${Gt(s)}`}var it=`
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
`;(()=>{if(window.__designInside)return;window.__designInside=!0;let s="/__em/",q=[{name:"System UI",css:'system-ui, -apple-system, "Segoe UI", sans-serif',google:!1},{name:"Inter",css:'"Inter", system-ui, sans-serif'},{name:"DM Sans",css:'"DM Sans", system-ui, sans-serif'},{name:"Manrope",css:'"Manrope", system-ui, sans-serif'},{name:"Space Grotesk",css:'"Space Grotesk", system-ui, sans-serif'},{name:"Bricolage Grotesque",css:'"Bricolage Grotesque", system-ui, sans-serif'},{name:"Syne",css:'"Syne", system-ui, sans-serif'},{name:"Playfair Display",css:'"Playfair Display", Georgia, serif'},{name:"Fraunces",css:'"Fraunces", Georgia, serif'},{name:"Lora",css:'"Lora", Georgia, serif'},{name:"JetBrains Mono",css:'"JetBrains Mono", ui-monospace, monospace'},{name:"IBM Plex Mono",css:'"IBM Plex Mono", ui-monospace, monospace'}],B=/:(hover|focus|focus-visible|focus-within|active|visited|target|checked)\b/,H="design-inside:state",a={on:!1,hover:null,sel:null,scope:"this",pending:[],status:{git:!0,mode:"static"},editing:null,tab:"style"},C=document.createElement("design-inside-root");C.style.cssText="all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;";let M=C.attachShadow({mode:"open"});function X(){let e=n=>{let o=String(n).match(/rgba?\(([^)]+)\)/);if(!o)return null;let[r,i,c,d=1]=o[1].split(/[\s,/]+/).filter(Boolean).map(Number);return d<.5?null:[r,i,c]};for(let n of[document.body,document.documentElement]){let o=n&&e(getComputedStyle(n).backgroundColor);if(o)return(.2126*o[0]+.7152*o[1]+.0722*o[2])/255<.5?"dark":"light"}let t=getComputedStyle(document.documentElement).colorScheme||"";return/dark/.test(t)&&!/light/.test(t)?"dark":"light"}let pe=()=>{let e=X();C.dataset.tone!==e&&(C.dataset.tone=e)};pe();let rt=new MutationObserver(pe);for(let e of[document.documentElement,document.body])e&&rt.observe(e,{attributes:!0,attributeFilter:["class","style","data-theme","data-mode","data-color-scheme"]});matchMedia("(prefers-color-scheme: dark)").addEventListener("change",pe),M.innerHTML=`<style>${it}</style>
    <div class="hl hover" hidden><span class="tag"></span></div>
    <div class="hl selected" hidden><span class="tag"></span></div>
    <div class="dock">
      <button class="pill" title="design-inside (Alt+E)"><span class="dot"></span><span class="pill-label">Edit page</span><kbd>Alt E</kbd></button>
    </div>
    <aside class="panel" hidden></aside>
    <div class="toasts"></div>`;let G=e=>M.querySelector(e),st=G(".hl.hover"),lt=G(".hl.selected"),g=G(".panel"),ue=G(".pill"),Z=e=>e.composedPath().includes(C),Me=()=>document.documentElement.appendChild(C);document.body?Me():document.addEventListener("DOMContentLoaded",Me);let v=e=>String(e).replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t]);async function I(e,t){let n=await fetch(s+e,t?{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(t)}:{}),o=await n.json().catch(()=>({error:`HTTP ${n.status}`}));if(!n.ok)throw Object.assign(new Error(o.error||`HTTP ${n.status}`),{data:o,status:n.status});return o}let T=e=>{let t=e&&e.getAttribute&&e.getAttribute("data-em");if(!t)return null;let n=t.lastIndexOf("#");return{file:t.slice(0,n),path:t.slice(n+1),tag:e.tagName.toLowerCase()}},ct=()=>{let e=document.querySelector("[data-em]");return e?T(e).file:null};function Q(e){let t=e&&e.match(/rgba?\(([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?/);return t?t[4]!==void 0&&Number(t[4])===0?"":"#"+[t[1],t[2],t[3]].map(n=>Math.round(+n).toString(16).padStart(2,"0")).join(""):e&&e.startsWith("#")?e:""}let dt=e=>/^-?\d+(\.\d+)?$/.test(String(e).trim())?`${e}px`:String(e).trim();function Y(e){let t=e.tagName.toLowerCase(),n=e.id?`#${e.id}`:"",o=[...e.classList].filter(r=>!r.includes(":")).slice(0,2).map(r=>`.${r}`).join("");return`${t}${n}${o}`}function Ie(e){let t=[];for(let n=e;n&&n.nodeType===1&&n!==document.documentElement;n=n.parentElement){if(n.id){t.unshift(`#${CSS.escape(n.id)}`);break}let o=n.parentElement?[...n.parentElement.children].filter(r=>r.tagName===n.tagName):[];t.unshift(n.tagName.toLowerCase()+(o.length>1?`:nth-of-type(${o.indexOf(n)+1})`:""))}return t.join(" > ")}let pt=()=>!!document.querySelector('script[src*="tailwindcss"], style[data-vite-dev-id*="tailwind"]')||getComputedStyle(document.documentElement).getPropertyValue("--tw-ring-offset-width")!==""||getComputedStyle(document.body).getPropertyValue("--tw-border-spacing-x")!=="",Pe=e=>pt()&&at(e.getAttribute("class")||"");function ut(e){let t=e.ownerNode;if(t&&t.tagName==="STYLE"){let n=T(t);if(n)return{file:n.file,path:n.path,label:`<style> in ${n.file}`};let o=t.getAttribute("data-vite-dev-id");return o&&/\.css(\?|$)/.test(o)?{viteId:o,label:o.split("/").slice(-2).join("/")}:null}if(e.href)try{let n=new URL(e.href);return n.host!==location.host?null:{href:e.href,label:n.pathname.replace(/^\//,"")}}catch{return null}return null}function ge(){let e=[],t=0,n=(r,i,c,d)=>{for(let l of r){if(l instanceof CSSImportRule){l.styleSheet&&o(l.styleSheet);continue}if(l instanceof CSSStyleRule){let m=ot(l.selectorText,c),h=d[m]=(d[m]??-1)+1;e.push({rule:l,ref:i,conds:c,occurrence:h,order:t++});continue}let f=null;window.CSSMediaRule&&l instanceof CSSMediaRule?f={type:"media",text:l.conditionText||l.media.mediaText}:window.CSSSupportsRule&&l instanceof CSSSupportsRule?f={type:"supports",text:l.conditionText}:window.CSSLayerBlockRule&&l instanceof CSSLayerBlockRule?f={type:"layer",text:l.name}:window.CSSContainerRule&&l instanceof CSSContainerRule&&(f={type:"container",text:l.conditionText}),f&&l.cssRules&&n(l.cssRules,i,[...c,f],d)}},o=r=>{if(r.ownerNode&&C.contains(r.ownerNode))return;let i;try{i=r.cssRules}catch{return}n(i,ut(r),[],{})};for(let r of document.styleSheets)o(r);return e}let gt=e=>e.type==="media"?matchMedia(e.text).matches:e.type==="supports"?CSS.supports(e.text):!0;function ft(e){let t=[],n=0,o="";for(let r of e)(r==="("||r==="[")&&n++,(r===")"||r==="]")&&n--,r===","&&!n?(t.push(o.trim()),o=""):o+=r;return o.trim()&&t.push(o.trim()),t}function ht(e){let t=e.replace(/:(not|is|has)\(([^)]*)\)/g," $2").replace(/:where\([^)]*\)/g,"").replace(/\[[^\]]*\]/g," .attr"),n=(t.match(/#[\w-]+/g)||[]).length,o=(t.match(/\.[\w-]+|:(?!:)[\w-]+/g)||[]).length,r=(t.replace(/::?[\w-]+/g,i=>i.startsWith("::")?" X":"").match(/(^|[\s>+~])[a-zA-Z][\w-]*/g)||[]).length;return n*1e4+o*100+r}function ee(e){let t=[];for(let n of ge()){if(!n.conds.every(gt))continue;let o=-1,r=null;for(let i of ft(n.rule.selectorText))if(!(B.test(i)||/::/.test(i)))try{if(e.matches(i)){let c=ht(i);c>o&&(o=c,r=i)}}catch{}r&&t.push({...n,spec:o,branch:r})}return t}function fe(e,t){let n=null;for(let o of e){let r=o.rule.style.getPropertyValue(t)||Oe[t]&&o.rule.style.getPropertyValue(Oe[t]);if(!r)continue;let c=[o.rule.style.getPropertyPriority(t)==="important"?1:0,o.spec,o.order];(!n||bt(c,n.score)>0)&&(n={...o,score:c,value:r.trim()})}return n}let Oe={"background-color":"background"},bt=(e,t)=>e[0]-t[0]||e[1]-t[1]||e[2]-t[2],qe=(e,t)=>!!e.style.getPropertyValue(t);function he(e){let t=[...e.classList].filter(n=>/^[a-zA-Z_][\w-]*$/.test(n));return t.length?"."+t.map(n=>CSS.escape(n)).join("."):null}function mt(e){for(let t=e.length-1;t>=0;t--)if(e[t].ref&&!e[t].conds.length)return e[t].ref;for(let t of ge())if(t.ref)return t.ref;return null}function xt(e,t,n,o){let r=T(e),i=ee(e),c=Pe(e)&&nt(t),d=e.getAttribute("class")||"";if(o==="this"){if(c){let x=de(d,t,n);return r?{change:{kind:"class",loc:r,oldClass:d,newClass:x},where:`class on this <${r.tag}> in ${r.file}`,affected:[e]}:{change:{kind:"class-search",oldClass:d,newClass:x},where:"its Tailwind classes (found by search)",affected:[e]}}let h=qe(e,t)?null:fe(i,t);if(h&&h.ref){let x=[...document.querySelectorAll(h.branch)];if(x.length===1&&x[0]===e)return{change:{kind:"css-rule",sheet:h.ref,selector:h.rule.selectorText,conditions:h.conds,occurrence:h.occurrence,prop:t,value:n},where:`rule ${h.rule.selectorText} in ${h.ref.label} (only this element uses it)`,affected:[e]}}return r?{change:{kind:"inline",loc:r,prop:t,value:n},where:`inline style on this <${r.tag}> in ${r.file}`,affected:[e]}:{fallback:"This element is rendered by a framework and has no source mapping, so only your AI agent can place a one-off style safely.",affected:[e]}}if(c){let h=[...document.querySelectorAll("[class]")].filter(y=>y.getAttribute("class")===d),x=de(d,t,n);return h.every(T)?{changes:h.map(y=>({kind:"class",loc:T(y),oldClass:d,newClass:x})),where:`Tailwind classes on ${h.length} matching element${h.length>1?"s":""}`,affected:h}:{change:{kind:"class-search",oldClass:d,newClass:x},where:"the component's Tailwind classes (found by search)",affected:h}}let l=qe(e,t)?null:fe(i,t);if(l&&l.ref){let h=l.value.match(/^var\((--[\w-]+)\)$/),x=[...document.querySelectorAll(l.branch)];return h&&a.linkVars?{change:{kind:"css-var",sheets:[...new Map(ge().filter(E=>E.ref).map(E=>[JSON.stringify(E.ref),E.ref])).values()],name:h[1],value:n},where:`theme variable ${h[1]} (everything that uses it)`,affected:[],varName:h[1]}:{change:{kind:"css-rule",sheet:l.ref,selector:l.rule.selectorText,conditions:l.conds,occurrence:l.occurrence,prop:t,value:n},where:`rule ${l.rule.selectorText}${l.conds.length?` (@${l.conds.map(y=>y.type+" "+y.text).join(" ")})`:""} in ${l.ref.label}`,affected:x,varName:h&&h[1]}}let f=he(e),m=mt(i);return f&&m?{change:{kind:"css-new-rule",sheet:m,selector:f,prop:t,value:n},where:`${f} in ${m.label}`,affected:[...document.querySelectorAll(f)]}:{fallback:"No stylesheet rule to edit for this element.",affected:[e]}}function vt(e){for(let t of e.affected)e.preview.push([t,e.prop,t.style.getPropertyValue(e.prop),t.style.getPropertyPriority(e.prop)]),t.style.setProperty(e.prop,e.value,"important");if(e.change&&e.change.kind==="css-var"){let t=document.documentElement;e.preview.push([t,e.change.name,t.style.getPropertyValue(e.change.name),""]),t.style.setProperty(e.change.name,e.value)}}function te(e){for(let[t,n,o,r]of e.preview.reverse())o?t.style.setProperty(n,o,r):t.style.removeProperty(n),t.getAttribute("style")===""&&t.removeAttribute("style");e.preview=[]}function $(e,t,n){let o=a.sel;if(!o)return;let r=a.pending.find(d=>d.prop===e&&d.el===o);if(r&&(te(r),a.pending.splice(a.pending.indexOf(r),1)),t===null){z();return}let i=xt(o,e,t,a.scope),c={el:o,prop:e,value:t,label:n||`${e}: ${t}`,preview:[],...i};vt(c),a.pending.push(c),z(),L()}function je(){let e=a.pending.filter(t=>t.prop);for(let t of e)te(t),a.pending.splice(a.pending.indexOf(t),1);for(let t of e)a.sel=t.el,$(t.prop,t.value,t.label)}async function Re(){if(!a.pending.length)return;let e=a.pending.filter(i=>i.fallback),t=a.pending.filter(i=>!i.fallback),n=[];for(let i of t){let c=Y(i.el),d=i.change&&i.change.kind==="css-var"?` (theme ${i.change.name})`:i.change&&/css-/.test(i.change.kind)?` (${i.change.selector} in ${i.change.sheet.label})`:i.changes?` (${i.changes.length} elements)`:"";for(let l of i.changes||[i.change])n.push({prop:i.prop,value:i.value,...l,label:i.kind==="text"||i.kind==="image"?i.label:`${c} ${i.label}${d}`});if(i.prop==="font-family"){let l=q.find(f=>f.css===i.value);l&&l.google!==!1&&n.unshift({kind:"font-link",file:ct()||"index.html",family:l.name,optional:!0,label:`load ${l.name}`})}}if(e.length){for(let i of e)await me(`set ${i.prop} to ${i.value} on ${a.scope==="all"?"all elements like":"this"} ${Y(i.el)}`,i.el,i.fallback,!0);e.forEach(i=>{a.pending.splice(a.pending.indexOf(i),1)})}if(!n.length){z();return}let o=[],r=new Map;for(let i of n){if(i.kind!=="class"&&i.kind!=="class-search"){o.push(i);continue}let c=i.kind==="class"?`${i.loc.file}#${i.loc.path}`:`search:${i.oldClass}`,d=r.get(c);if(!d){r.set(c,i),o.push(i);continue}d.newClass=de(d.newClass,i.prop,i.value),d.label+=`; ${i.prop}: ${i.value}`}n.length=0,n.push(...o),ce(!0);try{let i=await I("apply",{pageUrl:location.href,changes:n});if(i.noop){w("Nothing changed in the files."),ne();return}F({toast:{text:`Saved ${i.sha} \xB7 ${i.message}`,sha:i.sha,files:i.files},reselect:i.reload&&i.reload.path}),location.reload()}catch(i){ce(!1);let c=n.map(d=>d.label).join("; ");w(i.message,{kind:"error",actions:i.data&&i.data.fallback?[{label:"Hand to AI",run:()=>me(c,a.sel,i.message)}]:[]})}}function ne(){for(let e of a.pending)te(e),e.undoPreview&&e.undoPreview();a.pending=[],z(),a.sel&&S(),L()}async function be(e){try{let t=await I("undo",e?{sha:e}:{});F({toast:{text:`Undid ${t.reverted}`}}),location.reload()}catch(t){w(t.message,{kind:"error"})}}async function me(e,t,n,o){let r=t||a.sel,i={};if(r){let c=getComputedStyle(r);for(let d of["color","background-color","font-family","font-size","font-weight","width","height","padding","margin","border-radius","display"])i[d]=c.getPropertyValue(d)}try{let c=await I("ask",{request:e,reason:n,pageUrl:location.href,loc:r&&T(r),selector:r?Ie(r):"page",html:r?r.outerHTML.replace(/ data-em="[^"]*"/g,""):"",rules:r?ee(r).map(d=>d.rule.selectorText).slice(-6):[],styles:i});a.status.pending=(a.status.pending||0)+1,a.tab==="claude"&&S(),w(`${o?"Handed to your AI":"Queued for your AI"}: \u201C${e}\u201D. It's listed in Ask AI until your AI applies it.`,{actions:[{label:"Copy prompt",run:()=>navigator.clipboard.writeText(c.prompt).then(()=>w("Prompt copied"))}]}),Le()}catch(c){w(c.message,{kind:"error"})}}function Ne(e,t){if(!t||!t.isConnected){e.hidden=!0;return}let n=t.getBoundingClientRect();e.hidden=!1,Object.assign(e.style,{left:`${n.left}px`,top:`${n.top}px`,width:`${n.width}px`,height:`${n.height}px`});let o=e.querySelector(".tag");o.textContent=`${Y(t)}  ${Math.round(n.width)}\xD7${Math.round(n.height)}`,o.classList.toggle("below",n.top<24)}let De="design-inside:layout",ae={dock:"auto",w:312,h:560,x:null,y:null,min:!1};a.layout=(()=>{try{return{...ae,...JSON.parse(localStorage.getItem(De)||"{}")}}catch{return{...ae}}})();let V=()=>{try{localStorage.setItem(De,JSON.stringify(a.layout))}catch{}},A=(e,t,n)=>Math.max(t,Math.min(n,e)),oe=236,xe=(e,t=160)=>(1-1/(e*.55/t+1))*t,wt=(e,t,n)=>e<t?t-xe(t-e):e>n?n+xe(e-n):e,ie=(e,t,n)=>a.stretch?wt(e,t,n):A(e,t,n);function R(){let e=a.layout,t=12,n=g.style,o=ie(e.w,oe,Math.max(oe,innerWidth-2*t)),r=ie(e.h,200,Math.max(200,innerHeight-2*t));n.left=n.right=n.top=n.bottom=n.transform=n.height="",n.width=`${o}px`,g.classList.toggle("min",!!e.min),g.dataset.dock=e.dock;let i=e.dock==="left"||e.dock==="auto"&&a.autoLeft?"left":"right";if(g.classList.toggle("anchor-right",["auto","right"].includes(e.dock)&&i==="right"),["auto","left","right"].includes(e.dock))n.top=`${t}px`,n[i]=`${t}px`,e.min||(n.bottom=`${t}px`);else if(e.dock==="top")n.top=`${t}px`,n.left="50%",n.transform="translateX(-50%)",e.min||(n.height=`${r}px`);else if(e.dock==="center")n.top="50%",n.left="50%",n.transform="translate(-50%, -50%)",e.min||(n.height=`${r}px`);else{let c=ie(e.y??t,0,Math.max(0,innerHeight-48));n.left=`${ie(e.x??innerWidth-o-t,0,Math.max(0,innerWidth-o))}px`,n.top=`${c}px`,e.min||(n.height=`${a.stretch?r:Math.min(r,innerHeight-c-t)}px`)}}function yt(){if(!(!a.sel||g.hidden)){if(a.layout.dock==="auto"){let e=a.sel.getBoundingClientRect(),t=a.layout.w+24;a.autoLeft=e.right>innerWidth-t&&e.left>t}R()}}g.addEventListener("dblclick",e=>{!e.target.closest("header")||e.target.closest("button, input, select, textarea")||(a.layout={...ae},V(),S(),R())}),g.addEventListener("pointerdown",e=>{let t=e.target.closest(".edge"),n=e.target.closest(".edge-b"),o=e.target.closest(".grip")||t||n,r=!o&&e.target.closest("header")&&!e.target.closest("button, input, select, textarea");if(!o&&!r)return;e.preventDefault();let i=g.getBoundingClientRect(),c={x:e.clientX,y:e.clientY,left:i.left,top:i.top,w:i.width,h:i.height},d=g.classList.contains("anchor-right"),l=!1,f=()=>{l=!0,r&&Object.assign(a.layout,{dock:"free",x:i.left,y:i.top,w:i.width,h:a.layout.min?a.layout.h:i.height}),g.classList.remove("settle"),g.classList.add(r?"dragging":n?"resizing-b":"resizing"),a.stretch=!0};r||f();let m=x=>{let y=x.clientX-c.x,E=x.clientY-c.y;if(!l){if(Math.hypot(y,E)<4)return;f()}r?(a.layout.x=c.left+y,a.layout.y=c.top+E):(n||(a.layout.w=c.w+(d?-y:y)),!t&&!["auto","left","right"].includes(a.layout.dock)&&(a.layout.h=c.h+E)),R()},h=()=>{if(removeEventListener("pointermove",m,!0),removeEventListener("pointerup",h,!0),removeEventListener("pointercancel",h,!0),g.classList.remove("dragging","resizing","resizing-b"),!l)return;a.stretch=!1;let x=a.layout;x.w=A(x.w,oe,Math.max(oe,innerWidth-24)),x.h=A(x.h,200,Math.max(200,innerHeight-24)),x.dock==="free"&&(x.x=A(x.x,0,Math.max(0,innerWidth-x.w)),x.y=A(x.y,0,Math.max(0,innerHeight-48))),g.classList.add("settle"),R(),setTimeout(()=>g.classList.remove("settle"),520),V()};addEventListener("pointermove",m,!0),addEventListener("pointerup",h,!0),addEventListener("pointercancel",h,!0)});let kt={"Size & spacing":"size",Effects:"effects",Position:"position"},Fe="design-inside:folds";a.folds=(()=>{try{return JSON.parse(localStorage.getItem(Fe)||"{}")}catch{return{}}})();function $t(){for(let e of g.querySelectorAll(".body section > h4")){let t=kt[e.textContent.trim()];if(!t)continue;let n=!!a.folds[t];e.parentElement.classList.add("fold"),e.parentElement.classList.toggle("open",n),e.innerHTML=`<button class="fold-btn" data-fold-toggle="${t}" aria-expanded="${n}">${v(e.textContent.trim())}<i class="chev"></i></button>`}}function St(e){a.folds[e]=!a.folds[e];try{localStorage.setItem(Fe,JSON.stringify(a.folds))}catch{}let t=g.querySelector(`[data-fold-toggle="${e}"]`);t&&(t.closest("section").classList.toggle("open",a.folds[e]),t.setAttribute("aria-expanded",String(a.folds[e])))}let ve={};function Be(e,t,n){let o=g.querySelector(`${e} .seg-pill`);if(!o||t<0){delete ve[n];return}let r=ve[n];r!=null&&r!==t&&(o.style.transition="none",o.style.setProperty("--i",r),o.offsetWidth,o.style.transition=""),o.style.setProperty("--i",t),ve[n]=t}let N={d:0,t:0};g.addEventListener("wheel",e=>{let t=e.target.closest(".body");if(!t)return;let n=t.scrollTop<=0&&e.deltaY<0,o=t.scrollTop+t.clientHeight>=t.scrollHeight-1&&e.deltaY>0;!n&&!o||(N.d=A(N.d-e.deltaY,-600,600),t.style.transition="none",t.style.translate=`0 ${Math.sign(N.d)*xe(Math.abs(N.d),120)}px`,clearTimeout(N.t),N.t=setTimeout(()=>{t.style.transition="translate .55s cubic-bezier(.2, .9, .3, 1.12)",t.style.translate="0 0",N.d=0},80))},{passive:!0});function L(){if(yt(),Ne(st,a.on&&a.hover&&a.hover!==a.sel?a.hover:null),Ne(lt,a.on?a.sel:null),M.querySelectorAll(".hl.affected").forEach(t=>t.remove()),a.on&&a.sel&&a.scope==="all"){let t=he(a.sel),n=t?[...document.querySelectorAll(t)].filter(o=>o!==a.sel).slice(0,40):[];for(let o of n){let r=document.createElement("div");r.className="hl affected";let i=o.getBoundingClientRect();Object.assign(r.style,{left:`${i.left}px`,top:`${i.top}px`,width:`${i.width}px`,height:`${i.height}px`}),M.insertBefore(r,g)}}}addEventListener("scroll",L,!0),addEventListener("resize",L);function D(e){a.editing&&_e(),e!==a.sel&&(a.tab="style"),a.sel=e,a.scope="this",S(),L()}let we=e=>{let t=e.target;return t&&t.nodeType===1&&t!==document.documentElement&&t!==document.body?t:null};document.addEventListener("mousemove",e=>{if(!a.on||Z(e)){a.hover&&(a.hover=null,L());return}let t=we(e);t!==a.hover&&(a.hover=t,L())},!0);let Lt=e=>{!a.on||Z(e)||a.editing&&a.editing.el.contains(e.target)||(e.preventDefault(),e.stopPropagation())};for(let e of["mousedown","mouseup","pointerdown","pointerup","submit","auxclick"])document.addEventListener(e,Lt,!0);document.addEventListener("click",e=>{if(!a.on||Z(e)||a.editing&&a.editing.el.contains(e.target))return;e.preventDefault(),e.stopPropagation();let t=we(e);t&&D(t)},!0),document.addEventListener("dblclick",e=>{if(!a.on||Z(e))return;e.preventDefault(),e.stopPropagation();let t=we(e);t&&Ct(t)},!0);let ye=e=>e.childNodes.length>0&&[...e.childNodes].every(t=>t.nodeType===3)&&e.textContent.trim().length>0,He=new Set(["img","video","svg","picture","canvas","iframe"]),Ue=new Set(["input","textarea","select"]);function Et(e,t){let n=e.tagName.toLowerCase(),o=He.has(n),r=ye(e),i=!o&&(Ue.has(n)||e.textContent.trim().length>0),c=!o&&t.display==="inline",d=o?{img:"Image",video:"Video",svg:"Icon",picture:"Image",canvas:"Canvas",iframe:"Embed"}[n]:/^h[1-6]$/.test(n)?"Heading":n==="button"||e.getAttribute("role")==="button"||n==="a"&&/\bbtn|button\b/i.test(e.className)?"Button":n==="a"?"Link":n==="p"?"Paragraph":Ue.has(n)?"Field":n==="li"?"List item":r?"Text":/^(section|header|footer|main|nav|aside)$/.test(n)?"Section":"Box";return{tag:n,media:o,leaf:r,hasText:i,inline:c,label:d,container:!r&&!o&&e.children.length>0}}function Ct(e){if(!ye(e)){if(![...e.querySelectorAll("*")].find(ye)||e.textContent.trim().length===0){w("Double-click directly on a piece of text to edit it.");return}if(e.children.length){w("This text contains other elements (links, bold\u2026). Edit each part separately, or ask AI."),D(e);return}}D(e),a.editing={el:e,before:e.textContent},e.setAttribute("contenteditable","plaintext-only"),e.contentEditable!=="plaintext-only"&&e.setAttribute("contenteditable","true"),e.classList.add("em-editing"),e.style.setProperty("outline","none","important"),e.focus();let t=document.createRange();t.selectNodeContents(e);let n=getSelection();n.removeAllRanges(),n.addRange(t),e.addEventListener("keydown",We,!0),e.addEventListener("blur",_e,{once:!0})}function We(e){e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),a.editing.el.blur()),e.key==="Escape"&&(e.preventDefault(),a.editing.el.textContent=a.editing.before,a.editing.el.blur()),e.stopPropagation()}function _e(){let e=a.editing;if(!e)return;a.editing=null;let t=e.el;t.removeAttribute("contenteditable"),t.classList.remove("em-editing"),t.style.removeProperty("outline"),t.getAttribute("style")||t.removeAttribute("style"),t.getAttribute("class")||t.removeAttribute("class"),t.removeEventListener("keydown",We,!0),Ge(t,e.before,t.textContent)}function Ge(e,t,n){let o=n.replace(/\s+/g," ").trim(),r={before:t};if(a.pending=a.pending.filter(l=>!(l.kind==="text"&&l.el===e)),o===t.replace(/\s+/g," ").trim()){e.textContent=t,z(),L();return}let i=T(e),c=l=>l.length>40?l.slice(0,37)+"\u2026":l,d={el:e,kind:"text",before:t,label:`text \u201C${c(r.before.trim())}\u201D \u2192 \u201C${c(o)}\u201D`,preview:[],affected:[],change:i?{kind:"text",loc:i,oldText:r.before,newText:o}:{kind:"text-search",oldText:r.before.trim(),newText:o},where:i?`text of this <${i.tag}> in ${i.file}`:"source file containing this exact text (found by search)",undoPreview:()=>{e.textContent=r.before}};e.textContent=o,a.pending.push(d),z(),L()}function P(e,t){let n=e.style.getPropertyValue(t);if(n)return n;let o=fe(ee(e),t);return o?o.value:""}function S(){let e=a.sel;if(!e||!a.on){g.hidden=!0;return}g.hidden&&(g.hidden=!1,g.classList.remove("enter"),g.offsetWidth,g.classList.add("enter"));let t=getComputedStyle(e),n=T(e),o=he(e),r=ee(e),i=o?document.querySelectorAll(o).length:1,c=Pe(e),d=t.fontFamily.split(",")[0].replace(/["']/g,"").trim(),l=P(e,"background-color"),f=P(e,"color"),m=p=>(p.match(/^var\((--[\w-]+)\)$/)||[])[1],h=e.parentElement,x=h?[...h.children].filter(p=>p!==C):[],y=x.indexOf(e),E=/flex|grid/.test(t.display),u=Et(e,t);g.innerHTML=`
      <header title="Drag to move \xB7 double-click to put the panel back">
        <div class="crumb">
          ${e.parentElement&&e.parentElement!==document.body?'<button class="ghost up" title="Select parent">\u2196</button>':""}
          <div>
            <div class="name"><span class="kind">${v(u.label)}</span> <span class="sel-name">${v(Y(e))}</span></div>
            <div class="src">${n?`${v(n.file)} \xB7 source-mapped`:c?"Tailwind \xB7 found by search":"rendered by your framework"}</div>
          </div>
        </div>
        <div class="hd-actions">
          <button class="ghost layout-btn ${a.layoutOpen?"on":""}" title="Move or resize this panel">\u21F1</button>
          <button class="ghost min-btn" title="${a.layout.min?"Expand":"Collapse"} this panel">${a.layout.min?"\u25A2":"\u2013"}</button>
          <button class="ghost close" title="Close (Esc)">\u2715</button>
        </div>
      </header>
      ${a.layoutOpen?`<div class="layout-row">
        <div class="seg">${[["left","\u25E7 Left"],["top","\u2B12 Top"],["center","\u25A3 Center"],["right","\u25E8 Right"]].map(([p,b])=>`<button data-dock="${p}" class="${a.layout.dock===p?"on":""}">${b}</button>`).join("")}</div>
        <button class="mini reset-layout" title="Back to the default position and size">Reset</button>
        <p class="hint">Or drag this top bar to put the panel anywhere, and double-click it to put the panel back. Drag a blue edge or the corner to resize it.</p>
      </div>`:""}
      <nav class="tabs"><span class="seg-pill"></span>
        <button data-tab="style" class="${a.tab==="style"?"on":""}">Design</button>
        <button data-tab="claude" class="${a.tab==="claude"?"on":""}">Ask AI${a.status.pending?`<i class="dot-badge" title="${a.status.pending} waiting for your AI"></i>`:""}</button>
        <button data-tab="history" class="${a.tab==="history"?"on":""}">History</button>
      </nav>
      ${a.status.git?"":`<div class="warn">Undo needs git, and this folder isn't a repository yet. <button class="mini gitinit">Turn on undo</button></div>`}
      <div class="body">
      ${a.tab==="style"?`
        ${i>1||c?`<div class="scope"><span class="seg-pill"></span>
          <button data-scope="this" class="${a.scope==="this"?"on":""}">Just this one</button>
          <button data-scope="all" class="${a.scope==="all"?"on":""}">All ${i} ${v(o||"like it")}</button>
        </div>`:""}
        ${u.leaf?`<section>
          <h4>Text</h4>
          <textarea class="txt" data-text rows="${Math.min(4,Math.ceil(e.textContent.trim().length/32)||1)}" spellcheck="true">${v(e.textContent.replace(/\s+/g," ").trim())}</textarea>
          <p class="hint">Press Enter to apply.</p>
        </section>`:u.hasText&&u.container?'<p class="lead">To change the words, click the piece of text itself.</p>':""}
        ${u.hasText?`<section>
          <h4>${u.container?"Text inside":"Font & color"}</h4>
          <label class="row"><span>Font</span><select data-prop="font-family">${q.map(p=>`<option value="${v(p.name)}" ${p.name===d?"selected":""}>${v(p.name)}</option>`).join("")}${q.some(p=>p.name===d)?"":`<option selected disabled>${v(d)}</option>`}</select></label>
          <div class="grid2">
            <label class="row"><span>Size</span><input data-prop="font-size" value="${v(P(e,"font-size")||t.fontSize)}"></label>
            <label class="row"><span>Weight</span><select data-prop="font-weight">${[300,400,500,600,700,800].map(p=>`<option ${String(p)===t.fontWeight?"selected":""}>${p}</option>`).join("")}</select></label>
          </div>
          <label class="row"><span>Color</span>${Xe("color",Q(t.color),m(f))}</label>
          <div class="row"><span>Align</span><div class="seg">${["left","center","right"].map(p=>`<button data-align="${p}" class="${t.textAlign===p||p==="left"&&t.textAlign==="start"?"on":""}">${{left:"\u21E4",center:"\u2194",right:"\u21E5"}[p]}</button>`).join("")}</div></div>
        </section>`:""}
        <section>
          <h4>${u.media?"Shape":"Fill & shape"}</h4>
          ${u.media?"":`<label class="row"><span>Background</span>${Xe("background-color",Q(t.backgroundColor),m(l))}</label>`}
          ${!u.media&&n?'<div class="row"><span>Image</span><button class="mini pick-image" data-target="bg-image" title="Choose a background image">Choose\u2026</button></div>':""}
          <label class="row"><span>Corners</span><input data-prop="border-radius" value="${v(P(e,"border-radius")||t.borderRadius)}"></label>
        </section>
        <section>
          <h4>Size & spacing</h4>
          ${u.inline?`<p class="hint">Width and height don't apply to text that flows inside a line. Use \u2196 to size the box around it.</p>`:""}
          <div class="grid2">
            ${u.inline?"":`<label class="row"><span>Width</span><input data-prop="width" value="${v(P(e,"width")||Math.round(e.getBoundingClientRect().width)+"px")}"></label>
            <label class="row"><span>Height</span><input data-prop="height" value="${v(P(e,"height")||Math.round(e.getBoundingClientRect().height)+"px")}"></label>`}
            ${u.media?"":`<label class="row"><span>Padding</span><input data-prop="padding" value="${v(P(e,"padding")||t.padding)}"></label>`}
            <label class="row"><span>Margin</span><input data-prop="margin" value="${v(P(e,"margin")||t.margin)}"></label>
            ${E?`<label class="row"><span>Gap</span><input data-prop="gap" value="${v(P(e,"gap")||t.gap)}"></label>`:""}
          </div>
          ${u.media?`<label class="check"><input type="checkbox" class="keepratio" ${a.keepRatio!==!1?"checked":""}> Keep proportions</label>`:""}
        </section>
        ${u.tag==="img"?`<section><h4>Image</h4>${n?'<button class="mini pick-image" data-target="img-src">Replace image\u2026</button>':'<p class="hint">This image is rendered by your framework. Ask AI to replace it.</p>'}<p class="hint">PNG, JPEG, WebP, GIF or AVIF, up to 5 MB.</p></section>`:""}
        ${At(e,t,u)}
        <section>
          <h4>Position</h4>
          <div class="row"><span>Order</span>
            <div class="seg">
              <button class="move" data-dir="up" ${y<=0||!n?"disabled":""} title="Move before the previous item">\u2191 Earlier</button>
              <button class="move" data-dir="down" ${y<0||y>=x.length-1||!n?"disabled":""} title="Move after the next item">\u2193 Later</button>
            </div>
          </div>
          ${n?"":'<p class="hint">Reordering needs a source-mapped page. Ask AI instead.</p>'}
        </section>
      `:a.tab==="claude"?`
        <section>
          <h4>Describe a change</h4>
          <textarea class="ask" placeholder="e.g. make this card's image zoom slightly on hover"></textarea>
          <button class="primary send">Queue for AI</button>
          <p class="hint">For anything the panel can't do, like layout, new sections or hover effects. Then tell your AI coding agent \u201Capply .design-inside/requests.md\u201D (in Claude Code: <code>/design-inside:apply</code>).</p>
        </section>
        <section class="queue">
          <h4>Waiting for your AI</h4>
          <div class="reqs"><p class="hint">Loading\u2026</p></div>
        </section>
      `:'<section class="history"><h4>Recent commits</h4><div class="hist">Loading\u2026</div></section>'}
      </div>
      <footer class="pending"></footer>
      <div class="edge" title="Drag to make the panel wider or narrower"></div>
      <div class="edge-b" title="Drag to make the panel taller or shorter"></div>
      <div class="grip" title="Drag to resize"></div>`,$t(),Be(".tabs",["style","claude","history"].indexOf(a.tab),"tab"),Be(".scope",a.scope==="all"?1:0,"scope"),a.tab==="history"&&Rt(),a.tab==="claude"&&Se(),z()}let re={none:["None","none"],soft:["Soft","0 2px 8px rgba(15, 23, 42, 0.08)"],medium:["Medium","0 8px 24px rgba(15, 23, 42, 0.14)"],strong:["Strong","0 20px 48px rgba(15, 23, 42, 0.24)"],glow:["Glow","0 0 0 4px rgba(139, 123, 255, 0.25), 0 8px 30px rgba(139, 123, 255, 0.35)"]},Ye=[["grayscale","Grayscale",0,100,0],["brightness","Brightness",0,200,100],["contrast","Contrast",0,200,100],["saturate","Saturation",0,200,100]],se=null;function Tt(e){if(e.boxShadow==="none")return"none";if(!se){let t=document.createElement("div");t.style.cssText="position:fixed;visibility:hidden;pointer-events:none",M.appendChild(t),se=Object.fromEntries(Object.entries(re).map(([n,[,o]])=>(t.style.boxShadow=o,[n,getComputedStyle(t).boxShadow]))),t.remove()}return Object.keys(se).find(t=>se[t]===e.boxShadow)||"custom"}function At(e,t,n){if(n.inline)return"";let o=Tt(t),r=Math.round(parseFloat(t.opacity)*100),i=(d,l,f)=>`<span class="range"><input type="range" min="0" max="${f}" step="5" ${d} value="${l}" style="--p: ${l/f*100}%"><output>${l}%</output></span>`,c=`
      <label class="row"><span>Shadow</span><select data-fx="shadow">${o==="custom"?"<option selected disabled>Custom</option>":""}${Object.entries(re).map(([d,[l]])=>`<option value="${d}" ${d===o?"selected":""}>${l}</option>`).join("")}</select></label>
      <label class="row"><span>Opacity</span>${i('data-fx="opacity"',r,100)}</label>`;if(n.media){let d={};for(let[l,,,,f]of Ye){let m=t.filter.match(new RegExp(`${l}\\(([\\d.]+)(%?)\\)`));d[l]=m?Math.round(m[2]?+m[1]:+m[1]*100):f}c+=Ye.map(([l,f,,m,h])=>`<label class="row"><span>${f}</span>${i(`data-fx="filter" data-f="${l}" data-default="${h}"`,d[l],m)}</label>`).join("")}else{let d=/gradient\(/.test(t.backgroundImage);c+=`
      <div class="row"><span>Gradient</span><span class="grad">
        <input type="color" data-fx="grad-a" value="${Q(t.backgroundColor)||"#ffffff"}" title="From">
        <input type="color" data-fx="grad-b" value="#8b7bff" title="To">
        <select data-fx="grad-angle" title="Direction">${[[180,"\u2193"],[135,"\u2198"],[90,"\u2192"],[45,"\u2197"],[0,"\u2191"]].map(([l,f])=>`<option value="${l}" ${l===135?"selected":""}>${f}</option>`).join("")}</select>
        <button class="mini" data-fx-apply="gradient">Apply</button>${d?'<button class="mini" data-fx-apply="no-gradient">Remove</button>':""}
      </span></div>
      <div class="row"><span>Border</span><span class="border"><input data-fx="border-w" value="${Math.round(parseFloat(t.borderTopWidth)||0)}" title="Width in px"><input type="color" data-fx="border-c" value="${Q(t.borderTopColor)||"#000000"}" title="Color"></span></div>
      <label class="check"><input type="checkbox" data-fx="glass" ${t.backdropFilter&&t.backdropFilter!=="none"?"checked":""}> Glass blur behind it</label>`}return`<section><h4>Effects</h4>${c}</section>`}function Ve(e,t){let n=e.dataset&&e.dataset.fx;if(!n)return!1;let o=e.nextElementSibling&&e.nextElementSibling.tagName==="OUTPUT"?e.nextElementSibling:null;if(o&&(o.textContent=`${e.value}%`,e.style.setProperty("--p",`${e.value/e.max*100}%`)),n==="shadow"&&!t)$("box-shadow",re[e.value][1],`shadow \u2192 ${re[e.value][0]}`);else if(n==="opacity")$("opacity",String(+e.value/100),`opacity \u2192 ${e.value}%`);else if(n==="filter"){let i=[...g.querySelectorAll('[data-fx="filter"]')].filter(c=>+c.value!=+c.dataset.default).map(c=>`${c.dataset.f}(${c.value}%)`).join(" ")||"none";$("filter",i,`filter \u2192 ${i}`)}else if(n==="border-w"&&!t||n==="border-c"){let r=Math.max(0,parseFloat(g.querySelector('[data-fx="border-w"]').value)||0),i=g.querySelector('[data-fx="border-c"]').value;$("border",r?`${r}px solid ${i}`:"none",r?`border \u2192 ${r}px ${i}`:"border \u2192 none")}else n==="glass"&&!t&&$("backdrop-filter",e.checked?"blur(12px)":"none",`glass blur ${e.checked?"on":"off"}`);return!0}function zt(e){if(e)return $("background-image","none","gradient \u2192 none");let t=g.querySelector('[data-fx="grad-a"]').value,n=g.querySelector('[data-fx="grad-b"]').value,o=g.querySelector('[data-fx="grad-angle"]').value;$("background-image",`linear-gradient(${o}deg, ${t}, ${n})`,`gradient \u2192 ${t} to ${n}`)}let Ke=["image/png","image/jpeg","image/webp","image/gif","image/avif"],ke=5*1024*1024,le=8e3,Mt=2400,U=Object.assign(document.createElement("input"),{type:"file",accept:Ke.join(","),hidden:!0});M.appendChild(U);let $e=null;function It(e){$e={kind:e,el:a.sel},U.value="",U.click()}U.addEventListener("change",()=>{let e=U.files&&U.files[0];e&&$e&&Pt(e,$e)});let Je=e=>`${(e/1048576).toFixed(1)} MB`;async function Pt(e,t){if(e.size>ke)return w(`\u201C${e.name}\u201D is ${Je(e.size)}. The limit is 5 MB.`,{kind:"error"});if(!Ke.includes(e.type))return w(`\u201C${e.name}\u201D isn't a PNG, JPEG, WebP, GIF or AVIF image, so it was refused. (SVG files are refused because they can contain code.)`,{kind:"error"});let n;try{n=await createImageBitmap(e)}catch{return w(`\u201C${e.name}\u201D couldn't be read as an image, so it was refused.`,{kind:"error"})}if(n.width>le||n.height>le)return n.close(),w(`\u201C${e.name}\u201D is ${n.width}\xD7${n.height} pixels. The limit is ${le}\xD7${le}.`,{kind:"error"});Ot(n,e.name,t)}function Ot(e,t,n){let o={rot:0,aspect:"free",src:null,scale:1,rect:null},r=document.createElement("div");r.className="modal",r.innerHTML=`<div class="crop" role="dialog" aria-label="Crop image">
      <div class="crop-head"><b>Crop image</b><span class="dim">${v(t)} \xB7 ${e.width}\xD7${e.height}</span></div>
      <div class="crop-stage"><canvas></canvas><div class="crop-rect"><i data-h="nw"></i><i data-h="ne"></i><i data-h="sw"></i><i data-h="se"></i></div></div>
      <div class="crop-tools"><div class="seg">${[["free","Free"],["1","1:1"],["1.3333","4:3"],["1.7778","16:9"],["orig","Original"]].map(([u,p])=>`<button data-aspect="${u}" class="${u==="free"?"on":""}">${p}</button>`).join("")}</div><button class="mini rotate">\u21BB Rotate</button></div>
      <div class="crop-foot"><span class="dim out"></span><span class="grow"></span><button class="ghost cancel">Cancel</button><button class="primary use">Use image</button></div>
    </div>`,M.appendChild(r);let i=r.querySelector("canvas"),c=r.querySelector(".crop-rect"),d=r.querySelector(".out"),l=()=>o.aspect==="free"?null:o.aspect==="orig"?o.src.width/o.src.height:+o.aspect,f=()=>{let u=o.rect.w/o.scale,p=o.rect.h/o.scale,b=Math.min(1,Mt/Math.max(u,p));return{w:Math.max(1,Math.round(u*b)),h:Math.max(1,Math.round(p*b))}},m=()=>{Object.assign(c.style,{left:`${o.rect.x}px`,top:`${o.rect.y}px`,width:`${o.rect.w}px`,height:`${o.rect.h}px`});let u=f();d.textContent=`Saves as ${u.w}\xD7${u.h}`},h=()=>{let u=i.width,p=i.height,b=l(),O=u,k=p;b&&(u/p>b?O=p*b:k=u/b),o.rect={x:(u-O)/2,y:(p-k)/2,w:O,h:k},m()},x=()=>{let u=o.rot%180!==0;o.src=Object.assign(document.createElement("canvas"),{width:u?e.height:e.width,height:u?e.width:e.height});let p=o.src.getContext("2d");p.translate(o.src.width/2,o.src.height/2),p.rotate(o.rot*Math.PI/180),p.drawImage(e,-e.width/2,-e.height/2),o.scale=Math.min(560/o.src.width,360/o.src.height,1),i.width=Math.round(o.src.width*o.scale),i.height=Math.round(o.src.height*o.scale),i.getContext("2d").drawImage(o.src,0,0,i.width,i.height),h()};x();let y=()=>{e.close(),r.remove()};r.addEventListener("keydown",u=>{u.key==="Escape"&&(u.stopPropagation(),y())}),r.addEventListener("click",async u=>{let p=u.target.closest("button");if(p){if(p.dataset.aspect)return o.aspect=p.dataset.aspect,r.querySelectorAll("[data-aspect]").forEach(b=>b.classList.toggle("on",b===p)),h();if(p.classList.contains("rotate"))return o.rot=(o.rot+90)%360,x();if(p.classList.contains("cancel"))return y();if(p.classList.contains("use")){p.disabled=!0;try{await E()}finally{p.disabled=!1}}}}),c.addEventListener("pointerdown",u=>{u.preventDefault();let p=u.target.dataset.h,b={...o.rect,px:u.clientX,py:u.clientY},O=i.width,k=i.height,W=l(),j=Qe=>{let Ce=Qe.clientX-b.px,Te=Qe.clientY-b.py;if(!p)return o.rect.x=A(b.x+Ce,0,O-b.w),o.rect.y=A(b.y+Te,0,k-b.h),m();let Ae=p.includes("w"),ze=p.includes("n"),K=A(b.w+(Ae?-Ce:Ce),16,Ae?b.x+b.w:O-b.x),J=A(b.h+(ze?-Te:Te),16,ze?b.y+b.h:k-b.y);W&&(K/J>W?K=J*W:J=K/W),o.rect={x:Ae?b.x+b.w-K:b.x,y:ze?b.y+b.h-J:b.y,w:K,h:J},m()},_=()=>{removeEventListener("pointermove",j,!0),removeEventListener("pointerup",_,!0)};addEventListener("pointermove",j,!0),addEventListener("pointerup",_,!0)});async function E(){let u=f(),p=Object.assign(document.createElement("canvas"),{width:u.w,height:u.h});p.getContext("2d").drawImage(o.src,o.rect.x/o.scale,o.rect.y/o.scale,o.rect.w/o.scale,o.rect.h/o.scale,0,0,u.w,u.h);let b=p.toDataURL("image/webp").startsWith("data:image/webp"),O=b?"image/webp":"image/png",k=await new Promise(j=>p.toBlob(j,O,.9));if(k&&k.size>ke&&b&&(k=await new Promise(j=>p.toBlob(j,O,.7))),!k||k.size>ke)return w(`The cropped image is still over 5 MB (${k?Je(k.size):"?"}). Crop it smaller.`,{kind:"error"});let W=await new Promise(j=>{let _=new FileReader;_.onload=()=>j(String(_.result).split(",")[1]),_.readAsDataURL(k)});qt(n,k,W,`${t.replace(/\.[^.]*$/,"")}.${b?"webp":"png"}`,u),y()}}function qt(e,t,n,o,r){let i=e.el,c=T(i);if(!i||!c)return w("This element has no source location, so its image can't be replaced here. Ask AI instead.",{kind:"error"});let d=URL.createObjectURL(t),l=e.kind==="img-src",f=l?{src:i.getAttribute("src"),srcset:i.getAttribute("srcset")}:{bi:i.style.backgroundImage,bs:i.style.backgroundSize,bp:i.style.backgroundPosition};a.pending.filter(m=>m.kind==="image"&&m.el===i&&m.change.kind===e.kind).forEach(m=>{m.undoPreview(),a.pending.splice(a.pending.indexOf(m),1)}),l?(i.removeAttribute("srcset"),i.src=d):Object.assign(i.style,{backgroundImage:`url("${d}")`,backgroundSize:"cover",backgroundPosition:"center"}),a.pending.push({el:i,kind:"image",preview:[],affected:[i],label:`${l?"image":"background image"} \u2192 ${o} (${r.w}\xD7${r.h})`,where:`saved in images/ next to ${c.file}`,change:{kind:e.kind,loc:c,data:n,name:o},undoPreview:()=>{l?(f.src==null?i.removeAttribute("src"):i.setAttribute("src",f.src),f.srcset&&i.setAttribute("srcset",f.srcset)):Object.assign(i.style,{backgroundImage:f.bi,backgroundSize:f.bs,backgroundPosition:f.bp}),URL.revokeObjectURL(d)}}),z(),L()}function Xe(e,t,n){return`<span class="color"><input type="color" data-prop="${e}" value="${t||"#ffffff"}"><input class="hex" data-hex="${e}" value="${t||"none"}" spellcheck="false">${n?`<label class="var" title="This color comes from a theme variable"><input type="checkbox" class="linkvar" ${a.linkVars?"checked":""}> ${v(n)}</label>`:""}</span>`}async function Se(){let e=g.querySelector(".reqs");if(e)try{let{requests:t}=await I("requests");a.status.pending=t.length,e.innerHTML=t.length?t.map(o=>`
        <div class="req"><span>${v(o.title)}</span><button class="ghost req-remove" data-id="${v(o.id)}" title="Remove from the queue">\u2715</button></div>`).join(""):'<p class="hint">Nothing waiting. Requests you queue appear here until your AI applies them.</p>';let n=g.querySelector('[data-tab="claude"]');n&&(n.innerHTML=`Ask AI${t.length?`<i class="dot-badge" title="${t.length} waiting for your AI"></i>`:""}`)}catch(t){e.textContent=t.message}}async function jt(e){try{let t=await I("requests-remove",{id:e});a.status.pending=t.pending,Se()}catch(t){w(t.message,{kind:"error"}),Se()}}async function Rt(){let e=g.querySelector(".hist");try{let{commits:t}=await I("history");e.innerHTML=t.length?t.slice(0,15).map(n=>`
        <div class="commit ${n.ours?"ours":""}">
          <div><code>${n.sha}</code> <span class="when">${v(n.when)}</span><div class="subj">${v(n.subject.replace(/^design-inside: /,""))}</div></div>
          ${n.ours&&!n.subject.startsWith("Revert")?`<button class="mini undo" data-sha="${n.sha}">Undo</button>`:""}
        </div>`).join(""):'<p class="hint">No commits yet.</p>'}catch(t){e.textContent=t.message}}function z(){let e=g.querySelector(".pending");if(Le(),!e)return;if(!a.pending.length){e.innerHTML='<p class="hint">Changes show live. Nothing is saved until you press Save.</p>';return}let t=a.pending.length>3,n=!t||a.pendingOpen,o=r=>r.fallback?"\u2192 will be handed to your AI agent":`\u2192 ${r.where}${r.affected&&r.affected.length>1?` \xB7 ${r.affected.length} elements`:""}`;e.innerHTML=`
      ${t?`<button class="pend-toggle" aria-expanded="${n}">${a.pending.length} changes to save<i class="chev"></i></button>`:""}
      <ol class="${n?"":"collapsed"}">${a.pending.map((r,i)=>`<li class="${r.fallback?"fb":""}"><div><b title="${v(r.label)}">${v(r.label)}</b><small title="${v(o(r))}">${v(o(r))}</small></div><button class="ghost drop" data-i="${i}" title="Remove">\u2715</button></li>`).join("")}</ol>
      <div class="actions"><button class="ghost discard">Discard</button><button class="primary save">Save & commit <kbd>\u2318S</kbd></button></div>`}function Le(){let e=a.pending.length;ue.classList.toggle("on",a.on),ue.querySelector(".pill-label").textContent=a.on?e?`${e} unsaved`:"Editing":"Edit page"}g.addEventListener("click",e=>{let t=e.target.closest("button");if(t){if(t.classList.contains("close"))return D(null);if(t.classList.contains("pend-toggle"))return a.pendingOpen=!a.pendingOpen,z();if(t.dataset.foldToggle)return St(t.dataset.foldToggle);if(t.classList.contains("layout-btn"))return a.layoutOpen=!a.layoutOpen,S();if(t.classList.contains("min-btn"))return a.layout.min=!a.layout.min,V(),S(),R();if(t.dataset.dock)return a.layout.dock=t.dataset.dock,a.layout.min=!1,V(),S(),R();if(t.classList.contains("reset-layout"))return a.layout={...ae},V(),S(),R();if(t.classList.contains("up"))return D(a.sel.parentElement);if(t.dataset.tab)return a.tab=t.dataset.tab,S();if(t.dataset.scope){a.scope=t.dataset.scope,je(),S(),L();return}if(t.dataset.align)return $("text-align",t.dataset.align);if(t.dataset.fxApply)return zt(t.dataset.fxApply==="no-gradient");if(t.classList.contains("pick-image"))return It(t.dataset.target);if(t.classList.contains("move"))return Dt(t.dataset.dir);if(t.classList.contains("save"))return Re();if(t.classList.contains("discard"))return ne();if(t.classList.contains("drop")){let n=a.pending[+t.dataset.i];return te(n),n.undoPreview&&n.undoPreview(),a.pending.splice(+t.dataset.i,1),z()}if(t.classList.contains("undo"))return be(t.dataset.sha);if(t.classList.contains("req-remove"))return jt(t.dataset.id);if(t.classList.contains("gitinit"))return I("git-init",{}).then(()=>{a.status.git=!0,S(),w("Git is on. Every save is now a commit you can undo.")});if(t.classList.contains("send")){let n=g.querySelector(".ask").value.trim();n&&(me(n,a.sel),g.querySelector(".ask").value="")}}}),g.addEventListener("input",e=>{let t=e.target;if(!Ve(t,!0)&&t.type==="color"){let n=g.querySelector(`[data-hex="${t.dataset.prop}"]`);n&&(n.value=t.value),$(t.dataset.prop,t.value)}}),g.addEventListener("change",e=>{let t=e.target;if(t.classList.contains("linkvar")){a.linkVars=t.checked,je();return}if(t.classList.contains("keepratio")){a.keepRatio=t.checked;return}if(t.dataset.fx){/^(opacity|filter|border-c|grad-)/.test(t.dataset.fx)||Ve(t,!1);return}if(t.hasAttribute("data-text")){let o=a.pending.find(r=>r.kind==="text"&&r.el===a.sel);Ge(a.sel,o?o.before:a.sel.textContent,t.value);return}if(t.dataset.hex){let o=t.value.trim();if(/^#?[0-9a-f]{3,8}$/i.test(o)){let r=o.startsWith("#")?o:`#${o}`,i=g.querySelector(`input[type=color][data-prop="${t.dataset.hex}"]`);i&&/^#[0-9a-f]{6}$/i.test(r)&&(i.value=r.toLowerCase()),$(t.dataset.hex,r)}return}let n=t.dataset.prop;if(!(!n||t.type==="color")){if(n==="font-family"){let o=q.find(r=>r.name===t.value);if(!o)return;o.google!==!1&&Nt(o.name),$("font-family",o.css,`font \u2192 ${o.name}`);return}$(n,n==="font-weight"?t.value:dt(t.value)),(n==="width"||n==="height")&&a.keepRatio!==!1&&He.has(a.sel.tagName.toLowerCase())&&$(n==="width"?"height":"width","auto")}}),g.addEventListener("keydown",e=>{e.key==="Enter"&&e.target.tagName==="INPUT"&&e.target.dispatchEvent(new Event("change",{bubbles:!0})),e.key==="Enter"&&e.target.hasAttribute("data-text")&&(e.preventDefault(),e.target.blur()),e.stopPropagation()});let Nt=e=>{let t=`https://fonts.googleapis.com/css2?family=${e.replace(/ /g,"+")}:wght@400;500;600;700&display=swap`;if(![...document.querySelectorAll("link")].some(n=>n.href===t)){let n=document.createElement("link");n.rel="stylesheet",n.href=t,document.head.appendChild(n)}};async function Dt(e){let t=T(a.sel);if(t){if(a.pending.length){w("Save or discard your pending changes first.");return}ce(!0);try{let n=await I("apply",{pageUrl:location.href,changes:[{kind:"move",loc:t,dir:e,label:`move ${Y(a.sel)} ${e==="up"?"earlier":"later"}`}]});F({toast:{text:`Saved ${n.sha} \xB7 ${n.message}`,sha:n.sha},reselect:n.reload&&n.reload.path}),location.reload()}catch(n){ce(!1),w(n.message,{kind:"error"})}}}function ce(e){g.classList.toggle("busy",e)}function w(e,{kind:t="info",actions:n=[],sha:o}={}){let r=document.createElement("div");r.className=`toast ${t}`,r.innerHTML=`<span>${v(e)}</span>`,o&&(n=[{label:"Undo",run:()=>be(o)},...n]);for(let i of n){let c=document.createElement("button");c.textContent=i.label,c.className="mini",c.onclick=()=>{i.run(),r.remove()},r.appendChild(c)}G(".toasts").appendChild(r),setTimeout(()=>r.classList.add("out"),t==="error"?9e3:6e3),setTimeout(()=>r.remove(),t==="error"?9400:6400)}function Ee(e){a.on=e,document.documentElement.classList.toggle("em-on",e),e||(ne(),a.sel=null,a.hover=null),S(),L(),Le(),F({})}ue.addEventListener("click",()=>Ee(!a.on)),addEventListener("keydown",e=>{if(e.altKey&&(e.key==="e"||e.key==="E"||e.code==="KeyE")){e.preventDefault(),Ee(!a.on);return}if(!a.on||a.editing)return;let t=/INPUT|TEXTAREA|SELECT/.test((e.composedPath()[0]||{}).tagName||"");if((e.metaKey||e.ctrlKey)&&e.key==="s"){e.preventDefault(),Re();return}t||(e.key==="Escape"&&(a.pending.length?ne():D(null)),(e.metaKey||e.ctrlKey)&&e.key==="z"&&!a.pending.length&&(e.preventDefault(),be()))},!0);function F(e){try{let t=a.sel?a.sel.getAttribute("data-em")?{em:a.sel.getAttribute("data-em")}:{css:Ie(a.sel)}:null;sessionStorage.setItem(H,JSON.stringify({on:a.on,sel:t,scrollY,tab:a.tab,...e}))}catch{}}function Ft(){let e=null;try{e=JSON.parse(sessionStorage.getItem(H)||"null")}catch{}if(!e)return;e.on&&Ee(!0),e.tab&&(a.tab=e.tab),typeof e.scrollY=="number"&&requestAnimationFrame(()=>scrollTo(0,e.scrollY));let t=e.reselect?e.reselect.replace(/^\//,""):e.sel&&e.sel.em,n=null;try{t?n=document.querySelector(`[data-em="${CSS.escape(t)}"]`):e.sel&&e.sel.css&&(n=document.querySelector(e.sel.css))}catch{}n&&e.on&&(D(n),a.tab=e.tab||"style",S()),e.toast&&w(e.toast.text,{kind:"ok",sha:e.toast.sha}),F({})}function Bt(){try{new EventSource(s+"events").addEventListener("change",t=>{let{file:n}=JSON.parse(t.data);a.mode!=="proxy"&&(a.pending.length||a.editing?w(`${n} changed on disk.`,{actions:[{label:"Reload",run:()=>{F({}),location.reload()}}]}):(F({}),location.reload()))})}catch{}}let Ze=async()=>{try{Object.assign(a.status,await I("status")),a.mode=a.status.mode}catch{}Ft(),Bt()};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Ze):Ze()})();})();

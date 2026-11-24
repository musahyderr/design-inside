(()=>{var et=/^text-(xs|sm|base|lg|[2-9]?xl|\[\d.*(px|rem|em|%)\])$/,Ht=/^text-(left|center|right|justify|start|end|wrap|nowrap|balance|pretty|ellipsis|clip)$/,Ut=/^bg-(fixed|local|scroll|clip-.*|origin-.*|no-repeat|repeat.*|auto|cover|contain|center|top|bottom|left.*|right.*|none|gradient-.*|blend-.*|opacity-.*|\[url.*)$/,Wt=/^font-(sans|serif|mono|\['.*'\]|\[".*"\])$/,tt={"background-color":{test:r=>r.startsWith("bg-")&&!Ut.test(r),make:r=>`bg-[${r}]`},color:{test:r=>r.startsWith("text-")&&!et.test(r)&&!Ht.test(r),make:r=>`text-[${r}]`},"font-size":{test:r=>et.test(r),make:r=>`text-[${r}]`},"font-family":{test:r=>Wt.test(r),make:r=>`font-['${_t(r).replace(/ /g,"_")}']`},"font-weight":{test:r=>/^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black|\[\d+\])$/.test(r),make:r=>`font-[${r}]`},width:{test:r=>/^w-/.test(r),make:r=>`w-[${r}]`},height:{test:r=>/^h-/.test(r),make:r=>`h-[${r}]`},padding:{test:r=>/^p-/.test(r),make:r=>`p-[${r.replace(/ /g,"_")}]`},margin:{test:r=>/^m-/.test(r),make:r=>`m-[${r.replace(/ /g,"_")}]`},"border-radius":{test:r=>/^rounded(-|$)/.test(r)&&!/^rounded-[trblse]{1,2}(-|$)/.test(r),make:r=>`rounded-[${r}]`},gap:{test:r=>/^gap-(?!x-|y-)/.test(r),make:r=>`gap-[${r}]`},"box-shadow":{test:r=>/^shadow(-(none|2xs|xs|sm|md|lg|xl|2xl|inner|\[.*\]))?$/.test(r),make:r=>r==="none"?"shadow-none":`shadow-[${r.replace(/ /g,"_")}]`},opacity:{test:r=>/^opacity-(\d+|\[.*\])$/.test(r),make:r=>`opacity-[${r}]`}};function _t(r){return r.split(",")[0].trim().replace(/^['"]|['"]$/g,"")}var nt=r=>r in tt;function de(r,q,B){let H=tt[q];if(!H)return null;let C=r.split(/\s+/).filter(Boolean).filter(X=>X.includes(":")||!H.test(X.replace(/^!/,""))),z=H.make(B.trim().replace(/\s*,\s*/g,","));return[...C,z].join(" ")}function at(r){return/(^|\s)(flex|grid|block|hidden|(p|m|px|py|mt|mb|w|h|gap|text|bg|rounded|font|shadow)-[\w[\]#.\/-]+)(\s|$)/.test(r||"")}function Gt(r){return r.replace(/\/\*[\s\S]*?\*\//g,"").replace(/\s*([>+~,])\s*/g,"$1").replace(/\s+/g," ").replace(/"/g,"'").trim()}var Yt=r=>(r||"").replace(/\s+/g," ").replace(/\(\s*/g,"(").replace(/\s*\)/g,")").replace(/\s*:\s*/g,":").trim().toLowerCase();function ot(r,q=[]){return`${q.map(B=>`${B.type} ${Yt(B.text)}`).join(" | ")}::${Gt(r)}`}var st=`
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
.crumb { display: flex; gap: 8px; align-items: flex-start; min-width: 0; }
.name { font: 600 16px/1.25 var(--sf); letter-spacing: -.01em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 190px; }
.name .kind { font: inherit; color: var(--fg); margin-right: 5px; text-transform: none; letter-spacing: -.01em; }
.name .sel-name { font: 500 12px var(--mono); color: var(--dim); letter-spacing: 0; }
.src { color: var(--dim); font-size: 12px; margin-top: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 190px; }
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
.body { flex: 1; overflow: auto; padding: 2px 14px 14px; }
section { margin-top: 12px; padding: 4px 12px; border-radius: 12px; background: var(--card); }
section:has(> h4:only-child) { display: none; }
h4 { margin: 8px 0 4px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: .02em; color: var(--dim); }
.hint { color: var(--dim); margin: 4px 0 8px; line-height: 1.4; font-size: 12px; }
.row { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 40px; padding: 5px 0; }
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
.range input[type=range] { -webkit-appearance: none; appearance: none; width: 128px; height: 4px; padding: 0; border-radius: 4px; cursor: pointer;
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
.primary { background: var(--accent); color: #fff; border: 0; border-radius: 12px; padding: 0 16px; height: 36px; font-size: 14px; font-weight: 600;
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
footer.pending { border-top: .5px solid var(--sep); padding: 12px 14px 14px; max-height: 45%; overflow: auto; }
footer .hint { margin: 0; text-align: center; }
footer ol { list-style: none; margin: 0 0 12px; padding: 0; display: grid; gap: 6px; }
footer li { display: flex; justify-content: space-between; align-items: flex-start; gap: 6px; padding: 9px 11px; border-radius: 12px; background: var(--card); }
footer li b { display: block; font-weight: 600; font-size: 13px; word-break: break-word; }
footer li small { display: block; color: var(--dim); margin-top: 2px; font-size: 11.5px; line-height: 1.35; word-break: break-word; }
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
`;(()=>{if(window.__designInside)return;window.__designInside=!0;let r="/__em/",q=[{name:"System UI",css:'system-ui, -apple-system, "Segoe UI", sans-serif',google:!1},{name:"Inter",css:'"Inter", system-ui, sans-serif'},{name:"DM Sans",css:'"DM Sans", system-ui, sans-serif'},{name:"Manrope",css:'"Manrope", system-ui, sans-serif'},{name:"Space Grotesk",css:'"Space Grotesk", system-ui, sans-serif'},{name:"Bricolage Grotesque",css:'"Bricolage Grotesque", system-ui, sans-serif'},{name:"Syne",css:'"Syne", system-ui, sans-serif'},{name:"Playfair Display",css:'"Playfair Display", Georgia, serif'},{name:"Fraunces",css:'"Fraunces", Georgia, serif'},{name:"Lora",css:'"Lora", Georgia, serif'},{name:"JetBrains Mono",css:'"JetBrains Mono", ui-monospace, monospace'},{name:"IBM Plex Mono",css:'"IBM Plex Mono", ui-monospace, monospace'}],B=/:(hover|focus|focus-visible|focus-within|active|visited|target|checked)\b/,H="design-inside:state",o={on:!1,hover:null,sel:null,scope:"this",pending:[],status:{git:!0,mode:"static"},editing:null,tab:"style"},C=document.createElement("design-inside-root");C.style.cssText="all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;";let z=C.attachShadow({mode:"open"});function X(){let e=n=>{let a=String(n).match(/rgba?\(([^)]+)\)/);if(!a)return null;let[i,s,c,d=1]=a[1].split(/[\s,/]+/).filter(Boolean).map(Number);return d<.5?null:[i,s,c]};for(let n of[document.body,document.documentElement]){let a=n&&e(getComputedStyle(n).backgroundColor);if(a)return(.2126*a[0]+.7152*a[1]+.0722*a[2])/255<.5?"dark":"light"}let t=getComputedStyle(document.documentElement).colorScheme||"";return/dark/.test(t)&&!/light/.test(t)?"dark":"light"}let pe=()=>{let e=X();C.dataset.tone!==e&&(C.dataset.tone=e)};pe();let it=new MutationObserver(pe);for(let e of[document.documentElement,document.body])e&&it.observe(e,{attributes:!0,attributeFilter:["class","style","data-theme","data-mode","data-color-scheme"]});matchMedia("(prefers-color-scheme: dark)").addEventListener("change",pe),z.innerHTML=`<style>${st}</style>
    <div class="hl hover" hidden><span class="tag"></span></div>
    <div class="hl selected" hidden><span class="tag"></span></div>
    <div class="dock">
      <button class="pill" title="design-inside (Alt+E)"><span class="dot"></span><span class="pill-label">Edit page</span><kbd>Alt E</kbd></button>
    </div>
    <aside class="panel" hidden></aside>
    <div class="toasts"></div>`;let G=e=>z.querySelector(e),rt=G(".hl.hover"),lt=G(".hl.selected"),g=G(".panel"),ue=G(".pill"),Z=e=>e.composedPath().includes(C),Me=()=>document.documentElement.appendChild(C);document.body?Me():document.addEventListener("DOMContentLoaded",Me);let v=e=>String(e).replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t]);async function M(e,t){let n=await fetch(r+e,t?{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(t)}:{}),a=await n.json().catch(()=>({error:`HTTP ${n.status}`}));if(!n.ok)throw Object.assign(new Error(a.error||`HTTP ${n.status}`),{data:a,status:n.status});return a}let T=e=>{let t=e&&e.getAttribute&&e.getAttribute("data-em");if(!t)return null;let n=t.lastIndexOf("#");return{file:t.slice(0,n),path:t.slice(n+1),tag:e.tagName.toLowerCase()}},ct=()=>{let e=document.querySelector("[data-em]");return e?T(e).file:null};function Q(e){let t=e&&e.match(/rgba?\(([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?/);return t?t[4]!==void 0&&Number(t[4])===0?"":"#"+[t[1],t[2],t[3]].map(n=>Math.round(+n).toString(16).padStart(2,"0")).join(""):e&&e.startsWith("#")?e:""}let dt=e=>/^-?\d+(\.\d+)?$/.test(String(e).trim())?`${e}px`:String(e).trim();function Y(e){let t=e.tagName.toLowerCase(),n=e.id?`#${e.id}`:"",a=[...e.classList].filter(i=>!i.includes(":")).slice(0,2).map(i=>`.${i}`).join("");return`${t}${n}${a}`}function Ie(e){let t=[];for(let n=e;n&&n.nodeType===1&&n!==document.documentElement;n=n.parentElement){if(n.id){t.unshift(`#${CSS.escape(n.id)}`);break}let a=n.parentElement?[...n.parentElement.children].filter(i=>i.tagName===n.tagName):[];t.unshift(n.tagName.toLowerCase()+(a.length>1?`:nth-of-type(${a.indexOf(n)+1})`:""))}return t.join(" > ")}let pt=()=>!!document.querySelector('script[src*="tailwindcss"], style[data-vite-dev-id*="tailwind"]')||getComputedStyle(document.documentElement).getPropertyValue("--tw-ring-offset-width")!==""||getComputedStyle(document.body).getPropertyValue("--tw-border-spacing-x")!=="",Pe=e=>pt()&&at(e.getAttribute("class")||"");function ut(e){let t=e.ownerNode;if(t&&t.tagName==="STYLE"){let n=T(t);if(n)return{file:n.file,path:n.path,label:`<style> in ${n.file}`};let a=t.getAttribute("data-vite-dev-id");return a&&/\.css(\?|$)/.test(a)?{viteId:a,label:a.split("/").slice(-2).join("/")}:null}if(e.href)try{let n=new URL(e.href);return n.host!==location.host?null:{href:e.href,label:n.pathname.replace(/^\//,"")}}catch{return null}return null}function ge(){let e=[],t=0,n=(i,s,c,d)=>{for(let l of i){if(l instanceof CSSImportRule){l.styleSheet&&a(l.styleSheet);continue}if(l instanceof CSSStyleRule){let m=ot(l.selectorText,c),h=d[m]=(d[m]??-1)+1;e.push({rule:l,ref:s,conds:c,occurrence:h,order:t++});continue}let f=null;window.CSSMediaRule&&l instanceof CSSMediaRule?f={type:"media",text:l.conditionText||l.media.mediaText}:window.CSSSupportsRule&&l instanceof CSSSupportsRule?f={type:"supports",text:l.conditionText}:window.CSSLayerBlockRule&&l instanceof CSSLayerBlockRule?f={type:"layer",text:l.name}:window.CSSContainerRule&&l instanceof CSSContainerRule&&(f={type:"container",text:l.conditionText}),f&&l.cssRules&&n(l.cssRules,s,[...c,f],d)}},a=i=>{if(i.ownerNode&&C.contains(i.ownerNode))return;let s;try{s=i.cssRules}catch{return}n(s,ut(i),[],{})};for(let i of document.styleSheets)a(i);return e}let gt=e=>e.type==="media"?matchMedia(e.text).matches:e.type==="supports"?CSS.supports(e.text):!0;function ft(e){let t=[],n=0,a="";for(let i of e)(i==="("||i==="[")&&n++,(i===")"||i==="]")&&n--,i===","&&!n?(t.push(a.trim()),a=""):a+=i;return a.trim()&&t.push(a.trim()),t}function ht(e){let t=e.replace(/:(not|is|has)\(([^)]*)\)/g," $2").replace(/:where\([^)]*\)/g,"").replace(/\[[^\]]*\]/g," .attr"),n=(t.match(/#[\w-]+/g)||[]).length,a=(t.match(/\.[\w-]+|:(?!:)[\w-]+/g)||[]).length,i=(t.replace(/::?[\w-]+/g,s=>s.startsWith("::")?" X":"").match(/(^|[\s>+~])[a-zA-Z][\w-]*/g)||[]).length;return n*1e4+a*100+i}function ee(e){let t=[];for(let n of ge()){if(!n.conds.every(gt))continue;let a=-1,i=null;for(let s of ft(n.rule.selectorText))if(!(B.test(s)||/::/.test(s)))try{if(e.matches(s)){let c=ht(s);c>a&&(a=c,i=s)}}catch{}i&&t.push({...n,spec:a,branch:i})}return t}function fe(e,t){let n=null;for(let a of e){let i=a.rule.style.getPropertyValue(t)||Oe[t]&&a.rule.style.getPropertyValue(Oe[t]);if(!i)continue;let c=[a.rule.style.getPropertyPriority(t)==="important"?1:0,a.spec,a.order];(!n||bt(c,n.score)>0)&&(n={...a,score:c,value:i.trim()})}return n}let Oe={"background-color":"background"},bt=(e,t)=>e[0]-t[0]||e[1]-t[1]||e[2]-t[2],qe=(e,t)=>!!e.style.getPropertyValue(t);function he(e){let t=[...e.classList].filter(n=>/^[a-zA-Z_][\w-]*$/.test(n));return t.length?"."+t.map(n=>CSS.escape(n)).join("."):null}function mt(e){for(let t=e.length-1;t>=0;t--)if(e[t].ref&&!e[t].conds.length)return e[t].ref;for(let t of ge())if(t.ref)return t.ref;return null}function xt(e,t,n,a){let i=T(e),s=ee(e),c=Pe(e)&&nt(t),d=e.getAttribute("class")||"";if(a==="this"){if(c){let x=de(d,t,n);return i?{change:{kind:"class",loc:i,oldClass:d,newClass:x},where:`class on this <${i.tag}> in ${i.file}`,affected:[e]}:{change:{kind:"class-search",oldClass:d,newClass:x},where:"its Tailwind classes (found by search)",affected:[e]}}let h=qe(e,t)?null:fe(s,t);if(h&&h.ref){let x=[...document.querySelectorAll(h.branch)];if(x.length===1&&x[0]===e)return{change:{kind:"css-rule",sheet:h.ref,selector:h.rule.selectorText,conditions:h.conds,occurrence:h.occurrence,prop:t,value:n},where:`rule ${h.rule.selectorText} in ${h.ref.label} (only this element uses it)`,affected:[e]}}return i?{change:{kind:"inline",loc:i,prop:t,value:n},where:`inline style on this <${i.tag}> in ${i.file}`,affected:[e]}:{fallback:"This element is rendered by a framework and has no source mapping, so only your AI agent can place a one-off style safely.",affected:[e]}}if(c){let h=[...document.querySelectorAll("[class]")].filter(w=>w.getAttribute("class")===d),x=de(d,t,n);return h.every(T)?{changes:h.map(w=>({kind:"class",loc:T(w),oldClass:d,newClass:x})),where:`Tailwind classes on ${h.length} matching element${h.length>1?"s":""}`,affected:h}:{change:{kind:"class-search",oldClass:d,newClass:x},where:"the component's Tailwind classes (found by search)",affected:h}}let l=qe(e,t)?null:fe(s,t);if(l&&l.ref){let h=l.value.match(/^var\((--[\w-]+)\)$/),x=[...document.querySelectorAll(l.branch)];return h&&o.linkVars?{change:{kind:"css-var",sheets:[...new Map(ge().filter(E=>E.ref).map(E=>[JSON.stringify(E.ref),E.ref])).values()],name:h[1],value:n},where:`theme variable ${h[1]} (everything that uses it)`,affected:[],varName:h[1]}:{change:{kind:"css-rule",sheet:l.ref,selector:l.rule.selectorText,conditions:l.conds,occurrence:l.occurrence,prop:t,value:n},where:`rule ${l.rule.selectorText}${l.conds.length?` (@${l.conds.map(w=>w.type+" "+w.text).join(" ")})`:""} in ${l.ref.label}`,affected:x,varName:h&&h[1]}}let f=he(e),m=mt(s);return f&&m?{change:{kind:"css-new-rule",sheet:m,selector:f,prop:t,value:n},where:`${f} in ${m.label}`,affected:[...document.querySelectorAll(f)]}:{fallback:"No stylesheet rule to edit for this element.",affected:[e]}}function vt(e){for(let t of e.affected)e.preview.push([t,e.prop,t.style.getPropertyValue(e.prop),t.style.getPropertyPriority(e.prop)]),t.style.setProperty(e.prop,e.value,"important");if(e.change&&e.change.kind==="css-var"){let t=document.documentElement;e.preview.push([t,e.change.name,t.style.getPropertyValue(e.change.name),""]),t.style.setProperty(e.change.name,e.value)}}function te(e){for(let[t,n,a,i]of e.preview.reverse())a?t.style.setProperty(n,a,i):t.style.removeProperty(n),t.getAttribute("style")===""&&t.removeAttribute("style");e.preview=[]}function $(e,t,n){let a=o.sel;if(!a)return;let i=o.pending.find(d=>d.prop===e&&d.el===a);if(i&&(te(i),o.pending.splice(o.pending.indexOf(i),1)),t===null){P();return}let s=xt(a,e,t,o.scope),c={el:a,prop:e,value:t,label:n||`${e}: ${t}`,preview:[],...s};vt(c),o.pending.push(c),P(),L()}function je(){let e=o.pending.filter(t=>t.prop);for(let t of e)te(t),o.pending.splice(o.pending.indexOf(t),1);for(let t of e)o.sel=t.el,$(t.prop,t.value,t.label)}async function Re(){if(!o.pending.length)return;let e=o.pending.filter(s=>s.fallback),t=o.pending.filter(s=>!s.fallback),n=[];for(let s of t){let c=Y(s.el),d=s.change&&s.change.kind==="css-var"?` (theme ${s.change.name})`:s.change&&/css-/.test(s.change.kind)?` (${s.change.selector} in ${s.change.sheet.label})`:s.changes?` (${s.changes.length} elements)`:"";for(let l of s.changes||[s.change])n.push({prop:s.prop,value:s.value,...l,label:s.kind==="text"||s.kind==="image"?s.label:`${c} ${s.label}${d}`});if(s.prop==="font-family"){let l=q.find(f=>f.css===s.value);l&&l.google!==!1&&n.unshift({kind:"font-link",file:ct()||"index.html",family:l.name,optional:!0,label:`load ${l.name}`})}}if(e.length){for(let s of e)await me(`set ${s.prop} to ${s.value} on ${o.scope==="all"?"all elements like":"this"} ${Y(s.el)}`,s.el,s.fallback,!0);e.forEach(s=>{o.pending.splice(o.pending.indexOf(s),1)})}if(!n.length){P();return}let a=[],i=new Map;for(let s of n){if(s.kind!=="class"&&s.kind!=="class-search"){a.push(s);continue}let c=s.kind==="class"?`${s.loc.file}#${s.loc.path}`:`search:${s.oldClass}`,d=i.get(c);if(!d){i.set(c,s),a.push(s);continue}d.newClass=de(d.newClass,s.prop,s.value),d.label+=`; ${s.prop}: ${s.value}`}n.length=0,n.push(...a),ce(!0);try{let s=await M("apply",{pageUrl:location.href,changes:n});if(s.noop){y("Nothing changed in the files."),ne();return}F({toast:{text:`Saved ${s.sha} \xB7 ${s.message}`,sha:s.sha,files:s.files},reselect:s.reload&&s.reload.path}),location.reload()}catch(s){ce(!1);let c=n.map(d=>d.label).join("; ");y(s.message,{kind:"error",actions:s.data&&s.data.fallback?[{label:"Hand to AI",run:()=>me(c,o.sel,s.message)}]:[]})}}function ne(){for(let e of o.pending)te(e),e.undoPreview&&e.undoPreview();o.pending=[],P(),o.sel&&S(),L()}async function be(e){try{let t=await M("undo",e?{sha:e}:{});F({toast:{text:`Undid ${t.reverted}`}}),location.reload()}catch(t){y(t.message,{kind:"error"})}}async function me(e,t,n,a){let i=t||o.sel,s={};if(i){let c=getComputedStyle(i);for(let d of["color","background-color","font-family","font-size","font-weight","width","height","padding","margin","border-radius","display"])s[d]=c.getPropertyValue(d)}try{let c=await M("ask",{request:e,reason:n,pageUrl:location.href,loc:i&&T(i),selector:i?Ie(i):"page",html:i?i.outerHTML.replace(/ data-em="[^"]*"/g,""):"",rules:i?ee(i).map(d=>d.rule.selectorText).slice(-6):[],styles:s});o.status.pending=(o.status.pending||0)+1,o.tab==="claude"&&S(),y(`${a?"Handed to your AI":"Queued for your AI"}: \u201C${e}\u201D. It's listed in Ask AI until your AI applies it.`,{actions:[{label:"Copy prompt",run:()=>navigator.clipboard.writeText(c.prompt).then(()=>y("Prompt copied"))}]}),Le()}catch(c){y(c.message,{kind:"error"})}}function Ne(e,t){if(!t||!t.isConnected){e.hidden=!0;return}let n=t.getBoundingClientRect();e.hidden=!1,Object.assign(e.style,{left:`${n.left}px`,top:`${n.top}px`,width:`${n.width}px`,height:`${n.height}px`});let a=e.querySelector(".tag");a.textContent=`${Y(t)}  ${Math.round(n.width)}\xD7${Math.round(n.height)}`,a.classList.toggle("below",n.top<24)}let De="design-inside:layout",ae={dock:"auto",w:312,h:560,x:null,y:null,min:!1};o.layout=(()=>{try{return{...ae,...JSON.parse(localStorage.getItem(De)||"{}")}}catch{return{...ae}}})();let V=()=>{try{localStorage.setItem(De,JSON.stringify(o.layout))}catch{}},A=(e,t,n)=>Math.max(t,Math.min(n,e)),oe=236,xe=(e,t=160)=>(1-1/(e*.55/t+1))*t,yt=(e,t,n)=>e<t?t-xe(t-e):e>n?n+xe(e-n):e,se=(e,t,n)=>o.stretch?yt(e,t,n):A(e,t,n);function R(){let e=o.layout,t=12,n=g.style,a=se(e.w,oe,Math.max(oe,innerWidth-2*t)),i=se(e.h,200,Math.max(200,innerHeight-2*t));n.left=n.right=n.top=n.bottom=n.transform=n.height="",n.width=`${a}px`,g.classList.toggle("min",!!e.min),g.dataset.dock=e.dock;let s=e.dock==="left"||e.dock==="auto"&&o.autoLeft?"left":"right";if(g.classList.toggle("anchor-right",["auto","right"].includes(e.dock)&&s==="right"),["auto","left","right"].includes(e.dock))n.top=`${t}px`,n[s]=`${t}px`,e.min||(n.bottom=`${t}px`);else if(e.dock==="top")n.top=`${t}px`,n.left="50%",n.transform="translateX(-50%)",e.min||(n.height=`${i}px`);else if(e.dock==="center")n.top="50%",n.left="50%",n.transform="translate(-50%, -50%)",e.min||(n.height=`${i}px`);else{let c=se(e.y??t,0,Math.max(0,innerHeight-48));n.left=`${se(e.x??innerWidth-a-t,0,Math.max(0,innerWidth-a))}px`,n.top=`${c}px`,e.min||(n.height=`${o.stretch?i:Math.min(i,innerHeight-c-t)}px`)}}function wt(){if(!(!o.sel||g.hidden)){if(o.layout.dock==="auto"){let e=o.sel.getBoundingClientRect(),t=o.layout.w+24;o.autoLeft=e.right>innerWidth-t&&e.left>t}R()}}g.addEventListener("dblclick",e=>{!e.target.closest("header")||e.target.closest("button, input, select, textarea")||(o.layout={...ae},V(),S(),R())}),g.addEventListener("pointerdown",e=>{let t=e.target.closest(".edge"),n=e.target.closest(".edge-b"),a=e.target.closest(".grip")||t||n,i=!a&&e.target.closest("header")&&!e.target.closest("button, input, select, textarea");if(!a&&!i)return;e.preventDefault();let s=g.getBoundingClientRect(),c={x:e.clientX,y:e.clientY,left:s.left,top:s.top,w:s.width,h:s.height},d=g.classList.contains("anchor-right"),l=!1,f=()=>{l=!0,i&&Object.assign(o.layout,{dock:"free",x:s.left,y:s.top,w:s.width,h:o.layout.min?o.layout.h:s.height}),g.classList.remove("settle"),g.classList.add(i?"dragging":n?"resizing-b":"resizing"),o.stretch=!0};i||f();let m=x=>{let w=x.clientX-c.x,E=x.clientY-c.y;if(!l){if(Math.hypot(w,E)<4)return;f()}i?(o.layout.x=c.left+w,o.layout.y=c.top+E):(n||(o.layout.w=c.w+(d?-w:w)),!t&&!["auto","left","right"].includes(o.layout.dock)&&(o.layout.h=c.h+E)),R()},h=()=>{if(removeEventListener("pointermove",m,!0),removeEventListener("pointerup",h,!0),removeEventListener("pointercancel",h,!0),g.classList.remove("dragging","resizing","resizing-b"),!l)return;o.stretch=!1;let x=o.layout;x.w=A(x.w,oe,Math.max(oe,innerWidth-24)),x.h=A(x.h,200,Math.max(200,innerHeight-24)),x.dock==="free"&&(x.x=A(x.x,0,Math.max(0,innerWidth-x.w)),x.y=A(x.y,0,Math.max(0,innerHeight-48))),g.classList.add("settle"),R(),setTimeout(()=>g.classList.remove("settle"),520),V()};addEventListener("pointermove",m,!0),addEventListener("pointerup",h,!0),addEventListener("pointercancel",h,!0)});let kt={"Size & spacing":"size",Effects:"effects",Position:"position"},Fe="design-inside:folds";o.folds=(()=>{try{return JSON.parse(localStorage.getItem(Fe)||"{}")}catch{return{}}})();function $t(){for(let e of g.querySelectorAll(".body section > h4")){let t=kt[e.textContent.trim()];if(!t)continue;let n=!!o.folds[t];e.parentElement.classList.add("fold"),e.parentElement.classList.toggle("open",n),e.innerHTML=`<button class="fold-btn" data-fold-toggle="${t}" aria-expanded="${n}">${v(e.textContent.trim())}<i class="chev"></i></button>`}}function St(e){o.folds[e]=!o.folds[e];try{localStorage.setItem(Fe,JSON.stringify(o.folds))}catch{}let t=g.querySelector(`[data-fold-toggle="${e}"]`);t&&(t.closest("section").classList.toggle("open",o.folds[e]),t.setAttribute("aria-expanded",String(o.folds[e])))}let ve={};function Be(e,t,n){let a=g.querySelector(`${e} .seg-pill`);if(!a||t<0){delete ve[n];return}let i=ve[n];i!=null&&i!==t&&(a.style.transition="none",a.style.setProperty("--i",i),a.offsetWidth,a.style.transition=""),a.style.setProperty("--i",t),ve[n]=t}let N={d:0,t:0};g.addEventListener("wheel",e=>{let t=e.target.closest(".body");if(!t)return;let n=t.scrollTop<=0&&e.deltaY<0,a=t.scrollTop+t.clientHeight>=t.scrollHeight-1&&e.deltaY>0;!n&&!a||(N.d=A(N.d-e.deltaY,-600,600),t.style.transition="none",t.style.translate=`0 ${Math.sign(N.d)*xe(Math.abs(N.d),120)}px`,clearTimeout(N.t),N.t=setTimeout(()=>{t.style.transition="translate .55s cubic-bezier(.2, .9, .3, 1.12)",t.style.translate="0 0",N.d=0},80))},{passive:!0});function L(){if(wt(),Ne(rt,o.on&&o.hover&&o.hover!==o.sel?o.hover:null),Ne(lt,o.on?o.sel:null),z.querySelectorAll(".hl.affected").forEach(t=>t.remove()),o.on&&o.sel&&o.scope==="all"){let t=he(o.sel),n=t?[...document.querySelectorAll(t)].filter(a=>a!==o.sel).slice(0,40):[];for(let a of n){let i=document.createElement("div");i.className="hl affected";let s=a.getBoundingClientRect();Object.assign(i.style,{left:`${s.left}px`,top:`${s.top}px`,width:`${s.width}px`,height:`${s.height}px`}),z.insertBefore(i,g)}}}addEventListener("scroll",L,!0),addEventListener("resize",L);function D(e){o.editing&&_e(),e!==o.sel&&(o.tab="style"),o.sel=e,o.scope="this",S(),L()}let ye=e=>{let t=e.target;return t&&t.nodeType===1&&t!==document.documentElement&&t!==document.body?t:null};document.addEventListener("mousemove",e=>{if(!o.on||Z(e)){o.hover&&(o.hover=null,L());return}let t=ye(e);t!==o.hover&&(o.hover=t,L())},!0);let Lt=e=>{!o.on||Z(e)||o.editing&&o.editing.el.contains(e.target)||(e.preventDefault(),e.stopPropagation())};for(let e of["mousedown","mouseup","pointerdown","pointerup","submit","auxclick"])document.addEventListener(e,Lt,!0);document.addEventListener("click",e=>{if(!o.on||Z(e)||o.editing&&o.editing.el.contains(e.target))return;e.preventDefault(),e.stopPropagation();let t=ye(e);t&&D(t)},!0),document.addEventListener("dblclick",e=>{if(!o.on||Z(e))return;e.preventDefault(),e.stopPropagation();let t=ye(e);t&&Ct(t)},!0);let we=e=>e.childNodes.length>0&&[...e.childNodes].every(t=>t.nodeType===3)&&e.textContent.trim().length>0,He=new Set(["img","video","svg","picture","canvas","iframe"]),Ue=new Set(["input","textarea","select"]);function Et(e,t){let n=e.tagName.toLowerCase(),a=He.has(n),i=we(e),s=!a&&(Ue.has(n)||e.textContent.trim().length>0),c=!a&&t.display==="inline",d=a?{img:"Image",video:"Video",svg:"Icon",picture:"Image",canvas:"Canvas",iframe:"Embed"}[n]:/^h[1-6]$/.test(n)?"Heading":n==="button"||e.getAttribute("role")==="button"||n==="a"&&/\bbtn|button\b/i.test(e.className)?"Button":n==="a"?"Link":n==="p"?"Paragraph":Ue.has(n)?"Field":n==="li"?"List item":i?"Text":/^(section|header|footer|main|nav|aside)$/.test(n)?"Section":"Box";return{tag:n,media:a,leaf:i,hasText:s,inline:c,label:d,container:!i&&!a&&e.children.length>0}}function Ct(e){if(!we(e)){if(![...e.querySelectorAll("*")].find(we)||e.textContent.trim().length===0){y("Double-click directly on a piece of text to edit it.");return}if(e.children.length){y("This text contains other elements (links, bold\u2026). Edit each part separately, or ask AI."),D(e);return}}D(e),o.editing={el:e,before:e.textContent},e.setAttribute("contenteditable","plaintext-only"),e.contentEditable!=="plaintext-only"&&e.setAttribute("contenteditable","true"),e.classList.add("em-editing"),e.style.setProperty("outline","none","important"),e.focus();let t=document.createRange();t.selectNodeContents(e);let n=getSelection();n.removeAllRanges(),n.addRange(t),e.addEventListener("keydown",We,!0),e.addEventListener("blur",_e,{once:!0})}function We(e){e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),o.editing.el.blur()),e.key==="Escape"&&(e.preventDefault(),o.editing.el.textContent=o.editing.before,o.editing.el.blur()),e.stopPropagation()}function _e(){let e=o.editing;if(!e)return;o.editing=null;let t=e.el;t.removeAttribute("contenteditable"),t.classList.remove("em-editing"),t.style.removeProperty("outline"),t.getAttribute("style")||t.removeAttribute("style"),t.getAttribute("class")||t.removeAttribute("class"),t.removeEventListener("keydown",We,!0),Ge(t,e.before,t.textContent)}function Ge(e,t,n){let a=n.replace(/\s+/g," ").trim(),i={before:t};if(o.pending=o.pending.filter(l=>!(l.kind==="text"&&l.el===e)),a===t.replace(/\s+/g," ").trim()){e.textContent=t,P(),L();return}let s=T(e),c=l=>l.length>40?l.slice(0,37)+"\u2026":l,d={el:e,kind:"text",before:t,label:`text \u201C${c(i.before.trim())}\u201D \u2192 \u201C${c(a)}\u201D`,preview:[],affected:[],change:s?{kind:"text",loc:s,oldText:i.before,newText:a}:{kind:"text-search",oldText:i.before.trim(),newText:a},where:s?`text of this <${s.tag}> in ${s.file}`:"source file containing this exact text (found by search)",undoPreview:()=>{e.textContent=i.before}};e.textContent=a,o.pending.push(d),P(),L()}function I(e,t){let n=e.style.getPropertyValue(t);if(n)return n;let a=fe(ee(e),t);return a?a.value:""}function S(){let e=o.sel;if(!e||!o.on){g.hidden=!0;return}g.hidden&&(g.hidden=!1,g.classList.remove("enter"),g.offsetWidth,g.classList.add("enter"));let t=getComputedStyle(e),n=T(e),a=he(e),i=ee(e),s=a?document.querySelectorAll(a).length:1,c=Pe(e),d=t.fontFamily.split(",")[0].replace(/["']/g,"").trim(),l=I(e,"background-color"),f=I(e,"color"),m=p=>(p.match(/^var\((--[\w-]+)\)$/)||[])[1],h=e.parentElement,x=h?[...h.children].filter(p=>p!==C):[],w=x.indexOf(e),E=/flex|grid/.test(t.display),u=Et(e,t);g.innerHTML=`
      <header title="Drag to move \xB7 double-click to put the panel back">
        <div class="crumb">
          ${e.parentElement&&e.parentElement!==document.body?'<button class="ghost up" title="Select parent">\u2196</button>':""}
          <div>
            <div class="name"><span class="kind">${v(u.label)}</span> <span class="sel-name">${v(Y(e))}</span></div>
            <div class="src">${n?`${v(n.file)} \xB7 source-mapped`:c?"Tailwind \xB7 found by search":"rendered by your framework"}</div>
          </div>
        </div>
        <div class="hd-actions">
          <button class="ghost layout-btn ${o.layoutOpen?"on":""}" title="Move or resize this panel">\u21F1</button>
          <button class="ghost min-btn" title="${o.layout.min?"Expand":"Collapse"} this panel">${o.layout.min?"\u25A2":"\u2013"}</button>
          <button class="ghost close" title="Close (Esc)">\u2715</button>
        </div>
      </header>
      ${o.layoutOpen?`<div class="layout-row">
        <div class="seg">${[["left","\u25E7 Left"],["top","\u2B12 Top"],["center","\u25A3 Center"],["right","\u25E8 Right"]].map(([p,b])=>`<button data-dock="${p}" class="${o.layout.dock===p?"on":""}">${b}</button>`).join("")}</div>
        <button class="mini reset-layout" title="Back to the default position and size">Reset</button>
        <p class="hint">Or drag this top bar to put the panel anywhere, and double-click it to put the panel back. Drag a blue edge or the corner to resize it.</p>
      </div>`:""}
      <nav class="tabs"><span class="seg-pill"></span>
        <button data-tab="style" class="${o.tab==="style"?"on":""}">Design</button>
        <button data-tab="claude" class="${o.tab==="claude"?"on":""}">Ask AI${o.status.pending?`<i class="dot-badge" title="${o.status.pending} waiting for your AI"></i>`:""}</button>
        <button data-tab="history" class="${o.tab==="history"?"on":""}">History</button>
      </nav>
      ${o.status.git?"":`<div class="warn">Undo needs git, and this folder isn't a repository yet. <button class="mini gitinit">Turn on undo</button></div>`}
      <div class="body">
      ${o.tab==="style"?`
        ${s>1||c?`<div class="scope"><span class="seg-pill"></span>
          <button data-scope="this" class="${o.scope==="this"?"on":""}">Just this one</button>
          <button data-scope="all" class="${o.scope==="all"?"on":""}">All ${s} ${v(a||"like it")}</button>
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
            <label class="row"><span>Size</span><input data-prop="font-size" value="${v(I(e,"font-size")||t.fontSize)}"></label>
            <label class="row"><span>Weight</span><select data-prop="font-weight">${[300,400,500,600,700,800].map(p=>`<option ${String(p)===t.fontWeight?"selected":""}>${p}</option>`).join("")}</select></label>
          </div>
          <label class="row"><span>Color</span>${Xe("color",Q(t.color),m(f))}</label>
          <div class="row"><span>Align</span><div class="seg">${["left","center","right"].map(p=>`<button data-align="${p}" class="${t.textAlign===p||p==="left"&&t.textAlign==="start"?"on":""}">${{left:"\u21E4",center:"\u2194",right:"\u21E5"}[p]}</button>`).join("")}</div></div>
        </section>`:""}
        <section>
          <h4>${u.media?"Shape":"Fill & shape"}</h4>
          ${u.media?"":`<label class="row"><span>Background</span>${Xe("background-color",Q(t.backgroundColor),m(l))}</label>`}
          ${!u.media&&n?'<div class="row"><span>Image</span><button class="mini pick-image" data-target="bg-image" title="Choose a background image">Choose\u2026</button></div>':""}
          <label class="row"><span>Corners</span><input data-prop="border-radius" value="${v(I(e,"border-radius")||t.borderRadius)}"></label>
        </section>
        <section>
          <h4>Size & spacing</h4>
          ${u.inline?`<p class="hint">Width and height don't apply to text that flows inside a line. Use \u2196 to size the box around it.</p>`:""}
          <div class="grid2">
            ${u.inline?"":`<label class="row"><span>Width</span><input data-prop="width" value="${v(I(e,"width")||Math.round(e.getBoundingClientRect().width)+"px")}"></label>
            <label class="row"><span>Height</span><input data-prop="height" value="${v(I(e,"height")||Math.round(e.getBoundingClientRect().height)+"px")}"></label>`}
            ${u.media?"":`<label class="row"><span>Padding</span><input data-prop="padding" value="${v(I(e,"padding")||t.padding)}"></label>`}
            <label class="row"><span>Margin</span><input data-prop="margin" value="${v(I(e,"margin")||t.margin)}"></label>
            ${E?`<label class="row"><span>Gap</span><input data-prop="gap" value="${v(I(e,"gap")||t.gap)}"></label>`:""}
          </div>
          ${u.media?`<label class="check"><input type="checkbox" class="keepratio" ${o.keepRatio!==!1?"checked":""}> Keep proportions</label>`:""}
        </section>
        ${u.tag==="img"?`<section><h4>Image</h4>${n?'<button class="mini pick-image" data-target="img-src">Replace image\u2026</button>':'<p class="hint">This image is rendered by your framework. Ask AI to replace it.</p>'}<p class="hint">PNG, JPEG, WebP, GIF or AVIF, up to 5 MB.</p></section>`:""}
        ${At(e,t,u)}
        <section>
          <h4>Position</h4>
          <div class="row"><span>Order</span>
            <div class="seg">
              <button class="move" data-dir="up" ${w<=0||!n?"disabled":""} title="Move before the previous item">\u2191 Earlier</button>
              <button class="move" data-dir="down" ${w<0||w>=x.length-1||!n?"disabled":""} title="Move after the next item">\u2193 Later</button>
            </div>
          </div>
          ${n?"":'<p class="hint">Reordering needs a source-mapped page. Ask AI instead.</p>'}
        </section>
      `:o.tab==="claude"?`
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
      <div class="grip" title="Drag to resize"></div>`,$t(),Be(".tabs",["style","claude","history"].indexOf(o.tab),"tab"),Be(".scope",o.scope==="all"?1:0,"scope"),o.tab==="history"&&Rt(),o.tab==="claude"&&Se(),P()}let ie={none:["None","none"],soft:["Soft","0 2px 8px rgba(15, 23, 42, 0.08)"],medium:["Medium","0 8px 24px rgba(15, 23, 42, 0.14)"],strong:["Strong","0 20px 48px rgba(15, 23, 42, 0.24)"],glow:["Glow","0 0 0 4px rgba(139, 123, 255, 0.25), 0 8px 30px rgba(139, 123, 255, 0.35)"]},Ye=[["grayscale","Grayscale",0,100,0],["brightness","Brightness",0,200,100],["contrast","Contrast",0,200,100],["saturate","Saturation",0,200,100]],re=null;function Tt(e){if(e.boxShadow==="none")return"none";if(!re){let t=document.createElement("div");t.style.cssText="position:fixed;visibility:hidden;pointer-events:none",z.appendChild(t),re=Object.fromEntries(Object.entries(ie).map(([n,[,a]])=>(t.style.boxShadow=a,[n,getComputedStyle(t).boxShadow]))),t.remove()}return Object.keys(re).find(t=>re[t]===e.boxShadow)||"custom"}function At(e,t,n){if(n.inline)return"";let a=Tt(t),i=Math.round(parseFloat(t.opacity)*100),s=(d,l,f)=>`<span class="range"><input type="range" min="0" max="${f}" step="5" ${d} value="${l}" style="--p: ${l/f*100}%"><output>${l}%</output></span>`,c=`
      <label class="row"><span>Shadow</span><select data-fx="shadow">${a==="custom"?"<option selected disabled>Custom</option>":""}${Object.entries(ie).map(([d,[l]])=>`<option value="${d}" ${d===a?"selected":""}>${l}</option>`).join("")}</select></label>
      <label class="row"><span>Opacity</span>${s('data-fx="opacity"',i,100)}</label>`;if(n.media){let d={};for(let[l,,,,f]of Ye){let m=t.filter.match(new RegExp(`${l}\\(([\\d.]+)(%?)\\)`));d[l]=m?Math.round(m[2]?+m[1]:+m[1]*100):f}c+=Ye.map(([l,f,,m,h])=>`<label class="row"><span>${f}</span>${s(`data-fx="filter" data-f="${l}" data-default="${h}"`,d[l],m)}</label>`).join("")}else{let d=/gradient\(/.test(t.backgroundImage);c+=`
      <div class="row"><span>Gradient</span><span class="grad">
        <input type="color" data-fx="grad-a" value="${Q(t.backgroundColor)||"#ffffff"}" title="From">
        <input type="color" data-fx="grad-b" value="#8b7bff" title="To">
        <select data-fx="grad-angle" title="Direction">${[[180,"\u2193"],[135,"\u2198"],[90,"\u2192"],[45,"\u2197"],[0,"\u2191"]].map(([l,f])=>`<option value="${l}" ${l===135?"selected":""}>${f}</option>`).join("")}</select>
        <button class="mini" data-fx-apply="gradient">Apply</button>${d?'<button class="mini" data-fx-apply="no-gradient">Remove</button>':""}
      </span></div>
      <div class="row"><span>Border</span><span class="border"><input data-fx="border-w" value="${Math.round(parseFloat(t.borderTopWidth)||0)}" title="Width in px"><input type="color" data-fx="border-c" value="${Q(t.borderTopColor)||"#000000"}" title="Color"></span></div>
      <label class="check"><input type="checkbox" data-fx="glass" ${t.backdropFilter&&t.backdropFilter!=="none"?"checked":""}> Glass blur behind it</label>`}return`<section><h4>Effects</h4>${c}</section>`}function Ve(e,t){let n=e.dataset&&e.dataset.fx;if(!n)return!1;let a=e.nextElementSibling&&e.nextElementSibling.tagName==="OUTPUT"?e.nextElementSibling:null;if(a&&(a.textContent=`${e.value}%`,e.style.setProperty("--p",`${e.value/e.max*100}%`)),n==="shadow"&&!t)$("box-shadow",ie[e.value][1],`shadow \u2192 ${ie[e.value][0]}`);else if(n==="opacity")$("opacity",String(+e.value/100),`opacity \u2192 ${e.value}%`);else if(n==="filter"){let s=[...g.querySelectorAll('[data-fx="filter"]')].filter(c=>+c.value!=+c.dataset.default).map(c=>`${c.dataset.f}(${c.value}%)`).join(" ")||"none";$("filter",s,`filter \u2192 ${s}`)}else if(n==="border-w"&&!t||n==="border-c"){let i=Math.max(0,parseFloat(g.querySelector('[data-fx="border-w"]').value)||0),s=g.querySelector('[data-fx="border-c"]').value;$("border",i?`${i}px solid ${s}`:"none",i?`border \u2192 ${i}px ${s}`:"border \u2192 none")}else n==="glass"&&!t&&$("backdrop-filter",e.checked?"blur(12px)":"none",`glass blur ${e.checked?"on":"off"}`);return!0}function zt(e){if(e)return $("background-image","none","gradient \u2192 none");let t=g.querySelector('[data-fx="grad-a"]').value,n=g.querySelector('[data-fx="grad-b"]').value,a=g.querySelector('[data-fx="grad-angle"]').value;$("background-image",`linear-gradient(${a}deg, ${t}, ${n})`,`gradient \u2192 ${t} to ${n}`)}let Ke=["image/png","image/jpeg","image/webp","image/gif","image/avif"],ke=5*1024*1024,le=8e3,Mt=2400,U=Object.assign(document.createElement("input"),{type:"file",accept:Ke.join(","),hidden:!0});z.appendChild(U);let $e=null;function It(e){$e={kind:e,el:o.sel},U.value="",U.click()}U.addEventListener("change",()=>{let e=U.files&&U.files[0];e&&$e&&Pt(e,$e)});let Je=e=>`${(e/1048576).toFixed(1)} MB`;async function Pt(e,t){if(e.size>ke)return y(`\u201C${e.name}\u201D is ${Je(e.size)}. The limit is 5 MB.`,{kind:"error"});if(!Ke.includes(e.type))return y(`\u201C${e.name}\u201D isn't a PNG, JPEG, WebP, GIF or AVIF image, so it was refused. (SVG files are refused because they can contain code.)`,{kind:"error"});let n;try{n=await createImageBitmap(e)}catch{return y(`\u201C${e.name}\u201D couldn't be read as an image, so it was refused.`,{kind:"error"})}if(n.width>le||n.height>le)return n.close(),y(`\u201C${e.name}\u201D is ${n.width}\xD7${n.height} pixels. The limit is ${le}\xD7${le}.`,{kind:"error"});Ot(n,e.name,t)}function Ot(e,t,n){let a={rot:0,aspect:"free",src:null,scale:1,rect:null},i=document.createElement("div");i.className="modal",i.innerHTML=`<div class="crop" role="dialog" aria-label="Crop image">
      <div class="crop-head"><b>Crop image</b><span class="dim">${v(t)} \xB7 ${e.width}\xD7${e.height}</span></div>
      <div class="crop-stage"><canvas></canvas><div class="crop-rect"><i data-h="nw"></i><i data-h="ne"></i><i data-h="sw"></i><i data-h="se"></i></div></div>
      <div class="crop-tools"><div class="seg">${[["free","Free"],["1","1:1"],["1.3333","4:3"],["1.7778","16:9"],["orig","Original"]].map(([u,p])=>`<button data-aspect="${u}" class="${u==="free"?"on":""}">${p}</button>`).join("")}</div><button class="mini rotate">\u21BB Rotate</button></div>
      <div class="crop-foot"><span class="dim out"></span><span class="grow"></span><button class="ghost cancel">Cancel</button><button class="primary use">Use image</button></div>
    </div>`,z.appendChild(i);let s=i.querySelector("canvas"),c=i.querySelector(".crop-rect"),d=i.querySelector(".out"),l=()=>a.aspect==="free"?null:a.aspect==="orig"?a.src.width/a.src.height:+a.aspect,f=()=>{let u=a.rect.w/a.scale,p=a.rect.h/a.scale,b=Math.min(1,Mt/Math.max(u,p));return{w:Math.max(1,Math.round(u*b)),h:Math.max(1,Math.round(p*b))}},m=()=>{Object.assign(c.style,{left:`${a.rect.x}px`,top:`${a.rect.y}px`,width:`${a.rect.w}px`,height:`${a.rect.h}px`});let u=f();d.textContent=`Saves as ${u.w}\xD7${u.h}`},h=()=>{let u=s.width,p=s.height,b=l(),O=u,k=p;b&&(u/p>b?O=p*b:k=u/b),a.rect={x:(u-O)/2,y:(p-k)/2,w:O,h:k},m()},x=()=>{let u=a.rot%180!==0;a.src=Object.assign(document.createElement("canvas"),{width:u?e.height:e.width,height:u?e.width:e.height});let p=a.src.getContext("2d");p.translate(a.src.width/2,a.src.height/2),p.rotate(a.rot*Math.PI/180),p.drawImage(e,-e.width/2,-e.height/2),a.scale=Math.min(560/a.src.width,360/a.src.height,1),s.width=Math.round(a.src.width*a.scale),s.height=Math.round(a.src.height*a.scale),s.getContext("2d").drawImage(a.src,0,0,s.width,s.height),h()};x();let w=()=>{e.close(),i.remove()};i.addEventListener("keydown",u=>{u.key==="Escape"&&(u.stopPropagation(),w())}),i.addEventListener("click",async u=>{let p=u.target.closest("button");if(p){if(p.dataset.aspect)return a.aspect=p.dataset.aspect,i.querySelectorAll("[data-aspect]").forEach(b=>b.classList.toggle("on",b===p)),h();if(p.classList.contains("rotate"))return a.rot=(a.rot+90)%360,x();if(p.classList.contains("cancel"))return w();if(p.classList.contains("use")){p.disabled=!0;try{await E()}finally{p.disabled=!1}}}}),c.addEventListener("pointerdown",u=>{u.preventDefault();let p=u.target.dataset.h,b={...a.rect,px:u.clientX,py:u.clientY},O=s.width,k=s.height,W=l(),j=Qe=>{let Ce=Qe.clientX-b.px,Te=Qe.clientY-b.py;if(!p)return a.rect.x=A(b.x+Ce,0,O-b.w),a.rect.y=A(b.y+Te,0,k-b.h),m();let Ae=p.includes("w"),ze=p.includes("n"),K=A(b.w+(Ae?-Ce:Ce),16,Ae?b.x+b.w:O-b.x),J=A(b.h+(ze?-Te:Te),16,ze?b.y+b.h:k-b.y);W&&(K/J>W?K=J*W:J=K/W),a.rect={x:Ae?b.x+b.w-K:b.x,y:ze?b.y+b.h-J:b.y,w:K,h:J},m()},_=()=>{removeEventListener("pointermove",j,!0),removeEventListener("pointerup",_,!0)};addEventListener("pointermove",j,!0),addEventListener("pointerup",_,!0)});async function E(){let u=f(),p=Object.assign(document.createElement("canvas"),{width:u.w,height:u.h});p.getContext("2d").drawImage(a.src,a.rect.x/a.scale,a.rect.y/a.scale,a.rect.w/a.scale,a.rect.h/a.scale,0,0,u.w,u.h);let b=p.toDataURL("image/webp").startsWith("data:image/webp"),O=b?"image/webp":"image/png",k=await new Promise(j=>p.toBlob(j,O,.9));if(k&&k.size>ke&&b&&(k=await new Promise(j=>p.toBlob(j,O,.7))),!k||k.size>ke)return y(`The cropped image is still over 5 MB (${k?Je(k.size):"?"}). Crop it smaller.`,{kind:"error"});let W=await new Promise(j=>{let _=new FileReader;_.onload=()=>j(String(_.result).split(",")[1]),_.readAsDataURL(k)});qt(n,k,W,`${t.replace(/\.[^.]*$/,"")}.${b?"webp":"png"}`,u),w()}}function qt(e,t,n,a,i){let s=e.el,c=T(s);if(!s||!c)return y("This element has no source location, so its image can't be replaced here. Ask AI instead.",{kind:"error"});let d=URL.createObjectURL(t),l=e.kind==="img-src",f=l?{src:s.getAttribute("src"),srcset:s.getAttribute("srcset")}:{bi:s.style.backgroundImage,bs:s.style.backgroundSize,bp:s.style.backgroundPosition};o.pending.filter(m=>m.kind==="image"&&m.el===s&&m.change.kind===e.kind).forEach(m=>{m.undoPreview(),o.pending.splice(o.pending.indexOf(m),1)}),l?(s.removeAttribute("srcset"),s.src=d):Object.assign(s.style,{backgroundImage:`url("${d}")`,backgroundSize:"cover",backgroundPosition:"center"}),o.pending.push({el:s,kind:"image",preview:[],affected:[s],label:`${l?"image":"background image"} \u2192 ${a} (${i.w}\xD7${i.h})`,where:`saved in images/ next to ${c.file}`,change:{kind:e.kind,loc:c,data:n,name:a},undoPreview:()=>{l?(f.src==null?s.removeAttribute("src"):s.setAttribute("src",f.src),f.srcset&&s.setAttribute("srcset",f.srcset)):Object.assign(s.style,{backgroundImage:f.bi,backgroundSize:f.bs,backgroundPosition:f.bp}),URL.revokeObjectURL(d)}}),P(),L()}function Xe(e,t,n){return`<span class="color"><input type="color" data-prop="${e}" value="${t||"#ffffff"}"><input class="hex" data-hex="${e}" value="${t||"none"}" spellcheck="false">${n?`<label class="var" title="This color comes from a theme variable"><input type="checkbox" class="linkvar" ${o.linkVars?"checked":""}> ${v(n)}</label>`:""}</span>`}async function Se(){let e=g.querySelector(".reqs");if(e)try{let{requests:t}=await M("requests");o.status.pending=t.length,e.innerHTML=t.length?t.map(a=>`
        <div class="req"><span>${v(a.title)}</span><button class="ghost req-remove" data-id="${v(a.id)}" title="Remove from the queue">\u2715</button></div>`).join(""):'<p class="hint">Nothing waiting. Requests you queue appear here until your AI applies them.</p>';let n=g.querySelector('[data-tab="claude"]');n&&(n.innerHTML=`Ask AI${t.length?`<i class="dot-badge" title="${t.length} waiting for your AI"></i>`:""}`)}catch(t){e.textContent=t.message}}async function jt(e){try{let t=await M("requests-remove",{id:e});o.status.pending=t.pending,Se()}catch(t){y(t.message,{kind:"error"}),Se()}}async function Rt(){let e=g.querySelector(".hist");try{let{commits:t}=await M("history");e.innerHTML=t.length?t.slice(0,15).map(n=>`
        <div class="commit ${n.ours?"ours":""}">
          <div><code>${n.sha}</code> <span class="when">${v(n.when)}</span><div class="subj">${v(n.subject.replace(/^design-inside: /,""))}</div></div>
          ${n.ours&&!n.subject.startsWith("Revert")?`<button class="mini undo" data-sha="${n.sha}">Undo</button>`:""}
        </div>`).join(""):'<p class="hint">No commits yet.</p>'}catch(t){e.textContent=t.message}}function P(){let e=g.querySelector(".pending");if(Le(),!!e){if(!o.pending.length){e.innerHTML='<p class="hint">Changes show live. Nothing is saved until you press Save.</p>';return}e.innerHTML=`
      <ol>${o.pending.map((t,n)=>`<li class="${t.fallback?"fb":""}"><div><b>${v(t.label)}</b><small>${t.fallback?"\u2192 will be handed to your AI agent":`\u2192 ${v(t.where)}${t.affected&&t.affected.length>1?` \xB7 ${t.affected.length} elements`:""}`}</small></div><button class="ghost drop" data-i="${n}" title="Remove">\u2715</button></li>`).join("")}</ol>
      <div class="actions"><button class="ghost discard">Discard</button><button class="primary save">Save & commit <kbd>\u2318S</kbd></button></div>`}}function Le(){let e=o.pending.length;ue.classList.toggle("on",o.on),ue.querySelector(".pill-label").textContent=o.on?e?`${e} unsaved`:"Editing":"Edit page"}g.addEventListener("click",e=>{let t=e.target.closest("button");if(t){if(t.classList.contains("close"))return D(null);if(t.dataset.foldToggle)return St(t.dataset.foldToggle);if(t.classList.contains("layout-btn"))return o.layoutOpen=!o.layoutOpen,S();if(t.classList.contains("min-btn"))return o.layout.min=!o.layout.min,V(),S(),R();if(t.dataset.dock)return o.layout.dock=t.dataset.dock,o.layout.min=!1,V(),S(),R();if(t.classList.contains("reset-layout"))return o.layout={...ae},V(),S(),R();if(t.classList.contains("up"))return D(o.sel.parentElement);if(t.dataset.tab)return o.tab=t.dataset.tab,S();if(t.dataset.scope){o.scope=t.dataset.scope,je(),S(),L();return}if(t.dataset.align)return $("text-align",t.dataset.align);if(t.dataset.fxApply)return zt(t.dataset.fxApply==="no-gradient");if(t.classList.contains("pick-image"))return It(t.dataset.target);if(t.classList.contains("move"))return Dt(t.dataset.dir);if(t.classList.contains("save"))return Re();if(t.classList.contains("discard"))return ne();if(t.classList.contains("drop")){let n=o.pending[+t.dataset.i];return te(n),n.undoPreview&&n.undoPreview(),o.pending.splice(+t.dataset.i,1),P()}if(t.classList.contains("undo"))return be(t.dataset.sha);if(t.classList.contains("req-remove"))return jt(t.dataset.id);if(t.classList.contains("gitinit"))return M("git-init",{}).then(()=>{o.status.git=!0,S(),y("Git is on. Every save is now a commit you can undo.")});if(t.classList.contains("send")){let n=g.querySelector(".ask").value.trim();n&&(me(n,o.sel),g.querySelector(".ask").value="")}}}),g.addEventListener("input",e=>{let t=e.target;if(!Ve(t,!0)&&t.type==="color"){let n=g.querySelector(`[data-hex="${t.dataset.prop}"]`);n&&(n.value=t.value),$(t.dataset.prop,t.value)}}),g.addEventListener("change",e=>{let t=e.target;if(t.classList.contains("linkvar")){o.linkVars=t.checked,je();return}if(t.classList.contains("keepratio")){o.keepRatio=t.checked;return}if(t.dataset.fx){/^(opacity|filter|border-c|grad-)/.test(t.dataset.fx)||Ve(t,!1);return}if(t.hasAttribute("data-text")){let a=o.pending.find(i=>i.kind==="text"&&i.el===o.sel);Ge(o.sel,a?a.before:o.sel.textContent,t.value);return}if(t.dataset.hex){let a=t.value.trim();if(/^#?[0-9a-f]{3,8}$/i.test(a)){let i=a.startsWith("#")?a:`#${a}`,s=g.querySelector(`input[type=color][data-prop="${t.dataset.hex}"]`);s&&/^#[0-9a-f]{6}$/i.test(i)&&(s.value=i.toLowerCase()),$(t.dataset.hex,i)}return}let n=t.dataset.prop;if(!(!n||t.type==="color")){if(n==="font-family"){let a=q.find(i=>i.name===t.value);if(!a)return;a.google!==!1&&Nt(a.name),$("font-family",a.css,`font \u2192 ${a.name}`);return}$(n,n==="font-weight"?t.value:dt(t.value)),(n==="width"||n==="height")&&o.keepRatio!==!1&&He.has(o.sel.tagName.toLowerCase())&&$(n==="width"?"height":"width","auto")}}),g.addEventListener("keydown",e=>{e.key==="Enter"&&e.target.tagName==="INPUT"&&e.target.dispatchEvent(new Event("change",{bubbles:!0})),e.key==="Enter"&&e.target.hasAttribute("data-text")&&(e.preventDefault(),e.target.blur()),e.stopPropagation()});let Nt=e=>{let t=`https://fonts.googleapis.com/css2?family=${e.replace(/ /g,"+")}:wght@400;500;600;700&display=swap`;if(![...document.querySelectorAll("link")].some(n=>n.href===t)){let n=document.createElement("link");n.rel="stylesheet",n.href=t,document.head.appendChild(n)}};async function Dt(e){let t=T(o.sel);if(t){if(o.pending.length){y("Save or discard your pending changes first.");return}ce(!0);try{let n=await M("apply",{pageUrl:location.href,changes:[{kind:"move",loc:t,dir:e,label:`move ${Y(o.sel)} ${e==="up"?"earlier":"later"}`}]});F({toast:{text:`Saved ${n.sha} \xB7 ${n.message}`,sha:n.sha},reselect:n.reload&&n.reload.path}),location.reload()}catch(n){ce(!1),y(n.message,{kind:"error"})}}}function ce(e){g.classList.toggle("busy",e)}function y(e,{kind:t="info",actions:n=[],sha:a}={}){let i=document.createElement("div");i.className=`toast ${t}`,i.innerHTML=`<span>${v(e)}</span>`,a&&(n=[{label:"Undo",run:()=>be(a)},...n]);for(let s of n){let c=document.createElement("button");c.textContent=s.label,c.className="mini",c.onclick=()=>{s.run(),i.remove()},i.appendChild(c)}G(".toasts").appendChild(i),setTimeout(()=>i.classList.add("out"),t==="error"?9e3:6e3),setTimeout(()=>i.remove(),t==="error"?9400:6400)}function Ee(e){o.on=e,document.documentElement.classList.toggle("em-on",e),e||(ne(),o.sel=null,o.hover=null),S(),L(),Le(),F({})}ue.addEventListener("click",()=>Ee(!o.on)),addEventListener("keydown",e=>{if(e.altKey&&(e.key==="e"||e.key==="E"||e.code==="KeyE")){e.preventDefault(),Ee(!o.on);return}if(!o.on||o.editing)return;let t=/INPUT|TEXTAREA|SELECT/.test((e.composedPath()[0]||{}).tagName||"");if((e.metaKey||e.ctrlKey)&&e.key==="s"){e.preventDefault(),Re();return}t||(e.key==="Escape"&&(o.pending.length?ne():D(null)),(e.metaKey||e.ctrlKey)&&e.key==="z"&&!o.pending.length&&(e.preventDefault(),be()))},!0);function F(e){try{let t=o.sel?o.sel.getAttribute("data-em")?{em:o.sel.getAttribute("data-em")}:{css:Ie(o.sel)}:null;sessionStorage.setItem(H,JSON.stringify({on:o.on,sel:t,scrollY,tab:o.tab,...e}))}catch{}}function Ft(){let e=null;try{e=JSON.parse(sessionStorage.getItem(H)||"null")}catch{}if(!e)return;e.on&&Ee(!0),e.tab&&(o.tab=e.tab),typeof e.scrollY=="number"&&requestAnimationFrame(()=>scrollTo(0,e.scrollY));let t=e.reselect?e.reselect.replace(/^\//,""):e.sel&&e.sel.em,n=null;try{t?n=document.querySelector(`[data-em="${CSS.escape(t)}"]`):e.sel&&e.sel.css&&(n=document.querySelector(e.sel.css))}catch{}n&&e.on&&(D(n),o.tab=e.tab||"style",S()),e.toast&&y(e.toast.text,{kind:"ok",sha:e.toast.sha}),F({})}function Bt(){try{new EventSource(r+"events").addEventListener("change",t=>{let{file:n}=JSON.parse(t.data);o.mode!=="proxy"&&(o.pending.length||o.editing?y(`${n} changed on disk.`,{actions:[{label:"Reload",run:()=>{F({}),location.reload()}}]}):(F({}),location.reload()))})}catch{}}let Ze=async()=>{try{Object.assign(o.status,await M("status")),o.mode=o.status.mode}catch{}Ft(),Bt()};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Ze):Ze()})();})();

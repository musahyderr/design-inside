(()=>{var He=/^text-(xs|sm|base|lg|[2-9]?xl|\[\d.*(px|rem|em|%)\])$/,Ct=/^text-(left|center|right|justify|start|end|wrap|nowrap|balance|pretty|ellipsis|clip)$/,Tt=/^bg-(fixed|local|scroll|clip-.*|origin-.*|no-repeat|repeat.*|auto|cover|contain|center|top|bottom|left.*|right.*|none|gradient-.*|blend-.*|opacity-.*|\[url.*)$/,At=/^font-(sans|serif|mono|\['.*'\]|\[".*"\])$/,We={"background-color":{test:i=>i.startsWith("bg-")&&!Tt.test(i),make:i=>`bg-[${i}]`},color:{test:i=>i.startsWith("text-")&&!He.test(i)&&!Ct.test(i),make:i=>`text-[${i}]`},"font-size":{test:i=>He.test(i),make:i=>`text-[${i}]`},"font-family":{test:i=>At.test(i),make:i=>`font-['${zt(i).replace(/ /g,"_")}']`},"font-weight":{test:i=>/^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black|\[\d+\])$/.test(i),make:i=>`font-[${i}]`},width:{test:i=>/^w-/.test(i),make:i=>`w-[${i}]`},height:{test:i=>/^h-/.test(i),make:i=>`h-[${i}]`},padding:{test:i=>/^p-/.test(i),make:i=>`p-[${i.replace(/ /g,"_")}]`},margin:{test:i=>/^m-/.test(i),make:i=>`m-[${i.replace(/ /g,"_")}]`},"border-radius":{test:i=>/^rounded(-|$)/.test(i)&&!/^rounded-[trblse]{1,2}(-|$)/.test(i),make:i=>`rounded-[${i}]`},gap:{test:i=>/^gap-(?!x-|y-)/.test(i),make:i=>`gap-[${i}]`},"box-shadow":{test:i=>/^shadow(-(none|2xs|xs|sm|md|lg|xl|2xl|inner|\[.*\]))?$/.test(i),make:i=>i==="none"?"shadow-none":`shadow-[${i.replace(/ /g,"_")}]`},opacity:{test:i=>/^opacity-(\d+|\[.*\])$/.test(i),make:i=>`opacity-[${i}]`}};function zt(i){return i.split(",")[0].trim().replace(/^['"]|['"]$/g,"")}var Ye=i=>i in We;function se(i,I,D){let F=We[I];if(!F)return null;let O=i.split(/\s+/).filter(Boolean).filter(j=>j.includes(":")||!F.test(j.replace(/^!/,""))),A=F.make(D.trim().replace(/\s*,\s*/g,","));return[...O,A].join(" ")}function Ve(i){return/(^|\s)(flex|grid|block|hidden|(p|m|px|py|mt|mb|w|h|gap|text|bg|rounded|font|shadow)-[\w[\]#.\/-]+)(\s|$)/.test(i||"")}function Mt(i){return i.replace(/\/\*[\s\S]*?\*\//g,"").replace(/\s*([>+~,])\s*/g,"$1").replace(/\s+/g," ").replace(/"/g,"'").trim()}var Pt=i=>(i||"").replace(/\s+/g," ").replace(/\(\s*/g,"(").replace(/\s*\)/g,")").replace(/\s*:\s*/g,":").trim().toLowerCase();function Ke(i,I=[]){return`${I.map(D=>`${D.type} ${Pt(D.text)}`).join(" | ")}::${Mt(i)}`}var Xe=`
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
@media (prefers-color-scheme: light) {
  :host {
    --glass: rgba(246, 246, 248, .82); --glass-solid: #f2f2f7; --card: rgba(255, 255, 255, .78); --cell-on: #fff;
    --fill: rgba(118, 118, 128, .12); --fill2: rgba(118, 118, 128, .2); --sep: rgba(60, 60, 67, .16); --rim: rgba(0, 0, 0, .08);
    --fg: #000; --dim: rgba(60, 60, 67, .6); --faint: rgba(60, 60, 67, .3);
    --accent: #007aff; --accent-hi: #0062cc; --ok: #34c759; --err: #ff3b30; --warn: #8a6100; --warn-bg: rgba(255, 204, 0, .18);
    --sel: #007aff; --hov: #32ade6; --shadow: 0 24px 70px rgba(0, 0, 0, .18), 0 2px 8px rgba(0, 0, 0, .08);
    --thumb: rgba(0, 0, 0, .28);
  }
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
.tabs, .scope { display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; gap: 2px; padding: 2px; border-radius: 10px; background: var(--fill); }
.tabs { margin: 0 14px 4px; }
.scope { margin: 10px 0 0; }
.tabs button, .scope button { border: 0; background: none; padding: 6px 6px; border-radius: 8px; color: var(--fg); font-size: 13px; font-weight: 500;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; transition: background .15s; }
.tabs button.on, .scope button.on { background: var(--cell-on); font-weight: 600; box-shadow: 0 3px 8px rgba(0, 0, 0, .12), 0 3px 1px rgba(0, 0, 0, .04); }
.tabs b { background: var(--accent); color: #fff; border-radius: 99px; padding: 1px 6px; font-size: 10.5px; font-weight: 700; margin-left: 3px; }
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

/* slim scrollbars, dark like iOS */
.panel, .panel * { scrollbar-width: thin; scrollbar-color: var(--thumb) transparent; }
.panel ::-webkit-scrollbar { width: 8px; height: 8px; }
.panel ::-webkit-scrollbar-track { background: transparent; }
.panel ::-webkit-scrollbar-thumb { background: var(--thumb); border-radius: 8px; border: 2px solid transparent; background-clip: padding-box; }
`;(()=>{if(window.__designInside)return;window.__designInside=!0;let i="/__em/",I=[{name:"System UI",css:'system-ui, -apple-system, "Segoe UI", sans-serif',google:!1},{name:"Inter",css:'"Inter", system-ui, sans-serif'},{name:"DM Sans",css:'"DM Sans", system-ui, sans-serif'},{name:"Manrope",css:'"Manrope", system-ui, sans-serif'},{name:"Space Grotesk",css:'"Space Grotesk", system-ui, sans-serif'},{name:"Bricolage Grotesque",css:'"Bricolage Grotesque", system-ui, sans-serif'},{name:"Syne",css:'"Syne", system-ui, sans-serif'},{name:"Playfair Display",css:'"Playfair Display", Georgia, serif'},{name:"Fraunces",css:'"Fraunces", Georgia, serif'},{name:"Lora",css:'"Lora", Georgia, serif'},{name:"JetBrains Mono",css:'"JetBrains Mono", ui-monospace, monospace'},{name:"IBM Plex Mono",css:'"IBM Plex Mono", ui-monospace, monospace'}],D=/:(hover|focus|focus-visible|focus-within|active|visited|target|checked)\b/,F="design-inside:state",a={on:!1,hover:null,sel:null,scope:"this",pending:[],status:{git:!0,mode:"static"},editing:null,tab:"style"},O=document.createElement("design-inside-root");O.style.cssText="all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;";let A=O.attachShadow({mode:"open"});A.innerHTML=`<style>${Xe}</style>
    <div class="hl hover" hidden><span class="tag"></span></div>
    <div class="hl selected" hidden><span class="tag"></span></div>
    <div class="dock">
      <button class="pill" title="design-inside (Alt+E)"><span class="dot"></span><span class="pill-label">Edit page</span><kbd>Alt E</kbd></button>
    </div>
    <aside class="panel" hidden></aside>
    <div class="toasts"></div>`;let j=e=>A.querySelector(e),Je=j(".hl.hover"),Ze=j(".hl.selected"),b=j(".panel"),ie=j(".pill"),X=e=>e.composedPath().includes(O),Se=()=>document.documentElement.appendChild(O);document.body?Se():document.addEventListener("DOMContentLoaded",Se);let x=e=>String(e).replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t]);async function N(e,t){let n=await fetch(i+e,t?{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(t)}:{}),o=await n.json().catch(()=>({error:`HTTP ${n.status}`}));if(!n.ok)throw Object.assign(new Error(o.error||`HTTP ${n.status}`),{data:o,status:n.status});return o}let T=e=>{let t=e&&e.getAttribute&&e.getAttribute("data-em");if(!t)return null;let n=t.lastIndexOf("#");return{file:t.slice(0,n),path:t.slice(n+1),tag:e.tagName.toLowerCase()}},Qe=()=>{let e=document.querySelector("[data-em]");return e?T(e).file:null};function J(e){let t=e&&e.match(/rgba?\(([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?/);return t?t[4]!==void 0&&Number(t[4])===0?"":"#"+[t[1],t[2],t[3]].map(n=>Math.round(+n).toString(16).padStart(2,"0")).join(""):e&&e.startsWith("#")?e:""}let et=e=>/^-?\d+(\.\d+)?$/.test(String(e).trim())?`${e}px`:String(e).trim();function W(e){let t=e.tagName.toLowerCase(),n=e.id?`#${e.id}`:"",o=[...e.classList].filter(s=>!s.includes(":")).slice(0,2).map(s=>`.${s}`).join("");return`${t}${n}${o}`}function Ee(e){let t=[];for(let n=e;n&&n.nodeType===1&&n!==document.documentElement;n=n.parentElement){if(n.id){t.unshift(`#${CSS.escape(n.id)}`);break}let o=n.parentElement?[...n.parentElement.children].filter(s=>s.tagName===n.tagName):[];t.unshift(n.tagName.toLowerCase()+(o.length>1?`:nth-of-type(${o.indexOf(n)+1})`:""))}return t.join(" > ")}let tt=()=>!!document.querySelector('script[src*="tailwindcss"], style[data-vite-dev-id*="tailwind"]')||getComputedStyle(document.documentElement).getPropertyValue("--tw-ring-offset-width")!==""||getComputedStyle(document.body).getPropertyValue("--tw-border-spacing-x")!=="",Le=e=>tt()&&Ve(e.getAttribute("class")||"");function nt(e){let t=e.ownerNode;if(t&&t.tagName==="STYLE"){let n=T(t);if(n)return{file:n.file,path:n.path,label:`<style> in ${n.file}`};let o=t.getAttribute("data-vite-dev-id");return o&&/\.css(\?|$)/.test(o)?{viteId:o,label:o.split("/").slice(-2).join("/")}:null}if(e.href)try{let n=new URL(e.href);return n.host!==location.host?null:{href:e.href,label:n.pathname.replace(/^\//,"")}}catch{return null}return null}function le(){let e=[],t=0,n=(s,r,c,d)=>{for(let l of s){if(l instanceof CSSImportRule){l.styleSheet&&o(l.styleSheet);continue}if(l instanceof CSSStyleRule){let m=Ke(l.selectorText,c),f=d[m]=(d[m]??-1)+1;e.push({rule:l,ref:r,conds:c,occurrence:f,order:t++});continue}let g=null;window.CSSMediaRule&&l instanceof CSSMediaRule?g={type:"media",text:l.conditionText||l.media.mediaText}:window.CSSSupportsRule&&l instanceof CSSSupportsRule?g={type:"supports",text:l.conditionText}:window.CSSLayerBlockRule&&l instanceof CSSLayerBlockRule?g={type:"layer",text:l.name}:window.CSSContainerRule&&l instanceof CSSContainerRule&&(g={type:"container",text:l.conditionText}),g&&l.cssRules&&n(l.cssRules,r,[...c,g],d)}},o=s=>{if(s.ownerNode&&O.contains(s.ownerNode))return;let r;try{r=s.cssRules}catch{return}n(r,nt(s),[],{})};for(let s of document.styleSheets)o(s);return e}let at=e=>e.type==="media"?matchMedia(e.text).matches:e.type==="supports"?CSS.supports(e.text):!0;function ot(e){let t=[],n=0,o="";for(let s of e)(s==="("||s==="[")&&n++,(s===")"||s==="]")&&n--,s===","&&!n?(t.push(o.trim()),o=""):o+=s;return o.trim()&&t.push(o.trim()),t}function rt(e){let t=e.replace(/:(not|is|has)\(([^)]*)\)/g," $2").replace(/:where\([^)]*\)/g,"").replace(/\[[^\]]*\]/g," .attr"),n=(t.match(/#[\w-]+/g)||[]).length,o=(t.match(/\.[\w-]+|:(?!:)[\w-]+/g)||[]).length,s=(t.replace(/::?[\w-]+/g,r=>r.startsWith("::")?" X":"").match(/(^|[\s>+~])[a-zA-Z][\w-]*/g)||[]).length;return n*1e4+o*100+s}function Z(e){let t=[];for(let n of le()){if(!n.conds.every(at))continue;let o=-1,s=null;for(let r of ot(n.rule.selectorText))if(!(D.test(r)||/::/.test(r)))try{if(e.matches(r)){let c=rt(r);c>o&&(o=c,s=r)}}catch{}s&&t.push({...n,spec:o,branch:s})}return t}function ce(e,t){let n=null;for(let o of e){let s=o.rule.style.getPropertyValue(t)||Ce[t]&&o.rule.style.getPropertyValue(Ce[t]);if(!s)continue;let c=[o.rule.style.getPropertyPriority(t)==="important"?1:0,o.spec,o.order];(!n||st(c,n.score)>0)&&(n={...o,score:c,value:s.trim()})}return n}let Ce={"background-color":"background"},st=(e,t)=>e[0]-t[0]||e[1]-t[1]||e[2]-t[2],Te=(e,t)=>!!e.style.getPropertyValue(t);function de(e){let t=[...e.classList].filter(n=>/^[a-zA-Z_][\w-]*$/.test(n));return t.length?"."+t.map(n=>CSS.escape(n)).join("."):null}function it(e){for(let t=e.length-1;t>=0;t--)if(e[t].ref&&!e[t].conds.length)return e[t].ref;for(let t of le())if(t.ref)return t.ref;return null}function lt(e,t,n,o){let s=T(e),r=Z(e),c=Le(e)&&Ye(t),d=e.getAttribute("class")||"";if(o==="this"){if(c){let y=se(d,t,n);return s?{change:{kind:"class",loc:s,oldClass:d,newClass:y},where:`class on this <${s.tag}> in ${s.file}`,affected:[e]}:{change:{kind:"class-search",oldClass:d,newClass:y},where:"its Tailwind classes (found by search)",affected:[e]}}let f=Te(e,t)?null:ce(r,t);if(f&&f.ref){let y=[...document.querySelectorAll(f.branch)];if(y.length===1&&y[0]===e)return{change:{kind:"css-rule",sheet:f.ref,selector:f.rule.selectorText,conditions:f.conds,occurrence:f.occurrence,prop:t,value:n},where:`rule ${f.rule.selectorText} in ${f.ref.label} (only this element uses it)`,affected:[e]}}return s?{change:{kind:"inline",loc:s,prop:t,value:n},where:`inline style on this <${s.tag}> in ${s.file}`,affected:[e]}:{fallback:"This element is rendered by a framework and has no source mapping, so only your AI agent can place a one-off style safely.",affected:[e]}}if(c){let f=[...document.querySelectorAll("[class]")].filter(v=>v.getAttribute("class")===d),y=se(d,t,n);return f.every(T)?{changes:f.map(v=>({kind:"class",loc:T(v),oldClass:d,newClass:y})),where:`Tailwind classes on ${f.length} matching element${f.length>1?"s":""}`,affected:f}:{change:{kind:"class-search",oldClass:d,newClass:y},where:"the component's Tailwind classes (found by search)",affected:f}}let l=Te(e,t)?null:ce(r,t);if(l&&l.ref){let f=l.value.match(/^var\((--[\w-]+)\)$/),y=[...document.querySelectorAll(l.branch)];return f&&a.linkVars?{change:{kind:"css-var",sheets:[...new Map(le().filter(L=>L.ref).map(L=>[JSON.stringify(L.ref),L.ref])).values()],name:f[1],value:n},where:`theme variable ${f[1]} (everything that uses it)`,affected:[],varName:f[1]}:{change:{kind:"css-rule",sheet:l.ref,selector:l.rule.selectorText,conditions:l.conds,occurrence:l.occurrence,prop:t,value:n},where:`rule ${l.rule.selectorText}${l.conds.length?` (@${l.conds.map(v=>v.type+" "+v.text).join(" ")})`:""} in ${l.ref.label}`,affected:y,varName:f&&f[1]}}let g=de(e),m=it(r);return g&&m?{change:{kind:"css-new-rule",sheet:m,selector:g,prop:t,value:n},where:`${g} in ${m.label}`,affected:[...document.querySelectorAll(g)]}:{fallback:"No stylesheet rule to edit for this element.",affected:[e]}}function ct(e){for(let t of e.affected)e.preview.push([t,e.prop,t.style.getPropertyValue(e.prop),t.style.getPropertyPriority(e.prop)]),t.style.setProperty(e.prop,e.value,"important");if(e.change&&e.change.kind==="css-var"){let t=document.documentElement;e.preview.push([t,e.change.name,t.style.getPropertyValue(e.change.name),""]),t.style.setProperty(e.change.name,e.value)}}function Q(e){for(let[t,n,o,s]of e.preview.reverse())o?t.style.setProperty(n,o,s):t.style.removeProperty(n),t.getAttribute("style")===""&&t.removeAttribute("style");e.preview=[]}function $(e,t,n){let o=a.sel;if(!o)return;let s=a.pending.find(d=>d.prop===e&&d.el===o);if(s&&(Q(s),a.pending.splice(a.pending.indexOf(s),1)),t===null){M();return}let r=lt(o,e,t,a.scope),c={el:o,prop:e,value:t,label:n||`${e}: ${t}`,preview:[],...r};ct(c),a.pending.push(c),M(),S()}function Ae(){let e=a.pending.filter(t=>t.prop);for(let t of e)Q(t),a.pending.splice(a.pending.indexOf(t),1);for(let t of e)a.sel=t.el,$(t.prop,t.value,t.label)}async function ze(){if(!a.pending.length)return;let e=a.pending.filter(r=>r.fallback),t=a.pending.filter(r=>!r.fallback),n=[];for(let r of t){let c=W(r.el),d=r.change&&r.change.kind==="css-var"?` (theme ${r.change.name})`:r.change&&/css-/.test(r.change.kind)?` (${r.change.selector} in ${r.change.sheet.label})`:r.changes?` (${r.changes.length} elements)`:"";for(let l of r.changes||[r.change])n.push({prop:r.prop,value:r.value,...l,label:r.kind==="text"||r.kind==="image"?r.label:`${c} ${r.label}${d}`});if(r.prop==="font-family"){let l=I.find(g=>g.css===r.value);l&&l.google!==!1&&n.unshift({kind:"font-link",file:Qe()||"index.html",family:l.name,optional:!0,label:`load ${l.name}`})}}if(e.length){for(let r of e)await ue(`set ${r.prop} to ${r.value} on ${a.scope==="all"?"all elements like":"this"} ${W(r.el)}`,r.el,r.fallback,!0);e.forEach(r=>{a.pending.splice(a.pending.indexOf(r),1)})}if(!n.length){M();return}let o=[],s=new Map;for(let r of n){if(r.kind!=="class"&&r.kind!=="class-search"){o.push(r);continue}let c=r.kind==="class"?`${r.loc.file}#${r.loc.path}`:`search:${r.oldClass}`,d=s.get(c);if(!d){s.set(c,r),o.push(r);continue}d.newClass=se(d.newClass,r.prop,r.value),d.label+=`; ${r.prop}: ${r.value}`}n.length=0,n.push(...o),re(!0);try{let r=await N("apply",{pageUrl:location.href,changes:n});if(r.noop){w("Nothing changed in the files."),ee();return}B({toast:{text:`Saved ${r.sha} \xB7 ${r.message}`,sha:r.sha,files:r.files},reselect:r.reload&&r.reload.path}),location.reload()}catch(r){re(!1);let c=n.map(d=>d.label).join("; ");w(r.message,{kind:"error",actions:r.data&&r.data.fallback?[{label:"Hand to AI",run:()=>ue(c,a.sel,r.message)}]:[]})}}function ee(){for(let e of a.pending)Q(e),e.undoPreview&&e.undoPreview();a.pending=[],M(),a.sel&&E(),S()}async function pe(e){try{let t=await N("undo",e?{sha:e}:{});B({toast:{text:`Undid ${t.reverted}`}}),location.reload()}catch(t){w(t.message,{kind:"error"})}}async function ue(e,t,n,o){let s=t||a.sel,r={};if(s){let c=getComputedStyle(s);for(let d of["color","background-color","font-family","font-size","font-weight","width","height","padding","margin","border-radius","display"])r[d]=c.getPropertyValue(d)}try{let c=await N("ask",{request:e,reason:n,pageUrl:location.href,loc:s&&T(s),selector:s?Ee(s):"page",html:s?s.outerHTML.replace(/ data-em="[^"]*"/g,""):"",rules:s?Z(s).map(d=>d.rule.selectorText).slice(-6):[],styles:r});a.status.pending=(a.status.pending||0)+1,w(`${o?"Couldn't do this directly, so it's queued":"Queued"} for your AI agent: \u201C${e}\u201D. Ask it to apply .design-inside/requests.md (Claude Code: /design-inside:apply), or copy the prompt into any AI chat.`,{actions:[{label:"Copy prompt",run:()=>navigator.clipboard.writeText(c.prompt).then(()=>w("Prompt copied"))}]}),xe()}catch(c){w(c.message,{kind:"error"})}}function Me(e,t){if(!t||!t.isConnected){e.hidden=!0;return}let n=t.getBoundingClientRect();e.hidden=!1,Object.assign(e.style,{left:`${n.left}px`,top:`${n.top}px`,width:`${n.width}px`,height:`${n.height}px`});let o=e.querySelector(".tag");o.textContent=`${W(t)}  ${Math.round(n.width)}\xD7${Math.round(n.height)}`,o.classList.toggle("below",n.top<24)}let Pe="design-inside:layout",te={dock:"auto",w:312,h:560,x:null,y:null,min:!1};a.layout=(()=>{try{return{...te,...JSON.parse(localStorage.getItem(Pe)||"{}")}}catch{return{...te}}})();let Y=()=>{try{localStorage.setItem(Pe,JSON.stringify(a.layout))}catch{}},C=(e,t,n)=>Math.max(t,Math.min(n,e)),ge=236;function U(){let e=a.layout,t=12,n=b.style,o=C(e.w,ge,Math.max(ge,innerWidth-2*t)),s=C(e.h,200,Math.max(200,innerHeight-2*t));n.left=n.right=n.top=n.bottom=n.transform=n.height="",n.width=`${o}px`,b.classList.toggle("min",!!e.min),b.dataset.dock=e.dock;let r=e.dock==="left"||e.dock==="auto"&&a.autoLeft?"left":"right";b.classList.toggle("anchor-right",["auto","right"].includes(e.dock)&&r==="right"),["auto","left","right"].includes(e.dock)?(n.top=`${t}px`,n[r]=`${t}px`,e.min||(n.bottom=`${t}px`)):e.dock==="top"?(n.top=`${t}px`,n.left="50%",n.transform="translateX(-50%)",e.min||(n.height=`${s}px`)):e.dock==="center"?(n.top="50%",n.left="50%",n.transform="translate(-50%, -50%)",e.min||(n.height=`${s}px`)):(n.left=`${C(e.x??innerWidth-o-t,0,Math.max(0,innerWidth-o))}px`,n.top=`${C(e.y??t,0,Math.max(0,innerHeight-48))}px`,e.min||(n.height=`${Math.min(s,innerHeight-C(e.y??t,0,innerHeight-48)-t)}px`))}function dt(){if(!(!a.sel||b.hidden)){if(a.layout.dock==="auto"){let e=a.sel.getBoundingClientRect(),t=a.layout.w+24;a.autoLeft=e.right>innerWidth-t&&e.left>t}U()}}b.addEventListener("dblclick",e=>{!e.target.closest("header")||e.target.closest("button, input, select, textarea")||(a.layout={...te},Y(),E(),U())}),b.addEventListener("pointerdown",e=>{let t=e.target.closest(".edge"),n=e.target.closest(".edge-b"),o=e.target.closest(".grip")||t||n,s=!o&&e.target.closest("header")&&!e.target.closest("button, input, select, textarea");if(!o&&!s)return;e.preventDefault();let r=b.getBoundingClientRect(),c={x:e.clientX,y:e.clientY,left:r.left,top:r.top,w:r.width,h:r.height},d=b.classList.contains("anchor-right"),l=!1,g=()=>{l=!0,s&&Object.assign(a.layout,{dock:"free",x:r.left,y:r.top,w:r.width,h:a.layout.min?a.layout.h:r.height}),b.classList.add(s?"dragging":n?"resizing-b":"resizing")};s||g();let m=y=>{let v=y.clientX-c.x,L=y.clientY-c.y;if(!l){if(Math.hypot(v,L)<4)return;g()}s?(a.layout.x=c.left+v,a.layout.y=c.top+L):(n||(a.layout.w=C(c.w+(d?-v:v),ge,innerWidth-24)),!t&&!["auto","left","right"].includes(a.layout.dock)&&(a.layout.h=C(c.h+L,200,innerHeight-24))),U()},f=()=>{removeEventListener("pointermove",m,!0),removeEventListener("pointerup",f,!0),removeEventListener("pointercancel",f,!0),b.classList.remove("dragging","resizing","resizing-b"),l&&Y()};addEventListener("pointermove",m,!0),addEventListener("pointerup",f,!0),addEventListener("pointercancel",f,!0)});function S(){if(dt(),Me(Je,a.on&&a.hover&&a.hover!==a.sel?a.hover:null),Me(Ze,a.on?a.sel:null),A.querySelectorAll(".hl.affected").forEach(t=>t.remove()),a.on&&a.sel&&a.scope==="all"){let t=de(a.sel),n=t?[...document.querySelectorAll(t)].filter(o=>o!==a.sel).slice(0,40):[];for(let o of n){let s=document.createElement("div");s.className="hl affected";let r=o.getBoundingClientRect();Object.assign(s.style,{left:`${r.left}px`,top:`${r.top}px`,width:`${r.width}px`,height:`${r.height}px`}),A.insertBefore(s,b)}}}addEventListener("scroll",S,!0),addEventListener("resize",S);function q(e){a.editing&&Re(),e!==a.sel&&(a.tab="style"),a.sel=e,a.scope="this",E(),S()}let fe=e=>{let t=e.target;return t&&t.nodeType===1&&t!==document.documentElement&&t!==document.body?t:null};document.addEventListener("mousemove",e=>{if(!a.on||X(e)){a.hover&&(a.hover=null,S());return}let t=fe(e);t!==a.hover&&(a.hover=t,S())},!0);let pt=e=>{!a.on||X(e)||a.editing&&a.editing.el.contains(e.target)||(e.preventDefault(),e.stopPropagation())};for(let e of["mousedown","mouseup","pointerdown","pointerup","submit","auxclick"])document.addEventListener(e,pt,!0);document.addEventListener("click",e=>{if(!a.on||X(e)||a.editing&&a.editing.el.contains(e.target))return;e.preventDefault(),e.stopPropagation();let t=fe(e);t&&q(t)},!0),document.addEventListener("dblclick",e=>{if(!a.on||X(e))return;e.preventDefault(),e.stopPropagation();let t=fe(e);t&&gt(t)},!0);let he=e=>e.childNodes.length>0&&[...e.childNodes].every(t=>t.nodeType===3)&&e.textContent.trim().length>0,Ie=new Set(["img","video","svg","picture","canvas","iframe"]),Oe=new Set(["input","textarea","select"]);function ut(e,t){let n=e.tagName.toLowerCase(),o=Ie.has(n),s=he(e),r=!o&&(Oe.has(n)||e.textContent.trim().length>0),c=!o&&t.display==="inline",d=o?{img:"Image",video:"Video",svg:"Icon",picture:"Image",canvas:"Canvas",iframe:"Embed"}[n]:/^h[1-6]$/.test(n)?"Heading":n==="button"||e.getAttribute("role")==="button"||n==="a"&&/\bbtn|button\b/i.test(e.className)?"Button":n==="a"?"Link":n==="p"?"Paragraph":Oe.has(n)?"Field":n==="li"?"List item":s?"Text":/^(section|header|footer|main|nav|aside)$/.test(n)?"Section":"Box";return{tag:n,media:o,leaf:s,hasText:r,inline:c,label:d,container:!s&&!o&&e.children.length>0}}function gt(e){if(!he(e)){if(![...e.querySelectorAll("*")].find(he)||e.textContent.trim().length===0){w("Double-click directly on a piece of text to edit it.");return}if(e.children.length){w("This text contains other elements (links, bold\u2026). Edit each part separately, or ask AI."),q(e);return}}q(e),a.editing={el:e,before:e.textContent},e.setAttribute("contenteditable","plaintext-only"),e.contentEditable!=="plaintext-only"&&e.setAttribute("contenteditable","true"),e.classList.add("em-editing"),e.style.setProperty("outline","none","important"),e.focus();let t=document.createRange();t.selectNodeContents(e);let n=getSelection();n.removeAllRanges(),n.addRange(t),e.addEventListener("keydown",je,!0),e.addEventListener("blur",Re,{once:!0})}function je(e){e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),a.editing.el.blur()),e.key==="Escape"&&(e.preventDefault(),a.editing.el.textContent=a.editing.before,a.editing.el.blur()),e.stopPropagation()}function Re(){let e=a.editing;if(!e)return;a.editing=null;let t=e.el;t.removeAttribute("contenteditable"),t.classList.remove("em-editing"),t.style.removeProperty("outline"),t.getAttribute("style")||t.removeAttribute("style"),t.getAttribute("class")||t.removeAttribute("class"),t.removeEventListener("keydown",je,!0),Ne(t,e.before,t.textContent)}function Ne(e,t,n){let o=n.replace(/\s+/g," ").trim(),s={before:t};if(a.pending=a.pending.filter(l=>!(l.kind==="text"&&l.el===e)),o===t.replace(/\s+/g," ").trim()){e.textContent=t,M(),S();return}let r=T(e),c=l=>l.length>40?l.slice(0,37)+"\u2026":l,d={el:e,kind:"text",before:t,label:`text \u201C${c(s.before.trim())}\u201D \u2192 \u201C${c(o)}\u201D`,preview:[],affected:[],change:r?{kind:"text",loc:r,oldText:s.before,newText:o}:{kind:"text-search",oldText:s.before.trim(),newText:o},where:r?`text of this <${r.tag}> in ${r.file}`:"source file containing this exact text (found by search)",undoPreview:()=>{e.textContent=s.before}};e.textContent=o,a.pending.push(d),M(),S()}function z(e,t){let n=e.style.getPropertyValue(t);if(n)return n;let o=ce(Z(e),t);return o?o.value:""}function E(){let e=a.sel;if(!e||!a.on){b.hidden=!0;return}b.hidden=!1;let t=getComputedStyle(e),n=T(e),o=de(e),s=Z(e),r=o?document.querySelectorAll(o).length:1,c=Le(e),d=t.fontFamily.split(",")[0].replace(/["']/g,"").trim(),l=z(e,"background-color"),g=z(e,"color"),m=p=>(p.match(/^var\((--[\w-]+)\)$/)||[])[1],f=e.parentElement,y=f?[...f.children].filter(p=>p!==O):[],v=y.indexOf(e),L=/flex|grid/.test(t.display),u=ut(e,t);b.innerHTML=`
      <header title="Drag to move \xB7 double-click to put the panel back">
        <div class="crumb">
          ${e.parentElement&&e.parentElement!==document.body?'<button class="ghost up" title="Select parent">\u2196</button>':""}
          <div>
            <div class="name"><span class="kind">${x(u.label)}</span> <span class="sel-name">${x(W(e))}</span></div>
            <div class="src">${n?`${x(n.file)} \xB7 source-mapped`:c?"Tailwind \xB7 found by search":"rendered by your framework"}</div>
          </div>
        </div>
        <div class="hd-actions">
          <button class="ghost layout-btn ${a.layoutOpen?"on":""}" title="Move or resize this panel">\u21F1</button>
          <button class="ghost min-btn" title="${a.layout.min?"Expand":"Collapse"} this panel">${a.layout.min?"\u25A2":"\u2013"}</button>
          <button class="ghost close" title="Close (Esc)">\u2715</button>
        </div>
      </header>
      ${a.layoutOpen?`<div class="layout-row">
        <div class="seg">${[["left","\u25E7 Left"],["top","\u2B12 Top"],["center","\u25A3 Center"],["right","\u25E8 Right"]].map(([p,h])=>`<button data-dock="${p}" class="${a.layout.dock===p?"on":""}">${h}</button>`).join("")}</div>
        <button class="mini reset-layout" title="Back to the default position and size">Reset</button>
        <p class="hint">Or drag this top bar to put the panel anywhere, and double-click it to put the panel back. Drag a blue edge or the corner to resize it.</p>
      </div>`:""}
      <nav class="tabs">
        <button data-tab="style" class="${a.tab==="style"?"on":""}">Design</button>
        <button data-tab="claude" class="${a.tab==="claude"?"on":""}">Ask AI${a.status.pending?` <b>${a.status.pending}</b>`:""}</button>
        <button data-tab="history" class="${a.tab==="history"?"on":""}">History</button>
      </nav>
      ${a.status.git?"":`<div class="warn">Undo needs git, and this folder isn't a repository yet. <button class="mini gitinit">Turn on undo</button></div>`}
      <div class="body">
      ${a.tab==="style"?`
        ${r>1||c?`<div class="scope">
          <button data-scope="this" class="${a.scope==="this"?"on":""}">Just this one</button>
          <button data-scope="all" class="${a.scope==="all"?"on":""}">All ${r} ${x(o||"like it")}</button>
        </div>`:""}
        ${u.leaf?`<section>
          <h4>Text</h4>
          <textarea class="txt" data-text rows="${Math.min(4,Math.ceil(e.textContent.trim().length/32)||1)}" spellcheck="true">${x(e.textContent.replace(/\s+/g," ").trim())}</textarea>
          <p class="hint">Press Enter or click away to apply. You can also double-click the text on the page.</p>
        </section>`:u.hasText&&u.container?`<section>
          <h4>Text</h4>
          <p class="hint">This ${x(u.label.toLowerCase())} holds several pieces of text. Click one to rewrite it, or use \u2196 to go up a level.</p>
        </section>`:""}
        ${u.hasText?`<section>
          <h4>${u.container?"Text inside":"Font & color"}</h4>
          ${u.container?'<p class="hint">Changes the text style of everything inside, unless a piece sets its own.</p>':""}
          <label class="row"><span>Font</span><select data-prop="font-family">${I.map(p=>`<option value="${x(p.name)}" ${p.name===d?"selected":""}>${x(p.name)}</option>`).join("")}${I.some(p=>p.name===d)?"":`<option selected disabled>${x(d)}</option>`}</select></label>
          <div class="grid2">
            <label class="row"><span>Size</span><input data-prop="font-size" value="${x(z(e,"font-size")||t.fontSize)}"></label>
            <label class="row"><span>Weight</span><select data-prop="font-weight">${[300,400,500,600,700,800].map(p=>`<option ${String(p)===t.fontWeight?"selected":""}>${p}</option>`).join("")}</select></label>
          </div>
          <label class="row"><span>Color</span>${Ue("color",J(t.color),m(g))}</label>
          <div class="row"><span>Align</span><div class="seg">${["left","center","right"].map(p=>`<button data-align="${p}" class="${t.textAlign===p||p==="left"&&t.textAlign==="start"?"on":""}">${{left:"\u21E4",center:"\u2194",right:"\u21E5"}[p]}</button>`).join("")}</div></div>
        </section>`:""}
        <section>
          <h4>${u.media?"Shape":"Fill & shape"}</h4>
          ${u.media?"":`<label class="row"><span>Background</span>${Ue("background-color",J(t.backgroundColor),m(l))}</label>`}
          ${!u.media&&n?'<div class="row"><span>Image</span><button class="mini pick-image" data-target="bg-image" title="Choose a background image">Choose\u2026</button></div>':""}
          <label class="row"><span>Corners</span><input data-prop="border-radius" value="${x(z(e,"border-radius")||t.borderRadius)}"></label>
        </section>
        <section>
          <h4>Size & spacing</h4>
          ${u.inline?`<p class="hint">Width and height don't apply to text that flows inside a line. Use \u2196 to size the box around it.</p>`:""}
          <div class="grid2">
            ${u.inline?"":`<label class="row"><span>Width</span><input data-prop="width" value="${x(z(e,"width")||Math.round(e.getBoundingClientRect().width)+"px")}"></label>
            <label class="row"><span>Height</span><input data-prop="height" value="${x(z(e,"height")||Math.round(e.getBoundingClientRect().height)+"px")}"></label>`}
            ${u.media?"":`<label class="row"><span>Padding</span><input data-prop="padding" value="${x(z(e,"padding")||t.padding)}"></label>`}
            <label class="row"><span>Margin</span><input data-prop="margin" value="${x(z(e,"margin")||t.margin)}"></label>
            ${L?`<label class="row"><span>Gap</span><input data-prop="gap" value="${x(z(e,"gap")||t.gap)}"></label>`:""}
          </div>
          ${u.media?`<label class="check"><input type="checkbox" class="keepratio" ${a.keepRatio!==!1?"checked":""}> Keep proportions</label>`:""}
        </section>
        ${u.tag==="img"?`<section><h4>Image</h4>${n?'<button class="mini pick-image" data-target="img-src">Replace image\u2026</button>':'<p class="hint">This image is rendered by your framework. Ask AI to replace it.</p>'}<p class="hint">PNG, JPEG, WebP, GIF or AVIF, up to 5 MB. You crop it before anything is saved.</p></section>`:""}
        ${ht(e,t,u)}
        <section>
          <h4>Position</h4>
          <div class="row"><span>Order</span>
            <div class="seg">
              <button class="move" data-dir="up" ${v<=0||!n?"disabled":""} title="Move before the previous item">\u2191 Earlier</button>
              <button class="move" data-dir="down" ${v<0||v>=y.length-1||!n?"disabled":""} title="Move after the next item">\u2193 Later</button>
            </div>
          </div>
          ${n?"":'<p class="hint">Reordering needs a source-mapped page. Ask AI instead.</p>'}
        </section>
      `:a.tab==="claude"?`
        <section>
          <h4>Describe a change</h4>
          <p class="hint">For anything the panel can't do (layout, new sections, hover effects, React components). It's queued in <code>.design-inside/requests.md</code> with this element's source location and styles. Then ask your AI coding agent (Claude Code, Gemini CLI, Codex, Cursor\u2026) to "apply .design-inside/requests.md"; in Claude Code that's <code>/design-inside:apply</code>.</p>
          <textarea class="ask" placeholder="e.g. make this card's image zoom slightly on hover"></textarea>
          <button class="primary send">Queue for AI</button>
        </section>
      `:'<section class="history"><h4>Recent commits</h4><div class="hist">Loading\u2026</div></section>'}
      </div>
      <footer class="pending"></footer>
      <div class="edge" title="Drag to make the panel wider or narrower"></div>
      <div class="edge-b" title="Drag to make the panel taller or shorter"></div>
      <div class="grip" title="Drag to resize"></div>`,a.tab==="history"&&kt(),M()}let ne={none:["None","none"],soft:["Soft","0 2px 8px rgba(15, 23, 42, 0.08)"],medium:["Medium","0 8px 24px rgba(15, 23, 42, 0.14)"],strong:["Strong","0 20px 48px rgba(15, 23, 42, 0.24)"],glow:["Glow","0 0 0 4px rgba(139, 123, 255, 0.25), 0 8px 30px rgba(139, 123, 255, 0.35)"]},qe=[["grayscale","Grayscale",0,100,0],["brightness","Brightness",0,200,100],["contrast","Contrast",0,200,100],["saturate","Saturation",0,200,100]],ae=null;function ft(e){if(e.boxShadow==="none")return"none";if(!ae){let t=document.createElement("div");t.style.cssText="position:fixed;visibility:hidden;pointer-events:none",A.appendChild(t),ae=Object.fromEntries(Object.entries(ne).map(([n,[,o]])=>(t.style.boxShadow=o,[n,getComputedStyle(t).boxShadow]))),t.remove()}return Object.keys(ae).find(t=>ae[t]===e.boxShadow)||"custom"}function ht(e,t,n){if(n.inline)return"";let o=ft(t),s=Math.round(parseFloat(t.opacity)*100),r=(d,l,g)=>`<span class="range"><input type="range" min="0" max="${g}" step="5" ${d} value="${l}" style="--p: ${l/g*100}%"><output>${l}%</output></span>`,c=`
      <label class="row"><span>Shadow</span><select data-fx="shadow">${o==="custom"?"<option selected disabled>Custom</option>":""}${Object.entries(ne).map(([d,[l]])=>`<option value="${d}" ${d===o?"selected":""}>${l}</option>`).join("")}</select></label>
      <label class="row"><span>Opacity</span>${r('data-fx="opacity"',s,100)}</label>`;if(n.media){let d={};for(let[l,,,,g]of qe){let m=t.filter.match(new RegExp(`${l}\\(([\\d.]+)(%?)\\)`));d[l]=m?Math.round(m[2]?+m[1]:+m[1]*100):g}c+=qe.map(([l,g,,m,f])=>`<label class="row"><span>${g}</span>${r(`data-fx="filter" data-f="${l}" data-default="${f}"`,d[l],m)}</label>`).join("")}else{let d=/gradient\(/.test(t.backgroundImage);c+=`
      <div class="row"><span>Gradient</span><span class="grad">
        <input type="color" data-fx="grad-a" value="${J(t.backgroundColor)||"#ffffff"}" title="From">
        <input type="color" data-fx="grad-b" value="#8b7bff" title="To">
        <select data-fx="grad-angle" title="Direction">${[[180,"\u2193"],[135,"\u2198"],[90,"\u2192"],[45,"\u2197"],[0,"\u2191"]].map(([l,g])=>`<option value="${l}" ${l===135?"selected":""}>${g}</option>`).join("")}</select>
        <button class="mini" data-fx-apply="gradient">Apply</button>${d?'<button class="mini" data-fx-apply="no-gradient">Remove</button>':""}
      </span></div>
      <div class="row"><span>Border</span><span class="border"><input data-fx="border-w" value="${Math.round(parseFloat(t.borderTopWidth)||0)}" title="Width in px"><input type="color" data-fx="border-c" value="${J(t.borderTopColor)||"#000000"}" title="Color"></span></div>
      <label class="check"><input type="checkbox" data-fx="glass" ${t.backdropFilter&&t.backdropFilter!=="none"?"checked":""}> Glass blur behind it</label>`}return`<section><h4>Effects</h4>${c}</section>`}function Be(e,t){let n=e.dataset&&e.dataset.fx;if(!n)return!1;let o=e.nextElementSibling&&e.nextElementSibling.tagName==="OUTPUT"?e.nextElementSibling:null;if(o&&(o.textContent=`${e.value}%`,e.style.setProperty("--p",`${e.value/e.max*100}%`)),n==="shadow"&&!t)$("box-shadow",ne[e.value][1],`shadow \u2192 ${ne[e.value][0]}`);else if(n==="opacity")$("opacity",String(+e.value/100),`opacity \u2192 ${e.value}%`);else if(n==="filter"){let r=[...b.querySelectorAll('[data-fx="filter"]')].filter(c=>+c.value!=+c.dataset.default).map(c=>`${c.dataset.f}(${c.value}%)`).join(" ")||"none";$("filter",r,`filter \u2192 ${r}`)}else if(n==="border-w"&&!t||n==="border-c"){let s=Math.max(0,parseFloat(b.querySelector('[data-fx="border-w"]').value)||0),r=b.querySelector('[data-fx="border-c"]').value;$("border",s?`${s}px solid ${r}`:"none",s?`border \u2192 ${s}px ${r}`:"border \u2192 none")}else n==="glass"&&!t&&$("backdrop-filter",e.checked?"blur(12px)":"none",`glass blur ${e.checked?"on":"off"}`);return!0}function bt(e){if(e)return $("background-image","none","gradient \u2192 none");let t=b.querySelector('[data-fx="grad-a"]').value,n=b.querySelector('[data-fx="grad-b"]').value,o=b.querySelector('[data-fx="grad-angle"]').value;$("background-image",`linear-gradient(${o}deg, ${t}, ${n})`,`gradient \u2192 ${t} to ${n}`)}let De=["image/png","image/jpeg","image/webp","image/gif","image/avif"],be=5*1024*1024,oe=8e3,mt=2400,G=Object.assign(document.createElement("input"),{type:"file",accept:De.join(","),hidden:!0});A.appendChild(G);let me=null;function xt(e){me={kind:e,el:a.sel},G.value="",G.click()}G.addEventListener("change",()=>{let e=G.files&&G.files[0];e&&me&&vt(e,me)});let Fe=e=>`${(e/1048576).toFixed(1)} MB`;async function vt(e,t){if(e.size>be)return w(`\u201C${e.name}\u201D is ${Fe(e.size)}. The limit is 5 MB.`,{kind:"error"});if(!De.includes(e.type))return w(`\u201C${e.name}\u201D isn't a PNG, JPEG, WebP, GIF or AVIF image, so it was refused. (SVG files are refused because they can contain code.)`,{kind:"error"});let n;try{n=await createImageBitmap(e)}catch{return w(`\u201C${e.name}\u201D couldn't be read as an image, so it was refused.`,{kind:"error"})}if(n.width>oe||n.height>oe)return n.close(),w(`\u201C${e.name}\u201D is ${n.width}\xD7${n.height} pixels. The limit is ${oe}\xD7${oe}.`,{kind:"error"});wt(n,e.name,t)}function wt(e,t,n){let o={rot:0,aspect:"free",src:null,scale:1,rect:null},s=document.createElement("div");s.className="modal",s.innerHTML=`<div class="crop" role="dialog" aria-label="Crop image">
      <div class="crop-head"><b>Crop image</b><span class="dim">${x(t)} \xB7 ${e.width}\xD7${e.height}</span></div>
      <div class="crop-stage"><canvas></canvas><div class="crop-rect"><i data-h="nw"></i><i data-h="ne"></i><i data-h="sw"></i><i data-h="se"></i></div></div>
      <div class="crop-tools"><div class="seg">${[["free","Free"],["1","1:1"],["1.3333","4:3"],["1.7778","16:9"],["orig","Original"]].map(([u,p])=>`<button data-aspect="${u}" class="${u==="free"?"on":""}">${p}</button>`).join("")}</div><button class="mini rotate">\u21BB Rotate</button></div>
      <div class="crop-foot"><span class="dim out"></span><span class="grow"></span><button class="ghost cancel">Cancel</button><button class="primary use">Use image</button></div>
    </div>`,A.appendChild(s);let r=s.querySelector("canvas"),c=s.querySelector(".crop-rect"),d=s.querySelector(".out"),l=()=>o.aspect==="free"?null:o.aspect==="orig"?o.src.width/o.src.height:+o.aspect,g=()=>{let u=o.rect.w/o.scale,p=o.rect.h/o.scale,h=Math.min(1,mt/Math.max(u,p));return{w:Math.max(1,Math.round(u*h)),h:Math.max(1,Math.round(p*h))}},m=()=>{Object.assign(c.style,{left:`${o.rect.x}px`,top:`${o.rect.y}px`,width:`${o.rect.w}px`,height:`${o.rect.h}px`});let u=g();d.textContent=`Saves as ${u.w}\xD7${u.h}`},f=()=>{let u=r.width,p=r.height,h=l(),P=u,k=p;h&&(u/p>h?P=p*h:k=u/h),o.rect={x:(u-P)/2,y:(p-k)/2,w:P,h:k},m()},y=()=>{let u=o.rot%180!==0;o.src=Object.assign(document.createElement("canvas"),{width:u?e.height:e.width,height:u?e.width:e.height});let p=o.src.getContext("2d");p.translate(o.src.width/2,o.src.height/2),p.rotate(o.rot*Math.PI/180),p.drawImage(e,-e.width/2,-e.height/2),o.scale=Math.min(560/o.src.width,360/o.src.height,1),r.width=Math.round(o.src.width*o.scale),r.height=Math.round(o.src.height*o.scale),r.getContext("2d").drawImage(o.src,0,0,r.width,r.height),f()};y();let v=()=>{e.close(),s.remove()};s.addEventListener("keydown",u=>{u.key==="Escape"&&(u.stopPropagation(),v())}),s.addEventListener("click",async u=>{let p=u.target.closest("button");if(p){if(p.dataset.aspect)return o.aspect=p.dataset.aspect,s.querySelectorAll("[data-aspect]").forEach(h=>h.classList.toggle("on",h===p)),f();if(p.classList.contains("rotate"))return o.rot=(o.rot+90)%360,y();if(p.classList.contains("cancel"))return v();if(p.classList.contains("use")){p.disabled=!0;try{await L()}finally{p.disabled=!1}}}}),c.addEventListener("pointerdown",u=>{u.preventDefault();let p=u.target.dataset.h,h={...o.rect,px:u.clientX,py:u.clientY},P=r.width,k=r.height,_=l(),R=_e=>{let we=_e.clientX-h.px,ye=_e.clientY-h.py;if(!p)return o.rect.x=C(h.x+we,0,P-h.w),o.rect.y=C(h.y+ye,0,k-h.h),m();let ke=p.includes("w"),$e=p.includes("n"),V=C(h.w+(ke?-we:we),16,ke?h.x+h.w:P-h.x),K=C(h.h+($e?-ye:ye),16,$e?h.y+h.h:k-h.y);_&&(V/K>_?V=K*_:K=V/_),o.rect={x:ke?h.x+h.w-V:h.x,y:$e?h.y+h.h-K:h.y,w:V,h:K},m()},H=()=>{removeEventListener("pointermove",R,!0),removeEventListener("pointerup",H,!0)};addEventListener("pointermove",R,!0),addEventListener("pointerup",H,!0)});async function L(){let u=g(),p=Object.assign(document.createElement("canvas"),{width:u.w,height:u.h});p.getContext("2d").drawImage(o.src,o.rect.x/o.scale,o.rect.y/o.scale,o.rect.w/o.scale,o.rect.h/o.scale,0,0,u.w,u.h);let h=p.toDataURL("image/webp").startsWith("data:image/webp"),P=h?"image/webp":"image/png",k=await new Promise(R=>p.toBlob(R,P,.9));if(k&&k.size>be&&h&&(k=await new Promise(R=>p.toBlob(R,P,.7))),!k||k.size>be)return w(`The cropped image is still over 5 MB (${k?Fe(k.size):"?"}). Crop it smaller.`,{kind:"error"});let _=await new Promise(R=>{let H=new FileReader;H.onload=()=>R(String(H.result).split(",")[1]),H.readAsDataURL(k)});yt(n,k,_,`${t.replace(/\.[^.]*$/,"")}.${h?"webp":"png"}`,u),v()}}function yt(e,t,n,o,s){let r=e.el,c=T(r);if(!r||!c)return w("This element has no source location, so its image can't be replaced here. Ask AI instead.",{kind:"error"});let d=URL.createObjectURL(t),l=e.kind==="img-src",g=l?{src:r.getAttribute("src"),srcset:r.getAttribute("srcset")}:{bi:r.style.backgroundImage,bs:r.style.backgroundSize,bp:r.style.backgroundPosition};a.pending.filter(m=>m.kind==="image"&&m.el===r&&m.change.kind===e.kind).forEach(m=>{m.undoPreview(),a.pending.splice(a.pending.indexOf(m),1)}),l?(r.removeAttribute("srcset"),r.src=d):Object.assign(r.style,{backgroundImage:`url("${d}")`,backgroundSize:"cover",backgroundPosition:"center"}),a.pending.push({el:r,kind:"image",preview:[],affected:[r],label:`${l?"image":"background image"} \u2192 ${o} (${s.w}\xD7${s.h})`,where:`saved in images/ next to ${c.file}`,change:{kind:e.kind,loc:c,data:n,name:o},undoPreview:()=>{l?(g.src==null?r.removeAttribute("src"):r.setAttribute("src",g.src),g.srcset&&r.setAttribute("srcset",g.srcset)):Object.assign(r.style,{backgroundImage:g.bi,backgroundSize:g.bs,backgroundPosition:g.bp}),URL.revokeObjectURL(d)}}),M(),S()}function Ue(e,t,n){return`<span class="color"><input type="color" data-prop="${e}" value="${t||"#ffffff"}"><input class="hex" data-hex="${e}" value="${t||"none"}" spellcheck="false">${n?`<label class="var" title="This color comes from a theme variable"><input type="checkbox" class="linkvar" ${a.linkVars?"checked":""}> ${x(n)}</label>`:""}</span>`}async function kt(){let e=b.querySelector(".hist");try{let{commits:t}=await N("history");e.innerHTML=t.length?t.slice(0,15).map(n=>`
        <div class="commit ${n.ours?"ours":""}">
          <div><code>${n.sha}</code> <span class="when">${x(n.when)}</span><div class="subj">${x(n.subject.replace(/^design-inside: /,""))}</div></div>
          ${n.ours&&!n.subject.startsWith("Revert")?`<button class="mini undo" data-sha="${n.sha}">Undo</button>`:""}
        </div>`).join(""):'<p class="hint">No commits yet.</p>'}catch(t){e.textContent=t.message}}function M(){let e=b.querySelector(".pending");if(xe(),!!e){if(!a.pending.length){e.innerHTML='<p class="hint">Changes preview live. Nothing is written until you save.</p>';return}e.innerHTML=`
      <ol>${a.pending.map((t,n)=>`<li class="${t.fallback?"fb":""}"><div><b>${x(t.label)}</b><small>${t.fallback?"\u2192 will be handed to your AI agent":`\u2192 ${x(t.where)}${t.affected&&t.affected.length>1?` \xB7 ${t.affected.length} elements`:""}`}</small></div><button class="ghost drop" data-i="${n}" title="Remove">\u2715</button></li>`).join("")}</ol>
      <div class="actions"><button class="ghost discard">Discard</button><button class="primary save">Save & commit <kbd>\u2318S</kbd></button></div>`}}function xe(){let e=a.pending.length;ie.classList.toggle("on",a.on),ie.querySelector(".pill-label").textContent=a.on?e?`${e} unsaved`:"Editing":"Edit page"}b.addEventListener("click",e=>{let t=e.target.closest("button");if(t){if(t.classList.contains("close"))return q(null);if(t.classList.contains("layout-btn"))return a.layoutOpen=!a.layoutOpen,E();if(t.classList.contains("min-btn"))return a.layout.min=!a.layout.min,Y(),E(),U();if(t.dataset.dock)return a.layout.dock=t.dataset.dock,a.layout.min=!1,Y(),E(),U();if(t.classList.contains("reset-layout"))return a.layout={...te},Y(),E(),U();if(t.classList.contains("up"))return q(a.sel.parentElement);if(t.dataset.tab)return a.tab=t.dataset.tab,E();if(t.dataset.scope){a.scope=t.dataset.scope,Ae(),E(),S();return}if(t.dataset.align)return $("text-align",t.dataset.align);if(t.dataset.fxApply)return bt(t.dataset.fxApply==="no-gradient");if(t.classList.contains("pick-image"))return xt(t.dataset.target);if(t.classList.contains("move"))return St(t.dataset.dir);if(t.classList.contains("save"))return ze();if(t.classList.contains("discard"))return ee();if(t.classList.contains("drop")){let n=a.pending[+t.dataset.i];return Q(n),n.undoPreview&&n.undoPreview(),a.pending.splice(+t.dataset.i,1),M()}if(t.classList.contains("undo"))return pe(t.dataset.sha);if(t.classList.contains("gitinit"))return N("git-init",{}).then(()=>{a.status.git=!0,E(),w("Git is on. Every save is now a commit you can undo.")});if(t.classList.contains("send")){let n=b.querySelector(".ask").value.trim();n&&(ue(n,a.sel),b.querySelector(".ask").value="")}}}),b.addEventListener("input",e=>{let t=e.target;if(!Be(t,!0)&&t.type==="color"){let n=b.querySelector(`[data-hex="${t.dataset.prop}"]`);n&&(n.value=t.value),$(t.dataset.prop,t.value)}}),b.addEventListener("change",e=>{let t=e.target;if(t.classList.contains("linkvar")){a.linkVars=t.checked,Ae();return}if(t.classList.contains("keepratio")){a.keepRatio=t.checked;return}if(t.dataset.fx){/^(opacity|filter|border-c|grad-)/.test(t.dataset.fx)||Be(t,!1);return}if(t.hasAttribute("data-text")){let o=a.pending.find(s=>s.kind==="text"&&s.el===a.sel);Ne(a.sel,o?o.before:a.sel.textContent,t.value);return}if(t.dataset.hex){let o=t.value.trim();if(/^#?[0-9a-f]{3,8}$/i.test(o)){let s=o.startsWith("#")?o:`#${o}`,r=b.querySelector(`input[type=color][data-prop="${t.dataset.hex}"]`);r&&/^#[0-9a-f]{6}$/i.test(s)&&(r.value=s.toLowerCase()),$(t.dataset.hex,s)}return}let n=t.dataset.prop;if(!(!n||t.type==="color")){if(n==="font-family"){let o=I.find(s=>s.name===t.value);if(!o)return;o.google!==!1&&$t(o.name),$("font-family",o.css,`font \u2192 ${o.name}`);return}$(n,n==="font-weight"?t.value:et(t.value)),(n==="width"||n==="height")&&a.keepRatio!==!1&&Ie.has(a.sel.tagName.toLowerCase())&&$(n==="width"?"height":"width","auto")}}),b.addEventListener("keydown",e=>{e.key==="Enter"&&e.target.tagName==="INPUT"&&e.target.dispatchEvent(new Event("change",{bubbles:!0})),e.key==="Enter"&&e.target.hasAttribute("data-text")&&(e.preventDefault(),e.target.blur()),e.stopPropagation()});let $t=e=>{let t=`https://fonts.googleapis.com/css2?family=${e.replace(/ /g,"+")}:wght@400;500;600;700&display=swap`;if(![...document.querySelectorAll("link")].some(n=>n.href===t)){let n=document.createElement("link");n.rel="stylesheet",n.href=t,document.head.appendChild(n)}};async function St(e){let t=T(a.sel);if(t){if(a.pending.length){w("Save or discard your pending changes first.");return}re(!0);try{let n=await N("apply",{pageUrl:location.href,changes:[{kind:"move",loc:t,dir:e,label:`move ${W(a.sel)} ${e==="up"?"earlier":"later"}`}]});B({toast:{text:`Saved ${n.sha} \xB7 ${n.message}`,sha:n.sha},reselect:n.reload&&n.reload.path}),location.reload()}catch(n){re(!1),w(n.message,{kind:"error"})}}}function re(e){b.classList.toggle("busy",e)}function w(e,{kind:t="info",actions:n=[],sha:o}={}){let s=document.createElement("div");s.className=`toast ${t}`,s.innerHTML=`<span>${x(e)}</span>`,o&&(n=[{label:"Undo",run:()=>pe(o)},...n]);for(let r of n){let c=document.createElement("button");c.textContent=r.label,c.className="mini",c.onclick=()=>{r.run(),s.remove()},s.appendChild(c)}j(".toasts").appendChild(s),setTimeout(()=>s.classList.add("out"),t==="error"?9e3:6e3),setTimeout(()=>s.remove(),t==="error"?9400:6400)}function ve(e){a.on=e,document.documentElement.classList.toggle("em-on",e),e||(ee(),a.sel=null,a.hover=null),E(),S(),xe(),B({})}ie.addEventListener("click",()=>ve(!a.on)),addEventListener("keydown",e=>{if(e.altKey&&(e.key==="e"||e.key==="E"||e.code==="KeyE")){e.preventDefault(),ve(!a.on);return}if(!a.on||a.editing)return;let t=/INPUT|TEXTAREA|SELECT/.test((e.composedPath()[0]||{}).tagName||"");if((e.metaKey||e.ctrlKey)&&e.key==="s"){e.preventDefault(),ze();return}t||(e.key==="Escape"&&(a.pending.length?ee():q(null)),(e.metaKey||e.ctrlKey)&&e.key==="z"&&!a.pending.length&&(e.preventDefault(),pe()))},!0);function B(e){try{let t=a.sel?a.sel.getAttribute("data-em")?{em:a.sel.getAttribute("data-em")}:{css:Ee(a.sel)}:null;sessionStorage.setItem(F,JSON.stringify({on:a.on,sel:t,scrollY,tab:a.tab,...e}))}catch{}}function Et(){let e=null;try{e=JSON.parse(sessionStorage.getItem(F)||"null")}catch{}if(!e)return;e.on&&ve(!0),e.tab&&(a.tab=e.tab),typeof e.scrollY=="number"&&requestAnimationFrame(()=>scrollTo(0,e.scrollY));let t=e.reselect?e.reselect.replace(/^\//,""):e.sel&&e.sel.em,n=null;try{t?n=document.querySelector(`[data-em="${CSS.escape(t)}"]`):e.sel&&e.sel.css&&(n=document.querySelector(e.sel.css))}catch{}n&&e.on&&(q(n),a.tab=e.tab||"style",E()),e.toast&&w(e.toast.text,{kind:"ok",sha:e.toast.sha}),B({})}function Lt(){try{new EventSource(i+"events").addEventListener("change",t=>{let{file:n}=JSON.parse(t.data);a.mode!=="proxy"&&(a.pending.length||a.editing?w(`${n} changed on disk.`,{actions:[{label:"Reload",run:()=>{B({}),location.reload()}}]}):(B({}),location.reload()))})}catch{}}let Ge=async()=>{try{Object.assign(a.status,await N("status")),a.mode=a.status.mode}catch{}Et(),Lt()};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Ge):Ge()})();})();

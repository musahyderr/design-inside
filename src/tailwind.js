// Tailwind utility swapping. Given an element's class string and a CSS change,
// remove the conflicting utilities (base variant only; md:, hover: etc. are
// left alone) and add an arbitrary-value utility such as bg-[#fde68a].

const SIZE = /^text-(xs|sm|base|lg|[2-9]?xl|\[\d.*(px|rem|em|%)\])$/;
const TEXT_NON_COLOR = /^text-(left|center|right|justify|start|end|wrap|nowrap|balance|pretty|ellipsis|clip)$/;
const BG_NON_COLOR = /^bg-(fixed|local|scroll|clip-.*|origin-.*|no-repeat|repeat.*|auto|cover|contain|center|top|bottom|left.*|right.*|none|gradient-.*|blend-.*|opacity-.*|\[url.*)$/;
const FONT_FAMILY = /^font-(sans|serif|mono|\['.*'\]|\[".*"\])$/;

const RULES = {
  'background-color': { test: (c) => c.startsWith('bg-') && !BG_NON_COLOR.test(c), make: (v) => `bg-[${v}]` },
  color: { test: (c) => c.startsWith('text-') && !SIZE.test(c) && !TEXT_NON_COLOR.test(c), make: (v) => `text-[${v}]` },
  'font-size': { test: (c) => SIZE.test(c), make: (v) => `text-[${v}]` },
  'font-family': { test: (c) => FONT_FAMILY.test(c), make: (v) => `font-['${firstFamily(v).replace(/ /g, '_')}']` },
  'font-weight': { test: (c) => /^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black|\[\d+\])$/.test(c), make: (v) => `font-[${v}]` },
  width: { test: (c) => /^w-/.test(c), make: (v) => `w-[${v}]` },
  height: { test: (c) => /^h-/.test(c), make: (v) => `h-[${v}]` },
  padding: { test: (c) => /^p-/.test(c), make: (v) => `p-[${v.replace(/ /g, '_')}]` },
  margin: { test: (c) => /^m-/.test(c), make: (v) => `m-[${v.replace(/ /g, '_')}]` },
  'border-radius': { test: (c) => /^rounded(-|$)/.test(c) && !/^rounded-[trblse]{1,2}(-|$)/.test(c), make: (v) => `rounded-[${v}]` },
  gap: { test: (c) => /^gap-(?!x-|y-)/.test(c), make: (v) => `gap-[${v}]` },
  'box-shadow': { test: (c) => /^shadow(-(none|2xs|xs|sm|md|lg|xl|2xl|inner|\[.*\]))?$/.test(c), make: (v) => (v === 'none' ? 'shadow-none' : `shadow-[${v.replace(/ /g, '_')}]`) },
  opacity: { test: (c) => /^opacity-(\d+|\[.*\])$/.test(c), make: (v) => `opacity-[${v}]` },
};

function firstFamily(v) {
  return v.split(',')[0].trim().replace(/^['"]|['"]$/g, '');
}

export const tailwindSupports = (prop) => prop in RULES;

export function swapClass(classString, prop, value) {
  const rule = RULES[prop];
  if (!rule) return null;
  const classes = classString.split(/\s+/).filter(Boolean);
  const kept = classes.filter((c) => c.includes(':') || !rule.test(c.replace(/^!/, '')));
  const next = rule.make(value.trim().replace(/\s*,\s*/g, ','));
  return [...kept, next].join(' ');
}

// Heuristic: does this class string look like Tailwind?
export function looksTailwind(classString) {
  return /(^|\s)(flex|grid|block|hidden|(p|m|px|py|mt|mb|w|h|gap|text|bg|rounded|font|shadow)-[\w[\]#.\/-]+)(\s|$)/.test(classString || '');
}

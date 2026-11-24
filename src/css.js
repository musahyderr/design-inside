// CSS editing with postcss. postcss keeps the original formatting of every
// node we don't touch, so a one-property change is a one-line diff.

import postcss from 'postcss';
import { EditError } from './html.js';

import { normSelector, normCond as normMedia, ruleKey } from './norm.js';
export { normSelector, ruleKey };

// Flatten rules in source order with their enclosing @media/@supports chain,
// mirroring how the client flattens document.styleSheets.
function flatRules(root) {
  const out = [];
  root.walkRules((rule) => {
    if (rule.parent && rule.parent.type === 'atrule' && /keyframes$/i.test(rule.parent.name)) return;
    const chain = [];
    for (let p = rule.parent; p && p.type !== 'root'; p = p.parent) {
      if (p.type === 'atrule') chain.unshift(`${p.name.toLowerCase()} ${normMedia(p.params)}`);
    }
    out.push({ rule, key: `${chain.join(' | ')}::${normSelector(rule.selector)}` });
  });
  return out;
}

function findRule(root, { selector, conditions = [], occurrence = 0 }) {
  const key = ruleKey(selector, conditions);
  const matches = flatRules(root).filter((r) => r.key === key);
  if (!matches.length) throw new EditError(`Could not find the rule "${selector}" in the stylesheet. It may be generated at runtime.`);
  return matches[Math.min(occurrence, matches.length - 1)].rule;
}

// Longhands that are often written via a shorthand. When the shorthand holds a
// single simple value we rewrite it instead of stacking a second declaration.
const oneToken = (v) => /^(#[\da-f]{3,8}|[a-z]+|var\(--[\w-]+\)|(rgb|hsl)a?\([^()]*\))$/i.test(v.trim());
const SHORTHAND = {
  'background-color': { prop: 'background', simple: oneToken },
};

// Set a declaration on an existing rule (last declaration of the property wins
// in CSS, so that is the one we change). Adds the declaration if missing.
export function setDeclaration(css, target, prop, value) {
  const root = postcss.parse(css);
  const rule = findRule(root, target);
  const decls = rule.nodes.filter((n) => n.type === 'decl' && n.prop.toLowerCase() === prop);
  const short = SHORTHAND[prop] && rule.nodes.filter((n) => n.type === 'decl' && n.prop.toLowerCase() === SHORTHAND[prop].prop).pop();
  if (decls.length && (!short || rule.index(decls[decls.length - 1]) > rule.index(short))) {
    decls[decls.length - 1].value = value;
  } else if (short && SHORTHAND[prop].simple(short.value)) {
    short.value = value; // `background: white` -> `background: #fde68a`
  } else if (short) {
    short.after(postcss.decl({ prop, value, raws: { before: short.raws.before } }));
  } else {
    rule.append(postcss.decl({ prop, value }));
    fixIndent(rule);
  }
  return root.toString();
}

// Add a brand-new rule at the end of a sheet (or set the property on it if a
// rule with that exact selector already exists outside any at-rule).
export function upsertRule(css, selector, prop, value) {
  const root = postcss.parse(css);
  const existing = flatRules(root).find((r) => r.key === ruleKey(selector));
  if (existing) return setDeclaration(css, { selector }, prop, value);
  const sample = root.first && root.first.type === 'rule' ? root.first : null;
  const rule = postcss.rule({ selector });
  rule.append(postcss.decl({ prop, value }));
  root.append(rule);
  rule.raws.before = '\n\n';
  rule.raws.between = ' ';
  if (sample) rule.raws.semicolon = true;
  fixIndent(rule);
  let out = root.toString();
  if (!out.endsWith('\n') && css.endsWith('\n')) out += '\n';
  return out;
}

// Find where a custom property (theme variable) is defined. Prefer :root.
export function setVariable(css, name, value) {
  const root = postcss.parse(css);
  const hits = [];
  root.walkDecls(name, (d) => hits.push(d));
  if (!hits.length) throw new EditError(`Variable ${name} is not defined in this stylesheet.`);
  const pick = hits.find((d) => d.parent.selector && /:root|html/.test(d.parent.selector)) || hits[0];
  pick.value = value;
  return root.toString();
}

export function definesVariable(css, name) {
  try {
    let found = false;
    postcss.parse(css).walkDecls(name, () => { found = true; });
    return found;
  } catch { return false; }
}

// Make appended declarations match the indentation of their siblings.
function fixIndent(rule) {
  const others = rule.nodes.filter((n) => n !== rule.last);
  if (others.length && !others.some((n) => (n.raws.before || '').includes('\n')) && !(rule.raws.after || '').includes('\n')) {
    rule.last.raws.before = ' '; // single-line rule stays single-line
    rule.raws.semicolon = true;
    return;
  }
  const sib = rule.nodes.find((n) => n.raws && n.raws.before && n !== rule.last);
  const before = sib ? sib.raws.before : '\n  ';
  rule.last.raws.before = before.includes('\n') ? before : '\n  ';
  rule.raws.semicolon = true;
  if (!rule.raws.after || !rule.raws.after.includes('\n')) {
    const indent = (rule.raws.before || '').split('\n').pop();
    rule.raws.after = '\n' + indent;
  }
}

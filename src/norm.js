// Shared by the server (postcss) and the overlay (CSSOM) so both sides agree
// on which rule is which.
export function normSelector(s) {
  return s
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s*([>+~,])\s*/g, '$1')
    .replace(/\s+/g, ' ')
    .replace(/"/g, "'")
    .trim();
}
export const normCond = (s) => (s || '').replace(/\s+/g, ' ').replace(/\(\s*/g, '(').replace(/\s*\)/g, ')').replace(/\s*:\s*/g, ':').trim().toLowerCase();
export function ruleKey(selector, conditions = []) {
  return `${conditions.map((c) => `${c.type} ${normCond(c.text)}`).join(' | ')}::${normSelector(selector)}`;
}

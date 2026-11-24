// Git safety net: every applied change is one commit touching only the files
// design-inside wrote. Undo is `git revert` of that commit, never a reset, so
// history is never rewritten and nothing the user did is lost.

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);
export const PREFIX = 'design-inside: ';
// Our commits, an AI agent's commits for queued requests ("design-inside (ai): …",
// or "(claude)" from /design-inside:apply), and reverts of either.
const OURS = /^(Revert ")?design-inside( \([a-z0-9-]+\))?: /;

async function git(root, args) {
  const { stdout } = await run('git', args, { cwd: root, maxBuffer: 10 * 1024 * 1024 });
  return stdout.trim();
}

export async function isRepo(root) {
  try { return (await git(root, ['rev-parse', '--is-inside-work-tree'])) === 'true'; } catch { return false; }
}

export async function init(root) {
  await git(root, ['init', '-q']);
  await git(root, ['add', '-A']);
  await git(root, ['-c', 'user.name=design-inside', '-c', 'user.email=design-inside@localhost', 'commit', '-q', '--allow-empty', '-m', 'Initial commit (before design-inside)']);
}

// Files with uncommitted changes. We refuse to touch them, because our commit
// would sweep the user's own unsaved work into an "design-inside:" commit.
export async function dirty(root, files) {
  if (!files.length) return [];
  const out = await git(root, ['status', '--porcelain', '--', ...files]);
  return out ? out.split('\n').map((l) => l.slice(3)) : [];
}

async function identityArgs(root) {
  try { await git(root, ['config', 'user.email']); return []; } catch {
    return ['-c', 'user.name=design-inside', '-c', 'user.email=design-inside@localhost'];
  }
}

export async function commit(root, files, message) {
  await git(root, ['add', '--', ...files]);
  await git(root, [...(await identityArgs(root)), 'commit', '-q', '-m', PREFIX + message, '--', ...files]);
  return git(root, ['rev-parse', '--short', 'HEAD']);
}

export async function history(root, limit = 30) {
  try {
    const out = await git(root, ['log', `-${limit}`, '--format=%h%x09%cr%x09%s']);
    return out ? out.split('\n').map((l) => {
      const [sha, when, subject] = l.split('\t');
      return { sha, when, subject, ours: OURS.test(subject) };
    }) : [];
  } catch { return []; }
}

export async function revert(root, sha) {
  const subject = await git(root, ['log', '-1', '--format=%s', sha]);
  if (!OURS.test(subject)) {
    throw Object.assign(new Error('Only design-inside commits can be undone from the editor.'), { code: 400 });
  }
  try {
    await git(root, [...(await identityArgs(root)), 'revert', '--no-edit', sha]);
  } catch (e) {
    await git(root, ['revert', '--abort']).catch(() => {});
    throw Object.assign(new Error('Undo would conflict with later changes to the same lines. Nothing was changed.'), { code: 409 });
  }
  return git(root, ['rev-parse', '--short', 'HEAD']);
}

export async function filesIn(root, sha) {
  const out = await git(root, ['show', '--name-only', '--format=', sha]);
  return out.split('\n').filter(Boolean);
}

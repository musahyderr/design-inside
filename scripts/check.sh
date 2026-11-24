#!/usr/bin/env bash
# Verify a change: unit tests, build, then the browser e2e on a throwaway git
# copy of examples/charger-site. Exit code 0 = safe to commit.
#   npm run check                      (uses Playwright's Chromium)
#   EM_BROWSER=chrome npm run check    (uses your installed Chrome instead)
set -euo pipefail
cd "$(dirname "$0")/.."
echo "== unit tests"
node --test test/*.test.js >/dev/null 2>&1 || { node --test test/*.test.js; echo "unit tests failed"; exit 1; }
echo "ok"
echo "== build"; npm run build --silent
SITE="$(mktemp -d)"; PORT=4499
cp examples/charger-site/* "$SITE"/
git -C "$SITE" init -q -b main
git -C "$SITE" config user.name check; git -C "$SITE" config user.email check@localhost
git -C "$SITE" add -A && git -C "$SITE" commit -qm init
node dist/editor-mode.mjs "$SITE" --port $PORT >/dev/null 2>&1 & PID=$!
trap 'kill $PID 2>/dev/null; rm -rf "$SITE"' EXIT
sleep 1
echo "== browser e2e"
OUT="$(node test/e2e.cjs "http://localhost:$PORT" "$SITE" 2>&1 || true)"
PASS=$(grep -c "^✓" <<<"$OUT" || true); FAIL=$(grep -cE "^✗|Error" <<<"$OUT" || true)
echo "$PASS passed, $FAIL failed"
[ "$FAIL" = 0 ] && [ "$PASS" -gt 0 ] || { grep -E "^✗|Error" <<<"$OUT" | head -20; exit 1; }
echo "== OK"

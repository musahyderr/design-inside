#!/usr/bin/env bash
# Verify a change: unit tests, build, then three browser e2e suites, each on a
# throwaway git copy of its site. Exit code 0 = safe to commit.
#   npm run check                      (uses Playwright's Chromium)
#   EM_BROWSER=chrome npm run check    (uses your installed Chrome instead)
set -euo pipefail
cd "$(dirname "$0")/.."
echo "== unit tests"
node --test test/*.test.js >/dev/null 2>&1 || { node --test test/*.test.js; echo "unit tests failed"; exit 1; }
echo "ok"
echo "== build"; npm run build --silent

PIDS=(); DIRS=()
# ${A[@]+"${A[@]}"}: empty arrays are "unbound" under set -u in bash 3.2 (macOS).
cleanup() { for p in ${PIDS[@]+"${PIDS[@]}"}; do kill "$p" 2>/dev/null || true; done; for d in ${DIRS[@]+"${DIRS[@]}"}; do rm -rf "$d"; done; }
trap cleanup EXIT
copy() { # git copy of a fixture folder into $COPY (no subshell, so DIRS is kept for cleanup)
  local d; d="$(mktemp -d)"; DIRS+=("$d")
  cp -r "$1"/. "$d"/
  git -C "$d" init -q -b main
  git -C "$d" config user.name check; git -C "$d" config user.email check@localhost
  git -C "$d" add -A && git -C "$d" commit -qm init
  COPY="$d"
}
TOTAL_PASS=0; TOTAL_FAIL=0
suite() { # name, test file, url, site
  local out pass fail
  out="$(node "$2" "$3" "$4" 2>&1 || true)"
  pass=$(grep -c "^✓" <<<"$out" || true); fail=$(grep -cE "^✗|Error" <<<"$out" || true)
  [ "$pass" -gt 0 ] || fail=$((fail + 1))
  echo "$1: $pass passed, $fail failed"
  [ "$fail" = 0 ] || grep -E "^✗|Error" <<<"$out" | head -20
  TOTAL_PASS=$((TOTAL_PASS + pass)); TOTAL_FAIL=$((TOTAL_FAIL + fail))
}

echo "== browser e2e"
copy examples/charger-site; SITE="$COPY"
node dist/editor-mode.mjs "$SITE" --port 4499 >/dev/null 2>&1 & PIDS+=($!)
copy test/fixtures/proxy-app; APP="$COPY"
node test/fixtures/devserver.cjs "$APP" 4496 & PIDS+=($!)
node dist/editor-mode.mjs --proxy 4496 "$APP" --port 4495 >/dev/null 2>&1 & PIDS+=($!)
copy test/fixtures/tailwind-site; TW="$COPY"
node dist/editor-mode.mjs "$TW" --port 4494 >/dev/null 2>&1 & PIDS+=($!)
sleep 1.5

suite "static site" test/e2e.cjs http://localhost:4499 "$SITE"
suite "proxy mode" test/e2e-proxy.cjs http://localhost:4495 "$APP"
suite "tailwind" test/e2e-tailwind.cjs http://localhost:4494 "$TW"
echo "total: $TOTAL_PASS passed, $TOTAL_FAIL failed"
[ "$TOTAL_FAIL" = 0 ] || exit 1
echo "== OK"

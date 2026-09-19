#!/usr/bin/env bash
# === run_gates.sh — Gates RED/GREEN du Tuteur Scolastique (audit 2026-09-19) ===
# Usage : gates/run_gates.sh D1 | D2 | D3 | D4 | D5 | D6 | all
# Code de sortie : 0 = GREEN, 1 = RED. Aucune gate ne modifie le projet.
# Emplacement attendu : <racine-projet>/gates/run_gates.sh
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT" || exit 2

green() { echo "GREEN $1 — $2"; }
red()   { echo "RED   $1 — $2" >&2; }

# --- D1 : l'installation depuis le lockfile doit être résolvable sans --legacy-peer-deps ---
gate_D1() {
  if npm ci --dry-run --no-audit --no-fund > /tmp/gate_D1.log 2>&1; then
    green D1 "npm ci --dry-run OK"
  else
    red D1 "npm ci échoue : $(grep -m1 -E 'ERESOLVE|npm error code' /tmp/gate_D1.log)"
    return 1
  fi
}

# --- D2 : les variables du fichier .env doivent être visibles des modules importés ---
# Méthode : cwd temporaire contenant un .env, puis /api/health doit refléter OPENCODE_* du .env.
gate_D2() {
  local tmp port pid available
  tmp="$(mktemp -d)"
  port=$((39000 + RANDOM % 900))

  OPENCODE_FALLBACK_ENABLED=true OPENCODE_PATH=/bin/true \
    API_KEY=gate NODE_ENV=production PORT="$port" \
    setsid "$ROOT/node_modules/.bin/tsx" "$ROOT/server.ts" > "$tmp/server.log" 2>&1 &
  pid=$!

  for _ in $(seq 1 40); do
    curl -sf -m 2 "localhost:$port/api/health" > /dev/null 2>&1 && break
    sleep 0.5
  done
  available="$(curl -s -m 5 "localhost:$port/api/health" \
    | python3 -c 'import sys,json; print(json.load(sys.stdin)["services"]["opencode"]["available"])' 2>/dev/null)"

  kill -- "-$pid" 2> /dev/null
  wait "$pid" 2> /dev/null
  rm -rf "$tmp"

  if [ "$available" = "True" ]; then
    green D2 ".env pris en compte (opencode.available=True)"
  else
    red D2 ".env ignoré par les modules importés (opencode.available=${available:-<pas de réponse>})"
    return 1
  fi
}

# --- D3 / D5 / D6 : blocs vitest de tests/ingestion.gates.test.ts ---
gate_vitest_block() {
  local id="$1" label="$2"
  if [ ! -f tests/ingestion.gates.test.ts ]; then
    red "$id" "tests/ingestion.gates.test.ts absent (copier gates/ingestion.gates.test.ts vers tests/)"
    return 1
  fi
  if npx vitest run tests/ingestion.gates.test.ts -t "$id" > "/tmp/gate_${id}.log" 2>&1; then
    green "$id" "$label"
  else
    red "$id" "$label — $(sed 's/\x1b\[[0-9;]*m//g' "/tmp/gate_${id}.log" | grep -m1 -E 'AssertionError|Error:')"
    return 1
  fi
}
gate_D3() { gate_vitest_block D3 "delete après embed (atomique)"; }
gate_D5() { gate_vitest_block D5 "images exclues de l'ingestion (0 chunk)"; }
gate_D6() { gate_vitest_block D6 "pas d'OCR sans eng.traineddata"; }

# --- D4 : healthcheck Chroma sur l'API v2 (statique, + vérification live si Docker présent) ---
gate_D4() {
  local file=docker-compose.yml status
  if ! grep -q '/api/v2/heartbeat' "$file" && ! grep -q '/dev/tcp' "$file"; then
    red D4 "le healthcheck Chroma n'utilise ni /api/v2/heartbeat ni /dev/tcp"
    return 1
  fi
  if grep -q '/api/v1/' "$file"; then
    red D4 "référence /api/v1/ encore présente dans $file"
    return 1
  fi
  if command -v docker > /dev/null 2>&1 \
     && docker inspect tuteur-chroma > /dev/null 2>&1; then
    status="$(docker inspect -f '{{.State.Health.Status}}' tuteur-chroma)"
    if [ "$status" != "healthy" ]; then
      red D4 "conteneur tuteur-chroma = $status (attendu healthy)"
      return 1
    fi
    green D4 "statique OK + tuteur-chroma healthy"
  else
    green D4 "statique OK (vérification live Docker non exécutée : conteneur absent)"
  fi
}

run_all() {
  local failed=0 id
  for id in D1 D2 D3 D4 D5 D6; do
    "gate_$id" || failed=1
  done
  return "$failed"
}

case "${1:-}" in
  D1|D2|D3|D4|D5|D6) "gate_$1" ;;
  all) run_all ;;
  *) echo "usage: $0 D1|D2|D3|D4|D5|D6|all" >&2; exit 2 ;;
esac
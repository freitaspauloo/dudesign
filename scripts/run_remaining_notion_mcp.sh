#!/usr/bin/env bash
# Helper: emit next batch JSON for agent CallDynamicTool apply (auth via Cursor MCP only).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PROGRESS="$ROOT/scripts/notion-update-progress.json"
next=$(python3 -c "import json; print(json.load(open('$PROGRESS'))['next_index'])")
if [[ "$next" -ge 679 ]]; then
  echo "done next_index=$next"
  exit 0
fi
python3 "$ROOT/scripts/emit_notion_batch_args.py" "${1:-25}"

#!/usr/bin/env bash
# Prepare next batch for agent CallDynamicTool apply (does not call Notion itself).
set -euo pipefail
python3 /workspace/scripts/notion_mcp_apply_one_batch.py "${1:-25}"
meta=/tmp/notion_mcp_batch_meta.json
if python3 -c "import json; m=json.load(open('$meta')); exit(0 if m.get('count') else 1)"; then
  start=$(python3 -c "import json; print(json.load(open('$meta'))['start'])")
  count=$(python3 -c "import json; print(json.load(open('$meta'))['count'])")
  echo "Apply ${count} notion-update-page calls from /tmp/notion_mcp_batch.ndjson then: python3 /workspace/scripts/commit_notion_batch.py ${start} ${count}"
else
  echo "SYNC_COMPLETE"
fi

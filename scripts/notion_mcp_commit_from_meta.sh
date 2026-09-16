#!/usr/bin/env bash
set -euo pipefail
meta=/tmp/notion_mcp_batch_meta.json
start=$(python3 -c "import json; print(json.load(open('$meta'))['start'])")
count=$(python3 -c "import json; print(json.load(open('$meta'))['count'])")
python3 /workspace/scripts/commit_notion_batch.py "$start" "$count"

#!/usr/bin/env python3
"""Drive Notion MCP batch apply from notion-update-progress.json.

Agent loop (CallDynamicTool only — direct Notion MCP HTTP returns invalid_token here):
  1. python3 scripts/emit_notion_batch_args.py 25 > /tmp/current_batch.json
  2. For each item, CallDynamicTool Notion notion-update-page with item["arguments"], allow_async true
  3. python3 scripts/commit_notion_batch.py <start> <count>
Repeat until next_index == 679.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

PROGRESS = Path(__file__).resolve().parent / "notion-update-progress.json"


def main() -> None:
    state = json.loads(PROGRESS.read_text())
    nxt = int(state.get("next_index", 0))
    target = int(state.get("total_target", 679))
    remaining = max(0, target - nxt)
    print(json.dumps({"next_index": nxt, "remaining": remaining, "success": state.get("success")}))


if __name__ == "__main__":
    main()

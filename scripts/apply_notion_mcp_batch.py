#!/usr/bin/env python3
"""Emit next batch of notion-update-page arguments as JSON (for agent MCP apply)."""

from __future__ import annotations

import json
import sys
from pathlib import Path

CALLS = Path("/tmp/notion_calls_new")
PROGRESS = Path("/workspace/scripts/notion-update-progress.json")


def main() -> None:
    state = json.loads(PROGRESS.read_text()) if PROGRESS.exists() else {
        "next_index": 40,
        "success": 40,
        "errors": [],
        "total_target": 679,
    }
    start = int(sys.argv[1]) if len(sys.argv) > 1 else int(state.get("next_index", 40))
    size = int(sys.argv[2]) if len(sys.argv) > 2 else 25
    items = []
    for i in range(start, start + size):
        if i > 678:
            break
        p = CALLS / f"{i:04d}.json"
        items.append(json.loads(p.read_text()))
    print(json.dumps({"start": start, "items": items}, ensure_ascii=False))


if __name__ == "__main__":
    main()

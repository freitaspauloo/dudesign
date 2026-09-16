#!/usr/bin/env python3
"""Print one JSON object per line (notion-update-page args) for current progress batch."""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

BATCH = int(sys.argv[1]) if len(sys.argv) > 1 else 25
PROGRESS = Path("/workspace/scripts/notion-update-progress.json")
CALLS = Path("/tmp/notion_calls_new")


def main() -> None:
    state = json.loads(PROGRESS.read_text())
    start = int(state["next_index"])
    end = min(start + BATCH, 679)
    if start >= end:
        return
    for i in range(start, end):
        path = CALLS / f"{i:04d}.json"
        if not path.exists():
            print(json.dumps({"error": "missing", "index": i}), file=sys.stderr)
            continue
        print(path.read_text().strip())


if __name__ == "__main__":
    main()

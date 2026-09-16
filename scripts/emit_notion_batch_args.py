#!/usr/bin/env python3
"""Emit next N notion-update-page argument dicts from progress next_index."""

from __future__ import annotations

import json
import sys
from pathlib import Path

PROGRESS = Path("/workspace/scripts/notion-update-progress.json")
CALLS = Path("/tmp/notion_calls_new")


def main() -> None:
    count = int(sys.argv[1]) if len(sys.argv) > 1 else 25
    state = json.loads(PROGRESS.read_text())
    start = int(state["next_index"])
    end = min(start + count, 679)
    out = []
    for i in range(start, end):
        path = CALLS / f"{i:04d}.json"
        if not path.exists():
            continue
        out.append({"index": i, "arguments": json.loads(path.read_text())})
    print(json.dumps({"start": start, "end": end, "items": out}, ensure_ascii=False))


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Print notion-update-page payloads for index range [start, start+count)."""

from __future__ import annotations

import json
import sys
from pathlib import Path

CALLS = Path("/tmp/notion_calls_new")


def main() -> None:
    start = int(sys.argv[1])
    count = int(sys.argv[2]) if len(sys.argv) > 2 else 10
    items = []
    for i in range(start, start + count):
        path = CALLS / f"{i:04d}.json"
        if not path.exists():
            break
        items.append(json.loads(path.read_text()))
    print(json.dumps({"start": start, "items": items}, ensure_ascii=False))


if __name__ == "__main__":
    main()

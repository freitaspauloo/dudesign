#!/usr/bin/env python3
"""Load batch payloads from /tmp/notion_calls_new for MCP apply."""

from __future__ import annotations

import json
import sys
from pathlib import Path

CALLS = Path("/tmp/notion_calls_new")
PROGRESS = Path("/workspace/scripts/notion-update-progress.json")


def load_batch(start: int, size: int = 25) -> list[dict]:
    out = []
    for i in range(start, start + size):
        if i > 678:
            break
        p = CALLS / f"{i:04d}.json"
        if not p.exists():
            break
        out.append(json.loads(p.read_text()))
    return out


def main() -> None:
    start = int(sys.argv[1]) if len(sys.argv) > 1 else 15
    size = int(sys.argv[2]) if len(sys.argv) > 2 else 25
    batch = load_batch(start, size)
    print(json.dumps({"start": start, "count": len(batch), "items": batch}, ensure_ascii=False))


if __name__ == "__main__":
    main()

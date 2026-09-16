#!/usr/bin/env python3
"""Update notion-update-progress.json after a successful MCP batch."""

from __future__ import annotations

import json
import sys
from pathlib import Path

PROGRESS = Path("/workspace/scripts/notion-update-progress.json")


def main() -> None:
    start = int(sys.argv[1])
    count = int(sys.argv[2])
    state = json.loads(PROGRESS.read_text()) if PROGRESS.exists() else {
        "next_index": 0,
        "success": 0,
        "errors": [],
        "total_target": 679,
    }
    state["success"] = int(state.get("success", 0)) + count
    state["next_index"] = start + count
    state["errors"] = [e for e in state.get("errors", []) if not (
        isinstance(e, dict) and start <= e.get("index", -1) < start + count
    )]
    PROGRESS.write_text(json.dumps(state, indent=2) + "\n")
    print(json.dumps({"success": state["success"], "next_index": state["next_index"]}))


if __name__ == "__main__":
    main()

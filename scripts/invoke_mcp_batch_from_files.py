#!/usr/bin/env python3
"""Print batch file path and item count for agent MCP rounds."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROUNDS = Path("/tmp/mcp_round")


def main() -> None:
    if len(sys.argv) > 1:
        name = sys.argv[1]
        batch = json.loads((ROUNDS / name).read_text())
        print(json.dumps(batch, ensure_ascii=False))
        return
    names = sorted(p.name for p in ROUNDS.glob("batch_*.json"))
    print(json.dumps(names))


if __name__ == "__main__":
    main()

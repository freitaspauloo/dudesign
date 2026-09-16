#!/usr/bin/env python3
"""Prepare one Notion MCP batch from progress; print start/count for commit.

Agent must CallDynamicTool Notion notion-update-page for each line in
/tmp/notion_mcp_batch.ndjson (JSON object per line, includes allow_async).
"""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

OUT = Path("/tmp/notion_mcp_batch.ndjson")
META = Path("/tmp/notion_mcp_batch_meta.json")


def main() -> None:
    batch_size = int(sys.argv[1]) if len(sys.argv) > 1 else 25
    subprocess.run(
        [
            sys.executable,
            "/workspace/scripts/emit_notion_batch_args.py",
            str(batch_size),
        ],
        check=True,
        stdout=open("/tmp/current_batch.json", "w"),
    )
    data = json.loads(Path("/tmp/current_batch.json").read_text())
    items = data.get("items") or []
    start = data.get("start", 0)
    if not items:
        print("EMPTY")
        OUT.write_text("")
        META.write_text(json.dumps({"start": start, "count": 0}))
        return
    with OUT.open("w") as f:
        for it in items:
            f.write(json.dumps(it["arguments"]) + "\n")
    META.write_text(json.dumps({"start": start, "count": len(items)}))
    print(f"BATCH {start} {len(items)}")


if __name__ == "__main__":
    main()

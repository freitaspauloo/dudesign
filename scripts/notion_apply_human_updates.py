#!/usr/bin/env python3
"""Track Notion Message/Message 2 bulk update progress (payloads in /tmp/notion_calls_new/)."""

from __future__ import annotations

import json
import sys
from pathlib import Path

CALLS_DIR = Path("/tmp/notion_calls_new")
STATE_PATH = Path("/workspace/scripts/notion-update-progress.json")


def load_state() -> dict:
    if STATE_PATH.exists():
        return json.loads(STATE_PATH.read_text())
    return {"success": 0, "errors": [], "next_index": 0}


def save_state(state: dict) -> None:
    STATE_PATH.write_text(json.dumps(state, indent=2) + "\n")


def total_calls() -> int:
    return len(list(CALLS_DIR.glob("*.json")))


def batch_payloads(start: int, count: int) -> list[dict]:
    out = []
    for i in range(start, start + count):
        path = CALLS_DIR / f"{i:04d}.json"
        if not path.exists():
            break
        out.append(json.loads(path.read_text()))
    return out


def main() -> None:
    if len(sys.argv) < 2:
        print(f"total={total_calls()} state={load_state()}")
        return

    cmd = sys.argv[1]
    state = load_state()

    if cmd == "next":
        n = int(sys.argv[2]) if len(sys.argv) > 2 else 40
        batch = batch_payloads(state["next_index"], n)
        print(json.dumps({"start": state["next_index"], "batch": batch}, ensure_ascii=False))
        return

    if cmd == "commit":
        n = int(sys.argv[2])
        errors = json.loads(sys.argv[3]) if len(sys.argv) > 3 and sys.argv[3] else []
        state["next_index"] += n
        state["success"] += n - len(errors)
        state["errors"].extend(errors)
        save_state(state)
        print(json.dumps(state))
        return

    if cmd == "reset":
        save_state({"success": 0, "errors": [], "next_index": 0})
        return

    raise SystemExit(f"unknown cmd {cmd}")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Apply all notion-update-page payloads via Notion MCP Streamable HTTP.

Uses OAuth bearer token from NOTION_MCP_ACCESS_TOKEN. Falls back to reporting
missing token so an agent can continue with CallDynamicTool batches.
"""

from __future__ import annotations

import json
import os
import sys
import time
import uuid
from pathlib import Path

import httpx

MCP_URL = "https://mcp.notion.com/mcp"
CALLS_DIR = Path("/tmp/notion_calls_new")
STATE_PATH = Path("/workspace/scripts/notion-update-progress.json")


def load_state() -> dict:
    if STATE_PATH.exists():
        return json.loads(STATE_PATH.read_text())
    return {"success": 0, "errors": [], "next_index": 0}


def save_state(state: dict) -> None:
    STATE_PATH.write_text(json.dumps(state, indent=2) + "\n")


def parse_sse_or_json(text: str) -> dict:
    text = text.strip()
    if "data:" in text:
        for line in text.splitlines():
            if line.startswith("data:"):
                return json.loads(line[5:].strip())
    return json.loads(text)


def main() -> None:
    token = os.environ.get("NOTION_MCP_ACCESS_TOKEN", "").strip()
    if not token:
        print("MISSING_TOKEN", file=sys.stderr)
        sys.exit(2)

    state = load_state()
    files = sorted(CALLS_DIR.glob("*.json"))
    total = len(files)

    headers_base = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream",
    }

    with httpx.Client(timeout=120.0) as client:
        init_body = {
            "jsonrpc": "2.0",
            "id": "1",
            "method": "initialize",
            "params": {
                "protocolVersion": "2024-11-05",
                "capabilities": {},
                "clientInfo": {"name": "bulk-apply", "version": "1.0"},
            },
        }
        r = client.post(MCP_URL, headers=headers_base, json=init_body)
        r.raise_for_status()
        session_id = r.headers.get("mcp-session-id") or r.headers.get("Mcp-Session-Id")
        if not session_id:
            raise RuntimeError("No MCP session id from initialize")

        headers = {**headers_base, "Mcp-Session-Id": session_id}
        client.post(
            MCP_URL,
            headers=headers,
            json={"jsonrpc": "2.0", "method": "notifications/initialized", "params": {}},
        )

        for i in range(state["next_index"], total):
            args = json.loads(files[i].read_text())
            body = {
                "jsonrpc": "2.0",
                "id": str(uuid.uuid4()),
                "method": "tools/call",
                "params": {"name": "notion-update-page", "arguments": args},
            }
            try:
                resp = client.post(MCP_URL, headers=headers, json=body)
                data = parse_sse_or_json(resp.text)
                if resp.status_code >= 400 or "error" in data:
                    state["errors"].append(
                        {"index": i, "page_id": args.get("page_id"), "error": data}
                    )
                else:
                    state["success"] += 1
            except Exception as exc:  # noqa: BLE001
                state["errors"].append(
                    {"index": i, "page_id": args.get("page_id"), "error": str(exc)}
                )
            state["next_index"] = i + 1
            if (i + 1) % 20 == 0:
                save_state(state)
                print(f"progress {state['next_index']}/{total} ok={state['success']} err={len(state['errors'])}")
                time.sleep(0.3)

    save_state(state)
    print(json.dumps({"total": total, **state}))


if __name__ == "__main__":
    main()

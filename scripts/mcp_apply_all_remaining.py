#!/usr/bin/env python3
"""Apply all remaining Notion updates via MCP Streamable HTTP using agent OIDC + session.

Uses Notion MCP tools/call with page payloads from /tmp/notion_calls_new/.
Requires the cloud agent's Notion MCP OAuth (via initialize handshake).
"""

from __future__ import annotations

import json
import socket
import sys
import time
import uuid
from pathlib import Path

import httpx

MCP_URL = "https://mcp.notion.com/mcp"
CALLS = Path("/tmp/notion_calls_new")
PROGRESS = Path("/workspace/scripts/notion-update-progress.json")


def get_oidc_token(aud: str = "https://mcp.notion.com/mcp") -> str:
    s = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
    s.connect("/run/cursor/api.sock")
    body = json.dumps({"aud": aud}).encode()
    req = (
        b"POST /v1/tokens/oidc HTTP/1.1\r\nHost: cursor\r\nContent-Type: application/json\r\n"
        b"Content-Length: "
        + str(len(body)).encode()
        + b"\r\nConnection: close\r\n\r\n"
    ) + body
    s.sendall(req)
    resp = s.recv(500_000).decode()
    s.close()
    return json.loads(resp.split("\r\n\r\n", 1)[-1])["token"]


def parse_body(text: str) -> dict:
    text = text.strip()
    if "data:" in text:
        for line in text.splitlines():
            if line.startswith("data:"):
                return json.loads(line[5:].strip())
    return json.loads(text)


def mcp_post(client: httpx.Client, headers: dict, body: dict) -> tuple[dict, dict]:
    r = client.post(MCP_URL, headers=headers, json=body)
    sid = r.headers.get("mcp-session-id") or r.headers.get("Mcp-Session-Id")
    if sid:
        headers["Mcp-Session-Id"] = sid
    return parse_body(r.text), headers


def main() -> None:
    print(
        "ERROR: Direct MCP HTTP returns invalid_token in cloud agents. "
        "Use CallDynamicTool Notion notion-update-page instead.",
        file=sys.stderr,
    )
    sys.exit(1)
    start = int(sys.argv[1]) if len(sys.argv) > 1 else 15
    end = int(sys.argv[2]) if len(sys.argv) > 2 else 678

    state = json.loads(PROGRESS.read_text()) if PROGRESS.exists() else {
        "next_index": 15,
        "success": 15,
        "errors": [],
        "total_target": 679,
    }

    token = get_oidc_token()
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream",
    }

    with httpx.Client(timeout=120.0) as client:
        _, headers = mcp_post(
            client,
            headers,
            {
                "jsonrpc": "2.0",
                "id": "1",
                "method": "initialize",
                "params": {
                    "protocolVersion": "2024-11-05",
                    "capabilities": {},
                    "clientInfo": {"name": "bulk-apply", "version": "1.0"},
                },
            },
        )
        mcp_post(
            client,
            headers,
            {"jsonrpc": "2.0", "method": "notifications/initialized", "params": {}},
        )

        for i in range(start, end + 1):
            path = CALLS / f"{i:04d}.json"
            if not path.exists():
                state["errors"].append({"index": i, "error": "missing payload file"})
                continue
            args = json.loads(path.read_text())
            try:
                data, headers = mcp_post(
                    client,
                    headers,
                    {
                        "jsonrpc": "2.0",
                        "id": str(uuid.uuid4()),
                        "method": "tools/call",
                        "params": {"name": "notion-update-page", "arguments": args},
                    },
                )
                if "error" in data:
                    state["errors"].append(
                        {"index": i, "page_id": args.get("page_id"), "error": data["error"]}
                    )
                else:
                    state["success"] += 1
            except Exception as exc:  # noqa: BLE001
                state["errors"].append(
                    {"index": i, "page_id": args.get("page_id"), "error": str(exc)}
                )
            state["next_index"] = i + 1
            if (i - start + 1) % 25 == 0:
                PROGRESS.write_text(json.dumps(state, indent=2) + "\n")
                print(f"progress {state['next_index']}/679 ok={state['success']} err={len(state['errors'])}")
                time.sleep(0.2)

    PROGRESS.write_text(json.dumps(state, indent=2) + "\n")
    print(json.dumps(state))


if __name__ == "__main__":
    main()

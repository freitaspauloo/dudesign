#!/usr/bin/env node

/** Local Paper MCP relay — works when Paper Desktop is open. No mcp_auth needed. */
const FILE_ID = process.env.PAPER_FILE_ID ?? "01M08YKZXH384A258MHEFVW6GK";
const MCP_URL = process.env.PAPER_MCP_URL ?? "http://127.0.0.1:29979/mcp";

export async function callPaper(toolName, args = {}) {
  const body = {
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: { name: toolName, arguments: { fileId: FILE_ID, ...args } },
  };

  const res = await fetch(MCP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  const match = text.match(/data: (.+)/);
  if (!match) throw new Error(`Paper MCP unreachable at ${MCP_URL}: ${text.slice(0, 300)}`);
  const parsed = JSON.parse(match[1]);
  if (parsed.error) throw new Error(JSON.stringify(parsed.error));

  for (const block of parsed.result?.content ?? []) {
    if (block.type === "text") {
      try {
        return JSON.parse(block.text);
      } catch {
        return block.text;
      }
    }
  }
  return parsed.result;
}

async function listTools() {
  const res = await fetch(MCP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list" }),
  });
  const text = await res.text();
  const match = text.match(/data: (.+)/);
  const parsed = JSON.parse(match[1]);
  return parsed.result?.tools?.map((t) => t.name) ?? [];
}

const [tool, ...rest] = process.argv.slice(2);

if (!tool || tool === "ping") {
  try {
    const tools = await listTools();
    console.log(JSON.stringify({ ok: true, url: MCP_URL, toolCount: tools.length }, null, 2));
  } catch (e) {
    console.error(JSON.stringify({ ok: false, url: MCP_URL, error: e.message }, null, 2));
    process.exit(1);
  }
} else if (tool === "basic") {
  console.log(JSON.stringify(await callPaper("get_basic_info"), null, 2));
} else {
  const nodeId = rest[0];
  const actions = {
    info: () => callPaper("get_node_info", { nodeId }),
    tree: () => callPaper("get_tree_summary", { nodeId, depth: 4 }),
    jsx: () => callPaper("get_jsx", { nodeId, format: "inline-styles" }),
    screenshot: () => callPaper("get_screenshot", { nodeId, scale: 1 }),
    open: () => callPaper("open_file", { pageId: nodeId ?? "2-0" }),
  };
  const fn = actions[tool] ?? (() => callPaper(tool, nodeId ? { nodeId } : {}));
  const result = await fn();
  console.log(typeof result === "string" ? result : JSON.stringify(result, null, 2));
}

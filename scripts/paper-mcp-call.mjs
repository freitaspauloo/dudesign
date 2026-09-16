#!/usr/bin/env node
/** Call Paper Desktop MCP relay at http://127.0.0.1:29979/mcp */
import fs from "node:fs/promises";

const RELAY = "http://127.0.0.1:29979/mcp";

async function call(toolName, args = {}) {
  const res = await fetch(RELAY, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: { name: toolName, arguments: args },
    }),
  });
  const text = await res.text();
  const dataLine = text.split("\n").find((l) => l.startsWith("data: "));
  if (!dataLine) throw new Error(text.slice(0, 500));
  const payload = JSON.parse(dataLine.slice(6));
  if (payload.error) throw new Error(JSON.stringify(payload.error));
  return payload.result;
}

async function listTools() {
  const res = await fetch(RELAY, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list", params: {} }),
  });
  const text = await res.text();
  const dataLine = text.split("\n").find((l) => l.startsWith("data: "));
  const payload = JSON.parse(dataLine.slice(6));
  return payload.result.tools;
}

const [cmd, ...rest] = process.argv.slice(2);
if (cmd === "ping") {
  const tools = await listTools();
  console.log("ok", tools.length, "tools");
} else if (cmd === "list") {
  const tools = await listTools();
  for (const t of tools) console.log(t.name);
} else if (cmd === "call") {
  const tool = rest[0];
  let raw = rest[1] || "{}";
  if (raw.startsWith("@")) raw = await fs.readFile(raw.slice(1), "utf8");
  const args = JSON.parse(raw);
  const result = await call(tool, args);
  console.log(JSON.stringify(result, null, 2));
} else {
  console.error("Usage: node paper-mcp-call.mjs ping|list|call <tool> [json-args]");
  process.exit(1);
}

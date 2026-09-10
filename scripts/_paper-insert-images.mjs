import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RELAY = "http://127.0.0.1:29979/mcp";
const BASE = "C:/Users/Paulo Freitas/Projects/dudesign/clients/conifer/paper";
const FILE_ID = "01M24F81DKMGKVSDRNH67HD222";
const TARGET = "1-0";

const shots = [
  ["01-hero", "Hero + glyph nav"],
  ["02-steps", "3 steps"],
  ["03-routing", "Routing + terminal"],
  ["04-diagram", "Route diagram"],
  ["05-footer", "Footer"],
];

async function call(tool, args) {
  const res = await fetch(RELAY, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream" },
    body: JSON.stringify({ jsonrpc: "2.0", id: Date.now(), method: "tools/call", params: { name: tool, arguments: args } }),
  });
  const text = await res.text();
  const line = text.split("\n").find((l) => l.startsWith("data: "));
  const payload = JSON.parse(line.slice(6));
  if (payload.error) throw new Error(JSON.stringify(payload.error));
  return payload.result;
}

for (const [file, label] of shots) {
  const src = `${BASE}/${file}.png`;
  const html = `<img layer-name="${label}" src="paper-asset:///${src}" style="width: 1440px; height: 900px; display: block;" />`;
  const result = await call("write_html", { fileId: FILE_ID, targetNodeId: TARGET, mode: "insert-children", html });
  console.log("inserted", label, result.content?.[0]?.text?.slice(0, 120));
}

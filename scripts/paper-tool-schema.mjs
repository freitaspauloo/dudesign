import fs from "node:fs/promises";
const res = await fetch("http://127.0.0.1:29979/mcp", {
  method: "POST",
  headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream" },
  body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list", params: {} }),
});
const text = await res.text();
const dataLine = text.split("\n").find((l) => l.startsWith("data: "));
const tools = JSON.parse(dataLine.slice(6)).result.tools;
for (const name of process.argv.slice(2)) {
  const t = tools.find((x) => x.name === name);
  console.log(JSON.stringify(t, null, 2));
}

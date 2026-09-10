import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RELAY = "http://127.0.0.1:29979/mcp";
const FILE_ID = "01M24F81DKMGKVSDRNH67HD222";
const PAPER_DIR = path.join(__dirname, "..", "clients", "conifer", "paper", "redesign").replace(/\\/g, "/");

async function call(tool, args) {
  const res = await fetch(RELAY, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: { name: tool, arguments: args },
    }),
  });
  const text = await res.text();
  const line = text.split("\n").find((l) => l.startsWith("data: "));
  if (!line) throw new Error(text.slice(0, 500));
  const payload = JSON.parse(line.slice(6));
  if (payload.error) throw new Error(JSON.stringify(payload.error));
  return payload.result;
}

const shots = [
  ["01-hero", "Hero — light + Geist + install-first"],
  ["02-tree", "ASCII bonsai — vertical"],
  ["03-routing", "Route diagram"],
  ["04-explore", "Explore + steps"],
  ["05-footer", "Footer + final CTA"],
];

// new artboard to the right of "Current — conifer.build" (worldX ends at 720)
const artboard = await call("create_artboard", {
  fileId: FILE_ID,
  name: "Redesign — light hero",
  styles: {
    display: "flex",
    flexDirection: "column",
    width: "1440px",
    height: "5200px",
    backgroundColor: "#f2f2f4",
    padding: "0px",
    gap: "0px",
    position: "absolute",
    left: "800px",
    top: "-2600px",
  },
});

const text = artboard.content?.[0]?.text || "";
const match = text.match(/"id"\s*:\s*"([^"]+)"/) || text.match(/id[":\s]+([0-9]+-[0-9]+|[A-Z0-9-]+)/i);
console.log("artboard response:", text.slice(0, 400));

let targetId = match?.[1];
if (!targetId) {
  const info = await call("get_basic_info", { fileId: FILE_ID, pageId: "1-0" });
  const parsed = JSON.parse(info.content[0].text);
  targetId = parsed.artboards.find((a) => a.name === "Redesign — light hero")?.id;
}
if (!targetId) throw new Error("Could not resolve new artboard id");

console.log("target artboard:", targetId);

const header = `<div layer-name="Label" style="display: flex; flexDirection: column; width: 1440px; padding: 24px 32px; backgroundColor: #1a1814; gap: 4px;"><span style="fontFamily: Inter, sans-serif; fontSize: 11px; fontWeight: 600; letterSpacing: 0.08em; textTransform: uppercase; color: #a39e94;">Redesign · Sep 9 2026</span><span style="fontFamily: Inter, sans-serif; fontSize: 20px; fontWeight: 600; color: #f2f0eb;">Light hero — ASCII bonsai vertical</span><span style="fontFamily: Inter, sans-serif; fontSize: 13px; color: #c8beaa;">Geist + Geist Mono · original palette · localhost:4322</span></div>`;
await call("write_html", { fileId: FILE_ID, targetNodeId: targetId, mode: "insert-children", html: header });
console.log("inserted header");

for (const [file, label] of shots) {
  const src = `${PAPER_DIR}/${file}.png`;
  const html = `<img layer-name="${label}" src="paper-asset:///${src}" style="width: 1440px; height: 900px; display: block;" />`;
  const result = await call("write_html", {
    fileId: FILE_ID,
    targetNodeId: targetId,
    mode: "insert-children",
    html,
  });
  console.log("inserted", label, result.content?.[0]?.text?.slice(0, 100));
}

console.log("done", targetId);

#!/usr/bin/env node
/** Static server for clients/conifer/<dir>
 *  node scripts/serve-conifer.mjs              → site/         on 4321 (mirror)
 *  node scripts/serve-conifer.mjs redesign     → redesign/     on 4322
 *  node scripts/serve-conifer.mjs redesign-v2  → redesign-v2/  on 4323
 *  node scripts/serve-conifer.mjs redesign-v3  → redesign-v3/  on 4324  (100% ascii)
 *  node scripts/serve-conifer.mjs redesign-v4  → redesign-v4/  on 4325  (vector)
 */
import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = process.argv[2] || "site";
const ROOT = path.join(__dirname, "..", "clients", "conifer", DIR);
const PORTS = { site: 4321, redesign: 4322, "redesign-v2": 4323, "redesign-v3": 4324, "redesign-v4": 4325 };
const PORT = Number(process.env.PORT) || PORTS[DIR] || 4322;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".mp4": "video/mp4",
  ".txt": "text/plain; charset=utf-8",
  ".sh": "text/plain; charset=utf-8",
  ".ps1": "text/plain; charset=utf-8",
};

async function resolveFile(urlPath) {
  let p = decodeURIComponent(urlPath.split("?")[0]);
  if (p === "/") p = "/index.html";
  const file = path.join(ROOT, p.replace(/^\//, "").replace(/\.\./g, ""));
  try {
    const st = await fs.stat(file);
    if (st.isDirectory()) {
      const idx = path.join(file, "index.html");
      await fs.access(idx);
      return idx;
    }
    return file;
  } catch {
    return null;
  }
}

const server = http.createServer(async (req, res) => {
  const file = await resolveFile(req.url || "/");
  if (!file) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
    return;
  }
  const ext = path.extname(file).toLowerCase();
  const body = await fs.readFile(file);
  res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
  res.end(body);
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Conifer ${DIR} → http://127.0.0.1:${PORT}`);
});

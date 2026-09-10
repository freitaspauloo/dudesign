#!/usr/bin/env node
/**
 * Mirror conifer.build into clients/conifer/site for local redesign work.
 * Downloads HTML, CSS, JS, fonts, and images; rewrites paths for offline use.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "clients", "conifer", "site");
const BASE = "https://www.conifer.build";
const MAX_ASSETS = 500;

const seen = new Set();
const queue = [];
let downloaded = 0;

function normalizePath(urlPath) {
  if (!urlPath || urlPath.startsWith("data:") || urlPath.startsWith("blob:")) return null;
  if (urlPath.startsWith("//")) urlPath = "https:" + urlPath;
  if (urlPath.startsWith("http://") || urlPath.startsWith("https://")) {
    try {
      const u = new URL(urlPath);
      if (u.hostname !== "www.conifer.build" && u.hostname !== "conifer.build") return null;
      urlPath = u.pathname + u.search;
    } catch {
      return null;
    }
  }
  if (urlPath.startsWith("#") || urlPath.startsWith("mailto:") || urlPath.startsWith("javascript:")) return null;
  const clean = urlPath.split("#")[0].split("?")[0];
  if (!clean || clean === "/") return "/index.html";
  return clean.startsWith("/") ? clean : "/" + clean;
}

function localFileFor(urlPath) {
  const p = urlPath === "/" ? "/index.html" : urlPath;
  if (p.endsWith("/")) return path.join(OUT_DIR, p.slice(1), "index.html");
  if (!path.extname(p)) return path.join(OUT_DIR, p.slice(1), "index.html");
  return path.join(OUT_DIR, p.slice(1));
}

function extractUrls(content, kind) {
  const urls = new Set();
  if (kind === "html" || kind === "css") {
    for (const m of content.matchAll(/(?:href|src)=["']([^"']+)["']/g)) urls.add(m[1]);
    for (const m of content.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) urls.add(m[1]);
  }
  if (kind === "js") {
    for (const m of content.matchAll(/["'](\/[^"'\\]+?)["']/g)) urls.add(m[1]);
  }
  return [...urls];
}

function enqueue(raw) {
  const p = normalizePath(raw);
  if (!p || seen.has(p)) return;
  seen.add(p);
  queue.push(p);
}

async function fetchAsset(urlPath) {
  const url = BASE + (urlPath === "/index.html" ? "/" : urlPath);
  const res = await fetch(url, {
    headers: { "User-Agent": "dudesign-mirror/1.0 (+local redesign reference)" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const ct = res.headers.get("content-type") || "";
  return { buf, ct };
}

async function saveFile(filePath, buf) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, buf);
}

function rewriteContent(content, kind) {
  let out = content;
  const replacePath = (raw) => {
    const p = normalizePath(raw);
    if (!p) return raw;
    const local = p === "/index.html" ? "./index.html" : "." + p;
    return local;
  };

  if (kind === "html") {
    out = out.replace(/((?:href|src)=["'])(\/[^"']+)(["'])/g, (_, a, p, c) => a + replacePath(p) + c);
    out = out.replace(/((?:href|src)=["'])(https:\/\/www\.conifer\.build\/[^"']+)(["'])/g, (_, a, u, c) => {
      const p = normalizePath(u);
      return p ? a + replacePath(p) + c : a + u + c;
    });
  }
  if (kind === "css") {
    out = out.replace(/url\(\s*["']?(\/[^"')]+)["']?\s*\)/g, (_, p) => `url("${replacePath(p)}")`);
    out = out.replace(/url\(\s*["']?(https:\/\/www\.conifer\.build\/[^"')]+)["']?\s*\)/g, (_, u) => {
      const p = normalizePath(u);
      return p ? `url("${replacePath(p)}")` : `url("${u}")`;
    });
  }
  return out;
}

async function processAsset(urlPath) {
  const filePath = localFileFor(urlPath);
  const ext = path.extname(urlPath).toLowerCase();
  const { buf, ct } = await fetchAsset(urlPath);

  let kind = "bin";
  if (ext === ".html" || urlPath === "/index.html" || ct.includes("text/html")) kind = "html";
  else if (ext === ".css" || ct.includes("text/css")) kind = "css";
  else if (ext === ".js" || ct.includes("javascript")) kind = "js";

  let toWrite = buf;
  if (kind !== "bin") {
    let text = buf.toString("utf8");
    for (const u of extractUrls(text, kind)) enqueue(u);
    text = rewriteContent(text, kind);
    toWrite = Buffer.from(text, "utf8");
  }

  await saveFile(filePath, toWrite);
  downloaded += 1;
  process.stdout.write(`\r  ${downloaded} files — ${urlPath.slice(0, 60).padEnd(60)}`);
}

async function main() {
  console.log("Mirroring", BASE, "→", OUT_DIR);
  await fs.rm(OUT_DIR, { recursive: true, force: true });
  await fs.mkdir(OUT_DIR, { recursive: true });

  enqueue("/");
  enqueue("/index.html");
  enqueue("/favicon.ico");
  enqueue("/icon.png");
  enqueue("/apple-icon.png");
  enqueue("/opengraph-image.png");

  while (queue.length && downloaded < MAX_ASSETS) {
    const batch = queue.splice(0, 8);
    await Promise.all(
      batch.map(async (p) => {
        try {
          await processAsset(p);
        } catch (e) {
          console.warn(`\n  skip ${p}: ${e.message}`);
        }
      }),
    );
  }

  console.log(`\nDone. ${downloaded} files in clients/conifer/site/`);

  const meta = {
    source: BASE,
    mirroredAt: new Date().toISOString(),
    files: downloaded,
    note: "Local reference clone for redesign work. Not for public redistribution.",
  };
  await fs.writeFile(path.join(ROOT, "clients", "conifer", "MIRROR.json"), JSON.stringify(meta, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

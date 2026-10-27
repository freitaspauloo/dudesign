#!/usr/bin/env node
/**
 * Export Aligned AI gallery frames from Figma as PNGs.
 *
 * Usage:
 *   FIGMA_ACCESS_TOKEN=figd_... node scripts/export-figma-aligned.mjs
 *
 * Get a token: Figma → Settings → Security → Personal access tokens
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "work", "cases", "aligned-ai");

const FILE_KEY = "x2WwbpezaVTEHpXAQkKe8q";
const SECTION_NODE = "1452:1561";

/** Frame name in Figma → output filename (without extension) */
const TARGETS = {
  "desktop 2": "desktop-workspace",
  "mobile 1": "mobile-workspace",
  "desktop 5": "consumer-landing",
  "lp video": "enterprise-landing",
};

const TOKEN = process.env.FIGMA_ACCESS_TOKEN || process.env.FIGMA_TOKEN;
if (!TOKEN) {
  console.error(
    "Missing FIGMA_ACCESS_TOKEN. Create one at https://www.figma.com/settings → Security.",
  );
  process.exit(1);
}

async function figma(pathname) {
  const res = await fetch(`https://api.figma.com/v1${pathname}`, {
    headers: { "X-Figma-Token": TOKEN },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${pathname} → ${res.status}: ${text.slice(0, 300)}`);
  }
  return res.json();
}

function walk(node, visit) {
  visit(node);
  for (const child of node.children ?? []) walk(child, visit);
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  const { nodes } = await figma(
    `/files/${FILE_KEY}/nodes?ids=${encodeURIComponent(SECTION_NODE)}&depth=8`,
  );
  const root = nodes[SECTION_NODE]?.document;
  if (!root) throw new Error(`Section node ${SECTION_NODE} not found`);

  const byName = new Map();
  walk(root, (node) => {
    if (node.type === "FRAME" || node.type === "COMPONENT") {
      const key = node.name?.trim().toLowerCase();
      if (key && TARGETS[node.name.trim()] && !byName.has(node.name.trim())) {
        byName.set(node.name.trim(), node.id);
      }
    }
  });

  const missing = Object.keys(TARGETS).filter((name) => !byName.has(name));
  if (missing.length) {
    console.warn("Could not find frames:", missing.join(", "));
    console.warn(
      "Available frame names under section:",
      [...byName.keys()].join(", ") || "(none matched)",
    );
  }

  const ids = [...byName.values()];
  if (!ids.length) throw new Error("No target frames resolved");

  const { images } = await figma(
    `/images/${FILE_KEY}?ids=${ids.map(encodeURIComponent).join(",")}&format=png&scale=2`,
  );

  for (const [name, outBase] of Object.entries(TARGETS)) {
    const nodeId = byName.get(name);
    if (!nodeId) continue;
    const url = images[nodeId];
    if (!url) {
      console.warn(`No image URL for ${name} (${nodeId})`);
      continue;
    }
    const imgRes = await fetch(url);
    if (!imgRes.ok) throw new Error(`Download failed for ${name}`);
    const buf = Buffer.from(await imgRes.arrayBuffer());
    const outPath = path.join(OUT_DIR, `${outBase}.png`);
    await fs.writeFile(outPath, buf);
    console.log(`✓ ${name} → ${path.relative(ROOT, outPath)} (${buf.length} bytes)`);
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});

#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "public/work/cases/aligned-ai/_section-capture.png");
const OUT = path.join(ROOT, "public/work/cases/aligned-ai");

/** Figma frame names → gallery filenames (from node 1452:1561 overview @2880×1760) */
const CROPS = [
  {
    name: "desktop 2",
    out: "desktop-workspace.png",
    extract: { left: 930, top: 488, width: 250, height: 96 },
    resize: { width: 2880, height: 1736 },
  },
  {
    name: "mobile 1",
    out: "mobile-workspace.png",
    extract: { left: 1440, top: 345, width: 470, height: 100 },
    resize: { width: 1560, height: 940 },
  },
];

for (const crop of CROPS) {
  let pipeline = sharp(SRC).extract(crop.extract);
  if (crop.resize) {
    pipeline = pipeline.resize(crop.resize.width, crop.resize.height, {
      kernel: sharp.kernel.lanczos3,
    });
  }
  const outPath = path.join(OUT, crop.out);
  await pipeline.png({ compressionLevel: 9 }).toFile(outPath);
  const stat = await fs.stat(outPath);
  const meta = await sharp(outPath).metadata();
  console.log(
    `✓ ${crop.name} → ${crop.out} (${meta.width}×${meta.height}, ${stat.size} bytes)`,
  );
}

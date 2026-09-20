#!/usr/bin/env node
/**
 * Crop desktop 2 + mobile 1 from a Figma section screenshot (2880×1760 @2x).
 * Coordinates measured from dubranding-general-file node 1452:1561 at 7% zoom.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC =
  process.argv[2] ??
  path.join(ROOT, "public/work/cases/aligned-ai/_section-capture.png");
const OUT = path.join(ROOT, "public/work/cases/aligned-ai");

/** @type {{ out: string; extract: sharp.Region; resize?: { width: number; height: number } }[]} */
const CROPS = [
  {
    out: "desktop-workspace.png",
    // "desktop 2" — second frame, left column
    extract: { left: 612, top: 468, width: 186, height: 112 },
    resize: { width: 2880, height: 1736 },
  },
  {
    out: "mobile-workspace.png",
    // "mobile 1" — top frame, right column (two phones)
    extract: { left: 1008, top: 468, width: 186, height: 112 },
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
  await pipeline.png({ compressionLevel: 9 }).toFile(path.join(OUT, crop.out));
  const meta = await sharp(path.join(OUT, crop.out)).metadata();
  console.log(`✓ ${crop.out} → ${meta.width}×${meta.height}`);
}

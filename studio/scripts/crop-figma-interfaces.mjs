#!/usr/bin/env node
/** Crop desktop 2 + mobile 1 from Figma overview (2650×1490). */
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC =
  process.argv[2] ??
  "C:/Users/PAULOF~1/AppData/Local/Temp/cursor/screenshots/page-2026-09-20T11-46-56-814Z.png";
const OUT = path.join(ROOT, "public/work/cases/aligned-ai");

const CROPS = [
  {
    out: "desktop-workspace.png",
    extract: { left: 718, top: 488, width: 158, height: 98 },
    resize: { width: 1440, height: 900 },
  },
  {
    out: "mobile-workspace.png",
    extract: { left: 948, top: 628, width: 178, height: 118 },
    resize: { width: 780, height: 1688 },
  },
];

for (const crop of CROPS) {
  await sharp(SRC)
    .extract(crop.extract)
    .resize(crop.resize.width, crop.resize.height, {
      kernel: sharp.kernel.lanczos3,
      fit: "contain",
      background: { r: 245, g: 245, b: 245 },
    })
    .png()
    .toFile(path.join(OUT, crop.out));
  console.log("Wrote", crop.out);
}

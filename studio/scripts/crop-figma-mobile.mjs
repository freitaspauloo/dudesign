#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = process.argv[2];
const OUT = path.join(ROOT, "public/work/cases/aligned-ai/mobile-workspace.png");

// mobile 1 frame from Figma overview (2650×1490 screenshot)
const crop = { left: 930, top: 640, width: 170, height: 200 };

await sharp(SRC)
  .extract(crop)
  .resize(780, 1688, { fit: "contain", background: "#f5f5f5" })
  .png()
  .toFile(OUT);

console.log("Wrote", OUT);

#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC =
  "c:/Users/Paulo Freitas/Projects/paulo-portfolio/public/work/cases/aligned-ai/_section-capture.png";
const OUT = "c:/Users/Paulo Freitas/Projects/paulo-portfolio/public/work/cases/aligned-ai/_probes";

await fs.mkdir(OUT, { recursive: true });

const desktopCandidates = [
  { left: 930, top: 488, width: 250, height: 96 },
  { left: 940, top: 495, width: 235, height: 88 },
  { left: 925, top: 502, width: 245, height: 92 },
  { left: 935, top: 478, width: 240, height: 100 },
];

const mobileCandidates = [
  { left: 1505, top: 392, width: 250, height: 110 },
  { left: 1515, top: 400, width: 240, height: 102 },
  { left: 1525, top: 408, width: 230, height: 96 },
  { left: 1495, top: 385, width: 260, height: 115 },
];

for (const [i, c] of desktopCandidates.entries()) {
  await sharp(SRC)
    .extract(c)
    .resize(2880, 1736)
    .toFile(path.join(OUT, `desktop-${i}.png`));
}

for (const [i, c] of mobileCandidates.entries()) {
  await sharp(SRC)
    .extract(c)
    .resize(1560, 940)
    .toFile(path.join(OUT, `mobile-${i}.png`));
}

console.log("done");

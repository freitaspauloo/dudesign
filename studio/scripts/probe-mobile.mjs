#!/usr/bin/env node
import path from "node:path";
import sharp from "sharp";

const SRC =
  "c:/Users/Paulo Freitas/Projects/paulo-portfolio/public/work/cases/aligned-ai/_section-capture.png";
const OUT = "c:/Users/Paulo Freitas/Projects/paulo-portfolio/public/work/cases/aligned-ai/_probes";

const candidates = [
  { left: 1440, top: 352, width: 470, height: 88 },
  { left: 1440, top: 358, width: 470, height: 82 },
  { left: 1440, top: 362, width: 470, height: 78 },
  { left: 1440, top: 368, width: 470, height: 72 },
  { left: 1438, top: 355, width: 475, height: 85 },
  { left: 1442, top: 360, width: 468, height: 80 },
];

for (const [i, c] of candidates.entries()) {
  await sharp(SRC)
    .extract(c)
    .resize(1560, 940)
    .toFile(path.join(OUT, `mobile-tune-${i}.png`));
}
console.log("done");

#!/usr/bin/env node
import sharp from "sharp";

const SRC =
  "c:/Users/Paulo Freitas/Projects/paulo-portfolio/public/work/cases/aligned-ai/_section-capture.png";
const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width } = info;

function px(x, y) {
  const i = (y * width + x) * 4;
  return [data[i], data[i + 1], data[i + 2]];
}

function isGray(x, y) {
  const [r, g, b] = px(x, y);
  return r > 85 && r < 105 && g > 85 && g < 105 && b > 85 && b < 105;
}

function scanRow(y) {
  let runs = [];
  let start = null;
  for (let x = 0; x < width; x++) {
    const gray = isGray(x, y);
    if (!gray && start === null) start = x;
    if (gray && start !== null) {
      runs.push({ left: start, width: x - start });
      start = null;
    }
  }
  if (start !== null) runs.push({ left: start, width: width - start });
  return runs.filter((r) => r.width > 40);
}

for (const y of [340, 350, 360, 370, 380, 390, 400, 410, 650, 660, 670, 680, 690, 700]) {
  console.log(`y=${y}`, scanRow(y).slice(0, 8));
}

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

for (let y = 300; y < 750; y++) {
  let gray = 0;
  for (let x = 1440; x < 1980; x++) if (isGray(x, y)) gray++;
  if (gray < 50) console.log(`content y=${y} gray=${gray}`);
}

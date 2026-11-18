#!/usr/bin/env node
import sharp from "sharp";

const SRC =
  "c:/Users/Paulo Freitas/Projects/paulo-portfolio/public/work/cases/aligned-ai/_section-capture.png";
const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;

function px(x, y) {
  const i = (y * width + x) * 4;
  return [data[i], data[i + 1], data[i + 2]];
}

function isContent(x, y) {
  const [r, g, b] = px(x, y);
  return !(r > 85 && r < 105 && g > 85 && g < 105 && b > 85 && b < 105);
}

// Find content bounding box (non-gray canvas)
let minX = width,
  maxX = 0,
  minY = height,
  maxY = 0;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (isContent(x, y)) {
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  }
}
console.log("content bbox", { minX, maxX, minY, maxY, w: maxX - minX, h: maxY - minY });

// Horizontal projection of white-ish pixels (frame UI)
for (let y = 300; y < 1200; y += 20) {
  let whites = 0;
  for (let x = minX; x <= maxX; x++) {
    const [r, g, b] = px(x, y);
    if (r > 240 && g > 240 && b > 240) whites++;
  }
  if (whites > 30) console.log(`y=${y} whiteRun=${whites}`);
}

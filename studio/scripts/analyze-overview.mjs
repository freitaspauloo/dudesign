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

// Find green selection border pixels
let minX = width,
  maxX = 0,
  minY = height,
  maxY = 0,
  green = 0;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const [r, g, b] = px(x, y);
    if (g > 180 && r < 80 && b < 80) {
      green++;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  }
}
console.log("green bbox", { minX, maxX, minY, maxY, green });

// Sample a grid to locate non-gray content
for (const y of [300, 400, 500, 600, 700, 800]) {
  let line = `${y}: `;
  for (const x of [400, 500, 600, 700, 800, 900, 1000, 1100, 1200]) {
    const [r, g, b] = px(x, y);
    line += `[${x}]=${r},${g},${b} `;
  }
  console.log(line);
}

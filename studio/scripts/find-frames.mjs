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

function isGray(x, y) {
  const [r, g, b] = px(x, y);
  return r > 85 && r < 105 && g > 85 && g < 105 && b > 85 && b < 105;
}

function colProfile(x0, x1) {
  const gaps = [];
  let inGap = false;
  let gapStart = 0;
  for (let y = 300; y < 1200; y++) {
    let grayCount = 0;
    for (let x = x0; x <= x1; x++) if (isGray(x, y)) grayCount++;
    const gap = grayCount > (x1 - x0) * 0.85;
    if (gap && !inGap) {
      inGap = true;
      gapStart = y;
    }
    if (!gap && inGap) {
      gaps.push({ top: gapStart, bottom: y - 1, height: y - gapStart });
      inGap = false;
    }
  }
  return gaps.filter((g) => g.height > 8 && g.height < 40);
}

function frameBlocks(x0, x1) {
  const gaps = colProfile(x0, x1);
  const frames = [];
  let prev = 300;
  for (const g of gaps) {
    if (g.top - prev > 50) {
      frames.push({ top: prev, bottom: g.top - 1, height: g.top - prev });
    }
    prev = g.bottom + 1;
  }
  if (1200 - prev > 50) frames.push({ top: prev, bottom: 1199, height: 1199 - prev });
  return { gaps, frames };
}

console.log("left col", frameBlocks(920, 1180));
console.log("right col", frameBlocks(1450, 1750));

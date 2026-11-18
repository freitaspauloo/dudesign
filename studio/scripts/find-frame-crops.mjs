#!/usr/bin/env node
/** Scan overview PNG for light UI frame blobs and print bounding boxes. */
import sharp from "sharp";

const SRC =
  process.argv[2] ??
  "c:/Users/Paulo Freitas/Projects/paulo-portfolio/public/work/cases/aligned-ai/_section-capture.png";

const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height } = info;
const visited = new Uint8Array(width * height);
const blobs = [];

function idx(x, y) {
  return y * width + x;
}

function isFramePixel(x, y) {
  const i = (y * width + x) * 4;
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  // Light UI chrome / white frame interiors in overview thumbnails
  return r > 210 && g > 210 && b > 210;
}

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const p = idx(x, y);
    if (visited[p] || !isFramePixel(x, y)) continue;

    let minX = x,
      maxX = x,
      minY = y,
      maxY = y,
      count = 0;
    const stack = [[x, y]];

    while (stack.length) {
      const [cx, cy] = stack.pop();
      const cp = idx(cx, cy);
      if (cx < 0 || cy < 0 || cx >= width || cy >= height) continue;
      if (visited[cp] || !isFramePixel(cx, cy)) continue;
      visited[cp] = 1;
      count++;
      minX = Math.min(minX, cx);
      maxX = Math.max(maxX, cx);
      minY = Math.min(minY, cy);
      maxY = Math.max(maxY, cy);
      stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
    }

    const w = maxX - minX + 1;
    const h = maxY - minY + 1;
    if (w < 80 || h < 50 || w > 260 || h > 160 || count < 2000) continue;
    blobs.push({ left: minX, top: minY, width: w, height: h, count });
  }
}

blobs.sort((a, b) => a.top - b.top || a.left - b.left);
console.log(JSON.stringify(blobs, null, 2));

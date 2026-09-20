/**
 * One-off: re-encode oversized raster art in public/ as WebP.
 * Case mockups were shipped as 15-20 MB PNGs, which is unusable for LCP.
 * Caps the long edge at 2400px — well above any layout slot at 2x DPR.
 */
import { readdir, stat, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join(process.cwd(), "public");
const MIN_BYTES = 400 * 1024;
const MAX_EDGE = 2400;
const QUALITY = 82;

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (/\.(png|jpe?g)$/i.test(entry.name)) out.push(full);
  }
  return out;
}

const files = await walk(ROOT);
let saved = 0;

for (const file of files) {
  const { size } = await stat(file);
  if (size < MIN_BYTES) continue;

  const target = file.replace(/\.(png|jpe?g)$/i, ".webp");
  await sharp(file)
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(target);

  const after = (await stat(target)).size;
  saved += size - after;
  console.log(
    `${path.relative(ROOT, file)}  ${(size / 1024 / 1024).toFixed(1)}MB -> ${(after / 1024).toFixed(0)}KB`,
  );
  await unlink(file);
}

console.log(`\nsaved ${(saved / 1024 / 1024).toFixed(1)} MB`);

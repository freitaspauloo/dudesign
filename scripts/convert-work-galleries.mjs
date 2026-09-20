import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const srcRoot = "c:/Users/Paulo Freitas/Projects/dudesign/scripts/behance-assets";
const destRoot = path.join(process.cwd(), "portfolio/public/work/cases");

const map = {
  "01-3M-Films": "3m-films",
  "02-Ford": "ford",
  "03-Afeela": "afeela",
  "04-Audi-3M-Samsung": "iaa",
  "05-Costco": "costco",
};

for (const [from, to] of Object.entries(map)) {
  const dest = path.join(destRoot, to);
  fs.mkdirSync(dest, { recursive: true });
  const files = fs
    .readdirSync(path.join(srcRoot, from))
    .filter((f) => f.toLowerCase().endsWith(".png"))
    .sort();
  for (const file of files) {
    const src = path.join(srcRoot, from, file);
    const size = fs.statSync(src).size;
    if (size < 80 * 1024) {
      console.log("skip tiny", from, file);
      continue;
    }
    const out = path.join(dest, file.replace(/\.png$/i, ".webp"));
    await sharp(src)
      .resize({ width: 2400, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(out);
    const kb = Math.round(fs.statSync(out).size / 1024);
    console.log(`${to}/${path.basename(out)} ${kb}kb`);
  }
}

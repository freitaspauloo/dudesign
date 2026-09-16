const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const src = path.join("scripts", "behance-assets");
const dest = path.join("scripts", "behance-assets-upload");

async function run() {
  for (const folder of fs.readdirSync(src)) {
    const folderPath = path.join(src, folder);
    if (!fs.statSync(folderPath).isDirectory() || !/^\d{2}-/.test(folder)) continue;
    const outFolder = path.join(dest, folder);
    fs.mkdirSync(outFolder, { recursive: true });
    for (const file of fs.readdirSync(folderPath)) {
      const full = path.join(folderPath, file);
      if (file.endsWith(".png")) {
        await sharp(full)
          .resize({ width: 1600, withoutEnlargement: true })
          .jpeg({ quality: 86, mozjpeg: true })
          .toFile(path.join(outFolder, file.replace(/\.png$/i, ".jpg")));
      } else if (file.endsWith(".txt")) {
        fs.copyFileSync(full, path.join(outFolder, file));
      }
    }
  }
  if (fs.existsSync(path.join(src, "00-COMECE-AQUI.txt"))) {
    fs.mkdirSync(dest, { recursive: true });
    fs.copyFileSync(path.join(src, "00-COMECE-AQUI.txt"), path.join(dest, "00-COMECE-AQUI.txt"));
  }
}

run().then(() => console.log("done")).catch(e => { console.error(e); process.exit(1); });

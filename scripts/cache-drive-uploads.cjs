const fs = require("fs");
const path = require("path");
const map = {
  "01-3M-Films": "1bSwny3-XftWxG52ELiZIO3fZ_PRWLRzH",
  "02-Ford": "1BK51vb5zUXDmA2ofb8Q2o_bkkd-vHvsO",
  "03-Afeela": "1AIrHE8HF3yGl_btdRAx6F5IaYWuAcgPT",
  "04-Audi-3M-Samsung": "1UVHd-a9bClelEQYetwpQAJDFqSXD0kwi",
  "05-Costco": "13_g0etYSyNf4P9P73GS31T5lyWZBnLS3",
};
const src = path.join("scripts", "behance-assets-upload");
const cache = path.join("scripts", "drive-upload-cache");
fs.mkdirSync(cache, { recursive: true });
let n = 0;
for (const folder of fs.readdirSync(src).sort()) {
  if (!map[folder]) continue;
  const parentId = map[folder];
  for (const file of fs.readdirSync(path.join(src, folder)).filter((f) => f.endsWith(".jpg")).sort()) {
    const b64 = fs.readFileSync(path.join(src, folder, file)).toString("base64");
    const key = `${folder}__${file}`;
    fs.writeFileSync(path.join(cache, key + ".json"), JSON.stringify({ title: file, parentId, contentMimeType: "image/jpeg", disableConversionToGoogleType: true, base64Content: b64 }));
    n++;
  }
}
console.log("cached", n, "files");

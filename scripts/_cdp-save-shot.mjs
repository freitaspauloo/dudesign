import fs from "node:fs";
const [jsonPath, outPath] = process.argv.slice(2);
const j = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const d = j.data || j.result?.data;
if (!d) throw new Error("no image data");
fs.writeFileSync(outPath, Buffer.from(d, "base64"));
console.log("wrote", outPath);

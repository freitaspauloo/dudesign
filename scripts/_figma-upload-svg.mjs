import fs from "node:fs";

const url = process.argv[2];
const filePath = process.argv[3];
if (!url || !filePath) {
  console.error("Usage: node _figma-upload-svg.mjs <submitUrl> <svgPath>");
  process.exit(1);
}

const body = fs.readFileSync(filePath);
const res = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "image/svg+xml" },
  body,
});
const text = await res.text();
console.log("status", res.status);
console.log(text);

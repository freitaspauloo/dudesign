import fs from "node:fs";
const h = fs.readFileSync("site/index.html", "utf8");
const svgs = [...h.matchAll(/<svg[\s\S]*?<\/svg>/g)].map((m) => m[0]);
const wm = svgs.find((s) => s.includes("1120 510") || s.includes("viewBox=\"0 0 1120"));
if (wm) fs.writeFileSync("assets/conifer-wordmark.svg", wm);
console.log(wm ? `wordmark ${wm.length} chars` : "none");

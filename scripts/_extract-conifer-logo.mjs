import fs from "node:fs";

const h = fs.readFileSync("site/index.html", "utf8");
const svgs = [...h.matchAll(/<svg[\s\S]*?<\/svg>/g)].map((m) => m[0]);
fs.mkdirSync("assets", { recursive: true });

const ranked = svgs
  .map((s, i) => ({ i, len: s.length, paths: (s.match(/<path/g) || []).length, s }))
  .sort((a, b) => b.paths - a.paths || b.len - a.len);

console.log(
  ranked
    .slice(0, 8)
    .map((x) => `#${x.i} paths=${x.paths} len=${x.len} vb=${x.s.match(/viewBox="([^"]+)"/)?.[1]}`)
    .join("\n"),
);

const best = ranked[0];
fs.writeFileSync("assets/conifer-mark.svg", best.s);
console.log("\nWrote conifer-mark.svg", best.paths, "paths");

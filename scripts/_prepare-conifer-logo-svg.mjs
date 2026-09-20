import fs from "node:fs";

let svg = fs.readFileSync("assets/conifer-mark.svg", "utf8");

// Figma-friendly standalone SVG with fixed colors (matches icon.png)
svg = svg
  .replace(/class="[^"]*"/g, "")
  .replace(/style="[^"]*"/g, "")
  .replace(/role="[^"]*"/g, "")
  .replace(/aria-hidden="[^"]*"/g, "")
  .replace(/width="[^"]*"/, 'width="512"')
  .replace(/height="[^"]*"/, 'height="512"')
  .replace(/stroke="currentColor"/g, 'stroke="#2a3540"')
  .replace(/stroke="var\(--cyan\)"/g, 'stroke="#6ec4e8"')
  .replace(/stroke-width="0\.32"/g, 'stroke-width="0.32"')
  .replace(/stroke-width="0\.42"/g, 'stroke-width="0.42"');

if (!svg.includes("xmlns")) {
  svg = svg.replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ');
}

const out = "assets/conifer-logo-mark.svg";
fs.writeFileSync(out, svg);
console.log("wrote", out, svg.length, "bytes");

/* Trace the blurred bonsai PNG into a posterized SVG (stacked luminance layers).
   node scripts/_vectorize-bonsai.mjs */
import potrace from "potrace";
import fs from "node:fs";
import path from "node:path";

const SRC = "redesign-v2/assets/bonsai-ascii.png";
const OUT = "redesign-v4/assets/bonsai-vector.svg";

// brightness thresholds (0-255): everything darker than t becomes a layer.
// Background is ~228, so the top threshold stays well below it.
const LAYERS = [
  { threshold: 190, color: "#c2d4e3" },
  { threshold: 160, color: "#a6bed2" },
  { threshold: 130, color: "#87a5bf" },
  { threshold: 100, color: "#6788a6" },
  { threshold: 70, color: "#476a8b" },
  { threshold: 45, color: "#2f5074" },
];

function traceLayer(threshold) {
  return new Promise((resolve, reject) => {
    const t = new potrace.Potrace({
      threshold,
      turdSize: 120,
      alphaMax: 1.3,
      optCurve: true,
      optTolerance: 0.8,
      turnPolicy: potrace.Potrace.TURNPOLICY_MINORITY,
      blackOnWhite: true,
    });
    t.loadImage(SRC, (err) => {
      if (err) return reject(err);
      const svg = t.getSVG();
      const m = svg.match(/width="(\d+)" height="(\d+)"/);
      resolve({ path: t.getPathTag(), w: m ? +m[1] : 0, h: m ? +m[2] : 0 });
    });
  });
}

const layers = [];
let w = 0;
let h = 0;
for (const L of LAYERS) {
  const r = await traceLayer(L.threshold);
  w = r.w;
  h = r.h;
  const d = r.path.match(/d="([^"]+)"/)?.[1] ?? "";
  layers.push(`  <path fill="${L.color}" fill-rule="evenodd" d="${d}"/>`);
  console.log(`layer ${L.threshold}: ${d.length} chars`);
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" shape-rendering="geometricPrecision">
${layers.join("\n")}
</svg>
`;
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, svg);
console.log("wrote", OUT, (svg.length / 1024).toFixed(0), "KB", `${w}x${h}`);

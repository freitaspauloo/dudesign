/* Extract the delta routing diagram from the site mirror. */
import fs from "node:fs";

const html = fs.readFileSync("site/index.html", "utf8");
const marker = 'class="delta-scroll"';
const start = html.indexOf(marker);
if (start < 0) throw new Error("delta-scroll not found");

// walk back to opening div
let open = html.lastIndexOf("<div", start);
const endMarker = "</div></div></div></div>";
const end = html.indexOf(endMarker, start) + endMarker.length;
const block = html.slice(open, end);

// fix asset paths for redesign-v2
const out = block
  .replace(/\.\/icons\//g, "./assets/icons/")
  .replace(/\.\/_next\//g, "../site/_next/");

fs.mkdirSync("redesign-v2/partials", { recursive: true });
fs.writeFileSync("redesign-v2/partials/delta-diagram.html", out);
console.log("wrote", out.length, "bytes");

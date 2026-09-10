import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "clients", "conifer", "moodboard");
const ids = JSON.parse(await fs.readFile(path.join(__dirname, "_moodboard-ids.json"), "utf8"));

await fs.mkdir(OUT, { recursive: true });
let ok = 0;
for (const [id, name] of ids) {
  const url = `https://drive.google.com/uc?export=download&id=${id}`;
  try {
    const res = await fetch(url, { redirect: "follow" });
    const ct = res.headers.get("content-type") || "";
    if (!res.ok || ct.includes("text/html")) {
      console.log("FAIL", name, res.status, ct);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    await fs.writeFile(path.join(OUT, name), buf);
    ok++;
    console.log("ok", name, (buf.length / 1024).toFixed(0) + "KB");
  } catch (e) {
    console.log("ERR", name, e.message);
  }
}
console.log(`${ok}/${ids.length} downloaded`);

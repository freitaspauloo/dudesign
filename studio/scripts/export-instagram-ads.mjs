import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "ads", "exports");
const base = process.env.ADS_BASE ?? "http://127.0.0.1:3001";
const edge =
  process.env.EDGE_PATH ??
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

const ads = [
  { slug: "product-design", file: "01-product-design" },
  { slug: "flows-to-ui", file: "02-flows-to-ui" },
  { slug: "clearer-next-version", file: "03-clearer-next-version" },
];

const formats = [
  { format: "feed", width: 1080, height: 1350, suffix: "" },
  { format: "story", width: 1080, height: 1920, suffix: "-story" },
];

await mkdir(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: edge,
  headless: "new",
});

try {
  for (const ad of ads) {
    for (const spec of formats) {
    const page = await browser.newPage();
    await page.setViewport({
      width: spec.width,
      height: spec.height,
      deviceScaleFactor: 1,
    });
    await page.goto(`${base}/ads/render/${ad.slug}?format=${spec.format}`, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });
    await page.evaluate(async () => {
      document.querySelectorAll("nextjs-portal").forEach((node) => node.remove());
      await document.fonts.ready;
      await Promise.all(
        Array.from(document.images).map(async (img) => {
          if (!img.complete) {
            await new Promise((resolve) => {
              img.onload = resolve;
              img.onerror = resolve;
            });
          }
          try {
            await img.decode();
          } catch {
            /* already decoded or undecodable */
          }
        }),
      );
    });
    const file = path.join(outDir, `${ad.file}${spec.suffix}.png`);
    await page.screenshot({
      path: file,
      clip: { x: 0, y: 0, width: spec.width, height: spec.height },
    });
    console.log(file);
    await page.close();
    }
  }
} finally {
  await browser.close();
}

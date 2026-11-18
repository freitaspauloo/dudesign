import puppeteer from "puppeteer-core";
import { mkdir } from "node:fs/promises";

const EDGE =
  process.env.EDGE_PATH ??
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const OUT = ".shots";
await mkdir(OUT, { recursive: true });

const targets = process.argv.slice(2);
const routes = targets.length ? targets : ["", "/work", "/about", "/resume"];

const browser = await puppeteer.launch({ executablePath: EDGE, headless: "new" });
for (const route of routes) {
  for (const w of [1280, 390]) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: w === 390 ? 844 : 900 });
    await page.goto("http://localhost:2000/paulo" + route, { waitUntil: "networkidle2" });
    await page.evaluate(async () => {
      document.documentElement.style.scrollBehavior = "auto";
      const step = innerHeight * 0.5;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo({ top: y, behavior: "instant" });
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    await new Promise((r) => setTimeout(r, 700));
    const name = (route.replace(/\//g, "-") || "-home").slice(1) || "home";
    await page.screenshot({ path: `${OUT}/${name}-${w}.png`, fullPage: true });
    console.log(`${OUT}/${name}-${w}.png`);
    await page.close();
  }
}
await browser.close();

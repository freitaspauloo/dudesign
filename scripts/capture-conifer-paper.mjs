#!/usr/bin/env node
/** Capture conifer mirror sections at 1440px for Paper reference */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "paper");
const URL = "http://127.0.0.1:4321/";
const WIDTH = 1440;
const VIEWPORT_H = 900;

const { chromium } = await import("playwright");

await fs.mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: WIDTH, height: VIEWPORT_H }, deviceScaleFactor: 2 });
await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

const total = await page.evaluate(() => document.documentElement.scrollHeight);
const sections = [
  { name: "01-hero", y: 0 },
  { name: "02-steps", y: VIEWPORT_H },
  { name: "03-routing", y: VIEWPORT_H * 2 },
  { name: "04-diagram", y: VIEWPORT_H * 3 },
  { name: "05-footer", y: Math.max(0, total - VIEWPORT_H) },
];

for (const s of sections) {
  await page.evaluate((y) => window.scrollTo(0, y), s.y);
  await page.waitForTimeout(400);
  await page.screenshot({
    path: path.join(OUT, `${s.name}.png`),
    clip: { x: 0, y: 0, width: WIDTH, height: VIEWPORT_H },
  });
  console.log("saved", s.name);
}

await page.screenshot({
  path: path.join(OUT, "00-full-page.png"),
  fullPage: true,
});
console.log("saved 00-full-page");

await browser.close();
console.log("done →", OUT);

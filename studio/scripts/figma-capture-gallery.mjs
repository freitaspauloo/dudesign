#!/usr/bin/env node
/**
 * Capture Aligned AI gallery frames from Figma (web) at zoom-to-selection quality.
 * Requires the file to be viewable in browser (logged-in Chrome profile optional).
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "work", "cases", "aligned-ai");

const FIGMA_URL =
  "https://www.figma.com/design/x2WwbpezaVTEHpXAQkKe8q/dubranding-general-file?node-id=1452-1561";

const FRAMES = [
  { search: "desktop 2", out: "desktop-workspace.png" },
  { search: "mobile 1", out: "mobile-workspace.png" },
  { search: "desktop 5", out: "consumer-landing.png" },
  { search: "lp video", out: "enterprise-landing.png" },
];

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  path.join(process.env.LOCALAPPDATA ?? "", "Google", "Chrome", "Application", "chrome.exe"),
].filter(Boolean);

async function resolveChrome() {
  for (const p of CHROME_CANDIDATES) {
    try {
      await fs.access(p);
      return p;
    } catch {
      /* try next */
    }
  }
  throw new Error("Chrome not found. Set CHROME_PATH.");
}

async function dismissModals(page) {
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press("Escape");
    await sleep(200);
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function selectFrame(page, name) {
  await dismissModals(page);
  await page.keyboard.press("v");
  await sleep(200);
  await page.keyboard.down("Control");
  await page.keyboard.press("/");
  await page.keyboard.up("Control");
  await sleep(600);
  await page.keyboard.down("Control");
  await page.keyboard.press("a");
  await page.keyboard.up("Control");
  await page.keyboard.type(name, { delay: 25 });
  await sleep(800);
  await page.keyboard.press("ArrowDown");
  await sleep(200);
  await page.keyboard.press("Enter");
  await sleep(700);
  await page.keyboard.down("Shift");
  await page.keyboard.press("2");
  await page.keyboard.up("Shift");
  await sleep(1200);
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const executablePath = await resolveChrome();

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    defaultViewport: { width: 1600, height: 1000, deviceScaleFactor: 2 },
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--window-size=1600,1000",
    ],
  });

  const page = await browser.newPage();
  page.setDefaultTimeout(120_000);
  await page.goto(FIGMA_URL, { waitUntil: "networkidle2", timeout: 120_000 });
  await sleep(10_000);
  await dismissModals(page);

  for (const frame of FRAMES) {
    console.log(`Capturing ${frame.search}…`);
    await selectFrame(page, frame.search);
    const outPath = path.join(OUT_DIR, frame.out);
    await page.screenshot({
      path: outPath,
      clip: { x: 48, y: 48, width: 1504, height: 904 },
      type: "png",
    });
    const stat = await fs.stat(outPath);
    console.log(`  → ${path.relative(ROOT, outPath)} (${stat.size} bytes)`);
  }

  await browser.close();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

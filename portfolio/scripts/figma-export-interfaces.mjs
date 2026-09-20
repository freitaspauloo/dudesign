#!/usr/bin/env node
/**
 * Export frames using logged-in Chrome profile + double-click zoom.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";
import os from "node:os";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "public", "work", "cases", "aligned-ai");

const URL =
  "https://www.figma.com/design/x2WwbpezaVTEHpXAQkKe8q/dubranding-general-file?node-id=1452-1561";

const FRAMES = [
  { name: "desktop 2", x: 778, y: 488, out: "desktop-workspace.png" },
  { name: "mobile 1", x: 978, y: 648, out: "mobile-workspace.png" },
];

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const USER_DATA = path.join(os.homedir(), "AppData", "Local", "Google", "Chrome", "User Data");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function dismiss(page) {
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press("Escape");
    await sleep(120);
  }
}

async function exportFrame(page, { x, y, out, name }) {
  await dismiss(page);
  await page.keyboard.press("v");
  await sleep(250);
  await page.mouse.click(x, y, { clickCount: 2 });
  await sleep(2200);
  await dismiss(page);

  const outPath = path.join(OUT, out);
  await page.screenshot({
    path: outPath,
    type: "png",
    clip: { x: 64, y: 52, width: 1472, height: 900 },
  });
  const stat = await fs.stat(outPath);
  console.log(`✓ ${name} → ${out} (${stat.size} bytes) url=${page.url()}`);
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });

  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: CHROME,
      headless: false,
      userDataDir: USER_DATA,
      defaultViewport: { width: 1600, height: 1000, deviceScaleFactor: 2 },
      args: [
        "--profile-directory=Default",
        "--no-sandbox",
        "--disable-blink-features=AutomationControlled",
        "--window-size=1600,1000",
      ],
    });
  } catch (err) {
    console.warn("Profile launch failed, using clean Chrome:", err.message);
    browser = await puppeteer.launch({
      executablePath: CHROME,
      headless: false,
      defaultViewport: { width: 1600, height: 1000, deviceScaleFactor: 2 },
      args: ["--no-sandbox", "--disable-blink-features=AutomationControlled"],
    });
  }

  const page = await browser.newPage();
  await page.goto(URL, { waitUntil: "networkidle2", timeout: 120_000 });
  await sleep(14_000);
  await dismiss(page);
  await page.keyboard.press("v");
  await sleep(200);
  await page.keyboard.down("Shift");
  await page.keyboard.press("1");
  await page.keyboard.up("Shift");
  await sleep(1800);

  for (const frame of FRAMES) {
    await exportFrame(page, frame);
    await page.goto(URL, { waitUntil: "networkidle2", timeout: 120_000 });
    await sleep(8000);
    await dismiss(page);
    await page.keyboard.down("Shift");
    await page.keyboard.press("1");
    await page.keyboard.up("Shift");
    await sleep(1200);
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "public", "work", "cases", "aligned-ai");

const CHROME =
  process.env.CHROME_PATH ??
  path.join(process.env.LOCALAPPDATA ?? "", "Google", "Chrome", "Application", "chrome.exe");

async function shot(page, url, outName, viewport, clip) {
  await page.setViewport(viewport);
  await page.goto(url, { waitUntil: "networkidle2", timeout: 90_000 });
  await new Promise((r) => setTimeout(r, 2500));
  try {
    const accept = await page.$('button:has-text("Accept")');
    if (accept) await accept.click();
  } catch {
    /* no cookie banner */
  }
  await new Promise((r) => setTimeout(r, 800));
  const outPath = path.join(OUT, outName);
  await page.screenshot({ path: outPath, type: "png", clip, fullPage: !clip });
  const stat = await fs.stat(outPath);
  console.log(`✓ ${outName} (${stat.size} bytes)`);
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  await shot(page, "https://joinaligned.ai/", "consumer-landing.png", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
  });

  await shot(page, "https://joinaligned.ai/pro", "enterprise-landing.png", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
  });

  await shot(
    page,
    "https://joinaligned.ai/",
    "desktop-workspace.png",
    { width: 1440, height: 900, deviceScaleFactor: 2 },
    { x: 0, y: 0, width: 1440, height: 900 },
  );

  await shot(page, "https://joinaligned.ai/", "mobile-workspace.png", {
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
  });

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

#!/usr/bin/env node
import puppeteer from "puppeteer-core";

const URL =
  "https://www.figma.com/design/x2WwbpezaVTEHpXAQkKe8q/dubranding-general-file?node-id=1452-1561";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const clicks = [
  { name: "desktop 2", x: 778, y: 500 },
  { name: "mobile 1", x: 978, y: 655 },
];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: false,
  defaultViewport: { width: 1600, height: 1000 },
  args: ["--disable-blink-features=AutomationControlled"],
});
const page = await browser.newPage();
await page.goto(URL, { waitUntil: "networkidle2", timeout: 120000 });
await sleep(14000);
for (let i = 0; i < 3; i++) await page.keyboard.press("Escape");
await page.keyboard.press("v");
await sleep(300);
await page.keyboard.down("Shift");
await page.keyboard.press("1");
await page.keyboard.up("Shift");
await sleep(1500);

for (const c of clicks) {
  await page.mouse.click(c.x, c.y);
  await sleep(800);
  const href = page.url();
  console.log(c.name, href);
}

await browser.close();

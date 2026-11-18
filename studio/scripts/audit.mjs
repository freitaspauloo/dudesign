/**
 * One-off consistency audit: walks every route at several viewports and reports
 * horizontal overflow, heading-order jumps, CTA style drift, tiny tap targets,
 * and unstyled/duplicated link treatments.
 */
import puppeteer from "puppeteer-core";

const BASE = "http://localhost:2000/paulo";
const ROUTES = [
  "",
  "/work",
  "/work/aligned-ai",
  "/work/frameline",
  "/work/builtops",
  "/about",
  "/resume",
];
const VIEWPORTS = [
  { name: "390", width: 390, height: 844 },
  { name: "768", width: 768, height: 1024 },
  { name: "1280", width: 1280, height: 900 },
  { name: "1920", width: 1920, height: 1080 },
];

const EDGE =
  process.env.EDGE_PATH ??
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: "new",
  args: ["--no-sandbox"],
});

const findings = [];
const add = (route, vp, kind, detail) =>
  findings.push({ route: route || "/", vp, kind, detail });

for (const route of ROUTES) {
  const page = await browser.newPage();
  for (const vp of VIEWPORTS) {
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto(BASE + route, { waitUntil: "networkidle2" });
    await new Promise((r) => setTimeout(r, 350));
    // Let scroll-triggered reveals fire. scroll-behavior:smooth would swallow
    // rapid programmatic jumps and leave reveals unfired (false positives).
    await page.evaluate(async () => {
      document.documentElement.style.scrollBehavior = "auto";
      const step = innerHeight * 0.5;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo({ top: y, behavior: "instant" });
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo({ top: 0, behavior: "instant" });
      document.documentElement.style.scrollBehavior = "";
    });
    await new Promise((r) => setTimeout(r, 700));

    const res = await page.evaluate(() => {
      const out = {};
      out.overflow =
        document.documentElement.scrollWidth - document.documentElement.clientWidth;

      out.wideNodes = [...document.querySelectorAll("body *")]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.right > document.documentElement.clientWidth + 1;
        })
        .slice(0, 5)
        .map((el) => el.tagName.toLowerCase() + "." + [...el.classList].join("."));

      // heading order
      const hs = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => ({
        level: +h.tagName[1],
        text: h.innerText.trim().slice(0, 40),
      }));
      out.h1Count = hs.filter((h) => h.level === 1).length;
      out.headingJumps = [];
      for (let i = 1; i < hs.length; i++) {
        if (hs[i].level - hs[i - 1].level > 1)
          out.headingJumps.push(`h${hs[i - 1].level}->h${hs[i].level} @ "${hs[i].text}"`);
      }

      // hidden-after-animation check
      out.stillHidden = [...document.querySelectorAll("body *")].filter((el) => {
        const c = getComputedStyle(el);
        return (
          (c.opacity === "0" || c.visibility === "hidden") &&
          el.getBoundingClientRect().height > 4 &&
          !el.closest("[aria-hidden='true']")
        );
      }).length;

      // CTA consistency: every "read case study"-ish affordance
      out.ctas = [...document.querySelectorAll("a,span,button")]
        .filter((el) => /read case study|see the work|get in touch|let.s talk|start a conversation/i.test(el.textContent || ""))
        .filter((el) => !el.querySelector("a,span.btn"))
        .map((el) => {
          const c = getComputedStyle(el);
          return {
            text: el.textContent.trim().slice(0, 30),
            cls: [...el.classList].join("."),
            radius: c.borderRadius,
            padding: c.padding,
            fontSize: c.fontSize,
            hasArrowSvg: !!el.querySelector("svg"),
            literalArrow: /[→↗]/.test(el.textContent),
          };
        });

      // tap targets
      out.smallTargets = [...document.querySelectorAll("a,button")]
        .map((el) => ({ el, r: el.getBoundingClientRect() }))
        .filter(({ r }) => r.height > 0 && r.height < 24)
        .slice(0, 6)
        .map(({ el, r }) => `${el.textContent.trim().slice(0, 24)} (${Math.round(r.height)}px)`);

      // images
      out.brokenImgs = [...document.images]
        .filter((i) => i.complete && i.naturalWidth === 0)
        .map((i) => i.getAttribute("src"));
      out.imgNoAlt = [...document.images].filter((i) => !i.alt).length;

      return out;
    });

    if (res.overflow > 1)
      add(route, vp.name, "overflow", `${res.overflow}px — ${res.wideNodes.join(", ")}`);
    if (res.stillHidden > 0)
      add(route, vp.name, "hidden-after-anim", `${res.stillHidden} el(s)`);
    if (res.brokenImgs.length)
      add(route, vp.name, "broken-img", res.brokenImgs.join(", "));
    if (vp.name === "1280") {
      if (res.h1Count !== 1) add(route, vp.name, "h1-count", String(res.h1Count));
      if (res.headingJumps.length)
        add(route, vp.name, "heading-jump", res.headingJumps.join(" | "));
      if (res.imgNoAlt) add(route, vp.name, "img-no-alt", String(res.imgNoAlt));
      for (const c of res.ctas)
        add(
          route,
          vp.name,
          "cta",
          `"${c.text}" cls=${c.cls || "(none)"} r=${c.radius} p=${c.padding} fs=${c.fontSize} svg=${c.hasArrowSvg} literalArrow=${c.literalArrow}`,
        );
      if (res.smallTargets.length)
        add(route, vp.name, "small-target", res.smallTargets.join(", "));
    }
  }
  await page.close();
}

await browser.close();

const byKind = {};
for (const f of findings) (byKind[f.kind] ??= []).push(f);
for (const [kind, list] of Object.entries(byKind)) {
  console.log(`\n### ${kind} (${list.length})`);
  for (const f of list) console.log(`  [${f.route} @${f.vp}] ${f.detail}`);
}
if (!findings.length) console.log("clean");

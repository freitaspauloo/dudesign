#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { callPaper } from "./paper-mcp-call.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SLIDES_PATH = join(__dirname, "../../dudesign/src/content/slides.ts");
const IMG = process.env.DUDESIGN_IMG ?? "http://localhost:2000";
const SLIDE_W = 1440;
const SLIDE_H = 810;
const GAP = 48;

const mono =
  "font-family: Geist Mono; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #9ca3af;";
const body = "font-family: Geist; font-size: 18px; line-height: 1.55; color: #6b7280; margin: 0;";
const ink = "#0a0a0a";
const line = "#e5e7eb";

function label(text) {
  return `<p style="margin:0 0 16px; ${mono}">${text}</p>`;
}

function h2(text, size = 44) {
  return `<h2 style="margin:0 0 20px; font-family:Geist; font-size:${size}px; font-weight:400; letter-spacing:-0.03em; line-height:1.12; color:${ink};">${text}</h2>`;
}

function slideShell(inner, { ghost = false, footer = true } = {}) {
  const pad = ghost ? "padding: 40px 56px 24px;" : "padding: 40px 56px;";
  return `<section style="width:${SLIDE_W}px; height:${SLIDE_H}px; background:#fff; box-sizing:border-box; display:flex; flex-direction:column; ${pad} border:1px solid ${line};">
    <header style="display:flex; justify-content:space-between; align-items:center; padding-bottom:20px; ${ghost ? "" : `border-bottom:1px solid ${line};`}">
      <span style="font-family:Geist; font-size:18px; color:#1a1a1a;"><strong>DU</strong>DESIGN</span>
    </header>
    <div style="flex:1; display:flex; flex-direction:column; justify-content:center; min-height:0; padding:16px 0;">${inner}</div>
    ${footer ? `<footer style="display:flex; justify-content:space-between; padding-top:20px; border-top:1px solid ${line}; ${mono} color:#9ca3af;"><span>dudesign.us</span><span>hello@dudesign.us</span></footer>` : ""}
  </section>`;
}

function parseSlides() {
  const src = readFileSync(SLIDES_PATH, "utf8");
  const match = src.match(/export const slides: Slide\[\] = (\[[\s\S]*?\n\]);/);
  if (!match) throw new Error("Could not parse slides.ts");
  return Function(`"use strict"; return (${match[1]});`)();
}

function renderSlide(slide) {
  switch (slide.kind) {
    case "title":
      return slideShell(
        `<div style="display:flex; align-items:center; justify-content:center; height:100%;"><h1 style="margin:0; font-family:Geist; font-size:64px; letter-spacing:-0.02em; font-weight:400; color:#1a1a1a;"><strong>DU</strong>DESIGN</h1></div>`,
        { ghost: true, footer: false },
      );
    case "claim":
      return slideShell(
        `<div style="text-align:center; width:100%;">${slide.lines
          .map(
            (line) =>
              `<span style="display:block; font-family:Geist; font-size:56px; line-height:1.2; letter-spacing:-0.03em; color:${line.includes("AI") ? ink : ink};">${line}</span>`,
          )
          .join("")}</div>`,
        { ghost: true, footer: false },
      );
    case "about":
      return slideShell(
        `<div style="display:grid; grid-template-columns:1fr 1fr; gap:48px; align-items:center; width:100%;">
          <div>
            ${h2(slide.headline.replace("\n", "<br/><span style='color:#999'>").concat(slide.headline.includes("\n") ? "</span>" : ""), 40)}
            ${slide.body.map((p) => `<p style="${body} margin-bottom:16px;">${p}</p>`).join("")}
          </div>
          <div style="position:relative; aspect-ratio:1; border-radius:12px; overflow:hidden; background:${line};">
            <img src="${IMG}${slide.work}" alt="" style="width:100%; height:100%; object-fit:cover;" />
          </div>
        </div>`,
      );
    case "featured":
      return slideShell(
        `<div style="display:grid; grid-template-columns:0.42fr 0.58fr; gap:40px; height:100%; align-items:stretch; width:100%;">
          <div style="display:flex; flex-direction:column; justify-content:center;">
            ${label(slide.label)}
            ${h2(slide.title, 40)}
            <p style="${body} margin-bottom:12px;">${slide.lead}<strong style="color:#1a1a1a; font-weight:500;">${slide.leadEm}</strong></p>
            <p style="${body}">${slide.body}</p>
            <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:16px;">
              ${slide.tags.map((t) => `<span style="border:1px solid ${line}; border-radius:20px; padding:6px 12px; font-family:Geist; font-size:14px; color:#6b7280;">${t}</span>`).join("")}
            </div>
          </div>
          <div style="display:grid; grid-template-rows:1fr 1fr; gap:12px;">
            ${slide.images.map((img) => `<div style="border-radius:8px; overflow:hidden; background:${line};"><img src="${IMG}${img.src}" alt="${img.alt}" style="width:100%; height:100%; object-fit:cover;" /></div>`).join("")}
          </div>
        </div>`,
      );
    case "workgrid":
      return slideShell(
        `<div style="width:100%;">
          ${label(slide.label)}
          ${h2(slide.headline, 40)}
          <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-top:8px;">
            ${slide.items
              .map(
                (item) => `
              <article>
                <div style="aspect-ratio:5/4; border-radius:10px; overflow:hidden; background:${line}; margin-bottom:12px;">
                  <img src="${IMG}${item.image}" alt="" style="width:100%; height:100%; object-fit:cover;" />
                </div>
                <h3 style="margin:0; font-family:Geist; font-size:18px; font-weight:500; color:#1a1a1a;">${item.title}</h3>
                <p style="margin:4px 0 0; font-family:Geist; font-size:16px; color:#6b7280;">${item.detail}</p>
              </article>`,
              )
              .join("")}
          </div>
        </div>`,
      );
    case "stack":
      return slideShell(
        `<div style="width:100%;">
          ${label(slide.label)}
          ${h2(slide.headline, 40)}
          <ul style="list-style:none; margin:0; padding:0; border-top:1px solid ${line};">
            ${slide.layers
              .map(
                (row) => `
              <li style="display:grid; grid-template-columns:180px 1fr; gap:16px; padding:18px 0; border-bottom:1px solid ${line}; font-family:Geist; font-size:18px;">
                <strong style="font-weight:500; color:#1a1a1a;">${row.name}</strong>
                <span style="color:#6b7280;">${row.detail}</span>
              </li>`,
              )
              .join("")}
          </ul>
        </div>`,
      );
    case "process":
      return slideShell(
        `<div style="width:100%;">
          ${label(slide.label)}
          ${h2(slide.headline, 40)}
          <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:${line}; border:1px solid ${line};">
            ${slide.phases
              .map(
                (p) => `
              <div style="background:#fff; padding:22px 20px;">
                <span style="display:block; margin-bottom:10px; ${mono}">${p.when}</span>
                <h3 style="margin:0 0 8px; font-family:Geist; font-size:18px; font-weight:500; color:#1a1a1a;">${p.title}</h3>
                <p style="${body} font-size:16px;">${p.detail}</p>
              </div>`,
              )
              .join("")}
          </div>
        </div>`,
      );
    case "included":
      return slideShell(
        `<div style="width:100%;">
          ${label(slide.label)}
          ${h2(slide.headline, 40)}
          <ul style="list-style:none; margin:0; padding:0; display:grid; grid-template-columns:1fr 1fr; gap:24px 40px;">
            ${slide.items
              .map(
                (item) => `
              <li>
                <strong style="display:block; font-family:Geist; font-size:18px; font-weight:500; color:#1a1a1a; margin-bottom:8px;">${item.title}</strong>
                <p style="${body} font-size:16px;">${item.detail}</p>
              </li>`,
              )
              .join("")}
          </ul>
        </div>`,
      );
    case "upside":
      return slideShell(
        `<div style="width:100%;">
          ${label(slide.label)}
          ${h2(slide.headline, 40)}
          <table style="width:100%; border-collapse:collapse; font-family:Geist; font-size:16px;">
            <thead>
              <tr>
                <th style="text-align:left; padding:0 16px 12px 0; ${mono}">Option</th>
                <th style="text-align:left; padding:0 16px 12px 0; ${mono}">Typical cost</th>
                <th style="text-align:left; padding:12px 16px; background:${ink}; color:#fff; ${mono}">DUDESIGN</th>
              </tr>
            </thead>
            <tbody>
              ${slide.rows
                .map(
                  (row) => `
                <tr>
                  <td style="padding:16px 16px 16px 0; border-bottom:1px solid ${line}; font-weight:500; color:#1a1a1a;">${row.buy}</td>
                  <td style="padding:16px 16px 16px 0; border-bottom:1px solid ${line}; color:#6b7280;">${row.cost}</td>
                  <td style="padding:16px; border-bottom:1px solid rgba(255,255,255,0.1); background:${ink}; color:#fff;">${row.us}</td>
                </tr>`,
                )
                .join("")}
            </tbody>
          </table>
        </div>`,
      );
    case "tiers":
      return slideShell(
        `<div style="width:100%;">
          ${label(slide.label)}
          ${h2(slide.headline, 36)}
          <div style="display:grid; grid-template-columns:repeat(3,1fr); border:1px solid ${line};">
            ${slide.tiers
              .map(
                (tier) => `
              <div style="padding:24px 20px; border-left:1px solid ${line}; position:relative;">
                ${tier.tag ? `<span style="position:absolute; top:0; left:16px; transform:translateY(-50%); background:#1a1a1a; color:#fff; ${mono} padding:4px 8px;">${tier.tag}</span>` : ""}
                <h3 style="margin:0 0 6px; font-family:Geist; font-size:18px; font-weight:500;">${tier.name}</h3>
                <p style="${body} font-size:14px; margin-bottom:12px;">${tier.blurb}</p>
                <p style="margin:0 0 4px; font-family:Geist; font-size:18px; font-weight:500; color:#1a1a1a;">${tier.price}</p>
                <p style="margin:0 0 16px; font-family:Geist; font-size:14px; color:#9ca3af;">${tier.duration}</p>
                <ul style="margin:0; padding:0; list-style:none; font-family:Geist; font-size:14px; color:#1a1a1a; line-height:1.5;">
                  ${tier.includes.map((i) => `<li style="margin-bottom:8px;">${i.startsWith("Everything") ? i : "✓ " + i}</li>`).join("")}
                </ul>
              </div>`,
              )
              .join("")}
          </div>
        </div>`,
      );
    case "payment":
      return slideShell(
        `<div style="width:100%;">
          ${label(slide.label)}
          ${h2(slide.headline, 36)}
          <p style="${body} margin-bottom:8px; font-size:16px;">${slide.body}</p>
          <p style="${body} margin-bottom:20px; font-size:14px; color:#9ca3af;">${slide.note}</p>
          <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:16px;">
            ${slide.plans
              .map(
                (plan) => `
              <div style="border:1px solid ${line}; padding:20px;">
                <h3 style="margin:0 0 8px; font-family:Geist; font-size:16px; font-weight:500;">${plan.name}</h3>
                <p style="margin:0 0 12px; font-family:Geist; font-size:20px; font-weight:500;">${plan.price}</p>
                ${plan.schedule.map((s) => `<p style="margin:0 0 6px; font-family:Geist; font-size:13px; color:#6b7280;"><strong style="color:#1a1a1a;">${s.pct}</strong> · ${s.when} · ${s.amount}</p>`).join("")}
                <p style="margin:12px 0 0; font-family:Geist; font-size:12px; color:#9ca3af;">${plan.foot}</p>
              </div>`,
              )
              .join("")}
          </div>
        </div>`,
      );
    case "bonuses":
      return slideShell(
        `<div style="width:100%;">
          ${label(slide.label)}
          ${h2(slide.headline, 36)}
          <p style="${body} margin-bottom:20px; font-size:16px;">${slide.body}</p>
          <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:16px;">
            ${slide.plans
              .map(
                (plan) => `
              <div style="border:1px solid ${line}; padding:20px;">
                <h3 style="margin:0 0 4px; font-family:Geist; font-size:16px; font-weight:500;">${plan.name} <span style="color:#9ca3af;">${plan.count}</span></h3>
                ${plan.items.map((item) => `<p style="margin:12px 0 0; font-family:Geist; font-size:14px; color:#1a1a1a;"><strong>${item.title}</strong>${item.detail ? `<br/><span style="color:#6b7280;">${item.detail}</span>` : ""}</p>`).join("")}
              </div>`,
              )
              .join("")}
          </div>
        </div>`,
      );
    case "faq":
      return slideShell(
        `<div style="width:100%;">
          ${label(slide.label)}
          ${h2(slide.headline, 40)}
          <ul style="list-style:none; margin:0; padding:0;">
            ${slide.items
              .map(
                (item) => `
              <li style="padding:14px 0; border-top:1px solid ${line};">
                <strong style="display:block; font-family:Geist; font-size:18px; font-weight:500; color:#1a1a1a; margin-bottom:6px;">${item.q}</strong>
                <p style="${body} font-size:16px;">${item.a}</p>
              </li>`,
              )
              .join("")}
          </ul>
        </div>`,
      );
    case "cta":
      return slideShell(
        `<div style="width:100%; text-align:left;">
          ${h2(slide.headline, 56)}
          <div style="display:flex; gap:32px; font-family:Geist; font-size:18px; color:#6b7280;">
            <span>${slide.web}</span>
            <span>${slide.email}</span>
          </div>
        </div>`,
      );
    default:
      return slideShell(`<p style="${body}">Unsupported slide: ${slide.kind}</p>`);
  }
}

async function write(html, targetNodeId, mode = "insert-children") {
  return callPaper("write_html", { html, targetNodeId, mode });
}

const slides = parseSlides();
const totalH = slides.length * SLIDE_H + (slides.length - 1) * GAP + 80;

console.error(`Creating deck artboard — ${slides.length} slides, ${totalH}px tall…`);

const board = await callPaper("create_artboard", {
  name: "DUDESIGN Deck — 1440",
  styles: {
    width: `${SLIDE_W}px`,
    height: `${totalH}px`,
    backgroundColor: "#f3f3f1",
    display: "flex",
    flexDirection: "column",
    gap: `${GAP}px`,
    padding: "40px 0",
    boxSizing: "border-box",
  },
});

for (let i = 0; i < slides.length; i++) {
  process.stderr.write(`Slide ${i + 1}/${slides.length}: ${slides[i].id}\n`);
  await write(renderSlide(slides[i]), board.id);
}

await callPaper("open_file", { pageId: "2-0" });

console.log(
  JSON.stringify(
    {
      artboardId: board.id,
      url: `https://app.paper.design/file/01M08YKZXH384A258MHEFVW6GK/2-0/${board.id}`,
      slides: slides.length,
      width: SLIDE_W,
      height: totalH,
    },
    null,
    2,
  ),
);

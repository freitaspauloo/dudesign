#!/usr/bin/env node

import { callPaper } from "./paper-mcp-call.mjs";

const ASSET = "paper-asset:///C:/Users/Paulo Freitas/Projects/paulo-portfolio/public";
const PORTFOLIO_FRAME = process.argv[2] ?? "15H-0";

const mono =
  "font-family: Geist Mono; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #8a8a8a;";
const ink = "#0a0a0a";
const line = "#ddddda";
const body = "font-family: Geist; font-size: 17px; line-height: 1.65; color: #6b7280; margin: 0;";

async function write(html, targetNodeId, mode = "insert-children") {
  const result = await callPaper("write_html", { html, targetNodeId, mode });
  return result?.createdNodes?.[0]?.id ?? result?.id ?? result;
}

const board = await callPaper("create_artboard", {
  name: "Enterprise — 1440",
  styles: {
    width: "1440px",
    height: "780px",
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  },
});

const sectionId = board.id;

const info = await callPaper("get_basic_info");
const portfolio = info.artboards?.find((a) => a.id === PORTFOLIO_FRAME);
if (portfolio) {
  await callPaper("update_styles", {
    updates: [
      {
        nodeIds: [sectionId],
        styles: {
          left: `${portfolio.worldX}px`,
          top: `${portfolio.worldY + portfolio.height + 48}px`,
        },
      },
    ],
  });
}

console.error(`Frame ${sectionId}`);

await write(
  `<div style="display:flex; flex-direction:row; gap:48px; align-items:flex-end; padding:48px 100px 48px; width:100%; box-sizing:border-box;">
    <h2 style="margin:0; flex:1; font-family:Geist; font-size:44px; line-height:1.12; letter-spacing:-0.02em; font-weight:400; color:${ink}; max-width:560px;">
      Fortune 500 craft. <span style="color:#8a8a8a;">Startup speed.</span>
    </h2>
    <div style="flex:0.85; display:flex; flex-direction:column; gap:16px;">
      <p style="${body}">Before DUDESIGN, I led design at XIX3D — product design, HMI, and brand systems for global automotive and consumer tech clients.</p>
      <p style="${body}">Audi, Samsung, 3M, Ford, Sony + Honda (Afeela), and Costco. The same bar now applied to AI-native product work.</p>
    </div>
  </div>`,
  sectionId,
);

const logoBarId = await write(
  `<div layer-name="Logo wall" style="display:flex; flex-direction:row; width:100%; padding:0 100px 48px; box-sizing:border-box; border-top:1px solid ${line}; border-bottom:1px solid ${line};"></div>`,
  sectionId,
);

const logoCells = [
  [`${ASSET}/work/logos/audi.svg`, "Audi"],
  [`${ASSET}/work/logos/samsung.svg`, "Samsung"],
  [`${ASSET}/work/logos/3m.svg`, "3M"],
  [`${ASSET}/work/logos/ford.svg`, "Ford"],
  [
    [`${ASSET}/work/logos/sony.svg`, `${ASSET}/work/logos/honda.svg`],
    "Sony + Honda",
  ],
  [`${ASSET}/work/logos/costco.svg`, "Costco"],
];

for (let i = 0; i < logoCells.length; i++) {
  const cell = logoCells[i];
  const imgs = Array.isArray(cell[0])
    ? cell[0]
        .map(
          (src) =>
            `<img src="${src}" alt="" style="height:22px; width:auto; max-width:100px; object-fit:contain; filter:grayscale(1); opacity:0.55;" />`,
        )
        .join("")
    : `<img src="${cell[0]}" alt="${cell[1]}" style="height:22px; width:auto; max-width:120px; object-fit:contain; filter:grayscale(1); opacity:0.55;" />`;

  const border = i < logoCells.length - 1 ? `border-right:1px solid ${line};` : "";

  await write(
    `<div style="flex:1; display:flex; flex-direction:row; align-items:center; justify-content:center; gap:14px; background:#fff; padding:28px 12px; min-height:88px; ${border}">${imgs}</div>`,
    logoBarId,
  );
}

const cardsId = await write(
  `<div layer-name="Enterprise highlights" style="display:flex; flex-direction:row; gap:24px; width:100%; padding:48px 100px 64px; box-sizing:border-box;"></div>`,
  sectionId,
);

const highlights = [
  ["First OEM-aftermarket program", "FORD • ENTERPRISE", "/work/cases/ford.webp", "Ford"],
  ["EV personalization platform", "AFEELA • ENTERPRISE", "/work/cases/afeela.webp", "Afeela"],
  ["Retail technology at scale", "COSTCO • ENTERPRISE", "/work/cases/costco.webp", "Costco"],
];

for (const [title, meta, image, alt] of highlights) {
  await write(
    `<article style="flex:1; display:flex; flex-direction:column;">
      <div style="width:100%; height:252px; border-radius:2px; overflow:hidden; background:${line}; margin-bottom:14px;">
        <img src="${ASSET}${image}" alt="${alt}" style="width:100%; height:100%; object-fit:cover; display:block;" />
      </div>
      <h3 style="margin:0 0 6px; font-family:Geist; font-size:18px; font-weight:400; line-height:1.2; color:${ink};">${title}</h3>
      <p style="margin:0; ${mono}">${meta}</p>
    </article>`,
    cardsId,
  );
}

await callPaper("open_file", { pageId: "2-0" });

console.log(
  JSON.stringify(
    {
      frameId: sectionId,
      url: `https://app.paper.design/file/01M08YKZXH384A258MHEFVW6GK/2-0/${sectionId}`,
      logos: logoCells.length,
      highlights: highlights.length,
    },
    null,
    2,
  ),
);

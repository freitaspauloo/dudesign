#!/usr/bin/env node

const FILE_ID = "01M08YKZXH384A258MHEFVW6GK";
const ARTBOARD_ID = process.argv[2] ?? "X8-0";
const IMG = "http://localhost:3002/paulo";

async function callPaper(toolName, args = {}) {
  const body = {
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: { name: toolName, arguments: { fileId: FILE_ID, ...args } },
  };

  const res = await fetch("http://127.0.0.1:29979/mcp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  const match = text.match(/data: (.+)/);
  if (!match) throw new Error(text.slice(0, 500));
  const parsed = JSON.parse(match[1]);
  if (parsed.error) throw new Error(JSON.stringify(parsed.error));

  for (const block of parsed.result?.content ?? []) {
    if (block.type === "text") {
      try {
        return JSON.parse(block.text);
      } catch {
        return block.text;
      }
    }
  }
}

async function write(html) {
  return callPaper("write_html", {
    html,
    targetNodeId: ARTBOARD_ID,
    mode: "insert-children",
  });
}

const mono =
  "font-family: Geist Mono; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #8a8a8a;";
const sans = "font-family: Geist; color: #111111;";
const capsLink = `${mono} text-decoration: none; color: #111111; line-height: 1.6;`;

const sections = [
  `<header style="display:flex; align-items:center; justify-content:space-between; gap:24px; width:100%; margin-bottom:64px; ${sans}">
    <div style="display:flex; flex-direction:column; gap:4px;">
      <span style="${mono} color:#111;">Paulo Freitas</span>
      <span style="${mono}">Product Designer — AI/SaaS</span>
    </div>
    <nav style="display:flex; gap:28px; align-items:center;">
      <span style="${capsLink}">Work</span>
      <span style="${capsLink}">About</span>
      <span style="${capsLink}">Résumé</span>
    </nav>
    <div style="display:flex; gap:20px; align-items:center;">
      <span style="${capsLink}">LinkedIn</span>
      <span style="${capsLink}">GitHub</span>
      <span style="font-family:Geist; font-size:14px; font-weight:500; background:#111; color:#fff; padding:10px 20px; border-radius:999px;">Get in touch</span>
    </div>
  </header>`,

  `<section style="display:flex; gap:64px; width:100%; margin-bottom:80px; ${sans}">
    <h1 style="margin:0; flex:1.15; font-family:Geist; font-size:64px; line-height:1.08; letter-spacing:-0.02em; font-weight:400; max-width:640px;">
      I design complex product surfaces <span style="color:#8a8a8a;">and ship them in code.</span>
    </h1>
    <nav style="flex:0.85; display:grid; grid-template-columns:repeat(3,1fr); gap:6px 28px; padding-top:6px;">
      <span style="${capsLink}">See the work</span>
      <span style="${capsLink}">LinkedIn</span>
      <span style="${capsLink}">Aligned AI</span>
      <span style="${capsLink}">About</span>
      <span style="${capsLink}">GitHub</span>
      <span style="${capsLink}">Frameline</span>
      <span style="${capsLink}">Résumé</span>
      <span style="${capsLink}">Email</span>
      <span style="${capsLink}">BuiltOps</span>
    </nav>
  </section>`,

  `<section style="display:grid; grid-template-columns:1fr 1fr; gap:24px; width:100%; margin-bottom:24px;">
    <article style="display:flex; flex-direction:column; gap:16px;">
      <div style="width:100%; height:320px; border-radius:2px; overflow:hidden; background:#e8d5c4;">
        <img src="${IMG}/work/cases/aligned-ai/desktop-1.png" alt="Aligned AI desktop workspace overview" style="width:100%; height:100%; object-fit:cover;" />
      </div>
      <div>
        <h3 style="margin:0 0 6px; font-family:Geist; font-size:28px; font-weight:400; letter-spacing:-0.01em; color:#111;">Aligned AI</h3>
        <p style="margin:0; ${mono}">Aligned • AI workspace</p>
      </div>
    </article>
    <article style="display:flex; flex-direction:column; gap:16px;">
      <div style="width:100%; height:320px; border-radius:2px; overflow:hidden; background:#ebe6f2;">
        <img src="${IMG}/work/cases/frameline.webp" alt="Frameline" style="width:100%; height:100%; object-fit:cover;" />
      </div>
      <div>
        <h3 style="margin:0 0 6px; font-family:Geist; font-size:28px; font-weight:400; letter-spacing:-0.01em; color:#111;">Frameline</h3>
        <p style="margin:0; ${mono}">Frameline • Design system</p>
      </div>
    </article>
  </section>`,

  `<section style="display:grid; grid-template-columns:1fr 1fr; gap:24px; width:100%; margin-bottom:96px;">
    <article style="display:flex; flex-direction:column; gap:16px;">
      <div style="width:100%; height:320px; border-radius:2px; overflow:hidden; background:#c8c8c8;">
        <img src="${IMG}/work/cases/builtops.webp" alt="BuiltOps" style="width:100%; height:100%; object-fit:cover;" />
      </div>
      <div>
        <h3 style="margin:0 0 6px; font-family:Geist; font-size:28px; font-weight:400; letter-spacing:-0.01em; color:#111;">BuiltOps / Losani</h3>
        <p style="margin:0; ${mono}">Losani Homes • Enterprise B2B</p>
      </div>
    </article>
    <div></div>
  </section>`,

  `<section style="width:100%; padding-top:48px; border-top:1px solid #ddddda; margin-bottom:48px; ${sans}">
    <div style="display:flex; gap:48px; align-items:flex-end; margin-bottom:48px;">
      <h2 style="margin:0; flex:1; font-family:Geist; font-size:44px; line-height:1.12; letter-spacing:-0.02em; font-weight:400; max-width:560px;">
        Fortune 500 craft. <span style="color:#8a8a8a;">Startup speed.</span>
      </h2>
      <div style="flex:0.85; font-family:Geist; font-size:17px; line-height:1.65; color:#6b7280;">
        <p style="margin:0 0 16px;">Before DUDESIGN, I led design at XIX3D — product design, HMI, and brand systems for global automotive and consumer tech clients.</p>
        <p style="margin:0;">Audi, Samsung, 3M, Ford, Sony + Honda (Afeela), and Costco. The same bar now applied to AI-native product work.</p>
      </div>
    </div>
  </section>`,

  `<section style="display:grid; grid-template-columns:repeat(6,1fr); gap:1px; background:#ddddda; border:1px solid #ddddda; border-radius:2px; overflow:hidden; width:100%; margin-bottom:48px;">
    ${[
      ["/work/logos/audi.svg", "Audi"],
      ["/work/logos/samsung.svg", "Samsung"],
      ["/work/logos/3m.svg", "3M"],
      ["/work/logos/ford.svg", "Ford"],
      null,
      ["/work/logos/costco.svg", "Costco"],
    ]
      .map((entry, i) => {
        if (i === 4) {
          return `<div style="background:#fff; min-height:88px; display:flex; align-items:center; justify-content:center; gap:14px; padding:28px 16px;">
            <img src="${IMG}/work/logos/sony.svg" alt="Sony" style="height:22px; width:auto; max-width:120px; object-fit:contain; filter:grayscale(1); opacity:0.55;" />
            <img src="${IMG}/work/logos/honda.svg" alt="Honda" style="height:22px; width:auto; max-width:120px; object-fit:contain; filter:grayscale(1); opacity:0.55;" />
          </div>`;
        }
        const [src, alt] = entry;
        return `<div style="background:#fff; min-height:88px; display:flex; align-items:center; justify-content:center; padding:28px 16px;">
          <img src="${IMG}${src}" alt="${alt}" style="height:22px; width:auto; max-width:120px; object-fit:contain; filter:grayscale(1); opacity:0.55;" />
        </div>`;
      })
      .join("")}
  </section>`,

  `<section style="display:grid; grid-template-columns:repeat(3,1fr); gap:24px; width:100%; margin-bottom:96px;">
    ${[
      ["First OEM-aftermarket program", "Ford • Enterprise", "#ddd4eb", "ford.webp"],
      ["EV personalization platform", "Afeela • Enterprise", "#f0ece6", "afeela.webp"],
      ["Retail technology at scale", "Costco • Enterprise", "#e3e8ef", "costco.webp"],
    ]
      .map(
        ([title, meta, bg, img]) => `
    <article>
      <div style="width:100%; height:220px; border-radius:2px; overflow:hidden; background:${bg}; margin-bottom:14px;">
        <img src="${IMG}/work/cases/${img}" alt="" style="width:100%; height:100%; object-fit:cover;" />
      </div>
      <h3 style="margin:0 0 6px; font-family:Geist; font-size:18px; font-weight:400; color:#111;">${title}</h3>
      <p style="margin:0; ${mono}">${meta}</p>
    </article>`,
      )
      .join("")}
  </section>`,

  `<section style="width:100%; padding-top:48px; border-top:1px solid #ddddda; margin-bottom:64px;">
    <p style="margin:0 0 12px; ${mono}">Open to product design roles</p>
    <p style="margin:0; font-family:Geist; font-size:52px; letter-spacing:-0.02em; font-weight:400; color:#111;">hello@dudesign.us</p>
  </section>`,

  `<footer style="width:100%; padding-top:32px; border-top:1px solid #ddddda;">
    <p style="margin:0 0 4px; ${mono}">Designed + built in Next.js + Cursor</p>
    <p style="margin:0 0 20px; ${mono} color:#111;">By Paulo Freitas</p>
    <div style="display:flex; flex-wrap:wrap; gap:12px 24px; margin-bottom:24px;">
      ${["LinkedIn", "GitHub", "Email", "DUDESIGN", "Work", "About"]
        .map((l) => `<span style="${capsLink}">${l}</span>`)
        .join("")}
    </div>
    <p style="margin:0; ${mono}">© 2026 Paulo Freitas</p>
  </footer>`,
];

for (let i = 0; i < sections.length; i++) {
  process.stderr.write(`Writing section ${i + 1}/${sections.length}…\n`);
  await write(sections[i]);
}

const info = await callPaper("get_basic_info");
const board = info.artboards?.find((a) => a.id === ARTBOARD_ID);
console.log(
  JSON.stringify(
    {
      artboardId: ARTBOARD_ID,
      url: `${info.url}/${ARTBOARD_ID}`,
      width: board?.width,
      height: board?.height,
      sections: sections.length,
    },
    null,
    2,
  ),
);

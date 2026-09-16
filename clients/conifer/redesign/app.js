/* Conifer landing — behavior
   ascii renderer · route diagram · theme · os tabs · copy · reveal */

(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  /* ---------------------------------------------------------------- theme */
  const themeBtn = $("#theme");
  const themeName = $(".theme-name", themeBtn);
  const setTheme = (t) => {
    document.documentElement.setAttribute("data-theme", t);
    themeName.textContent = t;
    try {
      localStorage.setItem("conifer-theme", t);
    } catch {}
    ascii?.repaint();
  };
  themeName.textContent = document.documentElement.getAttribute("data-theme") || "light";
  themeBtn.addEventListener("click", () => {
    const cur = document.documentElement.getAttribute("data-theme");
    setTheme(cur === "dark" ? "light" : "dark");
  });

  /* ---------------------------------------------------------------- os tabs */
  const CMDS = {
    mac: "curl -fsSL https://www.conifer.build/install-cli.sh | sh",
    linux: "curl -fsSL https://www.conifer.build/install-cli.sh | sh",
    win: "irm https://www.conifer.build/install-cli.ps1 | iex",
  };
  const cmdText = $("#cmd-text");
  $$(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      $$(".tab").forEach((t) => t.setAttribute("aria-selected", String(t === tab)));
      cmdText.textContent = CMDS[tab.dataset.os];
    });
  });

  /* ---------------------------------------------------------------- copy */
  $$("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const code = $("code", btn.closest("[data-cmd]"));
      try {
        await navigator.clipboard.writeText(code.textContent.trim());
        btn.textContent = "copied";
        btn.classList.add("copied");
        setTimeout(() => {
          btn.textContent = "copy";
          btn.classList.remove("copied");
        }, 1400);
      } catch {
        btn.textContent = "select";
        const range = document.createRange();
        range.selectNodeContents(code);
        const sel = getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
    });
  });

  /* ---------------------------------------------------------------- reveal */
  if (!reduced && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    $$(".reveal").forEach((el) => io.observe(el));
  } else {
    $$(".reveal").forEach((el) => el.classList.add("in"));
  }

  /* ---------------------------------------------------------------- ascii bonsai
     The tree is conifer.build's own 160×117 ASCII bonsai, drawn to canvas.
     Character density → ink tone. A sparse set of dense cells render in the
     accent — requests being routed. Pointer ripples the density. */
  const ascii = (() => {
    const canvas = $("#ascii");
    const host = $("#tree");
    const band = host?.closest(".hero-photo");
    if (!canvas || !host || !band) return null;

    // alpha canvas → grayscale AA (no LCD colour fringing on the glyphs)
    const ctx = canvas.getContext("2d", { alpha: true });
    // their glyph ramp, light → dense
    const RAMP = " .,:;i+=xszXW#$@";
    const rank = {};
    [...RAMP].forEach((c, i) => (rank[c] = i / (RAMP.length - 1)));

    let rows = [];
    let cols = 0;
    let live = null;
    let liveOff = { x: 0, y: 0 };
    let cw = 5,
      rh = 6.5,
      fs = 7.6,
      dpr = 1;
    // taller silhouette: cells are taller than wide, size from height not width
    const STRETCH = 1.68;
    const WIDTH_FRAC = 0.62;
    let pointer = null;
    let t = 0;
    let raf = 0;

    const load = async () => {
      const txt = await (await fetch("./assets/bonsai.txt")).text();
      let lines = txt.split("\n");
      while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
      while (lines.length && !lines[0].trim()) lines.shift();
      rows = lines;
      cols = Math.max(...rows.map((r) => r.length));

      // trim empty margins so the tree reads taller in the band
      let minX = cols,
        maxX = 0,
        minY = rows.length,
        maxY = 0;
      rows.forEach((r, y) => {
        for (let x = 0; x < r.length; x++) {
          if (r[x] === " ") continue;
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        }
      });
      liveOff = { x: minX, y: minY };
      rows = rows.slice(minY, maxY + 1).map((r) => r.slice(minX, maxX + 1));
      cols = Math.max(...rows.map((r) => r.length));

      let seed = 2026;
      const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
      live = rows.map((r) => [...r].map((c) => (rank[c] ?? 0) > 0.6 && rnd() < 0.022));
    };

    const size = () => {
      const w = band.clientWidth;
      const maxH = Math.min(window.innerHeight * 0.56, 680);
      const maxW = w * WIDTH_FRAC;

      // height-first fit, then clamp width
      rh = Math.max(4.4, Math.min(7.4, maxH / rows.length));
      cw = rh / STRETCH;
      if (cols * cw > maxW) {
        cw = maxW / cols;
        rh = cw * STRETCH;
      }
      cw = Math.max(3, cw);
      fs = cw * 1.55;
      dpr = Math.min(2, devicePixelRatio || 1);
      const W = Math.ceil(cols * cw);
      const H = Math.ceil(rows.length * rh);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
    };

    const paint = () => {
      if (!rows.length) return;
      const tones = [css("--tree-1"), css("--tree-2"), css("--tree-3"), css("--tree-4")];
      const acc = css("--tree-live");
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `500 ${fs}px ${css("--mono")}`;
      ctx.textBaseline = "top";
      ctx.textAlign = "left";

      const px = pointer ? pointer.x / cw : -1e9;
      const py = pointer ? pointer.y / rh : -1e9;

      for (let y = 0; y < rows.length; y++) {
        const row = rows[y];
        for (let x = 0; x < row.length; x++) {
          const c = row[x];
          if (c === " ") continue;
          let d = rank[c] ?? 0.3;
          if (pointer) {
            const dx = x - px;
            const dy = (y - py) * 1.25;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 16) {
              const wave = Math.sin(dist * 0.8 - t * 0.14) * 0.5 + 0.5;
              d = Math.min(1, d + wave * (1 - dist / 16) * 0.55);
            }
          }
          if (live[y][x]) ctx.fillStyle = acc;
          else ctx.fillStyle = tones[Math.min(3, Math.floor(d * 3.999))];
          ctx.fillText(c, x * cw, y * rh);
        }
      }
    };

    const loop = () => {
      t++;
      paint();
      raf = pointer ? requestAnimationFrame(loop) : 0;
    };

    (async () => {
      await load();
      size();
      paint();
      if (!reduced) {
        canvas.addEventListener("pointermove", (e) => {
          const r = canvas.getBoundingClientRect();
          pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
          if (!raf) raf = requestAnimationFrame(loop);
        });
        canvas.addEventListener("pointerleave", () => {
          pointer = null;
          paint();
        });
      }
      let to;
      addEventListener("resize", () => {
        clearTimeout(to);
        to = setTimeout(() => {
          size();
          paint();
        }, 80);
      });
    })();

    return { repaint: paint };
  })();

  /* ---------------------------------------------------------------- route diagram */
  (() => {
    const body = $("#route-body");
    if (!body) return;

    const COLS = [
      { key: "harness", label: "harness", items: ["Cursor", "Claude Code", "Codex", "Zed", "VS Code", "Terminal"] },
      { key: "model", label: "model", items: ["Kimi K3", "DeepSeek V4", "Qwen 3.7", "GLM-5", "Claude Sonnet", "Llama 4"] },
      { key: "provider", label: "provider", items: ["Together", "Fireworks", "DeepSeek", "Groq", "Local · your GPU", "Anthropic"] },
      { key: "cache", label: "cache strategy", items: ["cache read", "fresh tokens", "cache write"] },
    ];

    const SCENES = [
      {
        q: "rename these forty files to kebab-case",
        pick: { harness: "Terminal", model: "Qwen 3.7", provider: "Local · your GPU", cache: "fresh tokens" },
        cost: "$0.00",
        why: "<b>Trivial task.</b> A 7B model on your own machine clears it. Never leaves the device, never touches the bill.",
      },
      {
        q: "refactor the auth middleware, keep the tests green",
        pick: { harness: "Cursor", model: "Kimi K3", provider: "Together", cache: "cache read" },
        cost: "$0.004",
        why: "<b>Mid-size refactor.</b> Open-weights model at roughly a twelfth of frontier price. Repo context already cached.",
      },
      {
        q: "design the migration plan for splitting the tenant database",
        pick: { harness: "Claude Code", model: "Claude Sonnet", provider: "Anthropic", cache: "cache write" },
        cost: "$0.19",
        why: "<b>Hard reasoning.</b> Frontier model, at the model’s own rate. Conifer adds nothing on top.",
      },
    ];

    // build columns
    const askCol = document.createElement("div");
    askCol.className = "route-col end ask";
    askCol.innerHTML = `<span class="dot"></span><span class="col-label">ask</span>`;
    body.appendChild(askCol);

    const optEls = {};
    COLS.forEach((c) => {
      const col = document.createElement("div");
      col.className = "route-col";
      col.innerHTML = `<span class="col-label">${c.label}</span>`;
      optEls[c.key] = {};
      c.items.forEach((name) => {
        const o = document.createElement("div");
        o.className = "opt";
        o.innerHTML = `<span class="box"></span><span>${name}</span>`;
        col.appendChild(o);
        optEls[c.key][name] = o;
      });
      body.appendChild(col);
    });

    const ansCol = document.createElement("div");
    ansCol.className = "route-col end";
    ansCol.innerHTML = `<span class="dot"></span><span class="col-label">answer</span>`;
    body.appendChild(ansCol);

    const qEl = $("#route-query");
    const costEl = $("#route-cost");
    const whyEl = $("#route-why");
    const stepsEl = $("#route-steps");

    SCENES.forEach((_, i) => {
      const b = document.createElement("button");
      b.className = "step";
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-label", `Example ${i + 1}`);
      b.addEventListener("click", () => {
        show(i);
        restart();
      });
      stepsEl.appendChild(b);
    });

    let cur = -1;
    let timer = 0;

    const show = (i) => {
      cur = i;
      const s = SCENES[i];
      qEl.textContent = s.q;
      costEl.textContent = s.cost;
      whyEl.innerHTML = s.why;
      COLS.forEach((c) => {
        Object.entries(optEls[c.key]).forEach(([name, el]) => {
          el.classList.toggle("on", s.pick[c.key] === name);
        });
      });
      $$(".step", stepsEl).forEach((b, k) => {
        b.classList.toggle("on", k === i);
        b.setAttribute("aria-selected", String(k === i));
      });
    };

    const next = () => show((cur + 1) % SCENES.length);
    const restart = () => {
      clearInterval(timer);
      if (!reduced) timer = setInterval(next, 4200);
    };

    show(0);
    restart();

    // pause when off-screen
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) restart();
          else clearInterval(timer);
        },
        { threshold: 0.2 },
      ).observe(body);
    }
  })();
})();

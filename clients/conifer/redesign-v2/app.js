(function () {
  var CMDS = {
    mac: "curl -fsSL https://www.conifer.build/install-cli.sh | sh",
    linux: "curl -fsSL https://www.conifer.build/install-cli.sh | sh",
    win: "irm https://www.conifer.build/install-cli.ps1 | iex",
  };

  var currentOs = "win";
  var osBtn = document.getElementById("os-btn");
  var osMenu = document.getElementById("os-menu");
  var osLabel = document.getElementById("os-label");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  (function initAsciiSystem() {
    if (!window.ConiferAscii) return;

    var globalConfig = ConiferAscii.loadStored();
    var heroHost = document.getElementById("hero-ascii");
    var heroBg = document.getElementById("hero-bg");
    var cardHosts = document.querySelectorAll("[data-ascii-card] .ascii-host--card");
    var cardLayers = [];

    function syncCards(config) {
      var cardCfg = ConiferAscii.cardConfig(config);
      cardLayers.forEach(function (layer) {
        layer.setConfig(cardCfg, false);
      });
    }

    if (heroHost) {
      var heroLayer = ConiferAscii.createLayer(heroHost, {
        src: heroHost.dataset.asciiSrc || "./assets/bonsai-hero.jpg",
        globalConfig: globalConfig,
        /* Figma 1432:1805: 3:2 photo filling the rect by width, anchored to
           the top — the pot body is cropped by the rect bottom, only the rim
           shows on the stats-band rule. */
        config: {
          imgFit: "cover",
          imgAnchorX: 0.5,
          imgAnchorY: 0,
          imgOffsetX: 0,
          imgOffsetY: 0,
        },
      });
      window.__coniferHeroAscii = heroLayer;
      heroLayer.mount().then(function () {
        new ConiferAsciiWidget(heroLayer, syncCards, heroBg);
      });
      window.addEventListener("conifer-ascii-config", function (e) {
        syncCards(e.detail);
      });
    }

    cardHosts.forEach(function (host) {
      var layer = ConiferAscii.createLayer(host, {
        src: host.dataset.asciiSrc || "./assets/bonsai-hero.jpg",
        config: ConiferAscii.cardConfig(globalConfig),
        interactive: false,
      });
      cardLayers.push(layer);
      layer.mount();
    });
  })();

  function setOs(os) {
    currentOs = os;
    osLabel.textContent = os === "win" ? "windows" : os;
    osMenu.querySelectorAll("[role=option]").forEach(function (el) {
      el.setAttribute("aria-selected", el.dataset.os === os ? "true" : "false");
    });
    closeMenu();
  }

  function openMenu() {
    osMenu.hidden = false;
    osBtn.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    osMenu.hidden = true;
    osBtn.setAttribute("aria-expanded", "false");
  }

  if (osBtn && osMenu) {
    osBtn.addEventListener("click", function () {
      if (osMenu.hidden) openMenu();
      else closeMenu();
    });
    osMenu.addEventListener("click", function (e) {
      var item = e.target.closest("[data-os]");
      if (item) setOs(item.dataset.os);
    });
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".os-wrap")) closeMenu();
    });
  }

  (function initCodeCard() {
    var card = document.getElementById("code-card");
    if (!card) return;

    var SNIPPETS = {
      python: {
        lang: "py",
        code:
          '# pip install openai\n' +
          'from openai import OpenAI\n' +
          '\n' +
          'client = OpenAI(\n' +
          '    api_key="sk-conifer-YOUR_API_KEY",\n' +
          '    base_url="https://api.conifer.build/v1",\n' +
          ')\n' +
          '\n' +
          '# Route a request:\n' +
          'res = client.chat.completions.create(\n' +
          '    model="auto",\n' +
          '    messages=[{\n' +
          '        "role": "user",\n' +
          '        "content": "three names for a build cache",\n' +
          '    }],\n' +
          ')',
      },
      node: {
        lang: "js",
        code:
          '// npm install openai\n' +
          'import OpenAI from "openai";\n' +
          '\n' +
          'const client = new OpenAI({\n' +
          '  apiKey: "sk-conifer-YOUR_API_KEY",\n' +
          '  baseURL: "https://api.conifer.build/v1",\n' +
          '});\n' +
          '\n' +
          'const res = await client.chat.completions.create({\n' +
          '  model: "auto",\n' +
          '  messages: [{\n' +
          '    role: "user",\n' +
          '    content: "three names for a build cache",\n' +
          '  }],\n' +
          '});',
      },
      curl: {
        lang: "sh",
        code:
          'curl https://api.conifer.build/v1/chat/completions \\\n' +
          '  -H "Authorization: Bearer $CONIFER_API_KEY" \\\n' +
          '  -H "Content-Type: application/json" \\\n' +
          "  -d '{\n" +
          '    "model": "auto",\n' +
          '    "messages": [{"role": "user", "content": "three names for a build cache"}]\n' +
          "  }'",
      },
      cli: {
        lang: "sh",
        code:
          '# curl -fsSL https://conifer.build/setup | bash\n' +
          'conifer login\n' +
          '\n' +
          'conifer run --model auto \\\n' +
          '  "three names for a build cache"',
      },
    };

    var OUT =
      '{\n' +
      '  "id": "chatcmpl_01H…",\n' +
      '  "model": "qwen3-32b",\n' +
      '  "choices": [\n' +
      '    {\n' +
      '      "message": {\n' +
      '        "role": "assistant",\n' +
      '        "content": "Layer, Shard, Ember"\n' +
      '      }\n' +
      '    }\n' +
      '  ]\n' +
      '}';

    var current = "python";
    var srcEl = document.getElementById("code-src");
    var outEl = document.getElementById("code-out");
    var copyBtn = document.getElementById("code-copy");

    function esc(s) {
      return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function paint(src, rules) {
      var hits = [];
      rules.forEach(function (rule) {
        var re = new RegExp(rule.re.source, rule.re.flags.includes("g") ? rule.re.flags : rule.re.flags + "g");
        var m;
        while ((m = re.exec(src))) {
          hits.push({ start: m.index, end: m.index + m[0].length, cls: rule.cls, text: m[0] });
        }
      });
      hits.sort(function (a, b) {
        return a.start - b.start || b.end - a.end;
      });
      var out = "";
      var i = 0;
      hits.forEach(function (h) {
        if (h.start < i) return;
        out += esc(src.slice(i, h.start));
        out += '<span class="' + h.cls + '">' + esc(h.text) + "</span>";
        i = h.end;
      });
      out += esc(src.slice(i));
      return out;
    }

    function highlight(src, lang) {
      if (lang === "json") {
        return paint(src, [
          { re: /"[^"\\]*(?:\\.[^"\\]*)*"\s*:/g, cls: "tok-key" },
          { re: /"[^"\\]*(?:\\.[^"\\]*)*"/g, cls: "tok-s" },
          { re: /\b\d+(?:\.\d+)?\b/g, cls: "tok-n" },
        ]);
      }
      if (lang === "sh") {
        return paint(src, [
          { re: /#[^\n]*/g, cls: "tok-c" },
          { re: /"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'/g, cls: "tok-s" },
          { re: /\b(?:curl|conifer|login|run)\b/g, cls: "tok-fn" },
        ]);
      }
      return paint(src, [
        { re: /\/\/[^\n]*|#[^\n]*/g, cls: "tok-c" },
        { re: /"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'/g, cls: "tok-s" },
        { re: /\b(?:from|import|const|new|await|as)\b/g, cls: "tok-k" },
        { re: /\b(?:OpenAI|Conifer)\b/g, cls: "tok-fn" },
      ]);
    }

    function renderPane(el, src, lang) {
      var lines = src.split("\n");
      var nums = lines.map(function (_, i) { return String(i + 1); }).join("\n");
      el.innerHTML =
        '<pre class="code-gutter" aria-hidden="true">' +
        nums +
        '</pre><pre class="code-pre">' +
        highlight(src, lang) +
        "</pre>";
    }

    function show(lang) {
      current = lang;
      var snip = SNIPPETS[lang];
      renderPane(srcEl, snip.code, snip.lang);
      card.querySelectorAll(".code-tab").forEach(function (tab) {
        var on = tab.dataset.lang === lang;
        tab.classList.toggle("is-active", on);
        tab.setAttribute("aria-selected", on ? "true" : "false");
      });
    }

    renderPane(outEl, OUT, "json");
    show("python");

    card.querySelector(".code-tabs").addEventListener("click", function (e) {
      var tab = e.target.closest(".code-tab");
      if (tab) show(tab.dataset.lang);
    });

    if (copyBtn) {
      var copyLabel = copyBtn.querySelector("span");
      copyBtn.addEventListener("click", function () {
        navigator.clipboard.writeText(SNIPPETS[current].code).then(function () {
          var prev = copyLabel.textContent;
          copyLabel.textContent = "Copied";
          setTimeout(function () {
            copyLabel.textContent = prev;
          }, 1400);
        });
      });
    }
  })();

  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = CMDS[currentOs];
      navigator.clipboard.writeText(text).then(function () {
        var prev = btn.textContent;
        btn.textContent = "copied";
        setTimeout(function () {
          btn.textContent = prev;
        }, 1400);
      });
    });
  });

  if (!reduced && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    document.querySelectorAll(".reveal").forEach(function (el) {
      io.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("in");
    });
  }

  (function routeDelta() {
    var mount = document.getElementById("delta-mount");
    if (!mount) return;

    var qEl = document.getElementById("route-query");
    var whyEl = document.getElementById("route-why");
    var stepsEl = document.getElementById("route-steps");
    var askEl = document.getElementById("route-ask");

    fetch("./partials/delta-diagram.html")
      .then(function (r) {
        return r.text();
      })
      .then(function (html) {
        mount.innerHTML = html;
        if (window.ConiferDelta) {
          window.ConiferDelta.start(mount, {
            qEl: qEl,
            whyEl: whyEl,
            stepsEl: stepsEl,
            askEl: askEl,
            reduced: reduced,
          });
        }
      })
      .catch(function () {
        mount.innerHTML =
          '<img src="./assets/route-diagram-fallback.png" alt="Routing diagram" width="1120" height="510" style="width:100%;height:auto;border-radius:29px" />';
      });
  })();
})();

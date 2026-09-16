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
        src: heroHost.dataset.asciiSrc || "./assets/bonsai-ascii.png",
        globalConfig: globalConfig,
        interactive: !reduced,
      });
      window.__coniferHeroAscii = heroLayer;
      heroLayer.mount().then(function () {
        new ConiferAsciiWidget(heroLayer, syncCards);
      });
      window.addEventListener("conifer-ascii-config", function (e) {
        syncCards(e.detail);
      });
    }

    cardHosts.forEach(function (host) {
      var layer = ConiferAscii.createLayer(host, {
        src: host.dataset.asciiSrc || "./assets/bonsai-ascii.png",
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

  (function routeDiagram() {
    var body = document.getElementById("route-body");
    if (!body) return;

    var COLS = [
      { key: "harness", label: "harness", items: ["Cursor", "Claude Code", "Codex", "Zed", "VS Code", "Terminal"] },
      { key: "model", label: "model", items: ["Kimi K3", "DeepSeek V4", "Qwen 3.7", "GLM-5", "Claude Sonnet", "Llama 4"] },
      { key: "provider", label: "provider", items: ["Together", "Fireworks", "DeepSeek", "Groq", "Local · your GPU", "Anthropic"] },
      { key: "cache", label: "cache strategy", items: ["cache read", "fresh tokens", "cache write"] },
    ];

    var SCENES = [
      {
        q: "rename these forty files to kebab-case",
        pick: { harness: "Terminal", model: "Qwen 3.7", provider: "Local · your GPU", cache: "fresh tokens" },
        cost: "$0.00",
        why: "<b>Trivial task.</b> A 7B model on your own machine clears it. Never leaves the device.",
      },
      {
        q: "refactor the auth middleware, keep the tests green",
        pick: { harness: "Cursor", model: "Kimi K3", provider: "Together", cache: "cache read" },
        cost: "$0.004",
        why: "<b>Mid-size refactor.</b> Open-weights at roughly a twelfth of frontier price. Context cached.",
      },
      {
        q: "design the migration plan for splitting the tenant database",
        pick: { harness: "Claude Code", model: "Claude Sonnet", provider: "Anthropic", cache: "cache write" },
        cost: "$0.19",
        why: "<b>Hard reasoning.</b> Frontier model at the model's own rate. Conifer adds nothing on top.",
      },
    ];

    var askCol = document.createElement("div");
    askCol.className = "route-col end ask";
    askCol.innerHTML = '<span class="dot"></span><span class="col-label">ask</span>';
    body.appendChild(askCol);

    var optEls = {};
    COLS.forEach(function (c) {
      var col = document.createElement("div");
      col.className = "route-col";
      col.innerHTML = '<span class="col-label">' + c.label + "</span>";
      optEls[c.key] = {};
      c.items.forEach(function (name) {
        var o = document.createElement("div");
        o.className = "opt";
        o.innerHTML = '<span class="box"></span><span>' + name + "</span>";
        col.appendChild(o);
        optEls[c.key][name] = o;
      });
      body.appendChild(col);
    });

    var ansCol = document.createElement("div");
    ansCol.className = "route-col end";
    ansCol.innerHTML = '<span class="dot"></span><span class="col-label">answer</span>';
    body.appendChild(ansCol);

    var qEl = document.getElementById("route-query");
    var costEl = document.getElementById("route-cost");
    var whyEl = document.getElementById("route-why");
    var stepsEl = document.getElementById("route-steps");
    var cur = -1;
    var timer = 0;

    function show(i) {
      cur = i;
      var s = SCENES[i];
      qEl.textContent = s.q;
      costEl.textContent = s.cost;
      whyEl.innerHTML = s.why;
      COLS.forEach(function (c) {
        Object.keys(optEls[c.key]).forEach(function (name) {
          optEls[c.key][name].classList.toggle("on", s.pick[c.key] === name);
        });
      });
      stepsEl.querySelectorAll(".step").forEach(function (b, k) {
        b.classList.toggle("on", k === i);
        b.setAttribute("aria-selected", String(k === i));
      });
    }

    function next() {
      show((cur + 1) % SCENES.length);
    }

    function restart() {
      clearInterval(timer);
      if (!reduced) timer = setInterval(next, 4200);
    }

    SCENES.forEach(function (_, i) {
      var b = document.createElement("button");
      b.className = "step";
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-label", "Example " + (i + 1));
      b.addEventListener("click", function () {
        show(i);
        restart();
      });
      stepsEl.appendChild(b);
    });

    show(0);
    restart();

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        function (entries) {
          if (entries[0].isIntersecting) restart();
          else clearInterval(timer);
        },
        { threshold: 0.2 },
      ).observe(body);
    }
  })();
})();

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

    var SCENES = [
      {
        q: "rename these forty files to kebab-case",
        why: "<b>Trivial task.</b> A 7B model on your own machine clears it. Never leaves the device.",
      },
      {
        q: "refactor the auth middleware, keep the tests green",
        why: "<b>Mid-size refactor.</b> Open-weights at roughly a twelfth of frontier price. Context cached.",
      },
      {
        q: "design the migration plan for splitting the tenant database",
        why: "<b>Hard reasoning.</b> Frontier model at the model's own rate. Conifer adds nothing on top.",
      },
    ];

    var qEl = document.getElementById("route-query");
    var whyEl = document.getElementById("route-why");
    var stepsEl = document.getElementById("route-steps");
    var cur = 1;
    var timer = 0;

    fetch("./partials/delta-diagram.html")
      .then(function (r) {
        return r.text();
      })
      .then(function (html) {
        mount.innerHTML = html;
      })
      .catch(function () {
        mount.innerHTML =
          '<img src="./assets/route-diagram-fallback.png" alt="Routing diagram" width="1120" height="510" style="width:100%;height:auto;border-radius:29px" />';
      });

    function show(i) {
      cur = i;
      var s = SCENES[i];
      if (qEl) qEl.textContent = s.q;
      if (whyEl) whyEl.innerHTML = s.why;
      if (stepsEl) {
        stepsEl.querySelectorAll(".step").forEach(function (b, k) {
          b.classList.toggle("on", k === i);
          b.setAttribute("aria-selected", String(k === i));
        });
      }
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
      b.className = "step" + (i === cur ? " on" : "");
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-label", "Example " + (i + 1));
      b.setAttribute("aria-selected", String(i === cur));
      b.addEventListener("click", function () {
        show(i);
        restart();
      });
      stepsEl.appendChild(b);
    });

    restart();

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        function (entries) {
          if (entries[0].isIntersecting) restart();
          else clearInterval(timer);
        },
        { threshold: 0.2 },
      ).observe(mount);
    }
  })();
})();

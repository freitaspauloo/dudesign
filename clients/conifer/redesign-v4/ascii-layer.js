/* Reusable image-sampled ASCII layer — hero backgrounds, cards, etc. */
(function (global) {
  var STORAGE_KEY = "conifer-ascii-vector-v1";

  var DEFAULTS = {
    cellSize: 8,
    cellRatio: 1.6,
    opacity: 0.7,
    contrast: 1.05,
    threshold: 0.18,
    blendMode: "multiply",
    charset: " ..::;;-+=x*#",
    liveDensity: 0.006,
    rippleRadius: 14,
    rippleStrength: 0.35,
    colorLight: "#c6d6e3",
    colorMid: "#9ab4c9",
    colorDark: "#6a8ea8",
    colorDeep: "#3d5a78",
    colorAccent: "#6ec4e8",
    imgScaleX: 1.1377,
    imgScaleY: 1.3009,
    imgOffsetX: -0.0689,
    imgOffsetY: -0.3009,
    cardCellScale: 1.35,
    fontFamily: '"Geist Mono", ui-monospace, monospace',
  };

  function mergeConfig(base, patch) {
    var out = Object.assign({}, base);
    if (patch) Object.assign(out, patch);
    return out;
  }

  function loadStored() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return mergeConfig(DEFAULTS, JSON.parse(raw));
    } catch (e) {}
    return mergeConfig(DEFAULTS, null);
  }

  function saveStored(config) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {}
  }

  function AsciiLayer(host, options) {
    this.host = host;
    this.globalConfig = options.globalConfig || loadStored();
    this.localConfig = mergeConfig(this.globalConfig, options.config || null);
    this.src = options.src;
    this.interactive = options.interactive !== false;
    this.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    this.canvas = document.createElement("canvas");
    this.canvas.className = options.canvasClass || "ascii-layer-canvas";
    this.host.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d", { alpha: true });
    this.sample = document.createElement("canvas");
    this.sampleCtx = this.sample.getContext("2d", { willReadFrequently: true });
    this.image = null;
    this.pointer = null;
    this.t = 0;
    this.raf = 0;
    this.live = null;
    this.resizeObs = null;
    this._onResize = this._debounce(this.render.bind(this), 80);
  }

  AsciiLayer.prototype._debounce = function (fn, ms) {
    var to;
    return function () {
      var self = this;
      var args = arguments;
      clearTimeout(to);
      to = setTimeout(function () {
        fn.apply(self, args);
      }, ms);
    };
  };

  AsciiLayer.prototype.setConfig = function (patch, persist) {
    this.localConfig = mergeConfig(this.localConfig, patch);
    this.live = null;
    this.grid = null;
    if (persist !== false && this === global.__coniferHeroAscii) {
      this.globalConfig = mergeConfig(this.globalConfig, patch);
      saveStored(this.globalConfig);
      global.dispatchEvent(new CustomEvent("conifer-ascii-config", { detail: this.globalConfig }));
    }
    this.applyStyles();
    this.render();
  };

  AsciiLayer.prototype.getConfig = function () {
    return Object.assign({}, this.localConfig);
  };

  AsciiLayer.prototype.applyStyles = function () {
    var c = this.localConfig;
    this.canvas.style.opacity = String(c.opacity);
    this.canvas.style.mixBlendMode = c.blendMode;
    this.canvas.style.filter = "contrast(" + c.contrast + ")";
  };

  AsciiLayer.prototype.loadImage = function () {
    var self = this;
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.decoding = "async";
      img.onload = function () {
        self.image = img;
        resolve();
      };
      img.onerror = reject;
      img.src = self.src;
    });
  };

  /* Sample the image once at grid resolution: one drawImage + one getImageData
     per layout, instead of one getImageData per cell. Cached until size/config
     changes; the pointer ripple re-reads the cached grid only. */
  AsciiLayer.prototype._buildGrid = function (hostW, hostH, cols, rows) {
    var c = this.localConfig;
    this.sample.width = cols;
    this.sample.height = rows;
    var sctx = this.sampleCtx;
    sctx.clearRect(0, 0, cols, rows);
    sctx.imageSmoothingEnabled = true;
    sctx.imageSmoothingQuality = "high";
    // draw scaled so one sample pixel == one grid cell
    sctx.drawImage(
      this.image,
      cols * c.imgOffsetX,
      rows * c.imgOffsetY,
      cols * c.imgScaleX,
      rows * c.imgScaleY,
    );
    var data = sctx.getImageData(0, 0, cols, rows).data;
    var grid = new Float32Array(cols * rows);
    for (var i = 0, p = 0; i < data.length; i += 4, p++) {
      var a = data[i + 3] / 255;
      if (a < 0.05) {
        grid[p] = 0;
        continue;
      }
      // dark ink on light ground → darkness = density
      var lum = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
      grid[p] = (1 - lum) * a;
    }
    this.grid = { cols: cols, rows: rows, data: grid, w: hostW, h: hostH, key: this._gridKey() };
  };

  AsciiLayer.prototype._gridKey = function () {
    var c = this.localConfig;
    return [c.imgScaleX, c.imgScaleY, c.imgOffsetX, c.imgOffsetY].join("|");
  };

  AsciiLayer.prototype.render = function () {
    if (!this.image) return;
    var c = this.localConfig;
    var hostW = this.host.clientWidth;
    var hostH = this.host.clientHeight;
    if (!hostW || !hostH) return;

    var dpr = Math.min(2, window.devicePixelRatio || 1);
    var cellW = Math.max(3, c.cellSize);
    var cellH = cellW * c.cellRatio;
    var cols = Math.max(1, Math.floor(hostW / cellW));
    var rows = Math.max(1, Math.floor(hostH / cellH));
    var fontSize = cellW * 1.3;

    var needCanvas = this.canvas.width !== Math.floor(hostW * dpr) || this.canvas.height !== Math.floor(hostH * dpr);
    if (needCanvas) {
      this.canvas.style.width = hostW + "px";
      this.canvas.style.height = hostH + "px";
      this.canvas.width = Math.floor(hostW * dpr);
      this.canvas.height = Math.floor(hostH * dpr);
    }

    var g = this.grid;
    if (!g || g.cols !== cols || g.rows !== rows || g.key !== this._gridKey()) {
      this._buildGrid(hostW, hostH, cols, rows);
      g = this.grid;
    }

    if (!this.live || this.live.rows !== rows || this.live.cols !== cols) {
      var seed = 2026;
      this.live = { rows: rows, cols: cols, cells: [] };
      for (var y = 0; y < rows; y++) {
        var row = [];
        for (var x = 0; x < cols; x++) {
          seed = (seed * 16807) % 2147483647;
          row.push(seed / 2147483647 < c.liveDensity);
        }
        this.live.cells.push(row);
      }
    }

    var charset = c.charset || DEFAULTS.charset;
    var ctx = this.ctx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = fontSize + "px " + c.fontFamily;
    ctx.textBaseline = "top";
    ctx.textAlign = "left";

    var tones = [c.colorLight, c.colorMid, c.colorDark, c.colorDeep];
    var px = this.pointer ? this.pointer.x / cellW : -1e9;
    var py = this.pointer ? this.pointer.y / cellH : -1e9;

    var hasPointer = this.pointer && this.interactive && !this.reduced;
    var gdata = g.data;

    for (var ry = 0; ry < rows; ry++) {
      for (var rx = 0; rx < cols; rx++) {
        var dark = gdata[ry * cols + rx];
        if (dark < c.threshold) continue;

        // remap so threshold → 0, full ink → 1, then ease so mids stay soft
        var d = (dark - c.threshold) / (1 - c.threshold);
        d = d * d * (3 - 2 * d);
        if (hasPointer) {
          var dx = rx - px;
          var dy = (ry - py) * 1.2;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < c.rippleRadius) {
            var wave = Math.sin(dist * 0.75 - this.t * 0.14) * 0.5 + 0.5;
            d = Math.min(1, d + wave * (1 - dist / c.rippleRadius) * c.rippleStrength);
          }
        }

        var ci = Math.min(charset.length - 1, Math.floor(d * (charset.length - 1)));
        var ch = charset[ci];
        if (ch === " ") continue;

        ctx.fillStyle = this.live.cells[ry][rx] ? c.colorAccent : tones[Math.min(3, Math.floor(d * 3.999))];
        ctx.fillText(ch, rx * cellW, ry * cellH);
      }
    }
  };

  AsciiLayer.prototype._loop = function () {
    this.t++;
    this.render();
    this.raf = this.pointer ? requestAnimationFrame(this._loop.bind(this)) : 0;
  };

  AsciiLayer.prototype.mount = function () {
    var self = this;
    this.applyStyles();
    return this.loadImage().then(function () {
      self.render();
      window.addEventListener("resize", self._onResize);
      if ("ResizeObserver" in window) {
        self.resizeObs = new ResizeObserver(function () {
          self._onResize();
        });
        self.resizeObs.observe(self.host);
      }
      if (self.interactive && !self.reduced) {
        self.canvas.addEventListener("pointermove", function (e) {
          var rect = self.canvas.getBoundingClientRect();
          self.pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
          if (!self.raf) self.raf = requestAnimationFrame(self._loop.bind(self));
        });
        self.canvas.addEventListener("pointerleave", function () {
          self.pointer = null;
          self.render();
        });
      }
    });
  };

  AsciiLayer.prototype.destroy = function () {
    window.removeEventListener("resize", this._onResize);
    if (this.resizeObs) this.resizeObs.disconnect();
    if (this.raf) cancelAnimationFrame(this.raf);
    this.canvas.remove();
  };

  function cardConfig(globalConfig) {
    return mergeConfig(globalConfig, {
      cellSize: globalConfig.cellSize * globalConfig.cardCellScale,
      opacity: Math.min(0.4, globalConfig.opacity * 0.6),
      threshold: Math.min(0.9, globalConfig.threshold + 0.06),
      liveDensity: 0,
      interactive: false,
    });
  }

  global.ConiferAscii = {
    DEFAULTS: DEFAULTS,
    loadStored: loadStored,
    saveStored: saveStored,
    cardConfig: cardConfig,
    createLayer: function (host, options) {
      return new AsciiLayer(host, options || {});
    },
  };
})(window);

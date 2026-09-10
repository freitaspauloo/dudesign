/* Image-sampled Bayer dither layer — hero backgrounds, cards, etc. */
(function (global) {
  var STORAGE_KEY = "conifer-dither-config-v5";

  var BAYER_2x2 = [0, 2, 3, 1];

  var DEFAULTS = {
    renderMode: "bayer",
    ditherSize: 1,
    levels: 4,
    brightness: 1,
    contrast: 1,
    mono: false,
    monoColor: "#d4e9ff",
    monoMix: 0.48,
    opacity: 1,
    blendMode: "normal",
    imgScaleX: 1.5934,
    imgScaleY: 1.0374,
    imgOffsetX: -0.2838,
    imgOffsetY: -0.0187,
    cardDitherSize: 2,
    cardOpacity: 0.38,
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

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function hexRgb(hex) {
    var h = hex.replace("#", "");
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
    };
  }

  function bayerThreshold(x, y, size) {
    var bx = Math.floor(x / size) % 2;
    var by = Math.floor(y / size) % 2;
    return (BAYER_2x2[by * 2 + bx] + 0.5) / 4;
  }

  function tone(v, brightness, contrast) {
    v = v * brightness;
    v = (v - 0.5) * contrast + 0.5;
    return clamp(v, 0, 1);
  }

  function quantize(v, levels, threshold) {
    var steps = Math.max(1, levels - 1);
    return Math.min(1, Math.floor(v * steps + threshold) / steps);
  }

  function DitherLayer(host, options) {
    this.host = host;
    this.globalConfig = options.globalConfig || loadStored();
    this.localConfig = mergeConfig(this.globalConfig, options.config || null);
    this.src = options.src;
    this.interactive = false;

    this.canvas = document.createElement("canvas");
    this.canvas.className = options.canvasClass || "ascii-layer-canvas";
    this.host.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d", { alpha: true });
    this.sample = document.createElement("canvas");
    this.sampleCtx = this.sample.getContext("2d", { willReadFrequently: true });
    this.image = null;
    this.frame = null;
    this.resizeObs = null;
    this._onResize = this._debounce(this.render.bind(this), 80);
  }

  DitherLayer.prototype._debounce = function (fn, ms) {
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

  DitherLayer.prototype.setConfig = function (patch, persist) {
    this.localConfig = mergeConfig(this.localConfig, patch);
    this.frame = null;
    if (persist !== false && this === global.__coniferHeroAscii) {
      this.globalConfig = mergeConfig(this.globalConfig, patch);
      saveStored(this.globalConfig);
      global.dispatchEvent(new CustomEvent("conifer-ascii-config", { detail: this.globalConfig }));
    }
    this.applyStyles();
    this.render();
  };

  DitherLayer.prototype.getConfig = function () {
    return Object.assign({}, this.localConfig);
  };

  DitherLayer.prototype.applyStyles = function () {
    var c = this.localConfig;
    this.canvas.style.opacity = String(c.opacity);
    this.canvas.style.mixBlendMode = c.blendMode;
    this.canvas.style.filter = "";
  };

  DitherLayer.prototype.loadImage = function () {
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

  DitherLayer.prototype._frameKey = function (w, h, dpr) {
    var c = this.localConfig;
    return [
      w,
      h,
      dpr,
      c.ditherSize,
      c.levels,
      c.brightness,
      c.contrast,
      c.mono,
      c.monoColor,
      c.monoMix,
      c.imgScaleX,
      c.imgScaleY,
      c.imgOffsetX,
      c.imgOffsetY,
    ].join("|");
  };

  DitherLayer.prototype._buildFrame = function (hostW, hostH, dpr) {
    var c = this.localConfig;
    var pw = Math.max(1, Math.floor(hostW * dpr));
    var ph = Math.max(1, Math.floor(hostH * dpr));
    var size = Math.max(1, c.ditherSize);
    var levels = Math.max(2, Math.round(c.levels));
    var monoRgb = hexRgb(c.monoColor || DEFAULTS.monoColor);
    var monoMix = c.mono ? clamp(c.monoMix, 0, 1) : 0;

    this.sample.width = pw;
    this.sample.height = ph;
    var sctx = this.sampleCtx;
    sctx.clearRect(0, 0, pw, ph);
    sctx.imageSmoothingEnabled = true;
    sctx.imageSmoothingQuality = "high";
    sctx.drawImage(
      this.image,
      hostW * c.imgOffsetX * dpr,
      hostH * c.imgOffsetY * dpr,
      hostW * c.imgScaleX * dpr,
      hostH * c.imgScaleY * dpr,
    );

    var src = sctx.getImageData(0, 0, pw, ph);
    var out = sctx.createImageData(pw, ph);
    var sd = src.data;
    var od = out.data;

    for (var y = 0; y < ph; y++) {
      var t = bayerThreshold(0, y, size);
      for (var x = 0; x < pw; x++) {
        t = bayerThreshold(x, y, size);
        var i = (y * pw + x) * 4;
        var a = sd[i + 3];
        if (a < 8) {
          od[i + 3] = 0;
          continue;
        }

        var r = tone(sd[i] / 255, c.brightness, c.contrast);
        var g = tone(sd[i + 1] / 255, c.brightness, c.contrast);
        var b = tone(sd[i + 2] / 255, c.brightness, c.contrast);

        if (c.mono) {
          var lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          lum = quantize(lum, levels, t);
          var mr = monoRgb.r / 255;
          var mg = monoRgb.g / 255;
          var mb = monoRgb.b / 255;
          r = r * (1 - monoMix) + mr * lum * monoMix;
          g = g * (1 - monoMix) + mg * lum * monoMix;
          b = b * (1 - monoMix) + mb * lum * monoMix;
        } else {
          r = quantize(r, levels, t);
          g = quantize(g, levels, t);
          b = quantize(b, levels, t);
        }

        od[i] = Math.round(r * 255);
        od[i + 1] = Math.round(g * 255);
        od[i + 2] = Math.round(b * 255);
        od[i + 3] = a;
      }
    }

    this.frame = {
      key: this._frameKey(hostW, hostH, dpr),
      imageData: out,
      pw: pw,
      ph: ph,
    };
  };

  DitherLayer.prototype.render = function () {
    if (!this.image) return;
    var hostW = this.host.clientWidth;
    var hostH = this.host.clientHeight;
    if (!hostW || !hostH) return;

    var dpr = Math.min(2, window.devicePixelRatio || 1);
    var pw = Math.floor(hostW * dpr);
    var ph = Math.floor(hostH * dpr);
    var key = this._frameKey(hostW, hostH, dpr);

    if (this.canvas.width !== pw || this.canvas.height !== ph) {
      this.canvas.style.width = hostW + "px";
      this.canvas.style.height = hostH + "px";
      this.canvas.width = pw;
      this.canvas.height = ph;
      this.frame = null;
    }

    if (!this.frame || this.frame.key !== key) {
      this._buildFrame(hostW, hostH, dpr);
    }

    var ctx = this.ctx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, pw, ph);
    ctx.putImageData(this.frame.imageData, 0, 0);

    var heroBg = this.host.closest(".hero-bg");
    if (heroBg) heroBg.classList.add("is-dithered");
  };

  DitherLayer.prototype.mount = function () {
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
    });
  };

  DitherLayer.prototype.destroy = function () {
    window.removeEventListener("resize", this._onResize);
    if (this.resizeObs) this.resizeObs.disconnect();
    this.canvas.remove();
  };

  function cardConfig(globalConfig) {
    return mergeConfig(globalConfig, {
      ditherSize: globalConfig.cardDitherSize || 2,
      opacity: globalConfig.cardOpacity != null ? globalConfig.cardOpacity : 0.38,
      interactive: false,
    });
  }

  global.ConiferAscii = {
    DEFAULTS: DEFAULTS,
    loadStored: loadStored,
    saveStored: saveStored,
    cardConfig: cardConfig,
    createLayer: function (host, options) {
      return new DitherLayer(host, options || {});
    },
  };
})(window);

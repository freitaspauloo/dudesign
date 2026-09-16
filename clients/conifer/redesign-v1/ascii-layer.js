/* Image-sampled glyph / Bayer layer — hero backgrounds, cards, etc. */
(function (global) {
  var STORAGE_KEY = "conifer-ascii-config-v7";

  var BAYER_2x2 = [0, 2, 3, 1];

  /* Figma 1418:715 — ASCII Art shader (Minimal charset) */
  var DEFAULTS = {
    renderMode: "glyph",
    cellSize: 8,
    contrast: 0.33,
    charSet: 4,
    glyphColor: "#ffffff",
    backgroundColor: "#f0ece4",
    brightness: 1,
    mono: false,
    monoColor: "#ffffff",
    opacity: 1,
    blendMode: "normal",
    imgFit: "cover",
    imgAnchorX: 0,
    imgAnchorY: 0,
    imgScaleX: 1,
    imgScaleY: 1,
    imgOffsetX: 0,
    imgOffsetY: 0,
    cardCellSize: 6,
    cardOpacity: 0.38,
    ditherSize: 1,
    levels: 4,
    monoMix: 0.48,
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

  function charSetLevels(charSet) {
    if (charSet === 0) return 9;
    if (charSet === 1) return 5;
    if (charSet === 2) return 2;
    if (charSet === 3) return 5;
    return 3;
  }

  function glyphCoverage(charSet, level, cx, cy) {
    var margin = 0.08;
    var lx = (cx - margin) / (1 - 2 * margin);
    var ly = (cy - margin) / (1 - 2 * margin);
    var inside = lx >= 0 && lx <= 1 && ly >= 0 && ly <= 1;

    if (charSet === 0) {
      if (level === 0) return 0;
      if (level === 1) {
        var dx1 = lx - 0.5;
        var dy1 = ly - 0.7;
        return inside && Math.sqrt(dx1 * dx1 + dy1 * dy1) < 0.08 ? 1 : 0;
      }
      if (level === 2) {
        var dx2 = lx - 0.5;
        var dyA = ly - 0.3;
        var dyB = ly - 0.7;
        return inside && (Math.sqrt(dx2 * dx2 + dyA * dyA) < 0.08 || Math.sqrt(dx2 * dx2 + dyB * dyB) < 0.08) ? 1 : 0;
      }
      if (level === 3) return inside && Math.abs(ly - 0.5) < 0.09 && lx > 0.15 && lx < 0.85 ? 1 : 0;
      if (level === 4) {
        return inside && (Math.abs(ly - 0.35) < 0.08 || Math.abs(ly - 0.65) < 0.08) && lx > 0.1 && lx < 0.9 ? 1 : 0;
      }
      if (level === 5) {
        var hbar = Math.abs(ly - 0.5) < 0.09 && lx > 0.1 && lx < 0.9;
        var vbar = Math.abs(lx - 0.5) < 0.09 && ly > 0.1 && ly < 0.9;
        return inside && (hbar || vbar) ? 1 : 0;
      }
      if (level === 6) {
        var hb = Math.abs(ly - 0.5) < 0.08 && lx > 0.1 && lx < 0.9;
        var vb = Math.abs(lx - 0.5) < 0.08 && ly > 0.1 && ly < 0.9;
        var d1 = Math.abs(lx - ly) < 0.1;
        var d2 = Math.abs(lx + ly - 1) < 0.1;
        return inside && (hb || vb || d1 || d2) ? 1 : 0;
      }
      if (level === 7) {
        var h1 = Math.abs(ly - 0.33) < 0.08;
        var h2 = Math.abs(ly - 0.67) < 0.08;
        var v1 = Math.abs(lx - 0.33) < 0.08;
        var v2 = Math.abs(lx - 0.67) < 0.08;
        return inside && (h1 || h2 || v1 || v2) ? 1 : 0;
      }
      var dx8 = lx - 0.5;
      var dy8 = ly - 0.5;
      var r8 = Math.sqrt(dx8 * dx8 + dy8 * dy8);
      var ring = r8 > 0.25 && r8 < 0.45;
      var inner = r8 < 0.2 && lx > 0.45;
      return inside && (ring || inner) ? 1 : 0;
    }

    if (charSet === 1) {
      if (level === 0) return 0;
      var gridX = Math.floor(lx * 4);
      var gridY = Math.floor(ly * 4);
      var cell16 = gridX + gridY * 4;
      if (level === 1) return inside && cell16 % 4 === 0 ? 1 : 0;
      if (level === 2) return inside && (gridX + gridY) % 2 === 0 ? 1 : 0;
      if (level === 3) return inside && cell16 % 4 !== 0 ? 1 : 0;
      return inside ? 1 : 0;
    }

    if (charSet === 2) {
      if (level === 0) {
        var dx0 = lx - 0.5;
        var dy0 = (ly - 0.5) * 0.7;
        var r0 = Math.sqrt(dx0 * dx0 + dy0 * dy0);
        return inside && r0 > 0.25 && r0 < 0.42 ? 1 : 0;
      }
      var vbar2 = Math.abs(lx - 0.5) < 0.09 && ly > 0.1 && ly < 0.9;
      var serif = Math.abs(ly - 0.9) < 0.08 && lx > 0.25 && lx < 0.75;
      var top = Math.abs(ly - 0.1) < 0.08 && lx > 0.3 && lx < 0.6;
      return inside && (vbar2 || serif || top) ? 1 : 0;
    }

    if (charSet === 3) {
      if (level === 0) return 0;
      if (level === 1) {
        var dxd = lx - 0.5;
        var dyd = ly - 0.75;
        return inside && Math.sqrt(dxd * dxd + dyd * dyd) < 0.09 ? 1 : 0;
      }
      if (level === 2) {
        var dxd2 = lx - 0.5;
        var rA = Math.sqrt(dxd2 * dxd2 + (ly - 0.28) * (ly - 0.28));
        var rB = Math.sqrt(dxd2 * dxd2 + (ly - 0.72) * (ly - 0.72));
        return inside && (rA < 0.09 || rB < 0.09) ? 1 : 0;
      }
      if (level === 3) return inside && Math.abs(lx - 0.5) < 0.07 && ly > 0.1 && ly < 0.9 ? 1 : 0;
      var vb3 = Math.abs(lx - 0.5) < 0.07 && ly > 0.1 && ly < 0.75;
      var dot = Math.sqrt((lx - 0.5) * (lx - 0.5) + (ly - 0.88) * (ly - 0.88)) < 0.09;
      return inside && (vb3 || dot) ? 1 : 0;
    }

    /* Minimal — Figma default */
    if (level === 0) return 0;
    if (level === 1) {
      var dxm = lx - 0.5;
      var dym = ly - 0.7;
      return inside && Math.sqrt(dxm * dxm + dym * dym) < 0.09 ? 1 : 0;
    }
    var dxm2 = lx - 0.5;
    var dym2 = ly - 0.5;
    var rm = Math.sqrt(dxm2 * dxm2 + dym2 * dym2);
    var ringM = rm > 0.25 && rm < 0.45;
    var innerM = rm < 0.2 && lx > 0.45;
    return inside && (ringM || innerM) ? 1 : 0;
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

  function computeImageRect(img, hostW, hostH, config) {
    var iw = img.naturalWidth || img.width;
    var ih = img.naturalHeight || img.height;
    if (!iw || !ih) {
      return { x: 0, y: 0, w: hostW, h: hostH };
    }

    if (config.imgFit === "custom") {
      return {
        x: hostW * (config.imgOffsetX || 0),
        y: hostH * (config.imgOffsetY || 0),
        w: hostW * (config.imgScaleX || 1),
        h: hostH * (config.imgScaleY || 1),
      };
    }

    var scale =
      config.imgFit === "contain"
        ? Math.min(hostW / iw, hostH / ih)
        : Math.max(hostW / iw, hostH / ih);
    var drawW = iw * scale;
    var drawH = ih * scale;
    var anchorX = config.imgAnchorX != null ? config.imgAnchorX : 0;
    var anchorY = config.imgAnchorY != null ? config.imgAnchorY : 0;

    return {
      x: (hostW - drawW) * anchorX + hostW * (config.imgOffsetX || 0),
      y: (hostH - drawH) * anchorY + hostH * (config.imgOffsetY || 0),
      w: drawW,
      h: drawH,
    };
  }

  function AsciiLayer(host, options) {
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
    this.frame = null;
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
    this.canvas.style.filter = "";
    var heroBg = this.host.closest(".hero-bg");
    if (heroBg && c.backgroundColor) {
      heroBg.style.backgroundColor = c.backgroundColor;
    }
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

  AsciiLayer.prototype._frameKey = function (w, h, dpr) {
    var c = this.localConfig;
    return [
      w,
      h,
      dpr,
      c.renderMode,
      c.cellSize,
      c.contrast,
      c.charSet,
      c.glyphColor,
      c.backgroundColor,
      c.brightness,
      c.ditherSize,
      c.levels,
      c.mono,
      c.monoColor,
      c.imgFit,
      c.imgAnchorX,
      c.imgAnchorY,
      c.imgScaleX,
      c.imgScaleY,
      c.imgOffsetX,
      c.imgOffsetY,
      this.image ? this.image.naturalWidth : 0,
      this.image ? this.image.naturalHeight : 0,
    ].join("|");
  };

  AsciiLayer.prototype._drawSample = function (hostW, hostH, dpr) {
    var pw = Math.max(1, Math.floor(hostW * dpr));
    var ph = Math.max(1, Math.floor(hostH * dpr));
    var rect = computeImageRect(this.image, hostW, hostH, this.localConfig);

    this.sample.width = pw;
    this.sample.height = ph;
    var sctx = this.sampleCtx;
    sctx.clearRect(0, 0, pw, ph);
    sctx.imageSmoothingEnabled = true;
    sctx.imageSmoothingQuality = "high";
    sctx.drawImage(
      this.image,
      rect.x * dpr,
      rect.y * dpr,
      rect.w * dpr,
      rect.h * dpr,
    );
    return sctx.getImageData(0, 0, pw, ph);
  };

  AsciiLayer.prototype._buildGlyphFrame = function (hostW, hostH, dpr) {
    var c = this.localConfig;
    var pw = Math.max(1, Math.floor(hostW * dpr));
    var ph = Math.max(1, Math.floor(hostH * dpr));
    var cellSize = Math.max(4, Math.round(c.cellSize || 8));
    var contrast = c.contrast != null ? c.contrast : 0.33;
    var charSet = c.charSet != null ? c.charSet : 4;
    var numLevels = charSetLevels(charSet);
    var glyph = hexRgb(c.glyphColor || "#ffffff");
    var bg = hexRgb(c.backgroundColor || "#f0ece4");
    var src = this._drawSample(hostW, hostH, dpr);
    var sd = src.data;
    var out = this.sampleCtx.createImageData(pw, ph);
    var od = out.data;

    for (var i = 0; i < od.length; i += 4) {
      od[i] = bg.r;
      od[i + 1] = bg.g;
      od[i + 2] = bg.b;
      od[i + 3] = 255;
    }

    for (var cy = 0; cy < ph; cy += cellSize) {
      for (var cx = 0; cx < pw; cx += cellSize) {
        var centerX = Math.min(pw - 1, cx + Math.floor(cellSize * 0.5));
        var centerY = Math.min(ph - 1, cy + Math.floor(cellSize * 0.5));
        var ci = (centerY * pw + centerX) * 4;
        var cellR = sd[ci] / 255;
        var cellG = sd[ci + 1] / 255;
        var cellB = sd[ci + 2] / 255;
        var brightness = 0.299 * cellR + 0.587 * cellG + 0.114 * cellB;
        brightness *= c.brightness || 1;
        var remapped = Math.pow(clamp(brightness, 0, 1), 1 - contrast * 0.8);
        var inverted = 1 - remapped;
        var level = Math.min(numLevels - 1, Math.floor(inverted * numLevels));

        for (var py = 0; py < cellSize; py++) {
          var y = cy + py;
          if (y >= ph) break;
          for (var px = 0; px < cellSize; px++) {
            var x = cx + px;
            if (x >= pw) break;
            var oi = (y * pw + x) * 4;
            var alpha = sd[oi + 3] / 255;
            if (alpha < 0.02) continue;

            var coverage = glyphCoverage(charSet, level, px / cellSize, py / cellSize);
            if (coverage <= 0) continue;

            var outA = alpha * coverage;
            od[oi] = glyph.r;
            od[oi + 1] = glyph.g;
            od[oi + 2] = glyph.b;
            od[oi + 3] = Math.round(outA * 255);
          }
        }
      }
    }

    this.frame = {
      key: this._frameKey(hostW, hostH, dpr),
      imageData: out,
      pw: pw,
      ph: ph,
    };
  };

  AsciiLayer.prototype._buildBayerFrame = function (hostW, hostH, dpr) {
    var c = this.localConfig;
    var pw = Math.max(1, Math.floor(hostW * dpr));
    var ph = Math.max(1, Math.floor(hostH * dpr));
    var size = Math.max(1, c.ditherSize);
    var levels = Math.max(2, Math.round(c.levels));
    var monoRgb = hexRgb(c.monoColor || DEFAULTS.monoColor);
    var monoMix = c.mono ? clamp(c.monoMix, 0, 1) : 0;
    var src = this._drawSample(hostW, hostH, dpr);
    var sd = src.data;
    var out = this.sampleCtx.createImageData(pw, ph);
    var od = out.data;

    for (var y = 0; y < ph; y++) {
      for (var x = 0; x < pw; x++) {
        var t = bayerThreshold(x, y, size);
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

  AsciiLayer.prototype._buildFrame = function (hostW, hostH, dpr) {
    if (this.localConfig.renderMode === "bayer") {
      this._buildBayerFrame(hostW, hostH, dpr);
    } else {
      this._buildGlyphFrame(hostW, hostH, dpr);
    }
  };

  AsciiLayer.prototype.render = function () {
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
    });
  };

  AsciiLayer.prototype.destroy = function () {
    window.removeEventListener("resize", this._onResize);
    if (this.resizeObs) this.resizeObs.disconnect();
    this.canvas.remove();
  };

  function cardConfig(globalConfig) {
    return mergeConfig(globalConfig, {
      cellSize: globalConfig.cardCellSize || 6,
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
      return new AsciiLayer(host, options || {});
    },
  };
})(window);

/* Bottom-right dither tweak panel */
(function (global) {
  var FIELDS = [
    { key: "ditherSize", label: "size", min: 1, max: 4, step: 1 },
    { key: "levels", label: "levels", min: 2, max: 8, step: 1 },
    { key: "brightness", label: "brightness", min: 0.6, max: 1.4, step: 0.02 },
    { key: "contrast", label: "contrast", min: 0.6, max: 1.6, step: 0.05 },
    { key: "opacity", label: "opacity", min: 0.2, max: 1, step: 0.02 },
    { key: "cardDitherSize", label: "card size", min: 1, max: 4, step: 1 },
    { key: "cardOpacity", label: "card opacity", min: 0.1, max: 0.8, step: 0.02 },
  ];

  function AsciiWidget(layer, onChange, mountEl) {
    this.layer = layer;
    this.onChange = onChange;
    this.open = false;
    this.root = document.createElement("div");
    this.root.className = "ascii-widget";
    this.root.innerHTML =
      '<button type="button" class="ascii-widget-toggle pill" aria-expanded="false">dither</button>' +
      '<div class="ascii-widget-panel pill" hidden>' +
      '<div class="ascii-widget-head"><span>Bayer 2×2</span><button type="button" class="ascii-widget-close" aria-label="Close">×</button></div>' +
      '<div class="ascii-widget-fields"></div>' +
      '<label class="ascii-widget-field ascii-widget-check"><span>mono</span>' +
      '<input type="checkbox" data-key="mono">' +
      "</label>" +
      '<label class="ascii-widget-field"><span>blend</span>' +
      '<select data-key="blendMode">' +
      '<option value="normal">normal</option>' +
      '<option value="multiply">multiply</option>' +
      '<option value="overlay">overlay</option>' +
      '<option value="soft-light">soft-light</option>' +
      "</select></label>" +
      '<div class="ascii-widget-actions">' +
      '<button type="button" class="copy" data-action="copy">copy json</button>' +
      '<button type="button" class="copy" data-action="reset">reset</button>' +
      "</div></div>";
    this.root.classList.toggle("ascii-widget--hero", !!mountEl);
    (mountEl || document.body).appendChild(this.root);

    this.toggleBtn = this.root.querySelector(".ascii-widget-toggle");
    this.panel = this.root.querySelector(".ascii-widget-panel");
    this.fieldsEl = this.root.querySelector(".ascii-widget-fields");
    this.blendSelect = this.root.querySelector('[data-key="blendMode"]');
    this.monoCheck = this.root.querySelector('[data-key="mono"]');

    var self = this;
    FIELDS.forEach(function (f) {
      var label = document.createElement("label");
      label.className = "ascii-widget-field";
      label.innerHTML =
        "<span>" +
        f.label +
        '</span><input type="range" data-key="' +
        f.key +
        '" min="' +
        f.min +
        '" max="' +
        f.max +
        '" step="' +
        f.step +
        '"><output data-out="' +
        f.key +
        '"></output>';
      self.fieldsEl.appendChild(label);
    });

    this.toggleBtn.addEventListener("click", function () {
      self.setOpen(!self.open);
    });
    this.root.querySelector(".ascii-widget-close").addEventListener("click", function () {
      self.setOpen(false);
    });
    this.root.querySelector('[data-action="reset"]').addEventListener("click", function () {
      self.apply(global.ConiferAscii.DEFAULTS, true);
      self.syncUI(global.ConiferAscii.DEFAULTS);
    });
    this.root.querySelector('[data-action="copy"]').addEventListener("click", function () {
      var json = JSON.stringify(self.layer.getConfig(), null, 2);
      navigator.clipboard.writeText(json);
    });

    this.root.querySelectorAll("input[data-key]").forEach(function (input) {
      input.addEventListener("input", function () {
        var patch = {};
        if (input.type === "checkbox") {
          patch[input.dataset.key] = input.checked;
        } else {
          patch[input.dataset.key] = parseFloat(input.value);
        }
        self.apply(patch, true);
        self.syncOutput(input.dataset.key, patch[input.dataset.key]);
      });
    });
    this.blendSelect.addEventListener("change", function () {
      self.apply({ blendMode: self.blendSelect.value }, true);
    });

    this.syncUI(this.layer.getConfig());
  }

  AsciiWidget.prototype.setOpen = function (open) {
    this.open = open;
    this.panel.hidden = !open;
    this.toggleBtn.setAttribute("aria-expanded", String(open));
  };

  AsciiWidget.prototype.syncOutput = function (key, val) {
    var out = this.root.querySelector('[data-out="' + key + '"]');
    if (out) out.textContent = String(Math.round(val * 1000) / 1000);
  };

  AsciiWidget.prototype.syncUI = function (config) {
    var self = this;
    FIELDS.forEach(function (f) {
      var input = self.root.querySelector('input[data-key="' + f.key + '"]');
      if (input) {
        input.value = config[f.key];
        self.syncOutput(f.key, config[f.key]);
      }
    });
    this.blendSelect.value = config.blendMode;
    this.monoCheck.checked = !!config.mono;
  };

  AsciiWidget.prototype.apply = function (patch, persist) {
    this.layer.setConfig(patch, persist);
    if (this.onChange) this.onChange(this.layer.getConfig());
  };

  global.ConiferAsciiWidget = AsciiWidget;
})(window);

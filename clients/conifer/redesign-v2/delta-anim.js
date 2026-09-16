/* Production delta diagram animation — ported from conifer.build homepage. */
(function (global) {
  var COL_X = [268, 494, 720, 946];
  var ASK = [40, 233];
  var ANSWER = [1086, 233];
  var VB_W = 1120;
  var VB_H = 510;
  var CYCLE_MS = 7000;

  var COL_KEYS = [
    ["Cursor", "OpenCode", "Claude Code", "Zed", "VS Code", "Codex", "Terminal"],
    ["google", "openai", "anthropic", "zhipu", "deepseek", "moonshot", "xai", "minimax", "alibaba", "mistral"],
    ["DeepSeek", "GMI Cloud", "Z AI", "Together", "Anthropic", "DeepInfra", "Cerebras", "Novita", "Fireworks", "your machine"],
    ["read", "fresh", "resident"],
  ];

  var CACHE_LABEL = { read: "cache read", fresh: "fresh tokens", resident: "resident" };

  var SCENES = [
    {
      ask: "refactor the auth middleware, keep the tests green",
      why: "<b>Mid-size refactor.</b> Open-weights at roughly a twelfth of frontier price. Context cached.",
      harness: "Claude Code",
      lab: "moonshot",
      model: "Kimi K3",
      host: "Together",
      cache: "read",
    },
    {
      ask: "what is this stack trace telling me?",
      why: "<b>Quick lookup.</b> Frontier model, short context, no cache to reuse. Answered in a second.",
      harness: "Cursor",
      lab: "anthropic",
      model: "Claude Sonnet 5",
      host: "Anthropic",
      cache: "fresh",
    },
    {
      ask: "add retries and a backoff to the upload client",
      why: "<b>Routine patch.</b> Mid-tier open-weights. Most of the prompt was already in cache.",
      harness: "Codex",
      lab: "minimax",
      model: "MiniMax M2.5",
      host: "GMI Cloud",
      cache: "read",
    },
    {
      ask: "summarise the review thread on the PR",
      why: "<b>Long-context skim.</b> Fast open-weights on Cerebras. Cached prefix, cheap decode.",
      harness: "VS Code",
      lab: "openai",
      model: "GPT-OSS 120B",
      host: "Cerebras",
      cache: "read",
    },
    {
      ask: "rename these forty files to kebab-case",
      why: "<b>Trivial task.</b> A small model on your own machine clears it. Never leaves the device.",
      harness: "Terminal",
      lab: "alibaba",
      model: "Qwen 3.5 4B",
      host: "your machine",
      cache: "resident",
    },
    {
      ask: "write the migration for the new invoices table",
      why: "<b>Fresh schema work.</b> DeepSeek at the model's own rate. No cached prefix this time.",
      harness: "Zed",
      lab: "deepseek",
      model: "DeepSeek V4 Pro",
      host: "DeepSeek",
      cache: "fresh",
    },
  ];

  function clamp01(v) {
    return v < 0 ? 0 : v > 1 ? 1 : v;
  }

  function smooth(e) {
    return e <= 0 ? 0 : e >= 1 ? 1 : e * e * (3 - 2 * e);
  }

  function pathLen(pts) {
    var i = 0;
    var n = 1;
    for (; n < pts.length; n++) {
      i += Math.hypot(pts[n][0] - pts[n - 1][0], pts[n][1] - pts[n - 1][1]);
    }
    return i;
  }

  function toD(segments) {
    return segments
      .map(function (seg, si) {
        return seg
          .map(function (p, pi) {
            return (pi === 0 && si === 0 ? "M" : "L") + " " + p[0].toFixed(1) + " " + p[1].toFixed(1);
          })
          .join(" ");
      })
      .join(" ");
  }

  function dash(progress) {
    return 1 - clamp01(progress);
  }

  function pointOn(segments, t) {
    var pts = [];
    segments.forEach(function (s) {
      s.forEach(function (p) {
        pts.push(p);
      });
    });
    var remain = clamp01(t) * pathLen(pts);
    var n;
    for (n = 1; n < pts.length; n++) {
      var step = Math.hypot(pts[n][0] - pts[n - 1][0], pts[n][1] - pts[n - 1][1]);
      if (remain <= step) {
        var u = step ? remain / step : 0;
        return [
          pts[n - 1][0] + (pts[n][0] - pts[n - 1][0]) * u,
          pts[n - 1][1] + (pts[n][1] - pts[n - 1][1]) * u,
        ];
      }
      remain -= step;
    }
    return pts[pts.length - 1] || [0, 0];
  }

  function nodeXY(col, row) {
    var len = COL_KEYS[col].length;
    return [COL_X[col], 233 + (row - (len - 1) / 2) * 46];
  }

  function cubic(a, b, c, d, samples) {
    var out = [];
    var n;
    for (n = 0; n <= samples; n++) {
      var s = n / samples;
      var u = 1 - s;
      out.push([
        u * u * u * a[0] + 3 * u * u * s * b[0] + 3 * u * s * s * c[0] + s * s * s * d[0],
        u * u * u * a[1] + 3 * u * u * s * b[1] + 3 * u * s * s * c[1] + s * s * s * d[1],
      ]);
    }
    return out;
  }

  function link(from, fromR, to, toR) {
    var start = [from[0] + fromR, from[1]];
    var end = [to[0] - toR, to[1]];
    var span = end[0] - start[0];
    return cubic(start, [start[0] + 0.46 * span, start[1]], [end[0] - 0.46 * span, end[1]], end, 22);
  }

  function inR(col) {
    return col === 0 ? 9 : 21;
  }

  function picksOf(scene) {
    return [
      Math.max(0, COL_KEYS[0].indexOf(scene.harness)),
      Math.max(0, COL_KEYS[1].indexOf(scene.lab)),
      Math.max(0, COL_KEYS[2].indexOf(scene.host)),
      Math.max(0, COL_KEYS[3].indexOf(scene.cache)),
    ];
  }

  function originOf(col, picks) {
    return col === 0 ? ASK : nodeXY(col - 1, picks[col - 1]);
  }

  function geometry(scene) {
    var picks = picksOf(scene);
    var fans = COL_KEYS.map(function (keys, col) {
      var from = originOf(col, picks);
      return keys.map(function (_, row) {
        return link(from, inR(col), nodeXY(col, row), 14);
      });
    });
    var mains = COL_KEYS.map(function (_, col) {
      return link(originOf(col, picks), inR(col), nodeXY(col, picks[col]), 21);
    });
    var final = link(nodeXY(3, picks[3]), 21, ANSWER, 9);
    return { picks: picks, fans: fans, mains: mains, final: final };
  }

  function colState(col, count, pick, lengths, t, done) {
    var empty = {
      ghost: Array(count).fill(0),
      ghostOpacity: Array(count).fill(0),
      near: Array(count).fill(false),
      eye: -1,
      surge: 0,
      on: false,
      passed: false,
    };
    var s = done ? 1 : (t - 0.07 - 0.1775 * col) / 0.1775;
    if (s < 0) return empty;
    if (s >= 1) {
      return {
        ghost: Array(count).fill(1),
        ghostOpacity: Array.from({ length: count }, function (_, i) {
          return i === pick ? 0 : 0.34;
        }),
        near: Array(count).fill(false),
        eye: -1,
        surge: 1,
        on: true,
        passed: done || s >= 1.1,
      };
    }
    if (s < 0.2) {
      var draw = s / 0.2;
      var longest = Math.max.apply(null, lengths);
      var ghost = lengths.map(function (len) {
        return clamp01((draw * longest) / len);
      });
      return {
        ghost: ghost,
        ghostOpacity: Array(count).fill(1),
        near: ghost.map(function (g) {
          return g >= 1;
        }),
        eye: -1,
        surge: 0,
        on: false,
        passed: false,
      };
    }
    if (s < 0.78) {
      var scan = ((s - 0.2) / 0.58) * (count + 1);
      var fade = Array.from({ length: count }, function (_, i) {
        return i === pick ? 0 : smooth(clamp01(scan - i - 0.8));
      });
      return {
        ghost: Array(count).fill(1),
        ghostOpacity: fade.map(function (f) {
          return 1 - 0.66 * f;
        }),
        near: fade.map(function (f) {
          return f < 0.5;
        }),
        eye: Math.min(count - 1, Math.floor(scan)),
        surge: 0,
        on: false,
        passed: false,
      };
    }
    var surge = smooth((s - 0.2 - 0.58) / 0.22);
    return {
      ghost: Array(count).fill(1),
      ghostOpacity: Array.from({ length: count }, function (_, i) {
        return i === pick ? 1 - surge : 0.34;
      }),
      near: Array.from({ length: count }, function (_, i) {
        return i === pick;
      }),
      eye: -1,
      surge: surge,
      on: false,
      passed: false,
    };
  }

  function sceneFrame(index, t, still) {
    var cur = SCENES[index];
    if (still) return { shown: cur, done: true, fade: 1, final: 1 };
    if (t < 0.07) {
      var prev = SCENES[(index - 1 + SCENES.length) % SCENES.length];
      return { shown: prev, done: true, fade: 1 - smooth(t / 0.07), final: 1 };
    }
    return {
      shown: cur,
      done: false,
      fade: 1,
      final: t < 0.78 ? 0 : smooth(clamp01((t - 0.78) / 0.06)),
    };
  }

  function pct(n, of) {
    return ((n / of) * 100).toFixed(3) + "%";
  }

  function ns(name, attrs) {
    var el = document.createElementNS("http://www.w3.org/2000/svg", name);
    Object.keys(attrs).forEach(function (k) {
      el.setAttribute(k, attrs[k]);
    });
    return el;
  }

  function start(root, opts) {
    opts = opts || {};
    var delta = root.querySelector(".delta");
    if (!delta) return;

    var live = delta.querySelector(".delta-live");
    if (!live) {
      live = document.createElement("div");
      live.className = "delta-live";
      delta.appendChild(live);
    }

    var nodes = {};
    delta.querySelectorAll(".delta-node").forEach(function (el) {
      nodes[el.getAttribute("title")] = el;
    });

    var svg = ns("svg", {
      viewBox: "0 0 " + VB_W + " " + VB_H,
      class: "delta-water",
      preserveAspectRatio: "none",
      "aria-hidden": "true",
    });
    var ghostEls = COL_KEYS.map(function (keys, col) {
      return keys.map(function (_, row) {
        var p = ns("path", {
          class: "delta-ghost",
          "stroke-width": keys.length > 7 ? "0.6" : "0.9",
          pathLength: "1",
          "stroke-dasharray": "1 1",
          "stroke-dashoffset": "1",
        });
        svg.appendChild(p);
        return p;
      });
    });
    var mainEls = COL_KEYS.map(function () {
      var p = ns("path", {
        class: "delta-main",
        pathLength: "1",
        "stroke-dasharray": "1 1",
        "stroke-dashoffset": "1",
      });
      svg.appendChild(p);
      return p;
    });
    var finalEl = ns("path", {
      class: "delta-main",
      pathLength: "1",
      "stroke-dasharray": "1 1",
      "stroke-dashoffset": "1",
    });
    svg.appendChild(finalEl);
    var srcAsk = ns("circle", { class: "delta-source", cx: String(ASK[0]), cy: String(ASK[1]), r: "7" });
    var srcAns = ns("circle", { class: "delta-source", cx: String(ANSWER[0]), cy: String(ANSWER[1]), r: "7" });
    var pen = ns("circle", { class: "delta-pen", r: "3.2" });
    svg.appendChild(srcAsk);
    svg.appendChild(srcAns);
    svg.appendChild(pen);

    var litEls = COL_KEYS.map(function () {
      var span = document.createElement("span");
      span.className = "delta-lit";
      span.hidden = true;
      var icon = document.createElement("span");
      icon.className = "delta-lit-icon";
      var label = document.createElement("small");
      span.appendChild(icon);
      span.appendChild(label);
      return { span: span, icon: icon, label: label };
    });

    live.innerHTML = "";
    live.appendChild(svg);
    litEls.forEach(function (l) {
      live.appendChild(l.span);
    });

    var qEl = opts.qEl;
    var whyEl = opts.whyEl;
    var stepsEl = opts.stepsEl;
    var askEl = opts.askEl;
    var ansEl = delta.querySelectorAll(".delta-end")[1];
    var reduced = !!opts.reduced;
    var sceneIndex = 0;
    var still = true;
    var running = false;
    var startMs = 0;
    var raf = 0;
    var lastGeoKey = "";
    var lastAsk = "";

    if (stepsEl) {
      stepsEl.innerHTML = "";
      SCENES.forEach(function (_, i) {
        var b = document.createElement("button");
        b.className = "step" + (i === 0 ? " on" : "");
        b.type = "button";
        b.setAttribute("role", "tab");
        b.setAttribute("aria-label", "Example " + (i + 1));
        b.setAttribute("aria-selected", String(i === 0));
        b.addEventListener("click", function () {
          sceneIndex = i;
          still = reduced;
          startMs = performance.now() - (reduced ? 0 : i * CYCLE_MS + 0.08 * CYCLE_MS);
          if (!running && !reduced) play();
          else paint(performance.now());
        });
        stepsEl.appendChild(b);
      });
    }

    function paint(now) {
      var elapsed = still ? 0 : Math.max(0, now - startMs);
      var cycle = elapsed / CYCLE_MS;
      var i = still ? sceneIndex : Math.floor(cycle) % SCENES.length;
      var t = still ? 1 : cycle % 1;
      sceneIndex = i;

      var frame = sceneFrame(i, t, still);
      var geo = geometry(frame.shown);
      var fanLens = geo.fans.map(function (col) {
        return col.map(function (seg) {
          return pathLen(seg);
        });
      });
      var states = COL_KEYS.map(function (keys, col) {
        return colState(col, keys.length, geo.picks[col], fanLens[col], t, frame.done);
      });

      var geoKey = frame.shown.ask;
      if (geoKey !== lastGeoKey) {
        lastGeoKey = geoKey;
        COL_KEYS.forEach(function (keys, col) {
          keys.forEach(function (_, row) {
            ghostEls[col][row].setAttribute("d", toD([geo.fans[col][row]]));
          });
          mainEls[col].setAttribute("d", toD([geo.mains[col]]));
        });
        finalEl.setAttribute("d", toD([geo.final]));
      }

      live.style.color = "var(--prov-" + frame.shown.lab + ", var(--ink))";
      live.style.opacity = String(frame.fade);
      if (askEl) {
        askEl.style.color = "var(--prov-" + frame.shown.lab + ", var(--ink))";
        askEl.style.opacity = String(frame.fade);
      }

      COL_KEYS.forEach(function (keys, col) {
        var st = states[col];
        keys.forEach(function (key, row) {
          var g = ghostEls[col][row];
          var op = st.ghostOpacity[row];
          var vis = st.ghost[row] > 0 && op > 0;
          g.style.opacity = vis ? String(st.passed && row !== geo.picks[col] ? 0.2 : op) : "0";
          g.setAttribute("stroke-dashoffset", String(dash(st.ghost[row])));

          var node = nodes[key];
          if (node) {
            if (st.on && row === geo.picks[col]) {
              node.removeAttribute("data-near");
              node.removeAttribute("data-eye");
            } else {
              if (st.near[row]) node.setAttribute("data-near", "");
              else node.removeAttribute("data-near");
              if (st.eye === row) node.setAttribute("data-eye", "");
              else node.removeAttribute("data-eye");
            }
          }
        });
        if (st.surge > 0) {
          mainEls[col].style.display = "";
          mainEls[col].setAttribute("stroke-dashoffset", String(dash(st.surge)));
        } else {
          mainEls[col].style.display = "none";
        }

        var lit = litEls[col];
        if (st.on) {
          var xy = nodeXY(col, geo.picks[col]);
          var key = keys[geo.picks[col]];
          var src = nodes[key];
          lit.span.hidden = false;
          lit.span.style.left = pct(xy[0], VB_W);
          lit.span.style.top = pct(xy[1], VB_H);
          if (frame.fade < 1) lit.span.setAttribute("data-was", "");
          else {
            lit.span.removeAttribute("data-was");
            lit.span.setAttribute("data-on", "");
          }
          if (src && lit.icon.firstChild !== src.firstElementChild) {
            lit.icon.innerHTML = "";
            if (src.firstElementChild) lit.icon.appendChild(src.firstElementChild.cloneNode(true));
          }
          var labels = [frame.shown.harness, frame.shown.model, frame.shown.host, CACHE_LABEL[frame.shown.cache]];
          lit.label.textContent = labels[col];
        } else {
          lit.span.hidden = true;
        }
      });

      if (frame.final > 0) {
        finalEl.style.display = "";
        finalEl.setAttribute("stroke-dashoffset", String(dash(frame.final)));
      } else {
        finalEl.style.display = "none";
      }
      srcAns.style.display = frame.final >= 1 ? "" : "none";
      if (ansEl) {
        if (frame.final >= 1) ansEl.setAttribute("data-lit", "true");
        else ansEl.removeAttribute("data-lit");
      }

      var eyeCol = states.findIndex(function (st) {
        return st.eye >= 0;
      });
      var penAt = null;
      if (eyeCol >= 0) {
        var eyeXY = nodeXY(eyeCol, states[eyeCol].eye);
        penAt = [eyeXY[0] - 21, eyeXY[1]];
      } else {
        var surgeCol = states.findIndex(function (st) {
          return st.surge > 0 && st.surge < 1;
        });
        if (surgeCol >= 0) penAt = pointOn([geo.mains[surgeCol]], states[surgeCol].surge);
        else if (frame.final > 0 && frame.final < 1) penAt = pointOn([geo.final], frame.final);
      }
      if (penAt) {
        pen.style.display = "";
        pen.setAttribute("cx", penAt[0].toFixed(1));
        pen.setAttribute("cy", penAt[1].toFixed(1));
      } else {
        pen.style.display = "none";
      }

      if (qEl && frame.shown.ask !== lastAsk) {
        lastAsk = frame.shown.ask;
        qEl.textContent = frame.shown.ask;
        if (whyEl) whyEl.innerHTML = frame.shown.why;
        var shownIndex = SCENES.indexOf(frame.shown);
        if (stepsEl && shownIndex >= 0) {
          stepsEl.querySelectorAll(".step").forEach(function (b, k) {
            b.classList.toggle("on", k === shownIndex);
            b.setAttribute("aria-selected", String(k === shownIndex));
          });
        }
      }
    }

    function tick(now) {
      if (!running) return;
      if (!startMs) startMs = now;
      paint(now);
      raf = requestAnimationFrame(tick);
    }

    function play() {
      if (reduced || running) return;
      running = true;
      still = false;
      if (!startMs) startMs = performance.now() - 0.08 * CYCLE_MS;
      raf = requestAnimationFrame(tick);
    }

    function pause() {
      running = false;
      cancelAnimationFrame(raf);
    }

    paint(performance.now());

    if (!reduced && "IntersectionObserver" in window) {
      new IntersectionObserver(
        function (entries) {
          if (entries.some(function (e) {
            return e.isIntersecting;
          })) play();
          else pause();
        },
        { threshold: 0.12 },
      ).observe(root);
    } else if (!reduced) {
      play();
    }
  }

  global.ConiferDelta = { start: start, SCENES: SCENES };
})(window);

"use client";

import { useEffect, useRef, useState } from "react";

type CursorMode = "trail" | "header" | "case" | "hidden";

const TRAIL_COUNT = 3;
const LERP = 0.28;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function resolveMode(target: EventTarget | null): CursorMode {
  if (!(target instanceof Element)) return "trail";

  if (target.closest("[data-cursor='case']")) return "case";
  if (target.closest(".frame-bar--header")) return "header";
  if (target.closest("input, textarea, select, [contenteditable='true']")) {
    return "hidden";
  }

  return "trail";
}

export function SiteCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const ringRef = useRef<HTMLSpanElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);

  const mouse = useRef({ x: 0, y: 0 });
  const trail = useRef(
    Array.from({ length: TRAIL_COUNT }, () => ({ x: 0, y: 0 })),
  );
  const ring = useRef({ x: 0, y: 0 });
  const pill = useRef({ x: 0, y: 0 });

  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<CursorMode>("trail");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncEnabled = () => {
      const active = finePointer.matches && !reducedMotion.matches;
      setEnabled(active);
      document.documentElement.classList.toggle("has-site-cursor", active);
    };

    syncEnabled();
    finePointer.addEventListener("change", syncEnabled);
    reducedMotion.addEventListener("change", syncEnabled);

    return () => {
      finePointer.removeEventListener("change", syncEnabled);
      reducedMotion.removeEventListener("change", syncEnabled);
      document.documentElement.classList.remove("has-site-cursor");
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let raf = 0;

    const onMove = (event: PointerEvent) => {
      mouse.current.x = event.clientX;
      mouse.current.y = event.clientY;
      setVisible(true);
      setMode(resolveMode(event.target));
    };

    const onLeave = () => setVisible(false);

    const tick = () => {
      trail.current[0].x = lerp(trail.current[0].x, mouse.current.x, LERP);
      trail.current[0].y = lerp(trail.current[0].y, mouse.current.y, LERP);

      for (let i = 1; i < TRAIL_COUNT; i += 1) {
        trail.current[i].x = lerp(
          trail.current[i].x,
          trail.current[i - 1].x,
          LERP,
        );
        trail.current[i].y = lerp(
          trail.current[i].y,
          trail.current[i - 1].y,
          LERP,
        );
      }

      ring.current.x = lerp(ring.current.x, mouse.current.x, 0.18);
      ring.current.y = lerp(ring.current.y, mouse.current.y, 0.18);
      pill.current.x = lerp(pill.current.x, mouse.current.x, 0.22);
      pill.current.y = lerp(pill.current.y, mouse.current.y, 0.22);

      dotRefs.current.forEach((dot, index) => {
        if (!dot) return;
        dot.style.transform = `translate3d(${trail.current[index].x}px, ${trail.current[index].y}px, 0) translate(-50%, -50%)`;
      });

      if (ringRef.current) {
        ringRef.current.style.setProperty("--cursor-x", `${ring.current.x}px`);
        ringRef.current.style.setProperty("--cursor-y", `${ring.current.y}px`);
      }

      if (pillRef.current) {
        pillRef.current.style.setProperty("--cursor-x", `${pill.current.x}px`);
        pillRef.current.style.setProperty("--cursor-y", `${pill.current.y}px`);
      }

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  const showTrail = visible && mode === "trail";
  const showHeader = visible && mode === "header";
  const showCase = visible && mode === "case";

  return (
    <div
      ref={rootRef}
      className="site-cursor"
      aria-hidden="true"
      data-mode={mode}
      data-visible={visible ? "true" : "false"}
    >
      {Array.from({ length: TRAIL_COUNT }, (_, index) => (
        <span
          key={index}
          ref={(node) => {
            dotRefs.current[index] = node;
          }}
          className={`site-cursor__dot site-cursor__dot--${index}`}
          data-active={showTrail ? "true" : "false"}
        />
      ))}

      <span
        ref={ringRef}
        className="site-cursor__ring"
        data-active={showHeader ? "true" : "false"}
      />

      <div
        ref={pillRef}
        className="site-cursor__pill"
        data-active={showCase ? "true" : "false"}
      >
        <svg
          className="site-cursor__pill-icon"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <span>View case study</span>
      </div>
    </div>
  );
}

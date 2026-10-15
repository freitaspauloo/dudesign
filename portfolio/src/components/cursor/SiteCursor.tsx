"use client";

import { useEffect, useRef, useState } from "react";

type CursorMode = "default" | "header" | "hidden";

const LERP = 0.28;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function resolveMode(target: EventTarget | null): CursorMode {
  if (!(target instanceof Element)) return "default";

  if (target.closest(".frame-bar--header")) return "header";
  if (target.closest("input, textarea, select, [contenteditable='true']")) {
    return "hidden";
  }

  return "default";
}

export function SiteCursor() {
  const dotRef = useRef<HTMLSpanElement>(null);

  const mouse = useRef({ x: 0, y: 0 });
  const dot = useRef({ x: 0, y: 0 });

  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<CursorMode>("default");
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
      dot.current.x = lerp(dot.current.x, mouse.current.x, LERP);
      dot.current.y = lerp(dot.current.y, mouse.current.y, LERP);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dot.current.x}px, ${dot.current.y}px, 0) translate(-50%, -50%)`;
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

  const showDot = visible && mode !== "hidden";

  return (
    <div
      className="site-cursor"
      aria-hidden="true"
      data-mode={mode}
      data-visible={visible ? "true" : "false"}
    >
      <span
        ref={dotRef}
        className="site-cursor__dot"
        data-active={showDot ? "true" : "false"}
      />
    </div>
  );
}

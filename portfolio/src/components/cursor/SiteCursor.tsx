"use client";

import { useEffect, useRef, useState } from "react";

type CursorMode = "default" | "text" | "interactive" | "case-study" | "hidden";

const INTERACTIVE_SELECTOR =
  "a[href], button, summary, label[for], [role='button'], [data-cursor]:not([data-cursor='case-study'])";

function isTextAtPointer(event: PointerEvent, target: Element): boolean {
  if (target.closest(INTERACTIVE_SELECTOR)) return false;

  if (
    target.closest(
      "textarea, [contenteditable='true'], input:not([type='button']):not([type='submit']):not([type='reset']):not([type='checkbox']):not([type='radio'])",
    )
  ) {
    return true;
  }

  if (getComputedStyle(target).userSelect === "none") return false;

  const doc = document;
  let caret: Range | null = null;

  if (typeof doc.caretRangeFromPoint === "function") {
    caret = doc.caretRangeFromPoint(event.clientX, event.clientY);
  } else if (typeof doc.caretPositionFromPoint === "function") {
    const pos = doc.caretPositionFromPoint(event.clientX, event.clientY);
    if (pos) {
      const range = doc.createRange();
      range.setStart(pos.offsetNode, pos.offset);
      range.collapse(true);
      caret = range;
    }
  }

  if (!caret) return false;

  const node = caret.startContainer;
  if (node.nodeType !== Node.TEXT_NODE) return false;
  if (!(node.textContent ?? "").trim()) return false;

  const range = doc.createRange();
  range.selectNodeContents(node);
  const rects = [...range.getClientRects()].filter((rect) => rect.width > 0);
  if (rects.length === 0) return false;

  const { clientX: x, clientY: y } = event;
  return rects.some(
    (rect) =>
      x >= rect.left - 6 &&
      x <= rect.right + 6 &&
      y >= rect.top - 6 &&
      y <= rect.bottom + 6,
  );
}

function resolveMode(event: PointerEvent): CursorMode {
  const target = event.target;
  if (!(target instanceof Element)) return "default";

  if (
    target.closest(
      "input, textarea, select, [contenteditable='true']",
    )
  ) {
    return "hidden";
  }

  if (target.closest('[data-cursor="case-study"]')) {
    return "case-study";
  }

  if (target.closest(INTERACTIVE_SELECTOR)) {
    return "interactive";
  }

  if (isTextAtPointer(event, target)) {
    return "text";
  }

  return "default";
}

function cursorLabel(mode: CursorMode): string {
  if (mode === "case-study") return "View project";
  return "";
}

function labelTypingDuration(text: string): number {
  return Math.min(36 + text.length * 9, 130);
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

export function SiteCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const lastLabelRef = useRef("");

  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<CursorMode>("default");
  const [labelTarget, setLabelTarget] = useState("");
  const [typedLabel, setTypedLabel] = useState("");
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

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
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) {
      setTypedLabel(labelTarget);
      lastLabelRef.current = labelTarget;
      return;
    }

    let cancelled = false;
    let frame = 0;

    const animate = (full: string, reveal: boolean) => {
      const ms = labelTypingDuration(full);
      const start = performance.now();

      const step = (now: number) => {
        if (cancelled) return;
        const t = Math.min(1, (now - start) / ms);
        const eased = easeOutCubic(t);
        const count = reveal
          ? Math.round(eased * full.length)
          : Math.round((1 - eased) * full.length);
        setTypedLabel(full.slice(0, count));
        if (t < 1) {
          frame = requestAnimationFrame(step);
        } else if (!reveal) {
          setTypedLabel("");
        }
      };

      frame = requestAnimationFrame(step);
    };

    if (labelTarget) {
      lastLabelRef.current = labelTarget;
      setTypedLabel("");
      animate(labelTarget, true);
    } else {
      const previous = lastLabelRef.current;
      lastLabelRef.current = "";
      if (previous) {
        setTypedLabel(previous);
        animate(previous, false);
      } else {
        setTypedLabel("");
      }
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [labelTarget]);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (event: PointerEvent) => {
      const root = rootRef.current;
      if (root) {
        root.style.left = `${event.clientX}px`;
        root.style.top = `${event.clientY}px`;
      }

      const nextMode = resolveMode(event);
      const nextLabel = cursorLabel(nextMode);
      setVisible(true);
      setMode(nextMode);
      setLabelTarget((current) => (current === nextLabel ? current : nextLabel));
    };

    const onLeave = () => setVisible(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={rootRef}
      className="site-cursor"
      aria-hidden="true"
      data-mode={mode}
      data-pressed={pressed ? "true" : "false"}
      data-visible={visible && mode !== "hidden" ? "true" : "false"}
    >
      <div className="site-cursor__inner">
        <span className="site-cursor__marker" />
        {typedLabel ? (
          <span
            className="site-cursor__label"
            data-complete={
              typedLabel === labelTarget && labelTarget ? "true" : "false"
            }
          >
            {typedLabel}
          </span>
        ) : null}
      </div>
    </div>
  );
}

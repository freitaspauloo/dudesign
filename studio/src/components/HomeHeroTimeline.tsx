"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { HomeTimelineEntry } from "@/src/content/home";
import { assetPath } from "@/src/lib/asset-path";
import { SwapLabel } from "@/src/components/SwapLabel";

const HIDE_MS = 90;
const PREVIEW_WIDTH = 300;
const PREVIEW_HEIGHT = 188;
const PREVIEW_GAP = 18;

type Props = {
  entries: HomeTimelineEntry[];
};

function placePreview(el: HTMLElement, x: number, y: number) {
  let left = x + PREVIEW_GAP;
  let top = y + PREVIEW_GAP;
  if (left + PREVIEW_WIDTH > window.innerWidth - 8) {
    left = x - PREVIEW_WIDTH - PREVIEW_GAP;
  }
  if (top + PREVIEW_HEIGHT > window.innerHeight - 8) {
    top = y - PREVIEW_HEIGHT - PREVIEW_GAP;
  }
  el.style.left = `${Math.max(8, left)}px`;
  el.style.top = `${Math.max(8, top)}px`;
}

export function HomeHeroTimeline({ entries }: Props) {
  const listRef = useRef<HTMLOListElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const hideTimerRef = useRef<number | undefined>(undefined);
  const activeIdRef = useRef<string | null>(null);

  const [previewsEnabled, setPreviewsEnabled] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [shownSrc, setShownSrc] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const byId = useCallback(
    (id: string | null) => entries.find((entry) => entry.company === id) ?? null,
    [entries],
  );

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setPreviewsEnabled(finePointer.matches && !reducedMotion.matches);
    };
    sync();
    finePointer.addEventListener("change", sync);
    reducedMotion.addEventListener("change", sync);
    return () => {
      finePointer.removeEventListener("change", sync);
      reducedMotion.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!previewsEnabled) return;
    for (const entry of entries) {
      if (!entry.preview) continue;
      const img = new window.Image();
      img.src = assetPath(entry.preview.src);
    }
  }, [entries, previewsEnabled]);

  const move = useCallback((x: number, y: number) => {
    pointerRef.current = { x, y };
    const el = previewRef.current;
    if (el) placePreview(el, x, y);
  }, []);

  const show = useCallback(
    (id: string, x: number, y: number) => {
      window.clearTimeout(hideTimerRef.current);
      const entry = byId(id);
      if (!entry?.preview) return;
      pointerRef.current = { x, y };
      if (activeIdRef.current !== id) {
        activeIdRef.current = id;
        setActiveId(id);
        setShownSrc(assetPath(entry.preview.src));
      }
      const el = previewRef.current;
      if (el) placePreview(el, x, y);
      setVisible(true);
    },
    [byId],
  );

  const hide = useCallback(() => {
    window.clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => {
      activeIdRef.current = null;
      setActiveId(null);
      setVisible(false);
    }, HIDE_MS);
  }, []);

  useEffect(() => {
    const el = previewRef.current;
    if (!el || !shownSrc) return;
    const { x, y } = pointerRef.current;
    placePreview(el, x, y);
  }, [shownSrc]);

  useEffect(() => {
    const list = listRef.current;
    if (!list || !previewsEnabled) return;

    const rowId = (event: Event) => {
      const row = (event.target as Element | null)?.closest?.(
        ".frame-hero__timeline-row",
      );
      if (!row || !list.contains(row)) return null;
      return row.getAttribute("data-preview");
    };

    const onOver = (event: PointerEvent | MouseEvent) => {
      const id = rowId(event);
      if (!id) return;
      show(id, event.clientX, event.clientY);
    };

    const onMove = (event: PointerEvent) => {
      move(event.clientX, event.clientY);
    };

    list.addEventListener("pointerover", onOver);
    list.addEventListener("mouseover", onOver);
    list.addEventListener("pointermove", onMove);
    list.addEventListener("pointerleave", hide);
    list.addEventListener("mouseleave", hide);
    return () => {
      list.removeEventListener("pointerover", onOver);
      list.removeEventListener("mouseover", onOver);
      list.removeEventListener("pointermove", onMove);
      list.removeEventListener("pointerleave", hide);
      list.removeEventListener("mouseleave", hide);
    };
  }, [hide, move, previewsEnabled, show]);

  return (
    <>
      <ol
        ref={listRef}
        className="frame-hero__timeline"
        aria-label="Selected client work"
      >
        {entries.map((entry) => (
          <li
            key={`${entry.year}-${entry.company}`}
            className="frame-hero__timeline-row"
            data-preview={entry.preview ? entry.company : undefined}
            data-active={activeId === entry.company ? "true" : "false"}
          >
            <span className="frame-hero__year">{entry.year}</span>
            <div className="frame-hero__timeline-detail">
              {entry.href ? (
                entry.href.startsWith("/") ? (
                  <Link href={entry.href} className="frame-hero__company">
                    <SwapLabel>{entry.company}</SwapLabel>
                  </Link>
                ) : (
                  <a
                    href={entry.href}
                    className="frame-hero__company"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SwapLabel>{entry.company}</SwapLabel>
                  </a>
                )
              ) : (
                <span className="frame-hero__company">
                  <SwapLabel>{entry.company}</SwapLabel>
                </span>
              )}
              <span className="frame-hero__role">{entry.role}</span>
            </div>
          </li>
        ))}
      </ol>

      {previewsEnabled && shownSrc ? (
        <div
          ref={previewRef}
          className="hero-timeline-preview"
          aria-hidden="true"
          data-visible={visible ? "true" : "false"}
        >
          <Image
            src={shownSrc}
            alt=""
            fill
            unoptimized
            sizes="400px"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>
      ) : null}
    </>
  );
}

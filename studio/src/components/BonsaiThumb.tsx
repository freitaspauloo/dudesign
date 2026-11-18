"use client";

import { useEffect, useRef } from "react";
import { bonsaiMarks, type BonsaiMark } from "./bonsai-marks";

const PITCH = 22.5;
const SIZE = 19;
const PAD = (PITCH - SIZE) / 2;
const HOLD = 7;
const ROW_GAP = 0.038;
const FADE = 0.16;
const STAGGER = 0.01;
const GRID_COLS = 31;
const GRID_ROWS = 32;

const VIEW_W = 57 * PITCH;
const VIEW_X = -13 * PITCH;
const VIEW_H = 32 * PITCH;
const SCALE = 0.6;
const CX = VIEW_X + VIEW_W / 2;
const CY = VIEW_H / 2;

type Square = { x: number; y: number; start: number };

type Built = {
  id: string;
  squares: Square[];
  intro: number;
};

function build(mark: BonsaiMark): Built {
  const offsetX = Math.round((GRID_COLS - mark.cols) / 2);
  const offsetY = Math.round((GRID_ROWS - mark.rows) / 2);
  const byRow = new Map<number, number[]>();

  for (const pair of mark.cells.split(";")) {
    if (!pair) continue;
    const [col, row] = pair.split(",").map(Number);
    const list = byRow.get(row) ?? [];
    list.push(col);
    byRow.set(row, list);
  }

  const squares: Square[] = [];
  let intro = 0;

  [...byRow.keys()]
    .sort((a, b) => b - a)
    .forEach((row, rowIndex) => {
      const cols = byRow.get(row)!.sort((a, b) => a - b);
      const center = (cols.length - 1) / 2;
      cols.forEach((col, index) => {
        const start = rowIndex * ROW_GAP + Math.abs(index - center) * STAGGER;
        squares.push({
          x: (col + offsetX) * PITCH + PAD,
          y: (row + offsetY) * PITCH + PAD,
          start,
        });
        intro = Math.max(intro, start + FADE);
      });
    });

  return { id: mark.id, squares, intro };
}

const marks = [build(bonsaiMarks[0])];
const cycle = marks.reduce((sum, mark) => sum + mark.intro * 2 + HOLD, 0);

function shown(start: number, time: number) {
  const progress = (time - start) / FADE;
  if (progress <= 0) return 0;
  if (progress >= 1) return 1;
  return 1 - (1 - progress) ** 2;
}

function markAt(elapsed: number) {
  let cursor = elapsed % cycle;
  for (let index = 0; index < marks.length; index++) {
    const intro = marks[index].intro;
    if (cursor < intro) return { index, time: cursor };
    cursor -= intro;
    if (cursor < HOLD) return { index, time: intro };
    cursor -= HOLD;
    if (cursor < intro) return { index, time: intro - cursor };
    cursor -= intro;
  }
  return { index: 0, time: 0 };
}

export function BonsaiThumb() {
  const nodes = useRef<(SVGRectElement | null)[][]>([]);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = root.current;
    if (!host) return;

    const paint = (index: number, time: number) => {
      const mark = marks[index];
      const row = nodes.current[index];
      if (!row) return;
      mark.squares.forEach((square, i) => {
        row[i]?.setAttribute("opacity", shown(square.start, time).toFixed(3));
      });
    };

    const clear = (index: number) => {
      nodes.current[index]?.forEach((node) => node?.setAttribute("opacity", "0"));
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      paint(0, marks[0].intro);
      return;
    }

    let frame = 0;
    let start = 0;
    let running = true;
    let active = 0;

    const tick = (now: number) => {
      if (!running) return;
      if (!start) start = now;
      const { index, time } = markAt((now - start) / 1000);
      if (index !== active) {
        clear(active);
        active = index;
      }
      paint(index, time);
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        if (running) {
          start = 0;
          clear(active);
          active = 0;
          frame = requestAnimationFrame(tick);
        } else {
          cancelAnimationFrame(frame);
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(host);
    return () => {
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={root} className="bonsai-thumb" aria-hidden="true">
      <svg viewBox={`${VIEW_X} 0 ${VIEW_W} ${VIEW_H}`} role="img">
        <title>Conifer pixel marks</title>
        <defs>
          <pattern
            id="bonsai-field"
            width={PITCH * SCALE}
            height={PITCH * SCALE}
            patternUnits="userSpaceOnUse"
            x={CX * (1 - SCALE)}
            y={CY * (1 - SCALE)}
          >
            <rect
              x={PAD * SCALE}
              y={PAD * SCALE}
              width={SIZE * SCALE}
              height={SIZE * SCALE}
              fill="#fff"
              opacity="0.075"
            />
          </pattern>
        </defs>
        <rect x={VIEW_X} y="0" width={VIEW_W} height={VIEW_H} fill="#044EFD" />
        <rect x={VIEW_X} y="0" width={VIEW_W} height={VIEW_H} fill="url(#bonsai-field)" />
        <g transform={`translate(${CX} ${CY}) scale(${SCALE}) translate(${-CX} ${-CY})`}>
          {marks.map((mark, markIndex) =>
            mark.squares.map((square, index) => (
              <rect
                key={`${mark.id}-${index}`}
                ref={(node) => {
                  (nodes.current[markIndex] ??= [])[index] = node;
                }}
                x={square.x}
                y={square.y}
                width={SIZE}
                height={SIZE}
                fill="#fff"
                opacity="0"
              />
            )),
          )}
        </g>
      </svg>
    </div>
  );
}

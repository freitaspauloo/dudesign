"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import { BtnArrow } from "@/src/components/BtnArrow";

const lines = [
  "Look 10x bigger",
  "Ship to market faster",
  "Raise the round",
  "Earn customer trust",
  "Stand apart from the deck",
  "Save the quarter",
];

const Group = forwardRef<HTMLUListElement, { hidden?: boolean }>(function Group(
  { hidden = false },
  ref,
) {
  return (
    <ul ref={ref} className="frame-marquee__group" aria-hidden={hidden || undefined}>
      {lines.map((line) => (
        <li key={line} className="frame-marquee__item">
          <span>{line}</span>
          <BtnArrow direction="right" size={12} />
        </li>
      ))}
    </ul>
  );
});

export function FrameMarquee() {
  const barRef = useRef<HTMLDivElement>(null);
  const sequenceRef = useRef<HTMLUListElement>(null);
  const [copies, setCopies] = useState(2);

  useEffect(() => {
    const bar = barRef.current;
    const sequence = sequenceRef.current;
    if (!bar || !sequence) return;

    const fit = () => {
      const width = sequence.offsetWidth;
      if (!width) return;
      const next = Math.max(1, Math.ceil((bar.offsetWidth + 2) / width));
      setCopies((current) => (current === next ? current : next));
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(bar);
    observer.observe(sequence);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={barRef} className="frame-marquee" aria-label="What the work is for">
      <div
        className="frame-marquee__track"
        style={{ animationDuration: `${32 * copies}s` }}
      >
        {Array.from({ length: copies }, (_, index) => (
          <Group key={index} ref={index === 0 ? sequenceRef : undefined} />
        ))}
        {Array.from({ length: copies }, (_, index) => (
          <Group key={`repeat-${index}`} hidden />
        ))}
      </div>
    </div>
  );
}

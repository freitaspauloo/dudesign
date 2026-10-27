"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Mount-time intro for the hero. Staggers elements marked [data-hero].
 * Animates from hidden, so no-JS renders everything as-is.
 * Skipped entirely under prefers-reduced-motion.
 */
export function HeroIntro({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils.toArray<Element>("[data-hero]", el);
        if (items.length === 0) return;
        gsap.from(items, {
          autoAlpha: 0,
          y: 36,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
          clearProps: "opacity,visibility,transform",
        });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Subtle scrub parallax on the first <img> inside the wrapper.
 * The image is slightly over-scaled so vertical drift never exposes edges.
 * No-op under prefers-reduced-motion; baseline (no transform) is fine
 * because object-fit: cover already fills the frame.
 */
export function Parallax({
  children,
  className,
  amount = 6,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  /** Total vertical drift in percent of image height. Keep small. */
  amount?: number;
} & React.ComponentPropsWithoutRef<"div">) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const img = el.querySelector("img");
        if (!img) return;
        gsap.fromTo(
          img,
          { yPercent: -amount / 2, scale: 1 + amount / 100 },
          {
            yPercent: amount / 2,
            scale: 1 + amount / 100,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.4,
            },
          },
        );
      });
    }, el);

    return () => ctx.revert();
  }, [amount]);

  return (
    <div ref={ref} className={className} {...rest}>
      {children}
    </div>
  );
}

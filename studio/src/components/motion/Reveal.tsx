"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  children: React.ReactNode;
  className?: string;
  /** CSS selector for staggered targets inside the wrapper. Defaults to the wrapper itself. */
  targets?: string;
  y?: number;
  stagger?: number;
  delay?: number;
};

const REVEAL_START = 0.88;

function isInRevealZone(element: Element) {
  return element.getBoundingClientRect().top < window.innerHeight * REVEAL_START;
}

/**
 * Scroll-entry reveal. Off-screen targets are hidden before first paint so
 * GSAP never flashes visible → hidden → visible. Restored scroll positions
 * skip animation for blocks already on screen.
 */
export function Reveal({
  children,
  className,
  targets,
  y = 24,
  stagger = 0.09,
  delay = 0,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = targets ? gsap.utils.toArray<Element>(targets, el) : [el];
        if (items.length === 0) return;

        const alreadyInView = isInRevealZone(el);

        if (!alreadyInView) {
          gsap.set(items, { autoAlpha: 0, y });
        }

        const tween = gsap.to(items, {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger,
          delay,
          overwrite: "auto",
          clearProps: "opacity,visibility,transform",
          scrollTrigger: {
            trigger: el,
            start: `top ${REVEAL_START * 100}%`,
            once: true,
            invalidateOnRefresh: true,
            onRefresh(self) {
              if (isInRevealZone(el) || self.progress > 0) {
                self.animation?.progress(1);
              }
            },
          },
        });

        if (alreadyInView) {
          tween.progress(1);
        }

        // Tall galleries shift layout after first paint. ScrollTrigger can
        // miss the start, leaving autoAlpha at 0. IO always unhides.
        const io = new IntersectionObserver(
          (entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
              tween.progress(1);
              io.disconnect();
            }
          },
          { threshold: 0.01, rootMargin: "0px 0px 10% 0px" },
        );
        io.observe(el);

        const refresh = () => ScrollTrigger.refresh();
        const pendingImages = Array.from(el.querySelectorAll("img")).filter(
          (img) => !img.complete,
        );
        pendingImages.forEach((img) => {
          img.addEventListener("load", refresh, { once: true });
          img.addEventListener("error", refresh, { once: true });
        });
        window.addEventListener("load", refresh);

        return () => {
          io.disconnect();
          window.removeEventListener("load", refresh);
        };
      });
    }, el);

    return () => ctx.revert();
  }, [targets, y, stagger, delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  /** Two-digit section index, e.g. "02". Omit outside the numbered home flow. */
  index?: string;
  label: string;
  aside?: React.ReactNode;
  /** Keep the meta row pinned to the viewport top while the section scrolls. */
  sticky?: boolean;
};

/**
 * Section opener: a hairline that draws left-to-right as the section enters,
 * plus an index/label row that can stick while the section is in view. The
 * rule's baseline is a full-width line, so the section boundary reads even
 * without JS.
 */
export function SectionIntro({ index, label, aside, sticky = true }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const rule = el.querySelector("[data-rule]");
        if (rule) {
          gsap.from(rule, {
            scaleX: 0,
            duration: 1.1,
            ease: "power3.inOut",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          });
        }

        gsap.from(el.querySelectorAll("[data-meta]"), {
          autoAlpha: 0,
          y: 14,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.08,
          delay: 0.12,
          clearProps: "opacity,visibility,transform",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <header
      ref={ref}
      className={`section-intro${sticky ? " section-intro--sticky" : ""}`}
    >
      <span className="section-intro__rule" data-rule aria-hidden="true" />
      <div className="section-intro__meta">
        {index ? (
          <span className="micro-label section-intro__index" data-meta>
            {index}
          </span>
        ) : null}
        <span className="micro-label" data-meta>
          {label}
        </span>
        {aside ? (
          <span className="micro-label section-intro__aside" data-meta>
            {aside}
          </span>
        ) : null}
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export type CaseStudyNavItem = {
  id: string;
  label: string;
};

type Props = {
  items: CaseStudyNavItem[];
};

export function CaseStudySidebar({ items }: Props) {
  const [active, setActive] = useState(items[0]?.id ?? "overview");

  useEffect(() => {
    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          );

        if (visible[0]?.target.id) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-18% 0px -62% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <aside className="case-study__sidebar">
      <Link href="/work" className="case-study__back">
        ← BACK
      </Link>
      <nav className="case-study__nav" aria-label="Case study sections">
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={active === item.id ? "is-active" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  document.getElementById(item.id)?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                  setActive(item.id);
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

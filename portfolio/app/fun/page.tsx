import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/src/components/motion/Reveal";
import { SwapLabel } from "@/src/components/SwapLabel";
import { funPage } from "@/src/content/fun";

export const metadata: Metadata = {
  title: "Fun",
  description:
    "Running, reading, design, and tech — what Paulo Freitas likes outside client work.",
};

export default function FunPage() {
  return (
    <>
      <header className="page-intro page-intro--frame">
        <h1>{funPage.title}</h1>
        <p>{funPage.lead}</p>
      </header>

      <section className="frame-fun" aria-label="Interests">
        <Reveal targets=".frame-fun__card" stagger={0.08}>
          <div className="frame-fun__grid">
            {funPage.interests.map((interest) => {
              const href = interest.href;

              return (
                <article key={interest.id} className="frame-fun__card">
                  <p className="frame-fun__label">{interest.label}</p>
                  <h2 className="frame-fun__title">{interest.title}</h2>
                  {interest.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 48)} className="frame-fun__copy">
                      {paragraph}
                    </p>
                  ))}
                  {href ? (
                    <p className="frame-fun__link-wrap">
                      <a
                        href={href}
                        className="text-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <SwapLabel>{interest.hrefLabel ?? href}</SwapLabel>
                      </a>
                      {" · "}
                      <Link href="/work/frameline" className="text-link">
                        <SwapLabel>Case study</SwapLabel>
                      </Link>
                    </p>
                  ) : null}
                </article>
              );
            })}
          </div>
        </Reveal>
      </section>
    </>
  );
}

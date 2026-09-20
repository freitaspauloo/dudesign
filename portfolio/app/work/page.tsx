import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/src/components/motion/Reveal";
import { SwapLabel } from "@/src/components/SwapLabel";
import { getPublishedCases } from "@/src/content/cases";
import { assetPath } from "@/src/lib/asset-path";

export const metadata: Metadata = {
  title: "Work",
  description: "Case studies in AI/SaaS product design — shipped in code.",
};

export default function WorkPage() {
  const cases = getPublishedCases();

  return (
    <>
      <header className="page-intro page-intro--frame">
        <h1>Work</h1>
        <p>
          Case studies in AI UX, code prototypes, and enterprise complexity —
          shipped in product, not slide decks.
        </p>
      </header>

      <section className="frame-work frame-work--index" aria-label="Case studies">
        <Reveal targets=".frame-work__card" stagger={0.06}>
          <div className="frame-work__grid">
            {cases.map((caseStudy) => {
              const coverFit = caseStudy.cover.fit ?? "cover";

              return (
              <Link
                key={caseStudy.slug}
                href={`/work/${caseStudy.slug}`}
                className="frame-work__card"
              >
                <div className="frame-work__media" data-cursor="case">
                  <Image
                    src={assetPath(caseStudy.cover.src)}
                    alt={caseStudy.cover.alt}
                    fill
                    unoptimized
                    sizes="(max-width: 960px) 100vw, 612px"
                    style={{ objectFit: coverFit }}
                  />
                </div>
                <div className="frame-work__meta">
                  <span className="frame-work__title">
                    <SwapLabel>{caseStudy.title}</SwapLabel>
                  </span>
                  <span className="frame-work__role">
                    {caseStudy.client.toUpperCase()}
                  </span>
                </div>
              </Link>
            );
            })}
          </div>
        </Reveal>
      </section>
    </>
  );
}

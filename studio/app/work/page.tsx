import type { Metadata } from "next";
import Link from "next/link";
import { ProjectThumb } from "@/src/components/ProjectThumb";
import { Reveal } from "@/src/components/motion/Reveal";
import { SwapLabel } from "@/src/components/SwapLabel";
import { getPublishedCases } from "@/src/content/cases";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Product surfaces DUDESIGN has designed and shipped for AI startups and global brands.",
};

export default function WorkPage() {
  const cases = getPublishedCases();

  return (
    <>
      <header className="page-intro page-intro--frame">
        <h1>The surfaces we&apos;ve shipped.</h1>
        <p>
          Each one started as a single job a user had to understand. Here is
          what we built.
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
                <div className="frame-work__media" data-cursor="case-study">
                  <ProjectThumb
                    src={caseStudy.cover.src}
                    alt={caseStudy.cover.alt}
                    fit={coverFit}
                    video={caseStudy.cover.video}
                  />
                </div>
                <div className="frame-work__meta">
                  <span className="frame-work__title">
                    <SwapLabel>
                      {caseStudy.surfaceLine ?? caseStudy.cardTitle ?? caseStudy.title}
                    </SwapLabel>
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

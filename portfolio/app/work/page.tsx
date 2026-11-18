import type { Metadata } from "next";
import Link from "next/link";
import { ProjectThumb } from "@/src/components/ProjectThumb";
import { Reveal } from "@/src/components/motion/Reveal";
import { SwapLabel } from "@/src/components/SwapLabel";
import { getPublishedCases } from "@/src/content/cases";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected product design work, from early-stage AI to Fortune 500 companies.",
};

export default function WorkPage() {
  const cases = getPublishedCases();

  return (
    <>
      <header className="page-intro page-intro--frame">
        <h1>Work</h1>
        <p>
          Selected product design work, from early-stage AI to Fortune 500 companies.
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
                    bonsai={caseStudy.slug === "conifer"}
                  />
                </div>
                <div className="frame-work__meta">
                  <span className="frame-work__title">
                    <SwapLabel>{caseStudy.cardTitle ?? caseStudy.title}</SwapLabel>
                  </span>
                  {caseStudy.slug === "conifer" ? (
                    <span className="frame-work__client">
                      <span className="frame-work__logos" aria-hidden="true">
                        <img
                          src="/work/logos/conifer-mark.png"
                          alt=""
                          className="is-mark"
                        />
                        <img
                          src="/work/logos/yc.png"
                          alt=""
                          className="is-mark is-yc"
                        />
                      </span>
                      <span className="frame-work__role">Conifer</span>
                    </span>
                  ) : (
                    <span className="frame-work__role">
                      {caseStudy.client.toUpperCase()}
                    </span>
                  )}
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

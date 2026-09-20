import Image from "next/image";
import Link from "next/link";
import type { CaseStudy } from "@/src/content/types";
import { assetPath } from "@/src/lib/asset-path";
import { SwapLabel } from "@/src/components/SwapLabel";

const PAPER_TINTS = ["#e8d5c4", "#ebe6f2", "#c8c8c8", "#ddd4eb", "#f0ece6", "#e3e8ef"];

type Props = {
  caseStudy: CaseStudy;
  /** Editorial index label, e.g. "02" */
  index?: string;
  variant?: "default" | "paper";
};

export function CaseCard({ caseStudy, index, variant = "default" }: Props) {
  const tint = PAPER_TINTS[caseStudy.order % PAPER_TINTS.length];
  const meta = `${caseStudy.client.toUpperCase()} • ${caseStudy.tags[0]?.toUpperCase() ?? "CASE STUDY"}`;
  const coverFit = caseStudy.cover.fit ?? "cover";

  if (variant === "paper") {
    return (
      <Link href={`/work/${caseStudy.slug}`} className="paper-card-link">
        <article className="paper-card">
          <div
            className="paper-card__media"
            data-cursor="case"
            style={{ backgroundColor: tint }}
          >
            <Image
              src={assetPath(caseStudy.cover.src)}
              alt={caseStudy.cover.alt}
              fill
              unoptimized
              style={{ objectFit: coverFit }}
            />
          </div>
          <div className="paper-card__meta">
            <h3>
              <SwapLabel>{caseStudy.title}</SwapLabel>
            </h3>
            <p>{meta}</p>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/work/${caseStudy.slug}`} className="work-card-link">
      <article className="work-card">
        {index ? (
          <div className="work-card-head">
            <p className="micro-label">Case — {index}</p>
            <p className="micro-label">{caseStudy.client}</p>
          </div>
        ) : null}
        <div className="work-card-media" data-cursor="case">
          <Image
            src={assetPath(caseStudy.cover.src)}
            alt={caseStudy.cover.alt}
            fill
            unoptimized
            style={{ objectFit: coverFit }}
          />
        </div>
        <div className="work-card-meta">
          <div>
            <h3>
              <SwapLabel>{caseStudy.title}</SwapLabel>
            </h3>
            <p>{caseStudy.tags.join(" · ")}</p>
          </div>
          {caseStudy.logos && caseStudy.logos.length > 0 ? (
            <div className="work-card-logos">
              {caseStudy.logos.map((logo) => (
                <img key={logo.src} src={assetPath(logo.src)} alt={logo.alt} />
              ))}
            </div>
          ) : null}
        </div>
      </article>
    </Link>
  );
}

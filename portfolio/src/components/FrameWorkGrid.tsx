import Link from "next/link";
import { SwapLabel } from "@/src/components/SwapLabel";
import { ProjectThumb } from "./ProjectThumb";
import { Reveal } from "./motion/Reveal";

export type FrameWorkProject = {
  title: string;
  client: string;
  href: string;
  logos?: { src: string; alt: string; mark?: boolean; badge?: boolean }[];
  image: {
    src: string;
    alt: string;
    fit?: "cover" | "contain";
    video?: string;
    bonsai?: boolean;
  };
};

type Props = {
  projects: FrameWorkProject[];
  label?: string;
};

export function FrameWorkGrid({ projects, label = "Selected work" }: Props) {
  return (
    <section className="frame-work" aria-label={label}>
      <Reveal targets=".frame-work__card" stagger={0.08}>
        <div className="frame-work__grid">
          {projects.map((project) => {
            return (
            <Link
              key={`${project.href}-${project.title}`}
              href={project.href}
              className="frame-work__card"
            >
              <div className="frame-work__media" data-cursor="case-study">
                <ProjectThumb
                  src={project.image.src}
                  alt={project.image.alt}
                  fit={project.image.fit}
                  video={project.image.video}
                  bonsai={project.image.bonsai}
                />
              </div>
              <div className="frame-work__meta">
                <span className="frame-work__title">
                  <SwapLabel>{project.title}</SwapLabel>
                </span>
                <span className="frame-work__client">
                  {project.logos && project.logos.length > 0 ? (
                    <span className="frame-work__logos" aria-hidden="true">
                      {project.logos.map((logo) => (
                        <img
                          key={logo.src}
                          src={logo.src}
                          alt=""
                          className={
                            [
                              logo.mark ? "is-mark" : logo.badge ? "is-badge" : "",
                              logo.src.endsWith("yc.png") ? "is-yc" : "",
                            ]
                              .filter(Boolean)
                              .join(" ") || undefined
                          }
                        />
                      ))}
                    </span>
                  ) : null}
                  <span className="frame-work__role">{project.client}</span>
                </span>
              </div>
            </Link>
          );
          })}
        </div>
      </Reveal>
    </section>
  );
}

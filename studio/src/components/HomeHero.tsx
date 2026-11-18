import Link from "next/link";
import { homeTimeline } from "@/src/content/home";
import { site } from "@/src/content/site";
import { BtnArrow } from "@/src/components/BtnArrow";
import { HomeHeroTimeline } from "@/src/components/HomeHeroTimeline";

export function HomeHero() {
  return (
    <section className="frame-hero" aria-label="Introduction">
      <div className="frame-hero__lead">
        <h1 className="frame-hero__title">
          Product sprints design
          <br />
          for AI startups.
        </h1>
        <div className="frame-hero__actions">
          <Link href={site.bookHref} className="btn btn--solid">
            Book a sprint
            <BtnArrow />
          </Link>
          <Link href="/work" className="btn btn--ghost">
            See the work
            <BtnArrow />
          </Link>
        </div>
      </div>

      <HomeHeroTimeline entries={homeTimeline} />
    </section>
  );
}

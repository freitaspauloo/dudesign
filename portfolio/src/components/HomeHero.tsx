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
          I&apos;m Paulo, a product
          <br />
          designer who engineers.
        </h1>
        <div className="frame-hero__actions">
          <Link href={site.workHref} className="btn btn--solid">
            Contact me
            <BtnArrow />
          </Link>
          <Link href="/resume" className="btn btn--ghost">
            Resume
            <BtnArrow />
          </Link>
        </div>
      </div>

      <HomeHeroTimeline entries={homeTimeline} />
    </section>
  );
}

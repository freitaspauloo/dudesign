import { homeTimeline } from "@/src/content/home";
import { HomeHeroTimeline } from "@/src/components/HomeHeroTimeline";

export function HomeHero() {
  return (
    <section className="frame-hero" aria-label="Introduction">
      <div className="frame-hero__lead">
        <h1 className="frame-hero__title">
          Product design
          <br />
          for AI startups.
        </h1>
      </div>

      <HomeHeroTimeline entries={homeTimeline} />
    </section>
  );
}

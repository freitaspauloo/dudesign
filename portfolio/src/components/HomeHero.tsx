import { homeTimeline } from "@/src/content/home";
import { HomeHeroTimeline } from "@/src/components/HomeHeroTimeline";

export function HomeHero() {
  return (
    <section className="frame-hero" aria-label="Introduction">
      <h1 className="frame-hero__title">
        I&apos;m Paulo, a product
        <br />
        designer who engineers.
      </h1>

      <HomeHeroTimeline entries={homeTimeline} />
    </section>
  );
}

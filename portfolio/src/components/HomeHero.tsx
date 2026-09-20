import { homeTimeline } from "@/src/content/home";
import { SwapLabel } from "@/src/components/SwapLabel";

export function HomeHero() {
  return (
    <section className="frame-hero" aria-label="Introduction">
      <h1 className="frame-hero__title">
        I&apos;m Paulo, a product
        <br />
        designer who engineers.
      </h1>

      <ol className="frame-hero__timeline" aria-label="Experience">
        {homeTimeline.map((entry) => (
          <li key={`${entry.year}-${entry.company}`} className="frame-hero__timeline-row">
            <span className="frame-hero__year">{entry.year}</span>
            <div className="frame-hero__timeline-detail">
              {entry.href ? (
                <a
                  href={entry.href}
                  className="frame-hero__company"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SwapLabel>{entry.company}</SwapLabel>
                </a>
              ) : (
                <span className="frame-hero__company">
                  <SwapLabel>{entry.company}</SwapLabel>
                </span>
              )}
              <span className="frame-hero__role">{entry.role}</span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

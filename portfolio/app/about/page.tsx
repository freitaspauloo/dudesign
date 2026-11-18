import type { Metadata } from "next";
import Link from "next/link";
import { SwapLabel } from "@/src/components/SwapLabel";
import { getPublishedCases } from "@/src/content/cases";
import { site } from "@/src/content/site";

export const metadata: Metadata = {
  title: "About",
  description: site.tagline,
};

export default function AboutPage() {
  const cases = getPublishedCases();

  return (
    <>
      <header className="page-intro page-intro--frame">
        <h1>About</h1>
        <p>{site.tagline}</p>
      </header>

      <div className="about-page-grid">
        <div className="about-body">
          <p>
            I&apos;m Paulo Freitas, a product designer who works at the
            intersection of AI products, visual craft, and production UI. I
            ship for startups today. Before that I designed at xix3D for Audi,
            Samsung, 3M, Ford, Sony, Honda, and Costco.
          </p>
          <p>
            I also build my own tools when the market gap is obvious, like{" "}
            <a href="https://frameline.ai" className="text-link">
              <SwapLabel>Frameline</SwapLabel>
            </a>
            .
          </p>
          <p>
            I&apos;m looking for senior product design roles in the US. I work
            best with product and engineering when the bet is clear but the
            surface is hard. Complex B2B, agent UX, or developer-facing
            products that need to ship in code.
          </p>
          <nav className="about-body__links" aria-label="Contact">
            <Link href="/resume" className="frame-bar__link">
              <SwapLabel>resume</SwapLabel>
            </Link>
            <a
              href={site.linkedin}
              className="frame-bar__link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SwapLabel>linkedin</SwapLabel>
            </a>
            <a href={`mailto:${site.email}`} className="frame-bar__link">
              <SwapLabel>email</SwapLabel>
            </a>
          </nav>
        </div>

        <aside className="about-sidebar-panel">
          <h2>What teams hire me for</h2>
          <ul className="tag-list">
            {site.skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
          <h2>Case studies</h2>
          <ul>
            {cases.map((c) => (
              <li key={c.slug}>
                <Link href={`/work/${c.slug}`}>
                  <SwapLabel>{c.title}</SwapLabel>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
}

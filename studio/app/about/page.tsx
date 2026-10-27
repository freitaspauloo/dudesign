import type { Metadata } from "next";
import Link from "next/link";
import { SwapLabel } from "@/src/components/SwapLabel";
import { getPublishedCases } from "@/src/content/cases";
import { site } from "@/src/content/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Independent product design studio founded by Paulo Freitas. We decide what to build, design it, and implement the interface.",
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
            DUDESIGN is an independent product design studio founded by Paulo
            Freitas. We decide what to build, design it, and implement the
            interface.
          </p>
          <p>
            Fortune 500 craft from Audi, Samsung, 3M, Ford, Sony + Honda, and
            Costco, for teams that need product judgment, UX/UI, and a shipped
            interface. The studio also builds its own tools, including{" "}
            <a href="https://frameline.ai" className="text-link">
              <SwapLabel>Frameline</SwapLabel>
            </a>
            .
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
          <h2>What the studio does</h2>
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

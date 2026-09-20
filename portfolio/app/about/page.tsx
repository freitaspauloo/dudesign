import type { Metadata } from "next";
import Link from "next/link";
import { SwapLabel } from "@/src/components/SwapLabel";
import { getPublishedCases } from "@/src/content/cases";
import { site } from "@/src/content/site";

export const metadata: Metadata = {
  title: "About",
  description: "Product Designer — AI/SaaS. Based in the US market.",
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
            I&apos;m Paulo Freitas — a product designer who works at the
            intersection of AI/SaaS, visual craft, and production UI. I ship
            for startups today; before that I led design at XIX3D for global
            clients including Audi, Samsung, 3M, Ford, Sony + Honda, and
            Costco.
          </p>
          <p>
            I also build my own tools when the market gap is obvious — like{" "}
            <a href="https://frameline.ai" className="text-link">
              <SwapLabel>Frameline</SwapLabel>
            </a>{" "}
            — and run{" "}
            <a href="https://dudesign.us" className="text-link">
              <SwapLabel>DUDESIGN</SwapLabel>
            </a>{" "}
            as an independent product design partner for AI startups.
          </p>
          <p>
            I&apos;m looking for{" "}
            <strong>Product Designer — AI/SaaS</strong> roles in the US. I work
            best with PM and Engineering when the bet is clear but the surface is hard —
            complex B2B, agent UX, or dev-facing products that need to ship in
            code, not slide decks.
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

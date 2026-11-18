import type { CaseStudy } from "@/src/content/types";
import {
  CaseStudySidebar,
  type CaseStudyNavItem,
} from "./CaseStudySidebar";
import { CaseStudyCover } from "./CaseStudyCover";
import { CaseStudyGallery } from "./CaseStudyGallery";
import { DecisionBlock } from "./DecisionBlock";
import { LivePrototype } from "./LivePrototype";
import { Reveal } from "./motion/Reveal";
import { ProofStrip } from "./ProofStrip";

type Props = {
  caseStudy: CaseStudy;
};

function buildEyebrow(caseStudy: CaseStudy) {
  const client = caseStudy.client.toUpperCase();
  const label = (caseStudy.metaLabel ?? caseStudy.tags[0] ?? "").toUpperCase();
  const year = caseStudy.year ?? "";

  return [client, label, year].filter(Boolean).join(" • ");
}

function visibleSections(caseStudy: CaseStudy) {
  return caseStudy.sections.filter(
    (section) => !section.body.every((paragraph) => paragraph.trim().startsWith("[TODO")),
  );
}

function buildNavItems(caseStudy: CaseStudy): CaseStudyNavItem[] {
  const sections = visibleSections(caseStudy).map((section) => ({
    id: section.id,
    label: section.title,
  }));
  const role = { id: "role", label: "My role" };
  const decisions =
    caseStudy.decisions.length > 0
      ? [{ id: "decisions", label: "Key decisions" }]
      : [];
  const splitAt = caseStudy.decisionsAfter
    ? sections.findIndex((section) => section.id === caseStudy.decisionsAfter)
    : -1;

  if (splitAt < 0 || decisions.length === 0) {
    return [{ id: "overview", label: "Overview" }, ...sections, role, ...decisions];
  }

  return [
    { id: "overview", label: "Overview" },
    ...sections.slice(0, splitAt + 1),
    ...decisions,
    ...sections.slice(splitAt + 1),
    role,
  ];
}

export function CaseStudyLayout({ caseStudy }: Props) {
  const displayTitle = caseStudy.displayTitle ?? caseStudy.subtitle;
  const roleTitle = caseStudy.roleTitle ?? "Product Designer";
  const timeline =
    caseStudy.timeline ??
    (caseStudy.year ? caseStudy.year : "Not listed");
  const team =
    caseStudy.team ??
    (caseStudy.collaborators.length > 0
      ? caseStudy.collaborators.join(", ")
      : "Not listed");
  const skills = caseStudy.skillsProven.slice(0, 3).join(", ");
  const navItems = buildNavItems(caseStudy);

  return (
    <article className="case-study">
      <div className="case-study__shell">
        <div className="case-study__sidebar-col">
          <CaseStudySidebar items={navItems} />
        </div>

        <div className="case-study__main">
          <header id="overview" className="case-study__intro">
            <p className="case-study__eyebrow">{buildEyebrow(caseStudy)}</p>
            <h1 className="case-study__display-title">{displayTitle}</h1>
            {caseStudy.surfaceLine ? (
              <p className="case-study__surface">{caseStudy.surfaceLine}</p>
            ) : null}

            <div className="case-study__hero">
              {caseStudy.prototype?.hero ? (
                <LivePrototype
                  prototype={caseStudy.prototype}
                  cover={caseStudy.cover}
                  variant="hero"
                />
              ) : (
                <CaseStudyCover cover={caseStudy.cover} />
              )}
            </div>

            <dl className="case-study__facts">
              <div className="case-study__fact">
                <dt className="case-study__fact-label">Role</dt>
                <dd className="case-study__fact-value">{roleTitle}</dd>
              </div>
              <div className="case-study__fact">
                <dt className="case-study__fact-label">Timeline</dt>
                <dd className="case-study__fact-value">{timeline}</dd>
              </div>
              <div className="case-study__fact">
                <dt className="case-study__fact-label">Team</dt>
                <dd className="case-study__fact-value">{team}</dd>
              </div>
              <div className="case-study__fact">
                <dt className="case-study__fact-label">Skills</dt>
                <dd className="case-study__fact-value">{skills}</dd>
              </div>
            </dl>

            {caseStudy.links.length > 0 ? (
              <div className="case-study__proof">
                <ProofStrip links={caseStudy.links} />
              </div>
            ) : null}
          </header>

          {caseStudy.prototype && !caseStudy.prototype.hero ? (
            <Reveal>
              <LivePrototype
                prototype={caseStudy.prototype}
                cover={caseStudy.cover}
              />
            </Reveal>
          ) : null}

          {caseStudy.gallery && caseStudy.gallery.length > 0 ? (
            <Reveal>
              <CaseStudyGallery blocks={caseStudy.gallery} />
            </Reveal>
          ) : null}

          <div className="case-study__body">
            {(() => {
              const sections = visibleSections(caseStudy);
              const splitAt = caseStudy.decisionsAfter
                ? sections.findIndex(
                    (section) => section.id === caseStudy.decisionsAfter,
                  )
                : -1;
              const before =
                splitAt < 0
                  ? sections
                  : sections.slice(0, splitAt + 1);
              const after =
                splitAt < 0 ? [] : sections.slice(splitAt + 1);

              const renderSection = (section: (typeof caseStudy.sections)[number]) => (
                <Reveal key={section.id}>
                  <section id={section.id} className="case-study__section">
                    <h2>{section.title}</h2>
                    {section.body.map((paragraph) => (
                      <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                    ))}
                  </section>
                  {section.visuals && section.visuals.length > 0 ? (
                    <CaseStudyGallery
                      inline
                      blocks={[
                        {
                          id: `${section.id}-visuals`,
                          layout: section.visualsLayout ?? "full",
                          items: section.visuals,
                        },
                      ]}
                    />
                  ) : null}
                </Reveal>
              );

              const decisions =
                caseStudy.decisions.length > 0 ? (
                  <section id="decisions" className="case-study__decisions">
                    <h2>Key decisions</h2>
                    <DecisionBlock decisions={caseStudy.decisions} />
                  </section>
                ) : null;

              return (
                <>
                  {before.map(renderSection)}
                  {splitAt >= 0 ? decisions : null}
                  {after.map(renderSection)}
                </>
              );
            })()}

            <section id="role" className="case-study__role">
              <h2>My role</h2>
              <div className="role-columns">
                <div>
                  <h3>Owned</h3>
                  <ul>
                    {caseStudy.role.owned.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3>Did not own</h3>
                  <ul>
                    {caseStudy.role.notOwned.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              {caseStudy.collaborators.length > 0 && (
                <p className="collaborators">
                  <strong>Collaborators:</strong>{" "}
                  {caseStudy.collaborators.join(", ")}
                </p>
              )}
            </section>

            {caseStudy.decisionsAfter || caseStudy.decisions.length === 0 ? null : (
              <section id="decisions" className="case-study__decisions">
                <h2>Key decisions</h2>
                <DecisionBlock decisions={caseStudy.decisions} />
              </section>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { resume } from "@/src/content/resume";
import { site } from "@/src/content/site";

export const metadata: Metadata = {
  title: "Résumé",
  description: "Paulo Freitas — Senior Product Designer, AI/SaaS",
};

export default function ResumePage() {
  return (
    <article className="resume-page">
      <p className="resume-hint">
        Print this page (Ctrl+P / Cmd+P) and save as PDF, or{" "}
        <Link href={resume.pdfPath}>download the PDF</Link> for applications.
      </p>

      <h1>{site.name}</h1>
      <p className="resume-title">{resume.title}</p>
      <p className="resume-meta">
        United States ·{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a> ·{" "}
        <a href={site.linkedin}>linkedin.com/in/freitas-pauloo</a> ·{" "}
        <a href={site.url}>{site.domain}</a>
      </p>

      <section className="resume-block">
        <h2>Summary</h2>
        <p>{resume.summary}</p>
      </section>

      <section className="resume-block">
        <h2>Work Experience</h2>
        {resume.jobs.map((job) => (
          <div className="resume-job" key={job.company}>
            <div className="resume-job__head">
              <strong>{job.company}</strong>
              <span>{job.dates}</span>
            </div>
            <p className="resume-job__role">
              {job.role} · {job.location}
            </p>
            <ul>
              {job.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="resume-block">
        <h2>Education</h2>
        {resume.education.map((item) => (
          <div className="resume-job resume-job--compact" key={item.school}>
            <div className="resume-job__head">
              <strong>{item.school}</strong>
              <span>{item.dates}</span>
            </div>
            <p className="resume-job__role">{item.degree}</p>
          </div>
        ))}
      </section>

      <section className="resume-block">
        <h2>Skills &amp; Languages</h2>
        <ul className="resume-skills">
          {resume.skills.map((group) => (
            <li key={group.label}>
              <strong>{group.label}</strong> {group.value}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}

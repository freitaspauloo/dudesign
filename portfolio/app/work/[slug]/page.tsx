import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyLayout } from "@/src/components/CaseStudyLayout";
import { allCases, getCaseBySlug } from "@/src/content/cases";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return allCases.filter((c) => c.published).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = getCaseBySlug(slug);
  if (!caseStudy) return { title: "Case study" };

  return {
    title: caseStudy.title,
    description: caseStudy.subtitle,
    openGraph: {
      title: `${caseStudy.title} — Case study`,
      description: caseStudy.subtitle,
      images: [{ url: caseStudy.cover.src }],
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const caseStudy = getCaseBySlug(slug);

  if (!caseStudy?.published) notFound();

  return <CaseStudyLayout caseStudy={caseStudy} />;
}

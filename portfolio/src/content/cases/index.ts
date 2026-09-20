import type { CaseStudy } from "../types";
import { alignedAi } from "./aligned-ai";
import { builtops } from "./builtops";
import { conifer } from "./conifer";
import { frameline } from "./frameline";
import { ford } from "./ford";
import { afeela } from "./afeela";
import { costco } from "./costco";
import { films3m } from "./films-3m";
import { iaa } from "./iaa";

export const allCases: CaseStudy[] = [
  alignedAi,
  frameline,
  builtops,
  conifer,
  ford,
  afeela,
  costco,
  films3m,
  iaa,
];

export function getCaseBySlug(slug: string): CaseStudy | undefined {
  return allCases.find((c) => c.slug === slug);
}

export function getPublishedCases(): CaseStudy[] {
  return allCases
    .filter((c) => c.published)
    .sort((a, b) => a.order - b.order);
}

export function getFeaturedCase(): CaseStudy | undefined {
  return allCases.find((c) => c.featured && c.published);
}

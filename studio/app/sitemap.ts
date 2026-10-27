import type { MetadataRoute } from "next";
import { allCases } from "@/src/content/cases";
import { site } from "@/src/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const caseRoutes = allCases
    .filter((c) => c.published)
    .map((c) => ({
      url: `${base}/work/${c.slug}`,
      lastModified: new Date(),
    }));

  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/work`, lastModified: new Date() },
    { url: `${base}/about`, lastModified: new Date() },
    { url: `${base}/fun`, lastModified: new Date() },
    { url: `${base}/resume`, lastModified: new Date() },
    ...caseRoutes,
  ];
}

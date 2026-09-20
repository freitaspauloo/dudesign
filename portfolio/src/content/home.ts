export type HomeTimelineEntry = {
  year: string;
  company: string;
  role: string;
  href?: string;
};

export type HomeFeaturedProject = {
  title: string;
  client: string;
  href: string;
  image: { src: string; alt: string; fit?: "cover" | "contain" };
};

export const homeTimeline: HomeTimelineEntry[] = [
  {
    year: "2026",
    company: "DUDESIGN",
    role: "Founder & Product Designer",
    href: "https://dudesign.us",
  },
  {
    year: "2025",
    company: "xix3D",
    role: "Senior Product Designer",
    href: "https://xix3d.com",
  },
  {
    year: "2024",
    company: "xix3D",
    role: "Product Designer",
    href: "https://xix3d.com",
  },
  { year: "2023", company: "SMPL - MKT & Consulting", role: "Visual Designer" },
];

/** Featured grid on the Paper homepage frame (15H-0). */
export const homeFeaturedProjects: HomeFeaturedProject[] = [
  {
    title: "Personal AI workspace",
    client: "ALIGNED AI",
    href: "/work/aligned-ai",
    image: {
      src: "/work/cases/aligned-ai/desktop-1.png",
      alt: "Aligned AI desktop workspace overview with sidebar and Good morning Paulo",
      fit: "contain",
    },
  },
  {
    title: "Design-engineering surface library",
    client: "FRAMELINE",
    href: "/work/frameline",
    image: {
      src: "/work/cases/frameline.webp",
      alt: "Frameline design system surfaces",
    },
  },
  {
    title: "BuiltOps / Losani",
    client: "LOSANI",
    href: "/work/builtops",
    image: {
      src: "/work/06.webp",
      alt: "FORGE.AI product interface",
    },
  },
  {
    title: "Inference gateway redesign",
    client: "CONIFER",
    href: "/work/conifer",
    image: {
      src: "/work/cases/conifer/hero.png",
      alt: "Conifer landing page — run AI locally, route the rest",
    },
  },
];

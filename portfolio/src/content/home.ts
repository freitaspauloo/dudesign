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
    title: "3D software for the showroom floor",
    client: "3M FILMS",
    href: "/work/3m-films",
    image: {
      src: "/work/cases/3m-films/01.webp",
      alt: "3M Zeno kiosk — 3D wrap visualizer on shop-floor hardware",
    },
  },
  {
    title: "EV personalization platform",
    client: "AFEELA",
    href: "/work/afeela",
    image: {
      src: "/work/cases/afeela/01.webp",
      alt: "Afeela Model 1 configurator — paint, personalize, and live vehicle preview",
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

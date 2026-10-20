export type HomeTimelineEntry = {
  year: string;
  company: string;
  role: string;
  href?: string;
  preview?: { src: string; alt: string; fit?: "cover" | "contain" };
};

export type HomeFeaturedProject = {
  title: string;
  client: string;
  href: string;
  image: { src: string; alt: string; fit?: "cover" | "contain" };
};

/** Homepage hero — client/project milestones (employment detail lives on /resume). */
export const homeTimeline: HomeTimelineEntry[] = [
  {
    year: "2026",
    company: "Conifer",
    role: "Inference gateway",
    href: "/work/conifer",
    preview: {
      src: "/work/cases/conifer/hero.png",
      alt: "Conifer landing page — run AI locally, route the rest",
    },
  },
  {
    year: "2025",
    company: "Aligned AI",
    role: "Personal AI workspace",
    href: "/work/aligned-ai",
    preview: {
      src: "/work/cases/aligned-ai/desktop-1.png",
      alt: "Aligned AI desktop workspace overview",
      fit: "contain",
    },
  },
  {
    year: "2024",
    company: "Ford",
    role: "OEM wrap program",
    href: "/work/ford",
    preview: {
      src: "/work/cases/ford/01.webp",
      alt: "Ford wrap configurator on a laptop",
    },
  },
  {
    year: "2024",
    company: "3M Films",
    role: "Zeno showroom platform",
    href: "/work/3m-films",
    preview: {
      src: "/work/cases/3m-films/01.webp",
      alt: "3M Zeno kiosk — 3D wrap visualizer",
    },
  },
  {
    year: "2023–25",
    company: "Afeela",
    role: "Sony + Honda EV venture",
    href: "/work/afeela",
    preview: {
      src: "/work/cases/afeela/01.webp",
      alt: "Afeela Model 1 configurator",
    },
  },
];

/** Featured grid on the Paper homepage frame (15H-0). */
export const homeFeaturedProjects: HomeFeaturedProject[] = [
  {
    title: "Personal AI workspace",
    client: "Aligned AI",
    href: "/work/aligned-ai",
    image: {
      src: "/work/cases/aligned-ai/desktop-1.png",
      alt: "Aligned AI desktop workspace overview with sidebar and Good morning Paulo",
      fit: "contain",
    },
  },
  {
    title: "Showroom 3D software",
    client: "3M Films",
    href: "/work/3m-films",
    image: {
      src: "/work/cases/3m-films/01.webp",
      alt: "3M Zeno kiosk — 3D wrap visualizer on shop-floor hardware",
    },
  },
  {
    title: "EV personalization platform",
    client: "Afeela (Sony + Honda EV Venture)",
    href: "/work/afeela",
    image: {
      src: "/work/cases/afeela/01.webp",
      alt: "Afeela Model 1 configurator — paint, personalize, and live vehicle preview",
    },
  },
  {
    title: "OEM-aftermarket program",
    client: "Ford",
    href: "/work/ford",
    image: {
      src: "/work/cases/ford/01.webp",
      alt: "Ford wrap configurator on a laptop — Bronco with real-time film and color selection",
    },
  },
  {
    title: "Inference gateway",
    client: "Conifer",
    href: "/work/conifer",
    image: {
      src: "/work/cases/conifer/hero.png",
      alt: "Conifer landing page — run AI locally, route the rest",
    },
  },
];

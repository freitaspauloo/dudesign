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
  logos?: { src: string; alt: string; mark?: boolean; badge?: boolean }[];
  image: {
    src: string;
    alt: string;
    fit?: "cover" | "contain";
    video?: string;
    bonsai?: boolean;
  };
};

/** Homepage hero, client/project milestones (employment detail lives on /resume). */
export const homeTimeline: HomeTimelineEntry[] = [
  {
    year: "2026",
    company: "Alpic",
    role: "Agent experiment flow",
    href: "/work/alpic",
    preview: {
      src: "/work/cases/alpic/cover.webp",
      alt: "Pixel mountain with the line Your next user might not be human",
      fit: "contain",
    },
  },
  {
    year: "2026",
    company: "Conifer",
    role: "Workspace for coding agents",
    href: "/work/conifer",
    preview: {
      src: "/work/cases/conifer/product-captain.png",
      alt: "Parallax Captain splitting one ask across three agents",
      fit: "contain",
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
      alt: "3M Zeno kiosk, 3D wrap visualizer",
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
    title: "Agent experiment flow",
    client: "Alpic",
    href: "/work/alpic",
    logos: [{ src: "/work/logos/alpic.svg", alt: "Alpic", mark: true }],
    image: {
      src: "/work/cases/alpic/cover.webp",
      alt: "Pixel mountain with the line Your next user might not be human",
      fit: "contain",
      video: "/work/cases/alpic/cover-3.mp4",
    },
  },
  {
    title: "Workspace for coding agents",
    client: "Conifer",
    href: "/work/conifer",
    logos: [
      { src: "/work/logos/conifer-mark.png", alt: "Conifer", mark: true },
      { src: "/work/logos/yc.png", alt: "Y Combinator", mark: true },
    ],
    image: {
      src: "/work/cases/conifer/hero.png",
      alt: "Parallax, the workspace, then the Conifer site",
      bonsai: true,
    },
  },
  {
    title: "Personal AI workspace",
    client: "Aligned AI",
    href: "/work/aligned-ai",
    logos: [{ src: "/work/logos/aligned-mark.svg", alt: "Aligned AI", mark: true }],
    image: {
      src: "/work/cases/aligned-ai/desktop-1.png",
      alt: "Aligned AI desktop workspace overview with sidebar and Good morning Paulo",
      fit: "contain",
    },
  },
  {
    title: "Showroom 3D software",
    client: "Films",
    href: "/work/3m-films",
    logos: [{ src: "/work/logos/3m.svg", alt: "3M" }],
    image: {
      src: "/work/cases/3m-films/01.webp",
      alt: "3M Zeno kiosk, 3D wrap visualizer on shop-floor hardware",
    },
  },
  {
    title: "EV personalization platform",
    client: "Afeela",
    href: "/work/afeela",
    logos: [
      { src: "/work/logos/afeela.svg", alt: "Afeela" },
      { src: "/work/logos/sony.svg", alt: "Sony" },
      { src: "/work/logos/honda.svg", alt: "Honda", mark: true },
    ],
    image: {
      src: "/work/cases/afeela/01.webp",
      alt: "Afeela Model 1 configurator, paint, personalize, and live vehicle preview",
    },
  },
  {
    title: "OEM-aftermarket program",
    client: "Ford",
    href: "/work/ford",
    logos: [{ src: "/work/logos/ford.svg", alt: "Ford", badge: true }],
    image: {
      src: "/work/cases/ford/01.webp",
      alt: "Ford wrap configurator on a laptop, Bronco with real-time film and color selection",
    },
  },
];

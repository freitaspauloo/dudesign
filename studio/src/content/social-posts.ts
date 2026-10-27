export type SocialChannel = "LinkedIn" | "X" | "Instagram";
export type SocialFormat =
  | "Offer"
  | "Diary"
  | "Scorecard"
  | "Case"
  | "Stack"
  | "Why-us"
  | "Face";

export type PostKind = "process" | "portfolio";

export type SocialPost = {
  slug: string;
  number: string;
  title: string;
  date: string;
  kind: PostKind;
  format: SocialFormat;
  channels: SocialChannel[];
  visual: string;
  linkedin: string;
  x: string;
  portfolioImage?: string;
};

export const POST_EXPORT_WIDTH = 1080;
export const POST_EXPORT_HEIGHT = 1350;

export const socialPosts: SocialPost[] = [
  {
    slug: "wait-three-months",
    number: "01",
    title: "Most teams wait months for a Figma file",
    date: "2026-09-12",
    kind: "process",
    format: "Offer",
    channels: ["LinkedIn", "X"],
    visual: "Process poster. CRT on the hill. 1080 x 1350.",
    linkedin: `Week 1 we lock the bet.
What the product is for, who uses it, what success looks like. Architecture and the key flows a human actually uses.

Week 2 the first surface ships in the product.
Components, pages, click-through. Your team reacts to real UI, not a file.

From week 3 I keep building in code.
Production UI, iteration in the build, design and implementation in the same place. No handoff queue.`,
    x: `Week 1: bet, architecture, key flows.
Week 2: first surface in the product.
Week 3+: production UI, same stack, no handoff queue.`,
  },
  {
    slug: "softwave-hero",
    number: "02",
    title: "Softwave",
    date: "2026-09-14",
    kind: "portfolio",
    format: "Case",
    channels: ["LinkedIn", "X", "Instagram"],
    visual: "Softwave landing. 1080 x 1350.",
    portfolioImage: "/posts/softwave-landing.png",
    linkedin: `Softwave.
Product design and development.`,
    x: `Softwave. Product design and development.`,
  },
  {
    slug: "frameline-surfaces",
    number: "03",
    title: "Frameline",
    date: "2026-09-16",
    kind: "portfolio",
    format: "Case",
    channels: ["LinkedIn", "X", "Instagram"],
    visual: "Portfolio frame. Frameline configurator. 1080 x 1350.",
    portfolioImage: "/work/cases/frameline.webp",
    linkedin: `Frameline.
Product design and development.`,
    x: `Frameline. Product design and development.`,
  },
  {
    slug: "how-a-surface-ships",
    number: "04",
    title: "How a surface ships",
    date: "2026-09-19",
    kind: "process",
    format: "Stack",
    channels: ["LinkedIn", "X"],
    visual: "Process poster. Three steps. 1080 x 1350.",
    linkedin: `How a surface ships.
1. The bet. What it is for.
2. The surface. The screen a human uses.
3. In the product. Clickable. Not a Figma file.
That's the job.`,
    x: `How a surface ships: bet, surface, in the product.
Figma is a step. Not the product.`,
  },
  {
    slug: "aligned-ai-workspace",
    number: "05",
    title: "Aligned AI workspace",
    date: "2026-09-21",
    kind: "portfolio",
    format: "Case",
    channels: ["LinkedIn", "X", "Instagram"],
    visual: "Portfolio frame. Aligned AI workspace. 1080 x 1350.",
    portfolioImage: "/work/cases/aligned-ai/desktop-1.png",
    linkedin: `Aligned AI workspace.
Personal AI surface. Designed and coded.`,
    x: `Aligned AI workspace. Designed and coded.`,
  },
  {
    slug: "builtops-losani",
    number: "06",
    title: "BuiltOps operator surface",
    date: "2026-09-23",
    kind: "portfolio",
    format: "Case",
    channels: ["LinkedIn", "X", "Instagram"],
    visual: "Portfolio frame. BuiltOps / Losani. 1080 x 1350.",
    portfolioImage: "/work/06.webp",
    linkedin: `BuiltOps operator surface.
Losani. Designed and coded.`,
    x: `BuiltOps operator surface. Designed and coded.`,
  },
  {
    slug: "model-default",
    number: "07",
    title: "Most AI products look the same",
    date: "2026-09-26",
    kind: "process",
    format: "Why-us",
    channels: ["LinkedIn", "X"],
    visual: "Process poster. Model default. 1080 x 1350.",
    linkedin: `Most AI products look the same.
Same chat. Same purple button. Same "ask anything."
That's the model default. Not a designed product.
I replace that screen and ship it in code.`,
    x: `Most AI products look the same.
That's the model default. I replace that screen and ship it in code.`,
  },
  {
    slug: "ford-operator",
    number: "08",
    title: "Ford operator screen",
    date: "2026-09-28",
    kind: "portfolio",
    format: "Case",
    channels: ["LinkedIn", "X", "Instagram"],
    visual: "Portfolio frame. Ford operator UI. Credit Ford. 1080 x 1350.",
    portfolioImage: "/work/cases/ford.webp",
    linkedin: `Ford operator screen.
OEM-aftermarket program. Designed with Ford.`,
    x: `Ford operator screen. Designed with Ford.`,
  },
  {
    slug: "afeela-hmi",
    number: "09",
    title: "Afeela HMI surface",
    date: "2026-09-30",
    kind: "portfolio",
    format: "Case",
    channels: ["LinkedIn", "X", "Instagram"],
    visual: "Portfolio frame. Afeela in-cabin UI. 1080 x 1350.",
    portfolioImage: "/work/cases/afeela.webp",
    linkedin: `Afeela HMI surface.
In-cabin experience. Designed and coded.`,
    x: `Afeela HMI surface. Designed and coded.`,
  },
];

export function getSocialPost(slug: string): SocialPost | undefined {
  return socialPosts.find((post) => post.slug === slug);
}

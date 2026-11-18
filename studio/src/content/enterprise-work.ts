export type EnterpriseHighlight = {
  client: string;
  title: string;
  description: string;
  href: string;
  image: { src: string; alt: string };
  logos: { src: string; alt: string }[];
};

/** What happens in a sprint. Drawn from the existing two-week offer. */
export const engagement = [
  {
    index: "01",
    title: "Questions only",
    body: "We talk to the founder, and to a user if we can. We lock the surface in one sentence, write down what we will not touch, and agree on what done means.",
  },
  {
    index: "02",
    title: "The flow",
    body: "We map the one job, including the AI moment: what the user sees while the model is working, what happens when it is wrong, and how they steer it.",
  },
  {
    index: "03",
    title: "The prototype",
    body: "A clickable prototype in your visual language. You react to something real, not a slide.",
  },
  {
    index: "04",
    title: "Production UI",
    body: "We build the surface in your codebase. If the repo is not ready, we build a coded prototype on your stack.",
  },
  {
    index: "05",
    title: "Last day",
    body: "The surface goes to staging, with a recorded walkthrough and a short handoff note on how your team extends it.",
  },
  {
    index: "06",
    title: "After the sprint",
    body: "Most teams keep us on. We join monthly, sit in the weekly product meeting, and run one design cycle a week in your code.",
  },
];

export const experienceTimeline = [
  { dates: "2025 to 2026", label: "Aligned AI. Product designer. Personal AI workspace." },
  { dates: "2025 to 2026", label: "Amplif.AI. Lead product designer." },
  { dates: "2025 to present", label: "Frameline. Founder. Design-engineering surface library." },
  { dates: "2026", label: "Conifer. Product designer. Workspace for coding agents." },
  { dates: "2023 to 2025", label: "xix3D. Product designer. Afeela, Ford, 3M, Audi, Samsung, Costco." },
  { dates: "2021 to 2025", label: "DUBRANDING. Founder and creative director." },
];

export const enterpriseWork = {
  headline: "The sprint is short",
  subheadline: "because the last decade wasn't.",
  body: [
    "Before DUDESIGN, our founder Paulo Freitas designed product, HMI and brand systems at xix3D for global automotive and consumer tech clients.",
    "Audi, Samsung, 3M, Ford, and Sony + Honda (Afeela). Now that same bar goes into AI startups, two weeks at a time.",
  ],
  mosaic: { src: "/work/tiles.webp", alt: "Selected work across automotive, retail, and consumer tech" },
  clients: ["Audi", "Samsung", "3M", "Ford", "Sony", "Honda"],
  clientLogos: [
    { name: "Audi", logos: [{ src: "/work/logos/audi.svg", alt: "Audi" }] },
    { name: "Samsung", logos: [{ src: "/work/logos/samsung.svg", alt: "Samsung" }] },
    { name: "3M", logos: [{ src: "/work/logos/3m.svg", alt: "3M" }] },
    { name: "Ford", logos: [{ src: "/work/logos/ford.svg", alt: "Ford" }] },
    { name: "Sony", logos: [{ src: "/work/logos/sony.svg", alt: "Sony" }] },
    { name: "Honda", logos: [{ src: "/work/logos/honda.svg", alt: "Honda" }] },
  ],
  /** Ford lives in the homepage project grid, not as a card under this copy. */
  highlights: [] as EnterpriseHighlight[],
  /** Costco + IAA stay on /work only, not promoted on the homepage grid. */
  secondaryHighlights: [] as EnterpriseHighlight[],
};

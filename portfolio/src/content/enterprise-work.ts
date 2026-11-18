export type EnterpriseHighlight = {
  client: string;
  title: string;
  description: string;
  href: string;
  image: { src: string; alt: string };
  logos: { src: string; alt: string }[];
};

/** How a project runs with Paulo. The priced sprint lives on the studio site. */
export const engagement = [
  {
    index: "01",
    when: "First",
    title: "The job",
    body: "I write what the person is trying to finish, and the constraint, before I draw.",
  },
  {
    index: "02",
    when: "Then",
    title: "The flow",
    body: "A couple of options, then a clickable version of the hard part.",
  },
  {
    index: "03",
    when: "In the product",
    title: "The interface",
    body: "I build it in the code, then stay next to engineering while it ships.",
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
    "Before DUDESIGN, I designed product, HMI and brand systems at xix3D for global automotive and consumer tech clients.",
    "Audi, Samsung, 3M, Ford, and Sony + Honda (Afeela). Now that same bar goes into AI startups.",
  ],
  mosaic: { src: "/work/tiles.webp", alt: "Selected work across automotive, retail, and consumer tech" },
  clients: ["Audi", "Samsung", "3M", "Ford", "Sony", "Honda", "Costco"],
  clientLogos: [
    { name: "Audi", logos: [{ src: "/work/logos/audi.svg", alt: "Audi" }] },
    { name: "Samsung", logos: [{ src: "/work/logos/samsung.svg", alt: "Samsung" }] },
    { name: "3M", logos: [{ src: "/work/logos/3m.svg", alt: "3M" }] },
    { name: "Ford", logos: [{ src: "/work/logos/ford.svg", alt: "Ford" }] },
    { name: "Sony", logos: [{ src: "/work/logos/sony.svg", alt: "Sony" }] },
    { name: "Honda", logos: [{ src: "/work/logos/honda.svg", alt: "Honda" }] },
    { name: "Costco", logos: [{ src: "/work/logos/costco.svg", alt: "Costco" }] },
  ],
  /** Ford lives in the homepage project grid, not as a card under this copy. */
  highlights: [] as EnterpriseHighlight[],
  /** Costco + IAA stay on /work only, not promoted on the homepage grid. */
  secondaryHighlights: [] as EnterpriseHighlight[],
};

export type EnterpriseHighlight = {
  client: string;
  title: string;
  description: string;
  href: string;
  image: { src: string; alt: string };
  logos: { src: string; alt: string }[];
};

/** The current sprint. Same terms as studio pricing and the deck. */
export const engagement = [
  {
    index: "01",
    when: "Week 1",
    title: "Questions, then the flow",
    body: "Questions on day 1. Then the flow, with 2 or 3 options, then a clickable prototype. Every day, a 10-minute check-in.",
  },
  {
    index: "02",
    when: "Week 2",
    title: "In the product",
    body: "Production UI in your code. Then staging, a recorded walkthrough, and a handoff note.",
  },
  {
    index: "03",
    when: "After",
    title: "From $4,000 a month",
    body: "A 3-month minimum. Continue within two weeks and the sprint fee is credited to the first month.",
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
  headline: "Before the startups, the hard surfaces.",
  subheadline: "",
  body: [
    "For two years I was the product designer at xix3D, designing the customer-facing software behind Audi, Samsung, 3M, Ford, Sony, Honda, and Costco. Configurators, 3D on the shop floor, dealer tools, packaging systems. The same job as the startup work: a person has to finish something hard, and the interface is how they do it.",
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

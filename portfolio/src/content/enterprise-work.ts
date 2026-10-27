export type EnterpriseHighlight = {
  client: string;
  title: string;
  description: string;
  href: string;
  image: { src: string; alt: string };
  logos: { src: string; alt: string }[];
};

export const enterpriseWork = {
  headline: "Fortune 500 experience.",
  subheadline: "Shipped at startup speed.",
  body: [
    "Before DUDESIGN, I led design at XIX3D — product design, HMI, and brand systems for global automotive and consumer tech clients.",
    "Audi, Samsung, 3M, Ford, Sony + Honda (Afeela), and Costco. I bring that same bar to AI-native product work.",
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
  /** Costco + IAA stay on /work only — not promoted on the homepage grid. */
  secondaryHighlights: [] as EnterpriseHighlight[],
};

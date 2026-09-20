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
  highlights: [
    {
      client: "Ford",
      title: "First OEM-aftermarket program",
      description:
        "Product and visual design for Ford's aftermarket digital experience — OEM-grade quality with partner velocity.",
      href: "/work/ford",
      image: { src: "/work/cases/ford.webp", alt: "Ford aftermarket digital experience" },
      logos: [{ src: "/work/logos/ford.svg", alt: "Ford" }],
    },
    {
      client: "Afeela",
      title: "EV personalization platform",
      description:
        "Sony + Honda venture — HMI and personalization surfaces for next-generation electric mobility.",
      href: "/work/afeela",
      image: { src: "/work/cases/afeela.webp", alt: "Afeela EV personalization interface" },
      logos: [
        { src: "/work/logos/sony.svg", alt: "Sony" },
        { src: "/work/logos/honda.svg", alt: "Honda" },
      ],
    },
    {
      client: "Costco",
      title: "Retail technology at scale",
      description:
        "Consumer-facing digital touchpoints built for clarity and trust — high volume, no compromise on craft.",
      href: "/work/costco",
      image: { src: "/work/cases/costco.webp", alt: "Costco retail technology experience" },
      logos: [{ src: "/work/logos/costco.svg", alt: "Costco" }],
    },
  ] satisfies EnterpriseHighlight[],
  secondaryHighlights: [
    {
      client: "3M",
      title: "3M Films",
      description: "Automotive film visualization and retail-ready product presentation.",
      href: "/work/3m-films",
      image: { src: "/work/03.webp", alt: "3M automotive film visualization" },
      logos: [{ src: "/work/logos/3m.svg", alt: "3M" }],
    },
    {
      client: "IAA",
      title: "IAA Summit",
      description: "Stage and experiential design for international automotive showcase.",
      href: "/work/iaa",
      image: { src: "/work/cases/iaa-stage.webp", alt: "IAA Summit stage design" },
      logos: [{ src: "/work/logos/audi.svg", alt: "IAA" }],
    },
  ] satisfies EnterpriseHighlight[],
} as const;

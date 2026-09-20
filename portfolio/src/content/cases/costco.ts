import type { CaseStudy } from "../types";

export const costco: CaseStudy = {
  slug: "costco",
  title: "Costco — Retail technology at scale",
  client: "Costco",
  subtitle:
    "A mass-market retail brand needed to look like it belonged next to specialist automotive products.",
  displayTitle: "Branding and packaging for Costco's automotive product line",
  metaLabel: "Retail",
  year: "2024",
  timeline: "2023 – 2025",
  team: "xix3D",
  roleTitle: "Product Designer",
  tags: ["Packaging", "Brand", "Retail"],
  skillsProven: [
    "Packaging and brand systems",
    "Retail craft at volume",
    "Positioning through visual design",
  ],
  role: {
    owned: [
      "Brand identity for Kirkland / True Barrier automotive and technology SKUs",
      "Packaging system across medical-grade and heavy-duty / automotive variants",
      "Shelf presence that competes with specialist brands without abandoning Costco's value read",
    ],
    notOwned: [
      "Product manufacturing and regulatory claims",
      "Retail planogram and warehouse operations",
      "Kirkland Signature master brand governance",
    ],
  },
  decisions: [
    {
      title: "Specialist-grade vs. warehouse-generic",
      chosen:
        "Medical and automotive cues — shield, grade marks, use icons — so the box earns trust next to brands that charge more.",
      rejected:
        "A plain warehouse carton. Value without craft reads as cheap in a category where people buy on trust.",
    },
    {
      title: "One pack vs. a SKU system",
      chosen:
        "A family: medical-grade white/blue and heavy-duty black/blue, same mark, different job. The brand holds as the line expands.",
      rejected:
        "A one-off box. Costco lines don't stay at one SKU, and a single hero pack wouldn't survive the aisle.",
    },
  ],
  collaborators: ["xix3D", "Costco / Kirkland Signature"],
  links: [{ label: "Studio writeup", url: "https://dudesign.us/work/costco" }],
  sections: [
    {
      id: "problem",
      title: "Problem",
      body: [
        "Kirkland Signature is known for value, but in the automotive aftermarket space, value alone doesn't build trust. The challenge was creating brand identity and packaging that positions Kirkland's automotive and technology products as credible competitors to specialist brands — while staying true to the straightforward, no-nonsense identity that Costco customers expect.",
      ],
    },
    {
      id: "process",
      title: "Process",
      body: [
        "I treated packaging as the product interface: grade, count, use, and trust have to read at warehouse distance. Medical and automotive variants share a mark and structure so the line feels like one brand, not a pile of white boxes.",
      ],
    },
    {
      id: "outcome",
      title: "Premium perception at Kirkland value",
      body: [
        "The final brand and packaging system bridges the gap between mass-market retail and the specialist automotive world — giving Kirkland products shelf presence and visual credibility that competes with brands charging significantly more, without losing the brand's identity as an accessible, high-quality option.",
      ],
    },
  ],
  cover: {
    src: "/work/cases/costco/01.webp",
    alt: "True Barrier nitrile glove packaging — medical-grade retail system",
  },
  gallery: [
    {
      id: "packaging",
      title: "Packaging system",
      layout: "full",
      items: [
        {
          id: "medical",
          label: "Medical-grade",
          caption: "Clear count, size, and grade — trust at warehouse distance.",
          src: "/work/cases/costco/03.webp",
          alt: "True Barrier medical nitrile gloves packaging detail",
          variant: "shot",
        },
        {
          id: "heavy-duty",
          label: "Heavy-duty / automotive",
          caption: "Same mark, darker system — food, home, auto, sanitary, painting, vet.",
          src: "/work/cases/costco/04.webp",
          alt: "True Barrier heavy-duty nitrile gloves packaging",
          variant: "shot",
        },
        {
          id: "context",
          label: "In context",
          caption: "Shelf and lab presence without looking like a generic warehouse carton.",
          src: "/work/cases/costco/05.webp",
          alt: "True Barrier packaging in a clinical setting",
          variant: "shot",
        },
      ],
    },
  ],
  logos: [{ src: "/work/logos/costco.svg", alt: "Costco" }],
  published: true,
  order: 7,
};

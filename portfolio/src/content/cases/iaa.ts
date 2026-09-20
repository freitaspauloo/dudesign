import type { CaseStudy } from "../types";

export const iaa: CaseStudy = {
  slug: "iaa",
  title: "IAA Summit",
  client: "Audi, 3M, Samsung",
  subtitle:
    "Three global brands. One stage. The visuals needed to match the caliber of the conversation.",
  displayTitle: "CGI and visual identity for a landmark automotive summit",
  metaLabel: "CGI / Event",
  year: "2024",
  timeline: "2023 – 2025",
  team: "xix3D",
  roleTitle: "Product Designer",
  tags: ["CGI", "Event", "Automotive"],
  skillsProven: [
    "CGI and motion for live events",
    "Multi-brand visual systems",
    "Presentation and stage craft",
  ],
  role: {
    owned: [
      "Summit CGI — vehicle concepts, lighting, and material treatments",
      "Keynote stage graphics and speaker-environment stills",
      "Broadcast-quality presentation and promotional renders across Audi, Samsung, and 3M",
    ],
    notOwned: [
      "Event production and staging logistics",
      "Keynote content and speaker lineup",
      "Brand legal approvals at each corporation",
    ],
  },
  decisions: [
    {
      title: "One visual language vs. three brand kits",
      chosen:
        "A shared cinematic CGI system so the stage felt like one event — not a stitch of three corporate templates.",
      rejected:
        "Slides in each brand's deck template. It would have read as a panel, not a summit.",
    },
    {
      title: "Industry-caliber CGI vs. aftermarket gloss",
      chosen:
        "Quiet lighting, material close-ups, and silhouette beats that treat vehicle customization as OEM conversation.",
      rejected:
        "Loud wrap-shop hero shots. The room was Audi, Samsung, and 3M — the pictures had to hold that weight.",
    },
  ],
  collaborators: ["xix3D", "Audi", "3M", "Samsung"],
  links: [
    { label: "Studio writeup", url: "https://dudesign.us/work/audi3msamsung" },
  ],
  sections: [
    {
      id: "problem",
      title: "Problem",
      body: [
        "When Audi, Samsung, and 3M came together for a high-profile automotive summit on the future of vehicle customization technology, every visual touchpoint had to reflect the weight of the brands on stage. The challenge was producing CGI, motion graphics, and event materials that felt unified across three distinct corporate identities — while positioning vehicle customization as a serious, industry-level conversation rather than a niche aftermarket topic.",
      ],
    },
    {
      id: "process",
      title: "Process",
      body: [
        "I built a CGI language for the room: lineup, silhouette, material, interior, lamp — then dropped those stills onto the keynote wall so the conversation and the picture were the same object.",
      ],
    },
    {
      id: "outcome",
      title: "Setting the visual standard for the industry",
      body: [
        "Delivered a complete visual system for the summit: keynote stage graphics, speaker introduction cards, promotional CGI renders, animated brand sequences, and presentation materials — all produced to broadcast quality. The work helped frame the event as a defining moment for the intersection of automotive OEMs, material science, and consumer technology.",
        "Designed at xix3D.",
      ],
    },
  ],
  cover: {
    src: "/work/cases/iaa/02.webp",
    alt: "IAA summit keynote stage with CGI vehicle backdrop",
  },
  gallery: [
    {
      id: "stage",
      title: "On stage",
      layout: "full",
      items: [
        {
          id: "lineup",
          label: "Concept lineup",
          caption: "The open: a vehicle family in glass, not a product grid.",
          src: "/work/cases/iaa/01.webp",
          alt: "CGI vehicle lineup for the automotive summit",
          variant: "shot",
        },
      ],
    },
    {
      id: "cgi",
      title: "CGI system",
      layout: "full",
      items: [
        {
          id: "silhouette",
          label: "Silhouette",
          caption: "Red-room beat — customization as cinema, not catalog.",
          src: "/work/cases/iaa/03.webp",
          alt: "CGI vehicle silhouette on red lighting",
          variant: "shot",
        },
        {
          id: "wheel",
          label: "Material study",
          caption: "Wheel and body close-up — the film and the metal had to feel OEM.",
          src: "/work/cases/iaa/04.webp",
          alt: "CGI close-up of vehicle wheel and body side",
          variant: "shot",
        },
        {
          id: "profile",
          label: "Profile",
          caption: "Quiet lighting, full side — a concept that can sit behind executives.",
          src: "/work/cases/iaa/05.webp",
          alt: "CGI side profile of a concept vehicle",
          variant: "shot",
        },
        {
          id: "nose",
          label: "Front graphic",
          caption: "Lamp and body highlight for motion and keynote stills.",
          src: "/work/cases/iaa/06.webp",
          alt: "CGI close-up of vehicle front lighting",
          variant: "shot",
        },
        {
          id: "interior",
          label: "Interior",
          caption: "Cabin light lines — the conversation wasn't only wraps on the outside.",
          src: "/work/cases/iaa/07.webp",
          alt: "CGI vehicle interior with ambient lighting",
          variant: "shot",
        },
        {
          id: "tail",
          label: "Rear lamp",
          caption: "Tail graphic for sequences and speaker cards.",
          src: "/work/cases/iaa/08.webp",
          alt: "CGI close-up of vehicle rear lamp",
          variant: "shot",
        },
      ],
    },
  ],
  logos: [
    { src: "/work/logos/audi.svg", alt: "Audi" },
    { src: "/work/logos/3m.svg", alt: "3M" },
    { src: "/work/logos/samsung.svg", alt: "Samsung" },
  ],
  published: true,
  order: 9,
};

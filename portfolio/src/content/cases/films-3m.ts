import type { CaseStudy } from "../types";

export const films3m: CaseStudy = {
  slug: "3m-films",
  title: "3M Films — Automotive retail technology",
  client: "3M",
  subtitle:
    "How do you put a real-time vehicle customization tool into thousands of dealerships — and make it sell?",
  displayTitle: "3D software product design for the showroom floor",
  metaLabel: "Automotive retail",
  year: "2024",
  timeline: "2023 – 2025",
  team: "xix3D",
  roleTitle: "Product Designer",
  tags: ["Retail tech", "Kiosk", "3D"],
  skillsProven: [
    "Product UX for hardware + software",
    "Dealer and sales enablement systems",
    "Brand and go-to-market as one system",
  ],
  role: {
    owned: [
      "Zeno kiosk UI — 3D wrap visualization on shop-floor hardware",
      "Dealer portal and sales training academy",
      "Companion mobile: tutorials, best practices, and login into the kiosk stack",
      "Rollout system: decks, maps, email, and collateral under one 3M × Zeno identity",
    ],
    notOwned: [
      "Kiosk hardware manufacturing",
      "3M film chemistry and product SKUs",
      "Dealer franchise contracts",
    ],
  },
  decisions: [
    {
      title: "A kiosk vs. a retail system",
      chosen:
        "Hardware, dealer portal, academy, and GTM as one product — so shops can visualize, train, and close on the same brand.",
      rejected:
        "A standalone wrap visualizer. Without training and dealer tools, the kiosk becomes a demo that doesn't sell film.",
    },
    {
      title: "Shop-floor craft vs. generic digital signage",
      chosen:
        "Premium, 3M-red cinematic UI that makes vinyl feel expensive on the hardware that actually sits in the bay.",
      rejected:
        "A white enterprise dashboard on a tablet arm. It wouldn't survive next to real cars and real film rolls.",
    },
  ],
  collaborators: ["xix3D", "3M Films"],
  links: [{ label: "Studio writeup", url: "https://dudesign.us/work/3m-films" }],
  sections: [
    {
      id: "problem",
      title: "Problem",
      body: [
        "3M needed more than a kiosk. They needed a complete retail experience that would let shop owners visualize wraps in 3D, train their teams on new products, and close bigger jobs on the spot. The challenge was designing a system that worked across every touchpoint — from the physical kiosk hardware to the dealer portal, sales training academy, and go-to-market materials — all under one cohesive brand experience built from scratch.",
      ],
    },
    {
      id: "process",
      title: "Process",
      body: [
        "I designed Zeno as the flagship retail product: kiosk visualization first, then the dealer portal and academy so the same shops could learn new films and run the hardware.",
        "Go-to-market — decks, dealer maps, fleet CGI — used the same identity so rollout didn't look like a different company from the tool on the floor.",
      ],
    },
    {
      id: "outcome",
      title: "From screen to showroom floor",
      body: [
        "The Zeno platform became 3M's flagship retail technology product, deployed across dealerships with a full ecosystem of branding, UI/UX, presentation decks, email campaigns, video content, social media assets, and printed collateral supporting its rollout. Every piece was designed to do the same thing: make vinyl customization feel premium, approachable, and profitable for the shops installing it.",
        "Designed at xix3D.",
      ],
    },
  ],
  cover: {
    src: "/work/cases/3m-films/01.webp",
    alt: "3M Zeno kiosk — 3D wrap visualizer on shop-floor hardware",
  },
  gallery: [
    {
      id: "product",
      title: "Product surfaces",
      layout: "full",
      items: [
        {
          id: "marketing",
          label: "Zeno site",
          caption: "The kiosk needed a public face — 'your new differentiator' for shops considering the hardware.",
          src: "/work/cases/3m-films/02.webp",
          alt: "3M Zeno marketing site on a laptop",
          variant: "shot",
        },
        {
          id: "academy",
          label: "Dealer portal / sales academy",
          caption: "Training modules, new-product drops, and shop tools in the same portal as the kiosk.",
          src: "/work/cases/3m-films/03.webp",
          alt: "3M dealer portal sales training resources",
          variant: "shot",
        },
        {
          id: "mobile",
          label: "Companion mobile",
          caption: "Getting started, kiosk, tutorials, training — login into the same stack off the floor.",
          src: "/work/cases/3m-films/08.webp",
          alt: "3M Zeno mobile companion app",
          variant: "shot",
        },
      ],
    },
    {
      id: "floor",
      title: "On the floor",
      layout: "full",
      items: [
        {
          id: "hardware",
          label: "Kiosk hardware",
          caption: "Two Zeno units — the software had to look like it belonged on this object.",
          src: "/work/cases/3m-films/06.webp",
          alt: "3M Zeno kiosk hardware pair",
          variant: "shot",
        },
        {
          id: "cgi-gt3",
          label: "Film visualization",
          caption: "CGI that sells the film, not just the UI — Porsche GT3 RS in the bay.",
          src: "/work/cases/3m-films/04.webp",
          alt: "3M automotive film visualization on a Porsche GT3 RS",
          variant: "shot",
        },
        {
          id: "fleet",
          label: "Fleet wrap",
          caption: "Science. Applied to Life. — commercial wrap as a sales proof, not a stock photo.",
          src: "/work/cases/3m-films/05.webp",
          alt: "3M branded fleet van wrap visualization",
          variant: "shot",
        },
      ],
    },
    {
      id: "rollout",
      title: "Rollout",
      layout: "full",
      items: [
        {
          id: "decks",
          label: "Go-to-market decks",
          caption: "PWF, 2080, swatches, shop counts — one visual system for internal and dealer sell-in.",
          src: "/work/cases/3m-films/07.webp",
          alt: "3M Zeno go-to-market presentation suite",
          variant: "shot",
        },
        {
          id: "map",
          label: "Dealer map",
          caption: "700 Pro Shops, 850 kiosks — the rollout was a network, not a pilot.",
          src: "/work/cases/3m-films/09.webp",
          alt: "Map of 3M Pro Shops and Zeno kiosk deployments",
          variant: "shot",
        },
        {
          id: "enablement",
          label: "Sales enablement",
          caption: "Visibility into dealer growth so 3M, trainers, and reps could actually run the program.",
          src: "/work/cases/3m-films/10.webp",
          alt: "3M Zeno sales enablement slide on dealer growth",
          variant: "shot",
        },
      ],
    },
  ],
  logos: [{ src: "/work/logos/3m.svg", alt: "3M" }],
  published: true,
  order: 8,
};

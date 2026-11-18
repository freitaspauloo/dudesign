export type Slide =
  | { id: string; kind: "title"; brand: string }
  | { id: string; kind: "claim"; category: string; lines: string[] }
  | {
      id: string;
      kind: "about";
      headline: string;
      body: string[];
      work: string;
    }
  | {
      id: string;
      kind: "stack";
      label: string;
      headline: string;
      layers: { name: string; detail: string }[];
    }
  | {
      id: string;
      kind: "process";
      label: string;
      headline: string;
      phases: { when: string; title: string; detail: string }[];
    }
  | {
      id: string;
      kind: "upside";
      label: string;
      headline: string;
      rows: { buy: string; cost: string; us: string }[];
    }
  | {
      id: string;
      kind: "tiers";
      label: string;
      headline: string;
      tiers: {
        name: string;
        tag?: string;
        blurb: string;
        price: string;
        duration: string;
        includes: string[];
        bestFor: string;
        note?: string;
        save?: string;
      }[];
    }
  | {
      id: string;
      kind: "faq";
      label: string;
      headline: string;
      items: { q: string; a: string }[];
    }
  | {
      id: string;
      kind: "featured";
      label: string;
      title: string;
      logos: { src: string; alt: string }[];
      lead: string;
      leadEm: string;
      body: string;
      tags: string[];
      meta: { label: string; value: string }[];
      images: { src: string; alt: string }[];
    }
  | {
      id: string;
      kind: "workgrid";
      label: string;
      headline: string;
      items: {
        title: string;
        detail: string;
        image: string;
        logos: { src: string; alt: string }[];
      }[];
    }
  | {
      id: string;
      kind: "included";
      label: string;
      headline: string;
      items: { title: string; detail: string }[];
    }
  | {
      id: string;
      kind: "payment";
      label: string;
      headline: string;
      body: string;
      note: string;
      plans: {
        name: string;
        blurb: string;
        price: string;
        duration: string;
        tag?: string;
        save?: string;
        schedule: { pct: string; when: string; amount: string }[];
        foot: string;
      }[];
    }
  | {
      id: string;
      kind: "bonuses";
      label: string;
      headline: string;
      body: string;
      plans: {
        name: string;
        blurb: string;
        count: string;
        tag?: string;
        items: { title: string; detail?: string }[];
      }[];
    }
  | {
      id: string;
      kind: "cta";
      headline: string;
      email: string;
      web: string;
    };

/** Live deck content. The two-week sprint, then monthly. */
export const slides: Slide[] = [
  {
    id: "title",
    kind: "title",
    brand: "DUDESIGN",
  },
  {
    id: "claim",
    kind: "claim",
    category: "",
    lines: [
      "Product sprints design",
      "for AI startups.",
    ],
  },
  {
    id: "about",
    kind: "about",
    headline: "Two weeks.\nOne surface.",
    body: [
      "DUDESIGN runs product sprints for AI startups. We design the one surface that has to be obvious, and ship it in the product. $4,500. One sprint at a time.",
      "We've shipped for Audi, Samsung, 3M, Ford, Sony + Honda, and Costco. That same standard now goes into one surface, for two weeks.",
    ],
    work: "/work/tiles.png",
  },
  {
    id: "featured",
    kind: "featured",
    label: "Featured Work",
    title: "Aligned AI",
    logos: [{ src: "/work/logos/aligned.svg", alt: "Aligned AI" }],
    lead: "We designed a personal AI workspace where trust, clarity, and benchmark content ship together — ",
    leadEm: "not as a deck, but as product.",
    body: "The engagement covered workspace UX, AI trust patterns, and benchmark docs — prototyped in code so PM and Eng could react to real interaction, not static mocks.",
    tags: [
      "AI Workspace",
      "Trust UX",
      "Product Design",
      "Shipped in Code",
      "B2B SaaS",
    ],
    meta: [
      { label: "Client", value: "Aligned" },
      { label: "Scope", value: "Workspace UX + benchmark content" },
      { label: "Proof", value: "paulofreitas.design/work/aligned-ai" },
    ],
    images: [
      { src: "/work/cases/aligned.png", alt: "Aligned AI workspace" },
      { src: "/work/cases/frameline.png", alt: "Frameline surfaces" },
    ],
  },
  {
    id: "workgrid",
    kind: "workgrid",
    label: "A track record, not a portfolio.",
    headline: "More work",
    items: [
      {
        title: "Aligned AI",
        detail: "Personal AI Workspace · Trust UX",
        image: "/work/cases/aligned.png",
        logos: [{ src: "/work/logos/aligned.svg", alt: "Aligned AI" }],
      },
      {
        title: "Frameline",
        detail: "Shippable Design Surfaces",
        image: "/work/cases/frameline.png",
        logos: [{ src: "/work/logos/frameline.png", alt: "Frameline" }],
      },
      {
        title: "BuiltOps",
        detail: "Losani Community Platform · Enterprise B2B",
        image: "/work/cases/ford.png",
        logos: [{ src: "/work/logos/ford.svg", alt: "BuiltOps" }],
      },
    ],
  },
  {
    id: "stack",
    kind: "stack",
    label: "What you get",
    headline: "Product. Design. Implementation.",
    layers: [
      {
        name: "Product",
        detail: "Day 1: the surface in one sentence, what we will not touch, and what done means",
      },
      {
        name: "Design",
        detail: "The flow, including the AI moment, then a clickable prototype",
      },
      {
        name: "Implementation",
        detail: "Production UI in your code, on staging by the last day",
      },
    ],
  },
  {
    id: "process",
    kind: "process",
    label: "The sprint",
    headline: "One surface in two weeks.",
    phases: [
      {
        when: "Week 1",
        title: "Questions, then the flow",
        detail:
          "Questions on day 1. Then the flow, with 2 or 3 options, then a clickable prototype. Every day, a 10-minute check-in.",
      },
      {
        when: "Week 2",
        title: "In the product",
        detail:
          "Production UI in your code. Then staging, a recorded walkthrough, and a handoff note.",
      },
      {
        when: "After",
        title: "From $4,000 a month",
        detail:
          "A 3-month minimum. Continue within two weeks and the sprint fee is credited to the first month.",
      },
    ],
  },
  {
    id: "included",
    kind: "included",
    label: "What you leave with",
    headline: "What you leave with.",
    items: [
      {
        title: "The bet, in one page",
        detail: "The surface in one sentence, what we will not touch, and what done means.",
      },
      {
        title: "The flow, including the AI moment",
        detail: "What the user sees while the model is working, what happens when it is wrong, and how they steer it.",
      },
      {
        title: "The interface",
        detail: "A clickable prototype in your visual language, then the production UI.",
      },
      {
        title: "Type, color, and components",
        detail: "For that surface, so your team can extend it.",
      },
      {
        title: "Production UI in your codebase",
        detail: "In your repo. If the repo is not ready, a coded prototype on your stack.",
      },
      {
        title: "A recorded walkthrough",
        detail: "On the last day, with a short handoff note. A case study only after you review it.",
      },
    ],
  },
  {
    id: "upside",
    kind: "upside",
    label: "The upside",
    headline: "Compared to the usual options.",
    rows: [
      {
        buy: "Design agency",
        cost: "Project fee",
        us: "The surface ships in the product, in two weeks.",
      },
      {
        buy: "Full-time hire",
        cost: "$150k to $220k a year",
        us: "Senior the whole way, for $4,500.",
      },
      {
        buy: "Software house",
        cost: "$40k to $80k",
        us: "Product design first, then the UI in your code.",
      },
    ],
  },
  {
    id: "tiers",
    kind: "tiers",
    label: "Engagement",
    headline: "The sprint, then monthly.",
    tiers: [
      {
        name: "Sprint",
        tag: "Now",
        blurb: "A founding price while we build the next set of case studies.",
        price: "$4,500",
        duration: "Two weeks. One sprint at a time.",
        includes: [
          "Questions on day 1, then the flow",
          "A clickable prototype, then production UI",
          "Staging, a recorded walkthrough, and a handoff note",
          "A 10-minute check-in every day",
        ],
        bestFor: "A team that needs one surface to be obvious.",
        note: "Not included: the rest of the app, brand identity, a marketing site, auth, APIs, or infrastructure. Backend work is quoted separately with an engineering partner.",
      },
      {
        name: "Monthly",
        blurb: "Stay on after the sprint.",
        price: "From $4,000",
        duration: "3-month minimum. Billed monthly.",
        includes: [
          "A seat in the weekly product meeting",
          "One design cycle a week, in your code",
          "The sprint fee credited if you continue within two weeks",
        ],
        bestFor: "A team that wants the work to continue.",
      },
    ],
  },
  {
    id: "payment",
    kind: "payment",
    label: "Payment",
    headline: "Half to book. Half at the end.",
    body: "The sprint is $4,500. Half holds the slot. The rest is due when the two weeks end.",
    note: "USD, by wire or ACH. IP transfers to you on the final payment.",
    plans: [
      {
        name: "Sprint",
        blurb: "Two weeks. One surface.",
        price: "$4,500",
        duration: "One sprint at a time.",
        schedule: [
          { pct: "Half", when: "To hold the slot", amount: "$2,250" },
          { pct: "Half", when: "At the end", amount: "$2,250" },
        ],
        foot: "A 30-minute fit call and a one-page intake come first.",
      },
      {
        name: "Monthly",
        blurb: "After the sprint.",
        price: "From $4,000",
        duration: "3-month minimum.",
        schedule: [
          { pct: "Each month", when: "Same date", amount: "From $4,000" },
          {
            pct: "First month",
            when: "If you continue within two weeks",
            amount: "Sprint fee credited",
          },
        ],
        foot: "Billed monthly. 3-month minimum.",
      },
    ],
  },
  {
    id: "faq",
    kind: "faq",
    label: "Common questions",
    headline: "Before you ask.",
    items: [
      {
        q: "Do you replace our engineers?",
        a: "No. We own product, design, and the interface. Backend, auth, APIs, and infrastructure are quoted separately with an engineering partner.",
      },
      {
        q: "Do I own the work?",
        a: "Yes. IP transfers to you on the final payment. We may publish a case study only after you review it.",
      },
      {
        q: "What happens after the two weeks?",
        a: "We can stay on from $4,000 a month, with a 3-month minimum. Continue within two weeks and the sprint fee is credited to the first month.",
      },
      {
        q: "Can you work with our existing system?",
        a: "Yes. We work in what you already have. If the interface is not at the level the product needs, we raise it. We do not keep a weak interface just because it exists.",
      },
    ],
  },
  {
    id: "cta",
    kind: "cta",
    headline: "Book the sprint.",
    email: "hello@dudesign.us",
    web: "studio.dudesign.us",
  },
];

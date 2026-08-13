export type Slide =
  | { id: string; kind: "title"; brand: string }
  | { id: string; kind: "claim"; category: string; line: string }
  | {
      id: string;
      kind: "about";
      headline: string;
      body: string[];
      work: string[];
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
      kind: "method";
      label: string;
      steps: string[];
      body: string;
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
      kind: "cta";
      headline: string;
      email: string;
      web: string;
    };

/** Live deck content — partner offer only. */
export const slides: Slide[] = [
  {
    id: "title",
    kind: "title",
    brand: "DUDESIGN",
  },
  {
    id: "claim",
    kind: "claim",
    category: "Product design partner for AI startups.",
    line: "We decide what to build, design it, and we implement the interface.",
  },
  {
    id: "about",
    kind: "about",
    headline: "Fortune 500 craft.\nStartup speed.",
    body: [
      "DUDESIGN is an independent product design partner for AI startups, founded by Paulo Freitas. Product judgment, UX/UI, and production interface — one engagement.",
      "We've shipped for Audi, Samsung, 3M, Ford, Sony + Honda, and Costco. That same standard now serves Series A–B teams that need to move without lowering the bar.",
    ],
    work: ["01", "02", "03", "04", "05", "06", "07", "08", "09"],
  },
  {
    id: "stack",
    kind: "stack",
    label: "What you get",
    headline: "Product. Design. Ship.",
    layers: [
      {
        name: "Product",
        detail: "Clarify the bet — discovery, priorities, and what success looks like",
      },
      {
        name: "Design",
        detail: "Flows, UX/UI, system, and a hi-fi prototype ready to build from",
      },
      {
        name: "Ship",
        detail: "Production UI in code — components and pages your team can extend",
      },
    ],
  },
  {
    id: "method",
    kind: "method",
    label: "The Method",
    steps: [
      "Research first.",
      "Strategy second.",
      "Design third.",
      "Ship the interface.",
    ],
    body: "We start with the problem, not the pixels — and finish with production UI in the product, not a file left behind in Figma.",
  },
  {
    id: "process",
    kind: "process",
    label: "The Process",
    headline: "Ship in 6 weeks.",
    phases: [
      {
        when: "Weeks 1–2",
        title: "Discover",
        detail: "Product bets, information architecture, and key flows locked",
      },
      {
        when: "Weeks 3–5",
        title: "Design + build",
        detail: "System, hi-fi, and production UI built in parallel",
      },
      {
        when: "Week 6",
        title: "Deliver",
        detail: "Polish, validate, and hand over a frontend package",
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
        buy: "Design agency (handoff)",
        cost: "$20–40k",
        us: "Same craft — plus the interface shipped in code",
      },
      {
        buy: "Full-time design engineer",
        cost: "$150–220k + equity",
        us: "Senior partner capacity without a full-time seat",
      },
      {
        buy: "Software house MVP",
        cost: "$40–80k+",
        us: "Product taste first — not a build-by-the-hour shop",
      },
    ],
  },
  {
    id: "tiers",
    kind: "tiers",
    label: "Engagement",
    headline: "Two ways to work together.",
    tiers: [
      {
        name: "Ship",
        blurb: "A defined surface — designed and shipped",
        price: "$18,000",
        duration: "6 weeks",
        includes: [
          "Product decisions and design system",
          "Hi-fi prototype and production UI",
          "Two structured revision rounds",
          "Weekly updates and dedicated channel",
          "Production UI package in code",
          "Decisions log and stakeholder walkthrough",
          "Case study with your approval",
        ],
        bestFor:
          "Founders and VP Product who need one surface designed and live.",
        note: "Backend, auth, and infra available as an eng-partner add-on.",
      },
      {
        name: "Partner",
        tag: "Recommended",
        blurb: "Embedded product design partnership",
        price: "$32,000 → $7,500/mo",
        duration: "8-week build, then monthly",
        includes: [
          "Everything in Ship",
          "Usability testing",
          "System docs and team training",
          "Ongoing product and UI shipping",
          "Monthly cadence and reviews",
          "Knowledge transfer and priority scheduling",
          "Quarterly design audit",
        ],
        bestFor:
          "Series A–B teams that need a partner, not a one-off vendor.",
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
        a: "No. We own product, design, and the shipped interface. If you need backend, we bring trusted eng partners under the same engagement.",
      },
      {
        q: "Do I own the work?",
        a: "Yes. Full IP transfers on final payment — source files and UI code included. DUDESIGN retains portfolio rights only.",
      },
      {
        q: "How does billing work?",
        a: "Ship: 50% at kickoff, 25% mid-engagement, 25% on delivery. Partner: 40% / 30% / 30%, then monthly. Invoices land on fixed dates.",
      },
      {
        q: "Can you work with our existing system?",
        a: "Yes. We extend what you already have — we don't rip and replace for sport.",
      },
    ],
  },
  {
    id: "cta",
    kind: "cta",
    headline: "Let's talk.",
    email: "hello@dudesign.us",
    web: "dudesign.us",
  },
];

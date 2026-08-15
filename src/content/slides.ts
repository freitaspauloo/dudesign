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

/** Live deck content. Partner offer only. */
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
      "Product design partner",
      "for AI startups.",
    ],
  },
  {
    id: "about",
    kind: "about",
    headline: "Fortune 500 craft.\nStartup speed.",
    body: [
      "DUDESIGN is an independent product design partner for AI startups, founded by Paulo Freitas. Product judgment, UX/UI, and interface implementation. One engagement.",
      "We've shipped for Audi, Samsung, 3M, Ford, Sony + Honda, and Costco. That same standard now serves Series A–B teams that need to move without lowering the bar.",
    ],
    work: "/work/tiles.png",
  },
  {
    id: "featured",
    kind: "featured",
    label: "Featured Work",
    title: "IAA Mobility 2025",
    logos: [
      { src: "/work/logos/audi.svg", alt: "Audi" },
      { src: "/work/logos/3m.svg", alt: "3M" },
      { src: "/work/logos/samsung.svg", alt: "Samsung" },
    ],
    lead: "A full CGI and UX/UI production for the IAA Mobility 2025 debut in Munich, ",
    leadEm: "the world's largest mobility event.",
    body: "The work brought a new vehicle concept to life alongside the interface experience that would sit inside it, built end-to-end for the stage.",
    tags: [
      "CGI Production",
      "Product Design",
      "UX/UI",
      "Creative Direction",
      "Vehicle Visualization",
    ],
    meta: [
      { label: "Clients", value: "Audi, Samsung, 3M" },
      { label: "Event", value: "IAA Mobility, Munich" },
      { label: "Date", value: "November 2025" },
    ],
    images: [
      { src: "/work/cases/iaa-car.png", alt: "IAA Mobility concept vehicle" },
      { src: "/work/cases/iaa-stage.png", alt: "IAA Mobility 2025 stage" },
    ],
  },
  {
    id: "workgrid",
    kind: "workgrid",
    label: "A track record, not a portfolio.",
    headline: "More work",
    items: [
      {
        title: "Ford",
        detail: "First OEM-Aftermarket Program",
        image: "/work/cases/ford.png",
        logos: [{ src: "/work/logos/ford.svg", alt: "Ford" }],
      },
      {
        title: "Frameline",
        detail: "Shippable Design Surfaces",
        image: "/work/cases/frameline.png",
        logos: [{ src: "/work/logos/frameline.png", alt: "Frameline" }],
      },
      {
        title: "Aligned AI",
        detail: "Personal AI Workspace",
        image: "/work/cases/aligned.png",
        logos: [{ src: "/work/logos/aligned.png", alt: "Aligned AI" }],
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
        detail: "Clarify the bet: discovery, priorities, and what success looks like",
      },
      {
        name: "Design",
        detail: "Flows, UX/UI, system, and a hi-fi prototype ready to build from",
      },
      {
        name: "Implementation",
        detail: "Production UI in code: components and pages your team can extend",
      },
    ],
  },
  {
    id: "method",
    kind: "method",
    label: "The Method",
    steps: [
      "Strategy.",
      "Design.",
      "Implementation.",
    ],
    body: "We start with the problem, not the pixels, and finish with production UI in the product, not a file left behind in Figma.",
  },
  {
    id: "process",
    kind: "process",
    label: "The Process",
    headline: "Implemented in 8 weeks.",
    phases: [
      {
        when: "Weeks 1–2",
        title: "Discover",
        detail: "Product bets, architecture, and key flows locked",
      },
      {
        when: "Weeks 3–7",
        title: "Design + build",
        detail: "System, hi-fi, and production UI built in parallel",
      },
      {
        when: "Week 8",
        title: "Deliver",
        detail: "Polish, validate, and hand over a frontend package",
      },
    ],
  },
  {
    id: "included",
    kind: "included",
    label: "What's Included",
    headline: "Beyond the deliverables:",
    items: [
      {
        title: "Weekly progress updates",
        detail: "Every week, a clear summary of what shipped and what's next. No status meetings.",
      },
      {
        title: "Dedicated comms channel",
        detail: "Slack, email, or whatever you use. Direct line to the company.",
      },
      {
        title: "Design system documentation",
        detail: "Everything your team needs to extend the work after the engagement ends.",
      },
      {
        title: "Production UI package",
        detail: "Specs, assets, component library, production-ready files. No back-and-forth.",
      },
      {
        title: "Two structured revision rounds",
        detail: "Per deliverable. Clear feedback windows so the timeline holds.",
      },
      {
        title: "Portfolio-grade case study",
        detail: "Published with your approval. Becomes part of your company's design story.",
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
        us: "Same craft, plus the interface shipped in code",
      },
      {
        buy: "Full-time design engineer",
        cost: "$150–220k + equity",
        us: "Senior partner capacity without a full-time seat",
      },
      {
        buy: "Software house MVP",
        cost: "$40–80k+",
        us: "Product taste first. Not a build-by-the-hour shop.",
      },
    ],
  },
  {
    id: "tiers",
    kind: "tiers",
    label: "Engagement",
    headline: "Ways to work together.",
    tiers: [
      {
        name: "Standard",
        blurb: "A defined surface, designed and shipped",
        price: "$21,000",
        duration: "8 weeks. Then it ends.",
        includes: [
          "Product decisions and design system",
          "Hi-fi prototype and production UI",
          "Two structured revision rounds",
          "Weekly updates and dedicated channel",
          "Production UI package in code",
        ],
        bestFor: "A closed box. You pay extra to walk away at week 8.",
        note: "Backend, auth, and infra available via engineering partners. A separate engagement, quoted in addition.",
      },
      {
        name: "Partner",
        blurb: "The seat, with a six-month out",
        price: "$6,000/mo",
        duration: "6-month minimum. $36,000. Then month-to-month.",
        includes: [
          "Same first surface as Standard",
          "Slack as a teammate. 2-day SLA",
          "Usability testing in the build",
          "Ongoing product and UI shipping",
          "No revision cap",
        ],
        bestFor: "You want an out at month 6, and you'll pay for that flexibility.",
      },
      {
        name: "Yearly",
        tag: "Recommended",
        blurb: "The same seat, for the year",
        price: "$5,000/mo",
        duration: "12-month commit. $60,000. Billed monthly.",
        includes: [
          "Same seat as Partner, for the year",
          "Priority scheduling",
          "Quarterly design audit",
          "You're the design function, not a vendor",
          "First surface in about 8 weeks",
        ],
        bestFor:
          "Series A–B teams who already know this isn’t a one-surface problem.",
      },
    ],
  },
  {
    id: "payment",
    kind: "payment",
    label: "Payment Structure",
    headline: "Fair terms. Clear dates.",
    body: "Invoices issued on fixed dates, independent of feedback pace or deliverable status. Payment schedules scale to each engagement.",
    note: "Payment via wire transfer or ACH. Invoices payable within 7 days of receipt. All amounts in USD.",
    plans: [
      {
        name: "Standard",
        blurb: "A defined surface, designed and shipped",
        price: "$21,000",
        duration: "8 weeks",
        schedule: [
          { pct: "1 of 3", when: "At kick-off", amount: "$7,000" },
          { pct: "2 of 3", when: "End of month 1", amount: "$7,000" },
          { pct: "3 of 3", when: "End of month 2", amount: "$7,000" },
        ],
        foot: "Three equal invoices. Then it ends.",
      },
      {
        name: "Partner",
        blurb: "The seat, with a six-month out",
        price: "$6,000/mo",
        duration: "$36,000 minimum",
        schedule: [
          { pct: "Month 1", when: "At kick-off", amount: "$6,000" },
          { pct: "Months 2–6", when: "Same date each month", amount: "$6,000/mo" },
          { pct: "After", when: "Month-to-month", amount: "$6,000/mo" },
        ],
        foot: "Six-month minimum. Then the same rate until they cancel.",
      },
      {
        name: "Yearly",
        tag: "Recommended",
        blurb: "The same seat, for the year",
        price: "$5,000/mo",
        duration: "$60,000 for the year",
        schedule: [
          { pct: "Month 1", when: "At kick-off", amount: "$5,000" },
          { pct: "Months 2–12", when: "Same date each month", amount: "$5,000/mo" },
        ],
        foot: "Billed monthly. No $60,000 invoice. 12-month commit.",
      },
    ],
  },
  {
    id: "bonuses",
    kind: "bonuses",
    label: "Bonuses",
    headline: "What you also get.",
    body: "The work is in the product. These extras help it land with users and with the team.",
    plans: [
      {
        name: "Standard",
        blurb: "A defined surface, designed and shipped",
        count: "+2",
        items: [
          {
            title: "30-day post-ship review",
            detail:
              "One session on the live surface. What to fix, what to leave.",
          },
          {
            title: "Recorded system tour",
            detail:
              "Twenty minutes they can replay for a new hire. Not a live engineering meeting.",
          },
        ],
      },
      {
        name: "Partner",
        blurb: "The seat, with a six-month out",
        count: "+3",
        items: [
          {
            title: "Next-screen working session",
            detail:
              "Build the following slice with their team, in their repo.",
          },
          {
            title: "Internal rollout deck",
            detail:
              "Branded slides for board or all-hands. Ready to present.",
          },
          {
            title: "Co-authored story",
            detail:
              "A case study they can publish. You get the work on record.",
          },
        ],
      },
      {
        name: "Yearly",
        tag: "Recommended",
        blurb: "The same seat, for the year",
        count: "+2",
        items: [
          { title: "Everything in Partner" },
          {
            title: "Priority throughout the year",
            detail: "Scheduling lock. You don’t re-enter the queue in June.",
          },
        ],
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
        a: "No. We own product, design, and interface implementation. If you need backend, we can introduce trusted engineering partners. That's a separate engagement, quoted in addition.",
      },
      {
        q: "Do I own the work?",
        a: "Yes. Full IP transfers on final payment. Source files and UI code included. DUDESIGN retains portfolio rights only.",
      },
      {
        q: "How does billing work?",
        a: "Standard: $7,000 at kickoff, $7,000 at end of month 1, $7,000 at end of month 2. Partner: $6,000 at kickoff, then $6,000 each month, six-month minimum. Yearly: $5,000 at kickoff, then $5,000 each month, 12-month commit. Invoices land on fixed dates.",
      },
      {
        q: "Can you work with our existing system?",
        a: "Yes. We extend what you already have. We don't rip and replace for sport.",
      },
    ],
  },
  {
    id: "cta",
    kind: "cta",
    headline: "Ready when you are.",
    email: "hello@dudesign.us",
    web: "dudesign.us",
  },
];

import type { CaseStudy } from "../types";

export const builtops: CaseStudy = {
  slug: "builtops",
  title: "BuiltOps",
  cardTitle: "Community microsites",
  client: "Losani Homes",
  subtitle:
    "A modular community-microsite platform where editorial teams own content and design owns the system — without either side blocking the other.",
  displayTitle:
    "Community microsites without engineering bottlenecks",
  metaLabel: "Enterprise B2B",
  year: "2025",
  timeline: "2024 – 2025",
  team: "Losani + engineering partners",
  roleTitle: "Product Designer",
  tags: ["Enterprise B2B", "CMS + code", "Multi-stage rollout"],
  skillsProven: [
    "Enterprise product systems",
    "Cross-functional leadership with PM and Eng",
    "Systems thinking and design systems",
    "End-to-end product design",
  ],
  role: {
    owned: [
      "Platform UX for community and model pages",
      "Editorial vs. engineering boundary (Payload CMS vs. layout code)",
      "Stage-aware page templates (Future / Coming Soon / Available Now)",
      "Preview, version archive, and draft workflows",
    ],
    notOwned: [
      "Losani corporate brand governance",
      "Production infrastructure and Vercel team admin",
      "Sales CRM integrations",
    ],
  },
  decisions: [
    {
      title: "Hardcoded pages vs. CMS-owned content",
      chosen:
        "Payload owns copy, images, prices, links, section order, users, and version history. Code owns layout, design, hide-if-empty rules, and stage safety rails.",
      rejected:
        "Fully hardcoded marketing pages — fast initially, but every copy change became an engineering ticket and blocked the marketing team.",
    },
    {
      title: "Single site vs. modular subpages",
      chosen:
        "BuiltOps as a vendored module inside the connected-site repo — community subpages proxied through the portal origin so buyers stay in one experience.",
      rejected:
        "Standalone microsites per community with no shared system. Unmaintainable at scale.",
    },
    {
      title: "Preview fidelity",
      chosen:
        "Draft preview + `/old` version archive with frozen playgrounds so stakeholders can compare iterations without risking production.",
      rejected:
        "Screenshot-based review only. Stakeholders couldn't validate responsive behavior or CMS-driven edge cases.",
    },
  ],
  collaborators: ["Elevow and Losani Homes teams"],
  links: [
    { label: "BuiltOps repo", url: "https://github.com/freitaspauloo/BuiltOps" },
    {
      label: "Connected site PR",
      url: "https://github.com/chriselevow/Losani-Connected-Site-Experience/pull/7",
    },
  ],
  prototype: {
    label: "Open Losani preview deploy",
    url: "https://losani-connected-site-experience-git-dev-elevow-devs.vercel.app",
    embed: false,
  },
  sections: [
    {
      id: "problem",
      title: "Problem",
      body: [
        "Losani needed community-specific web experiences that could launch at different lifecycle stages — future land, coming soon, available now — while marketing teams updated copy and pricing without waiting on engineering for every change.",
        "The product surface spans buyers, sales, and admin workflows. Complexity comes from multi-role needs, not from visual decoration.",
      ],
    },
    {
      id: "process",
      title: "Process",
      body: [
        "I designed BuiltOps as a modular platform: Next.js 16, Tailwind CSS 4, Payload CMS, TypeScript — SQLite locally, Postgres in production.",
        "Templates encode stage logic in code (safety rails) while editorial content stays flexible in the CMS. Empty sections hide automatically so half-finished pages never ship broken.",
        "Deliverables include community pages, model pages, a version archive, preview-version widget catalog, and lot editor tooling — coordinated with the Losani Connected Site integration.",
      ],
    },
    {
      id: "outcome",
      title: "Outcome",
      body: [
        "Working platform integrated into the Losani connected-site repo with PR #7 — preview deploy live, production alias pending admin handoff.",
        "Marketing can iterate copy and media in Payload while design maintains layout integrity and stage rules in code.",
      ],
    },
    {
      id: "reflection",
      title: "What I'd do differently",
      body: [
        "Lock CMS field schemas with design earlier — a few retrofits were needed when marketing wanted section variants we hadn't modeled.",
      ],
    },
  ],
  cover: {
    src: "/work/cases/builtops.svg",
    alt: "BuiltOps community microsite platform — Losani Homes",
    fit: "contain",
  },
  logos: [{ src: "/work/cases/builtops.svg", alt: "BuiltOps" }],
  published: true,
  order: 9,
};

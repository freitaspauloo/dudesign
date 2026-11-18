import type { CaseStudy } from "../types";

const base = "/work/cases/conifer";

export const conifer: CaseStudy = {
  slug: "conifer",
  title: "Conifer",
  cardTitle: "Workspace for coding agents",
  client: "Conifer",
  surfaceLine:
    "Parallax is the product. Claude Code, Codex, and Cursor sit on one ask. The Captain splits the work, review checks it against the ask, and a full plan keeps going when a subscription hits its limit. The site is the page that shows it.",
  subtitle:
    "Parallax, the workspace where Claude Code, Codex, and Cursor run side by side.",
  displayTitle: "Claude Code, Codex, and Cursor, in one place.",
  metaLabel: "Parallax",
  year: "2026",
  timeline: "Sep – Nov 2026",
  team: "Conifer (YC S26)",
  roleTitle: "Product Designer",
  tags: ["Agent UX", "Product", "Built in code"],
  skillsProven: ["Developer-tool UX", "Product narrative", "Interface in code"],
  role: {
    owned: [
      "The product on the page: Captain, review, and the handoff between subscriptions",
      "The homepage that carries it: hero, download, and close",
      "Pixel marks, type, and the page in code",
    ],
    notOwned: [
      "The Parallax app, the Captain, and the review engine",
      "Gateway, billing, and model routing",
      "The live marketing site at conifer.build",
    ],
  },
  decisions: [],
  collaborators: ["Michael Jeffords"],
  links: [
    { label: "Conifer", url: "https://www.conifer.build" },
    { label: "Redesign", url: "https://github.com/freitaspauloo/conifer" },
  ],
  sections: [
    {
      id: "product",
      title: "The product",
      body: [
        "Parallax is the workspace. Claude Code, Codex, and Cursor run side by side on one ask. A Captain gives each agent the piece that suits it and pulls it back when it wanders. Review checks the work against the ask, not just the diff. When a Claude or Codex plan hits its limit, the same task keeps running on the next one.",
        "I designed that product story and built the page that carries it. The panels are the product. The site is how you meet it.",
      ],
    },
    {
      id: "captain",
      title: "Captain",
      body: [
        "One ask becomes a task for each agent that suits it. The example is a billing CSV, webhook drops, and the tests for both. Claude Code, Codex, and Cursor each take a piece.",
        "The same panel then checks every step. When an agent wanders off, the Captain marks it and steers it back. Codex, in the third step, is refactoring invoices instead of stopping the webhook drops.",
      ],
      visualsLayout: "full",
      visuals: [
        {
          id: "captain",
          label: "Splits your ask",
          caption: "One ask, three agents, each one starting on its piece.",
          variant: "shot",
          src: `${base}/product-captain.png`,
          alt: "Captain panel splitting a billing ask across Claude Code, Codex, and Cursor",
        },
        {
          id: "captain-drift",
          label: "Pulls them back",
          caption: "Codex has drifted off the ask. The Captain is steering it back.",
          variant: "shot",
          src: `${base}/product-drift.png`,
          alt: "Captain panel with Codex marked off the ask while the other agents stay on it",
        },
      ],
    },
    {
      id: "review",
      title: "Review",
      body: [
        "The page cites Martian's open Code Review Benchmark: 2.24 merge-blocking comments per pull request, ahead of the other tools on the chart.",
        "Beside the chart, one finding. A review bot says the grouping looks clean. Parallax says the ask was one row per invoice, and this change groups three invoices for one customer into a single row. A test with that case fails on the change.",
      ],
      visualsLayout: "full",
      visuals: [
        {
          id: "review",
          label: "Code review",
          caption: "The benchmark, and one finding checked against the ask.",
          variant: "shot",
          src: `${base}/product-review.png`,
          alt: "Parallax code review with a benchmark chart and a finding on billing export",
        },
      ],
    },
    {
      id: "subscriptions",
      title: "Subscriptions",
      body: [
        "Several Claude and Codex plans connect at once. In the still, two Claude Max plans have hit the weekly limit. The billing export keeps running on a third plan.",
      ],
      visualsLayout: "full",
      visuals: [
        {
          id: "plans",
          label: "Handoff",
          caption: "Two plans at the limit. The task is still running on the third.",
          variant: "shot",
          src: `${base}/product-plans.png`,
          alt: "Three Claude subscription cards, two at the weekly limit and one still running the billing export",
        },
      ],
    },
    {
      id: "site",
      title: "The site",
      body: [
        "Michael's brief started as a homepage: keep the ASCII, fix the buttons, and make the value obvious in five seconds. The page at the time buried the install. The product moved while that page was in progress, so the page became the way into Parallax.",
        "It opens on the product. All your agents, one place, then the download. The close repeats the offer on the banner: $50 of Conifer credit and 5 free reviews with a GitHub signup. The Mac build is notarized. Linux is on the same release.",
        "I designed and built that page in code. It is the current design in the Conifer workspace. conifer.build carries Conifer's own marketing site.",
      ],
      visualsLayout: "full",
      visuals: [
        {
          id: "hero",
          label: "Hero",
          caption: "All your agents. One place. Download for Mac, or read the docs.",
          variant: "shot",
          src: `${base}/hero.png`,
          alt: "Conifer homepage hero, All your agents, one place, above a pixel bonsai",
        },
        {
          id: "close",
          label: "Close",
          caption: "Free to start. Download for Mac, or read the docs.",
          variant: "shot",
          src: `${base}/close.png`,
          alt: "Orange closing card with a pixel pinecone and the line Free to start",
        },
      ],
    },
  ],
  cover: {
    src: `${base}/product-captain.png`,
    alt: "Parallax Captain, one ask split across Claude Code, Codex, and Cursor",
    fit: "contain",
  },
  logos: [{ src: "/work/logos/conifer.svg", alt: "Conifer" }],
  published: true,
  order: 1,
};

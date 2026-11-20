import type { CaseStudy } from "../types";

const base = "/work/cases/conifer";

export const conifer: CaseStudy = {
  slug: "conifer",
  title: "Conifer",
  cardTitle: "Workspace for coding agents",
  client: "Conifer",
  surfaceLine:
    "The product is the chat. You send a message, Conifer picks the cheapest model that can clear it, and the reply shows which model ran, where, and what it cost.",
  subtitle:
    "A chat that routes each message to the cheapest model that can clear it.",
  displayTitle: "Message Conifer. It picks the model.",
  metaLabel: "Chat",
  year: "2026",
  timeline: "Sep – Nov 2026",
  team: "Conifer (YC S26)",
  roleTitle: "Product Designer",
  tags: ["Agent UX", "Product", "Built in code"],
  skillsProven: ["Developer-tool UX", "Product narrative", "Interface in code"],
  role: {
    owned: [
      "The chat: thread, composer, history, and the route on each reply",
      "The page around it: Captain, review, limits, and the close",
      "Pixel marks, type, and the interface in code",
    ],
    notOwned: [
      "The models, the gateway, and the routing engine",
      "Billing and accounts",
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
      title: "The chat",
      body: [
        "The product is a chat. History sits on the left. The thread is the work. The composer stays at the bottom, with the model set to the most efficient one that clears the message.",
        "This reply is a refactor of the auth middleware. Conifer sent it to Kimi K3 on Together, at $0.0005, 140 tokens a second. You read the code there, copy it, or ask for another pass.",
      ],
    },
    {
      id: "route",
      title: "The route",
      body: [
        "Open the receipt and the choice is on the page. Model, provider, cache, and tokens. This one read the repo from cache: 13 tokens in, 194 out.",
        "A multi-file code edit, so Kimi K3 was the cheapest model that could clear it. $0.0025 under Claude Sonnet 5.",
      ],
      visualsLayout: "full",
      visuals: [
        {
          id: "route-detail",
          label: "Why this model",
          caption: "Kimi K3 on Together. Cache read. $0.0025 under Claude Sonnet 5.",
          variant: "shot",
          src: `${base}/route-detail.png`,
          alt: "Route receipt: Kimi K3 on Together, cache read, 13 tokens in and 194 out, $0.0025 under Claude Sonnet 5",
        },
      ],
    },
    {
      id: "site",
      title: "The page",
      body: [
        "Michael's brief started as a homepage: keep the ASCII, fix the buttons, and make the value obvious in five seconds. The page at the time buried the install.",
        "It opens on the product. All your agents, one place, then the download. I designed and built that page in code. It is the current design in the Conifer workspace. conifer.build carries Conifer's own marketing site.",
      ],
      visualsLayout: "full",
      visuals: [
        {
          id: "hero",
          label: "Open",
          caption: "All your agents. One place. Download for Mac, or read the docs.",
          variant: "shot",
          src: `${base}/hero.png`,
          alt: "Conifer homepage hero, All your agents, one place, above a pixel bonsai",
        },
      ],
    },
    {
      id: "captain",
      title: "The Captain",
      body: [
        "One ask becomes a task for each agent. Claude Code takes the billing export, Codex the webhook drops, Cursor the tests. They start together.",
        "Codex drifts and starts refactoring invoices. The card says it is off the ask. The Captain steers it back.",
      ],
      visualsLayout: "duo",
      visuals: [
        {
          id: "captain",
          label: "The split",
          caption: "One ask, three agents, all starting.",
          variant: "shot",
          src: `${base}/product-captain.png`,
          alt: "Captain splitting one ask across Claude Code, Codex, and Cursor",
        },
        {
          id: "drift",
          label: "The drift",
          caption: "Codex leaves the ask. The Captain pulls it back.",
          variant: "shot",
          src: `${base}/product-drift.png`,
          alt: "Codex marked off the ask while Claude Code and Cursor stay on it",
        },
      ],
    },
    {
      id: "review",
      title: "Review",
      body: [
        "On Martian's open Code Review Benchmark, Parallax found more merge-blocking problems per pull request than the other tools on the list.",
        "A finding counts only when a test fails on the code and passes with the fix. The other reviewer said the grouping was clean. Parallax wrote the test that fails.",
      ],
      visualsLayout: "full",
      visuals: [
        {
          id: "review",
          label: "The finding",
          caption: "The other bot approved the grouping. Parallax wrote the test that fails.",
          variant: "shot",
          src: `${base}/review.png`,
          alt: "Code review benchmark with Parallax calling out a grouping bug the other reviewer missed",
        },
      ],
    },
    {
      id: "limits",
      title: "Limits",
      body: [
        "Connect several Claude and Codex subscriptions. When one hits the week's limit, the work moves to the next. The export keeps running.",
      ],
      visualsLayout: "full",
      visuals: [
        {
          id: "plans",
          label: "The handoff",
          caption: "Two Claude Max plans are spent. Claude Pro still has room.",
          variant: "shot",
          src: `${base}/plans.png`,
          alt: "Three subscriptions, two at the weekly limit and one still running the billing export",
        },
      ],
    },
    {
      id: "close",
      title: "The close",
      body: [
        "The close repeats the offer. $50 of Conifer credit and 5 free reviews with a GitHub signup. The Mac build is notarized. Linux is on the same release.",
      ],
      visualsLayout: "full",
      visuals: [
        {
          id: "close",
          label: "Free to start",
          caption: "Download for Mac, or read the docs.",
          variant: "shot",
          src: `${base}/close.png`,
          alt: "Orange closing card with a pixel pinecone and the line Free to start",
        },
      ],
    },
  ],
  cover: {
    src: `${base}/chat.png`,
    alt: "Conifer chat with a refactor reply from Kimi K3 on Together",
    fit: "contain",
  },
  logos: [{ src: "/work/logos/conifer.svg", alt: "Conifer" }],
  published: true,
  order: 1,
};

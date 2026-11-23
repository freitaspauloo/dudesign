import type { CaseStudy } from "../types";

const base = "/work/cases/alpic";

export const alpic: CaseStudy = {
  slug: "alpic",
  title: "Alpic",
  cardTitle: "Agent experiment flow",
  client: "Alpic",
  subtitle:
    "The Tracks experiment flow, built as a clickable prototype, and a brand the site and the product share.",
  displayTitle: "The first experiment should feel obvious.",
  metaLabel: "MCP product",
  year: "2026",
  timeline: "2 weeks",
  team: "Alpic",
  roleTitle: "Product Designer",
  tags: ["Agent UX", "Brand", "Prototype in code"],
  skillsProven: ["Product UX", "Brand systems", "Prototyping in code"],
  role: {
    owned: [
      "Tracks prototype: empty state, setup, experiments, runs, library, analytics",
      "Navigation for that loop",
      "Homepage, hero, and the brand guide",
    ],
    notOwned: [
      "Production backend, auth, and billing",
      "The evaluation engine",
      "What Alpic ships after review",
    ],
  },
  decisions: [],
  collaborators: ["Charles Sonigo", "Erica Beavers", "Nikolay Rodionov"],
  links: [
    { label: "Alpic", url: "https://alpic.ai" },
    { label: "Prototype", url: "https://github.com/freitaspauloo/alpic" },
  ],
  sections: [
    {
      id: "did",
      title: "What we did",
      body: [
        "Tracks is where a team tests whether a coding agent can use their product, their tools, and their MCP servers. The first screen after login was an empty experiments page, and setup was hard to scan. The brand had a strong mountain, and too much colour to share between the marketing site and the product.",
        "In two weeks I designed and built both in code. A clickable Tracks prototype for the experiment loop, and a homepage with a brand guide. The site and the product use the same mountain and the same colour rule.",
      ],
      visualsLayout: "full",
      visuals: [
        {
          id: "empty",
          label: "Empty experiments",
          caption: "The first screen. Four ways to start, or write the scenario.",
          variant: "shot",
          src: `${base}/empty.webp`,
          alt: "Tracks empty experiments page for a new organization, asking what to test",
        },
      ],
    },
    {
      id: "outcomes",
      title: "Outcomes",
      body: [
        "16 product screens, in light and dark. Two organizations. One is empty, so the first visit is the setup. The other holds 3 experiments and 6 runs, on 2 agents: Claude and Codex.",
        "A new experiment starts from 4 scenarios: find the price, get started, create an account, or get support. Behind those runs, the library holds 2 repositories, 2 skills, 2 MCP servers, and 1 command-line tool. Analytics shows where traffic comes from, and which visits are agents.",
        "The brand side is a homepage and a 9-part guide. The hero reads “Your next user might not be human.” The mountain forms, then breaks into pixels. Grounds stay quiet. Lime, teal, and berry sit on the data, on the site and in the product.",
        "Alpic kept that hero and that colour rule. The prototype is its own build. Production was left as it was.",
      ],
    },
    {
      id: "tracks",
      title: "Tracks",
      body: [
        "The empty screen is the way in. Once a run exists, the experiment is home: pass rate, spend, and which variant failed. Open a run and the evidence is what the judge accepted. Analytics uses the same colour, on the traffic that reached the product.",
      ],
      visualsLayout: "full",
      visuals: [
        {
          id: "result",
          label: "The experiment",
          caption: "Find the price, version 3. Three of four runs passed. Codex failed the published-prices scenario.",
          variant: "shot",
          src: `${base}/result.webp`,
          alt: "Find the price experiment, judged at 75 percent, with Claude passing and Codex failing one scenario",
        },
        {
          id: "run",
          label: "A run",
          caption: "The evidence the judge accepted. Claude cited the pricing page and the checkout fee.",
          variant: "shot",
          src: `${base}/run.webp`,
          alt: "A passed run for published prices, with the evidence Claude cited and the run details",
        },
        {
          id: "analytics",
          label: "Analytics",
          caption: "Traffic and agent visits. Colour stays on the data.",
          variant: "shot",
          src: `${base}/analytics.webp`,
          alt: "Analytics for the last 24 hours, with a pink agent line and a visitor ring",
        },
      ],
    },
    {
      id: "brand",
      title: "Brand",
      body: [
        "The homepage and the 9-part guide carry the same mountain as the product. A peak can be colour or mono. The colour rule does not change.",
      ],
      visualsLayout: "full",
      visuals: [
        {
          id: "mountain-system",
          label: "Mountain system",
          caption: "One mountain, used on the homepage, the guide, and the product.",
          variant: "shot",
          src: `${base}/mountain-system.webp`,
          alt: "Alpic brand guide showing the mountain system in colour and mono",
        },
      ],
    },
  ],
  cover: {
    src: `${base}/cover.webp`,
    video: `${base}/cover-3.mp4`,
    alt: "Pixel mountain with the line Your next user might not be human",
    fit: "contain",
  },
  gallery: [
    {
      id: "hero-motion",
      layout: "video",
      items: [
        {
          id: "hero-video",
          label: "Hero",
          caption: "The homepage hero. The mountain forms, then breaks into pixels.",
          variant: "video",
          src: `${base}/hero.mp4`,
          poster: `${base}/poster.webp`,
          alt: "Animated Alpic hero. A pixel mountain forms behind the question, can agents actually use your product",
        },
      ],
    },
  ],
  published: true,
  unlisted: true,
  order: 0,
};

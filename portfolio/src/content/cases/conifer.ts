import type { CaseStudy } from "../types";

const base = "/work/cases/conifer";

export const conifer: CaseStudy = {
  slug: "conifer",
  title: "Conifer",
  client: "Conifer",
  subtitle:
    "Every request goes to the cheapest model that clears it — starting with your own hardware. Most never touch the cloud.",
  displayTitle: "Run AI locally. Route the rest. Pay less.",
  metaLabel: "Inference gateway",
  year: "2026",
  timeline: "2025 – 2026",
  team: "Conifer (YC S26)",
  roleTitle: "Product Designer",
  tags: ["AI infrastructure", "Landing + product", "Shipped in code"],
  skillsProven: [
    "Developer tools and AI product UX",
    "Marketing site and narrative design",
    "Systems thinking for technical products",
    "End-to-end product design",
  ],
  role: {
    owned: [
      "Landing page redesign for conifer.build",
      "Hero narrative, routing story, and install flow UX",
      "Visual language — monospace craft, ASCII bonsai, marble surfaces",
      "Responsive layout and dark/light theme behavior",
    ],
    notOwned: [
      "Gateway routing engine and model catalog backend",
      "CLI and console implementation",
      "Billing, auth, and infrastructure",
    ],
  },
  decisions: [
    {
      title: "Feature dump vs. one routing story",
      chosen:
        "Lead with a single promise — local-first routing to the Pareto frontier — then unpack install, models, and pricing in that order.",
      rejected:
        "A docs-style homepage listing every endpoint first. Engineers bounced before understanding why Conifer exists.",
    },
    {
      title: "Generic AI landing vs. Conifer craft",
      chosen:
        "ASCII bonsai, marble ground, and monospace type as brand signals — technical without reading like every other inference startup.",
      rejected:
        "Gradient SaaS template with stock illustrations. Fast to ship, zero differentiation in a crowded category.",
    },
    {
      title: "Explain routing abstractly vs. visually",
      chosen:
        "A dedicated routing diagram and model explorer sections so users see the decision path, not just the tagline.",
      rejected:
        "Copy-only explanation of cost savings. Hard to trust a routing claim you can't picture.",
    },
  ],
  collaborators: ["Michael Jeffords", "Conifer engineering"],
  links: [{ label: "Live product", url: "https://www.conifer.build" }],
  prototype: {
    label: "Open conifer.build",
    url: "https://www.conifer.build",
    embed: false,
  },
  sections: [
    {
      id: "problem",
      title: "Problem",
      body: [
        "Conifer routes inference to the cheapest model that still clears the work — local hardware first, cloud when needed. The product is real and shipping; the site had to explain that routing story without sounding like every other AI API landing page.",
        "The design job was credibility for a technical buyer: make local-first routing legible, show the install path immediately, and keep the YC-stage product feeling crafted — not templated.",
      ],
      visualsLayout: "full",
      visuals: [
        {
          id: "hero",
          label: "Hero",
          caption: "Local-first routing promise with install command above the fold",
          variant: "shot",
          src: `${base}/hero.png`,
          alt: "Conifer landing hero — Run AI locally, route the rest",
        },
      ],
    },
    {
      id: "process",
      title: "Process",
      body: [
        "I mirrored the live product, mapped the narrative gaps, and rebuilt the landing as a static redesign — hero, routing story, model exploration, and footer — before handing off to production.",
        "The ASCII bonsai and marble ground became the visual anchor: a craft signal that reads developer-native without abandoning clarity for non-designer buyers.",
      ],
      visualsLayout: "full",
      visuals: [
        {
          id: "routing-tree",
          label: "Routing story",
          caption: "Visualizing local-first routing before the diagram section",
          variant: "shot",
          src: `${base}/routing-tree.png`,
          alt: "Conifer ASCII bonsai routing section",
        },
        {
          id: "routing-diagram",
          label: "Routing diagram",
          caption: "How requests move from local hardware to cloud fallback",
          variant: "shot",
          src: `${base}/routing-diagram.png`,
          alt: "Conifer routing diagram section",
        },
      ],
    },
    {
      id: "outcome",
      title: "Outcome",
      body: [
        "The redesign gives Conifer a single coherent story: install locally, route intelligently, pay less. Model exploration and pricing support the hero instead of competing with it.",
        "Shipped as a reference redesign on the path to production — typography, spacing, and section rhythm tuned for conifer.build's technical audience.",
      ],
      visualsLayout: "full",
      visuals: [
        {
          id: "explore-models",
          label: "Model explorer",
          caption: "Surfacing the catalog without burying the routing message",
          variant: "shot",
          src: `${base}/explore-models.png`,
          alt: "Conifer model explorer section",
        },
        {
          id: "landing-full",
          label: "Full page",
          caption: "End-to-end landing flow",
          variant: "shot",
          src: `${base}/landing-full.png`,
          alt: "Conifer landing page full redesign",
        },
      ],
    },
  ],
  cover: {
    src: "/work/cases/conifer/hero.png",
    alt: "Conifer landing page hero — inference gateway",
  },
  logos: [{ src: "/work/logos/conifer.svg", alt: "Conifer" }],
  published: true,
  order: 4,
};

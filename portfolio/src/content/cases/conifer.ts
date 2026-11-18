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
      "The homepage around it: hero, download, and close",
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
        "This reply is a refactor of the auth middleware. Conifer sent it to Kimi K3 on Together, at $0.0005, 140 tokens a second. The same screen is where you read the code, copy it, or ask for another pass.",
      ],
      visualsLayout: "full",
      visuals: [
        {
          id: "chat",
          label: "The thread",
          caption: "A refactor, routed to Kimi K3 on Together.",
          variant: "shot",
          src: `${base}/chat.png`,
          alt: "Conifer chat with a refactor reply from Kimi K3 on Together",
        },
      ],
    },
    {
      id: "route",
      title: "The route",
      body: [
        "Open the receipt and the choice is on the page. Model, provider, cache, and tokens. This one read the repo from cache: 13 tokens in, 194 out.",
        "Under the row, the reason. A multi-file code edit, so Kimi K3 was the cheapest model that could clear it. The screen puts the saving against Claude Sonnet 5: $0.0025.",
      ],
      visualsLayout: "full",
      visuals: [
        {
          id: "chat-route",
          label: "Why this model",
          caption: "Kimi K3, Together, cache read, $0.0025 under Claude Sonnet 5.",
          variant: "shot",
          src: `${base}/chat-route.png`,
          alt: "Conifer chat with the route open: Kimi K3 on Together, cache read, 13 tokens in and 194 out",
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
    src: `${base}/chat.png`,
    alt: "Conifer chat with a refactor reply from Kimi K3 on Together",
    fit: "contain",
  },
  logos: [{ src: "/work/logos/conifer.svg", alt: "Conifer" }],
  published: true,
  order: 1,
};

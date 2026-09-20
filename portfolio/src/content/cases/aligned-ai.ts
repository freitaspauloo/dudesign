import type { CaseStudy } from "../types";

const base = "/work/cases/aligned-ai";

export const alignedAi: CaseStudy = {
  slug: "aligned-ai",
  title: "Aligned AI",
  client: "Aligned",
  subtitle:
    "A private, trustworthy AI assistant for the whole family, designed to give everyone what they need and more time for what matters most.",
  displayTitle: "Less time asking. More time living.",
  metaLabel: "AI workspace",
  year: "2025",
  timeline: "2025 – 2026",
  team: "Aligned AI",
  roleTitle: "Product Designer",
  tags: ["AI workspace", "Trust UX", "Shipped in code"],
  skillsProven: [
    "AI and agent UX design",
    "Accessibility and trust UX",
    "End-to-end product design",
    "Cross-functional leadership",
  ],
  role: {
    owned: [
      "Product UX for the personal AI workspace concept",
      "Information architecture for benchmark and docs surfaces",
      "Visual system and interaction patterns for AI-assisted flows",
      "Production UI implementation in code",
    ],
    notOwned: [
      "Core AI model training and inference",
      "Backend infrastructure and auth",
      "Go-to-market and sales motion",
    ],
  },
  decisions: [
    {
      title: "Workspace-first vs. docs-first",
      chosen:
        "Lead with a workspace metaphor — users need a place to work, not another docs site. Benchmark content supports the product story instead of replacing it.",
      rejected:
        "A standalone Mintlify docs site with no product shell. It would read like marketing, not something you'd use daily.",
    },
    {
      title: "Trust patterns for AI output",
      chosen:
        "Explicit provenance, editable drafts, and clear human-in-the-loop states — so users always know what the system suggested vs. what they committed.",
      rejected:
        "Magic auto-complete with no audit trail. Fast to demo, impossible to trust in a professional workflow.",
    },
    {
      title: "Prototype fidelity",
      chosen:
        "Ship working UI in code early — enough to test navigation, density, and agent handoffs with real stakeholders.",
      rejected:
        "High-fidelity Figma only. The team needed to feel latency, scroll, and state — not a slideshow.",
    },
  ],
  collaborators: ["Aligned AI", "Engineering partners"],
  links: [],
  prototype: {
    label: "Open live product at joinaligned.ai",
    url: "https://joinaligned.ai",
    embed: false,
    hero: true,
  },
  sections: [
    {
      id: "problem",
      title: "Problem",
      body: [
        "Aligned is building in the personal AI workspace category — a space where generic chat UIs fail because professionals need persistent context, trustworthy outputs, and workflows that fit how they already work.",
        "The design challenge wasn't a landing page. It was making AI feel like a workspace you can rely on: clear ownership of suggestions, readable benchmark content, and surfaces that don't collapse under real data density.",
      ],
    },
    {
      id: "process",
      title: "Process",
      body: [
        "I mapped the core jobs: orient in the workspace, run an AI-assisted task, review output, and commit a result. Each step needed explicit trust UX — not bolted-on disclaimers, but structural clarity in the UI.",
        "Benchmark content was treated as product evidence, not a side project. The structure mirrors how users evaluate AI tools: capability, limits, and comparison points.",
        "I prototyped key flows in code so PM and Eng could react to real interaction — scroll, focus, loading, and error states included.",
      ],
    },
    {
      id: "outcome",
      title: "Outcome",
      body: [
        "Delivered a coherent workspace direction with benchmark content wired into the product narrative — ready for stakeholder review and engineering iteration.",
        "Established reusable patterns for AI trust UX (provenance, draft vs. committed, human override) that scale across future features.",
      ],
    },
    {
      id: "reflection",
      title: "What I'd do differently",
      body: [
        "Instrument earlier usability sessions on the commit/review step — that's where trust breaks or holds, and we relied too much on internal review at first.",
      ],
      visualsLayout: "grid",
      visuals: [
        {
          id: "reflection-dark-flow",
          label: "Dark mode flows",
          caption: "Search and document states in dark theme",
          variant: "shot",
          src: `${base}/desktop-dark-2.png`,
          alt: "Aligned AI dark mode search and interaction states",
        },
        {
          id: "reflection-dark-doc",
          label: "Dark document surface",
          caption: "Readable long-form output without losing trust cues",
          variant: "shot",
          src: `${base}/desktop-dark-3.png`,
          alt: "Aligned AI dark mode document reading view",
        },
      ],
    },
  ],
  cover: {
    src: `${base}/desktop-1.png`,
    alt: "Aligned AI desktop workspace overview with sidebar and Good morning Paulo",
    fit: "contain",
  },
  gallery: [
    {
      id: "workspace",
      title: "Workspace home",
      layout: "full",
      items: [
        {
          id: "workspace-light",
          label: "Light mode",
          caption: "Orienting state with mode selection and persistent context",
          variant: "shot",
          src: `${base}/desktop-2.png`,
          alt: "Aligned AI desktop workspace — Good morning Paulo with Ask anything input",
        },
        {
          id: "workspace-dark",
          label: "Dark mode",
          caption: "Same mental model, tuned for low-light daily use",
          variant: "shot",
          src: `${base}/desktop-dark-1.png`,
          alt: "Aligned AI dark mode desktop workspace home",
        },
      ],
    },
    {
      id: "supporting",
      title: "Supporting flows",
      layout: "grid",
      items: [
        {
          id: "support-voice",
          label: "Voice capture",
          variant: "shot",
          src: `${base}/desktop-5.png`,
          alt: "Aligned AI voice input listening state over scenic background",
        },
        {
          id: "support-doc",
          label: "Long-form review",
          variant: "shot",
          src: `${base}/desktop-3.png`,
          alt: "Aligned AI document review surface with long-form text",
        },
        {
          id: "support-trust",
          label: "Trust micro-interaction",
          variant: "shot",
          src: `${base}/desktop-6.png`,
          alt: "Aligned AI text selection with Add to task trust pattern",
        },
        {
          id: "support-settings",
          label: "Settings & density",
          variant: "shot",
          src: `${base}/desktop-8.png`,
          alt: "Aligned AI settings and information-dense workspace panel",
        },
      ],
    },
    {
      id: "mobile",
      title: "Mobile",
      layout: "full",
      items: [
        {
          id: "mobile-light-dark",
          label: "Mobile — light & dark",
          caption: "Responsive home and review on the go",
          variant: "shot",
          src: `${base}/mobile-1.png`,
          alt: "Aligned AI mobile workspace light and dark mode pair",
        },
        {
          id: "mobile-doc",
          label: "Mobile — long-form",
          caption: "Commit flows carried through on small screens",
          variant: "shot",
          src: `${base}/mobile-2.png`,
          alt: "Aligned AI mobile document and chat layouts",
        },
      ],
    },
    {
      id: "launch",
      title: "Launch film",
      layout: "video",
      items: [
        {
          id: "launch-video",
          label: "Enterprise launch film",
          caption: "Enterprise landing page walkthrough — capabilities, cost, privacy, and deployment",
          alt: "Aligned AI enterprise landing page launch video",
          variant: "video",
          src: `${base}/launch-video.mp4`,
          poster: `${base}/enterprise-landing.png`,
        },
      ],
    },
    {
      id: "split-view",
      title: "Split workspace",
      layout: "full",
      items: [
        {
          id: "split-documents",
          label: "Dual-pane review",
          caption: "Compare drafts and committed output side by side",
          variant: "shot",
          src: `${base}/desktop-10.png`,
          alt: "Aligned AI split document workspace view",
        },
      ],
    },
  ],
  logos: [{ src: "/work/logos/aligned.svg", alt: "Aligned AI" }],
  featured: true,
  published: true,
  order: 1,
};

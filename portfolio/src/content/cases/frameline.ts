import type { CaseStudy } from "../types";

export const frameline: CaseStudy = {
  slug: "frameline",
  title: "Frameline",
  client: "Frameline",
  subtitle:
    "A design-engineering surface library — because taste doesn't ship as code unless someone builds the install path.",
  displayTitle: "Taste that ships as installable code",
  metaLabel: "Design system",
  year: "2025",
  timeline: "2024 – present",
  team: "Solo (DUDESIGN)",
  roleTitle: "Product Designer + Engineer",
  tags: ["Design system", "Dev-facing", "Built with Cursor"],
  skillsProven: [
    "Systems thinking and design systems",
    "Prototyping in code",
    "Developer tools aesthetic",
    "Interaction and visual craft",
  ],
  role: {
    owned: [
      "Product definition, discovery, and positioning",
      "Visual language and material catalog curation",
      "Live configurator UX and licensing clarity",
      "Full-stack implementation (Next.js, shaders, commerce flow)",
    ],
    notOwned: [
      "Third-party payment processor internals",
      "Community moderation at scale (pre-PMF)",
    ],
  },
  decisions: [
    {
      title: "PNG handoff vs. installable surface",
      chosen:
        "Typed React components with token binding, SSR-safe fallbacks, and `prefers-reduced-motion` support — materials you install, not PNGs you hope scale.",
      rejected:
        "Static export only. Faster to ship, but it doesn't solve the engineer's real job: production-safe code in their repo.",
    },
    {
      title: "Generic AI aesthetic vs. opinionated craft",
      chosen:
        "Curated materials with a clear visual signature — fewer items at a higher bar, each with measured performance budget.",
      rejected:
        "Volume catalog of anonymous effects (the Aceternity problem). High demo impact, zero differentiation.",
    },
    {
      title: "Research theater vs. shipped signals",
      chosen:
        "Fake-door pricing, waitlist, and install-intent logging to validate demand before heavy commerce build-out.",
      rejected:
        "Months of user interviews before a single material ships. Speed to PMF over research theater.",
    },
  ],
  collaborators: ["DUDESIGN (solo operator)", "Early design-engineer advisors"],
  links: [
    { label: "Live product", url: "https://frameline.ai" },
    { label: "GitHub", url: "https://github.com/freitaspauloo/frameline" },
  ],
  prototype: {
    label: "Open live product at frameline.ai",
    url: "https://frameline.ai",
    embed: true,
  },
  sections: [
    {
      id: "problem",
      title: "Problem",
      body: [
        "Teams that care how their product looks must ship that look in code. Every existing path forces a compromise: shadcn/Tailwind is structurally sound but visually anonymous; viral effect libraries look identical across thousands of sites; Figma Community files never ship; building in-house costs engineer-days nobody authorizes for 'the background.'",
        "The gap isn't a shortage of images. Taste does not currently ship as code.",
      ],
    },
    {
      id: "process",
      title: "Process",
      body: [
        "I defined Frameline as a commercial surface & materials system: typed React components, token-bound, production-safe, with a live configurator and plain-language licensing.",
        "Discovery Phase 01 focused on Gate 01 evidence — waitlist, willingness-to-pay, and install intent — before locking commerce architecture.",
        "The catalog includes screen templates (e.g. Softwave hero and feature cards) that demonstrate how materials compose into real product surfaces, not isolated demos.",
        "Built with Next.js App Router, WebGL shaders, and a solo-operable publishing pipeline so each new material ships in hours, not days.",
      ],
    },
    {
      id: "outcome",
      title: "Outcome",
      body: [
        "Live product at frameline.ai with a growing material catalog, configurator, and discovery instrumentation in place.",
        "Frameline doubles as portfolio proof: I own the full narrative from problem definition through shipped code.",
      ],
    },
    {
      id: "reflection",
      title: "What I'd do differently",
      body: [
        "Publish fewer materials earlier with stronger before/after case studies — buyers need to see transformation on a real app shell, not just the material in isolation.",
      ],
    },
  ],
  cover: {
    src: "/work/cases/frameline.webp",
    alt: "Frameline design surface configurator",
  },
  gallery: [
    {
      id: "website",
      title: "Website",
      layout: "full",
      items: [
        {
          id: "forge-ai-hero",
          label: "FORGE.AI",
          caption: "Product design and development",
          src: "/work/cases/frameline/forge-ai-hero.webp",
          alt: "FORGE.AI landing page — build apps by chatting with AI",
          variant: "shot",
        },
        {
          id: "pulse-hero",
          label: "Pulse",
          caption: "Product design and development",
          src: "/work/cases/frameline/pulse-hero.webp",
          alt: "Pulse health AI hero — vitals tracking and wellness coaching",
          variant: "shot",
        },
        {
          id: "passo",
          label: "Passo",
          caption: "Product design and development",
          src: "/work/cases/frameline/passo.webp",
          alt: "Passo running app hero — GPS tracking and pace coaching",
          variant: "shot",
        },
        {
          id: "softwave-feature-cards",
          label: "Softwave",
          caption: "Product design and development",
          src: "/work/cases/frameline/softwave-feature-cards.webp",
          alt: "Softwave feature cards — ML workflow surfaces",
          variant: "shot",
        },
        {
          id: "defect-assistant-hero",
          label: "Reticle",
          caption: "Product design and development",
          src: "/work/cases/frameline/defect-assistant-hero.webp",
          alt: "Reticle defect assistant hero — in-line semiconductor inspection",
          variant: "shot",
        },
        {
          id: "ai-inspection-interface",
          label: "Reticle",
          caption: "Product design and development",
          src: "/work/cases/frameline/ai-inspection-interface.webp",
          alt: "Reticle AI inspection interface — yield-focused fab tooling",
          variant: "shot",
        },
        {
          id: "always-on-wafer-inspection",
          label: "Reticle",
          caption: "Product design and development",
          src: "/work/cases/frameline/always-on-wafer-inspection.webp",
          alt: "Reticle always-on wafer inspection landing page",
          variant: "shot",
        },
        {
          id: "pixel-cube-hero",
          label: "Reticle",
          caption: "Product design and development",
          src: "/work/cases/frameline/pixel-cube-hero.webp",
          alt: "Reticle pixel cube hero — defect capture for high-volume fabs",
          variant: "shot",
        },
        {
          id: "space-explorer-hero",
          label: "Reticle",
          caption: "Product design and development",
          src: "/work/cases/frameline/space-explorer-hero.webp",
          alt: "Reticle space explorer hero — ranked review for yield",
          variant: "shot",
        },
        {
          id: "magenta-landscape-hero",
          label: "Reticle",
          caption: "Product design and development",
          src: "/work/cases/frameline/magenta-landscape-hero.webp",
          alt: "Reticle magenta landscape hero — built for yield",
          variant: "shot",
        },
        {
          id: "protect-yield-features",
          label: "Reticle",
          caption: "Product design and development",
          src: "/work/cases/frameline/protect-yield-features.webp",
          alt: "Reticle yield protection features section",
          variant: "shot",
        },
        {
          id: "yield-inspection-dashboard",
          label: "Reticle",
          caption: "Product design and development",
          src: "/work/cases/frameline/yield-inspection-dashboard.webp",
          alt: "Reticle yield inspection dashboard — production-qualified models",
          variant: "shot",
        },
        {
          id: "miracle-login-cyan",
          label: "Reticle",
          caption: "Product design and development",
          src: "/work/cases/frameline/miracle-login-cyan.webp",
          alt: "Reticle sign-in — inspection workspace access",
          variant: "shot",
        },
      ],
    },
  ],
  logos: [{ src: "/work/logos/frameline.png", alt: "Frameline" }],
  published: true,
  order: 2,
};

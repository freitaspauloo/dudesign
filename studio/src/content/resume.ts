export type ResumeJob = {
  company: string;
  role: string;
  location: string;
  dates: string;
  bullets: string[];
};

export const resume = {
  title: "Senior Product Designer",
  summary:
    "Product designer who ships in code, not just mocks. I've designed complex B2B and AI products, built Fortune 500-facing experiences for Audi, Samsung, 3M, Ford, Sony + Honda, and Costco, and founded Frameline, a design-engineering surface library live in production. Looking for a senior IC role where craft, UX strategy, and working close to engineering matter.",
  jobs: [
    {
      company: "Amplif.AI",
      role: "Lead Product Designer",
      location: "Remote",
      dates: "Jul 2025 - Apr 2026",
      bullets: [
        "Led AI-driven creative production across image, video, and interactive experiences, designing high-quality visuals, cinematic video, and rapid concept iterations at scale.",
        "Bridged creative strategy with product execution: prototyping UX flows in Figma and code, transforming concepts into testable products and marketing assets with speed and consistency.",
      ],
    },
    {
      company: "Frameline",
      role: "Founder & Product Designer",
      location: "Remote",
      dates: "Jan 2025 - Present",
      bullets: [
        "Built Frameline (frameline.ai), a design-engineering surface library for AI-era products: owned product definition, visual language, configurator UX, and full-stack implementation in React/Next.js.",
        "Shipped installable typed React components so teams adopt polished UI surfaces instead of default AI-product aesthetics: design-to-production code, not Figma handoffs.",
        "Designed and built the end-to-end product experience: component library, configurator, commerce flows, and documentation site deployed on Vercel.",
      ],
    },
    {
      company: "xix3D",
      role: "Product Designer",
      location: "Remote",
      dates: "Aug 2023 - Aug 2025",
      bullets: [
        "Primary creative partner for Fortune 500 and global automotive clients (3M, Ford, Audi, Samsung, Sony + Honda (Afeela), Costco, Spandex, and The Wrap Institute), delivering product UX, brand systems, and go-to-market assets across enterprise partnerships.",
        "3M Films, Zeno Platform: Designed UI/UX for 3M's flagship retail technology product: kiosk experience, dealer portal, sales training academy, and rollout collateral deployed across dealerships.",
        "Ford, Wrap Program: Led creative for the automotive industry's first OEM-integrated aftermarket customization platform: vehicle configurator, Wrap Learning Academy (video + PDF guides), email flows, and dealer onboarding materials.",
        "Afeela (Sony + Honda): Designed the EV personalization experience: configurator UX, real-time 3D visualization, checkout/pricing flow, companion mobile app, and post-purchase delivery tracking.",
        "Audi / Samsung / 3M Summit: Produced CGI and presentation assets for global automotive summit launches showcasing next-generation vehicle customization technology.",
        "Costco, Kirkland Signature: Created automotive brand identity and packaging for Kirkland Signature products: credible specialist-grade positioning within Costco's value-first retail context.",
      ],
    },
    {
      company: "DUBRANDING",
      role: "Creative Director & Founder",
      location: "São Paulo, Brazil · Remote clients globally",
      dates: "Jan 2021 - Apr 2025",
      bullets: [
        "Founded and led an international creative agency specializing in SaaS brand development for clients across the US, Canada, UK, Hungary, Germany, Portugal, and Spain.",
        "Built a distributed team delivering brand strategy, visual identity, web design, and digital marketing: scalable brand systems supporting international expansion and user acquisition.",
      ],
    },
  ] satisfies ResumeJob[],
  education: [
    {
      school: "FIAP, SP",
      degree: "Master in UX Design",
      dates: "Jan 2025 - Nov 2025",
    },
    {
      school: "Universidade de Mogi das Cruzes",
      degree: "BA in Graphic Design",
      dates: "Jan 2019 - Dec 2023",
    },
  ],
  skills: [
    {
      label: "Languages",
      value:
        "Portuguese (Native), English (Fluent, C2), Spanish (Intermediate, B1), French (Beginner, A2)",
    },
    {
      label: "Product",
      value:
        "UX/UI Strategy, User Flows, Design Systems, AI Product Design, Prototyping",
    },
    {
      label: "Design",
      value: "Visual Identity, Motion Design, Video Production, 3D Visualization",
    },
    {
      label: "Code",
      value: "React, Next.js, HTML/CSS, Cursor, Webflow",
    },
    {
      label: "Tools",
      value:
        "Figma, Adobe Creative Suite, Blender, Unreal Engine, Midjourney, Runway",
    },
  ],
  pdfPath: "/Paulo-Freitas-Resume.pdf",
} as const;

import type { CaseStudy } from "../types";

export const afeela: CaseStudy = {
  slug: "afeela",
  title: "Afeela — EV personalization platform",
  client: "Afeela",
  subtitle:
    "Brand-new car company needed its entire personalization experience designed — from first click to delivery day.",
  displayTitle: "Vehicle personalization for Sony and Honda's EV venture",
  metaLabel: "EV / Technology",
  year: "2024",
  timeline: "2023 – 2025",
  team: "xix3D",
  roleTitle: "Product Designer",
  tags: ["EV", "Configurator", "Mobile"],
  skillsProven: [
    "End-to-end product design",
    "3D visualization UX",
    "Mobile companion product design",
  ],
  role: {
    owned: [
      "Configurator UX for paint, wraps, packages, and checkout",
      "Real-time 3D wrap visualization, including licensed Sony IP looks",
      "Companion app: login, production countdown, 3D preview, and social/video export",
      "Pricing summary and post-purchase delivery tracking surfaces",
    ],
    notOwned: [
      "Vehicle engineering and manufacturing",
      "Sony IP licensing negotiations",
      "Payments and order fulfillment backend",
    ],
  },
  decisions: [
    {
      title: "Browse-to-delivery as one product",
      chosen:
        "One journey from color and wrap through checkout, production countdown, and social sharing — not a configurator that dumps the customer at a PDF quote.",
      rejected:
        "A marketing visualizer disconnected from order and ownership. Personalization dies if it doesn't survive past the showroom screen.",
    },
    {
      title: "Premium EV identity vs. wrap-shop UI",
      chosen:
        "Dark, cinematic surfaces that match Afeela's Sony + Honda positioning, with 3D preview and social export as part of ownership — not extras.",
      rejected:
        "A bright aftermarket catalog. It would have read as a third-party accessory tool on a brand that needed to feel native.",
    },
  ],
  collaborators: ["xix3D", "Sony Honda Mobility"],
  links: [{ label: "Studio writeup", url: "https://dudesign.us/work/afeela" }],
  sections: [
    {
      id: "problem",
      title: "Problem",
      body: [
        "Afeela is Sony and Honda's joint electric vehicle brand, entering a market where personalization is no longer optional — it's expected. The challenge was designing the complete digital experience for how a customer discovers, configures, prices, and purchases a personalized EV. This meant building the configurator UX, a 3D visualization system that renders wraps and options in real time, the checkout and pricing flow, a companion mobile app, and the post-purchase experience including delivery tracking and social sharing.",
      ],
    },
    {
      id: "process",
      title: "Process",
      body: [
        "I mapped the purchase as a single path: Model 1, paint and packages, wrap library (including Sony IP), pricing, checkout — then ownership on the phone.",
        "The mobile app had to extend the 3D car, not shrink the website. Production countdown, rotate-in-3D, photo share, and video export are how owners show the car before it exists.",
      ],
    },
    {
      id: "outcome",
      title: "From concept to a complete purchase journey",
      body: [
        "The final system takes a customer from browsing paint colors and wrap designs through to a submitted order with delivery countdown — all through interfaces designed to match the premium, forward-looking identity of the Afeela brand. The mobile app extends the experience beyond the browser, letting owners preview their car in 3D, track production status, and share custom configurations directly to social media.",
        "Designed at xix3D.",
      ],
    },
  ],
  cover: {
    src: "/work/cases/afeela/01.webp",
    alt: "Afeela Model 1 configurator — paint, personalize, and live vehicle preview",
  },
  gallery: [
    {
      id: "configure",
      title: "Configure and checkout",
      layout: "full",
      items: [
        {
          id: "wrap-library",
          label: "Wrap library",
          caption: "Real-time 3D wraps, including licensed Sony looks, on the actual Model 1.",
          src: "/work/cases/afeela/03.webp",
          alt: "Afeela wrap visualization with licensed graphic on Model 1",
          variant: "shot",
        },
        {
          id: "checkout",
          label: "Options and checkout",
          caption: "Wraps, tints, wheels, and interior priced in one summary before Go to Checkout.",
          src: "/work/cases/afeela/05.webp",
          alt: "Afeela Model 1 tablet checkout with options and accessories summary",
          variant: "shot",
        },
      ],
    },
    {
      id: "ownership",
      title: "After you order",
      layout: "full",
      items: [
        {
          id: "countdown",
          label: "Production countdown",
          caption: "230 days left — rotate in 3D and share before the car exists.",
          src: "/work/cases/afeela/02.webp",
          alt: "Afeela companion app production countdown and social share",
          variant: "shot",
        },
        {
          id: "app-pair",
          label: "Companion app",
          caption: "Login, 3D preview, and video export — ownership on the phone, not a tracking email.",
          src: "/work/cases/afeela/04.webp",
          alt: "Afeela mobile app login and video export screens",
          variant: "shot",
        },
        {
          id: "app-flow",
          label: "Mobile flow",
          caption: "Login → countdown → environment export → saved film of the configured car.",
          src: "/work/cases/afeela/06.webp",
          alt: "Afeela mobile app screens from login through video export",
          variant: "shot",
        },
      ],
    },
  ],
  logos: [
    { src: "/work/logos/sony.svg", alt: "Sony" },
    { src: "/work/logos/honda.svg", alt: "Honda" },
  ],
  published: true,
  order: 6,
};

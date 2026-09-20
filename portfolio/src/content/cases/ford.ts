import type { CaseStudy } from "../types";

export const ford: CaseStudy = {
  slug: "ford",
  title: "Ford — First OEM-aftermarket program",
  client: "Ford",
  subtitle:
    "Ford wanted to own vehicle customization at the dealer level. Nothing like it had been done before.",
  displayTitle: "OEM-aftermarket customization program",
  metaLabel: "Automotive",
  year: "2024",
  timeline: "2023 – 2025",
  team: "xix3D",
  roleTitle: "Product Designer",
  tags: ["Automotive", "Configurator", "Dealer tools"],
  skillsProven: [
    "End-to-end product design",
    "Configurator UX",
    "Cross-functional program design",
  ],
  role: {
    owned: [
      "Vehicle configurator UX — model, paint, wrap, and real-time visualization",
      "Ford Wrap Learning Academy structure (video + PDF installer guides)",
      "Customer communication flow: order status, delays, and pickup scheduling",
      "Program identity and go-to-market assets for the xix3D × Ford partnership",
    ],
    notOwned: [
      "OEM manufacturing and wrap installation operations",
      "Dealer network contracts",
      "Backend order-management infrastructure",
    ],
  },
  decisions: [
    {
      title: "A configurator vs. a full program",
      chosen:
        "Design the whole dealer-to-customer journey: visualize the wrap, train the installer, and keep every party informed until pickup.",
      rejected:
        "A standalone wrap visualizer with no training or status layer. Dealers would still stall on the operational steps that actually close the job.",
    },
    {
      title: "OEM-grade vs. aftermarket-looking UI",
      chosen:
        "Ford identity, real vehicle SKUs, and production-looking visualization so it reads as an OEM program — not a third-party wrap shop tool.",
      rejected:
        "A generic aftermarket aesthetic. It would have undercut the first OEM–aftermarket collaboration in the category.",
    },
  ],
  collaborators: ["xix3D", "Ford dealer and aftermarket partners"],
  links: [{ label: "Studio writeup", url: "https://dudesign.us/work/ford" }],
  sections: [
    {
      id: "problem",
      title: "Problem",
      body: [
        "This was the automotive industry's first collaboration between an OEM manufacturer and the aftermarket customization world. The challenge wasn't just designing a configurator — it was building an entire program from zero: a tool that lets customers visualize wraps on their Ford, a training system that teaches installers how to do it right, and a communication flow that keeps everyone from the dealer to the end customer informed through every step of the process.",
      ],
    },
    {
      id: "process",
      title: "Process",
      body: [
        "I designed the customer-facing configurator around the actual decision order: pick the vehicle, confirm paint, then wrap. Real-time color and film visualization had to feel like Ford, not a kiosk demo.",
        "In parallel I structured the Wrap Learning Academy and the status/pickup emails so installers and customers weren't left guessing once the order left the screen.",
      ],
    },
    {
      id: "outcome",
      title: "A program, not just a product",
      body: [
        "The final delivery spanned the full customer and dealer journey: a vehicle configurator with real-time color selection, the Ford Wrap Learning Academy with video tutorials and PDF guides, installation documentation, progress tracking forms, email marketing sequences, billboard and advertising creative, and the branded partnership identity between xix3D and Ford. Every asset was designed to make a complex, multi-party process feel seamless.",
        "Designed at xix3D.",
      ],
    },
  ],
  cover: {
    src: "/work/cases/ford/01.webp",
    alt: "Ford wrap configurator on a laptop — Bronco with real-time film and color selection",
  },
  gallery: [
    {
      id: "configurator",
      title: "Configurator",
      layout: "full",
      items: [
        {
          id: "vehicle-select",
          label: "Vehicle selection",
          caption: "Bronco, F-150, Explorer, Mustang — start with the actual Ford, not a generic model.",
          src: "/work/cases/ford/02.webp",
          alt: "Ford wrap program vehicle selection screen",
          variant: "shot",
        },
        {
          id: "paint",
          label: "Paint confirmation",
          caption: "Match factory color before wrap so the visualization stays honest.",
          src: "/work/cases/ford/04.webp",
          alt: "Ford wrap configurator paint color selection",
          variant: "shot",
        },
      ],
    },
    {
      id: "journey",
      title: "After the order",
      layout: "full",
      items: [
        {
          id: "pickup",
          label: "Pickup scheduling",
          caption: "Status, delay, and pickup in one customer-facing flow — not a black box after checkout.",
          src: "/work/cases/ford/03.webp",
          alt: "Ford Wrap Program mobile pickup scheduling and order details",
          variant: "shot",
        },
      ],
    },
  ],
  logos: [{ src: "/work/logos/ford.svg", alt: "Ford" }],
  published: true,
  order: 5,
};

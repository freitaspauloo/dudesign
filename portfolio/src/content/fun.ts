export type FunInterest = {
  id: string;
  label: string;
  title: string;
  body: string[];
  href?: string;
  hrefLabel?: string;
};

export const funPage = {
  title: "Fun",
  lead: "Outside client work — what I actually like spending time on.",
  interests: [
    {
      id: "running",
      label: "Running",
      title: "Miles before meetings",
      body: [
        "Running is how I reset. Long easy miles, the occasional race, and the discipline of showing up when the work is abstract.",
        "It keeps product decisions honest — you can't overthink a hill.",
      ],
    },
    {
      id: "reading",
      label: "Reading",
      title: "Ideas on paper",
      body: [
        "Mostly non-fiction: product thinking, design history, biographies, and whatever rabbit hole a good footnote opens.",
        "Reading is slow input. Design work is fast output. I like keeping both in balance.",
      ],
    },
    {
      id: "design",
      label: "Design",
      title: "Surfaces, systems, and taste",
      body: [
        "Even off the clock I'm looking at type, layout, and interaction — what feels inevitable vs. what feels like a template.",
        "Personal projects are where I push craft without a stakeholder deck in the way.",
      ],
    },
    {
      id: "tech",
      label: "Tech",
      title: "Build to understand",
      body: [
        "I like being close to the metal — prototypes in code, new AI tools, small utilities that should exist.",
        "Frameline started here: a design-engineering library I wanted in the world, so I shipped it.",
      ],
      href: "https://frameline.ai",
      hrefLabel: "Frameline",
    },
  ] satisfies FunInterest[],
};

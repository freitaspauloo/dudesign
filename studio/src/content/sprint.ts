import { site } from "./site";

export const sprintHero = {
  eyebrow: "AI Product Sprint",
  title:
    "Product sprints for AI startups. Two weeks. Shipped in the product.",
  sub: "We take the one part of your product that has to be obvious, design it with you, and put it in code.",
};

export const sprintPromises = [
  {
    title: "Look further along.",
    body: "Your product looks like the company you are about to be, not the one you were last quarter.",
  },
  {
    title: "Ship the surface.",
    body: "The work ends in your product, in your code, not in a file someone has to rebuild.",
  },
  {
    title: "Stop designing in slides.",
    body: "You react to a flow you can walk and an interface you can click, every few days.",
  },
];

export const sprintBelief = {
  line: "The interface shouldn't take a quarter.",
  body: `So we run AI Product Sprints: two weeks, ${site.price}, shipped in the product.`,
  steps: ["Fit call", "Day 1 questions", "Surface in staging"],
};

export const sprintWeeks = {
  eyebrow: "How we work",
  title: "Ask first. Check in every day. Show the tradeoffs.",
  week1: [
    {
      label: "Day 1. Questions only.",
      body: "We talk to the founder, and to a user if we can. We lock the surface in one sentence, write down what we will not touch, and agree on what done means.",
    },
    {
      label: "The flow.",
      body: "We map the one job, including the AI moment: what the user sees while the model is working, what happens when it is wrong, and how they steer it. You get 2 or 3 options with their tradeoffs and our recommendation.",
    },
    {
      label: "The prototype.",
      body: "A clickable prototype in your visual language. You react to something real, not a slide.",
    },
  ],
  week2: [
    {
      label: "Production UI.",
      body: "We build the surface in your codebase. If the repo is not ready, we build a coded prototype on your stack.",
    },
    {
      label: "Last day.",
      body: "The surface goes to staging, with a recorded walkthrough and a short handoff note on how your team extends it.",
    },
  ],
  daily:
    "Every day: a 10-minute check-in. What we did, what we are assuming, and what we need from you.",
};

export const sprintOutcomes = [
  "A demo that holds up.",
  "A surface engineering can extend.",
  "A product that looks like the company you're raising as.",
];

export const sprintOngoing = {
  eyebrow: "After the sprint",
  title: "Most teams keep us on.",
  body: `After the sprint, we join your team monthly from ${site.retainerFrom}. We sit in your weekly product meeting, run one design cycle a week, and work in your code. If you continue within two weeks of the sprint, the sprint fee is credited to your first month.`,
};

export const sprintClose = {
  title: "Get set. Go to market.",
  line: `Two weeks. ${site.price}. Shipped in the product.`,
};

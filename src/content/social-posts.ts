export type SocialChannel = "LinkedIn" | "X" | "Instagram";
export type SocialFormat =
  | "Offer"
  | "Diary"
  | "Scorecard"
  | "Case"
  | "Stack"
  | "Why-us"
  | "Face";

export type SocialPost = {
  slug: string;
  number: string;
  title: string;
  date: string;
  format: SocialFormat;
  channels: SocialChannel[];
  visual: string;
  linkedin: string;
  x: string;
};

export const socialPosts: SocialPost[] = [
  {
    slug: "wait-three-months",
    number: "01",
    title: "Most teams wait months for a Figma file",
    date: "2026-09-12",
    format: "Offer",
    channels: ["LinkedIn", "X"],
    visual: "Figma poster. CRT on the hill. 1080 x 1350.",
    linkedin: `Week 1 we lock the bet.
What the product is for, who uses it, what success looks like. Architecture and the key flows a human actually uses.

Week 2 the first surface ships in the product.
Components, pages, click-through. Your team reacts to real UI, not a file.

From week 3 I keep building in code.
Production UI, iteration in the build, design and implementation in the same place. No handoff queue.`,
    x: `Week 1: bet, architecture, key flows.
Week 2: first surface in the product.
Week 3+: production UI, same stack, no handoff queue.`,
  },
  {
    slug: "ford-operator",
    number: "02",
    title: "Ford. The operator screen",
    date: "2026-09-15",
    format: "Case",
    channels: ["LinkedIn", "X", "Instagram"],
    visual: "Ford configurator still. Tight crop. Credit Ford first.",
    linkedin: `Ford. First OEM-aftermarket program.
Hardware with a screen attached is familiar ground.
The lesson that travels to AI products: the operator view is where trust lives.
If that screen is late, the whole system feels unfinished.
Same job now. Design the surface. Ship it in the product.`,
    x: `Ford OEM-aftermarket taught me this: the operator screen is where trust lives.
AI products fail the same way when that view ships last.`,
  },
  {
    slug: "model-default",
    number: "03",
    title: "If it looks like the model default",
    date: "2026-09-17",
    format: "Why-us",
    channels: ["LinkedIn", "X", "Instagram"],
    visual: "Split. Default generated UI vs a designed surface.",
    linkedin: `If your AI product still looks like the model default, that is the surface.
The tech can be serious. The screen is what a buyer, an operator, or an investor actually trusts.
I take that surface and ship it in code. Not a handoff.
paulo.dudesign.us`,
    x: `If your AI UI still looks like the model default, that is the surface.
Design it. Ship it in the product.`,
  },
  {
    slug: "how-a-surface-ships",
    number: "04",
    title: "How a surface actually ships",
    date: "2026-09-19",
    format: "Stack",
    channels: ["LinkedIn", "X"],
    visual: "Three boxes. Bet → Surface → In the product.",
    linkedin: `How a surface actually ships.
1. The bet. What the product is for, who uses it, what success looks like.
2. The surface. Flows, UX/UI, the screen a human uses.
3. In the product. Components and pages. Clickable. Not a file you hope engineering respects.
Figma is a step. It is not the product.
I work in the system you already have.`,
    x: `How a surface ships:
Bet.
Surface.
In the product.
Figma is a step. Not the product.`,
  },
  {
    slug: "not-that-hire",
    number: "05",
    title: "You do not need that hire",
    date: "2026-09-22",
    format: "Offer",
    channels: ["LinkedIn", "X"],
    visual: "Two columns. File / Code.",
    linkedin: `A lot of AI teams look for a design-engineer hire when they need a shipped interface.
That is a seat, equity, and a ramp.
I am a product designer who engineers. I design the surface and implement it. Your engineers keep the backend.
If you already have a system, I work in it.
If the interface is below the product, I raise it.
paulo.dudesign.us`,
    x: `You do not need a design-engineer seat to ship the interface.
I design it and ship it in code. Your eng keeps the rest.`,
  },
  {
    slug: "fortune-500-craft",
    number: "06",
    title: "A product designer who engineers",
    date: "2026-09-24",
    format: "Face",
    channels: ["LinkedIn", "X", "Instagram"],
    visual: "Type card. Swap your photo over it when you have one.",
    linkedin: `I'm Paulo. A product designer who engineers.
I design complex product surfaces and ship them in code.
Previously Audi, Samsung, 3M, Ford, Sony + Honda, Costco.
Now AI-native products.
paulo.dudesign.us`,
    x: `I'm Paulo. A product designer who engineers.
I design complex product surfaces and ship them in code.`,
  },
  {
    slug: "yc-landing",
    number: "07",
    title: "Partnering with a YC company",
    date: "2026-09-13",
    format: "Diary",
    channels: ["LinkedIn", "X"],
    visual: "Minimal ASCII mark. No company name. No unreleased frames.",
    linkedin: `Partnering with a YC company on their landing this week.
The brief was short. Too basic. Looks AI-generated. Fix the buttons. Keep it minimal.
That is a real product problem, not a taste argument.
The product is serious. The screen did not make the value obvious in five seconds. Competing CTAs. The thing that is the product sat at the bottom.
I am designing it in code. Same job I always do: design the surface, ship the interface.
Not a Figma dump.`,
    x: `Partnering with a YC company on their landing.
Brief: looks AI-generated. Fix the buttons. Keep it minimal.
Designing it in code. Not a file dump.`,
  },
  {
    slug: "product-was-last",
    number: "08",
    title: "The product was last on the page",
    date: "2026-09-16",
    format: "Case",
    channels: ["LinkedIn", "X", "Instagram"],
    visual: "Route diagram. Small vs promoted. No company name.",
    linkedin: `The product was at the bottom of the page.
A YC company we are partnering with routes work. Local when you can. Cloud when you must. The diagram is the product.
On the current home it shows up last, small, with no caption. The hero talks. The diagram whispers.
The move is not a new brand. Promote the diagram. Put a sentence under it a founder can repeat.
If the screen that explains the product ships last, the whole page feels unfinished.`,
    x: `The product was at the bottom of the page.
Promote the diagram. Add one sentence a founder can repeat.`,
  },
  {
    slug: "keep-the-system",
    number: "09",
    title: "Keep the system. Fix the buttons",
    date: "2026-09-18",
    format: "Stack",
    channels: ["LinkedIn", "X"],
    visual: "Three buttons. Primary / secondary / ghost.",
    linkedin: `They did not ask for a new brand.
Keep the system. Keep it minimal. Fix the buttons.
Most AI marketing pages fail there. Default serif. Accents that do not belong. Three CTAs with the same weight. The page looks generated even when the product is not.
I am building a real control system in the product. Sizes, states, light and dark. Then the rest of the page can sit on it.
Craft is usually this unglamorous.`,
    x: `They did not ask for a new brand.
Keep the system. Fix the buttons.
Most AI pages fail there.`,
  },
];

export function getSocialPost(slug: string): SocialPost | undefined {
  return socialPosts.find((post) => post.slug === slug);
}

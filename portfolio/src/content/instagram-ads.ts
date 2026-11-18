export const AD_WIDTH = 1080;
export const AD_HEIGHT = 1350;

export type AdLayout = "editorial" | "flow" | "bleed";

export type AdFlowStep = {
  index: string;
  label: string;
};

export type InstagramAd = {
  slug: string;
  number: string;
  direction: string;
  layout: AdLayout;
  headline: string[];
  credit: string;
  image: {
    src: string;
    alt: string;
    position: string;
  };
  /** Product's own decision order, taken from the published interface. */
  flow?: AdFlowStep[];
  caption: string;
  /** Shown on the review board only. Not printed on the artwork. */
  workNote: string;
  file: string;
  storyFile: string;
};

const talk = "Let’s talk about your product.";

export const instagramAds: InstagramAd[] = [
  {
    slug: "product-design",
    number: "01",
    direction: "Product design",
    layout: "editorial",
    headline: ["Thoughtful design", "for complex", "products."],
    credit: "3M · Zeno",
    image: {
      src: "/work/cases/3m-films/01.webp",
      alt: "3M Zeno kiosk, vehicle wrap interface on the shop-floor display",
      position: "46% 54%",
    },
    caption: `Thoughtful design for complex products.

I work with founders and product teams to turn complex requirements into clear, usable interfaces, from early flows to the details of the finished product.

${talk}`,
    workNote:
      "Published portfolio case. The kiosk is the work; nothing on the artwork is invented.",
    file: "01-product-design.png",
    storyFile: "01-product-design-story.png",
  },
  {
    slug: "flows-to-ui",
    number: "02",
    direction: "Design and implementation",
    layout: "flow",
    headline: ["From product flows", "to production UI."],
    credit: "Ford",
    image: {
      src: "/work/cases/ford/02.webp",
      alt: "Ford wrap program, vehicle selection on the production interface",
      position: "58% 24%",
    },
    flow: [
      { index: "01", label: "Vehicle" },
      { index: "02", label: "Trim" },
      { index: "03", label: "Paint" },
      { index: "04", label: "Wrap" },
    ],
    caption: `From product flows to production UI.

Product design and interface development, with the same attention to how a product works as how it looks.

${talk}`,
    workNote:
      "Published Ford case. Vehicle, Trim, Paint, and Wrap are the product’s own order, set in our type, not a sample interface.",
    file: "02-flows-to-ui.png",
    storyFile: "02-flows-to-ui-story.png",
  },
  {
    slug: "clearer-next-version",
    number: "03",
    direction: "An existing product",
    layout: "bleed",
    headline: ["A clearer next", "version of your", "product."],
    credit: "Afeela",
    image: {
      src: "/work/cases/afeela/02.webp",
      alt: "Afeela companion app, production countdown and share",
      position: "50% 46%",
    },
    caption: `A clearer next version of your product.

For teams improving an existing app: clearer flows, more consistent interfaces, and considered design decisions throughout.

${talk}`,
    workNote:
      "Published Afeela case, Sony + Honda. One screen from the companion app. Not presented as a before-and-after.",
    file: "03-clearer-next-version.png",
    storyFile: "03-clearer-next-version-story.png",
  },
];

export function getInstagramAd(slug: string): InstagramAd | undefined {
  return instagramAds.find((ad) => ad.slug === slug);
}

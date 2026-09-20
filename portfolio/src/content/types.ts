export type CaseDecision = {
  title: string;
  chosen: string;
  rejected: string;
};

export type CaseLink = {
  label: string;
  url: string;
};

export type CasePrototype = {
  label: string;
  url: string;
  /** When false, show CTA card only (repo links, X-Frame-Options, etc.) */
  embed?: boolean;
  /** Replace the static cover with a live prototype hero. */
  hero?: boolean;
};

export type CaseSection = {
  id: string;
  title: string;
  body: string[];
  /** Optional visuals rendered after the section copy. */
  visuals?: CaseGallerySlot[];
  /** Layout for section visuals. Defaults to full. */
  visualsLayout?: CaseGalleryBlock["layout"];
};

export type CaseGallerySlot = {
  id: string;
  label: string;
  caption?: string;
  src?: string;
  alt?: string;
  /** When variant is video, optional poster image before playback */
  poster?: string;
  /** desktop | mobile affects placeholder framing; shot keeps natural aspect */
  variant?: "desktop" | "mobile" | "video" | "shot";
};

export type CaseGalleryBlock = {
  id: string;
  title?: string;
  layout: "full" | "duo" | "grid" | "devices" | "video";
  items: CaseGallerySlot[];
};

export type CaseStudy = {
  slug: string;
  title: string;
  client: string;
  subtitle: string;
  tags: string[];
  skillsProven: string[];
  role: { owned: string[]; notOwned: string[] };
  decisions: CaseDecision[];
  collaborators: string[];
  links: CaseLink[];
  prototype?: CasePrototype;
  sections: CaseSection[];
  cover: { src: string; alt: string; fit?: "cover" | "contain" };
  logos?: { src: string; alt: string }[];
  /** Visual blocks between overview and narrative sections. */
  gallery?: CaseGalleryBlock[];
  /** Large display headline under the eyebrow. Falls back to subtitle. */
  displayTitle?: string;
  /** Short label in the eyebrow after the client, e.g. "AI WORKSPACE". */
  metaLabel?: string;
  year?: string;
  timeline?: string;
  team?: string;
  roleTitle?: string;
  featured?: boolean;
  published: boolean;
  order: number;
};

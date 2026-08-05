/**
 * Central content source for the whole site.
 *
 * Everything a future content update needs lives in this file: headings, body
 * copy, image paths, and the exhibit list/order. No component hardcodes copy,
 * so editing text here is the only step required — no code logic changes.
 */

export type Exhibit = {
  /** URL segment: /museum/<slug> */
  slug: string;
  /** Frame label in the hall and heading on the exhibit page */
  name: string;
  /** Body copy on the exhibit page */
  body: string;
  /** Path under /public, e.g. "/exhibits/projects.jpg". Empty = placeholder */
  image: string;
  /** Exactly one exhibit should be featured (gets the gold frame) */
  featured?: boolean;
};

export const site = {
  title: "Digital Museum",
  description: "A prototype personal digital museum.",
};

export const entrance = {
  heading: "About Me",
  body: "Placeholder paragraph about me. This space will eventually hold a short introduction, a bit of background, and whatever else feels worth sharing before stepping into the museum.",
  /** Path under /public for the portrait. Empty = placeholder box */
  image: "",
  imagePlaceholder: "Photo",
  /** Accessible name for the door, which is the only way in */
  doorLabel: "Enter the museum",
};

/**
 * TEMPORARY / PLACEHOLDER navigation.
 *
 * The header is a stopgap so every page has a shell to sit in. Its links are
 * generated from `exhibits` below, so the five rooms never drift out of sync.
 * Both the structure (a flat bar of five links) and the styling are expected to
 * be revisited once the museum experience is locked in — the intended way in is
 * still the entrance door, not this bar.
 */
export const nav = {
  /** Accessible name for the header landmark */
  label: "Rooms",
  homeLabel: "Digital Museum",
};

/**
 * TEMPORARY / PLACEHOLDER footer. Fills out the page shell, not a design focus.
 *
 * `links` are the social profiles, rendered as one group. `contact` is rendered
 * apart from them, hard right — it is the only one that asks for a reply.
 * Every href here is a placeholder awaiting the real handles/address.
 */
export const footer = {
  copyright: "© 2026 Dylan Wang. All rights reserved.",
  links: [
    { label: "LinkedIn", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "TikTok", href: "#" },
    { label: "YouTube", href: "#" },
  ],
  contact: { label: "Contact", href: "mailto:hello@example.com" },
};

export const hall = {
  heading: "Main Hall",
  exitLabel: "Exit",
  /** Placeholder text shown inside a frame with no image yet */
  imagePlaceholder: "Image",
};

export const exhibitPage = {
  backLabel: "Back to Museum",
};

export const exitScreen = {
  heading: "Thanks for visiting",
  body: "That concludes the walkthrough. Come back again whenever you like.",
  returnLabel: "Return to Entrance",
};

/** Hall order is left to right on desktop, top to bottom on mobile. */
export const exhibits: Exhibit[] = [
  {
    slug: "projects",
    name: "Projects",
    body: "Placeholder text describing past and current projects. Each piece here represents an idea taken from concept to completion.",
    image: "",
  },
  {
    slug: "currently-building",
    name: "Currently Building",
    body: "Placeholder text describing work in progress. This room is a living exhibit, updated as new things take shape.",
    image: "",
  },
  {
    slug: "content-creation",
    name: "Content Creation",
    body: "Placeholder text describing writing, video, and other content. This is the featured exhibit of the museum.",
    image: "",
    featured: true,
  },
  {
    slug: "hobbies",
    name: "Hobbies",
    body: "Placeholder text describing hobbies and interests outside of work, kept here for a fuller picture of who I am.",
    image: "",
  },
  {
    slug: "travels",
    name: "Travels",
    body: "Placeholder text describing places visited and stories collected along the way.",
    image: "",
  },
];

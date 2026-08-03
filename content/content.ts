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

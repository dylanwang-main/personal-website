/**
 * Central content source for the whole site.
 *
 * Everything a future content update needs lives in this file: headings, body
 * copy, image paths, and the exhibit list/order. No component hardcodes copy,
 * so editing text here is the only step required — no code logic changes.
 */

/** One slot in an exhibit's small gallery. */
export type ExhibitImage = {
  /** Path under /public, e.g. "/exhibits/projects-01.jpg". Empty = placeholder box */
  src: string;
  /** What belongs in the slot. Doubles as alt text and as the placeholder label. */
  label: string;
};

export type Exhibit = {
  /** URL segment: /museum/<slug> */
  slug: string;
  /** Frame label in the hall and heading on the exhibit page */
  name: string;
  /** One line under the heading. A hook, not a sentence of body copy. */
  subtitle: string;
  /**
   * Body copy, one string per paragraph. Every exhibit runs intro ->
   * process/detail -> closing thought, so the rooms read as one museum rather
   * than five separately written pages.
   */
  paragraphs: string[];
  /** The room's own small gallery: 2-3 slots, rendered in order. */
  images: ExhibitImage[];
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
  /** Heading above the room's gallery */
  galleryLabel: "In this room",
};

/**
 * Copy that only the featured room uses. It gets its own layout, so it gets the
 * few extra labels that layout needs — the four standard rooms have no use for
 * them. Everything else it renders still comes from its `Exhibit` entry and from
 * `exhibitPage` above, so the two layouts never drift apart on shared wording.
 */
export const featuredExhibitPage = {
  /** Small line above the heading, naming the room's status in the museum */
  eyebrow: "Featured Exhibit",
  /** Heading above the lead paragraph, set apart from the rest of the body */
  leadLabel: "The room",
  /** Caption under the large first gallery slot */
  heroLabel: "Centrepiece",
};

export const exitScreen = {
  heading: "Thanks for visiting",
  body: "That concludes the walkthrough. Come back again whenever you like.",
  returnLabel: "Return to Entrance",
};

/**
 * Hall order is left to right on desktop, top to bottom on mobile.
 *
 * PLACEHOLDER COPY, REAL STRUCTURE. Every room carries a subtitle, three
 * paragraphs in the same intro / detail / closing shape, and two or three
 * gallery slots — the shape final copy is expected to arrive in. Swapping in
 * the real words and image paths is the only step left; no component changes.
 */
export const exhibits: Exhibit[] = [
  {
    slug: "projects",
    name: "Projects",
    subtitle: "Placeholder hook — things taken from idea to finished.",
    paragraphs: [
      "Placeholder intro for the Projects room. A few sentences setting up what counts as a project here and why these particular ones are hung on the wall rather than the dozens that never left a notebook.",
      "Placeholder detail paragraph. This is where the process goes: what the constraint was, what got built, what broke on the way, and what the finished thing actually does for the person using it. Real copy will name specific projects and link out to them.",
      "Placeholder closing thought. A line or two on what the room adds up to, and what the next piece hung here is likely to be.",
    ],
    images: [
      { src: "", label: "Project one — hero shot" },
      { src: "", label: "Project two — interface detail" },
      { src: "", label: "Project three — before and after" },
    ],
  },
  {
    slug: "currently-building",
    name: "Currently Building",
    subtitle: "Placeholder hook — the wet paint room.",
    paragraphs: [
      "Placeholder intro for Currently Building. A short framing of this as a living exhibit: whatever is here is unfinished on purpose, and the room is expected to look different a month from now.",
      "Placeholder detail paragraph. The work in progress itself — what is being tried, what is still unresolved, and the open question currently being chewed on. Real copy will be dated so a stale entry is obvious at a glance.",
      "Placeholder closing thought. What has to be true for the current piece to move out of this room and into Projects.",
    ],
    images: [
      { src: "", label: "Current build — latest screenshot" },
      { src: "", label: "Sketch or whiteboard shot" },
    ],
  },
  {
    slug: "content-creation",
    name: "Content Creation",
    subtitle: "Placeholder hook — the featured wall: writing, video, everything published.",
    paragraphs: [
      "Placeholder intro for Content Creation, the featured exhibit. A few sentences on what gets made, where it goes, and who it is for — the reason this room gets the gold frame in the hall.",
      "Placeholder detail paragraph. The process end: how an idea becomes a post or a video, what the editing loop looks like, and which formats have earned their keep. Real copy will point at specific pieces and the platforms they live on.",
      "Placeholder closing thought. What is worth making next, and what the numbers have and have not changed about that answer.",
    ],
    images: [
      { src: "", label: "Featured piece — thumbnail" },
      { src: "", label: "Behind the scenes — setup shot" },
      { src: "", label: "Published work — grid or still" },
    ],
    featured: true,
  },
  {
    slug: "hobbies",
    name: "Hobbies",
    subtitle: "Placeholder hook — what the hours outside work go to.",
    paragraphs: [
      "Placeholder intro for the Hobbies room. A short setup of the handful of things done purely because they are enjoyable, with no outcome attached to them.",
      "Placeholder detail paragraph. What each one actually involves week to week, how long it has been going, and what stuck versus what got tried once and quietly abandoned.",
      "Placeholder closing thought. A line on what these have in common, and what they lend back to the work in the other rooms.",
    ],
    images: [
      { src: "", label: "Hobby one — in progress" },
      { src: "", label: "Hobby two — the gear" },
    ],
  },
  {
    slug: "travels",
    name: "Travels",
    subtitle: "Placeholder hook — places visited, and what came back with me.",
    paragraphs: [
      "Placeholder intro for the Travels room. A few sentences on where the map has been filled in so far and what tends to get sought out on arrival.",
      "Placeholder detail paragraph. One or two trips in more depth — the route, what was misjudged in the planning, and the small specific thing that ended up being the memorable part rather than the headline sight.",
      "Placeholder closing thought. Where the next stamp is likely to come from, and why that one.",
    ],
    images: [
      { src: "", label: "Trip one — landscape" },
      { src: "", label: "Trip two — street detail" },
      { src: "", label: "Trip three — the view worth the walk" },
    ],
  },
];

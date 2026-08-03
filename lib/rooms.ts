export type Room = {
  slug: string;
  name: string;
  description: string;
  featured?: boolean;
};

export const rooms: Room[] = [
  {
    slug: "projects",
    name: "Projects",
    description:
      "Placeholder text describing past and current projects. Each piece here represents an idea taken from concept to completion.",
  },
  {
    slug: "currently-building",
    name: "Currently Building",
    description:
      "Placeholder text describing work in progress. This room is a living exhibit, updated as new things take shape.",
  },
  {
    slug: "content-creation",
    name: "Content Creation",
    description:
      "Placeholder text describing writing, video, and other content. This is the featured exhibit of the museum.",
    featured: true,
  },
  {
    slug: "hobbies",
    name: "Hobbies",
    description:
      "Placeholder text describing hobbies and interests outside of work, kept here for a fuller picture of who I am.",
  },
  {
    slug: "travels",
    name: "Travels",
    description:
      "Placeholder text describing places visited and stories collected along the way.",
  },
];

export function getRoom(slug: string): Room | undefined {
  return rooms.find((room) => room.slug === slug);
}

import { exhibits, type Exhibit } from "@/content/content";

export function getExhibit(slug: string): Exhibit | undefined {
  return exhibits.find((exhibit) => exhibit.slug === slug);
}

export function exhibitSlugs(): string[] {
  return exhibits.map((exhibit) => exhibit.slug);
}

import { notFound } from "next/navigation";
import { getExhibit, exhibitSlugs } from "@/lib/exhibits";
import ExhibitReveal from "@/components/ExhibitReveal";
import FeaturedExhibitReveal from "@/components/FeaturedExhibitReveal";

export function generateStaticParams() {
  return exhibitSlugs().map((room) => ({ room }));
}

export default async function Exhibit({
  params,
}: {
  params: Promise<{ room: string }>;
}) {
  const { room: slug } = await params;
  const exhibit = getExhibit(slug);

  if (!exhibit) {
    notFound();
  }

  // Keyed off the same `featured` flag that gives the room its gold frame in the
  // hall, so content.ts stays the single place that decides which room is the
  // featured one — no slug is named here.
  return exhibit.featured ? (
    <FeaturedExhibitReveal exhibit={exhibit} />
  ) : (
    <ExhibitReveal exhibit={exhibit} />
  );
}

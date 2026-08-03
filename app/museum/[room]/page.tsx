import { notFound } from "next/navigation";
import { getExhibit, exhibitSlugs } from "@/lib/exhibits";
import ExhibitReveal from "@/components/ExhibitReveal";

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

  return <ExhibitReveal name={exhibit.name} body={exhibit.body} />;
}

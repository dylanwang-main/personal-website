import { notFound } from "next/navigation";
import { getExhibit, exhibitSlugs } from "@/lib/exhibits";
import PortfolioRoom from "@/components/rooms/PortfolioRoom";
import WorkshopRoom from "@/components/rooms/WorkshopRoom";
import FeaturedRoom from "@/components/rooms/FeaturedRoom";
import CollectionRoom from "@/components/rooms/CollectionRoom";
import JourneyRoom from "@/components/rooms/JourneyRoom";

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

  switch (exhibit.layout) {
    case "portfolio":
      return <PortfolioRoom exhibit={exhibit} />;
    case "workshop":
      return <WorkshopRoom exhibit={exhibit} />;
    case "featured":
      return <FeaturedRoom exhibit={exhibit} />;
    case "collection":
      return <CollectionRoom exhibit={exhibit} />;
    case "journey":
      return <JourneyRoom exhibit={exhibit} />;
  }
}

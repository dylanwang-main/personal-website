import { notFound } from "next/navigation";
import { getRoom, rooms } from "@/lib/rooms";
import ExhibitReveal from "@/components/ExhibitReveal";

export function generateStaticParams() {
  return rooms.map((room) => ({ room: room.slug }));
}

export default async function Exhibit({
  params,
}: {
  params: Promise<{ room: string }>;
}) {
  const { room: slug } = await params;
  const room = getRoom(slug);

  if (!room) {
    notFound();
  }

  return <ExhibitReveal name={room.name} description={room.description} />;
}

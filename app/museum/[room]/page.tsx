import Link from "next/link";
import { notFound } from "next/navigation";
import { getRoom, rooms } from "@/lib/rooms";

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

  return (
    <main className="flex flex-1 flex-col items-center gap-8 px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold">{room.name}</h1>
      <p className="max-w-xl text-neutral-600 dark:text-neutral-400">
        {room.description}
      </p>
      <Link
        href="/museum"
        className="border border-neutral-300 px-6 py-3 transition hover:scale-105 dark:border-neutral-700"
      >
        Back to Museum
      </Link>
    </main>
  );
}

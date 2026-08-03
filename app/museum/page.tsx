import Link from "next/link";
import { rooms } from "@/lib/rooms";

export default function Museum() {
  return (
    <main className="flex flex-1 flex-col items-center gap-12 px-6 py-16">
      <h1 className="text-2xl font-semibold">Main Hall</h1>

      <div className="flex w-full max-w-6xl flex-col gap-8 md:flex-row md:items-stretch">
        {rooms.map((room) => (
          <Link
            key={room.slug}
            href={`/museum/${room.slug}`}
            className={`flex flex-1 flex-col items-center gap-4 border p-6 transition hover:scale-105 ${
              room.featured
                ? "border-2 border-amber-500"
                : "border-neutral-300 dark:border-neutral-700"
            }`}
          >
            <div className="flex h-32 w-full items-center justify-center bg-neutral-100 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
              Image
            </div>
            <span className="text-center font-medium">{room.name}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}

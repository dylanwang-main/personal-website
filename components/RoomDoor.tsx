import Link from "next/link";
import { RoomPaifang, roomOpeningStyle } from "@/components/Paifang";
import type { Exhibit } from "@/content/content";

/**
 * A room's gate on the entrance: a small paifang in the same hand as the main
 * gate, plainer by rank, with the room's name under its beam and its teaser
 * below the floor line. Clicking goes straight into the room, a shortcut past
 * the main gate.
 *
 * The featured room's roof is gold, the same mark its frame carries in the
 * hall, so the room the museum leads with is visible from outside too.
 *
 * Read as "Projects room: Shipped work." — the visually hidden noun and colon
 * keep the name and teaser from running together.
 */
export default function RoomDoor({ exhibit }: { exhibit: Exhibit }) {
  return (
    <Link
      href={`/museum/${exhibit.slug}`}
      className="group flex flex-col items-center gap-4 text-center focus-visible:outline-none"
    >
      <span className="relative block h-32 w-24">
        <RoomPaifang featured={exhibit.featured} />
        <span
          className="absolute flex justify-center px-0.5 pt-3 font-display text-sm leading-tight text-balance text-ink"
          style={roomOpeningStyle}
        >
          {exhibit.name}
        </span>
      </span>
      <span className="sr-only"> room: </span>
      <span className="max-w-[11rem] text-sm leading-snug text-muted transition-colors duration-300 group-hover:text-ink group-focus-visible:text-ink">
        {exhibit.teaser}
      </span>
    </Link>
  );
}

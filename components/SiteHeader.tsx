"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import { beginMorph } from "@/components/Morph";
import { exhibits, nav } from "@/content/content";

/**
 * TEMPORARY / PLACEHOLDER header.
 *
 * A flat bar of the five rooms so every page has a shell. Both structure and
 * styling are meant to be revisited once the museum experience is locked in —
 * the entrance door is still the intended way in, this is a shortcut.
 *
 * Frosted glass: it sits above the page and lets it show through, so the wall
 * colour behind stays readable in both themes.
 *
 * Fixed, and outside the wrapper every route change animates, so it is the still
 * reference point a frame flying from the hall into an exhibit is read against.
 * It needs nothing of its own to stay put.
 *
 * A room link is a second way of walking into a painting, and from the hall it
 * behaves like one: every frame is on the wall, so framer pairs the room's frame
 * and flies it into the banner whether the visitor clicked the frame or its name
 * up here. The flag has to be set for those clicks too, or the page fade would
 * play over the flight. Only from the hall, though — from inside another room
 * there is no matching frame mounted, nothing flies, and the fade is the whole
 * transition.
 */
export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header
      className="fixed top-0 right-0 left-0 z-30 h-14 border-b border-frame/40 bg-wall/55 backdrop-blur-xl backdrop-saturate-150"
      style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" }}
    >
      <div className="mx-auto flex h-full max-w-6xl items-center gap-6 px-6">
        <Link
          href="/"
          className="font-display text-sm whitespace-nowrap text-ink"
        >
          {nav.homeLabel}
        </Link>

        <nav aria-label={nav.label} className="flex-1 overflow-x-auto">
          <ul className="flex items-center gap-5">
            {exhibits.map((exhibit) => (
              <li key={exhibit.slug}>
                <Link
                  href={`/museum/${exhibit.slug}`}
                  onClick={() => {
                    if (pathname === "/museum") beginMorph(exhibit.slug);
                  }}
                  className="border-b border-transparent pb-0.5 text-xs tracking-[0.12em] whitespace-nowrap text-muted uppercase transition-colors hover:border-gold-deep hover:text-ink"
                >
                  {exhibit.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}

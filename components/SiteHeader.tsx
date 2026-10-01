"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import FloorPlan from "@/components/FloorPlan";
import { nav } from "@/content/content";

/**
 * Museum header. A slim frosted-glass bar with three elements:
 *
 *   1. The visitor's name as the home link (back to the entrance).
 *   2. A "Floor Plan" button that opens a spatial map overlay.
 *   3. The theme toggle.
 *
 * The flat list of room links is gone — the floor plan extends the museum
 * metaphor instead of undermining it with a conventional nav bar.
 *
 * Fixed, outside the wrapper every route change animates, so it is the still
 * reference point a frame flying from the hall into an exhibit is read against.
 */
export default function SiteHeader() {
  const [floorPlanOpen, setFloorPlanOpen] = useState(false);
  // On the entrance the name is already the hero, so the header's copy of it
  // steps back rather than repeating it at full strength.
  const atEntrance = usePathname() === "/";

  return (
    <>
      <header
        className="fixed top-0 right-0 left-0 z-30 h-14 border-b border-frame/20 bg-wall/70 backdrop-blur-xl backdrop-saturate-150"
        style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)" }}
      >
        <div className="mx-auto flex h-full max-w-6xl items-center gap-6 px-6">
          <Link
            href="/"
            data-cursor="home"
            aria-current={atEntrance ? "page" : undefined}
            className={`font-display text-sm whitespace-nowrap transition-colors ${
              atEntrance ? "text-muted hover:text-ink" : "text-ink"
            }`}
          >
            {nav.homeLabel}
          </Link>

          <div className="flex-1" />

          <button
            type="button"
            onClick={() => setFloorPlanOpen(true)}
            data-cursor="explore"
            className="rounded-full border border-frame bg-panel/70 px-3 py-2.5 text-xs whitespace-nowrap text-muted transition hover:scale-105 hover:text-ink"
          >
            {nav.floorPlanLabel}
          </button>

          <ThemeToggle />
        </div>
      </header>

      <FloorPlan
        open={floorPlanOpen}
        onClose={() => setFloorPlanOpen(false)}
      />
    </>
  );
}

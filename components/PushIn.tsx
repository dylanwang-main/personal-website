"use client";

import { createContext, useContext, useMemo, useState } from "react";

/**
 * The painting-click push-in: walking into a canvas in the hall and arriving
 * inside its room.
 *
 * The move is three things happening to one navigation, and this module is the
 * bit of shared state that lets them agree on which navigation it is:
 *
 *   1. the clicked canvas morphs into the exhibit's banner — a matched pair of
 *      <ViewTransition name={canvasName(slug)}> elements, one on each page;
 *   2. everything else on the hall pushes past the camera — the root snapshot,
 *      scaled and blurred by CSS in globals.css;
 *   3. the exhibit's own content arrives after that settles — a delay on the
 *      root snapshot's fade in.
 *
 * Only the canvas that was clicked may carry a `view-transition-name`. A named
 * element is lifted out of the root snapshot, so naming all five would leave
 * four paintings excluded from the push and scaling about their own centres,
 * which reads as five frames growing rather than as one camera moving.
 *
 * Held above PageTransition in the root layout so it survives the navigation:
 * the hall sets it on click and the exhibit page, which mounts after the route
 * has already changed, reads it to decide whether to name its banner.
 */
type PushIn = {
  /** Slug of the room being walked into, or null when nothing is in flight. */
  slug: string | null;
  begin: (slug: string) => void;
  end: () => void;
};

const PushInContext = createContext<PushIn>({
  slug: null,
  begin: () => {},
  end: () => {},
});

/** The shared name for a room's canvas, on both sides of the morph. */
export function canvasName(slug: string) {
  return `canvas-${slug}`;
}

/**
 * Arms the root scale/blur for the next navigation and tells it where the camera
 * is pushing from.
 *
 * The `data-push` attribute is what scopes the animation: `::view-transition-*`
 * rules apply to every navigation otherwise, and the entrance threshold and the
 * exit curtains have their own overlays that a root push would fight. The origin
 * is in viewport pixels, which is the root snapshot's own coordinate space.
 */
export function armPushIn(origin: { x: number; y: number }) {
  const root = document.documentElement;
  root.style.setProperty("--push-origin-x", `${origin.x}px`);
  root.style.setProperty("--push-origin-y", `${origin.y}px`);
  root.dataset.push = "";
}

export function disarmPushIn() {
  delete document.documentElement.dataset.push;
}

export function PushInProvider({ children }: { children: React.ReactNode }) {
  const [slug, setSlug] = useState<string | null>(null);

  const value = useMemo<PushIn>(
    () => ({
      slug,
      begin: (next) => setSlug(next),
      end: () => setSlug(null),
    }),
    [slug],
  );

  return <PushInContext value={value}>{children}</PushInContext>;
}

export function usePushIn() {
  return useContext(PushInContext);
}

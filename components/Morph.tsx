/**
 * Walking into a painting: the framed canvas in the hall and the banner at the
 * top of an exhibit page are one object, and the move between them is a framer
 * shared layout animation — both sides render a <Frame layoutId={...}>
 * carrying the same id, and framer interpolates the box across the route change.
 *
 * That works without any coordination, so nothing here performs the morph. This
 * is a single flag answering one question: is the navigation happening right now
 * a morph, or an ordinary route change? Two things need the answer at their
 * first render and neither can work it out for itself:
 *
 *   PageTransition  must stand down. Its fade covers the arriving page, and the
 *                   frame is part of that page — fading an ancestor of the
 *                   flying frame is exactly what turns a morph back into the
 *                   crossfade it is supposed to replace.
 *   MorphReveal     delays the exhibit's copy behind the morph, so the sequence
 *                   is arrival and then reading. Only when there was a morph; a
 *                   direct load has nothing to wait for.
 *
 * A module variable rather than state or context, for the same reason
 * PageTransition tracks its first render in one: flipping it must not itself
 * cause a render. It is written in a click handler and read during the render
 * that the same click's navigation produces, so a plain assignment is already
 * visible everywhere it is needed — a provider would add a re-render of the
 * whole tree to a frame that is about to mount a new route and start an
 * animation, and buy nothing.
 *
 * Set by whichever side is being left — the hall's frames, an exhibit's back
 * link, a header link pointing at a room whose frame is on screen — and cleared
 * by PageTransition once the arriving route has mounted. Anything navigating
 * without a frame to fly leaves it alone, which is what keeps the ordinary fade
 * on ordinary route changes.
 */
let pending: string | null = null;

/** Marks the navigation being started as the morph for `slug`. */
export function beginMorph(slug: string) {
  pending = slug;
}

/** The room being morphed to or from, or null outside a morph. Render-safe. */
export function pendingMorph() {
  return pending;
}

/**
 * Consumes the flag. Called once the destination has mounted and both readers
 * have latched it — see PageTransition, which owns the teardown because it is
 * the last effect to run on the arriving page.
 */
export function clearMorph() {
  pending = null;
}

/**
 * The shared layout id for a room's framed canvas, on both sides of the morph.
 *
 * One id per room, applied unconditionally on both pages — framer pairs whatever
 * it finds mounted under the same id in a single commit. Nothing has to know in
 * advance which frame is about to be clicked, which is the whole difference from
 * a view-transition name: those may only be applied to the one element taking
 * part, because a name is a document-wide claim.
 */
export function frameLayoutId(slug: string) {
  return `frame-${slug}`;
}

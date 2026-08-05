/**
 * Shared motion tokens.
 *
 * Durations are seconds and are the single source callers sequence off — a
 * transition's follow-up (navigation, next phase) is timed from the constant
 * rather than from an animation callback, so it fires exactly once per
 * interaction regardless of re-renders.
 */

/** Snappy ease-out. Quick to leave, gentle to land. Hover-scale anticipation. */
export const EASE_SNAP = [0.2, 0.9, 0.3, 1] as const;

/** Near-expo out. Decisive departure, hard stop — reads as weight hitting a stop. */
export const EASE_THUNK = [0.16, 1, 0.3, 1] as const;

/** Symmetric in-out for full-screen wipes. */
export const EASE_WIPE = [0.65, 0, 0.35, 1] as const;

/**
 * Camera push. Slow to leave, accelerates through the middle, settles at the end
 * — a dolly move rather than a wipe. Only the entrance threshold uses it.
 */
export const EASE_PUSH = [0.72, 0, 0.24, 1] as const;

/** Door: idle -> ajar, on hover/focus. */
export const DOOR_CRACK = 0.16;

/** Door: ajar -> fully swung, including the anticipation beat. */
export const DOOR_SWING = 0.34;

/**
 * Painting frame expanding to fill the viewport, before navigating.
 *
 * Deliberately short: the hall is browsed repeatedly, so this one has to stay
 * out of the way. It is not the entrance threshold — see THRESHOLD_DURATION.
 */
export const ZOOM_DURATION = 0.4;

/**
 * Stepping through the entrance door. The site's signature moment and a
 * one-time one, so it is paced as a shot rather than a transition: long enough
 * to read as walking into a room, and several times the length of anything else
 * on the site.
 */
export const THRESHOLD_DURATION = 1.6;

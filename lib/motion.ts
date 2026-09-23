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

/**
 * Arrival sequence, in order: the name fades up on near-black, holds, then the
 * veil lifts to reveal the entrance. Sequenced off these three the same way the
 * door is — each beat advances on the previous one's duration.
 *
 * Kept under three seconds in total. It runs once per session (see the entrance
 * page), so the cost is paid on a first visit and never on the way back from the
 * exit, but it is still time before the visitor can do anything.
 */
export const ARRIVAL_NAME = 0.5;
export const ARRIVAL_HOLD = 0.4;
export const ARRIVAL_LIFT = 0.45;

/** Kinetic tagline: how long a phrase holds, and the crossfade between them. */
export const TAGLINE_HOLD = 2.0;
export const TAGLINE_FADE = 0.3;

/**
 * Ambient background drift. Deliberately far longer than any interaction on the
 * site: at this length the movement is never the thing being watched, it only
 * keeps the page from reading as a still image.
 */
export const AMBIENT_DRIFT = 42;

/** The door's breathing cue: one full in-and-out. */
export const DOOR_BREATH = 2.4;

/** Door: idle -> ajar, on hover/focus. */
export const DOOR_CRACK = 0.16;

/** Door: ajar -> fully swung, including the anticipation beat. */
export const DOOR_SWING = 0.34;

/**
 * Walking into a painting: the framed canvas in the hall morphing into the
 * banner at the top of its exhibit page, and back again on the way out.
 *
 * Long enough to be watched rather than glimpsed — the frame travels most of the
 * viewport and changes aspect ratio on the way, and under about 400ms that reads
 * as a jump cut. Still a fraction of the entrance threshold, which is the grand
 * one-time moment; this one is walked through repeatedly. See
 * THRESHOLD_DURATION.
 *
 * Unlike the rest of the file this is not a sequencing constant: framer drives
 * the morph and knows when it is finished. It is shared so both sides of the
 * morph animate on identical timing, and so the exhibit's copy can be delayed
 * behind it.
 */
export const MORPH_DURATION = 0.3;

/**
 * Symmetric ease for the morph. Eases out of the wall and into the banner with
 * the same weight at both ends, because the same curve plays in reverse on the
 * way back to the hall — an asymmetric curve would make the return trip feel
 * like a different move.
 */
export const EASE_MORPH = [0.4, 0, 0.2, 1] as const;

/** How long the exhibit's copy waits for the morph to settle before arriving. */
export const MORPH_SETTLE = 0.15;

/**
 * Stepping through the entrance door. The site's signature moment and a
 * one-time one, so it is paced as a shot rather than a transition: long enough
 * to read as walking into a room, and several times the length of anything else
 * on the site.
 */
export const THRESHOLD_DURATION = 0.8;

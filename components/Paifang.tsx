/**
 * Paifang (牌坊), the ceremonial gateway, drawn as fine ink lines. Two sizes of
 * the same architecture: the entrance gate and the rooms' small gates.
 *
 * They differ in rank rather than in decoration. The entrance has a second,
 * ridge roof over the eave, a name plaque hung between two beams, and stone
 * bases under its posts; a room gate is one roof stroke, one beam and two posts.
 * Neither carries tiles, brackets or ornament — the gate is a line drawing on
 * the wall, in the same hand as the frames.
 *
 * Both are decorative SVG laid over a `relative group` element, which owns the
 * label and the click. Lines are ink at 55%, which clears 3:1 against the wall
 * in both themes (WCAG 1.4.11); hover and keyboard focus take them to full ink
 * and raise a light in the opening. Focus is drawn this way, not with an
 * outline ring, which would box in the open gate.
 *
 * Strokes do not scale with the drawing (`vector-effect`), so both sizes are
 * drawn at the same 1px hairline.
 */

const LINE =
  "text-ink/55 transition-colors duration-300 group-hover:text-ink group-focus-visible:text-ink";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  vectorEffect: "non-scaling-stroke",
} as const;

/** Light from beyond the gate, rising from the floor of the opening. */
function OpeningLight({ style }: { style: React.CSSProperties }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
      style={{
        background:
          "linear-gradient(to top, color-mix(in srgb, var(--ink) 18%, transparent), color-mix(in srgb, var(--ink) 4%, transparent) 70%, transparent)",
        ...style,
      }}
    />
  );
}

/** The floor line the gate stands on, fading out at both ends. */
function Sill({ overhang }: { overhang: string }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute bottom-0 h-px opacity-70 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
      style={{
        left: `-${overhang}`,
        right: `-${overhang}`,
        background:
          "linear-gradient(90deg, transparent, var(--ink) 25%, var(--ink) 75%, transparent)",
      }}
    />
  );
}

/*
 * Entrance gate geometry, in a 200 × 166 box: a little wider than tall, so the
 * gate spreads across the hero rather than standing in it like a door. Kept as
 * numbers so the HTML plaque label and the opening light can be placed on the
 * same grid as the drawing.
 */
const E = {
  w: 200,
  h: 166,
  postL: 40,
  postR: 160,
  beamTop: 48,
  plaqueTop: 53,
  plaqueBottom: 79,
  beamBottom: 84,
  plaqueL: 64,
  plaqueR: 136,
  baseTop: 152,
};
const pct = (v: number, of: number) => `${(v / of) * 100}%`;

/**
 * The entrance gate. Its plaque holds the label, positioned by the caller's
 * children over `plaqueStyle`.
 */
export function EntrancePaifang() {
  return (
    <>
      <OpeningLight
        style={{
          left: pct(E.postL, E.w),
          right: pct(E.w - E.postR, E.w),
          top: pct(E.beamBottom, E.h),
          bottom: 0,
        }}
      />
      <svg
        aria-hidden
        viewBox={`0 0 ${E.w} ${E.h}`}
        className={`pointer-events-none absolute inset-0 h-full w-full overflow-visible ${LINE}`}
      >
        {/* Ridge roof, with its ends turned up. */}
        <path {...stroke} d="M56 9 Q59 13 64 13 L136 13 Q141 13 144 9" />
        {/* The roof's faces, falling from ridge to eave. */}
        <path {...stroke} d="M64 13 Q56 25 38 33 M136 13 Q144 25 162 33" />
        {/* Eave, sweeping up at both corners. */}
        <path {...stroke} d="M6 27 Q16 35 32 36 L168 36 Q184 35 194 27" />

        {/* Posts, rising a little above the top beam. */}
        <path
          {...stroke}
          d={`M${E.postL} 40 V${E.baseTop} M${E.postR} 40 V${E.baseTop}`}
        />

        {/* Beams: the upper one runs past the posts, as on the real thing. */}
        <path {...stroke} d={`M${E.postL - 12} ${E.beamTop} H${E.postR + 12}`} />
        <path {...stroke} d={`M${E.postL} ${E.beamBottom} H${E.postR}`} />

        {/* Name plaque, double bordered, hung between the beams. */}
        <rect
          {...stroke}
          x={E.plaqueL}
          y={E.plaqueTop}
          width={E.plaqueR - E.plaqueL}
          height={E.plaqueBottom - E.plaqueTop}
        />
        <rect
          {...stroke}
          className="opacity-50"
          x={E.plaqueL + 3}
          y={E.plaqueTop + 3}
          width={E.plaqueR - E.plaqueL - 6}
          height={E.plaqueBottom - E.plaqueTop - 6}
        />

        {/* Stone bases clasping the foot of each post. */}
        <path
          {...stroke}
          d={`M${E.postL - 6} ${E.h} V${E.baseTop} H${E.postL + 6} V${E.h} M${E.postR - 6} ${E.h} V${E.baseTop} H${E.postR + 6} V${E.h}`}
        />
      </svg>
      <Sill overhang="1.5rem" />
    </>
  );
}

/** Where the entrance plaque sits, for the label laid into it. */
export const plaqueStyle: React.CSSProperties = {
  left: pct(E.plaqueL, E.w),
  right: pct(E.w - E.plaqueR, E.w),
  top: pct(E.plaqueTop, E.h),
  bottom: pct(E.h - E.plaqueBottom, E.h),
};

/*
 * Room gate geometry, in a 96 × 128 box: one roof stroke, one beam, two posts.
 */
const R = { w: 96, h: 128, postL: 20, postR: 76, beam: 30 };

/** Where a room gate's opening starts, for the room name set under its beam. */
export const roomOpeningStyle: React.CSSProperties = {
  left: pct(R.postL, R.w),
  right: pct(R.w - R.postR, R.w),
  top: pct(R.beam, R.h),
};

/**
 * A room's small gate. `featured` gives its roof the gold the featured room's
 * frame carries in the hall, the one place gold appears on the entrance.
 */
export function RoomPaifang({ featured = false }: { featured?: boolean }) {
  return (
    <>
      <OpeningLight style={{ ...roomOpeningStyle, bottom: 0 }} />
      <svg
        aria-hidden
        viewBox={`0 0 ${R.w} ${R.h}`}
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      >
        <path
          {...stroke}
          className={
            featured
              ? "text-gold-deep transition-colors duration-300 group-hover:text-gold group-focus-visible:text-gold"
              : LINE
          }
          d={`M4 14 Q10 20 18 20 L78 20 Q86 20 92 14`}
        />
        <path
          {...stroke}
          className={LINE}
          d={`M14 ${R.beam} H82 M${R.postL} 20 V${R.h} M${R.postR} 20 V${R.h}`}
        />
      </svg>
      <Sill overhang="0.75rem" />
    </>
  );
}

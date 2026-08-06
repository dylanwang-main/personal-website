const corners = [
  "top-1 left-1",
  "top-1 right-1",
  "bottom-1 left-1",
  "bottom-1 right-1",
];

/**
 * A framed canvas on the hall wall: moulding, corner studs, and whatever the
 * caller hangs inside it.
 *
 * The canvas is a slot rather than a prop because the painting-click transition
 * has to name that element and nothing around it — the moulding belongs to the
 * hall and is pushed past the camera, the canvas is the object that survives the
 * cut. See PushIn.
 */
export default function OrnateFrame({
  tone,
  name,
  children,
}: {
  tone: "gold" | "neutral";
  name: string;
  /** The canvas. Expected to fill the width it is given and set its own height. */
  children: React.ReactNode;
}) {
  const isGold = tone === "gold";

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {/* Width capped on mobile: full-width at 2:3 would be a canvas taller
          than the screen. Desktop splits the row five ways, so no cap there. */}
      <div
        className={`relative w-full max-w-[220px] p-1 transition-shadow duration-300 md:max-w-none ${
          isGold
            ? "shadow-[0_0_0_1px_var(--gold-deep)] group-hover:shadow-[0_0_28px_rgba(212,175,55,0.45)]"
            : "shadow-[0_0_0_1px_var(--frame)] group-hover:shadow-[0_0_16px_rgba(0,0,0,0.18)]"
        }`}
      >
        <div
          className="relative w-full p-3"
          style={{
            background: isGold
              ? "linear-gradient(135deg, var(--gold), var(--gold-deep))"
              : "linear-gradient(135deg, var(--frame), var(--ink))",
            boxShadow:
              "inset 0 2px 6px rgba(0,0,0,0.35), inset 0 -2px 6px rgba(255,255,255,0.08)",
          }}
        >
          {corners.map((position) => (
            <span
              key={position}
              className={`absolute h-2 w-2 rotate-45 ${position}`}
              style={{
                background: isGold ? "#fff6da" : "rgba(255,255,255,0.45)",
              }}
            />
          ))}

          {children}
        </div>
      </div>

      <span className="text-center font-medium text-ink">{name}</span>
    </div>
  );
}

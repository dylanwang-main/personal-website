const corners = [
  "top-1 left-1",
  "top-1 right-1",
  "bottom-1 left-1",
  "bottom-1 right-1",
];

export default function OrnateFrame({
  tone,
  name,
}: {
  tone: "gold" | "neutral";
  name: string;
}) {
  const isGold = tone === "gold";

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div
        className={`relative w-full p-1 transition-shadow duration-300 ${
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
                background: isGold
                  ? "#fff6da"
                  : "rgba(255,255,255,0.45)",
              }}
            />
          ))}

          <div
            className="flex h-32 w-full items-center justify-center bg-panel text-sm text-muted md:h-40"
            style={{ boxShadow: "inset 0 2px 10px rgba(0,0,0,0.25)" }}
          >
            Image
          </div>
        </div>
      </div>

      <span className="text-center font-medium text-ink">{name}</span>
    </div>
  );
}

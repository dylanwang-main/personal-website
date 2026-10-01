/**
 * A museum wall placard: a small caps label over a short value, under a hairline.
 *
 * Reads as the card beside an object rather than as a statistic — the label is
 * the quiet part and the value is the thing being read, which is the opposite of
 * how a metric tile is usually weighted.
 *
 * `definition` renders the pair as <dt>/<dd> for use inside a <dl>, where the
 * placards are the lines of one object label. `linked` is for a placard that is
 * the content of a link: the hairline and value brighten on the link's hover.
 */
export default function Placard({
  label,
  value,
  definition = false,
  linked = false,
}: {
  label: string;
  value: string;
  definition?: boolean;
  linked?: boolean;
}) {
  const Label = definition ? "dt" : "span";
  const Value = definition ? "dd" : "span";

  return (
    <div className="flex flex-col gap-2 pt-3">
      <span
        aria-hidden
        className={`-mt-3 mb-1 h-px w-full ${
          linked ? "opacity-70 transition-opacity duration-300 group-hover:opacity-100" : ""
        }`}
        style={{
          background: linked
            ? "linear-gradient(90deg, var(--muted), transparent 80%)"
            : "linear-gradient(90deg, var(--frame), transparent 80%)",
        }}
      />
      <Label className="text-[0.72rem] tracking-[0.12em] text-muted uppercase">
        {label}
      </Label>
      <Value
        className={`text-sm text-ink ${
          linked
            ? "underline decoration-transparent underline-offset-4 transition-colors duration-300 group-hover:decoration-muted"
            : ""
        }`}
      >
        {value}
      </Value>
    </div>
  );
}

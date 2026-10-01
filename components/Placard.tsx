/**
 * A museum wall placard: a small caps label over a short value, under a hairline.
 *
 * Reads as the card beside an object rather than as a statistic — the label is
 * the quiet part and the value is the thing being read, which is the opposite of
 * how a metric tile is usually weighted.
 *
 * `definition` renders the pair as <dt>/<dd> for use inside a <dl>, where the
 * placards are the lines of one object label.
 */
export default function Placard({
  label,
  value,
  definition = false,
}: {
  label: string;
  value: string;
  definition?: boolean;
}) {
  const Label = definition ? "dt" : "span";
  const Value = definition ? "dd" : "span";

  return (
    <div className="flex flex-col gap-2 pt-3">
      <span
        aria-hidden
        className="-mt-3 mb-1 h-px w-full"
        style={{
          background: "linear-gradient(90deg, var(--frame), transparent 80%)",
        }}
      />
      <Label className="text-[0.72rem] tracking-[0.12em] text-muted uppercase">
        {label}
      </Label>
      <Value className="text-sm text-ink">
        {value}
      </Value>
    </div>
  );
}

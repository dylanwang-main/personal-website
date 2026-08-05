/**
 * A museum wall placard: a small caps label over a short value, under a hairline.
 *
 * Reads as the card beside an object rather than as a statistic — the label is
 * the quiet part and the value is the thing being read, which is the opposite of
 * how a metric tile is usually weighted.
 */
export default function Placard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-2 border-t border-frame pt-3">
      <span className="text-[0.65rem] tracking-[0.16em] text-muted uppercase">
        {label}
      </span>
      <span className="text-sm text-ink">{value}</span>
    </div>
  );
}

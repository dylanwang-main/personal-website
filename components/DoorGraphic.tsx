/**
 * Entrance door. Purely presentational — the parent makes it interactive, so
 * the whole door is one clickable element with no button layered on top.
 */
export default function DoorGraphic() {
  return (
    <div
      className="relative w-60 rounded-t-lg border-2 border-frame bg-panel p-3 shadow-lg transition-transform duration-300 group-hover:-translate-y-0.5 sm:w-72"
      style={{ aspectRatio: "5 / 8" }}
    >
      {/* Door slab, recessed inside the architrave */}
      <div
        className="relative flex h-full w-full flex-col gap-3 rounded-t-md border border-frame p-3"
        style={{ boxShadow: "inset 0 2px 10px rgba(0,0,0,0.25)" }}
      >
        {/* Recessed panel detailing */}
        <div
          className="flex-[3] rounded-t-sm border border-frame/70"
          style={{ boxShadow: "inset 0 1px 6px rgba(0,0,0,0.22)" }}
        />
        <div
          className="flex-[2] border border-frame/70"
          style={{ boxShadow: "inset 0 1px 6px rgba(0,0,0,0.22)" }}
        />

        {/* Handle plate and knob */}
        <div className="absolute top-1/2 right-3 -translate-y-1/2">
          <div className="flex h-10 w-3 items-center justify-center rounded-sm border border-frame bg-frame/25">
            <span className="h-2.5 w-2.5 rounded-full border border-frame bg-frame/70" />
          </div>
        </div>
      </div>
    </div>
  );
}

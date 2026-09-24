import Canvas from "@/components/Canvas";
import OrnateFrame from "@/components/OrnateFrame";
import type { ExhibitImage } from "@/content/content";

/**
 * One hung piece in a room's gallery: the frame, the canvas inside it, and the
 * placard under it.
 *
 * The frame is the same component as the wall upstairs, cut lighter — a room's
 * gallery is more of the museum, not a different site section with thumbnails
 * in it. Only the featured room's centrepiece takes the gold tone; everything
 * else is standard, so gold stays the mark of one exhibit rather than a
 * decoration applied wherever there is room for it.
 *
 * The ratio is fixed by the caller and never derived from the image, which is
 * what keeps a wall stable: every slot on this site is empty today, and swapping
 * a photograph into content.ts must not move anything around it.
 *
 * The placard is always readable rather than revealed on hover. It is the card
 * beside the object — half of what a visitor reads in a gallery — and a hover
 * caption would be invisible on a phone and to anyone scanning the page.
 */
export default function GallerySlot({
  image,
  ratio,
  sizes,
  tone = "neutral",
  overline,
}: {
  image: ExhibitImage;
  /** Tailwind aspect class, e.g. "aspect-[4/3]". Fixed per row, never per image. */
  ratio: string;
  /** Passed to next/image. */
  sizes: string;
  /** Gold is reserved for the featured room's centrepiece. */
  tone?: "gold" | "neutral";
  /** Small line above the label, naming the slot's role. Centrepiece only. */
  overline?: string;
}) {
  return (
    <figure className="flex flex-col">
      <OrnateFrame tone={tone} scale="slot">
        <Canvas image={image} sizes={sizes} className={`w-full ${ratio}`} />
      </OrnateFrame>

      <figcaption className="mt-3 flex flex-col gap-1 pt-2">
        <span
          aria-hidden
          className="-mt-2 mb-1 h-px w-full"
          style={{
            background: overline
              ? "linear-gradient(90deg, var(--gold-deep), transparent 70%)"
              : "linear-gradient(90deg, var(--frame), transparent 60%)",
          }}
        />
        {overline && (
          <span
            className="text-[0.65rem] tracking-[0.1em] uppercase"
            style={{ color: "var(--gold)" }}
          >
            {overline}
          </span>
        )}
        <span
          className={
            overline
              ? "text-sm text-ink"
              : "text-[0.7rem] tracking-[0.12em] text-muted uppercase"
          }
        >
          {image.label}
        </span>
      </figcaption>
    </figure>
  );
}

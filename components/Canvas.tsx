import Image from "next/image";
import type { ExhibitImage } from "@/content/content";

/**
 * A stretched canvas: the artwork, or the label of the artwork that has not been
 * shot yet.
 *
 * The same component fills a frame on the hall wall and the banner at the top of
 * an exhibit page, because those two are the same object seen from two distances
 * — the push-in morphs one into the other, so anything that differed between
 * them would show up as a flicker mid-flight. Callers set the shape; everything
 * inside it is fixed here.
 */
export default function Canvas({
  image,
  sizes,
  className = "",
  style,
}: {
  image: ExhibitImage;
  /** Passed straight to next/image. Required — the two uses are very different widths. */
  sizes: string;
  /** Shape only: width and aspect ratio or height. */
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-panel px-4 text-center text-sm text-muted ${className}`}
      style={{ boxShadow: "inset 0 2px 10px rgba(0,0,0,0.25)", ...style }}
    >
      {image.src ? (
        <Image
          src={image.src}
          alt={image.label}
          fill
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        image.label
      )}
    </div>
  );
}

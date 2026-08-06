import Image from "next/image";
import Link from "next/link";
import ExhibitBanner from "@/components/ExhibitBanner";
import type { Exhibit } from "@/content/content";
import { exhibitPage } from "@/content/content";

/**
 * An exhibit room: the room's artwork, heading, hook, body, and its own small
 * gallery.
 *
 * Everything rendered here comes from the exhibit's entry in content.ts, and no
 * field is optional — all five rooms have the same shape, so the layout is
 * proven out rather than tuned to whichever room happens to have the most copy.
 *
 * Route entry is animated once, centrally, by PageTransition. This page adds no
 * entry animation of its own — a second one stacked on top read as the
 * transition playing twice.
 */
export default function ExhibitReveal({ exhibit }: { exhibit: Exhibit }) {
  const { name, subtitle, paragraphs, images } = exhibit;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16">
      {/* The canvas walked into. First thing on the page because the push-in
          lands on it — see ExhibitBanner. */}
      <ExhibitBanner exhibit={exhibit} sizes="(min-width: 768px) 48rem, 100vw" />

      <header className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-3xl">{name}</h1>
        <p className="max-w-xl font-display text-lg text-muted italic">
          {subtitle}
        </p>
        <span
          aria-hidden
          className="mt-1 h-px w-16"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--gold-deep), transparent)",
          }}
        />
      </header>

      {/* Left-aligned: three paragraphs centred would read as a poster, not
          wall text. */}
      <div className="flex flex-col gap-5 text-muted">
        {paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-xs tracking-[0.14em] text-muted uppercase">
          {exhibitPage.galleryLabel}
        </h2>

        {/* One row, however many slots the room has. Stretching an odd slot
            across the full width would blow it up to twice the size of its
            neighbours, which reads as a feature image rather than a gallery. */}
        <div
          className={`grid grid-cols-1 gap-4 ${
            images.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"
          }`}
        >
          {images.map((image) => (
            <figure key={image.label}>
              {image.src ? (
                <div className="relative aspect-[4/3] w-full overflow-hidden border border-frame bg-panel">
                  <Image
                    src={image.src}
                    alt={image.label}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                /* Empty slot. The label stands in for the picture until a path
                   lands in content.ts, then it becomes the caption below. */
                <div
                  className="flex aspect-[4/3] w-full items-center justify-center border border-frame border-dashed bg-panel px-4 text-center text-xs text-muted"
                  style={{ boxShadow: "inset 0 2px 10px rgba(0,0,0,0.2)" }}
                >
                  {image.label}
                </div>
              )}

              {image.src && (
                <figcaption className="pt-2 text-xs text-muted">
                  {image.label}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </section>

      <div className="flex justify-center">
        <Link
          href="/museum"
          className="rounded border border-frame px-6 py-3 transition hover:scale-105"
        >
          {exhibitPage.backLabel}
        </Link>
      </div>
    </main>
  );
}

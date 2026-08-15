import BackToHall from "@/components/BackToHall";
import ExhibitBanner from "@/components/ExhibitBanner";
import GallerySlot from "@/components/GallerySlot";
import MorphReveal from "@/components/MorphReveal";
import type { Exhibit } from "@/content/content";
import { exhibitPage } from "@/content/content";

/**
 * An exhibit room: the room's artwork, heading, hook, wall text, and its own
 * small gallery.
 *
 * Everything rendered here comes from the exhibit's entry in content.ts, and no
 * field is optional — all five rooms have the same shape, so the layout is
 * proven out rather than tuned to whichever room happens to have the most copy.
 *
 * The three paragraphs are set as three beats rather than as a block, because
 * every room is written to the same shape and the shape is worth showing: the
 * intro is the largest text on the page after the heading, the detail is body
 * copy at reading weight, and the closing thought is pulled out below a rule in
 * the display face. A visitor who reads only the first and last lines still gets
 * the room. Written to survive a room with more or fewer paragraphs than three:
 * whatever sits between the first and the last is set as detail.
 *
 * Route entry is animated once, centrally, by PageTransition, and the one route
 * change it stands down for — walking in from the hall — is covered by the frame
 * flying into the banner. This page adds no entry animation of its own; the only
 * timing it owns is MorphReveal holding the copy back until that flight lands.
 */
export default function ExhibitReveal({ exhibit }: { exhibit: Exhibit }) {
  const { slug, name, subtitle, paragraphs, images } = exhibit;
  const [lead, ...rest] = paragraphs;
  const closing = rest.at(-1);
  const detail = rest.slice(0, -1);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16">
      {/* The frame walked into. First thing on the page because the morph lands
          on it — see ExhibitBanner. */}
      <ExhibitBanner
        exhibit={exhibit}
        sizes="(min-width: 768px) 48rem, 100vw"
      />

      <MorphReveal slug={slug} className="flex flex-1 flex-col gap-12">
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

        {/* Wall text. Left-aligned: three paragraphs centred would read as a
            poster rather than as something to stand and read. */}
        <div className="flex flex-col gap-6">
          <p className="text-lg leading-relaxed text-ink">{lead}</p>

          {detail.map((paragraph) => (
            <p key={paragraph.slice(0, 32)} className="text-muted">
              {paragraph}
            </p>
          ))}

          {closing && (
            <p className="border-t border-frame/50 pt-6 font-display text-lg leading-relaxed text-ink italic">
              {closing}
            </p>
          )}
        </div>

        <section className="flex flex-col gap-5">
          <h2 className="text-xs tracking-[0.14em] text-muted uppercase">
            {exhibitPage.galleryLabel}
          </h2>

          {/* One row, however many slots the room has. Stretching an odd slot
              across the full width would blow it up to twice the size of its
              neighbours, which reads as a feature image rather than a gallery —
              the featured room is the one that gets a centrepiece. Every slot
              runs at the same ratio so the wall does not move when photographs
              replace the empty canvases. */}
          <div
            className={`grid grid-cols-1 gap-6 sm:gap-5 ${
              images.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"
            }`}
          >
            {images.map((image) => (
              <GallerySlot
                key={image.label}
                image={image}
                ratio="aspect-[4/3]"
                sizes="(min-width: 640px) 33vw, 100vw"
              />
            ))}
          </div>
        </section>

        <div className="flex justify-center">
          <BackToHall
            slug={slug}
            className="rounded border border-frame px-6 py-3 transition hover:scale-105"
          >
            {exhibitPage.backLabel}
          </BackToHall>
        </div>
      </MorphReveal>
    </main>
  );
}

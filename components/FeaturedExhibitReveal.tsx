import BackToHall from "@/components/BackToHall";
import ExhibitBanner from "@/components/ExhibitBanner";
import GallerySlot from "@/components/GallerySlot";
import MorphReveal from "@/components/MorphReveal";
import type { Exhibit } from "@/content/content";
import { exhibitPage, featuredExhibitPage } from "@/content/content";

/**
 * The featured room. One exhibit carries `featured: true` in content.ts and gets
 * the gold frame in the hall; this is the page behind that frame, so it is laid
 * out as the museum's standout room rather than as the shared template with
 * different words in it.
 *
 * The tier has to be legible before the colour is: a visitor who cannot see gold
 * should still land here and know this room is the museum's centrepiece. So
 * every difference below is structural first and gold second.
 *
 * - Asymmetric and wider (max-w-5xl vs 3xl). The four standard rooms are a
 *   centred column; this one runs a heading rail against a body column, so it
 *   reads as a different space the moment it loads, before any copy is read.
 * - The wall text is set against labelled rails — `leadLabel` beside the intro —
 *   where the standard rooms run their three beats as a single column.
 * - The gallery leads with one large centrepiece against a supporting column,
 *   instead of the even row the other rooms use. The standard rooms deliberately
 *   avoid a feature image; this room is the feature.
 * - Gold carried through from the hall: the banner's own moulding, which is the
 *   frame that was clicked and flew here, the centrepiece's frame, the eyebrow,
 *   and the rules — so the frame the visitor clicked and the room they land in
 *   are visibly the same exhibit.
 *
 * Route entry is animated once, centrally, by PageTransition. Like the standard
 * layout, this page adds no entry animation of its own beyond MorphReveal
 * holding the copy back until the frame has landed.
 */
export default function FeaturedExhibitReveal({
  exhibit,
}: {
  exhibit: Exhibit;
}) {
  const { slug, name, subtitle, paragraphs, images } = exhibit;
  const [lead, ...rest] = paragraphs;
  const closing = rest.at(-1);
  const detail = rest.slice(0, -1);
  const [hero, ...supporting] = images;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-14 px-6 py-16">
      {/* The frame walked into. First thing on the page because the morph lands
          on it — see ExhibitBanner. */}
      <ExhibitBanner
        exhibit={exhibit}
        sizes="(min-width: 1024px) 64rem, 100vw"
      />

      <MorphReveal slug={slug} className="flex flex-1 flex-col gap-14">
        {/* Heading rail. Left-aligned and bottom-aligned against the subtitle:
            the standard rooms centre all three lines, this one sets them in
            opposition across the full width. */}
        <header className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10">
            <div className="flex flex-col gap-2">
              <span
                className="text-xs tracking-[0.22em] uppercase"
                style={{ color: "var(--gold-deep)" }}
              >
                {featuredExhibitPage.eyebrow}
              </span>
              {/* Larger than the standard exhibit heading (text-3xl), and tight
                  enough that the extra size reads as weight rather than sprawl. */}
              <h1 className="text-4xl tracking-tight md:text-5xl">{name}</h1>
            </div>

            <p className="max-w-sm font-display text-lg text-muted italic md:pb-2 md:text-right">
              {subtitle}
            </p>
          </div>

          {/* Full-width rule. The standard rooms get a 4rem centred hairline;
              this one runs the whole measure and fades out to the right. */}
          <span
            aria-hidden
            className="h-px w-full"
            style={{
              background:
                "linear-gradient(90deg, var(--gold-deep), var(--gold-deep) 35%, transparent)",
            }}
          />
        </header>

        {/* Lead paragraph pulled out at full size against a labelled rail, with
            the remaining copy set narrower beside it. */}
        <div className="flex flex-col gap-8 md:flex-row md:gap-12">
          <h2 className="shrink-0 text-xs tracking-[0.14em] text-muted uppercase md:w-32 md:pt-3">
            {featuredExhibitPage.leadLabel}
          </h2>

          <div className="flex flex-col gap-6">
            <p className="text-xl leading-relaxed text-ink">{lead}</p>

            {detail.map((paragraph, i) => (
              <p key={i} className="leading-relaxed text-muted">
                {paragraph}
              </p>
            ))}

            {closing && (
              <p
                className="pt-6 font-display text-lg leading-relaxed text-ink italic"
                style={{ borderTop: "1px solid var(--gold-deep)" }}
              >
                {closing}
              </p>
            )}
          </div>
        </div>

        {/* Centrepiece plus a supporting column, rather than the even row the
            other rooms use. Both sides run at fixed ratios — 3:2 for the
            centrepiece, 4:3 for the supporting slots — so the wall holds its
            shape when photographs replace the empty canvases. */}
        <section className="flex flex-col gap-5">
          <h2 className="text-xs tracking-[0.14em] text-muted uppercase">
            {exhibitPage.galleryLabel}
          </h2>

          <div className="flex flex-col gap-6 md:flex-row md:gap-5">
            <div className="md:w-2/3">
              <GallerySlot
                image={hero}
                ratio="aspect-[3/2]"
                sizes="(min-width: 768px) 66vw, 100vw"
                tone="gold"
                overline={featuredExhibitPage.heroLabel}
              />
            </div>

            <div className="flex flex-col gap-6 md:w-1/3 md:gap-5">
              {supporting.map((image) => (
                <GallerySlot
                  key={image.label}
                  image={image}
                  ratio="aspect-[4/3]"
                  sizes="(min-width: 768px) 33vw, 100vw"
                />
              ))}
            </div>
          </div>
        </section>

        {/* Left-aligned, unlike the centred button in the standard rooms. */}
        <div className="flex">
          <BackToHall
            slug={slug}
            className="rounded px-6 py-3 transition hover:scale-105"
            style={{ boxShadow: "0 0 0 1px var(--gold-deep)" }}
          >
            {exhibitPage.backLabel}
          </BackToHall>
        </div>
      </MorphReveal>
    </main>
  );
}

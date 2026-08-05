import Image from "next/image";
import Link from "next/link";
import type { Exhibit } from "@/content/content";
import { exhibitPage, featuredExhibitPage } from "@/content/content";

/** Diamond studs, the same motif OrnateFrame puts on the gold frame in the hall. */
const corners = [
  "top-1 left-1",
  "top-1 right-1",
  "bottom-1 left-1",
  "bottom-1 right-1",
];

/**
 * The featured room. One exhibit carries `featured: true` in content.ts and gets
 * the gold frame in the hall; this is the page behind that frame, so it is laid
 * out as the museum's standout room rather than as the shared template with
 * different words in it.
 *
 * What makes it distinct, and why:
 * - Asymmetric and wider (max-w-5xl vs 3xl). The four standard rooms are a
 *   centred column; this one runs a heading rail against a body column, so it
 *   reads as a different space the moment it loads, before any copy is read.
 * - Gold carried through from the hall — the eyebrow, the rule under the
 *   heading, the hairline and diamond studs on the centrepiece — so the frame
 *   the visitor clicked and the room they land in are visibly the same exhibit.
 * - The gallery leads with one large centrepiece instead of an even row. The
 *   standard rooms deliberately avoid a feature image; this room is the feature.
 *
 * Route entry is animated once, centrally, by PageTransition. Like the standard
 * layout, this page adds no entry animation of its own.
 */
export default function FeaturedExhibitReveal({
  exhibit,
}: {
  exhibit: Exhibit;
}) {
  const { name, subtitle, paragraphs, images } = exhibit;
  const [lead, ...rest] = paragraphs;
  const [hero, ...supporting] = images;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-14 px-6 py-16">
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

        {/* Full-width rule. The standard rooms get a 4rem centred hairline; this
            one runs the whole measure and fades out to the right. */}
        <span
          aria-hidden
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, var(--gold-deep), var(--gold-deep) 35%, transparent)",
          }}
        />
      </header>

      {/* Lead paragraph pulled out at full size against a labelled rail, with the
          remaining copy set narrower beside it. */}
      <div className="flex flex-col gap-8 md:flex-row md:gap-12">
        <h2 className="shrink-0 text-xs tracking-[0.14em] text-muted uppercase md:w-32 md:pt-2">
          {featuredExhibitPage.leadLabel}
        </h2>

        <div className="flex flex-col gap-5">
          <p className="text-lg leading-relaxed text-ink">{lead}</p>
          {rest.map((paragraph) => (
            <p key={paragraph.slice(0, 32)} className="text-muted">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Centrepiece plus supporting slots, rather than the even row the other
          rooms use. The hero's aspect ratio is the only thing setting a height
          here; the supporting column stretches to match it and splits that
          height between its slots, so the two sides always line up however many
          supporting slots the room has. */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs tracking-[0.14em] text-muted uppercase">
          {exhibitPage.galleryLabel}
        </h2>

        <div className="flex flex-col gap-4 md:flex-row md:items-stretch">
          <figure className="flex flex-col md:w-2/3">
            <div
              className="relative aspect-[3/2] w-full overflow-hidden p-1"
              style={{ boxShadow: "0 0 0 1px var(--gold-deep)" }}
            >
              {corners.map((position) => (
                <span
                  key={position}
                  aria-hidden
                  className={`absolute z-10 h-2 w-2 rotate-45 ${position}`}
                  style={{ background: "#fff6da" }}
                />
              ))}

              {hero.src ? (
                <div className="relative h-full w-full overflow-hidden">
                  <Image
                    src={hero.src}
                    alt={hero.label}
                    fill
                    sizes="(min-width: 768px) 66vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center border border-frame border-dashed bg-panel px-4 text-center text-sm text-muted"
                  style={{ boxShadow: "inset 0 2px 14px rgba(0,0,0,0.22)" }}
                >
                  {hero.label}
                </div>
              )}
            </div>

            <figcaption
              className="pt-2 text-xs"
              style={{ color: "var(--gold-deep)" }}
            >
              {featuredExhibitPage.heroLabel}
              {hero.src ? ` — ${hero.label}` : ""}
            </figcaption>
          </figure>

          <div className="flex flex-col gap-4 md:w-1/3">
            {supporting.map((image) => (
              <figure key={image.label} className="flex flex-1 flex-col">
                <div className="relative aspect-[4/3] w-full min-h-0 overflow-hidden border border-frame bg-panel md:aspect-auto md:flex-1">
                  {image.src ? (
                    <Image
                      src={image.src}
                      alt={image.label}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center border border-frame border-dashed px-4 text-center text-xs text-muted"
                      style={{ boxShadow: "inset 0 2px 10px rgba(0,0,0,0.2)" }}
                    >
                      {image.label}
                    </div>
                  )}
                </div>

                {image.src && (
                  <figcaption className="pt-2 text-xs text-muted">
                    {image.label}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Left-aligned, unlike the centred button in the standard rooms. */}
      <div className="flex">
        <Link
          href="/museum"
          className="rounded px-6 py-3 transition hover:scale-105"
          style={{ boxShadow: "0 0 0 1px var(--gold-deep)" }}
        >
          {exhibitPage.backLabel}
        </Link>
      </div>
    </main>
  );
}

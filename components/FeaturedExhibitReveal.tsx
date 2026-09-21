import BackToHall from "@/components/BackToHall";
import ExhibitBanner from "@/components/ExhibitBanner";
import GallerySlot from "@/components/GallerySlot";
import MorphReveal from "@/components/MorphReveal";
import type { Exhibit } from "@/content/content";
import { exhibitPage, featuredExhibitPage } from "@/content/content";

/**
 * The featured room — the museum's centrepiece in the dark cinematic vault.
 *
 * Structurally distinct from standard rooms: wider (max-w-5xl vs 3xl),
 * asymmetric heading rail, labelled body sections, hero+supporting gallery
 * layout. Gold carried through from the hall frame into every accent.
 *
 * On dark walls, the gold rules and eyebrow glow subtly, making this room
 * unmistakably the featured exhibit before any copy is read.
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
      <ExhibitBanner
        exhibit={exhibit}
        sizes="(min-width: 1024px) 64rem, 100vw"
      />

      <MorphReveal slug={slug} className="flex flex-1 flex-col gap-16">
        {/* Heading rail — asymmetric, gold-accented */}
        <header className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10">
            <div className="flex flex-col gap-3">
              <span
                className="text-xs tracking-[0.22em] uppercase"
                style={{
                  color: "var(--gold)",
                  textShadow: "0 0 20px rgba(196,164,74,0.3)",
                }}
              >
                {featuredExhibitPage.eyebrow}
              </span>
              <h1 className="text-4xl tracking-tight md:text-5xl">{name}</h1>
            </div>

            <p className="max-w-sm font-display text-lg text-muted italic md:pb-2 md:text-right">
              {subtitle}
            </p>
          </div>

          {/* Gold rule — glows subtly on dark */}
          <span
            aria-hidden
            className="h-px w-full"
            style={{
              background:
                "linear-gradient(90deg, var(--gold), var(--gold-deep) 40%, transparent 80%)",
              boxShadow: "0 0 8px rgba(196,164,74,0.15)",
            }}
          />
        </header>

        {/* Lead paragraph against a labelled rail */}
        <div className="flex flex-col gap-8 md:flex-row md:gap-12">
          <h2 className="shrink-0 text-xs tracking-[0.14em] text-muted uppercase md:w-32 md:pt-3">
            {featuredExhibitPage.leadLabel}
          </h2>

          <div className="flex flex-col gap-8">
            <p className="text-xl leading-relaxed text-ink">{lead}</p>

            {detail.map((paragraph, i) => (
              <p key={i} className="leading-relaxed text-muted">
                {paragraph}
              </p>
            ))}

            {closing && (
              <>
                <span
                  aria-hidden
                  className="h-px w-2/3"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--gold), transparent 60%)",
                    boxShadow: "0 0 6px rgba(196,164,74,0.1)",
                  }}
                />
                <p className="font-display text-lg leading-relaxed text-ink italic">
                  {closing}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Gallery — hero centrepiece + supporting column */}
        <section className="relative flex flex-col gap-6">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-8 left-1/2 -z-10 h-32 w-[140%] -translate-x-1/2"
            style={{
              background:
                "radial-gradient(50% 60% at 50% 0%, rgba(196,164,74,0.04), transparent 70%)",
            }}
          />
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

        {/* Back — gold accent */}
        <div className="flex">
          <BackToHall
            slug={slug}
            className="rounded border border-gold/40 px-6 py-3 text-sm text-gold transition hover:border-gold hover:shadow-[0_0_16px_-4px_rgba(196,164,74,0.25)]"
          >
            {exhibitPage.backLabel}
          </BackToHall>
        </div>
      </MorphReveal>
    </main>
  );
}

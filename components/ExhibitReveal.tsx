import BackToHall from "@/components/BackToHall";
import ExhibitBanner from "@/components/ExhibitBanner";
import GallerySlot from "@/components/GallerySlot";
import MorphReveal from "@/components/MorphReveal";
import type { Exhibit } from "@/content/content";
import { exhibitPage } from "@/content/content";

/**
 * A standard exhibit room in the dark cinematic vault.
 *
 * The frame lands as the banner, then the room reveals: heading left-aligned
 * like a wall label, lead paragraph at reading size, detail muted, closing
 * thought pulled out in display italic below a tapered gold rule. The gallery
 * sits in its own section with a spotlight treatment.
 *
 * Everything below the banner is held back by MorphReveal until the frame
 * has finished flying into place.
 */
export default function ExhibitReveal({ exhibit }: { exhibit: Exhibit }) {
  const { slug, name, subtitle, paragraphs, images } = exhibit;
  const [lead, ...rest] = paragraphs;
  const closing = rest.at(-1);
  const detail = rest.slice(0, -1);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-14 px-6 py-16">
      <ExhibitBanner
        exhibit={exhibit}
        sizes="(min-width: 768px) 48rem, 100vw"
      />

      <MorphReveal slug={slug} className="flex flex-1 flex-col gap-20">
        {/* Room heading — left-aligned wall label treatment */}
        <header className="flex flex-col gap-5">
          <h1 className="text-3xl md:text-4xl">{name}</h1>
          <p className="max-w-xl font-display text-lg text-muted italic">
            {subtitle}
          </p>
          <span
            aria-hidden
            className="h-px w-full"
            style={{
              background:
                "linear-gradient(90deg, var(--gold-deep), transparent 50%)",
            }}
          />
        </header>

        {/* Wall text */}
        <div className="flex flex-col gap-10">
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
                    "linear-gradient(90deg, var(--gold-deep), transparent 70%)",
                }}
              />
              <p className="font-display text-lg leading-relaxed text-ink italic">
                {closing}
              </p>
            </>
          )}
        </div>

        {/* Gallery — spotlit section */}
        <section className="relative flex flex-col gap-6 pt-8">
          {/* Subtle overhead glow on the gallery */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-8 left-1/2 -z-10 h-32 w-[140%] -translate-x-1/2"
            style={{
              background:
                "radial-gradient(50% 60% at 50% 0%, rgba(255,255,255,0.03), transparent 70%)",
            }}
          />
          <h2 className="text-xs tracking-[0.14em] text-muted uppercase">
            {exhibitPage.galleryLabel}
          </h2>

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

        {/* Back — gold accent to be visible on dark */}
        <div className="flex pt-4">
          <BackToHall
            slug={slug}
            className="rounded border border-gold/50 px-6 py-3 text-sm text-gold transition hover:border-gold hover:shadow-[0_0_16px_-4px_rgba(176,152,114,0.25)]"
          >
            {exhibitPage.backLabel}
          </BackToHall>
        </div>
      </MorphReveal>
    </main>
  );
}

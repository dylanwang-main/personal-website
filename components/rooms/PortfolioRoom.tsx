import BackToHall from "@/components/BackToHall";
import ExhibitBanner from "@/components/ExhibitBanner";
import GallerySlot from "@/components/GallerySlot";
import MorphReveal from "@/components/MorphReveal";
import type { Exhibit } from "@/content/content";
import { exhibitPage } from "@/content/content";

/**
 * Projects room — "Portfolio wall"
 *
 * Work-first layout: the gallery is promoted to directly below the banner,
 * large and prominent. The visitor sees the work before reading about it.
 * Text follows below, set narrower against the full-width gallery above.
 *
 * The room reads as a wall of hung work with a placard beside it.
 */
export default function PortfolioRoom({ exhibit }: { exhibit: Exhibit }) {
  const { slug, name, subtitle, paragraphs, images } = exhibit;
  const [lead, ...rest] = paragraphs;
  const closing = rest.at(-1);
  const detail = rest.slice(0, -1);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-14 px-6 py-16">
      <ExhibitBanner
        exhibit={exhibit}
        sizes="(min-width: 768px) 56rem, 100vw"
      />

      <MorphReveal slug={slug} className="flex flex-1 flex-col gap-16">
        {/* Heading — compact, left-aligned */}
        <header className="flex flex-col gap-3">
          <h1 className="text-3xl md:text-4xl">{name}</h1>
          <p className="max-w-lg font-display text-lg text-muted italic">
            {subtitle}
          </p>
        </header>

        {/* Gallery first — the work speaks before the text */}
        <section className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-8 left-1/2 -z-10 h-32 w-[140%] -translate-x-1/2"
            style={{
              background:
                "radial-gradient(50% 60% at 50% 0%, rgba(255,255,255,0.03), transparent 70%)",
            }}
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
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

        {/* Divider */}
        <span
          aria-hidden
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, var(--gold-deep), transparent 50%)",
          }}
        />

        {/* Text — narrower column, reading mode */}
        <div className="mx-auto flex max-w-2xl flex-col gap-8">
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
                    "linear-gradient(90deg, var(--frame), transparent 60%)",
                }}
              />
              <p className="font-display text-lg leading-relaxed text-ink italic">
                {closing}
              </p>
            </>
          )}
        </div>

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

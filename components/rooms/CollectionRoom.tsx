import BackToHall from "@/components/BackToHall";
import ExhibitBanner from "@/components/ExhibitBanner";
import Canvas from "@/components/Canvas";
import OrnateFrame from "@/components/OrnateFrame";
import MorphReveal from "@/components/MorphReveal";
import type { Exhibit } from "@/content/content";
import { exhibitPage } from "@/content/content";

/**
 * Hobbies room — "Collection"
 *
 * Horizontal interleave: each image-text pair sits side by side, alternating
 * which side the image falls on. The room reads as a curated shelf — things
 * placed next to the story of why they matter, not corralled into a grid.
 *
 * The lead paragraph spans the full width as an introduction, then the
 * collection unfolds as alternating pairs.
 */
export default function CollectionRoom({ exhibit }: { exhibit: Exhibit }) {
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
        {/* Heading */}
        <header className="flex flex-col gap-4">
          <h1 className="text-3xl md:text-4xl">{name}</h1>
          <p className="max-w-lg font-display text-lg text-muted italic">
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

        {/* Lead — full width introduction */}
        <p className="max-w-2xl text-xl leading-relaxed text-ink">{lead}</p>

        {/* Collection pairs: image + text, alternating sides */}
        <div className="flex flex-col gap-14">
          {images.map((image, i) => {
            const text = detail[i];
            const imageLeft = i % 2 === 0;

            return (
              <div
                key={image.label}
                className={`grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-10`}
              >
                {/* Image side */}
                <div
                  className={`relative ${imageLeft ? "" : "md:order-2"}`}
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -top-6 left-1/2 -z-10 h-24 w-[130%] -translate-x-1/2"
                    style={{
                      background:
                        "radial-gradient(50% 70% at 50% 0%, rgba(255,255,255,0.03), transparent 70%)",
                    }}
                  />
                  <OrnateFrame tone="neutral" scale="slot">
                    <Canvas
                      image={image}
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="aspect-[4/3] w-full"
                    />
                  </OrnateFrame>
                  <span className="mt-2 block text-[0.7rem] tracking-[0.12em] text-muted uppercase">
                    {image.label}
                  </span>
                </div>

                {/* Text side */}
                <div className={imageLeft ? "" : "md:order-1"}>
                  {text ? (
                    <p className="leading-relaxed text-muted">{text}</p>
                  ) : (
                    <div />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Closing thought */}
        {closing && (
          <div className="flex flex-col gap-6">
            <span
              aria-hidden
              className="h-px w-2/3"
              style={{
                background:
                  "linear-gradient(90deg, var(--gold-deep), transparent 70%)",
              }}
            />
            <p className="max-w-2xl font-display text-lg leading-relaxed text-ink italic">
              {closing}
            </p>
          </div>
        )}

        <div className="flex pt-4">
          <BackToHall
            slug={slug}
            className="rounded border border-gold/50 px-6 py-3 text-sm text-gold transition hover:border-gold hover:shadow-[0_0_16px_-4px_rgba(196,164,74,0.25)]"
          >
            {exhibitPage.backLabel}
          </BackToHall>
        </div>
      </MorphReveal>
    </main>
  );
}

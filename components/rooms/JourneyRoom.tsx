import BackToHall from "@/components/BackToHall";
import ExhibitBanner from "@/components/ExhibitBanner";
import Canvas from "@/components/Canvas";
import Frame from "@/components/Frame";
import MorphReveal from "@/components/MorphReveal";
import type { Exhibit } from "@/content/content";
import { exhibitPage } from "@/content/content";

/**
 * Travels room — "Journey"
 *
 * Cinematic photo-essay layout. Images break the column and run full-width
 * (edge to edge of the content area), each one a scene. Text sits beneath
 * each image as a caption — short, muted, reading as a journal entry rather
 * than body copy.
 *
 * The room reads as flipping through a photo book or watching a sequence
 * of stills. The images lead; the words are notes in the margin.
 */
export default function JourneyRoom({ exhibit }: { exhibit: Exhibit }) {
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

      <MorphReveal slug={slug} className="flex flex-1 flex-col gap-20">
        {/* Heading — centered for the journey feel, like a chapter title */}
        <header className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-3xl md:text-4xl">{name}</h1>
          <p className="max-w-md font-display text-lg text-muted italic">
            {subtitle}
          </p>
          <span
            aria-hidden
            className="mt-2 h-px w-16"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--gold-deep), transparent)",
            }}
          />
        </header>

        {/* Opening — the lead paragraph as a wide caption */}
        <p className="mx-auto max-w-2xl text-center text-xl leading-relaxed text-ink">
          {lead}
        </p>

        {/* Scenes: full-width images with text captions beneath.
            Each image-text pair is one "scene" in the journey. */}
        <div className="flex flex-col gap-16">
          {images.map((image, i) => (
            <div key={image.label} className="flex flex-col gap-4">
              {/* Full-width cinematic frame */}
              <div className="relative">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-8 left-1/2 -z-10 h-32 w-[120%] -translate-x-1/2"
                  style={{
                    background:
                      "radial-gradient(50% 60% at 50% 0%, rgba(255,255,255,0.03), transparent 70%)",
                  }}
                />
                <Frame tone="neutral" scale="slot">
                  <Canvas
                    image={image}
                    sizes="(min-width: 768px) 56rem, 100vw"
                    className="aspect-[21/9] w-full"
                  />
                </Frame>
              </div>

              {/* Caption — the journal entry beneath the scene */}
              <div className="mx-auto flex max-w-xl flex-col gap-2 text-center">
                <span className="text-[0.7rem] tracking-[0.08em] text-muted/70 uppercase">
                  {image.label}
                </span>
                {detail[i] && (
                  <p className="text-sm leading-relaxed text-muted">
                    {detail[i]}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Closing thought */}
        {closing && (
          <div className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center">
            <span
              aria-hidden
              className="h-px w-16"
              style={{
                background:
                  "linear-gradient(90deg, transparent, var(--gold-deep), transparent)",
              }}
            />
            <p className="font-display text-lg leading-relaxed text-ink italic">
              {closing}
            </p>
          </div>
        )}

        <div className="flex justify-center pt-4">
          <BackToHall
            slug={slug}
            className="rounded border border-frame px-6 py-3 text-sm text-muted transition-[border-color,color] hover:border-ink hover:text-ink"
          >
            {exhibitPage.backLabel}
          </BackToHall>
        </div>
      </MorphReveal>
    </main>
  );
}

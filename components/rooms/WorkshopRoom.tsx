import BackToHall from "@/components/BackToHall";
import ExhibitBanner from "@/components/ExhibitBanner";
import Canvas from "@/components/Canvas";
import OrnateFrame from "@/components/OrnateFrame";
import MorphReveal from "@/components/MorphReveal";
import type { Exhibit } from "@/content/content";
import { exhibitPage } from "@/content/content";

/**
 * Currently Building room — "Workshop"
 *
 * Raw, asymmetric layout. Images are woven into the text flow rather than
 * corralled into a gallery section. The first image sits beside the lead
 * paragraph, the rest punctuate the detail copy. The room feels like walking
 * into a studio mid-project — things are where they landed, not curated.
 *
 * Wider than the standard room (max-w-4xl) to give the asymmetric grid room.
 */
export default function WorkshopRoom({ exhibit }: { exhibit: Exhibit }) {
  const { slug, name, subtitle, paragraphs, images } = exhibit;
  const [lead, ...rest] = paragraphs;
  const closing = rest.at(-1);
  const detail = rest.slice(0, -1);
  const [primary, ...secondary] = images;

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
                "linear-gradient(90deg, var(--gold-deep), transparent 40%)",
            }}
          />
        </header>

        {/* Lead paragraph + primary image side by side — the current state
            of the work next to the opening description */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_minmax(0,16rem)] md:gap-8">
          <div className="flex flex-col gap-6">
            <p className="text-xl leading-relaxed text-ink">{lead}</p>
            {detail.length > 0 && (
              <p className="leading-relaxed text-muted">{detail[0]}</p>
            )}
          </div>

          {primary && (
            <div className="relative">
              <div
                aria-hidden
                className="pointer-events-none absolute -top-6 left-1/2 -z-10 h-24 w-[130%] -translate-x-1/2"
                style={{
                  background:
                    "radial-gradient(50% 70% at 50% 0%, rgba(255,255,255,0.04), transparent 70%)",
                }}
              />
              <OrnateFrame tone="neutral" scale="slot">
                <Canvas
                  image={primary}
                  sizes="(min-width: 768px) 16rem, 100vw"
                  className="aspect-[4/5] w-full"
                />
              </OrnateFrame>
              <span className="mt-2 block text-[0.7rem] tracking-[0.12em] text-muted uppercase">
                {primary.label}
              </span>
            </div>
          )}
        </div>

        {/* Remaining detail + secondary images interspersed */}
        {detail.length > 1 && (
          <div className="flex flex-col gap-10">
            {detail.slice(1).map((paragraph, i) => (
              <div
                key={i}
                className={`grid grid-cols-1 gap-8 ${
                  secondary[i]
                    ? i % 2 === 0
                      ? "md:grid-cols-[minmax(0,10rem)_1fr]"
                      : "md:grid-cols-[1fr_minmax(0,10rem)]"
                    : ""
                }`}
              >
                {/* On even rows, image left; on odd rows, image right */}
                {secondary[i] && i % 2 === 0 && (
                  <OrnateFrame tone="neutral" scale="slot">
                    <Canvas
                      image={secondary[i]}
                      sizes="10rem"
                      className="aspect-square w-full"
                    />
                  </OrnateFrame>
                )}
                <p className="leading-relaxed text-muted self-center">
                  {paragraph}
                </p>
                {secondary[i] && i % 2 !== 0 && (
                  <OrnateFrame tone="neutral" scale="slot">
                    <Canvas
                      image={secondary[i]}
                      sizes="10rem"
                      className="aspect-square w-full"
                    />
                  </OrnateFrame>
                )}
              </div>
            ))}
          </div>
        )}

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

import { footer } from "@/content/content";

/**
 * Museum credits plaque. The kind of small brass plate found near the exit of
 * a real gallery — names the institution, lists its channels, and stays quiet
 * enough to never compete with the room above it.
 *
 * No border-top: the plaque floats on the wall like an object, not a page
 * section. The display face for the name keeps it in the museum's voice.
 */
export default function SiteFooter() {
  return (
    <footer className="px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center">
        {/* Credit line — the museum's name in display type */}
        <p className="font-display text-xs tracking-[0.12em] text-muted uppercase">
          {footer.credit}
        </p>

        {/* Tapered rule — same technique as the hall heading divider */}
        <span
          aria-hidden
          className="h-px w-10"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--frame), transparent)",
          }}
        />

        {/* Channels: social + contact, all one row */}
        <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted">
          {footer.links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
          {/* Below sm the contact takes its own line on purpose, rather than
              wrapping alone after the divider. */}
          <li aria-hidden className="mx-1 hidden h-3 w-px bg-frame/30 sm:block" />
          <li className="basis-full sm:basis-auto">
            <a
              href={footer.contact.href}
              data-cursor="say hello"
              className="transition-colors hover:text-ink"
            >
              {footer.contact.label}
            </a>
          </li>
        </ul>

        {/* Museum hours — a bit of world-building */}
        <p className="text-[0.72rem] tracking-wide text-muted">
          {footer.note}
        </p>
      </div>
    </footer>
  );
}

import { footer } from "@/content/content";

/**
 * TEMPORARY / PLACEHOLDER footer. Fills out the page shell; links go nowhere yet.
 * Kept quiet on purpose so it never competes with the page above it.
 */
export default function SiteFooter() {
  return (
    <footer className="border-t border-frame/40 px-6 py-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 text-xs text-muted sm:flex-row sm:justify-between">
        <p>{footer.copyright}</p>

        {/* Socials centre, Contact hard right — see the note in content.ts */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-8">
          <ul className="flex items-center gap-5">
            {footer.links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="transition-colors hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={footer.contact.href}
            className="transition-colors hover:text-ink"
          >
            {footer.contact.label}
          </a>
        </div>
      </div>
    </footer>
  );
}

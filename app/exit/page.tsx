import Link from "next/link";
import ExitGlow from "@/components/ExitGlow";
import { exitScreen } from "@/content/content";

/** No entry animation here: PageTransition owns route entry for every page. */
export default function Exit() {
  return (
    // Exit uses --wall directly so it adapts to both themes.
    <main className="relative flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-center text-ink" style={{ background: "var(--wall)" }}>
      <ExitGlow />
      <h1 className="relative text-3xl">{exitScreen.heading}</h1>
      <p className="relative max-w-md text-muted">{exitScreen.body}</p>
      <Link
        href="/"
        className="relative rounded border border-gold px-6 py-3 text-sm text-gold transition hover:scale-105"
      >
        {exitScreen.returnLabel}
      </Link>
    </main>
  );
}

import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Cormorant_Garamond, Raleway } from "next/font/google";
import ArrivalCurtain from "@/components/ArrivalCurtain";
import CustomCursor from "@/components/CustomCursor";
import DigitalGrid from "@/components/DigitalGrid";
import PageTransition from "@/components/PageTransition";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { site } from "@/content/content";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#090807",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: site.title,
    description: site.description,
  },
};

/* Dark is the default world. Light mode is the alternative — the visitor opts
   in by toggling, or by having stored "light" previously. The root tokens are
   already dark, so the class only needs adding for light. */
const themeInitScript = `
(function () {
  var stored = localStorage.getItem("theme");
  if (stored === "light") {
    document.documentElement.classList.add("light");
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorantGaramond.variable} ${raleway.variable} h-full antialiased`}
      // The theme init script adds `dark` before hydration, so the class list
      // legitimately differs from the server's.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      {/* pt-14 clears the fixed header, which overlays content rather than
          pushing it down. */}
      <body className="flex min-h-full flex-col bg-wall pt-14 text-ink">
        {/* Outside PageTransition on purpose — it is a full-viewport overlay,
            and PageTransition's transform would trap it. See ArrivalCurtain. */}
        <DigitalGrid />
        <ArrivalCurtain />
        <CustomCursor />
        <SiteHeader />
        <PageTransition>{children}</PageTransition>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import ArrivalCurtain from "@/components/ArrivalCurtain";
import PageTransition from "@/components/PageTransition";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { site } from "@/content/content";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
};

const themeInitScript = `
(function () {
  var stored = localStorage.getItem("theme");
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (stored === "dark" || (!stored && prefersDark)) {
    document.documentElement.classList.add("dark");
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
      className={`${fraunces.variable} ${workSans.variable} h-full antialiased`}
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
        <ArrivalCurtain />
        <SiteHeader />
        <PageTransition>{children}</PageTransition>
        <SiteFooter />
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Masthead from "@/components/site/Masthead";
import Footer from "@/components/site/Footer";
import { LanguageProvider } from "@/lib/LanguageProvider";
import "./globals.css";

/*
 * Readex Pro, self-hosted through next/font (spec §0.1): no external request,
 * preloaded, and it works from a static export with no internet.
 *
 * Two faces split by script, each limited by unicode-range, chained in
 * globals.css as `var(--font-ar), var(--font-latin)`. A Latin-only run never
 * downloads the Arabic file and vice versa. Variable weight 160-700.
 */
const readexArabic = localFont({
  src: "../fonts/ReadexPro-arabic.woff2",
  weight: "160 700",
  variable: "--font-ar",
  display: "swap",
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0600-06FF, U+0750-077F, U+0870-088E, U+0890-0891, U+0897-08E1, U+08E3-08FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE70-FE74, U+FE76-FEFC",
    },
  ],
});

const readexLatin = localFont({
  src: "../fonts/ReadexPro-latin.woff2",
  weight: "160 700",
  variable: "--font-latin",
  display: "swap",
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
    },
  ],
});

export const metadata: Metadata = {
  title: "قواعدك · Tabby Split Rules",
  description:
    "بطاقة تابي بقواعد تحطها أنت: تعرف خطتك قبل ما ترجع الجوال لجيبك. Know your plan before the terminal beeps.",
  icons: { icon: "/tabby-icon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Arabic first, in the served HTML, before any JS runs. §0.1.
    <html
      lang="ar"
      dir="rtl"
      className={`${readexArabic.variable} ${readexLatin.variable}`}
    >
      <body>
        <LanguageProvider>
          <Masthead />
          <main id="main">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}

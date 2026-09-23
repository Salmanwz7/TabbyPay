"use client";

/**
 * Footer, same spec as submissions 1 and 2: © 2026 Salman Zamzami + an inline
 * LinkedIn glyph.
 *
 * - The glyph is currentColor, not LinkedIn blue: #0A66C2 is not a token.
 * - The year is a literal, never new Date(): under static export that is a
 *   hydration mismatch waiting to happen (DESIGN-SYSTEM.md §7).
 * - Separate spans rather than one mixed string, and the Latin name is wrapped
 *   in FSI/PDI (U+2068/U+2069) so it cannot reorder its Arabic neighbours.
 */

import { useLang } from "@/lib/LanguageProvider";

const LINKEDIN_URL = "https://www.linkedin.com/in/salman-zamzami-2b3775260/";
const YEAR = "2026";
const NAME_LATIN = "⁨Salman Zamzami⁩";

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="border-t border-rule bg-card">
      <div className="mx-auto flex w-full max-w-col flex-col gap-s2 px-s2 py-s3 sm:flex-row sm:items-center sm:justify-between sm:px-s4">
        <p className="flex flex-wrap items-center gap-s1 text-small text-muted">
          <span aria-hidden="true">©</span>
          <span className="tnum">{YEAR}</span>
          <span className="text-ink">{t.footerName}</span>
          <span aria-hidden="true">·</span>
          <span>{t.footerRights}</span>
        </p>

        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.linkedinAria}
          className="inline-flex min-h-tap items-center gap-s1 self-start text-small text-muted transition-colors duration-(--t-micro) hover:text-ink sm:self-auto"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className="flex-none"
          >
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
          </svg>
          <span>{NAME_LATIN}</span>
        </a>
      </div>
    </footer>
  );
}

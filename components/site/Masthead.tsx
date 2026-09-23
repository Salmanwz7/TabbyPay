"use client";

/**
 * The masthead. In RTL the inline-start edge is the right of the screen, so
 * flex start puts the mark where a Saudi reader's eye begins with no physical
 * property needed.
 */

import TabbyMark from "@/components/ui/TabbyMark";
import LangToggle from "@/components/site/LangToggle";
import { useLang } from "@/lib/LanguageProvider";

export default function Masthead() {
  const { t } = useLang();

  return (
    <>
      {/* First focusable element in the document. DESIGN-SYSTEM.md §9. */}
      <a className="skip-link" href="#main">
        {t.skip}
      </a>
      <header className="border-b border-rule bg-card">
      <div className="mx-auto flex w-full max-w-col items-center gap-s2 px-s2 py-s2 sm:px-s4">
        <TabbyMark />
        <div className="flex flex-1 flex-col">
          <span className="text-body leading-tight font-semibold text-ink">
            {t.brandName}
          </span>
          <span className="text-caption leading-tight text-muted">
            {t.brandSub}
          </span>
        </div>
        <LangToggle />
      </div>
    </header>
    </>
  );
}

"use client";

/**
 * Close: method and limitations (spec §13.3). Naming the limits reads as
 * rigour, so they sit in plain view, not in a footnote. The first one is the
 * SAMA line the spec requires. "What I cut" and "what I'd test first" were
 * removed at Salman's request (NOTES H2).
 */

import { useLang } from "@/lib/LanguageProvider";
import SectionShell from "@/components/ui/SectionShell";

export default function Close() {
  const { t } = useLang();

  return (
    <SectionShell id="close">
      <section aria-labelledby="close-method" className="flex flex-col gap-s3">
        <h2 id="close-method" className="headline text-h3">
          {t.methodHeading}
        </h2>
        <p className="max-w-measure text-lead leading-body text-ink-soft">{t.methodLead}</p>
        <ul className="flex max-w-measure list-disc flex-col gap-s1 ps-s3 marker:text-muted">
          {t.limits.map((line) => (
            <li key={line} className="tnum text-body text-ink">
              {line}
            </li>
          ))}
        </ul>
      </section>
    </SectionShell>
  );
}

"use client";

/**
 * Close: what I cut, what I'd test first, method and limitations (spec §6,
 * §13.3). Naming the limits reads as rigour, so they sit in plain view, not
 * in a footnote. The first one is the SAMA line the spec requires.
 */

import { useLang } from "@/lib/LanguageProvider";
import SectionShell from "@/components/ui/SectionShell";

export default function Close() {
  const { t } = useLang();

  return (
    <SectionShell kicker={t.closeKicker} id="close">
      <div className="flex flex-col gap-s5">
        <section aria-labelledby="close-cut" className="flex flex-col gap-s3">
          <h2 id="close-cut" className="headline text-h3">
            {t.cutHeading}
          </h2>
          <ul className="grid gap-s2 lg:grid-cols-3">
            {t.cuts.map((c) => (
              <li key={c.what} className="flex flex-col gap-s1 rounded-tabby border border-rule bg-card p-s3">
                <span className="text-body font-semibold text-ink">{c.what}</span>
                <span className="text-body text-ink-soft">{c.why}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="close-test" className="flex flex-col gap-s3">
          <h2 id="close-test" className="headline text-h3">
            {t.testHeading}
          </h2>
          <ol className="flex max-w-measure flex-col gap-s2">
            {t.tests.map((line, i) => (
              <li key={line} className="flex items-baseline gap-s2 text-lead leading-body text-ink">
                <bdi className="tnum text-body font-semibold text-muted">{i + 1}</bdi>
                <span>{line}</span>
              </li>
            ))}
          </ol>
        </section>

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
      </div>
    </SectionShell>
  );
}

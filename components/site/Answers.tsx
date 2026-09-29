"use client";

/**
 * The challenge's three questions, answered up front: what's broken today,
 * what changes, who benefits. Same shape as submission 2's answers
 * (tabby-ahead): a rule on top, the question, three short lines, one figure,
 * and a link down to the section that proves it.
 *
 * Every figure is one the page itself shows: the four later steps in the
 * comparison, the three rules, and no change at the merchant's till.
 */

import { useLang } from "@/lib/LanguageProvider";
import SectionShell from "@/components/ui/SectionShell";

export default function Answers() {
  const { t } = useLang();

  return (
    <SectionShell kicker={t.answersKicker} id="answers">
      <div className="max-w-measure">
        <h2 className="display text-h3 sm:text-h2">{t.answersTitle}</h2>
        <p className="mt-s3 text-lead leading-body text-ink-soft">
          {t.answersLead.map((line, i) => (
            <span key={line} className={i < t.answersLead.length - 1 ? "me-sentence" : ""}>
              {line}{" "}
            </span>
          ))}
        </p>
      </div>

      {/* On lg the three columns share one row grid (subgrid), so the
          questions, figures and links line up across columns. The theme has
          no zero spacing token, so the row gap is the smallest one (s1). */}
      <ol className="mt-s5 grid gap-s4 lg:grid-cols-3 lg:gap-x-s3 lg:gap-y-s1">
        {t.answers.map((a) => (
          <li key={a.href} className="flex flex-col border-t-2 border-ink pt-s3 lg:row-span-5 lg:grid lg:grid-rows-subgrid">
            <h3 className="headline text-title sm:text-h3">{a.q}</h3>
            {/* One short line per point, its label in bold, so the idea reads
                at a glance instead of as one paragraph. */}
            <ul className="mt-s2 flex flex-col gap-s2 text-body leading-body text-ink-soft">
              {a.lines.map((line) => (
                <li key={line.v}>
                  {line.k ? <span className="me-sentence font-semibold text-ink">{line.k}:</span> : null}
                  {line.v}
                </li>
              ))}
            </ul>
            <p className="tnum mt-auto pt-s3 lg:self-end text-h2 leading-none font-bold text-ink">{a.figure}</p>
            <p className="mt-s1 text-small text-muted lg:self-start">{a.label}</p>
            <a
              href={a.href}
              className="mt-s3 inline-flex min-h-tap items-center gap-s1 self-start justify-self-start border-b-2 border-ink text-body font-semibold text-ink no-underline transition-colors duration-(--t-micro) hover:text-green-deep"
            >
              <span className="text-muted">{t.answersProof}</span>
              <span>{a.target}</span>
              {/* Down, not forward: a down arrow means the same in both scripts. */}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="flex-none">
                <path d="M7 2v10M3 8.5L7 12.5l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}

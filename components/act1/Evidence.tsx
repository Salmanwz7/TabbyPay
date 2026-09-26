"use client";

/**
 * 1.3 · Evidence. Only what EVIDENCE.md holds, said at its real size.
 *
 * The on-theme count is small (5 of 30,250) and the page says so rather than
 * dressing it up: the quotes are strong in kind, not in volume. The Saudi
 * count (2 of 3,217) is shown for the same reason, with the note that the
 * Saudi case rests on Tabby's own stated plan (Act 3), not on reviews.
 *
 * Quotes are verbatim, in their own language and direction, never run
 * through the sentence splitter. The translation is labelled as mine.
 */

import { SA_RUN, UAE_RUN, VERBATIMS, type Verbatim } from "@/lib/evidence";
import { useLang } from "@/lib/LanguageProvider";
import { dirOf } from "@/lib/copy";
import { formatDate, formatNumber } from "@/lib/format";

export default function Evidence() {
  const { t } = useLang();

  return (
    <div className="flex flex-col gap-s5">
      <div className="flex flex-col gap-s2">
        <h3 className="text-h3 leading-tight font-bold">{t.evHeading}</h3>
        <p className="max-w-measure text-lead text-ink-soft">{t.evLead}</p>
      </div>

      <dl className="grid gap-s4 sm:grid-cols-2">
        <Count figure={UAE_RUN.onTheme} of={UAE_RUN.n} label={t.evUaeLabel} />
        <Count figure={SA_RUN.asksForCard} of={SA_RUN.n} label={t.evSaLabel} />
      </dl>

      <ul className="grid gap-s3 lg:grid-cols-2">
        {VERBATIMS.map((v) => (
          <Quote key={v.id} v={v} />
        ))}
      </ul>

      <p className="max-w-measure text-small text-muted">{t.evMethod}</p>
    </div>
  );
}

function Count({ figure, of, label }: { figure: number; of: number; label: string }) {
  const { lang, t } = useLang();
  return (
    <div className="flex flex-col gap-s1 border-t border-rule pt-s2">
      <dt className="flex items-baseline gap-s1">
        <bdi className="tnum text-h2 leading-tight font-bold">{formatNumber(figure, lang)}</bdi>
        <span className="text-lead text-muted">
          {t.evUaeOf} <bdi className="tnum">{formatNumber(of, lang)}</bdi>
        </span>
      </dt>
      <dd className="max-w-measure text-body text-ink-soft">{label}</dd>
    </div>
  );
}

function Quote({ v }: { v: Verbatim }) {
  const { lang, t } = useLang();
  return (
    <li className="flex flex-col gap-s2 rounded-tabby border border-rule bg-card p-s3">
      <blockquote lang={v.lang} dir={dirOf(v.lang)} className="quote text-body text-ink">
        {v.text}
      </blockquote>
      {v.lang !== lang ? (
        <p className="text-small text-ink-soft">
          <span className="font-medium text-muted">{t.evTranslation}: </span>
          {v.translation}
        </p>
      ) : null}
      <p className="mt-auto flex flex-wrap gap-s1 text-caption text-muted">
        <span>{t.evSource}</span>
        <span aria-hidden="true">·</span>
        <span>
          <bdi className="tnum">{v.stars}</bdi> {t.evStars}
        </span>
        <span aria-hidden="true">·</span>
        <bdi className="tnum">{formatDate(v.date, lang)}</bdi>
      </p>
      {!v.cardSpecific ? <p className="tag-known self-start">{t.evNotCard}</p> : null}
    </li>
  );
}

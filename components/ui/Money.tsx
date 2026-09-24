"use client";

/**
 * A riyal amount. DESIGN-SYSTEM.md §5: the bare figure and the currency word
 * are separate elements, so they style independently and the number never
 * gets caught inside a bidi reordering run.
 *
 * - The figure is <bdi>, so "1,290" or "112.50" can't be reordered by the
 *   Arabic around it, and is always tabular.
 * - Word order follows the language: "450 ريال" / "SAR 450".
 * - whitespace-nowrap keeps figure and word on one line.
 */

import { useLang } from "@/lib/LanguageProvider";
import { formatAmount } from "@/lib/format";

interface MoneyProps {
  value: number;
  className?: string;
  /** The currency word is usually quieter than the figure. */
  unitClassName?: string;
}

export default function Money({ value, className = "", unitClassName = "" }: MoneyProps) {
  const { lang, t } = useLang();
  const figure = <bdi className="tnum">{formatAmount(value, lang)}</bdi>;
  const unit = <span className={unitClassName}>{t.currency}</span>;

  return (
    <span className={`whitespace-nowrap ${className}`}>
      {lang === "en" ? (
        <>
          {unit} {figure}
        </>
      ) : (
        <>
          {figure} {unit}
        </>
      )}
    </span>
  );
}

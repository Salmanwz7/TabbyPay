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

import { createContext, useContext } from "react";
import { useLang } from "@/lib/LanguageProvider";
import { formatAmount } from "@/lib/format";
import Sar from "@/components/phone/app/Sar";

/**
 * True inside the Tabby app shell. There riyal amounts carry the official
 * symbol, as the real app does ("⃁ 500"), symbol first in both languages
 * (NOTES.md R4). Everywhere else on the page the word stays.
 */
export const InAppContext = createContext(false);

interface MoneyProps {
  value: number;
  className?: string;
  /** The currency word is usually quieter than the figure. */
  unitClassName?: string;
  /** Riyal by default. Dirham only for the UAE card today (Idea 2's why). */
  currency?: "sar" | "aed";
}

export default function Money({ value, className = "", unitClassName = "", currency = "sar" }: MoneyProps) {
  const { lang, t } = useLang();
  const inApp = useContext(InAppContext);
  const figure = <bdi className="tnum">{formatAmount(value, lang)}</bdi>;

  if (inApp && currency === "sar") {
    return (
      <span dir="ltr" className={`inline-flex items-baseline gap-s1 whitespace-nowrap ${className}`}>
        <Sar label={t.currency} />
        {figure}
      </span>
    );
  }

  const unit = <span className={unitClassName}>{currency === "aed" ? t.currencyAed : t.currency}</span>;

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

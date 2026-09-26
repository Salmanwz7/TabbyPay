/**
 * Formatting , numbers, currency, and Arabic sentence handling.
 *
 * Two rules from DESIGN-SYSYEM.md that are not negotiable:
 *
 * §5 , Western digits in BOTH languages. In Saudi Arabia that is what the market
 *      reads. The Arabic-ness comes from the words and the direction, not the
 *      numeral system.
 *
 * §5 , Render the bare figure and set the currency WORD separately as type
 *      ("85,000" + "ريال"), so the two style independently and the number never
 *      gets caught inside a bidi reordering run.
 */

export type Lang = "ar" | "en";

/** ar-SA with Latin numerals forced. Without -u-nu-latn this renders ٨٥٬٠٠٠. */
export const LOCALE: Record<Lang, string> = {
  ar: "ar-SA-u-nu-latn",
  en: "en-GB",
};

// ---------------------------------------------------------------------------
// Numbers
// ---------------------------------------------------------------------------

/** A bare integer with thousands separators. No currency, no symbol. */
export function formatNumber(n: number, lang: Lang = "ar"): string {
  return new Intl.NumberFormat(LOCALE[lang], {
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

/**
 * A currency figure, as a bare number. The word "ريال" is rendered as a separate
 * element by the caller , never concatenated here. See the module note.
 */
export const formatSar = formatNumber;

/**
 * Large figures for the business case: "100.8 مليون".
 * Returns the number only; the caller supplies the unit word.
 */
export function formatMillions(n: number, lang: Lang = "ar"): string {
  return new Intl.NumberFormat(LOCALE[lang], {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(n / 1_000_000);
}

/**
 * A percentage as a bare integer: 12 from 0.12.
 *
 * Note the design rule this exists to support, not undermine: §10.2 says never a
 * percentage without a sentence beside it. "12%" means nothing to Abu Khalid;
 * "about SAR 5,460 from each payout" means everything. Use this for the slider
 * rungs, and always pair it with the riyal figure.
 */
export function formatPercent(fraction: number, lang: Lang = "ar"): string {
  return new Intl.NumberFormat(LOCALE[lang], {
    maximumFractionDigits: 0,
  }).format(fraction * 100);
}

/** One decimal place, for durations: "4.1". */
export function formatMonths(months: number, lang: Lang = "ar"): string {
  return new Intl.NumberFormat(LOCALE[lang], {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(months);
}

/** Whole weeks , what a merchant counting Mondays actually thinks in. */
export function formatWeeks(weeks: number, lang: Lang = "ar"): string {
  return formatNumber(Math.ceil(weeks), lang);
}

// ---------------------------------------------------------------------------
// Arabic sentence spacing , DESIGN-SYSYEM.md §8
// ---------------------------------------------------------------------------

/**
 * Split text into sentences so each one after the first can carry extra leading
 * space.
 *
 * Why this exists, from real feedback on the last build: *"in Arabic I read
 * everything like it's in a single line."* Arabic has no capital letter to mark
 * where a sentence restarts, so three short sentences read as one long run and
 * the reader has to hunt for the full stops.
 *
 * The fix is to give every sentence after the first roughly double the normal word
 * gap. Render each returned sentence in a span with `me-[0.45em]` on all but the
 * last, and emit a real space between them so lines still break normally.
 *
 * The trailing margin goes on the END of the preceding sentence, never the start
 * of the next , a trailing margin disappears when the line wraps there, a leading
 * one would look like an indent.
 *
 * Requiring whitespace after the full stop is what keeps "4.5 شهر", "Next.js" and
 * "tokens.css" intact.
 *
 * Do NOT apply this to quotations. A verbatim quote is reproduced as written.
 */
export function splitSentences(text: string): string[] {
  const out: string[] = [];
  let buf = "";

  for (let i = 0; i < text.length; i++) {
    buf += text[i];
    const ends = text[i] === "." || text[i] === "؟" || text[i] === "!";
    const spaceNext = i + 1 < text.length && /\s/.test(text[i + 1]);

    if (ends && spaceNext) {
      out.push(buf.trim());
      buf = "";
      while (i + 1 < text.length && /\s/.test(text[i + 1])) i++;
    }
  }

  const tail = buf.trim();
  if (tail) out.push(tail);

  return out;
}

// ---------------------------------------------------------------------------
// Direction
// ---------------------------------------------------------------------------

/**
 * Arrow keys follow the LANGUAGE, not the keyboard. In RTL, ArrowLeft is forward.
 * DESIGN-SYSYEM.md §7.
 */
export function directionKeys(dir: "rtl" | "ltr") {
  return {
    forward: dir === "rtl" ? "ArrowLeft" : "ArrowRight",
    back: dir === "rtl" ? "ArrowRight" : "ArrowLeft",
  };
}

// ---------------------------------------------------------------------------
// Submission 3 additions: halalas and dates
// ---------------------------------------------------------------------------

/**
 * A riyal amount that keeps its halalas only when it has them:
 * 450 → "450", 112.5 → "112.50". Same bare-figure rule as formatSar.
 */
export function formatAmount(n: number, lang: Lang = "ar"): string {
  const whole = Number.isInteger(n);
  return new Intl.NumberFormat(LOCALE[lang], {
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(n);
}

/**
 * Plain `ar-SA` formats dates in the Hijri calendar (islamic-umalqura). Tabby
 * schedules are Gregorian, so the calendar is forced along with the digits.
 */
const DATE_LOCALE: Record<Lang, string> = {
  ar: "ar-SA-u-ca-gregory-nu-latn",
  en: "en-GB",
};

/** "Wednesday 23 September", for a lock screen. */
export function formatLongDay(iso: string, lang: Lang = "ar"): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat(DATE_LOCALE[lang], {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

/** "7 Aug 2026", for dated sources. Same calendar and UTC rules as formatDay. */
export function formatDate(iso: string, lang: Lang = "ar"): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat(DATE_LOCALE[lang], {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

/** "23 Oct" / "23 أكتوبر". Parsed as UTC so no timezone can shift the day. */
export function formatDay(iso: string, lang: Lang = "ar"): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat(DATE_LOCALE[lang], {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

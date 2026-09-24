"use client";

/**
 * The cap bar. Spec §11.2: "The cap bar is the only progress bar in the
 * product. Don't add others."
 *
 * Fill is ink, not green: green means "a plan you know" on this page, and a
 * cap filling up is not good news. Meaning is carried by the words beneath
 * it, never by colour alone (DESIGN-SYSTEM.md §4 rule 5).
 *
 * `adding` previews a purchase that would split: a second, lighter segment,
 * plus a sentence. When it would pass the cap the preview is not drawn past
 * the end; the sentence says "would be 2,240 of 2,000" instead.
 */

import { useLang } from "@/lib/LanguageProvider";
import Money from "@/components/ui/Money";

interface CapBarProps {
  used: number;
  cap: number;
  /** A purchase being considered, previewed on top of `used`. */
  adding?: number;
  size?: "regular" | "large";
}

const pct = (n: number, cap: number) => `${Math.min(100, Math.max(0, (n / cap) * 100))}%`;

export default function CapBar({ used, cap, adding = 0, size = "regular" }: CapBarProps) {
  const { t } = useLang();
  const after = used + adding;
  const passes = after > cap;

  return (
    <div className="flex flex-col gap-s1">
      <p className="flex flex-wrap items-baseline gap-s1 text-small text-muted">
        <span>{t.capLabel}</span>
        <Money value={used} className="font-semibold text-ink" />
        <span>{t.capOf}</span>
        <Money value={cap} />
      </p>

      <div
        role="meter"
        aria-label={t.capLabel}
        aria-valuemin={0}
        aria-valuemax={cap}
        aria-valuenow={used}
        className={`capbar ${size === "large" ? "capbar--large" : ""}`}
      >
        <span className="capbar__fill" style={{ inlineSize: pct(used, cap) }} />
        {adding > 0 && !passes ? (
          <span
            className="capbar__adding"
            style={{ insetInlineStart: pct(used, cap), inlineSize: pct(adding, cap) }}
          />
        ) : null}
      </div>

      {adding > 0 ? (
        <p className="flex flex-wrap items-baseline gap-s1 text-small text-muted">
          <span>{t.capWithThis}</span>
          {passes ? <span>{t.capWouldBe}</span> : null}
          <Money value={after} className={passes ? "font-semibold text-ink" : ""} />
          <span>{t.capOf}</span>
          <Money value={cap} />
        </p>
      ) : null}
    </div>
  );
}

"use client";

/**
 * The payment schedule: "Today 112.50 / 23 Oct 112.50 / …".
 *
 * `reveal` turns on the phone receipt's line-by-line resolve, the ONE
 * orchestrated animation in the app flow (spec §5.3 Screen 4). Each row's
 * delay is its index times --t-micro, so four rows land inside --t-reveal.
 * The hero never sets it: there the receipt "appears instantly" (§12).
 */

import type { Instalment } from "@/lib/machine";
import { useLang } from "@/lib/LanguageProvider";
import { formatDay } from "@/lib/format";
import Money from "@/components/ui/Money";

interface PlanScheduleProps {
  schedule: Instalment[];
  reveal?: boolean;
  /** Rows at or after this index are shown struck through (refund). */
  cancelledFrom?: number;
}

export default function PlanSchedule({ schedule, reveal = false, cancelledFrom }: PlanScheduleProps) {
  const { lang, t } = useLang();

  return (
    <ol className="flex flex-col">
      {schedule.map((row, i) => {
        const cancelled = cancelledFrom !== undefined && i >= cancelledFrom;
        return (
          <li
            key={row.date}
            className={`flex items-baseline justify-between gap-s2 border-b border-rule-soft py-s1 text-body ${
              reveal ? "resolve" : ""
            } ${cancelled ? "text-faint line-through" : "text-ink"}`}
            style={reveal ? { ["--i" as string]: i } : undefined}
          >
            <span className={i === 0 ? "font-semibold" : ""}>
              {i === 0 ? t.today : formatDay(row.date, lang)}
            </span>
            <Money value={row.amount} />
          </li>
        );
      })}
    </ol>
  );
}

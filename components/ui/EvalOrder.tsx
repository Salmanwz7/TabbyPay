"use client";

/**
 * The fixed order every purchase is checked in, as lib/machine.ts
 * evaluatePurchase() runs it. Shown in the simulator and on the phone's
 * Set-rules screen, so the order on the page is the order in the engine.
 */

import { useId } from "react";
import { useLang } from "@/lib/LanguageProvider";

export default function EvalOrder({ compact = false }: { compact?: boolean }) {
  const { t } = useLang();
  const headingId = useId();
  const size = compact ? "text-small" : "text-body";

  return (
    <div className="flex flex-col gap-s1">
      <p id={headingId} className={`${size} font-semibold`}>
        {t.evalOrderHeading}
      </p>
      <ol aria-labelledby={headingId} className={`flex list-decimal flex-col gap-s1 ps-s3 ${size} text-ink-soft marker:text-muted`}>
        {t.evalOrder.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <p className={`${size} font-semibold`}>{t.evalOrderEnd}</p>
    </div>
  );
}

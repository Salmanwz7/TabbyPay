"use client";

/**
 * Act 1 · وش الخلل اليوم (spec §12).
 *
 * Two sections, not three paragraphs. The first is the statement (1.1) as its
 * heading, the two lines that make it land, then the broken promise (1.2)
 * itself, so the phones never arrive unannounced (submission 2's lesson).
 * The second is the evidence (1.3).
 */

import { useLang } from "@/lib/LanguageProvider";
import SectionShell from "@/components/ui/SectionShell";
import BrokenPromise from "@/components/act1/BrokenPromise";
import Evidence from "@/components/act1/Evidence";

export default function Act1() {
  const { t } = useLang();

  return (
    <>
      <SectionShell kicker={t.act1Kicker} id="act-1">
        <h2 className="display max-w-measure text-h3 sm:text-h2 lg:text-h1">{t.act1Statement}</h2>
        <p className="mt-s3 max-w-measure text-lead leading-body text-ink-soft sm:text-lead-lg">
          {t.act1Setup.map((line, i) => (
            <span key={line} className={i < t.act1Setup.length - 1 ? "me-sentence" : ""}>
              {line}{" "}
            </span>
          ))}
        </p>
        <div className="mt-s5">
          <BrokenPromise />
        </div>
      </SectionShell>

      <SectionShell>
        <Evidence />
      </SectionShell>
    </>
  );
}

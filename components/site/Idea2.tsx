"use client";

/**
 * Idea 2 · Split Rules (ours).
 *
 * Why first: online, Tabby tells you before; the UAE card tells you after
 * (the broken-promise phones), then the evidence. Then the rules simulator,
 * moved here from the hero when the submission became "Tabby Pay"
 * (NOTES.md R1). The Split Rules phone prototype joins at Gate B.
 */

import { useLang } from "@/lib/LanguageProvider";
import SectionShell from "@/components/ui/SectionShell";
import BrokenPromise from "@/components/act1/BrokenPromise";
import Evidence from "@/components/act1/Evidence";
import RulesSimulator from "@/components/sim/RulesSimulator";

export default function Idea2() {
  const { t } = useLang();

  return (
    <>
      <SectionShell kicker={t.act1Kicker} id="idea-2">
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

      <SectionShell>
        <RulesSimulator />
      </SectionShell>
    </>
  );
}

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
import SplitRulesApp from "@/components/phone/app/SplitRulesApp";

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

      {/* 2.2 · the eight screens, clickable, inside the Tabby app. */}
      <SectionShell id="split-rules">
        <h2 className="display max-w-measure text-h3 sm:text-h2">{t.srTitle}</h2>
        <p className="mt-s3 max-w-measure text-lead leading-body text-ink-soft sm:text-lead-lg">
          {t.srLead.map((line, i) => (
            <span key={line} className={i < t.srLead.length - 1 ? "me-sentence" : ""}>
              {line}{" "}
            </span>
          ))}
        </p>
        <div className="mt-s5">
          <SplitRulesApp />
        </div>
        <div className="mt-s5 flex flex-col gap-s2">
          <h3 className="text-body font-semibold">{t.srNotBuiltHeading}</h3>
          <ul className="flex flex-wrap gap-s1">
            {t.srNotBuilt.map((item) => (
              <li key={item} className="tag-known">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </SectionShell>

      <SectionShell id="try-rules">
        <h2 className="display max-w-measure text-h3 sm:text-h2">{t.simTitle}</h2>
        <div className="mt-s5">
          <RulesSimulator />
        </div>
      </SectionShell>

      {/* 2.3 · the rule that can't be changed, as a strength. */}
      <SectionShell>
        <h2 className="headline max-w-measure text-h3 sm:text-h2">{t.lockTitle}</h2>
        <p className="mt-s3 max-w-measure text-lead leading-body text-ink-soft sm:text-lead-lg">
          {t.lockLines.map((line, i) => (
            <span key={line} className={i < t.lockLines.length - 1 ? "me-sentence" : ""}>
              {line}{" "}
            </span>
          ))}
        </p>
      </SectionShell>
    </>
  );
}

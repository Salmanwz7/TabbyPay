"use client";

/**
 * Idea 1 · the card comes to Saudi. The statement, the two lines that make
 * it land, then the Saudi Tabby app with the new Card tab, clickable from
 * home to a card that's ready. The source line says where the steps come
 * from and that everything Saudi-specific is a proposal.
 */

import { useLang } from "@/lib/LanguageProvider";
import SectionShell from "@/components/ui/SectionShell";
import IssueCardApp from "@/components/phone/app/IssueCardApp";

export default function Idea1() {
  const { t } = useLang();

  return (
    <SectionShell kicker={t.idea1Kicker} id="idea-1">
      <h2 className="display max-w-measure text-h3 sm:text-h2">{t.idea1Title}</h2>
      <p className="mt-s3 max-w-measure text-lead leading-body text-ink-soft sm:text-lead-lg">
        {t.idea1Setup.map((line, i) => (
          <span key={line} className={i < t.idea1Setup.length - 1 ? "me-sentence" : ""}>
            {line}{" "}
          </span>
        ))}
      </p>
      <div className="mt-s5">
        <IssueCardApp />
      </div>
      <p className="mt-s4 max-w-measure text-small text-muted">{t.idea1Source}</p>
    </SectionShell>
  );
}

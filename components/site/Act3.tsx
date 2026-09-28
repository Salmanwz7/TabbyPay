"use client";

/**
 * Who benefits · why now · the responsible-lending line (spec §12, Act 3).
 *
 * The selector is a tablist: three views of the same card, one visible at a
 * time. One tab stop, arrows follow the reading direction (§7), and the
 * panel is focusable so a keyboard user can reach its text.
 *
 * Every dated line in "why now" is a verified row in EVIDENCE.md, with its
 * source printed under it.
 */

import { useRef, useState } from "react";
import { useLang } from "@/lib/LanguageProvider";
import { directionKeys } from "@/lib/format";
import SectionShell, { Statement } from "@/components/ui/SectionShell";

export default function Act3() {
  const { t } = useLang();

  return (
    <>
      <SectionShell kicker={t.benefitsKicker} id="who-benefits">
        <h2 className="display max-w-measure text-h3 sm:text-h2">{t.benefitsTitle}</h2>
        <div className="mt-s4">
          <Benefits />
        </div>
      </SectionShell>

      <SectionShell kicker={t.whyKicker} id="why-now">
        <h2 className="display max-w-measure text-h3 sm:text-h2">{t.whyTitle}</h2>
        <div className="mt-s4 grid gap-s4 lg:grid-cols-2">
          <Timeline heading={t.whyTabbyHeading} items={t.whyTabby} />
          <div className="flex flex-col gap-s3">
            <Timeline heading={t.whyIndustryHeading} items={t.whyIndustry} />
            <p className="max-w-measure text-body text-ink-soft">{t.whyIndustryNote}</p>
          </div>
        </div>
      </SectionShell>

      <Statement id="responsible-lending" setup={t.lendingSetup}>
        {t.lendingTitle}
      </Statement>
    </>
  );
}

function Benefits() {
  const { t, dir } = useLang();
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const views = t.benefits;
  const view = views[active];

  return (
    <div className="flex flex-col gap-s3">
      <div
        role="tablist"
        aria-label={t.benefitsKicker}
        className="flex flex-wrap gap-s1"
        onKeyDown={(e) => {
          const { forward, back } = directionKeys(dir);
          let next = -1;
          if (e.key === forward) next = (active + 1) % views.length;
          else if (e.key === back) next = (active - 1 + views.length) % views.length;
          else if (e.key === "Home") next = 0;
          else if (e.key === "End") next = views.length - 1;
          if (next < 0) return;
          e.preventDefault();
          setActive(next);
          tabRefs.current[next]?.focus();
        }}
      >
        {views.map((v, i) => (
          <button
            key={v.id}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`benefit-tab-${v.id}`}
            aria-selected={i === active}
            aria-controls="benefit-panel"
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={`min-h-tap rounded-tabby border px-s3 text-body font-semibold transition-colors duration-(--t-micro) ${
              i === active ? "border-ink bg-ink text-paper" : "border-muted bg-card text-ink hover:border-ink"
            }`}
          >
            {v.name}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id="benefit-panel"
        aria-labelledby={`benefit-tab-${view.id}`}
        tabIndex={0}
        className="rounded-tabby border border-rule bg-card p-s3 sm:p-s4"
      >
        <ul className="flex max-w-measure flex-col gap-s2">
          {view.lines.map((line) => (
            <li key={line} className="text-lead leading-body text-ink">
              {line}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

interface Dated {
  date: string;
  text: string;
  source: string;
}

function Timeline({ heading, items }: { heading: string; items: Dated[] }) {
  return (
    <div className="flex flex-col gap-s2">
      <h3 className="text-body font-semibold">{heading}</h3>
      <ol className="flex flex-col border-s border-rule">
        {items.map((item) => (
          <li key={item.date} className="flex flex-col gap-s1 ps-s3 pb-s3">
            <span className="tnum text-small font-semibold text-ink">{item.date}</span>
            <span className="tnum max-w-measure text-body text-ink">{item.text}</span>
            <span className="tnum text-small text-muted">{item.source}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

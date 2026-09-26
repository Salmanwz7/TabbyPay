"use client";

/**
 * The hero: the rules simulator (spec §12).
 *
 * "A judge who moves the cap slider and watches the furniture purchase flip
 * from 'split' to 'over your cap' understands the product in four seconds."
 *
 * So everything here is built around one visible cause and effect:
 *
 *   - The two rules are SENTENCES with the live figure inside them, not
 *     toggles (§11.2). The slider sits under its sentence.
 *   - Every purchase button carries its outcome WORD, recomputed on every
 *     slider tick. Moving a slider flips words on buttons you haven't
 *     pressed. The word carries the meaning; colour only reinforces it.
 *   - The receipt answers for the selected purchase: the schedule and
 *     "Split by your rule", or the reason it wasn't split.
 *
 * Each purchase is evaluated against the SAME month-to-date (840), not
 * cumulatively, so a visitor can compare one purchase across rule settings.
 * (NOTES.md H1.) The engine is lib/machine.ts, shared with the phone.
 *
 * Motion: the receipt settles in (240ms) only when the selected purchase or
 * its outcome changes. Dragging a slider that doesn't change the outcome
 * moves nothing but the numbers.
 */

import { useRef, useState } from "react";
import { evaluatePurchase, payIn4, type Outcome } from "@/lib/machine";
import {
  DEFAULT_RULES,
  HERO_PURCHASE_IDS,
  MONTH_TO_DATE,
  STATEMENT_CLOSES,
  TODAY,
  byId,
  type Purchase,
  type Rules,
} from "@/lib/mock-data";
import type { Copy } from "@/lib/copy";
import { useLang } from "@/lib/LanguageProvider";
import { directionKeys, formatDay, formatNumber } from "@/lib/format";
import Slider from "@/components/ui/Slider";
import Money from "@/components/ui/Money";
import CapBar from "@/components/ui/CapBar";
import PlanSchedule from "@/components/ui/PlanSchedule";

const THRESHOLD = { min: 50, max: 1000, step: 50 };
const CAP = { min: 500, max: 5000, step: 100 };

const OUTCOME_WORD: Record<Outcome, keyof Copy> = {
  MATCHES_RULE: "outcomeSplits",
  BELOW_THRESHOLD: "outcomeStatement",
  OVER_CAP: "outcomeOverCap",
  FEE_PLAN_AVAILABLE: "outcomeAsks",
  NOT_ELIGIBLE: "outcomeNotEligible",
};

export default function RulesSimulator() {
  const { lang, dir, t } = useLang();
  const tileRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [rules, setRules] = useState<Rules>(DEFAULT_RULES);
  const [selectedId, setSelectedId] = useState<string>("jarir");
  // The nudge retires once the visitor has done the four-second thing.
  const [flipped, setFlipped] = useState(false);

  const purchases = HERO_PURCHASE_IDS.map(byId);
  const selected = byId(selectedId);
  const outcome = evaluatePurchase(selected, rules, MONTH_TO_DATE);

  return (
    <div className="grid gap-s4 lg:grid-cols-2">
      {/* ---------------------------------------------------------------- */}
      {/* Rules + purchases                                                  */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex flex-col gap-s4 rounded-tabby border border-rule bg-card p-s3 sm:p-s4">
        <div className="flex flex-wrap items-center justify-between gap-s2">
          <h2 className="text-title font-semibold">{t.rulesHeading}</h2>
          <span className="tag-known">{t.prototypeTag}</span>
        </div>

        <div className="flex flex-col gap-s3">
          <Rule label={t.rule1Label}>
            {t.rule1Before} <Money value={rules.threshold} /> {t.rule1After}{" "}
            <span aria-hidden="true">{t.forward}</span> {t.rule1Result}
          </Rule>
          <Slider
            hideLabel
            label={t.rule1Label}
            value={rules.threshold}
            {...THRESHOLD}
            onChange={(threshold) => setRules((r) => ({ ...r, threshold }))}
            minLabel={formatNumber(THRESHOLD.min, lang)}
            maxLabel={formatNumber(THRESHOLD.max, lang)}
          />
        </div>

        <div className="flex flex-col gap-s3">
          <Rule label={t.rule2Label}>
            {t.rule2Before} <Money value={rules.cap} /> {t.rule2After}
          </Rule>
          <Slider
            hideLabel
            label={t.rule2Label}
            value={rules.cap}
            {...CAP}
            onChange={(cap) => {
              setRules((r) => ({ ...r, cap }));
              if (selectedId === "furniture") setFlipped(true);
            }}
            minLabel={formatNumber(CAP.min, lang)}
            maxLabel={formatNumber(CAP.max, lang)}
          />
        </div>

        <LockedRule t={t} />

        <div className="flex flex-col gap-s2 border-t border-rule pt-s3">
          <h3 className="text-body font-semibold">{t.purchasesHeading}</h3>
          <p className="text-small text-muted">{t.purchasesHelp}</p>
          {/* Single-select, so a radiogroup: one tab stop, arrows move and
              select, and arrows follow the reading direction (§7). */}
          <div
            role="radiogroup"
            aria-label={t.purchasesHeading}
            className="grid grid-cols-2 gap-s2"
            onKeyDown={(e) => {
              const { forward, back } = directionKeys(dir);
              const step =
                e.key === forward || e.key === "ArrowDown" ? 1 : e.key === back || e.key === "ArrowUp" ? -1 : 0;
              if (!step) return;
              e.preventDefault();
              const i = purchases.findIndex((p) => p.id === selectedId);
              const next = purchases[(i + step + purchases.length) % purchases.length];
              setSelectedId(next.id);
              tileRefs.current[next.id]?.focus();
            }}
          >
            {purchases.map((p) => (
              <PurchaseTile
                key={p.id}
                ref={(el) => {
                  tileRefs.current[p.id] = el;
                }}
                purchase={p}
                outcome={evaluatePurchase(p, rules, MONTH_TO_DATE)}
                selected={p.id === selectedId}
                onSelect={() => setSelectedId(p.id)}
              />
            ))}
          </div>
          {/* The flip, said out loud: changes only when an outcome word
              changes, not on every slider tick, so it never chatters. */}
          <p className="sr-only" aria-live="polite">
            {purchases
              .map((p) => `${p.merchant[lang]}: ${t[OUTCOME_WORD[evaluatePurchase(p, rules, MONTH_TO_DATE)]]}`)
              .join(lang === "ar" ? "، " : ", ")}
          </p>
          {/* Below lg the receipt sits under the fold, so a tap would show
              nothing. The answer is pinned here as well. Visual only: the
              receipt below stays the one live region. (NOTES.md H6.) */}
          <p
            aria-hidden="true"
            className="flex flex-wrap items-baseline gap-s1 rounded-tabby bg-paper p-s2 text-body lg:hidden"
          >
            <span className="font-semibold">{selected.merchant[lang]}</span>
            <span className="text-faint">·</span>
            <span>{t[OUTCOME_WORD[outcome]] as string}</span>
            {outcome === "MATCHES_RULE" ? (
              <>
                <span className="text-faint">·</span>
                <bdi className="tnum">4 ×</bdi>
                <Money value={payIn4(selected.amount, TODAY)[1].amount} />
              </>
            ) : null}
          </p>
          {!flipped ? <p className="hint">{t.heroNudge}</p> : null}
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Receipt                                                            */}
      {/* ---------------------------------------------------------------- */}
      <section
        aria-labelledby="hero-receipt"
        className="flex flex-col gap-s3 self-start rounded-tabby border border-rule bg-card p-s3 sm:p-s4 lg:sticky lg:top-s3"
      >
        <h2 id="hero-receipt" className="text-small font-medium text-muted">
          {t.receiptHeading}
        </h2>

        {/* The live region stays mounted so screen readers hear every update;
            only the inner node is re-keyed, to settle when the answer changes. */}
        <div aria-live="polite">
          <div key={`${selectedId}:${outcome}`} className="settle flex flex-col gap-s3">
            <p className="flex flex-wrap items-baseline gap-s1 text-body">
              <span className="font-semibold">{selected.merchant[lang]}</span>
              <span aria-hidden="true" className="text-faint">·</span>
              <Money value={selected.amount} />
            </p>
            <ReceiptBody purchase={selected} outcome={outcome} rules={rules} />
          </div>
        </div>

        <div className="border-t border-rule pt-s3">
          <CapBar
            used={MONTH_TO_DATE}
            cap={rules.cap}
            adding={outcome === "MATCHES_RULE" || outcome === "OVER_CAP" ? selected.amount : 0}
          />
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------

function Rule({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-s1">
      <span className="text-small text-muted">{label}</span>
      <p className="text-title leading-snug font-semibold">{children}</p>
    </div>
  );
}

/** Rule 3. Visible, locked, and presented as a feature (spec §5.2). */
function LockedRule({ t }: { t: Copy }) {
  return (
    <div className="flex flex-col gap-s1">
      <span className="text-small text-muted">{t.rule3Label}</span>
      <p className="flex items-center gap-s1 text-title leading-snug font-semibold">
        <LockIcon label={t.lockedAria} />
        <span>
          {t.rule3Sentence} <span aria-hidden="true">{t.forward}</span> {t.rule3Result}
        </span>
      </p>
      <p className="text-small text-muted">{t.rule3Locked}</p>
    </div>
  );
}

function LockIcon({ label }: { label: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" role="img" aria-label={label} className="flex-none">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function PurchaseTile({
  ref,
  purchase,
  outcome,
  selected,
  onSelect,
}: {
  ref: React.Ref<HTMLButtonElement>;
  purchase: Purchase;
  outcome: Outcome;
  selected: boolean;
  onSelect: () => void;
}) {
  const { lang, t } = useLang();
  return (
    <button
      ref={ref}
      type="button"
      role="radio"
      aria-checked={selected}
      tabIndex={selected ? 0 : -1}
      onClick={onSelect}
      className={`tile ${selected ? "tile--on" : ""}`}
    >
      <span className="text-label font-medium text-ink">{purchase.merchant[lang]}</span>
      <Money value={purchase.amount} className="text-lead font-semibold text-ink" unitClassName="text-small font-normal text-muted" />
      <OutcomeWord outcome={outcome} label={t[OUTCOME_WORD[outcome]] as string} />
    </button>
  );
}

/**
 * The outcome in a word. The green dot appears only on "Splits": on this page
 * green means one thing, a plan you know (DESIGN-SYSTEM.md §4 rule 1). Gold
 * marks "asks you", the consent lane. Everything else is plain text.
 */
function OutcomeWord({ outcome, label }: { outcome: Outcome; label: string }) {
  if (outcome === "MATCHES_RULE") return <span className="hint text-ink">{label}</span>;
  if (outcome === "FEE_PLAN_AVAILABLE") return <span className="tag-guess">{label}</span>;
  return <span className="text-small text-muted">{label}</span>;
}

// ---------------------------------------------------------------------------

function ReceiptBody({ purchase, outcome, rules }: { purchase: Purchase; outcome: Outcome; rules: Rules }) {
  const { lang, t } = useLang();

  if (outcome === "MATCHES_RULE") {
    const schedule = payIn4(purchase.amount, TODAY);
    return (
      <>
        <div className="flex flex-col gap-s1">
          <p className="text-small text-muted">{t.fourPaymentsOf}</p>
          <p className="text-h3 leading-tight font-bold">
            <Money value={schedule[1].amount} unitClassName="text-lead font-semibold" />
          </p>
        </div>
        <PlanSchedule schedule={schedule} />
        {/* The line that matters most (spec §5.3 Screen 4). */}
        <p className="hint text-body font-semibold text-ink">
          <span>
            {t.splitByRuleBefore} <Money value={rules.threshold} /> {t.splitByRuleAfter}
          </span>
        </p>
        <p className="text-small text-muted">
          {t.changeUntilBefore} <bdi className="tnum">{formatDay(STATEMENT_CLOSES, lang)}</bdi>
        </p>
      </>
    );
  }

  if (outcome === "FEE_PLAN_AVAILABLE" && purchase.feePlan) {
    const { months, fee } = purchase.feePlan;
    // Spec §11.2: the fee is the largest number on its screen. Fee and total
    // are text-figure (40px); nothing else in this card is above text-title.
    return (
      <>
        <p className="text-lead font-semibold">{t.feeTitle}</p>
        <div className="flex flex-col gap-s1">
          <p className="text-body text-ink-soft">
            {t.feeMonthsBefore} <bdi className="tnum">{months}</bdi> {t.feeMonthsAfter}
          </p>
          <p className="text-figure leading-tight font-bold">
            <Money value={fee} unitClassName="text-lead font-semibold" />
          </p>
        </div>
        <div className="flex flex-col gap-s1">
          <p className="text-body text-ink-soft">{t.feeTotal}</p>
          <p className="text-figure leading-tight font-bold">
            <Money value={purchase.amount + fee} unitClassName="text-lead font-semibold" />
          </p>
        </div>
        <p className="text-body font-semibold">{t.feeNothingYet}</p>
        <p className="tag-guess self-start">{t.feeIllustrative}</p>
      </>
    );
  }

  // Not split. Say why, in the customer's terms, and what they can still do.
  return (
    <>
      <p className="text-title font-semibold">{t.statementTitle}</p>
      <p className="max-w-measure text-body text-ink-soft">
        {outcome === "OVER_CAP" ? (
          <>
            {t.overCapBefore} <Money value={rules.cap} />
            {t.overCapAfter}
          </>
        ) : (
          <>
            {t.belowBefore}
            <Money value={rules.threshold} />
            {t.belowAfter}
          </>
        )}
      </p>
    </>
  );
}

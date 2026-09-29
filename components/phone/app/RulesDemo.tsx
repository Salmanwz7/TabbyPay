"use client";

/**
 * Split Rules in three steps (Salman, 29 Sep: "make it easy, same idea").
 * Replaces the eight-screen prototype and the separate simulator (NOTES H1).
 *
 *   1. Set your rule: two choices of three buttons each, no sliders. The
 *      fee rule is fixed and says so.
 *   2. Pay with the card: four purchases.
 *   3. See what happened: the Tabby app shows the result in one plain
 *      sentence. It asks only when there's a fee, or when you'd go past
 *      your cap and might want to split anyway.
 *
 * The decision is the engine's (lib/machine.ts evaluatePurchase, tested);
 * this file only says it plainly. Each purchase is judged on its own against
 * the month so far, not added up (NOTES H1), so trying them in any order
 * gives the same answers.
 */

import { useEffect, useId, useRef, useState } from "react";
import { evaluatePurchase, payIn4, schedule } from "@/lib/machine";
import { byId, HERO_PURCHASE_IDS, MONTH_TO_DATE, TODAY, type Rules } from "@/lib/mock-data";
import { useLang } from "@/lib/LanguageProvider";
import { formatNumber } from "@/lib/format";
import Phone from "@/components/phone/Phone";
import { StatusBar } from "@/components/phone/app/AppShell";
import TabbyMark from "@/components/ui/TabbyMark";
import Money, { InAppContext } from "@/components/ui/Money";
import PlanSchedule from "@/components/ui/PlanSchedule";
import CapBar from "@/components/ui/CapBar";

const THRESHOLDS = [200, 300, 500];
const CAPS = [1000, 2000, 3000];

/** What the customer decided on a purchase that asked them. */
type Choice = "split" | "statement" | null;

export default function RulesDemo() {
  const { t } = useLang();
  const [rules, setRules] = useState<Rules>({ threshold: 300, cap: 2000 });
  const [paidId, setPaidId] = useState<string | null>(null);
  const [choice, setChoice] = useState<Choice>(null);

  // A new rule or a new purchase starts the answer again.
  const pay = (id: string) => {
    setPaidId(id);
    setChoice(null);
  };
  const setRule = (r: Rules) => {
    setRules(r);
    setChoice(null);
  };

  return (
    <div className="grid items-start gap-s5 lg:grid-cols-2">
      <div className="flex flex-col gap-s4">
        <section className="flex flex-col gap-s2" aria-labelledby="rd-step1">
          <h3 id="rd-step1" className="text-title font-semibold">
            {t.rdStep1}
          </h3>
          <Picks
            before={t.rdRuleABefore}
            after={t.rdRuleAAfter}
            options={THRESHOLDS}
            value={rules.threshold}
            onPick={(threshold) => setRule({ ...rules, threshold })}
          />
          <Picks
            before={t.rdRuleBBefore}
            after={t.rdRuleBAfter}
            options={CAPS}
            value={rules.cap}
            onPick={(cap) => setRule({ ...rules, cap })}
          />
          <p className="flex items-center gap-s1 text-body text-ink">
            <LockGlyph />
            {t.rdRuleC}
          </p>
        </section>

        <section className="flex flex-col gap-s2" aria-labelledby="rd-step2">
          <h3 id="rd-step2" className="text-title font-semibold">
            {t.rdStep2}
          </h3>
          <PurchasePicks value={paidId} onPick={pay} />
        </section>
      </div>

      <section className="flex flex-col gap-s2" aria-labelledby="rd-step3">
        <h3 id="rd-step3" className="text-title font-semibold">
          {t.rdStep3}
        </h3>
        <InAppContext value={true}>
          <Phone>
            <div className="app">
              <StatusBar />
              <div className="app-body app-body--plain" aria-live="polite">
                {paidId ? (
                  <Result key={`${paidId}-${rules.threshold}-${rules.cap}`} purchaseId={paidId} rules={rules} choice={choice} onChoose={setChoice} />
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center gap-s2 text-center">
                    <TabbyMark size={40} />
                    <p className="text-body text-muted">{t.rdIdle}</p>
                  </div>
                )}
              </div>
            </div>
          </Phone>
        </InAppContext>
        <p className="text-center text-small text-muted">{t.rdMock}</p>
      </section>
    </div>
  );
}

/** "Split by itself anything from [200] [300] [500] riyals up": one sentence, the choice inside it. */
function Picks({ before, after, options, value, onPick }: { before: string; after: string; options: number[]; value: number; onPick: (n: number) => void }) {
  const { lang } = useLang();
  const name = useId();
  return (
    <fieldset className="flex flex-wrap items-center gap-s1 text-body text-ink">
      <legend className="sr-only">
        {before} … {after}
      </legend>
      <span aria-hidden="true">{before}</span>
      {options.map((n) => (
        <label key={n} className="pick">
          <input type="radio" name={name} className="sr-only" checked={value === n} onChange={() => onPick(n)} />
          <bdi className="tnum">{formatNumber(n, lang)}</bdi>
        </label>
      ))}
      <span aria-hidden="true">{after}</span>
    </fieldset>
  );
}

function PurchasePicks({ value, onPick }: { value: string | null; onPick: (id: string) => void }) {
  const { lang, t } = useLang();
  const name = useId();
  return (
    <fieldset className="grid grid-cols-2 gap-s1">
      <legend className="sr-only">{t.rdStep2}</legend>
      {HERO_PURCHASE_IDS.map((id) => {
        const p = byId(id);
        return (
          <label key={id} className="pick pick--tile">
            <input type="radio" name={name} className="sr-only" checked={value === id} onChange={() => onPick(id)} />
            <span className="font-semibold">{p.merchant[lang]}</span>
            <Money value={p.amount} className="text-small" />
          </label>
        );
      })}
    </fieldset>
  );
}

function Result({ purchaseId, rules, choice, onChoose }: { purchaseId: string; rules: Rules; choice: Choice; onChoose: (c: Choice) => void }) {
  const { lang, t } = useLang();
  const p = byId(purchaseId);
  const outcome = evaluatePurchase(p, rules, MONTH_TO_DATE);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // The button that was pressed inside the phone is gone, so focus goes to
  // the new answer's title. Only after a choice, never on load.
  useEffect(() => {
    if (choice) titleRef.current?.focus({ preventScroll: true });
  }, [choice]);

  const splitIn4 = outcome === "MATCHES_RULE" || (outcome === "OVER_CAP" && choice === "split");
  const feeSplit = outcome === "FEE_PLAN_AVAILABLE" && choice === "split" && p.feePlan;
  const four = payIn4(p.amount, TODAY);
  const six = p.feePlan ? schedule(p.amount + p.feePlan.fee, p.feePlan.months, TODAY) : [];

  let title = t.rdStatementTitle;
  let why: React.ReactNode = null;
  if (outcome === "MATCHES_RULE") {
    title = t.rdSplitTitle;
    why = t.rdByRule;
  } else if (outcome === "BELOW_THRESHOLD") {
    why = t.rdBelow;
  } else if (outcome === "OVER_CAP") {
    title = choice === "split" ? t.rdYouSplitTitle : t.rdStatementTitle;
    why = choice === "split" ? null : t.rdOverCap;
  } else if (outcome === "FEE_PLAN_AVAILABLE") {
    title = choice === "split" ? t.rdFeeDoneTitle : choice === "statement" ? t.rdStatementTitle : t.rdFeeTitle;
    why = choice === "statement" ? t.rdYouChose : choice === null ? t.rdFeeWhy : null;
  }

  return (
    <div className="settle flex flex-1 flex-col gap-s2">
      {/* The purchase, as Tabby's notification. */}
      <div className="notif notif--static">
        <TabbyMark size={28} />
        <span className="flex flex-1 flex-col gap-s1">
          <span className="text-small font-semibold">{t.rdNotif}</span>
          <span className="web-row text-small">
            <span>{p.merchant[lang]}</span>
            <Money value={p.amount} className="font-semibold" />
          </span>
        </span>
      </div>

      <h4 ref={titleRef} tabIndex={-1} className="app-title">
        {title}
      </h4>

      {splitIn4 ? (
        <p className="flex flex-wrap items-baseline gap-s1 text-body">
          <Money value={four[1].amount} className="text-h3 font-bold" />
          <span>{t.rdEachMonth}</span>
        </p>
      ) : null}
      {why ? <p className="text-body text-ink-soft">{why}</p> : null}

      {outcome === "FEE_PLAN_AVAILABLE" && p.feePlan && choice !== "statement" ? (
        <div className="app-tile gap-s1">
          <p className="flex flex-wrap items-baseline gap-s1">
            <Money value={six[1].amount} className="text-title font-bold" />
            <span>{t.rdPerMonth}</span>
          </p>
          <p className="web-row text-small">
            <span>{t.rdFee}</span>
            <Money value={p.feePlan.fee} />
          </p>
          <p className="text-small text-muted">{t.rdFeeNote}</p>
        </div>
      ) : null}

      {splitIn4 ? <PlanSchedule schedule={four} /> : null}
      {feeSplit ? <PlanSchedule schedule={six} /> : null}

      {outcome === "OVER_CAP" || outcome === "MATCHES_RULE" ? (
        <CapBar used={MONTH_TO_DATE} cap={rules.cap} adding={splitIn4 ? p.amount : 0} />
      ) : null}

      <div className="mt-auto flex flex-col gap-s1">
        {outcome === "OVER_CAP" && choice === null ? (
          <button type="button" className="app-btn" onClick={() => onChoose("split")}>
            {t.rdSplitAnyway}
          </button>
        ) : null}
        {outcome === "FEE_PLAN_AVAILABLE" && choice === null ? (
          <>
            <button type="button" className="app-btn" onClick={() => onChoose("split")}>
              {t.rdFeeYes}
            </button>
            <button type="button" className="app-btn app-btn--quiet" onClick={() => onChoose("statement")}>
              {t.rdFeeNo}
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}

function LockGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="flex-none">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

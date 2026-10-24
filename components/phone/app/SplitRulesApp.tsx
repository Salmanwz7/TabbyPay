"use client";

/**
 * Idea 2 · the Split Rules prototype, inside the Tabby app's Card tab.
 *
 * All eight screens of spec §5.3 and the five edge cases of §5.4, driven by
 * the one reducer in lib/machine.ts. The list beside the phone opens any
 * screen; each scenario is built by replaying real events, so the list can
 * never show a state the machine couldn't reach.
 *
 *   IDLE card        Screen 1  the card with the three rules and the cap bar
 *   IDLE set_rules   Screen 2  two sliders, a live example, the locked rule
 *   TAP / CHECK      Screen 3  a simulated terminal moment (no wallet UI)
 *   RECEIPT          Screens 4, 5, 7 and the refund
 *   ASK_CUSTOMER     Screen 6  the fee and total are the biggest numbers
 *   CHANGE_PLAN      change until the statement closes
 *   IDLE this_month  Screen 8  grouped, with the cap bar, bigger
 *
 * Motion: the receipt's line-by-line resolve runs only when a receipt arrives
 * after a tap (the one orchestrated animation). The notification follows the
 * tap after a short pause, the tap being the visitor's own action.
 */

import { useEffect, useReducer, useRef, useState } from "react";
import {
  canChangePlan,
  canPayIn4,
  capUsed,
  evaluatePurchase,
  initialState,
  payIn4,
  reducer,
  type Entry,
  type Event,
  type ScenarioId,
  type State,
} from "@/lib/machine";
import { PURCHASES, STATEMENT_CLOSES, TODAY, byId } from "@/lib/mock-data";
import type { Tab } from "@/lib/issue";
import { useLang } from "@/lib/LanguageProvider";
import { formatDay, formatNumber } from "@/lib/format";
import Phone from "@/components/phone/Phone";
import AppShell, { NotInPrototype } from "@/components/phone/app/AppShell";
import HomeScreen from "@/components/phone/app/HomeScreen";
import CardVisual from "@/components/phone/app/CardVisual";
import Money from "@/components/ui/Money";
import CapBar from "@/components/ui/CapBar";
import PlanSchedule from "@/components/ui/PlanSchedule";
import Slider from "@/components/ui/Slider";
import EvalOrder from "@/components/ui/EvalOrder";

const NOTIFY_AFTER_MS = 1400;
const THRESHOLD = { min: 50, max: 1000, step: 50 };
const CAP = { min: 500, max: 5000, step: 100 };

type Dispatch = (e: Event | Event[]) => void;

export default function SplitRulesApp() {
  const { t } = useLang();
  const [state, dispatchRaw] = useReducer(reducer, undefined, initialState);
  const [tab, setTab] = useState<Tab>("card");
  const [revealId, setRevealId] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const acted = useRef(false);
  const prevTag = useRef(state.phase.tag);

  const dispatch: Dispatch = (e) => {
    acted.current = true;
    (Array.isArray(e) ? e : [e]).forEach(dispatchRaw);
  };

  // The notification follows the tap: rules decide at authorisation, the
  // receipt lands on the phone a moment later (spec §2.4, §5.3 Screen 4).
  // Only while the Card tab is open: leaving it cancels the pending receipt,
  // so nothing changes (and nothing steals focus) on a screen out of view.
  useEffect(() => {
    if (state.phase.tag !== "ELIGIBILITY_CHECK" || tab !== "card") return;
    const id = window.setTimeout(() => dispatchRaw({ type: "NOTIFY" }), NOTIFY_AFTER_MS);
    return () => window.clearTimeout(id);
  }, [state.phase.tag, tab]);

  // Reveal only a receipt that has just arrived after a tap or a choice.
  useEffect(() => {
    const was = prevTag.current;
    prevTag.current = state.phase.tag;
    if (state.phase.tag === "RECEIPT" && (was === "ELIGIBILITY_CHECK" || was === "ASK_CUSTOMER")) {
      setRevealId(state.phase.entryId);
    }
  }, [state.phase]);

  // A screen change unmounts the button that caused it: move focus to the
  // new screen's heading. Only after the visitor has acted, never on load.
  useEffect(() => {
    if (acted.current) headingRef.current?.focus({ preventScroll: true });
  }, [state.phase, tab]);

  const scenarios: { label: string; run: () => void }[] = [
    { label: t.srScreens[0], run: () => dispatch({ type: "RESET" }) },
    { label: t.srScreens[1], run: () => dispatch([{ type: "RESET" }, { type: "SHOW", view: "set_rules" }]) },
    { label: t.srScreens[2], run: () => dispatch([{ type: "RESET" }, { type: "TAP", purchaseId: "jarir" }]) },
    ...(["receipt", "over_cap", "fee_plan", "not_eligible", "this_month"] as ScenarioId[]).map((id, i) => ({
      label: t.srScreens[3 + i],
      run: () => dispatch({ type: "OPEN_SCENARIO", id }),
    })),
  ];
  const edges: { label: string; id: ScenarioId }[] = [
    { label: t.srEdges[0], id: "refund" },
    { label: t.srEdges[1], id: "rule_changed" },
  ];
  const openFromList = (run: () => void) => {
    setTab("card");
    setRevealId(null);
    run();
  };

  return (
    <div className="grid items-start gap-s5 lg:grid-cols-2">
      <Phone>
        <AppShell
          tab={tab}
          onTab={(next) => {
            acted.current = true;
            setTab(next);
          }}
        >
          {tab === "card" ? (
            <Screen state={state} dispatch={dispatch} headingRef={headingRef} revealId={revealId} />
          ) : tab === "home" ? (
            <>
              <h3 ref={headingRef} tabIndex={-1} className="sr-only">
                {t.appTabHome}
              </h3>
              <HomeScreen onOpenCard={() => setTab("card")} />
            </>
          ) : (
            <>
              <h3 ref={headingRef} tabIndex={-1} className="sr-only">
                {{ shop: t.appTabShop, payments: t.appTabPayments, account: t.appTabAccount }[tab]}
              </h3>
              <NotInPrototype />
            </>
          )}
        </AppShell>
      </Phone>

      <div className="flex flex-col gap-s4 lg:sticky lg:top-s3">
        <ScenarioList
          heading={t.srScreensHeading}
          numbered
          items={scenarios.map((s) => ({ label: s.label, onPick: () => openFromList(s.run) }))}
        />
        <ScenarioList
          heading={t.srEdgeHeading}
          items={edges.map((s) => ({
            label: s.label,
            onPick: () => openFromList(() => dispatch({ type: "OPEN_SCENARIO", id: s.id })),
          }))}
        />
        <p className="text-small text-muted">{t.srMock}</p>
      </div>
    </div>
  );
}

function ScenarioList({
  heading,
  items,
  numbered = false,
}: {
  heading: string;
  items: { label: string; onPick: () => void }[];
  numbered?: boolean;
}) {
  return (
    <div className="flex flex-col gap-s1">
      <h4 className="text-small font-semibold text-muted">{heading}</h4>
      <ul className="grid gap-s1 sm:grid-cols-2">
        {items.map((item, i) => (
          <li key={item.label}>
            <button type="button" className="tile w-full text-body text-ink" onClick={item.onPick}>
              <span>
                {numbered ? (
                  <>
                    <bdi className="tnum">{i + 1}</bdi> ·{" "}
                  </>
                ) : null}
                {item.label}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Screens
// ---------------------------------------------------------------------------

interface ScreenProps {
  state: State;
  dispatch: Dispatch;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  revealId: string | null;
}

function Screen({ state, dispatch, headingRef, revealId }: ScreenProps) {
  const { lang, t } = useLang();
  const { phase } = state;
  const heading = (text: string) => (
    <h3 ref={headingRef} tabIndex={-1} className="app-title">
      {text}
    </h3>
  );
  const home = () => dispatch({ type: "SHOW", view: "card" });

  switch (phase.tag) {
    case "IDLE":
      if (phase.view === "set_rules") return <SetRules state={state} dispatch={dispatch} heading={heading(t.srSetTitle)} />;
      if (phase.view === "this_month") return <ThisMonth state={state} onBack={home} heading={heading(t.srThisMonthBtn)} />;
      return <CardHome state={state} dispatch={dispatch} heading={heading(t.srYourCard)} />;

    case "TAP":
    case "ELIGIBILITY_CHECK": {
      // Screen 3. The tap happens on the terminal; no wallet UI is drawn.
      const p = byId(phase.purchaseId);
      const tapped = phase.tag === "ELIGIBILITY_CHECK";
      return (
        <>
          {heading(tapped ? t.bpApproved : t.srTap)}
          <span className="tag-known self-start">{t.srSim}</span>
          <div className="pos">
            <div className="pos__screen">
              <span className="text-body font-semibold">{p.merchant[lang]}</span>
              {tapped ? <span className="text-title font-bold">✓ {t.bpBeep}</span> : <Money value={p.amount} className="text-title font-bold" />}
            </div>
            <div className="pos__keys" aria-hidden="true">
              {Array.from({ length: 9 }, (_, i) => (
                <span key={i} />
              ))}
            </div>
          </div>
          {tapped ? (
            <p className="text-body text-muted">{t.srWaiting}</p>
          ) : (
            <button type="button" className="app-btn mt-auto" onClick={() => dispatch({ type: "AUTHORISE" })}>
              {t.srTap}
            </button>
          )}
        </>
      );
    }

    case "ASK_CUSTOMER": {
      // Screen 6. Never automatic; the cost is the headline. Over the cap as
      // well (3,200 on 840 of 2,000): both reasons, one decision.
      const p = byId(phase.purchaseId);
      const plan = p.feePlan!;
      const overCap = evaluatePurchase(p, state.rules, capUsed(state)) === "OVER_CAP_FEE_PLAN";
      return (
        <>
          <Notif />
          {heading(overCap ? t.overCapFeeTitle : t.feeTitle)}
          <Merchant purchaseId={p.id} />
          {overCap ? (
            <>
              <p className="text-body text-ink-soft">{t.overCapFeeOne}</p>
              <CapBar used={capUsed(state)} cap={state.rules.cap} adding={p.amount} />
            </>
          ) : null}
          <p className="text-small text-muted">{t.feeWhy}</p>
          <p className="text-body text-ink-soft">
            {t.feeMonthsBefore} <bdi className="tnum">{plan.months}</bdi> {t.feeMonthsAfter}
          </p>
          {/* Spec §11.2: the fee and the total are the largest numbers here. */}
          <p className="text-figure leading-tight font-bold">
            <Money value={plan.fee} />
          </p>
          <p className="text-body text-ink-soft">{t.feeTotal}</p>
          <p className="text-figure leading-tight font-bold">
            <Money value={p.amount + plan.fee} />
          </p>
          <p className="tag-guess self-start">{t.feeIllustrative}</p>
          <p className="text-body font-semibold">{t.feeNothingYet}</p>
          <div className="mt-auto flex flex-col gap-s1">
            <button type="button" className="app-btn" onClick={() => dispatch({ type: "CHOOSE", choice: "fee_plan" })}>
              {t.srFeeSplitA} <bdi className="tnum">{plan.months}</bdi> {t.srFeeSplitB}
            </button>
            <button type="button" className="app-btn app-btn--quiet" onClick={() => dispatch({ type: "CHOOSE", choice: "statement" })}>
              {t.srLeave}
            </button>
          </div>
        </>
      );
    }

    case "RECEIPT": {
      const e = state.ledger.find((x) => x.id === phase.entryId)!;
      return <Receipt entry={e} dispatch={dispatch} heading={heading} reveal={revealId === e.id} />;
    }

    case "CHANGE_PLAN": {
      const e = state.ledger.find((x) => x.id === phase.entryId)!;
      const options = [
        ...(canPayIn4(e.purchase) ? [{ plan: "pay_in_4" as const, label: t.srPlanIn4 }] : []),
        { plan: "statement" as const, label: t.srPlanStatement },
        ...(e.purchase.feePlan ? [{ plan: "fee_plan" as const, label: t.srPlanFee }] : []),
      ];
      return (
        <>
          <button type="button" className="app-back" onClick={() => dispatch({ type: "PICK_PLAN", plan: e.plan })}>
            <BackIcon />
            {t.appBack}
          </button>
          {heading(t.srChangeTitle)}
          <Merchant purchaseId={e.purchase.id} />
          <div role="radiogroup" aria-label={t.srChangeTitle} className="flex flex-col gap-s1">
            {options.map((o) => (
              <button
                key={o.plan}
                type="button"
                role="radio"
                aria-checked={e.plan === o.plan}
                className={`web-method web-method--row text-body ${e.plan === o.plan ? "web-method--on" : ""}`}
                onClick={() => dispatch({ type: "PICK_PLAN", plan: o.plan })}
              >
                <span className="web-radio" aria-hidden="true" />
                <span>{o.label}</span>
              </button>
            ))}
          </div>
          <p className="text-small text-muted">
            {t.changeUntilBefore} <bdi className="tnum">{formatDay(STATEMENT_CLOSES, lang)}</bdi>
          </p>
        </>
      );
    }
  }
}

// --- Screen 1 ---------------------------------------------------------------

function CardHome({ state, dispatch, heading }: { state: State; dispatch: Dispatch; heading: React.ReactNode }) {
  const { lang, t } = useLang();
  return (
    <>
      {heading}
      <CardVisual issued />
      <RulesCard state={state} />
      <CapBar used={capUsed(state)} cap={state.rules.cap} />
      <div className="grid grid-cols-2 gap-s1">
        <button type="button" className="app-btn app-btn--quiet" onClick={() => dispatch({ type: "SHOW", view: "set_rules" })}>
          {t.srEditRules}
        </button>
        <button type="button" className="app-btn app-btn--quiet" onClick={() => dispatch({ type: "SHOW", view: "this_month" })}>
          {t.srThisMonthBtn}
        </button>
      </div>

      <div className="flex flex-col gap-s1 border-t border-rule-soft pt-s2">
        <p className="text-lead font-semibold">{t.srTryPay}</p>
        <p className="text-small text-muted">{t.srTryPayHelp}</p>
        <div className="grid grid-cols-2 gap-s1">
          {PURCHASES.map((p) => (
            <button key={p.id} type="button" className="app-tile text-start" onClick={() => dispatch({ type: "TAP", purchaseId: p.id })}>
              <span className="text-label font-semibold">{p.merchant[lang]}</span>
              <Money value={p.amount} className="text-body" />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

/** The three rules as sentences: the card's personality (Screen 1). */
function RulesCard({ state }: { state: State }) {
  const { t } = useLang();
  return (
    <div className="app-tile">
      <p className="text-label font-semibold text-muted">{t.rulesHeading}</p>
      <p className="text-body font-semibold">
        {t.rule1Before} <Money value={state.rules.threshold} /> {t.rule1After} <span aria-hidden="true">{t.forward}</span>{" "}
        {t.rule1Result}
      </p>
      <p className="text-body font-semibold">
        {t.rule2Before} <Money value={state.rules.cap} /> {t.rule2After}
      </p>
      <p className="text-body font-semibold">
        {t.rule3Sentence} <span aria-hidden="true">{t.forward}</span> {t.rule3Result}
      </p>
    </div>
  );
}

// --- Screen 2 ---------------------------------------------------------------

function SetRules({ state, dispatch, heading }: { state: State; dispatch: Dispatch; heading: React.ReactNode }) {
  const { lang, t } = useLang();
  const { rules } = state;
  const jarir = byId("jarir");
  const splits = evaluatePurchase(jarir, rules, 0) === "MATCHES_RULE";

  return (
    <>
      <button type="button" className="app-back" onClick={() => dispatch({ type: "SHOW", view: "card" })}>
        <BackIcon />
        {t.appBack}
      </button>
      {heading}

      <p className="text-body font-semibold">
        {t.rule1Before} <Money value={rules.threshold} /> {t.rule1After} <span aria-hidden="true">{t.forward}</span> {t.rule1Result}
      </p>
      <Slider
        hideLabel
        label={t.rule1Label}
        value={rules.threshold}
        {...THRESHOLD}
        onChange={(threshold) => dispatch({ type: "SET_RULES", rules: { ...rules, threshold } })}
        minLabel={formatNumber(THRESHOLD.min, lang)}
        maxLabel={formatNumber(THRESHOLD.max, lang)}
      />
      {/* The live example (spec §5.3 Screen 2). */}
      <p className="app-tile text-body" aria-live="polite">
        <span>
          {t.srExampleA} <Money value={jarir.amount} /> {splits ? t.srExampleSplits : t.srExampleStatement}
          {splits ? (
            <>
              {" "}
              <bdi className="tnum">4 ×</bdi> <Money value={payIn4(jarir.amount, TODAY)[1].amount} />
            </>
          ) : null}
        </span>
      </p>

      <p className="text-body font-semibold">
        {t.rule2Before} <Money value={rules.cap} /> {t.rule2After}
      </p>
      <Slider
        hideLabel
        label={t.rule2Label}
        value={rules.cap}
        {...CAP}
        onChange={(cap) => dispatch({ type: "SET_RULES", rules: { ...rules, cap } })}
        minLabel={formatNumber(CAP.min, lang)}
        maxLabel={formatNumber(CAP.max, lang)}
      />

      <div className="flex flex-col gap-s1">
        <p className="flex items-center gap-s1 text-body font-semibold">
          <LockIcon label={t.lockedAria} />
          <span>
            {t.rule3Sentence} <span aria-hidden="true">{t.forward}</span> {t.rule3Result}
          </span>
        </p>
        <p className="text-small text-muted">{t.rule3Locked}</p>
      </div>

      <div className="app-tile">
        <EvalOrder compact />
      </div>

      {/* Edge case: a rule changed after this month's purchases (§5.4). Said
          at the moment of change. The live region stays mounted. */}
      <p aria-live="polite" className={state.rulesChangedMidMonth ? "app-tile text-body font-semibold" : "sr-only"}>
        {state.rulesChangedMidMonth ? t.srRuleChanged : null}
      </p>

      <button type="button" className="app-btn mt-auto" onClick={() => dispatch({ type: "SHOW", view: "card" })}>
        {t.srDone}
      </button>
    </>
  );
}

// --- Screens 4, 5, 7 and the refund ----------------------------------------------

function Receipt({
  entry: e,
  dispatch,
  heading,
  reveal,
}: {
  entry: Entry;
  dispatch: Dispatch;
  heading: (text: string) => React.ReactNode;
  reveal: boolean;
}) {
  const { lang, t } = useLang();
  const home = () => dispatch({ type: "SHOW", view: "card" });
  const split = e.plan !== "statement";
  const changeable = canChangePlan(e);

  return (
    <>
      <Notif />
      {heading(split ? t.receiptHeading : t.statementTitle)}
      <Merchant purchaseId={e.purchase.id} />

      {split ? (
        <>
          <div className="flex flex-col gap-s1">
            <p className="text-small text-muted">
              <bdi className="tnum">{e.schedule.length}</bdi> ×
            </p>
            <p className="text-h3 leading-tight font-bold">
              <Money value={e.schedule[e.schedule.length - 1].amount} />
            </p>
          </div>
          <PlanSchedule schedule={e.schedule} reveal={reveal} cancelledFrom={e.refund ? 1 : undefined} />
          {/* The line that matters most: why this happened (Screen 4). */}
          <p className="hint text-body font-semibold text-ink">
            {e.resolution === "PLAN_UPDATED" ? (
              t.srUpdated
            ) : e.reason === "by_rule" ? (
              <span>
                {t.splitByRuleBefore} <Money value={e.rulesAtTime.threshold} /> {t.splitByRuleAfter}
              </span>
            ) : (
              t.srByYou
            )}
          </p>
          {e.refund ? (
            <p className="app-tile text-body">
              <span>
                {t.srRefundedA} <Money value={e.refund.returned} />
                {t.srRefundedB} <bdi className="tnum">{e.refund.cancelled}</bdi> {t.srRefundedC}
              </span>
            </p>
          ) : null}
        </>
      ) : (
        <p className="text-body text-ink-soft">
          {e.reason === "over_cap" ? (
            <>
              {t.overCapBefore} <Money value={e.rulesAtTime.cap} />
              {t.overCapAfter}
            </>
          ) : e.reason === "below_threshold" ? (
            <>
              {t.belowBefore}
              <Money value={e.rulesAtTime.threshold} />
              {t.belowAfter}
            </>
          ) : e.reason === "not_eligible" ? (
            <>
              {t.srNotEligible} {t.srNotEligibleNext}
            </>
          ) : (
            t.srYouChoseStatement
          )}
        </p>
      )}

      {changeable && e.outcome !== "NOT_ELIGIBLE" ? (
        <p className="text-small text-muted">
          {t.changeUntilBefore} <bdi className="tnum">{formatDay(STATEMENT_CLOSES, lang)}</bdi>
        </p>
      ) : null}

      <div className="mt-auto flex flex-col gap-s1">
        {e.outcome === "NOT_ELIGIBLE" ? (
          <button type="button" className="app-btn" onClick={home}>
            {t.srKeep}
          </button>
        ) : split ? (
          <>
            <div className="grid grid-cols-2 gap-s1">
              <button type="button" className="app-btn" onClick={home}>
                {t.srKeep}
              </button>
              {changeable ? (
                <button type="button" className="app-btn app-btn--quiet" onClick={() => dispatch({ type: "CHANGE_PLAN" })}>
                  {t.srChange}
                </button>
              ) : null}
            </div>
            {!e.refund ? (
              <button type="button" className="app-back self-center" onClick={() => dispatch({ type: "REFUND" })}>
                {t.srRefundSim}
              </button>
            ) : null}
          </>
        ) : (
          <>
            {/* Screen 5: two choices, no judgement in the copy. A purchase
                over the Pay in 4 limit offers its fee plan, named as one. */}
            {canPayIn4(e.purchase) ? (
              <button type="button" className="app-btn" onClick={() => dispatch({ type: "PICK_PLAN", plan: "pay_in_4" })}>
                {t.srSplitAnyway}
              </button>
            ) : (
              <button type="button" className="app-btn" onClick={() => dispatch({ type: "PICK_PLAN", plan: "fee_plan" })}>
                {t.srPlanFee}
              </button>
            )}
            <button type="button" className="app-btn app-btn--quiet" onClick={home}>
              {t.srLeave}
            </button>
          </>
        )}
      </div>
    </>
  );
}

// --- Screen 8 ---------------------------------------------------------------

function ThisMonth({ state, onBack, heading }: { state: State; onBack: () => void; heading: React.ReactNode }) {
  const { lang, t } = useLang();
  const groups: { title: string; entries: Entry[] }[] = [
    { title: t.srGroupRule, entries: state.ledger.filter((e) => e.plan !== "statement" && e.reason === "by_rule") },
    { title: t.srGroupYou, entries: state.ledger.filter((e) => e.plan !== "statement" && e.reason !== "by_rule") },
    { title: t.srGroupStatement, entries: state.ledger.filter((e) => e.plan === "statement") },
  ];
  const onStatement = groups[2].entries.reduce((sum, e) => sum + e.purchase.amount, 0);
  const dueToday = state.ledger.reduce((sum, e) => sum + (e.refund || !e.schedule.length ? 0 : e.schedule[0].amount), 0);

  return (
    <>
      <button type="button" className="app-back" onClick={onBack}>
        <BackIcon />
        {t.appBack}
      </button>
      {heading}
      <CapBar used={capUsed(state)} cap={state.rules.cap} size="large" />

      <div className="grid grid-cols-2 gap-s1">
        <div className="app-tile">
          <span className="text-small text-muted">{t.srDueToday}</span>
          <Money value={dueToday} className="text-lead font-bold" />
        </div>
        <div className="app-tile">
          <span className="text-small text-muted">
            {t.srStatementDue} <bdi className="tnum">{formatDay(STATEMENT_CLOSES, lang)}</bdi>
          </span>
          <Money value={onStatement} className="text-lead font-bold" />
        </div>
      </div>

      {groups.map((g) => (
        <section key={g.title} className="flex flex-col gap-s1">
          <h4 className="text-label font-semibold text-muted">{g.title}</h4>
          {g.entries.length ? (
            <ul className="flex flex-col">
              {g.entries.map((e) => (
                <li key={e.id} className="web-row border-b border-rule-soft py-s1">
                  <span>{e.purchase.merchant[lang]}</span>
                  <Money value={e.purchase.amount} className="font-semibold" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-small text-muted">{t.srEmpty}</p>
          )}
        </section>
      ))}
    </>
  );
}

// --- Bits ------------------------------------------------------------------

/** "Tabby · just now": the receipt arrives as a notification (Screen 4). */
function Notif() {
  const { t } = useLang();
  return <p className="text-small font-medium text-muted">{t.srNotif}</p>;
}

function Merchant({ purchaseId }: { purchaseId: string }) {
  const { lang } = useLang();
  const p = byId(purchaseId);
  return (
    <p className="web-row">
      <span className="font-semibold">{p.merchant[lang]}</span>
      <Money value={p.amount} className="font-semibold" />
    </p>
  );
}

function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="m15 5-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon({ label }: { label: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" role="img" aria-label={label} className="flex-none">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

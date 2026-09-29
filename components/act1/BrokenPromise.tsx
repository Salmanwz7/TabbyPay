"use client";

/**
 * Idea 2's why · the same card, the same 500 riyals, paid twice (NOTES.md
 * A6, A7, G2).
 *
 *   Today in the UAE, at a terminal: double-click, the wallet shows the Tabby
 *   Card, hold near the reader, "Done", the terminal prints. Not a word about
 *   a plan. Then the manual path in the Tabby app: card activity → the
 *   purchase → pick a plan. The plans are the UAE card page's (4, 6, 8 or 10
 *   months) and each one, pressed, shows what it costs a month.
 *
 *   With your rules, online: a store's checkout, Apple Pay chosen, the wallet
 *   sheet with the Tabby Card, "Done". Tabby's notification says the rule
 *   already split it; pressing it opens the plan receipt. This is the
 *   proposal, and it's labelled as one.
 *
 * Paying online with the Tabby Card through Apple Pay needs no approval in
 * the Tabby app (Tabby UAE help, checked 29 Sep 2026), so the sheet is the
 * whole payment. Wallet screens are likenesses with no Apple marks (A7).
 * Nothing moves until the visitor presses a button, and every button is
 * inside the phone.
 */

import { useEffect, useId, useRef, useState } from "react";
import { payIn4 } from "@/lib/machine";
import { DEFAULT_RULES, TODAY } from "@/lib/mock-data";
import { CARD_PLAN_MONTHS, splitMonths, type CardPlanMonths } from "@/lib/card-plans";
import { useLang } from "@/lib/LanguageProvider";
import { formatLongDay } from "@/lib/format";
import Phone from "@/components/phone/Phone";
import { StatusBar } from "@/components/phone/app/AppShell";
import CardVisual from "@/components/phone/app/CardVisual";
import TabbyMark from "@/components/ui/TabbyMark";
import Money, { InAppContext } from "@/components/ui/Money";
import PlanSchedule from "@/components/ui/PlanSchedule";

const AMOUNT = 500;

export default function BrokenPromise() {
  const { t } = useLang();

  return (
    <div className="flex flex-col gap-s4">
      <div className="flex flex-col gap-s1">
        <h3 className="text-title font-semibold">{t.bpHeading}</h3>
        <p className="max-w-measure text-body text-muted">{t.bpHelp}</p>
      </div>

      {/* Riyal symbol on every drawn screen, as in the app (R4). */}
      <InAppContext value={true}>
        <div className="flex flex-col gap-s6">
          <CardAtTerminal />
          <OnlineWithRules />
        </div>
      </InAppContext>

      <p className="max-w-measure text-small text-muted">{t.bpUaeNote}</p>
    </div>
  );
}

/**
 * One case per row: the phone on one side; the name, the terminal and the
 * notes on the other (.bp-row). On a narrow screen: name, terminal, phone,
 * notes, top to bottom.
 */
function Row({ label, pos, phone, children }: { label: string; pos?: React.ReactNode; phone: React.ReactNode; children?: React.ReactNode }) {
  const id = useId();
  return (
    <section aria-labelledby={id} className={`bp-row ${pos ? "" : "bp-row--nopos"}`}>
      <h4 id={id} className="bp-row__label text-title font-semibold">
        {label}
      </h4>
      {pos ? <div className="bp-row__pos">{pos}</div> : null}
      <div className="bp-row__phone">{phone}</div>
      {children ? <div className="bp-row__rest flex flex-col gap-s3">{children}</div> : null}
    </section>
  );
}

/**
 * Focus for a phone whose one button changes with each step: the pressed
 * button unmounts, so focus moves to the next screen. On a screen whose
 * point comes before its button (the plan picker, the plan receipt) the
 * heading takes focus, so nothing is skipped; elsewhere, the button. Only
 * after the visitor has acted, never on load.
 */
function useStepFocus<S>(initial: S) {
  const [stage, setStageRaw] = useState<S>(initial);
  const actionRef = useRef<HTMLButtonElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const acted = useRef(false);

  useEffect(() => {
    if (acted.current) (headingRef.current ?? actionRef.current)?.focus({ preventScroll: true });
  }, [stage]);

  const setStage = (s: S) => {
    acted.current = true;
    setStageRaw(s);
  };
  return { stage, setStage, actionRef, headingRef };
}

// ---------------------------------------------------------------------------
// Today in the UAE: the terminal, the wallet, then the manual path in the app
// ---------------------------------------------------------------------------

type TerminalStage = "idle" | "wallet" | "paid" | "app" | "detail";
const TERMINAL_NEXT: Record<TerminalStage, TerminalStage> = { idle: "wallet", wallet: "paid", paid: "app", app: "detail", detail: "idle" };

function CardAtTerminal() {
  const { lang, t } = useLang();
  const { stage, setStage, actionRef, headingRef } = useStepFocus<TerminalStage>("idle");

  const approved = stage !== "idle" && stage !== "wallet";
  const buttonLabel = {
    idle: t.bpSideButton,
    wallet: t.bpTapPhone,
    paid: t.bpOpenApp,
    app: t.bpFindIt,
    detail: t.bpAgain,
  }[stage];
  // Which of the four manual jobs the phone is showing.
  const job = stage === "app" ? 1 : stage === "detail" ? 3 : -1;
  const action = (
    <button
      ref={actionRef}
      type="button"
      className={`app-btn mt-auto self-stretch ${stage === "detail" ? "app-btn--quiet" : ""}`}
      onClick={() => setStage(TERMINAL_NEXT[stage])}
    >
      {buttonLabel}
    </button>
  );

  const phone = (
    <Phone>
      <div className="app">
        {stage === "idle" ? (
          <div className="lock">
            <StatusBar />
            <span className="text-body font-medium">{formatLongDay(TODAY, lang)}</span>
            <span className="lock__time tnum" dir="ltr">
              9:41
            </span>
            {action}
          </div>
        ) : stage === "wallet" || stage === "paid" ? (
          <div className="wallet">
            <StatusBar />
            <div className="settle">
              <CardVisual issued />
            </div>
            <p className="text-body font-semibold">{t.bpWalletCard}</p>
            <div className="wallet__status" aria-live="polite">
              {stage === "paid" ? (
                <>
                  <DoneCircle />
                  <span className="text-title font-semibold">{t.bpWalletDone}</span>
                </>
              ) : (
                <>
                  <PhoneNfc />
                  <span className="text-title font-semibold">{t.bpWalletHold}</span>
                </>
              )}
            </div>
            {stage === "paid" ? <p className="settle settle--late wallet__note">{t.bpLockNothing}</p> : null}
            {action}
          </div>
        ) : (
          <>
            <StatusBar />
            <div className="app-body app-body--plain">
              {stage === "app" ? (
                <>
                  <h4 className="app-title">{t.bpActivity}</h4>
                  <div className="app-tile">
                    <span className="web-row">
                      <span className="font-semibold">{t.bpShop}</span>
                      <Money value={AMOUNT} className="font-semibold" />
                    </span>
                    <span className="web-row text-small text-muted">
                      <span>{t.today}</span>
                      <span>{t.bpOnStatement}</span>
                    </span>
                  </div>
                  {action}
                </>
              ) : (
                <>
                  <PlanPicker headingRef={headingRef} />
                  {action}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </Phone>
  );

  return (
    <Row label={t.bpTerminalLabel} pos={<Terminal approved={approved} waiting={stage === "wallet"} />} phone={phone}>
      <ol className="grid grid-cols-2 gap-s1" aria-label={t.bpLater}>
        {t.bpLaterSteps.map((step, i) => (
          <li
            key={step}
            aria-current={i === job ? "step" : undefined}
            className={`rounded-tabby border p-s1 text-small ${
              job >= 0 && i <= job ? "border-ink font-semibold text-ink" : "border-rule text-muted"
            }`}
          >
            <bdi className="tnum">{i + 1}</bdi> · {step}
          </li>
        ))}
      </ol>
    </Row>
  );
}

/**
 * "Split this purchase?": the UAE card's plans, in months, each one
 * pressable. A native radio group, so arrows and Space work as they should;
 * the drawn radio is the visible one. The fee is stated, not invented.
 */
function PlanPicker({ headingRef }: { headingRef: React.RefObject<HTMLHeadingElement | null> }) {
  const { t } = useLang();
  const name = useId();
  const [months, setMonths] = useState<CardPlanMonths | null>(null);
  const split = months ? splitMonths(AMOUNT, months) : null;

  return (
    <>
      <h4 ref={headingRef} tabIndex={-1} className="app-title">
        {t.bpSplitThis}
      </h4>
      <p className="web-row">
        <span>{t.bpShop}</span>
        <Money value={AMOUNT} className="font-semibold" />
      </p>
      <fieldset className="flex flex-col gap-s1">
        <legend className="sr-only">{t.bpSplitThis}</legend>
        {CARD_PLAN_MONTHS.map((m) => (
          <label key={m} className={`web-method web-method--row web-method--pick ${months === m ? "web-method--on" : ""}`}>
            <input type="radio" name={name} className="sr-only" checked={months === m} onChange={() => setMonths(m)} />
            <span className="web-radio" aria-hidden="true" />
            <span className="text-body">
              <bdi className="tnum">{m}</bdi> {t.bpMonths}
            </span>
          </label>
        ))}
      </fieldset>
      <div aria-live="polite" className="flex flex-col gap-s1">
        {split && months ? (
          <p className="app-tile gap-s1">
            <span className="flex flex-wrap items-baseline gap-s1">
              <Money value={split.monthly} className="text-title font-bold" />
              <span className="text-body">{t.bpPerMonth}</span>
              <span className="text-body text-muted">
                {t.bpForMonths} <bdi className="tnum">{months}</bdi> {t.bpMonths}
              </span>
            </span>
            {split.first !== split.monthly ? (
              <span className="flex items-baseline gap-s1 text-small text-muted">
                {t.bpFirstMonth} <Money value={split.first} />
              </span>
            ) : null}
          </p>
        ) : null}
      </div>
      <p className="text-small text-ink-soft">{t.bpPlanRule}</p>
      <p className="tag-known self-start">{t.bpPlanSource}</p>
      <p className="text-body font-semibold">{t.bpEveryTime}</p>
      <p className="text-body font-semibold">{t.bpOrForget}</p>
    </>
  );
}

// ---------------------------------------------------------------------------
// With your rules, online: checkout → Apple Pay sheet → Tabby's notification
// → the plan receipt the rule already made
// ---------------------------------------------------------------------------

type OnlineStage = "checkout" | "sheet" | "sheetDone" | "done" | "receipt";

function OnlineWithRules() {
  const { t } = useLang();
  const { stage, setStage, actionRef, headingRef } = useStepFocus<OnlineStage>("checkout");
  const schedule = payIn4(AMOUNT, TODAY);

  const phone = (
    <Phone>
      <div className="app">
        {stage === "sheet" || stage === "sheetDone" ? (
          // The wallet sheet: the Tabby Card pays, as any card in the wallet would.
          <div className="wallet">
            <StatusBar />
            <div className="settle">
              <CardVisual issued />
            </div>
            <p className="text-body font-semibold">{t.bpWalletCard}</p>
            <p className="web-row self-stretch">
              <span dir="ltr">{t.bpUrl}</span>
              <Money value={AMOUNT} className="font-semibold" />
            </p>
            <div className="wallet__status" aria-live="polite">
              {stage === "sheetDone" ? (
                <>
                  <DoneCircle />
                  <span className="text-title font-semibold">{t.bpWalletDone}</span>
                </>
              ) : (
                <>
                  <SideButton />
                  <span className="text-body">{t.bpSheetConfirm}</span>
                </>
              )}
            </div>
            <button
              ref={actionRef}
              type="button"
              className="app-btn mt-auto self-stretch"
              onClick={() => setStage(stage === "sheet" ? "sheetDone" : "done")}
            >
              {stage === "sheet" ? t.bpSideButton : t.bpBackToOrder}
            </button>
          </div>
        ) : stage === "receipt" ? (
          // The Tabby app: the rule already split it. Nothing to decide.
          <>
            <StatusBar />
            <div className="app-body app-body--plain">
              <div className="settle flex flex-col gap-s2">
                <h4 ref={headingRef} tabIndex={-1} className="app-title">
                  {t.bpRuleReceipt}
                </h4>
                <p className="web-row">
                  <span dir="ltr">{t.bpUrl}</span>
                  <Money value={AMOUNT} className="font-semibold" />
                </p>
                {/* The green dot means one thing on this page: a plan you know. */}
                <p className="hint text-body font-semibold text-ink">{t.srGroupRule}</p>
                <PlanSchedule schedule={schedule} />
                <p className="flex flex-wrap items-baseline gap-s1 text-small text-ink-soft">
                  {t.rule1Before} <Money value={DEFAULT_RULES.threshold} /> {t.rule1After} {t.forward} {t.rule1Result}
                </p>
                <p className="web-row text-small">
                  <span>{t.bpFees}</span>
                  <span className="font-semibold">{t.bpNoFees}</span>
                </p>
                <span className="tag-guess self-start">{t.appProposal}</span>
              </div>
              <button ref={actionRef} type="button" className="app-btn app-btn--quiet mt-auto" onClick={() => setStage("checkout")}>
                {t.bpAgain}
              </button>
            </div>
          </>
        ) : (
          // The store's page in the phone's browser.
          <>
            <StatusBar />
            <div className="web-bar" aria-hidden="true">
              <LockGlyph />
              <span dir="ltr">{t.bpUrl}</span>
            </div>
            <div className="app-body app-body--plain">
              {stage === "done" ? (
                <>
                  {/* Tabby's notification arrives over the store's page. */}
                  <button ref={actionRef} type="button" className="notif settle" onClick={() => setStage("receipt")}>
                    <TabbyMark size={28} />
                    <span className="flex flex-col items-start gap-s1 text-start">
                      <span className="text-small font-semibold">{t.bpNotifFrom}</span>
                      <span className="text-small">{t.bpNotifText}</span>
                    </span>
                  </button>
                  <CheckCircle />
                  <h4 className="app-title">{t.bpConfirmed}</h4>
                  <p className="text-body text-ink-soft">{t.bpConfirmedSub}</p>
                </>
              ) : (
                <>
                  <h4 className="app-title">{t.bpCheckout}</h4>
                  <div className="flex flex-col gap-s1 border-b border-rule-soft pb-s2">
                    <p className="web-row">
                      <span>{t.bpItem}</span>
                      <Money value={AMOUNT} />
                    </p>
                    <p className="web-row font-semibold">
                      <span>{t.bpTotal}</span>
                      <Money value={AMOUNT} />
                    </p>
                  </div>

                  <p className="text-label font-semibold">{t.bpPayWith}</p>
                  <div className="web-method web-method--row">
                    <span className="web-radio" aria-hidden="true" />
                    <span className="text-body">{t.bpMethodCard}</span>
                  </div>
                  <div className="web-method web-method--row web-method--on">
                    <span className="web-radio" aria-hidden="true" />
                    <span className="flex flex-col">
                      <span className="text-body font-semibold">
                        <bdi dir="ltr">{t.bpMethodWallet}</bdi>
                        <span className="sr-only"> · {t.bpSelected}</span>
                      </span>
                      <span className="text-small text-muted">{t.bpMethodWalletSub}</span>
                    </span>
                  </div>

                  <button ref={actionRef} type="button" className="app-btn mt-auto" onClick={() => setStage("sheet")}>
                    {t.bpPayWallet}
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </Phone>
  );

  return (
    <Row label={t.bpOnlineLabel} phone={phone}>
      <p className="max-w-measure text-body text-ink-soft">{t.bpOnlineAside}</p>
      <span className="tag-guess self-start">{t.appProposal}</span>
    </Row>
  );
}

// Three digits, then the function key for that row, as on a real terminal.
const KEYS = ["1", "2", "3", "✕", "4", "5", "6", "‹", "7", "8", "9", "○", "*", "0", "#", " "];
const FN: Record<string, string> = {
  "✕": "pos__fn--cancel",
  "‹": "pos__fn--clear",
  "○": "pos__fn--ok",
  " ": "pos__fn--blank",
};

/**
 * A handheld card terminal, the kind on a Saudi shop counter: printer slot,
 * screen, keypad, the three coloured function keys. Hardware, so it doesn't
 * mirror in Arabic; only the text on its screen and receipt follows the page.
 */
function Terminal({ approved, waiting }: { approved: boolean; waiting: boolean }) {
  const { lang, t } = useLang();
  const textDir = lang === "ar" ? "rtl" : "ltr";

  return (
    <div className="pos" dir="ltr" role="group" aria-label={t.bpTerminal}>
      {/* The receipt prints once the payment is approved. */}
      <div className="pos__paper" aria-hidden="true">
        {approved ? (
          <div className="pos__receipt print" dir={textDir}>
            <span className="font-semibold">{t.bpReceipt}</span>
            <span className="web-row">
              <span>{t.bpShop}</span>
              <Money value={AMOUNT} />
            </span>
            <span>✓ {t.bpApproved}</span>
          </div>
        ) : null}
      </div>
      <div className="pos__body">
        <div className="pos__slot" aria-hidden="true" />
        <div className="pos__screen" dir={textDir} aria-live="polite">
          <span className="pos__bar">
            <span>{t.bpShop}</span>
            <Contactless />
          </span>
          {approved ? (
            <span className="pos__main">
              <DoneCircle />
              <span className="text-title font-bold">{t.bpApproved}</span>
              <span className="text-small">{t.bpBeep}</span>
            </span>
          ) : (
            <span className="pos__main">
              <span className="text-small">{t.bpPosAmount}</span>
              <Money value={AMOUNT} className="text-h3 font-bold" />
              <span className={`flex items-center gap-s1 text-small ${waiting ? "pulse" : ""}`}>
                <Contactless />
                {t.bpTerminalIdle}
              </span>
            </span>
          )}
        </div>
        <div className="pos__keys" aria-hidden="true">
          {KEYS.map((k) => (
            <span key={k} className={FN[k] ?? ""}>
              {k === " " ? null : k}
            </span>
          ))}
        </div>
        <div className="pos__foot" aria-hidden="true" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

function LockGlyph() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function CheckCircle() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="24" fill="var(--tabby-green)" />
      <path d="m14 24.5 7 7 13-14" fill="none" stroke="var(--tabby-neutral-900)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DoneCircle() {
  return (
    <svg width="44" height="44" viewBox="0 0 48 48" aria-hidden="true" className="settle">
      <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="m15 24.5 6 6 12-13" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** A phone with waves: "hold near the reader". */
function PhoneNfc() {
  return (
    <svg width="56" height="56" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true" className="pulse">
      <rect x="8" y="10" width="18" height="30" rx="4" />
      <path d="M32 18a8 8 0 0 1 0 12M37 14a14 14 0 0 1 0 20" />
    </svg>
  );
}

/** The phone's side button, pressed twice: "confirm with the side button". */
function SideButton() {
  return (
    <svg width="56" height="56" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true" className="pulse">
      <rect x="12" y="6" width="20" height="36" rx="5" />
      <path d="M36 14v8M41 12v12" />
    </svg>
  );
}

function Contactless() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M8.5 8.5a5 5 0 0 1 0 7M12 6a8.5 8.5 0 0 1 0 12M15.5 3.5a12 12 0 0 1 0 17" />
    </svg>
  );
}

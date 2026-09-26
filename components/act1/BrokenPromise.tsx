"use client";

/**
 * Idea 2's why · the broken promise, as two real cases (spec §3.1).
 *
 * The same customer pays 500 riyals twice, with the Tabby Card working the
 * way it does in the UAE today (NOTES.md A6, A7).
 *
 *   Online: a store's checkout in the phone's browser. Tabby is the payment
 *   method, and the four payments, their dates and "no fees" are on screen
 *   BEFORE "Pay with Tabby", which sits inside the page, as it does in a
 *   real checkout.
 *
 *   In a shop: a card terminal and the phone. Double-click, the wallet shows
 *   the Tabby Card, hold near the reader, "Done", and the terminal prints.
 *   Not a word about a plan. "Later" walks the manual path in the Tabby app:
 *   card activity → the purchase → pick a plan (4, 6, 8 or 10 months, from
 *   Tabby's UAE card page), every time.
 *
 * The wallet sheet is a likeness at Salman's request, with no Apple marks
 * (A7). Nothing moves until the visitor presses a button.
 */

import { useEffect, useId, useRef, useState } from "react";
import { payIn4 } from "@/lib/machine";
import { TODAY } from "@/lib/mock-data";
import { useLang } from "@/lib/LanguageProvider";
import { formatDay, formatLongDay } from "@/lib/format";
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
        <p className="text-body text-muted">{t.bpHelp}</p>
      </div>

      {/* Riyal symbol on every drawn screen, as in the app (R4). */}
      <InAppContext value={true}>
        <div className="flex flex-col gap-s6">
          <OnlineCheckout />
          <CardAtTerminal />
        </div>
      </InAppContext>

      <p className="max-w-measure text-small text-muted">{t.bpUaeNote}</p>
      <p className="headline max-w-measure text-title sm:text-h3">{t.bpCaption}</p>
    </div>
  );
}

/**
 * One case per row: the phone on one side; the name, the terminal and the
 * controls on the other (.bp-row). On a narrow screen: name, terminal,
 * phone, controls, top to bottom.
 */
function Row({ label, pos, phone, children }: { label: string; pos?: React.ReactNode; phone: React.ReactNode; children?: React.ReactNode }) {
  const id = useId();
  return (
    <section aria-labelledby={id} className={`bp-row ${pos ? "" : "bp-row--nopos"}`}>
      <p id={id} className="bp-row__label text-title font-semibold">
        {label}
      </p>
      {pos ? <div className="bp-row__pos">{pos}</div> : null}
      <div className="bp-row__phone">{phone}</div>
      {children ? <div className="bp-row__rest flex flex-col gap-s3">{children}</div> : null}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Online: the store's checkout, Tabby selected, the button inside the page
// ---------------------------------------------------------------------------

function OnlineCheckout() {
  const { lang, t } = useLang();
  const [paid, setPaidRaw] = useState(false);
  const schedule = payIn4(AMOUNT, TODAY);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const acted = useRef(false);

  // The button that was pressed unmounts, so focus goes to the new heading.
  useEffect(() => {
    if (acted.current) headingRef.current?.focus({ preventScroll: true });
  }, [paid]);

  const setPaid = (v: boolean) => {
    acted.current = true;
    setPaidRaw(v);
  };

  const phone = (
    <Phone>
      <div className="app">
        <StatusBar />
        <div className="web-bar" aria-hidden="true">
          <LockGlyph />
          <span dir="ltr">{t.bpUrl}</span>
        </div>

        <div className="app-body app-body--plain">
          {paid ? (
            <>
              <div className="settle flex flex-col gap-s2">
                <CheckCircle />
                <h4 ref={headingRef} tabIndex={-1} className="app-title">
                  {t.bpConfirmed}
                </h4>
                <p className="text-body text-ink-soft">{t.bpConfirmedSub}</p>
                <PlanSchedule schedule={schedule} />
              </div>
              <button type="button" className="app-btn app-btn--quiet mt-auto" onClick={() => setPaid(false)}>
                {t.bpBackToStore}
              </button>
            </>
          ) : (
            <>
              <h4 ref={headingRef} tabIndex={-1} className="app-title">
                {t.bpCheckout}
              </h4>
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
              <div className="web-method" aria-hidden="true">
                <div className="flex items-center gap-s1">
                  <span className="web-radio" />
                  <span className="text-body">{t.bpMethodCard}</span>
                </div>
              </div>

              {/* Everything Tabby promises, before the button. */}
              <div className="web-method web-method--on">
                <div className="flex items-center gap-s1">
                  <span className="web-radio" aria-hidden="true" />
                  <TabbyMark size={24} />
                  <span className="flex flex-col">
                    <span className="text-body font-semibold">{t.bpMethodTabby}</span>
                    <span className="text-small text-muted">{t.bpMethodTabbySub}</span>
                  </span>
                </div>
                <ol className="pie4">
                  {schedule.map((row, i) => (
                    <li key={row.date} className="flex flex-col items-center gap-s1">
                      <span className="pie4__dot" style={{ ["--q" as string]: i + 1 }} aria-hidden="true" />
                      <Money value={row.amount} className="text-small font-semibold" />
                      <span className="text-caption text-muted">
                        {i === 0 ? t.today : <bdi className="tnum">{formatDay(row.date, lang)}</bdi>}
                      </span>
                    </li>
                  ))}
                </ol>
                <p className="web-row text-small">
                  <span>{t.bpFees}</span>
                  <span className="font-semibold">{t.bpNoFees}</span>
                </p>
              </div>

              <button type="button" className="app-btn mt-auto" onClick={() => setPaid(true)}>
                {t.bpPayTabby}
              </button>
            </>
          )}
        </div>
      </div>
    </Phone>
  );

  return (
    <Row label={t.bpOnlineLabel} phone={phone}>
      <p className="max-w-measure text-body text-ink-soft">{t.bpOnlineAside}</p>
    </Row>
  );
}

// ---------------------------------------------------------------------------
// In a shop: the terminal, the phone's wallet, then the manual path in the app
// ---------------------------------------------------------------------------

type Stage = "idle" | "wallet" | "paid" | "app" | "detail";
const NEXT: Record<Stage, Stage> = { idle: "wallet", wallet: "paid", paid: "app", app: "detail", detail: "idle" };

function CardAtTerminal() {
  const { lang, t } = useLang();
  const [stage, setStage] = useState<Stage>("idle");
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
            </div>
          ) : (
            <>
              <StatusBar />
              <div className="app-body app-body--plain">
                {stage === "app" ? (
                  <>
                    <h4 className="app-title">{t.bpActivity}</h4>
                    <button type="button" className="app-tile w-full text-start" onClick={() => setStage("detail")}>
                      <span className="web-row">
                        <span className="font-semibold">{t.bpShop}</span>
                        <Money value={AMOUNT} className="font-semibold" />
                      </span>
                      <span className="web-row text-small text-muted">
                        <span>{t.today}</span>
                        <span>{t.bpOnStatement}</span>
                      </span>
                    </button>
                  </>
                ) : (
                  <>
                    <h4 className="app-title">{t.bpSplitThis}</h4>
                    <p className="web-row">
                      <span>{t.bpShop}</span>
                      <Money value={AMOUNT} className="font-semibold" />
                    </p>
                    <ul className="flex flex-col gap-s1" aria-hidden="true">
                      {t.bpPlanOptions.map((o) => (
                        <li key={o} className="web-method web-method--row">
                          <span className="web-radio" />
                          <span className="text-body">{o}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-small text-ink-soft">{t.bpPlanRule}</p>
                    <p className="tag-known self-start">{t.bpPlanSource}</p>
                    <p className="text-body font-semibold">{t.bpEveryTime}</p>
                    <p className="text-body font-semibold">{t.bpOrForget}</p>
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

      <button
        type="button"
        className={`${stage === "idle" || stage === "wallet" ? "btn-primary" : "btn-secondary"} w-full`}
        onClick={() => setStage(NEXT[stage])}
      >
        {buttonLabel}
      </button>
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

function Contactless() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M8.5 8.5a5 5 0 0 1 0 7M12 6a8.5 8.5 0 0 1 0 12M15.5 3.5a12 12 0 0 1 0 17" />
    </svg>
  );
}

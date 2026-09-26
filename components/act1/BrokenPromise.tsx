"use client";

/**
 * Idea 2's why · the broken promise, as two real cases (spec §3.1).
 *
 * The same UAE customer pays AED 500 twice (NOTES.md A6).
 *
 *   Online: a store's checkout in the phone's browser. Tabby is the payment
 *   method, and the four payments, their dates and "no fees" are on screen
 *   BEFORE "Pay with Tabby". Paying confirms the plan they already saw.
 *
 *   In a shop: a card terminal and the phone. The tap beeps, the phone's lock
 *   screen says nothing about a plan. "Later" walks the manual path in the
 *   Tabby app: card activity → the purchase → pick a plan (4, 6, 8 or 10
 *   months, from Tabby's UAE card page), every time.
 *
 * No wallet UI is drawn: the tap happens off-screen, on the terminal. Nothing
 * moves until the visitor presses a button. Likenesses, labelled as such.
 */

import { useId, useState } from "react";
import { payIn4 } from "@/lib/machine";
import { TODAY } from "@/lib/mock-data";
import { useLang } from "@/lib/LanguageProvider";
import { formatDay, formatLongDay } from "@/lib/format";
import Phone from "@/components/phone/Phone";
import { StatusBar } from "@/components/phone/app/AppShell";
import TabbyMark from "@/components/ui/TabbyMark";
import Money from "@/components/ui/Money";
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

      <div className="grid items-start gap-s5 lg:grid-cols-2">
        <Side label={t.bpOnlineLabel}>
          <OnlineCheckout />
        </Side>
        <Side label={t.bpTerminalLabel}>
          <CardAtTerminal />
        </Side>
      </div>

      <p className="max-w-measure text-small text-muted">{t.bpUaeNote}</p>
      <p className="headline max-w-measure text-title sm:text-h3">{t.bpCaption}</p>
    </div>
  );
}

function Side({ label, children }: { label: string; children: React.ReactNode }) {
  const id = useId();
  return (
    <section aria-labelledby={id} className="flex flex-col gap-s3">
      <p id={id} className="text-body font-semibold sm:text-center">
        {label}
      </p>
      {children}
    </section>
  );
}

function Aed({ value, className }: { value: number; className?: string }) {
  return <Money value={value} currency="aed" className={className} />;
}

// ---------------------------------------------------------------------------
// Online: the store's checkout, Tabby selected
// ---------------------------------------------------------------------------

function OnlineCheckout() {
  const { lang, t } = useLang();
  const [paid, setPaid] = useState(false);
  const schedule = payIn4(AMOUNT, TODAY);

  return (
    <>
      <Phone>
        <div className="app">
          <StatusBar />
          <div className="web-bar" aria-hidden="true">
            <LockGlyph />
            <span dir="ltr">{t.bpUrl}</span>
          </div>

          <div className="app-body app-body--plain" aria-live="polite">
            {paid ? (
              <div className="settle flex flex-col gap-s2">
                <CheckCircle />
                <h4 className="app-title">{t.bpConfirmed}</h4>
                <p className="text-body text-ink-soft">{t.bpConfirmedSub}</p>
                <PlanSchedule schedule={schedule} currency="aed" />
              </div>
            ) : (
              <>
                <h4 className="app-title">{t.bpCheckout}</h4>
                <div className="flex flex-col gap-s1 border-b border-rule-soft pb-s2">
                  <p className="web-row">
                    <span>{t.bpItem}</span>
                    <Aed value={AMOUNT} />
                  </p>
                  <p className="web-row font-semibold">
                    <span>{t.bpTotal}</span>
                    <Aed value={AMOUNT} />
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
                      <li key={row.date} className="flex flex-col gap-s1">
                        <span className="pie4__dot" style={{ ["--q" as string]: i + 1 }} aria-hidden="true" />
                        <Aed value={row.amount} className="text-small font-semibold" />
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
              </>
            )}
          </div>
        </div>
      </Phone>

      {/* Outside the phone and never unmounted, so focus stays put. */}
      <button type="button" className={`${paid ? "btn-secondary" : "btn-primary"} w-full`} onClick={() => setPaid((p) => !p)}>
        {paid ? t.bpAgain : t.bpPayTabby}
      </button>
    </>
  );
}

// ---------------------------------------------------------------------------
// In a shop: the terminal, the lock screen, then the manual path in the app
// ---------------------------------------------------------------------------

type Stage = "idle" | "paid" | "app" | "detail";
const NEXT: Record<Stage, Stage> = { idle: "paid", paid: "app", app: "detail", detail: "idle" };

function CardAtTerminal() {
  const { lang, t } = useLang();
  const [stage, setStage] = useState<Stage>("idle");
  const tapped = stage !== "idle";
  const buttonLabel = { idle: t.bpTapPhone, paid: t.bpOpenApp, app: t.bpFindIt, detail: t.bpAgain }[stage];
  // Which of the four manual jobs the phone is showing.
  const job = stage === "app" ? 1 : stage === "detail" ? 3 : -1;

  return (
    <>
      {/* The terminal. The tap happens here, not on a drawn wallet. */}
      <div className="pos" role="group" aria-label={t.bpTerminal}>
        <div className="pos__screen" aria-live="polite">
          {tapped ? (
            <>
              <span className="text-title font-bold">✓ {t.bpApproved}</span>
              <span className="text-lead font-semibold">{t.bpBeep}</span>
            </>
          ) : (
            <>
              <Aed value={AMOUNT} className="text-title font-bold" />
              <span className="flex items-center gap-s1 text-small">
                <Contactless />
                {t.bpTerminalIdle}
              </span>
            </>
          )}
        </div>
        <div className="pos__keys" aria-hidden="true">
          {Array.from({ length: 9 }, (_, i) => (
            <span key={i} />
          ))}
        </div>
      </div>

      <Phone>
        <div className="app">
          {stage === "idle" || stage === "paid" ? (
            <div className="lock">
              <StatusBar />
              <span className="text-body font-medium">{formatLongDay(TODAY, lang)}</span>
              <span className="lock__time tnum" dir="ltr">
                9:41
              </span>
              {stage === "paid" ? (
                <p className="settle mt-s4 rounded-tabby bg-card p-s2 text-body text-ink-soft">{t.bpLockNothing}</p>
              ) : null}
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
                        <Aed value={AMOUNT} className="font-semibold" />
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
                      <Aed value={AMOUNT} className="font-semibold" />
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

      <ol className="grid grid-cols-2 gap-s1 sm:grid-cols-4" aria-label={t.bpLater}>
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
        className={`${stage === "idle" ? "btn-primary" : "btn-secondary"} w-full`}
        onClick={() => setStage(NEXT[stage])}
      >
        {buttonLabel}
      </button>
    </>
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

function Contactless() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M8.5 8.5a5 5 0 0 1 0 7M12 6a8.5 8.5 0 0 1 0 12M15.5 3.5a12 12 0 0 1 0 17" />
    </svg>
  );
}

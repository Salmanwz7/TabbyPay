"use client";

/**
 * 1.2 · The broken promise. Spec §3.1: "This comparison is the core visual of
 * the submission."
 *
 * Two phones, one purchase (SAR 500, the spec's 4 × 125), one "Pay" button
 * each. Online, the schedule is on screen BEFORE the tap. At the terminal,
 * the tap gets a beep, and the plan becomes a list of jobs for later.
 *
 * Nothing moves until the visitor presses Pay (§0.1 motion rule). The
 * terminal side is labelled a simulation: no wallet UI is drawn (§2.4).
 */

import { useId, useState } from "react";
import { payIn4 } from "@/lib/machine";
import { TODAY } from "@/lib/mock-data";
import { useLang } from "@/lib/LanguageProvider";
import Phone from "@/components/phone/Phone";
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

      <div className="grid gap-s5 lg:grid-cols-2">
        <Side label={t.bpOnlineLabel}>
          <OnlineCheckout />
        </Side>
        <Side label={t.bpTerminalLabel}>
          <CardAtTerminal />
        </Side>
      </div>

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
      <Phone>{children}</Phone>
    </section>
  );
}

function PurchaseLine({ where }: { where: string }) {
  return (
    <div className="flex flex-col gap-s1">
      <p className="text-small text-muted">{where}</p>
      <p className="text-h3 leading-tight font-bold">
        <Money value={AMOUNT} unitClassName="text-lead font-semibold" />
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------

function OnlineCheckout() {
  const { t } = useLang();
  const [paid, setPaid] = useState(false);
  const schedule = payIn4(AMOUNT, TODAY);

  return (
    <div className="screen-body">
      <PurchaseLine where={t.bpOnlineStore} />

      {/* Everything the customer needs is on screen before they commit. */}
      <div className="flex flex-col gap-s2 rounded-tabby border border-rule p-s2">
        <p className="text-body font-semibold">{t.bpSplitIn4}</p>
        <p className="text-title font-bold">
          <bdi className="tnum">4 ×</bdi> <Money value={schedule[1].amount} unitClassName="text-body font-semibold" />
        </p>
        <PlanSchedule schedule={schedule} />
        <p className="flex justify-between text-body">
          <span>{t.bpFees}</span>
          <span className="font-semibold">{t.bpNoFees}</span>
        </p>
      </div>

      <div className="mt-auto flex flex-col gap-s2">
        <div aria-live="polite">
          {paid ? <p className="settle hint text-title font-semibold text-ink">{t.bpDone}</p> : null}
        </div>
        <PayButton paid={paid} onToggle={() => setPaid((p) => !p)} />
      </div>
    </div>
  );
}

/**
 * One button that stays mounted and changes its job, so keyboard focus is
 * never dropped to the page when Pay turns into Again.
 */
function PayButton({ paid, onToggle }: { paid: boolean; onToggle: () => void }) {
  const { t } = useLang();
  return (
    <button type="button" className={`${paid ? "btn-secondary" : "btn-primary"} w-full`} onClick={onToggle}>
      {paid ? t.bpAgain : t.bpPay}
    </button>
  );
}

// ---------------------------------------------------------------------------

function CardAtTerminal() {
  const { t } = useLang();
  const [paid, setPaid] = useState(false);

  return (
    <div className="screen-body">
      <PurchaseLine where={t.bpShop} />
      <p className="tag-known self-start">{t.bpSimulation}</p>

      <div className="flex flex-1 flex-col gap-s3" aria-live="polite">
        {paid ? (
          <>
            <div className="settle flex flex-col gap-s1">
              <p className="text-h2 leading-tight font-bold">{t.bpBeep}</p>
              <p className="text-body text-muted">
                {t.bpApproved} · <Money value={AMOUNT} />
              </p>
            </div>
            {/* The plan isn't here. It's a list of jobs for later. */}
            <div className="settle settle--late flex flex-col gap-s2 border-t border-rule pt-s3">
              <p className="text-small font-medium text-muted">{t.bpLater}</p>
              <ol className="flex flex-col gap-s1">
                {t.bpLaterSteps.map((step) => (
                  <li key={step} className="text-body text-ink-soft">
                    {step}
                  </li>
                ))}
              </ol>
              <p className="text-body font-semibold">{t.bpOrForget}</p>
            </div>
          </>
        ) : (
          <p className="text-body text-ink-soft">{t.bpTapToPay}</p>
        )}
      </div>

      <PayButton paid={paid} onToggle={() => setPaid((p) => !p)} />
    </div>
  );
}

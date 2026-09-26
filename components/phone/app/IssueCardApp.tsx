"use client";

/**
 * Idea 1 · the card arrives in the Saudi Tabby app.
 *
 * Home → Card tab → Get your card → eligibility → verify → card ready →
 * "Next: set your rules", which hands over to Idea 2. The step order is the
 * UAE's published one (lib/issue.ts); every Saudi-specific line is tagged
 * as a proposal, and the identity check and the wallet are simulated.
 *
 * Focus: a step change unmounts the button that caused it, so focus moves
 * to the new screen's heading. Only after the visitor acts, never on load.
 */

import { useEffect, useReducer, useRef, useState } from "react";
import { initialIssue, issueReducer, type IssueEvent, type IssueState } from "@/lib/issue";
import { useLang } from "@/lib/LanguageProvider";
import Phone from "@/components/phone/Phone";
import AppShell, { NotInPrototype } from "@/components/phone/app/AppShell";
import HomeScreen from "@/components/phone/app/HomeScreen";
import CardVisual from "@/components/phone/app/CardVisual";

/** Position in the five-screen rail, or -1 on a tab outside the flow. */
function railIndex(s: IssueState): number {
  if (s.tab === "home") return 0;
  if (s.tab !== "card") return -1;
  return { intro: 1, eligibility: 2, verify: 3, ready: 4 }[s.step];
}

export default function IssueCardApp() {
  const { t } = useLang();
  const [state, dispatchRaw] = useReducer(issueReducer, initialIssue);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const acted = useRef(false);

  const dispatch = (e: IssueEvent) => {
    acted.current = true;
    dispatchRaw(e);
  };

  useEffect(() => {
    if (acted.current) headingRef.current?.focus({ preventScroll: true });
  }, [state]);

  const now = railIndex(state);

  return (
    <div className="grid items-start gap-s5 lg:grid-cols-2">
      <Phone>
        <AppShell tab={state.tab} onTab={(tab) => dispatch({ type: "TAB", tab })}>
          <Screen state={state} dispatch={dispatch} headingRef={headingRef} />
        </AppShell>
      </Phone>

      <div className="flex flex-col gap-s3 lg:sticky lg:top-s3">
        <p className="hint">{t.idea1Try}</p>
        <ol aria-label={t.idea1StepsLabel} className="flex flex-col gap-s1">
          {t.idea1Steps.map((name, i) => (
            <li
              key={name}
              aria-current={i === now ? "step" : undefined}
              className={`flex items-center gap-s2 rounded-tabby border p-s2 text-body ${
                i === now ? "border-ink bg-card font-semibold text-ink" : "border-rule text-muted"
              }`}
            >
              <bdi className="tnum">{i + 1}</bdi>
              <span>{name}</span>
            </li>
          ))}
        </ol>
        <button type="button" className="btn-secondary self-start" onClick={() => dispatch({ type: "RESET" })}>
          {t.idea1Restart}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

interface ScreenProps {
  state: IssueState;
  dispatch: (e: IssueEvent) => void;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}

function Screen({ state, dispatch, headingRef }: ScreenProps) {
  const { t } = useLang();

  if (state.tab === "home") {
    return (
      <>
        <h3 ref={headingRef} tabIndex={-1} className="sr-only">
          {t.appTabHome}
        </h3>
        <HomeScreen onOpenCard={() => dispatch({ type: "TAB", tab: "card" })} />
      </>
    );
  }
  if (state.tab !== "card") {
    return (
      <>
        {/* The tab's name, so the heading and the line under it don't repeat. */}
        <h3 ref={headingRef} tabIndex={-1} className="sr-only">
          {{ shop: t.appTabShop, payments: t.appTabPayments, account: t.appTabAccount }[state.tab]}
        </h3>
        <NotInPrototype />
      </>
    );
  }

  const back = (
    <button type="button" className="app-back" onClick={() => dispatch({ type: "BACK" })}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="m15 5-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {t.appBack}
    </button>
  );
  const heading = (text: string) => (
    <h3 ref={headingRef} tabIndex={-1} className="app-title">
      {text}
    </h3>
  );
  const proposal = <span className="tag-guess self-start">{t.appProposal}</span>;

  switch (state.step) {
    case "intro":
      return (
        <>
          {heading(t.cardTitle)}
          <CardVisual />
          <p className="text-body text-ink-soft">{t.cardIntroLead}</p>
          <ul className="flex flex-col gap-s1">
            {t.cardPerks.map((p) => (
              <Check key={p}>{p}</Check>
            ))}
          </ul>
          <p className="text-small text-muted">{t.cardPerksNote}</p>
          {proposal}
          <button type="button" className="app-btn mt-auto" onClick={() => dispatch({ type: "NEXT" })}>
            {t.cardGet}
          </button>
        </>
      );
    case "eligibility":
      return (
        <>
          {back}
          {heading(t.eligTitle)}
          <ul className="flex flex-col gap-s1">
            {t.eligList.map((p) => (
              <Check key={p}>{p}</Check>
            ))}
          </ul>
          <p className="text-small text-muted">{t.eligNote}</p>
          {proposal}
          <button type="button" className="app-btn mt-auto" onClick={() => dispatch({ type: "NEXT" })}>
            {t.eligContinue}
          </button>
        </>
      );
    case "verify":
      return (
        <>
          {back}
          {heading(t.verifyTitle)}
          <p className="text-body text-ink-soft">{t.verifyLead}</p>
          <div className="app-tile items-center py-s4" aria-hidden="true">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="5" width="18" height="14" rx="2.5" />
              <circle cx="9" cy="11" r="2.2" />
              <path d="M5.8 16c.6-1.6 1.8-2.4 3.2-2.4s2.6.8 3.2 2.4M14.5 10h4M14.5 13.5h3" strokeLinecap="round" />
            </svg>
          </div>
          <span className="tag-known self-start">{t.verifySim}</span>
          <button type="button" className="app-btn mt-auto" onClick={() => dispatch({ type: "NEXT" })}>
            {t.verifyCta}
          </button>
        </>
      );
    case "ready":
      return <Ready heading={heading(t.readyTitle)} />;
  }
}

function Ready({ heading }: { heading: React.ReactNode }) {
  const { t } = useLang();
  const [walletNote, setWalletNote] = useState(false);

  return (
    <>
      {heading}
      <div className="settle">
        <CardVisual issued />
      </div>
      <p className="text-body text-ink-soft">{t.readyLead}</p>
      <button type="button" className="app-btn app-btn--quiet" onClick={() => setWalletNote(true)}>
        {t.readyWallet}
      </button>
      <p aria-live="polite" className="text-small text-muted">
        {walletNote ? t.readyWalletNote : null}
      </p>
      {/* The handover: Idea 1 ends where Idea 2 begins. */}
      <a href="#idea-2" className="app-btn mt-auto">
        {t.readyRules}
      </a>
    </>
  );
}

function Check({ children }: { children: React.ReactNode }) {
  return (
    <li className="app-check">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
        <path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{children}</span>
    </li>
  );
}

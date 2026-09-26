/**
 * Idea 1 · the Saudi Tabby app gains a Card tab, and the card is issued
 * from it. PROTOTYPE: nothing here checks anyone or issues anything.
 *
 * The step order is the UAE's own, as Tabby publishes it
 * (tabby.ai/en-AE/card, fetched 26 Sep 2026): "Navigate to the Money tab,
 * Select Get your card, Complete setup and verify your identity." In the
 * Saudi proposal the card has a tab of its own (NOTES.md R1).
 */

export type Tab = "home" | "shop" | "card" | "payments" | "account";
export type IssueStep = "intro" | "eligibility" | "verify" | "ready";

export interface IssueState {
  tab: Tab;
  step: IssueStep;
}

export type IssueEvent =
  | { type: "TAB"; tab: Tab }
  | { type: "NEXT" }
  | { type: "BACK" }
  | { type: "RESET" };

const ORDER: IssueStep[] = ["intro", "eligibility", "verify", "ready"];

export const initialIssue: IssueState = { tab: "home", step: "intro" };

/** Pure. An event that doesn't apply returns the same state object. */
export function issueReducer(state: IssueState, event: IssueEvent): IssueState {
  switch (event.type) {
    case "TAB":
      return event.tab === state.tab ? state : { ...state, tab: event.tab };
    case "NEXT": {
      if (state.tab !== "card" || state.step === "ready") return state;
      return { ...state, step: ORDER[ORDER.indexOf(state.step) + 1] };
    }
    case "BACK": {
      // No way back out of "ready": the card exists.
      if (state.tab !== "card" || state.step === "intro" || state.step === "ready") return state;
      return { ...state, step: ORDER[ORDER.indexOf(state.step) - 1] };
    }
    case "RESET":
      return initialIssue;
  }
}

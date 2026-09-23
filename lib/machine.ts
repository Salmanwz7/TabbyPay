import type { Purchase, Rules } from "./mock-data.ts";

export type Outcome =
  | "NOT_ELIGIBLE"
  | "FEE_PLAN_AVAILABLE"
  | "BELOW_THRESHOLD"
  | "OVER_CAP"
  | "MATCHES_RULE";

export type Plan = "statement" | "pay_in_4" | "fee_plan";
export type Resolution = "PLAN_CREATED" | "STATEMENT" | "PLAN_UPDATED";
export type Reason =
  | "by_rule"
  | "by_you"
  | "below_threshold"
  | "over_cap"
  | "not_eligible"
  | "you_chose_statement";
export type Instalment = { date: string; amount: number };

export type Entry = {
  id: string;
  purchase: Purchase;
  outcome: Outcome;
  plan: Plan;
  reason: Reason;
  resolution: Resolution;
  schedule: Instalment[];
  rulesAtTime: Rules;
  refund?: { returned: number; cancelled: number };
};

export type View = "card" | "set_rules" | "this_month";
export type ScenarioId = "over_cap";

export type Phase =
  | { tag: "IDLE"; view: View }
  | { tag: "TAP"; purchaseId: string }
  | { tag: "ELIGIBILITY_CHECK"; purchaseId: string }
  | { tag: "ASK_CUSTOMER"; purchaseId: string }
  | { tag: "RECEIPT"; entryId: string }
  | { tag: "CHANGE_PLAN"; entryId: string };

export type State = {
  phase: Phase;
  rules: Rules;
  baseMonthToDate: number;
  ledger: Entry[];
  rulesChangedMidMonth: boolean;
};

export type Event =
  | { type: "SHOW"; view: View }
  | { type: "TAP"; purchaseId: string }
  | { type: "AUTHORISE" }
  | { type: "NOTIFY" }
  | { type: "CHOOSE"; choice: Plan }
  | { type: "CHANGE_PLAN" }
  | { type: "PICK_PLAN"; plan: Plan }
  | { type: "REFUND" }
  | { type: "SET_RULES"; rules: Rules }
  | { type: "OPEN_SCENARIO"; id: ScenarioId }
  | { type: "RESET" };

export function evaluatePurchase(_p: Purchase, _r: Rules, _mtd: number): Outcome {
  throw new Error("not implemented");
}
export function payIn4(_amount: number, _from: string): Instalment[] {
  throw new Error("not implemented");
}
export function initialState(): State {
  throw new Error("not implemented");
}
export function capUsed(_s: State): number {
  throw new Error("not implemented");
}
export function reducer(_s: State, _e: Event): State {
  throw new Error("not implemented");
}

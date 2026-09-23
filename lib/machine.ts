/**
 * The Split Rules engine. Pure: no React, no dates from the clock, no I/O.
 *
 * Two layers:
 *
 *   evaluatePurchase()  The three rules applied to one purchase. This is the
 *                       hero simulator's entire behaviour, and the decision
 *                       the card would make at authorisation (spec §2.4:
 *                       the terminal never waits, so rules decide up front).
 *
 *   reducer()           The spec §7 state machine, for the phone prototype's
 *                       useReducer. Every state in the spec's diagram is a
 *                       Phase tag or a Resolution on the receipt entry:
 *
 *   IDLE ─TAP→ TAP ─AUTHORISE→ ELIGIBILITY_CHECK ─NOTIFY→
 *       NOT_ELIGIBLE / BELOW_THRESHOLD / OVER_CAP → STATEMENT    → RECEIPT
 *       FEE_PLAN_AVAILABLE → ASK_CUSTOMER ─CHOOSE→ PLAN_CREATED
 *                                                  or STATEMENT → RECEIPT
 *       MATCHES_RULE → PLAN_CREATED                             → RECEIPT
 *   RECEIPT ─CHANGE_PLAN→ CHANGE_PLAN ─PICK_PLAN→ PLAN_UPDATED  → RECEIPT
 *
 * BELOW_THRESHOLD is not in the spec's diagram; the pharmacy purchase (SAR 85
 * under a SAR 300 rule) needs it. NOTES.md P1.
 *
 * Money is computed in halalas (integer) and handed back in riyals, so
 * 450 / 4 is exactly 112.50 and a remainder lands on the first payment.
 */

import {
  DEFAULT_RULES,
  LONG_PLAN_MIN,
  MONTH_TO_DATE,
  OVER_CAP_MONTH_TO_DATE,
  STATEMENT_CLOSES,
  TODAY,
  byId,
  type Purchase,
  type Rules,
} from "./mock-data.ts";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Outcome =
  | "NOT_ELIGIBLE"
  | "FEE_PLAN_AVAILABLE"
  | "BELOW_THRESHOLD"
  | "OVER_CAP"
  | "MATCHES_RULE";

export type Plan = "statement" | "pay_in_4" | "fee_plan";

/** How the receipt came to be: the spec's PLAN_CREATED / STATEMENT / PLAN_UPDATED. */
export type Resolution = "PLAN_CREATED" | "STATEMENT" | "PLAN_UPDATED";

/** Why, in the customer's terms. The receipt's most important line. */
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
  /** Empty when the purchase is on the statement. */
  schedule: Instalment[];
  /** The rules as they stood at the tap. A later rule change never rewrites this. */
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
  /** Split this month before the prototype's ledger starts. */
  baseMonthToDate: number;
  ledger: Entry[];
  /** Set when rules change after a purchase: "applies from now on" (§5.4). */
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

// ---------------------------------------------------------------------------
// The rules
// ---------------------------------------------------------------------------

/**
 * Checks run in this order, and the order is the product:
 *
 * 1. Eligibility first. A rule is a preference, not a promise (§2.4).
 * 2. A plan with a cost always asks, before any rule can apply it (§2.4,
 *    Murabaha consent). No slider position reaches past this line.
 * 3. Under the threshold: not split.
 * 4. Would pass the cap: not split. Landing exactly on the cap is allowed.
 * 5. Otherwise: split into 4, fee-free, "by your rule".
 */
export function evaluatePurchase(p: Purchase, rules: Rules, monthToDate: number): Outcome {
  if (!p.eligible) return "NOT_ELIGIBLE";
  if (p.feePlan && p.amount >= LONG_PLAN_MIN) return "FEE_PLAN_AVAILABLE";
  if (p.amount < rules.threshold) return "BELOW_THRESHOLD";
  if (monthToDate + p.amount > rules.cap) return "OVER_CAP";
  return "MATCHES_RULE";
}

// ---------------------------------------------------------------------------
// Schedules
// ---------------------------------------------------------------------------

const toHalalas = (sar: number) => Math.round(sar * 100);
const toSar = (h: number) => h / 100;

/** ISO date plus whole months, clamped to the last day of the target month. */
function addMonths(iso: string, months: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const target = new Date(Date.UTC(y, m - 1 + months, 1));
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(d, lastDay));
  return target.toISOString().slice(0, 10);
}

/** Equal monthly payments from `from`; the remainder rides on the first. */
export function schedule(amount: number, count: number, from: string): Instalment[] {
  const total = toHalalas(amount);
  const base = Math.floor(total / count);
  const first = total - base * (count - 1);
  return Array.from({ length: count }, (_, i) => ({
    date: addMonths(from, i),
    amount: toSar(i === 0 ? first : base),
  }));
}

export function payIn4(amount: number, from: string): Instalment[] {
  return schedule(amount, 4, from);
}

function scheduleFor(plan: Plan, p: Purchase): Instalment[] {
  if (plan === "pay_in_4") return payIn4(p.amount, TODAY);
  if (plan === "fee_plan" && p.feePlan) {
    return schedule(p.amount + p.feePlan.fee, p.feePlan.months, TODAY);
  }
  return [];
}

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

export function initialState(): State {
  return {
    phase: { tag: "IDLE", view: "card" },
    rules: DEFAULT_RULES,
    baseMonthToDate: MONTH_TO_DATE,
    ledger: [],
    rulesChangedMidMonth: false,
  };
}

/**
 * What the cap bar shows: fee-free splits this month, live ones only.
 * The cap governs Pay in 4 (Rule 2); a fee plan was a separate yes.
 */
export function capUsed(s: State): number {
  return s.ledger.reduce(
    (sum, e) => (e.plan === "pay_in_4" && !e.refund ? sum + e.purchase.amount : sum),
    s.baseMonthToDate,
  );
}

/** Plans can be changed until the statement closes (§5.1). */
export const canChangePlan = (e: Entry) => !e.refund && TODAY <= STATEMENT_CLOSES;

const OUTCOME_TO_ENTRY: Record<Exclude<Outcome, "FEE_PLAN_AVAILABLE">, Pick<Entry, "plan" | "reason" | "resolution">> = {
  MATCHES_RULE: { plan: "pay_in_4", reason: "by_rule", resolution: "PLAN_CREATED" },
  BELOW_THRESHOLD: { plan: "statement", reason: "below_threshold", resolution: "STATEMENT" },
  OVER_CAP: { plan: "statement", reason: "over_cap", resolution: "STATEMENT" },
  NOT_ELIGIBLE: { plan: "statement", reason: "not_eligible", resolution: "STATEMENT" },
};

function record(s: State, p: Purchase, outcome: Outcome, fields: Pick<Entry, "plan" | "reason" | "resolution">): State {
  const entry: Entry = {
    id: `${p.id}-${s.ledger.length + 1}`,
    purchase: p,
    outcome,
    ...fields,
    schedule: scheduleFor(fields.plan, p),
    rulesAtTime: s.rules,
  };
  return { ...s, ledger: [...s.ledger, entry], phase: { tag: "RECEIPT", entryId: entry.id } };
}

function updateEntry(s: State, id: string, change: (e: Entry) => Entry): State {
  return { ...s, ledger: s.ledger.map((e) => (e.id === id ? change(e) : e)) };
}

const entryOf = (s: State, id: string) => s.ledger.find((e) => e.id === id);

// ---------------------------------------------------------------------------
// The reducer
// ---------------------------------------------------------------------------

/**
 * An event that doesn't apply in the current phase returns the SAME state
 * object, so React skips the render and a stray click can't corrupt the flow.
 */
export function reducer(s: State, e: Event): State {
  const { phase } = s;

  switch (e.type) {
    case "SHOW":
      return { ...s, phase: { tag: "IDLE", view: e.view } };

    case "TAP":
      if (phase.tag !== "IDLE" && phase.tag !== "RECEIPT") return s;
      return { ...s, phase: { tag: "TAP", purchaseId: e.purchaseId } };

    case "AUTHORISE":
      if (phase.tag !== "TAP") return s;
      return { ...s, phase: { tag: "ELIGIBILITY_CHECK", purchaseId: phase.purchaseId } };

    case "NOTIFY": {
      if (phase.tag !== "ELIGIBILITY_CHECK") return s;
      const p = byId(phase.purchaseId);
      const outcome = evaluatePurchase(p, s.rules, capUsed(s));
      if (outcome === "FEE_PLAN_AVAILABLE") {
        return { ...s, phase: { tag: "ASK_CUSTOMER", purchaseId: p.id } };
      }
      return record(s, p, outcome, OUTCOME_TO_ENTRY[outcome]);
    }

    case "CHOOSE": {
      if (phase.tag !== "ASK_CUSTOMER") return s;
      const p = byId(phase.purchaseId);
      if (e.choice === "statement") {
        return record(s, p, "FEE_PLAN_AVAILABLE", { plan: "statement", reason: "you_chose_statement", resolution: "STATEMENT" });
      }
      return record(s, p, "FEE_PLAN_AVAILABLE", { plan: e.choice, reason: "by_you", resolution: "PLAN_CREATED" });
    }

    case "CHANGE_PLAN": {
      if (phase.tag !== "RECEIPT") return s;
      const entry = entryOf(s, phase.entryId);
      if (!entry || !canChangePlan(entry)) return s;
      return { ...s, phase: { tag: "CHANGE_PLAN", entryId: entry.id } };
    }

    case "PICK_PLAN": {
      // From CHANGE_PLAN, or straight from a receipt ("Split anyway", Screen 5).
      if (phase.tag !== "CHANGE_PLAN" && phase.tag !== "RECEIPT") return s;
      const entry = entryOf(s, phase.entryId);
      if (!entry || !canChangePlan(entry)) return s;
      const back: Phase = { tag: "RECEIPT", entryId: entry.id };
      if (entry.plan === e.plan) return { ...s, phase: back };
      if (entry.outcome === "NOT_ELIGIBLE" && e.plan !== "statement") return s;
      if (e.plan === "fee_plan" && !entry.purchase.feePlan) return s;

      const next = updateEntry(s, entry.id, (x) => ({
        ...x,
        plan: e.plan,
        reason: e.plan === "statement" ? "you_chose_statement" : "by_you",
        resolution: "PLAN_UPDATED",
        schedule: scheduleFor(e.plan, x.purchase),
      }));
      return { ...next, phase: back };
    }

    case "REFUND": {
      if (phase.tag !== "RECEIPT") return s;
      const entry = entryOf(s, phase.entryId);
      if (!entry || entry.plan === "statement" || entry.refund) return s;
      return updateEntry(s, entry.id, (x) => ({
        ...x,
        refund: { returned: x.schedule[0].amount, cancelled: x.schedule.length - 1 },
      }));
    }

    case "SET_RULES": {
      const same = e.rules.threshold === s.rules.threshold && e.rules.cap === s.rules.cap;
      if (same) return s;
      return {
        ...s,
        rules: e.rules,
        rulesChangedMidMonth: s.rulesChangedMidMonth || s.ledger.length > 0,
      };
    }

    case "OPEN_SCENARIO":
      return openScenario(e.id);

    case "RESET":
      return initialState();
  }
}

// ---------------------------------------------------------------------------
// Scenarios: each one is built by running real events, so a scenario can
// never show a state the machine itself couldn't reach.
// ---------------------------------------------------------------------------

const tapThrough = (purchaseId: string): Event[] => [
  { type: "TAP", purchaseId },
  { type: "AUTHORISE" },
  { type: "NOTIFY" },
];

function openScenario(id: ScenarioId): State {
  switch (id) {
    case "over_cap":
      // Screen 5: SAR 1,200 of a 2,000 cap, then the SAR 1,400 furniture.
      return tapThrough("furniture").reduce(reducer, {
        ...initialState(),
        baseMonthToDate: OVER_CAP_MONTH_TO_DATE,
      });
  }
}

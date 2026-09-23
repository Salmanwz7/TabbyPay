/**
 * Engine tests. Run with `npm test` (node --test; Node 24 strips the types).
 * Relative .ts imports on purpose: the Node runner has no @/ alias.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  evaluatePurchase,
  payIn4,
  reducer,
  initialState,
  capUsed,
  type Event,
  type State,
} from "./machine.ts";
import {
  DEFAULT_RULES,
  MONTH_TO_DATE,
  PURCHASES,
  TODAY,
  byId,
} from "./mock-data.ts";

const jarir = byId("jarir");
const pharmacy = byId("pharmacy");
const furniture = byId("furniture");
const electronics = byId("electronics");
const salon = byId("salon");

const run = (s: State, ...events: Event[]) => events.reduce(reducer, s);
const tapThrough = (id: string): Event[] => [
  { type: "TAP", purchaseId: id },
  { type: "AUTHORISE" },
  { type: "NOTIFY" },
];

// --- evaluatePurchase: the hero's whole behaviour --------------------------

test("default rules: Jarir 450 matches the rule", () => {
  assert.equal(evaluatePurchase(jarir, DEFAULT_RULES, MONTH_TO_DATE), "MATCHES_RULE");
});

test("default rules: pharmacy 85 is under the threshold", () => {
  assert.equal(evaluatePurchase(pharmacy, DEFAULT_RULES, MONTH_TO_DATE), "BELOW_THRESHOLD");
});

test("default rules: furniture 1,400 would pass the cap (840 + 1,400 > 2,000)", () => {
  assert.equal(evaluatePurchase(furniture, DEFAULT_RULES, MONTH_TO_DATE), "OVER_CAP");
});

test("default rules: electronics 3,200 has a fee plan, so it asks", () => {
  assert.equal(evaluatePurchase(electronics, DEFAULT_RULES, MONTH_TO_DATE), "FEE_PLAN_AVAILABLE");
});

test("raising the cap to 2,300 flips furniture to split", () => {
  assert.equal(
    evaluatePurchase(furniture, { ...DEFAULT_RULES, cap: 2300 }, MONTH_TO_DATE),
    "MATCHES_RULE",
  );
});

test("landing exactly on the cap still splits", () => {
  assert.equal(
    evaluatePurchase(furniture, { ...DEFAULT_RULES, cap: 2240 }, MONTH_TO_DATE),
    "MATCHES_RULE",
  );
});

test("a purchase exactly at the threshold splits ('over SAR 300' means 300 and up)", () => {
  assert.equal(
    evaluatePurchase(jarir, { ...DEFAULT_RULES, threshold: 450 }, MONTH_TO_DATE),
    "MATCHES_RULE",
  );
});

test("lowering the threshold to 50 splits the pharmacy purchase", () => {
  assert.equal(
    evaluatePurchase(pharmacy, { ...DEFAULT_RULES, threshold: 50 }, MONTH_TO_DATE),
    "MATCHES_RULE",
  );
});

test("a not-eligible purchase is never split, whatever the rules", () => {
  assert.equal(evaluatePurchase(salon, { threshold: 50, cap: 5000 }, 0), "NOT_ELIGIBLE");
});

test("a fee plan is never auto-applied at any slider position", () => {
  for (let threshold = 50; threshold <= 1000; threshold += 50) {
    for (let cap = 500; cap <= 5000; cap += 100) {
      assert.equal(
        evaluatePurchase(electronics, { threshold, cap }, MONTH_TO_DATE),
        "FEE_PLAN_AVAILABLE",
        `threshold ${threshold}, cap ${cap}`,
      );
    }
  }
});

// --- payIn4 --------------------------------------------------------------------

test("Jarir 450 becomes 4 x 112.50, monthly from today", () => {
  assert.deepEqual(payIn4(450, TODAY), [
    { date: "2026-09-23", amount: 112.5 },
    { date: "2026-10-23", amount: 112.5 },
    { date: "2026-11-23", amount: 112.5 },
    { date: "2026-12-23", amount: 112.5 },
  ]);
});

test("a remainder that does not divide goes on the first payment", () => {
  const s = payIn4(100.01, TODAY);
  assert.deepEqual(s.map((i) => i.amount), [25.01, 25, 25, 25]);
});

test("dates roll over the year and clamp to month end", () => {
  assert.deepEqual(payIn4(400, "2026-11-30").map((i) => i.date), [
    "2026-11-30",
    "2026-12-30",
    "2027-01-30",
    "2027-02-28",
  ]);
});

// --- reducer: the §7 state machine ------------------------------------------

test("starts IDLE on the card, with the default rules and month-to-date", () => {
  const s = initialState();
  assert.equal(s.phase.tag, "IDLE");
  assert.deepEqual(s.rules, DEFAULT_RULES);
  assert.equal(capUsed(s), MONTH_TO_DATE);
});

test("tap -> authorise -> notify walks TAP, ELIGIBILITY_CHECK, RECEIPT", () => {
  const s1 = reducer(initialState(), { type: "TAP", purchaseId: "jarir" });
  assert.equal(s1.phase.tag, "TAP");
  const s2 = reducer(s1, { type: "AUTHORISE" });
  assert.equal(s2.phase.tag, "ELIGIBILITY_CHECK");
  const s3 = reducer(s2, { type: "NOTIFY" });
  assert.equal(s3.phase.tag, "RECEIPT");

  const entry = s3.ledger[0];
  assert.equal(entry.plan, "pay_in_4");
  assert.equal(entry.reason, "by_rule");
  assert.equal(entry.resolution, "PLAN_CREATED");
  assert.equal(entry.schedule.length, 4);
  assert.equal(capUsed(s3), MONTH_TO_DATE + 450);
});

test("below the threshold: on the statement, and the customer can split it", () => {
  const s = run(initialState(), ...tapThrough("pharmacy"));
  assert.equal(s.ledger[0].plan, "statement");
  assert.equal(s.ledger[0].reason, "below_threshold");
  assert.equal(s.ledger[0].resolution, "STATEMENT");
});

test("over the cap goes to the statement and can be split anyway", () => {
  const s = run(initialState(), ...tapThrough("furniture"));
  assert.equal(s.phase.tag, "RECEIPT");
  assert.equal(s.ledger[0].plan, "statement");
  assert.equal(s.ledger[0].reason, "over_cap");
  assert.equal(s.ledger[0].resolution, "STATEMENT");

  const after = reducer(s, { type: "PICK_PLAN", plan: "pay_in_4" });
  assert.equal(after.phase.tag, "RECEIPT");
  assert.equal(after.ledger[0].plan, "pay_in_4");
  assert.equal(after.ledger[0].reason, "by_you");
  assert.equal(after.ledger[0].resolution, "PLAN_UPDATED");
});

test("a fee plan stops at ASK_CUSTOMER and creates nothing until the customer chooses", () => {
  const s = run(initialState(), ...tapThrough("electronics"));
  assert.equal(s.phase.tag, "ASK_CUSTOMER");
  assert.equal(s.ledger.length, 0);

  const accepted = reducer(s, { type: "CHOOSE", choice: "fee_plan" });
  const e = accepted.ledger[0];
  assert.equal(e.plan, "fee_plan");
  assert.equal(e.reason, "by_you");
  assert.equal(e.resolution, "PLAN_CREATED");
  assert.equal(e.schedule.length, 6);
  const total = e.schedule.reduce((a, i) => a + i.amount, 0);
  assert.equal(Math.round(total * 100) / 100, electronics.amount + electronics.feePlan!.fee);

  const four = reducer(s, { type: "CHOOSE", choice: "pay_in_4" });
  assert.equal(four.ledger[0].plan, "pay_in_4");
  assert.equal(four.ledger[0].reason, "by_you");

  const stmt = reducer(s, { type: "CHOOSE", choice: "statement" });
  assert.equal(stmt.ledger[0].plan, "statement");
  assert.equal(stmt.ledger[0].reason, "you_chose_statement");
  assert.equal(stmt.ledger[0].resolution, "STATEMENT");
});

test("not eligible: the purchase is recorded on the statement, not split", () => {
  const s = run(initialState(), ...tapThrough("salon"));
  assert.equal(s.ledger[0].plan, "statement");
  assert.equal(s.ledger[0].reason, "not_eligible");
});

test("a rule change mid-month leaves existing plans alone and says so", () => {
  const s = run(initialState(), ...tapThrough("jarir"));
  const changed = reducer(s, { type: "SET_RULES", rules: { threshold: 500, cap: 2000 } });
  assert.equal(changed.rulesChangedMidMonth, true);
  assert.equal(changed.ledger[0].plan, "pay_in_4");
  assert.deepEqual(changed.ledger[0].rulesAtTime, DEFAULT_RULES);

  // The next Jarir purchase follows the new rule.
  const next = run(changed, ...tapThrough("jarir"));
  assert.equal(next.ledger[1].reason, "below_threshold");
});

test("setting rules before any purchase is not a mid-month change", () => {
  const s = reducer(initialState(), { type: "SET_RULES", rules: { threshold: 500, cap: 2000 } });
  assert.equal(s.rulesChangedMidMonth, false);
});

test("a refund after a split cancels the remaining payments and frees the cap", () => {
  const s = run(initialState(), ...tapThrough("jarir"));
  const r = reducer(s, { type: "REFUND" });
  const e = r.ledger[0];
  assert.ok(e.refund);
  assert.equal(e.refund.returned, 112.5);
  assert.equal(e.refund.cancelled, 3);
  assert.equal(capUsed(r), MONTH_TO_DATE);
  assert.equal(r.phase.tag, "RECEIPT");
});

test("change plan: a split purchase can be moved back to the statement", () => {
  const s = run(initialState(), ...tapThrough("jarir"), { type: "CHANGE_PLAN" });
  assert.equal(s.phase.tag, "CHANGE_PLAN");
  const moved = reducer(s, { type: "PICK_PLAN", plan: "statement" });
  assert.equal(moved.phase.tag, "RECEIPT");
  assert.equal(moved.ledger[0].plan, "statement");
  assert.equal(moved.ledger[0].resolution, "PLAN_UPDATED");
  assert.equal(capUsed(moved), MONTH_TO_DATE);
});

test("events that do not apply in a phase leave the state unchanged", () => {
  const s = initialState();
  assert.equal(reducer(s, { type: "AUTHORISE" }), s);
  assert.equal(reducer(s, { type: "NOTIFY" }), s);
  assert.equal(reducer(s, { type: "REFUND" }), s);
  assert.equal(reducer(s, { type: "CHOOSE", choice: "fee_plan" }), s);
});

test("the over-cap scenario reproduces Screen 5: 1,200 of 2,000 so far", () => {
  const s = reducer(initialState(), { type: "OPEN_SCENARIO", id: "over_cap" });
  assert.equal(s.phase.tag, "RECEIPT");
  assert.equal(s.ledger.at(-1)!.reason, "over_cap");
  assert.equal(s.ledger.at(-1)!.purchase.id, "furniture");
  assert.equal(capUsed(s), 1200);
});

test("every preset purchase has a merchant name in both languages", () => {
  for (const p of PURCHASES) assert.ok(p.merchant.ar && p.merchant.en);
});

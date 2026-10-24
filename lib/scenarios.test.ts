/**
 * The phone prototype's scenario list (spec §5.3 screens, §5.4 edge cases).
 * Each scenario must be a state the machine reaches by real events.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { capUsed, initialState, reducer, type ScenarioId, type State } from "./machine.ts";

const open = (id: ScenarioId): State => reducer(initialState(), { type: "OPEN_SCENARIO", id });
const receiptEntry = (s: State) => {
  assert.equal(s.phase.tag, "RECEIPT");
  const id = s.phase.tag === "RECEIPT" ? s.phase.entryId : "";
  return s.ledger.find((e) => e.id === id)!;
};

test("receipt (Screen 4): Jarir split by rule into 4 × 112.50", () => {
  const e = receiptEntry(open("receipt"));
  assert.equal(e.purchase.id, "jarir");
  assert.equal(e.reason, "by_rule");
  assert.deepEqual(e.schedule.map((r) => r.amount), [112.5, 112.5, 112.5, 112.5]);
});

test("fee_plan (Screen 6): electronics asks, nothing recorded yet", () => {
  const s = open("fee_plan");
  assert.deepEqual(s.phase, { tag: "ASK_CUSTOMER", purchaseId: "electronics" });
  assert.equal(s.ledger.length, 0);
});

test("not_eligible (Screen 7): salon goes to statement, reason not_eligible", () => {
  const e = receiptEntry(open("not_eligible"));
  assert.equal(e.purchase.id, "salon");
  assert.equal(e.plan, "statement");
  assert.equal(e.reason, "not_eligible");
});

test("refund: Jarir refunded after split, 3 payments cancelled", () => {
  const e = receiptEntry(open("refund"));
  assert.deepEqual(e.refund, { returned: 112.5, cancelled: 3 });
});

test("rule_changed: a purchase, then a new cap; old entry keeps old rules", () => {
  const s = open("rule_changed");
  assert.equal(s.rulesChangedMidMonth, true);
  assert.deepEqual(s.phase, { tag: "IDLE", view: "set_rules" });
  assert.equal(s.ledger[0].rulesAtTime.cap, 2000);
  assert.notEqual(s.rules.cap, 2000);
});

test("this_month (Screen 8): a mixed month, grouped view open", () => {
  const s = open("this_month");
  assert.deepEqual(s.phase, { tag: "IDLE", view: "this_month" });
  const reasons = s.ledger.map((e) => e.reason).sort();
  assert.deepEqual(reasons, ["below_threshold", "by_rule", "by_you"]);
  // 840 before + Jarir 450 by rule = 1,290. Electronics 3,200 went on a
  // 6-month fee plan by the customer's yes, which doesn't fill the cap.
  assert.equal(capUsed(s), 1290);
  assert.equal(s.ledger.find((e) => e.purchase.id === "electronics")!.plan, "fee_plan");
});

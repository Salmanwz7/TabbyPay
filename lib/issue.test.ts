/**
 * Idea 1 · getting the Tabby Card from the new Card tab.
 * Steps follow the UAE's published order (tabby.ai/en-AE/card): open the
 * card area → Get your card → setup → verify identity → card ready.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { initialIssue, issueReducer, type IssueState } from "./issue.ts";

const run = (events: Parameters<typeof issueReducer>[1][], from: IssueState = initialIssue) =>
  events.reduce(issueReducer, from);

test("starts on Home, card not yet issued", () => {
  assert.equal(initialIssue.tab, "home");
  assert.equal(initialIssue.step, "intro");
});

test("the full path: Card tab → intro → eligibility → verify → ready", () => {
  const s = run([{ type: "TAB", tab: "card" }, { type: "NEXT" }, { type: "NEXT" }, { type: "NEXT" }]);
  assert.equal(s.tab, "card");
  assert.equal(s.step, "ready");
});

test("NEXT does nothing outside the Card tab", () => {
  assert.equal(issueReducer(initialIssue, { type: "NEXT" }), initialIssue);
});

test("ready is terminal for NEXT and BACK", () => {
  const ready = run([{ type: "TAB", tab: "card" }, { type: "NEXT" }, { type: "NEXT" }, { type: "NEXT" }]);
  assert.equal(issueReducer(ready, { type: "NEXT" }), ready);
  assert.equal(issueReducer(ready, { type: "BACK" }), ready);
});

test("BACK walks back through the setup, not past the intro", () => {
  const verify = run([{ type: "TAB", tab: "card" }, { type: "NEXT" }, { type: "NEXT" }]);
  assert.equal(verify.step, "verify");
  const elig = issueReducer(verify, { type: "BACK" });
  assert.equal(elig.step, "eligibility");
  const intro = issueReducer(elig, { type: "BACK" });
  assert.equal(intro.step, "intro");
  assert.equal(issueReducer(intro, { type: "BACK" }), intro);
});

test("leaving the Card tab keeps progress; coming back resumes it", () => {
  const s = run([{ type: "TAB", tab: "card" }, { type: "NEXT" }, { type: "TAB", tab: "home" }, { type: "TAB", tab: "card" }]);
  assert.equal(s.step, "eligibility");
});

test("RESET returns to the first screen", () => {
  const s = run([{ type: "TAB", tab: "card" }, { type: "NEXT" }, { type: "RESET" }]);
  assert.deepEqual(s, initialIssue);
});

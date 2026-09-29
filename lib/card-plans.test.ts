import { test } from "node:test";
import assert from "node:assert/strict";
import { CARD_PLAN_MONTHS, splitMonths } from "./card-plans.ts";

const halalas = (n: number) => Math.round(n * 100);
const sum = (xs: number[]) => xs.reduce((a, b) => a + halalas(b), 0);

test("the card's plans are the UAE page's: 4, 6, 8 or 10 months", () => {
  assert.deepEqual([...CARD_PLAN_MONTHS], [4, 6, 8, 10]);
});

test("an even split is the same every month", () => {
  const p = splitMonths(500, 4);
  assert.deepEqual(p.payments, [125, 125, 125, 125]);
  assert.equal(p.monthly, 125);
  assert.equal(p.first, 125);
});

test("an uneven split puts the leftover halalas in the first month", () => {
  const p = splitMonths(500, 6);
  assert.equal(p.payments.length, 6);
  assert.equal(p.first, 83.35);
  assert.equal(p.monthly, 83.33);
  assert.deepEqual(p.payments.slice(1), [83.33, 83.33, 83.33, 83.33, 83.33]);
});

test("every plan adds back up to the purchase, to the halala", () => {
  for (const amount of [500, 85, 1_290, 3_200, 99.99]) {
    for (const months of CARD_PLAN_MONTHS) {
      const p = splitMonths(amount, months);
      assert.equal(p.payments.length, months);
      assert.equal(sum(p.payments), halalas(amount), `${amount} over ${months}`);
      assert.ok(p.payments.every((x) => x > 0));
    }
  }
});

test("8 and 10 months of 500", () => {
  assert.equal(splitMonths(500, 8).monthly, 62.5);
  assert.equal(splitMonths(500, 10).monthly, 50);
});

test("a plan that isn't offered is refused", () => {
  assert.throws(() => splitMonths(500, 3 as never));
  assert.throws(() => splitMonths(0, 4));
});

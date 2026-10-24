# TDD evidence — Split Rules engine

Source plan: `PLAN.md` Phase 2. Runner: `npm test` (`node --test "lib/**/*.test.ts"`,
Node 24 type stripping, no test dependencies).

## RED — commit efe6813
Typed stubs throwing "not implemented". `npm test`: tests 26, pass 1, fail 25.
The one pass is the mock-data check (data, not logic). Every failure was the
missing implementation, not setup.

## GREEN
`lib/machine.ts` implemented. `npm test`: tests 26, pass 26, fail 0.
`npx tsc --noEmit`: clean.

## Coverage
`node --test --experimental-test-coverage "lib/**/*.test.ts"`
machine.ts 99.43% lines · 80.95% branches · 100% functions.

## What the tests guarantee

| # | Guarantee | Test |
|---|---|---|
| 1 | Default rules: Jarir splits, pharmacy under threshold, furniture over cap, electronics asks | `default rules: …` ×4 |
| 2 | Cap 2,300 flips furniture to split; landing exactly on the cap splits | `raising the cap…`, `landing exactly…` |
| 3 | Threshold is inclusive (450 at a 450 rule splits); threshold 50 splits pharmacy | `a purchase exactly at…`, `lowering the threshold…` |
| 4 | **No slider position ever auto-applies a fee plan** (20 × 46 grid) | `a fee plan is never auto-applied…` |
| 5 | Not eligible beats every rule | `a not-eligible purchase…` |
| 6 | 450 → 4 × 112.50 on 23 Sep/Oct/Nov/Dec; remainder on first; month-end clamp | `payIn4` ×3 |
| 7 | §7 path IDLE → TAP → ELIGIBILITY_CHECK → RECEIPT, with PLAN_CREATED + "by rule" | `tap -> authorise -> notify…` |
| 8 | Over cap → STATEMENT, then "Split anyway" → PLAN_UPDATED, "by you" | `over the cap…` |
| 9 | Fee plan stops at ASK_CUSTOMER; nothing recorded until a choice; 6 × (3,200 + fee) | `a fee plan stops…` |
| 10 | Rule change mid-month: old entries keep plans and rules; notice raised; next tap uses new rule | `a rule change mid-month…` |
| 11 | Refund cancels remaining payments, returns the first, frees the cap | `a refund after a split…` |
| 12 | Change plan until statement close | `change plan…` |
| 13 | Events out of phase return the same object (no render, no corruption) | `events that do not apply…` |
| 14 | Screen 5 scenario starts from the same 840 of 2,000 as everywhere else | `the over-cap scenario…` |

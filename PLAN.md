# Tabby Split Rules — build plan (Submission 3)

## Context

Salman's third Tabby Imagine submission. The Tabby Card breaks Tabby's promise to "know exactly before you commit": the split decision happens after the tap. Split Rules fixes that with three rules set once, a plan receipt seconds after every tap, and fee-bearing plans that always ask first. The deliverable is a one-page, three-act bilingual site (Arabic first) with a live rules simulator as the hero and a clickable phone prototype with 8 screens and 5 edge cases. It is built in Next.js App Router, TypeScript and Tailwind, and must also export to a static folder that runs offline at the 15 Oct final.

`C:\Users\hp\Downloads\TabbyPay` currently holds only `DESIGN-SYSTEM.md`, `tabby-brand.md` and `tokens.css`. It is not a git repo.

**Decisions taken with Salman:**
- Stop at every review gate.
- Run both evidence scrapes first.
- Screen 6 fee is an illustrative figure, labelled on screen as prototype pricing.
- Tailwind v4, configured through CSS `@theme`.

## What to reuse (read before writing new code)

From `C:\Users\hp\Downloads\TabbyCapital` (same stack: Next 15.5, React 19.1, Tailwind 4.1, no motion library):
- `next.config.ts`: `output: "export"`, `images.unoptimized`, `trailingSlash`. Keep its "never build while dev is running" note.
- `app/globals.css`: base, leading tokens by script, `.display/.headline/.quote/.tnum/.measure`, focus, skip link, reduced-motion belt. Its `@theme` block gets rewritten (see Phase 0).
- `components/ui/Slider.tsx` plus the slider CSS in `app/app-ui.css`: native range at opacity 0, grip bars, retiring hint.
- `components/ui/SectionShell.tsx` (`SectionShell`, `Statement`): same rhythm as submissions 1 and 2.
- `components/site/Footer.tsx`: © 2026 Salman Zamzami + inline LinkedIn SVG, FSI/PDI isolation. Extend it to both languages.
- `app/device.css` and the phone part of `components/ui/Frame.tsx`: laminated phone that never rotates and is never scaled. Drop the laptop toggle.
- `lib/format.ts`: `LOCALE`, `formatNumber`, `splitSentences`, `directionKeys`. Add a 2-decimal SAR formatter (112.50) and a date formatter.
- `components/ui/TabbyMark.tsx` + `public/tabby-icon.svg`, and `public/fonts/ReadexPro-{arabic,latin}.woff2`.

From `C:\Users\hp\Downloads\TabbyImagine`:
- `components/LanguageProvider.tsx` + `LangToggle.tsx`: Arabic default, sets `documentElement.lang/dir`, localStorage in try/catch.
- `scrape_reviews.js` (hard-coded `COUNTRY = 'sa'`, Arabic filter), `tag_reviews.js`, `tabby-reviews.csv` (3,246 rows).

## Target structure

```
app/        layout.tsx  page.tsx  globals.css  tokens.css  app-ui.css  device.css
fonts/      ReadexPro-arabic.woff2  ReadexPro-latin.woff2        (next/font/local)
components/
  site/     Masthead  LangToggle  Footer  Hero  Act1  Act2  Act3  Close
  sim/      RulesSimulator ('use client')        hero
  act1/     BrokenPromise ('use client')  Evidence
  phone/    Phone (frame)  SplitRulesApp ('use client', owns useReducer)
            screens/CardRules SetRules Terminal Receipt OverCap FeePlan NotEligible ThisMonth
  act3/     BeneficiarySelector ('use client')
  ui/       SectionShell  Slider  CapBar  Money (figure + ريال word, tnum)  PlanSchedule
lib/        mock-data.ts  machine.ts  machine.test.ts  copy.ts  format.ts  sources.ts  LanguageProvider.tsx
evidence/   scrape_reviews.js (country switch)  tag_reviews.js  outputs
tabby-split-rules-spec.md  PLAN.md  NOTES.md  EVIDENCE.md
```

## Phase 0: foundation

1. Save the pasted spec verbatim as `tabby-split-rules-spec.md`. Write `PLAN.md` (this plan) and start `NOTES.md`. Run `git init` locally with TabbyCapital's `.gitignore`. No remote, no deploy.
2. Hand-write `package.json` using TabbyCapital's versions, then `npm install`. Scripts: `dev`, `build`, `typecheck`, `test` (`node --test lib/*.test.ts`; Node 24 strips types natively, so there are no test dependencies).
3. `app/tokens.css`: the provided file verbatim, plus one clearly marked "Additions" block at the end:
   - Motion tokens (`--t-micro`, `--t-standard`, `--t-reveal`, eases), copied from DESIGN-SYSTEM.md §2.
   - A named type scale: the sizes submissions 1 and 2 used (12/13/14/16/17/20/24/32/40/48/64).
   - A tap-target size (44px) and a button height (52px).
   - Logged in NOTES.md: the spec bans arbitrary values, but DESIGN-SYSTEM §5 uses `text-[30px]`. Named tokens satisfy both.
4. `app/globals.css`: `@import "tailwindcss"`, then `@theme { --*: initial; … }`, then remap only these:
   - Semantic colours: ink, muted, paper, card, green, positive, gold, coral, …
   - `--spacing-s1…s8`
   - `--radius-tabby`
   - `--container-col` / `--container-measure`, so `max-w-col` replaces `max-w-[var(--col)]`
   - Type scale, font weights, eases
   - Breakpoints as literals (media queries can't read `var()`)
5. Fonts: `next/font/local`, called twice (Arabic and Latin subsets, each with a `unicode-range` declaration) and chained as `var(--font-ar), var(--font-latin), system-ui`. Self-hosted and preloaded, so no external request.
6. `layout.tsx`:
   - `<html lang="ar" dir="rtl">`
   - skip link
   - LanguageProvider
   - Masthead (Tabby mark + "قواعدك · Split Rules" + LangToggle)
   - Footer
7. **Verify:**
   - `npm run build` produces `out/`.
   - Put a temporary file using `bg-blue-500 p-7 text-[#333]` through the build, confirm none of the three appear in the emitted CSS, then delete the file.
   - `rg "\b(ml|mr|pl|pr|left|right)-" components app` finds nothing.

## Phase 1: evidence (spec Day 1)

- Copy the scraper and tagger into `evidence/`. Add a `COUNTRY` argument and a language flag (keep Arabic and English for `ae`) instead of the hard-coded `sa`.
- **Run A:** UAE App Store + Google Play (`ae`), English and Arabic. Tag for card, split/manual/automatic, statement, Plus, and confused/didn't-know. Every tag keeps its `matched_terms` for audit.
- **Run B:** re-tag `tabby-reviews.csv` (3,246 Saudi reviews) for بطاقة, كارت, في المحل, آبل باي.
- Write `EVIDENCE.md`: country, date range, n, counts, 5–8 dated verbatims. No number goes on the page unless it is in this file.
- **Primary sources (§13.2):** fetch each one and record the date and market in `lib/sources.ts`. If a source can't be verified, the page shows `[FILL]` instead of the claim, and NOTES.md records it.

## Phase 2: engine (no UI)

- **`lib/mock-data.ts`** (header: PROTOTYPE DATA, not Tabby data):
  - user Reem; fixed "today" 2026-09-23, a literal and never `new Date()`
  - statement close date
  - rules: threshold 300, cap 2,000
  - month-to-date 840
  - presets: Jarir 450, pharmacy 85, furniture 1,400, electronics 3,200
  - `longPlanMin = 2000` (from §2.2, SAR 2,000–50,000)
  - illustrative 6-month fee and total, labelled
  - one purchase flagged not eligible (for Screen 7)
- **`lib/machine.ts`**:
  - Pure `evaluatePurchase(purchase, rules, monthToDate)` returns one of: `NOT_ELIGIBLE`, `FEE_PLAN_AVAILABLE` (amount ≥ `longPlanMin`, always asks), `BELOW_THRESHOLD`, `OVER_CAP`, `MATCHES_RULE`. Checks run in that order.
  - Typed `State` (tagged union: IDLE, TAP, ELIGIBILITY_CHECK, ASK_CUSTOMER, RECEIPT, CHANGE_PLAN).
  - Typed `Event` (TAP, AUTHORISED, CHOOSE accept | pay_in_4 | statement, CHANGE_PLAN, PICK_PLAN, REFUND, SET_RULES, OPEN_SCENARIO, RESET).
  - Every receipt entry records how it resolved (PLAN_CREATED / STATEMENT / PLAN_UPDATED) and why ("split by your rule: over SAR 300", "over your cap", …).
  - The reducer is pure and holds the month ledger. Pay in 4 schedule: monthly from "today", and any remainder goes on the first payment.
  - **Spec gap, logged in NOTES.md:** §7 has no branch for a purchase under the threshold (pharmacy 85). I add `BELOW_THRESHOLD`, which goes to STATEMENT and then RECEIPT and offers "split it yourself".
- **`lib/machine.test.ts`**:
  - At default rules: Jarir splits, pharmacy goes below threshold, furniture goes over cap (840 + 1,400 > 2,000), electronics asks.
  - Raising the cap to 2,300 flips furniture to split.
  - A rule change after a purchase doesn't touch existing entries.
  - A refund cancels remaining payments.
  - Fee plans never auto-apply under any rules.
- **Verify:** `npm test` and `npm run typecheck` both pass.

## Phase 3: hero, the rules simulator. GATE: stop and show Salman

- Headline "Know your plan before the terminal beeps" (Arabic written as spoken, not translated).
- The rules are sentences with inline sliders: "Over SAR [300] → 4 payments" (50–1,000, step 50) and "Never more than SAR [2,000] a month" (500–5,000, step 100). Rule 3 is shown locked.
- The four purchase buttons each carry a live outcome word (Splits / Statement / Asks you / Over cap). The visitor watches a word flip as a slider moves. The word carries the meaning, never colour alone.
- Receipt card (flat, no phone) shows either the schedule plus "Split by your rule" or the reason it wasn't split. CapBar is the only progress bar anywhere.
- Jarir is preselected so the first paint shows the promise. The hint reads "Pick the furniture, then move your cap."
- Each purchase is evaluated against a fixed month-to-date of 840, not cumulatively, so the same purchase can be compared across slider positions. Logged in NOTES.md.

## Phase 4: Act 1, "وش الخلل اليوم". GATE

- Statement 1.1.
- **1.2 BrokenPromise:** two phones side by side, stacked below `sm`, each with a "Pay" button.
  - Left: the schedule appears straight away.
  - Right: "Beep." then a "later" list of the manual steps.
  - Nothing moves until the visitor taps.
- **1.3 Evidence:** counts and verbatims from EVIDENCE.md, each with source, date and n.

## Phase 5: Act 2, "وش بتغيّر". GATE

- Statement 2.1, the rename "You set the rules".
- **2.2 Phone prototype** (`SplitRulesApp`): all 8 screens driven by the reducer.
  - A side list of scenarios, one per screen and edge case, dispatches `OPEN_SCENARIO`.
  - **Screen 3** is a generic "phone at terminal" moment labelled as a simulation. There is no Apple Wallet UI anywhere.
  - **Screen 4:** the notification appears after a short delay triggered by the tap, then the schedule resolves line by line. This is the single orchestrated animation (≤ `--t-reveal`, CSS keyframes, `motion-reduce` shows the final state).
  - **Edge cases built:**
    - over cap
    - fee plan: fee and total are the largest numbers on screen
    - not eligible: no risk reasons
    - refund after split: the receipt updates and says so
    - rule changed mid-month: "applies from now on"
  - The "designed for, not built" list sits under the prototype.
- **2.3** "The rule that can't be changed", treated as a strength.

## Phase 6: Act 3 and Close. GATE after each

- **3.1** Chip selector العميل · التاجر · تابي, with the copy from §1.
- **3.2** Why now: 2022 card promise, $233M raise, U.S. Bank 2021 → 2025. Each is cited, and only if verified in Phase 1.
- **3.3** Responsible-lending statement.
- **Close:** what I cut (§6), what I'd test first (§13.3), method and limitations. Limitations cover:
  - SAMA non-objection not claimed
  - all data mocked
  - substitute typeface
  - UAE-sourced evidence
  - the illustrative fee
- §8 business case, §9 objections and §10 metrics aren't in §12's page outline. They stay out of the page unless Salman asks. Logged in NOTES.md.

## Phase 7: finish (spec Day 7)

- 375px pass, touch targets ≥ 44px.
- Contrast audit on computed values, run in the browser.
- Bidi script from DESIGN-SYSTEM §7 run in both languages.
- Every button pressed by hand, not by a scripted click.
- Remove one thing.
- **Offline check:**
  - Build, disconnect the network, serve `out/` with a zero-dependency local server, then open `out/index.html` over `file://`.
  - If `file://` breaks on absolute `/_next/` paths, add a post-export `scripts/relativize.mjs` that rewrites them to relative, and re-check.

## Rules enforced throughout

- Tokens only: no hex outside `tokens.css`, no arbitrary Tailwind values, only logical utilities.
- `tabular-nums` on every figure. Western digits in both languages. The currency word is set separately.
- Motion only in response to a tap. Nothing that carries a button ever moves.
- No Monions, no Tabby Sans, no invented stat, capability or approval.
- Every decision made without Salman goes into NOTES.md.

## Verification summary

- `npm run typecheck`, `npm test` (engine) and `npm run build` (static export) all pass.
- The theme-reset probe shows `bg-blue-500`, `p-7` and `text-[#333]` emit no CSS.
- The grep for physical-direction utilities and hex outside tokens is clean.
- In the browser, at default rules: furniture reads "Over cap". At cap 2,300 it reads "Splits". Electronics never splits without a tap.
- The language toggle flips `lang/dir` and every string.
- `out/` runs with the network off.

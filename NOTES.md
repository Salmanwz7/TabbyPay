# NOTES — decisions made without Salman

Spec §0: "Keep NOTES.md of every decision made without Salman." Each entry is
one decision, why, and where it lives. Conflicts between the spec and the brand
files are flagged here, not silently resolved.

## Decided with Salman (23 Sep, before build)

- Stop at every review gate (hero, Act 1, Act 2, Act 3, Close).
- Run both evidence scrapes first (§13.1 Run A + Run B).
- Screen 6 fee: an illustrative figure, labelled on screen as prototype pricing, not Tabby's.
- Tailwind v4, configured in CSS `@theme`, not a `tailwind.config` file.

## Foundation (Phase 0)

**D1 — Motion tokens added to tokens.css.** The provided `tokens.css` has no
motion values, but DESIGN-SYSTEM.md §2 does (`--t-micro` 120ms, `--t-standard`
240ms, `--t-reveal` 900ms, two eases). Copied verbatim into an "Additions" block
at the end of `app/tokens.css`. Everything above that block is the provided file,
untouched.

**D2 — CONFLICT: arbitrary type sizes.** The spec (§0.1) bans arbitrary values.
DESIGN-SYSTEM.md §5 says "no rigid type scale … `text-[30px] sm:text-[42px]`".
Resolved by naming the sizes submissions 1 and 2 actually shipped (12, 13, 14,
16, 17, 20, 24, 32, 40, 48, 64px) as `--fs-*` tokens. The visuals are the brand
file's; the mechanism is the spec's. Three sizes in the copied component CSS
had no step (15px, 12.5px, 11px) and moved to the nearest one (16, 13, 12).

**D3 — Control and leading tokens.** `--tap` 44px and `--btn-h` 52px (from
DESIGN-SYSTEM §9/§10), and `--lh-tight/snug/body` (from §5), added to the same
Additions block so no class needs a literal.

**D4 — Tailwind v4 instead of `tailwind.config`.** Agreed with Salman. The
spec's intent ("replace, don't extend") is met by `@theme { --*: initial; }` in
`app/globals.css`, which drops the whole default theme. Verified: a probe file
using `bg-blue-500 p-7 mt-4 rounded-lg text-sm` emitted none of them.

**D5 — Arbitrary values are enforced by a script, not the compiler.** Tailwind
v4 cannot disable arbitrary values: `text-[#333]` still compiles after the
theme reset. `scripts/check-tokens.mjs` fails on arbitrary values, physical
direction utilities and hex outside `tokens.css`, and runs before every
`npm run build`. Tailwind's variable shorthand that names a token,
e.g. `duration-(--t-micro)`, is allowed: it references a token rather than
inventing a value.

**D6 — Breakpoints are literals.** `--breakpoint-sm/md/lg` (40/48/64rem) are the
only literal values in `@theme`, because media queries cannot read `var()`.
They are Tailwind's standard values, same as submissions 1 and 2.

**D7 — Fonts via next/font/local.** Readex Pro, the same substitute as
submissions 1 and 2, in two script subsets, each with `unicode-range`, chained
as `var(--font-ar), var(--font-latin)`. Self-hosted, no external request, works
offline. Tabby Sans is not in the repo or the bundle.

**D8 — The static HTML is Arabic.** The skip link, masthead and footer render
Arabic at build time; the toggle rewrites `<html lang dir>` on the client.
The language choice is remembered in localStorage (try/catch), so an English
visitor returning sees one Arabic frame before switching. Same as submission 1.

## Evidence (Phase 1)

**E1 — The review numbers are small, and the page will say so.** Run A: 5 of
30,250 UAE reviews are about not knowing what a card purchase would become.
Run B: 2 of 3,217 Saudi reviews ask for a Tabby card. Act 1.3 will quote the
five UAE verbatims with their n and not present the counts as a big number.
Run B is not used as "Saudis want the card" (see EVIDENCE.md). **Salman to
confirm at the Act 1 gate.**

**E2 — CORRECTION: "15% credit card penetration" (§2.2) is not used.** It
traces to pre-2014 research. World Bank 2021: 25.4% of adults. Tabby's Saudi
GM in 2022: "around 0.3 credit cards per person". If the page needs the point,
it quotes Tabby's GM, with source.

**E3 — Tweeq.** Tabby owns Tweeq (SAMA-licensed wallet with cards, independent
entity, acquired Sep 2024). "No Tabby Card in Saudi" still holds. Flagged
because a judge could raise it; nothing on the page claims otherwise.

**E4 — App Store feed empty for the UAE.** Run A is Google Play only. Stated
in the sample line on the page.

**E5 — Trustpilot wording to re-check.** Quotes came through a summarising
reader. The 2 Jul 2025 "manually split" review is confirmed to exist; exact
wording must be checked on the live page before it is quoted.

## Engine (Phase 2)

**P1 — SPEC GAP: purchases under the threshold.** §7 has no branch for a
purchase under Rule 1 (the pharmacy's SAR 85 under a SAR 300 rule). Added
`BELOW_THRESHOLD` → STATEMENT → RECEIPT, offering "split it yourself", the
same shape as OVER_CAP.

**P2 — "Over SAR 300" includes 300.** A purchase exactly at the threshold
splits. Read as "SAR 300 and up", because "over" in the UI sentence is a
shorthand and a customer who sets 450 would expect a 450 purchase to split.

**P3 — The cap counts fee-free splits only.** Rule 2 is about auto-split
(Pay in 4). A fee plan is a separate, explicit yes and does not fill the cap.
Landing exactly on the cap is allowed; passing it is not. A refunded or
un-split purchase frees its share of the cap.

**P4 — Check order is the product.** Eligible? → has a cost? → under the
threshold? → over the cap? → split. The cost check sits before every rule,
so no slider position can auto-apply a fee plan (tested across the full
20 × 46 slider grid).

**P5 — A fee plan is offered only at SAR 2,000 and up.** That is the real
floor of Tabby's Saudi longer plans (licence, 29 Jun 2026). So furniture
(1,400) has no fee option and electronics (3,200) does. Fact, not mock.

**P6 — Mock purchase for Screen 7.** A SAR 620 salon purchase flagged not
eligible (the salon is from Reem's persona, §3.4). It is not one of the hero's
four; the hero uses exactly the spec's four.

**P7 — Illustrative fee: SAR 160 on SAR 3,200 (5%), total 3,360, 6 × 560.**
Round and labelled on screen as prototype pricing, as agreed. Not an estimate.

**P8 — Payment dates are monthly from the tap date** (23 Sep, 23 Oct, 23 Nov,
23 Dec), as in the spec's Screen 4. Amounts are computed in halalas; any
remainder goes on the first payment.

**P9 — Statement close is 30 Sep (mock).** "Change until your statement"
therefore means until 30 Sep in the prototype.

## Hero (Phase 3)

**H1 — The hero compares, it doesn't accumulate.** Every purchase is evaluated
against the same SAR 840 month-to-date, so furniture can be compared across
cap settings. Cumulative spending lives in the phone prototype (Act 2), where
the ledger is real.

**H2 — Text components are client components.** The spec says "keep
everything else server-rendered", but every visible string follows the
language toggle, which lives in client context. So text sections are
`'use client'`; they are still prerendered into the static HTML (in Arabic),
so the first paint needs no JS. Same as submissions 1 and 2.

**H3 — Slider ranges.** Threshold SAR 50–1,000 (step 50), so the pharmacy
purchase can be made to split at the bottom of the range. Cap SAR 500–5,000
(step 100), so furniture flips at 2,300 and Jarir can be pushed over the cap
below 1,300.

**H4 — Colour on the outcome words.** Green dot only on "Splits" (green means
"a plan you know"); gold tag only on "Asks you" (the consent lane); the rest
plain. Two secondaries maximum is kept: gold here, coral reserved.

**H5 — The receipt settles (240ms) only when the answer changes** (selected
purchase or its outcome), not on every slider tick. Reduced motion: none.

**H6 — Hero on phones: the answer is pinned under the purchases.** Below `lg`
the receipt sits under the fold, so a tap showed nothing on screen. A one-line
result (merchant · outcome word · 4 × amount) now sits under the tiles below
`lg`. aria-hidden: the receipt stays the one live region. Recommended at the
hero gate; Salman replied "ok continue" (26 Sep 2026), read as approval of the
three gate recommendations (pin, headline wording, BELOW_THRESHOLD).

## Act 1 (Phase 4)

**A1 — Broken promise uses SAR 500 (the spec's 4 × 125), generic stores.**
"Online store" and "In a shop", no merchant names, so no claim about which
real merchants take Tabby. The terminal phone is labelled a simulation; no
wallet UI is drawn. "Pay" stands in for the tap.

**A2 — One persistent button per phone (Pay ↔ Again)**, so keyboard focus is
never dropped when the state flips.

**A3 — "Later" list arrives after --t-reveal (900ms)**, the beep first. Only
after the visitor's tap; reduced motion shows it at once.

**A4 — Caption avoids "left/right".** In Arabic the online phone is on the
right, so the spec's "The left side is Tabby's brand…" became "Online is
Tabby's brand. The terminal is a credit card."

**A5 — Evidence shown at its real size**: 5 of 30,250 (UAE) and 2 of 3,217
(Saudi), all five UAE verbatims, the non-card one tagged as such. Trustpilot
quotes are NOT on the page: they were read through a summariser and must be
re-checked on the live page first (E5). Translations are mine and labelled.

## Salman's direction, 26 Sep 2026 — the in-app card flow (for Act 2)

Salman: show the screens inside the Tabby app. Add a cards section; from there
the user issues the Tabby Card, sees its settings, and sets up the plan rules.

**Conflict to flag:** spec §6 cuts "Card application and onboarding". Proposed
resolution (awaiting Salman): no application form, no KYC. One entry point on
the Tabby home screen ("Card"), one "Get your card" screen, and setting the
rules is part of getting the card, so rule-setting happens at issuance (the
adoption metric in §8 becomes the default path). Close's "What I cut" keeps
KYC and the application itself.

## Tabby Pay reframe (26 Sep 2026)

**R1 — The reframe (Salman).** The audience is Tabby Saudi. The UAE has the
Tabby Card; Saudi doesn't. The submission is "مشاركة Tabby Pay" with two ideas:
(1) bring the card to Saudi, shown as the Saudi Tabby app gaining a new Card
tab and every screen up to an issued card, based on the UAE's own flow;
(2) Split Rules, ours. Decided with Salman: "Tabby Pay" names the submission,
the product inside the phone keeps its real name "Tabby Card" (no product
called Tabby Pay was found); Idea 1 then Idea 2; the card gets a new 5th tab.
The hero simulator moves into Idea 2. This supersedes spec §6's cut of "card
application and onboarding" for the app flow only; real KYC and the real
application stay cut.

**R2 — A phone in the hero.** Spec §11.2 keeps phones out of the hero on
their own. This one sits beside the title and the two ideas, is inert (the
working copy is in Idea 1), and is captioned as a simplified likeness.

**R3 — Brand conflict: radius.** DESIGN-SYSTEM caps radius at 8px. The real
Saudi app (Salman's screenshot) is much rounder. `--radius-app` (20px) and
`--radius-app-sm` (14px) apply inside the phone only; the page keeps 8px.

**R4 — Riyal symbol and card art.** Inside the phone, amounts will use the
official Saudi Riyal symbol (SAMA 2025; glyph paths from Wikimedia Commons),
as the app does. On the page, Money keeps the word. The card is drawn in CSS
(ink ground, Tabby mark, "Visa" as text, no network logo): illustrative art,
not Tabby's card design.

**R5 — Saudi-specific lines are tagged "Proposal".** Perks ("anywhere Visa
is accepted in Saudi", "no card fees"), the adapted eligibility list and the
banner are UAE facts transposed, labelled as proposals. The identity check
and the wallet are simulated and labelled; no ID provider is named and no
wallet UI is drawn.

**R6 — Source for the Idea 1 flow.** tabby.ai/en-AE/card, fetched 26 Sep
2026: "Download the Tabby app, Sign up for a Tabby account, Navigate to the
Money tab, Select Get your card, Complete setup and verify your identity."
Eligibility: 18+, UAE resident, valid national ID, a linked debit/credit
card, good credit history. Third-party guides mentioning delivery times and
"Request Card" buttons were not used.

**A6 — The broken-promise phones as real cases (Salman, 27 Sep 2026: "enhance
the ui and simulate the ui like its real case scenario").** Both phones are
the same UAE customer paying AED 500, so amounts are in dirhams (Money gained
a `currency` prop; riyal stays the default). Online: a store checkout in the
phone's browser, Tabby selected, four quarter-filled circles with amounts and
dates, "no fees", then "Pay with Tabby" → order placed with the plan they
already saw. In a shop: a generic card terminal (the tap happens there, so no
wallet UI is drawn), the phone's lock screen showing nothing about a plan,
then "Later" walks the manual path in the Tabby app: card activity → the
purchase → "Split this purchase?" with 4 / 6 / 8 / 10 months and "Free at
partner stores, or anywhere with Tabby Plus" (both from tabby.ai/en-AE/card).
The store URL is store.example (reserved, no real merchant).

**A7 — Riyals, the pay button in the page, a real terminal and a wallet sheet
(Salman, 27 Sep 2026: "why did u put dirham we are doing in saudi! Put riyal
icon … put the ادفع مع تابي inside the phone … simulate a real pos device and
when paying put the iphone screen like its using apple pay and inside it we
have the tabby card to pay").**
- Both phones now show riyals with the symbol (the whole comparison sits in
  `InAppContext`). The note under them now reads "the Tabby Card as it works
  in the UAE today, if it came to Saudi unchanged". The dirham option was
  removed from Money, PlanSchedule and copy.
- "Pay with Tabby" is inside the checkout page, pinned to the bottom. "Back to
  the store" resets it. Focus moves to the new heading.
- The terminal is a handheld POS: printer slot, blue screen, white keys and a
  function column (red, yellow, green), following a reference image Salman
  sent. The image itself is not used, at his request. After approval a
  receipt prints out of the slot (`.print`, clip-path, --t-reveal).
- **This overrides the spec's "never draw a fake Apple Wallet screen", on
  Salman's instruction.** Mitigation: a generic dark wallet sheet with the
  Tabby Card, "Hold near reader" and "Done". No Apple logo, wordmark or
  Face ID glyph. The note under the phones says it carries no Apple marks.
- New flow: lock screen → double-click → wallet → hold near → Done + receipt
  + "Not a word about your plan" → app → purchase → pick a plan.

## Idea 2 · the Split Rules prototype (Gate B)

**B1 — Inside the Tabby app's Card tab.** The prototype runs in the same app
shell as Idea 1 (the card is already issued there). All eight §5.3 screens and
the five §5.4 edge cases are driven by `lib/machine.ts`; the list beside the
phone opens each one, and every scenario is built by replaying real events
(`openScenario`, tested in `lib/scenarios.test.ts`, RED 6 then GREEN 39/39).

**B2 — Screen 3 is the terminal, not a wallet.** "Tap phone" happens on a
drawn generic terminal inside the phone view, labelled a simulation. The
receipt follows 1.4 s after the tap (rules decide at authorisation; the phone
hears a moment later). The 1.4 s is a prototype pause, not a Tabby timing.

**B3 — The one orchestrated animation** is the receipt's line-by-line resolve
(`.resolve`, row i delayed i × --t-micro, ≤ 840 ms for six rows). It runs only
for a receipt that has just arrived after a tap or a choice, never when a
scenario is opened from the list. Reduced motion: final state at once.

**B4 — "Simulate a refund"** is a quiet button on split receipts, so the
refund edge case can be reached by hand as well as from the list.

**B5 — Screen 8 sums.** "Due today" is the first payment of each live plan;
"On your statement" is the total of statement entries. The cap bar counts
every live Pay-in-4 split, including ones the customer chose (P3), so the
this-month scenario sits over the cap (4,490 of 2,000) on purpose: a manual
split is the customer's own yes, and the cap only governs the automatic lane.
Flag for Salman: if a manual split shouldn't count toward the cap, it's a
one-line change in `capUsed`.

**B6 — The riyal symbol inside the app.** Money reads an `InAppContext` set by
the app shell: inside the phone, riyal amounts show the official symbol
before the figure ("⃁ 450") in both languages, as the Saudi app does; outside
the phone, the word stays. Positions verified in the DOM (symbol left of the
figure, back chevron at the start and mirrored in RTL).

**B7 — Heading levels.** Section h2 → phone screen h3 → in-screen groups h4.
The rules simulator keeps its own h2s from when it was the hero; to revisit
in the finish pass.

## Who benefits · why now · close (Gate C)

**C1 — Who benefits is a tablist, not a radiogroup.** Three views of one
card, one visible at a time: tabs, with one tab stop, arrows in the reading
direction, and Home/End. The copy is spec §1, adapted to two ideas. "Fewer
support contacts" is worded as my expectation ("I'd expect"), because
Tabby holds the number and I don't.

**C2 — Why now uses only verified rows from EVIDENCE.md.** 2022 GM statement,
Jun 2026 licence, Sep 2026 raise, U.S. Bank 2021 → Nov 2025, each with its
source line under it. The Arabic doesn't transliterate the GM's name (I
couldn't verify the spelling), so it names the role; the English quotes him
verbatim. The 15% penetration figure stays off (E2).

**C3 — Responsible lending as a Statement.** Spec §8 argument 3, worded as
"a design Tabby can put in front of SAMA", with no claim of approval.

**C4 — Close.** The cuts are spec §6 minus "card application and
onboarding", which Salman's reframe brought back in as Idea 1. The limits
cover: not SAMA-approved, mocked data, the illustrative fee (P7),
UAE-sourced evidence (2 of 3,217 Saudi), Idea 1 adapted from the UAE page,
the wallet and terminal drawn with no Apple marks, Tweeq (E3), and the
substitute typeface. The Evidence line "the Saudi case is in Act 3" now
points to "Why now".

**C5 — BUG FIX: Latin text was rendering in Arial.** next/font generated a
metric-matched fallback for the Arabic face covering U+0–10FFFF. Second in
the chain, it caught every Latin letter and digit before Readex Latin.
Fixed with `adjustFontFallback: false` on the Arabic face; verified with
`document.fonts` (readexLatin now loads) in both languages.

**C6 — Bidi: Latin names before digits are isolated.** «بيان U.S. Bank، 5
نوفمبر» put the 5 inside the Latin run (UBA W7). FSI/PDI around the name,
as in the footer.

## Finish pass (28 Sep 2026)

Salman: "do the best and finish and then i will inspect at the end". The
calls below were mine; each is easy to reverse.

**F1 — B5 decided: a manual split counts toward the cap.** Kept as built. The
cap is the customer's honest measure of what they owe in Pay in 4; a split
they choose by hand is still owed. They can still go past it by choosing
to (it's their yes), and the rules just stop doing it for them.

**F2 — The space reserved above the terminal stays.** Without it the whole
row jumps down when the receipt prints; a layout jump is worse than 96px of
calm space.

**F3 — B7 fixed.** The rules simulator had h2s left from when it was the
hero, so "Your rules" and "Your plan receipt" read as peers of the page's
sections. It now has its own section h2 ("Try it yourself…"), with its
inner headings at h3/h4. Outline has no skips (measured).

**F4 — Removed one thing: "Auto-applying fee-bearing plans" from What I cut.**
The fee-consent point was made three times (the locked rule, the lending
line, the cut). The spec itself calls it "not a limitation", so it wasn't
a cut. The cut grid goes to three columns on desktop.

**F5 — Audit, measured in headless Chrome** at 375px and 1440px, both
languages, before and after pressing all 55 controls with real pointer
events: no horizontal overflow, no text under AA contrast, no heading
skips, no console errors or exceptions, every target at least 44px (bar
the skip link, hidden until focused). Bidi by paint position (§7): clean,
apart from Latin multi-word names ("OK Hypermarket", "U.S. Bank"), which
read left to right as they should.

**F6 — BUG FIX: Idea 1's source line read "26" before the URL in Arabic.**
«(tabby.ai/en-AE/card، 26 سبتمبر 2026)»: the 26 joined the URL's LTR run
(UBA W7), the same bug as C6. FSI/PDI around the URL. The audit missed it
at first (the "(" widened the token's box, and URL + number looked like one
LTR group); it now trims brackets and treats a token ending in "،" as the
end of a group, and flags the old build, clean on the new one. A scan of
every Arabic string (copy, evidence, mock data) found no other Latin run
followed by a digit.

**F7 — Offline: out/ now works from a server and from file://.** Next writes
absolute "/_next/" paths, so over file:// the page loaded with no CSS or JS.
`scripts/relativize.mjs` runs after `next build` and rewrites them relative
(HTML incl. the inline flight data, the webpack public path, CSS font
url()s). Verified: `node scripts/serve.mjs` (port 4173) and out/index.html
opened directly, both languages, 375 and 1440 px, all 55 controls pressed:
no errors, no failed loads, no request leaves the machine, both Readex faces
load, and the language toggle works (JS hydrates).

## Salman's 15 fixes (29 Sep 2026)

**G1 — Clarity rewrite.** Header "Tabby Pay" (no "مشاركة"); hero kicker gone;
hero setup, the three answers, Idea 1's statement and setup, Idea 2's
statement and setup, the evidence lead and the Split Rules lead rewritten so
each says one thing plainly. The answers are now labelled lines ("في
السعودية: …", "العميل: …") instead of one paragraph. The GM's 2022 line left
Idea 1 (it lives in "Why now").

**G2 — The comparison is now "today vs with your rules".** Salman: the Tabby
Card sits in Apple Pay, online payment is Apple Pay with the Tabby Card, and
afterwards the app applies Split Rules. So: row 1 is the UAE today at a
terminal (manual split after); row 2 is online with Apple Pay, then Tabby's
notification, then the plan receipt the rule made (tagged "Proposal").
Today-first so the page reads problem → answer. The old "Tabby at online
checkout" phone and the "Online is Tabby's brand" caption are gone.
Verified: Apple Pay payments with the Tabby Card need no in-app approval
(EVIDENCE, 29 Sep), so the sheet is the whole payment.

**G3 — Plans are months, and pressable.** The UAE page says "4, 6, 8 or 10
months", so all four read "أشهر". A native radio group; pressing one shows
the monthly amount (`lib/card-plans.ts`, TDD, 6 tests: the leftover halalas
go in the first month, every plan adds back to the purchase). No dates (not
published) and no fee figure (not published): the screen says free at
partners or with Plus, otherwise a fee Tabby doesn't publish.

**G4 — How the card is paid for.** Pay-later, not prepaid (EVIDENCE, 29 Sep).
Said in Idea 1's setup ("ما تشحنها مثل بطاقات المحافظ…") and in the card's
perks (pay now, settle once a month; split over 4–10 months).

**G5 — Idea 1's phone says it works.** A green note above the phone
("الجوال يشتغل. اضغط الإعلان الأخضر أو تبويب «البطاقة»…"), where it's seen
before the phone on every width.

**G6 — Line endings.** A `git stash pop` left lib/copy.ts CRLF; normalised
back to LF (the repo's form). No content change.

**G7 — Not changed:** the browser tab title still reads "مشاركة Tabby Pay ·
تابي إماجن 2026" (Salman asked about the header only).

**H1 — Tried and reverted (29 Sep 2026).** A three-step demo replaced the
8-screen prototype and the simulator (commit 54d5c86). Salman: "its so bad,
now i have to analyze to understand the idea, the previous was better."
Reverted in full (git revert). Lesson: he reads the idea through the
screens of the real app flow; don't collapse them into an abstract widget.

**H2 — Removed at Salman's request (29 Sep 2026):** the responsible-lending
statement («حد تحطه أنت…»), the «الختام» label, «وش شلت، وليش» and «وش أختبر
أول داخل تابي». Kept «الطريقة والحدود»: it carries the not-SAMA-approved line
the spec requires. Spec §12's Close is now method and limitations only.

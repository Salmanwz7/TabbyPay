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

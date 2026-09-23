 # Tabby Split Rules
### Know your plan before the terminal beeps.

**Submission 3 of 3 — Tabby Imagine Product Design Challenge 2026**
Working name was *Auto-Split*. Renamed on purpose — see §4.
Version 1.0 · 7 days to deadline · Applications close 30 Sep · Finals 15 Oct, Riyadh

---

## 0. Context — read this first

**Who:** Salman Zamzami, competing in Tabby Imagine, Tabby's product design challenge. Three winners each receive a paid six-month full-time internship at Tabby. Finals are 15 October in Riyadh, 1–5pm, presented live, and that session replaces the interview. Individual entry. Up to three submissions, each read independently. **This is submission 3 and it matters as much as the other two.**

**Already built and live:**
- Submission 1 — Tabby Ahead — https://tabby-ahead.vercel.app
  Pre-approval before you shop, for the SAR 50,000 / 12-month product.
- Submission 2 — Tabby Capital — https://tabby-capital.vercel.app
  Working capital for merchants, repaid from daily Tabby settlements.

**Assets that carry over from those builds:**
- `tokens.css` — Tabby's real palette, extracted from their site. Tabby Green is `#6CFF93`.
- `tabby-brand.md` — full brand extraction: voice, type, motion, restrictions
- `scrape_reviews.js` and `tag_reviews.js` — the review scraper and tagger. Reusable for this submission with a country switch (§13.1).
- A proven design system: spacing scale, section rhythm, three-act structure, interaction rules, banned-patterns list.

**Working rules for the coding agent:**
- Read this whole file before writing anything. Then write `PLAN.md`.
- Stack: **Next.js (App Router) + TypeScript + Tailwind CSS only.** No component libraries, no animation libraries, no UI kits. See §0.1 for how Tailwind must be wired to the brand tokens.
- One section at a time. Show Salman each one before the next.
- Never invent a colour, a statistic, a Tabby capability, an Apple Pay capability, or a regulatory approval.
- Keep `NOTES.md` of every decision made without Salman.
- Footer on every page: `© 2026 Salman Zamzami` + a LinkedIn icon (inline SVG) linking to https://www.linkedin.com/in/salman-zamzami-2b3775260/ — same spec as the other two sites.

**Files provided with this spec:** `DESIGN-system.md`, `tabby-brand.md`, `tokens.css`. If this spec and those files conflict on anything visual, the brand files win. Flag the conflict in `NOTES.md` rather than silently picking.

### 0.1 Stack rules — Next.js + Tailwind

The risk with Tailwind is that its defaults produce the generic look Tabby's brand explicitly rejects. These rules exist to prevent that.

**Tokens are the only source of design values.**
- Import `tokens.css` in the root layout.
- In `tailwind.config`, map every colour, spacing step, radius, and font to the CSS custom properties — e.g. `colors: { green: 'var(--tabby-green)', ink: 'var(--ink)' }`. Use the actual variable names from `tokens.css`.
- **Replace** Tailwind's default palette and spacing scale; don't `extend` them. If `bg-blue-500` or `p-7` still compiles, the config is wrong.
- No arbitrary values (`text-[#333]`, `mt-[13px]`) anywhere. If a value isn't in the tokens, it doesn't go in the page.

**Structure.**
- One page (`app/page.tsx`) with the three acts as section components.
- The phone prototype is a self-contained component with its own state.
- The state machine in §7 is a `useReducer` with typed states and events. All data mocked in a single `mock-data.ts`, clearly labelled as prototype data.
- Mark interactive components `'use client'`; keep everything else server-rendered.

**Motion.**
- CSS transitions and keyframes only. No Framer Motion or any other library.
- Every animation has a `motion-reduce:` fallback.
- Motion only in response to user action. No scroll-triggered entrances.

**RTL and fonts.**
- `<html lang="ar" dir="rtl">` by default, with the language toggle switching both.
- Use Tailwind's logical utilities (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`) everywhere. No `ml-`, `mr-`, `left-`, `right-`.
- Load the substitute typeface through `next/font` — self-hosted, no external request.
- `tabular-nums` on every currency figure.

**Presentation safety.**
- The site must also build to a fully static export (`output: 'export'`), so it runs from a local folder with no server and no internet. The live final on 15 October cannot depend on venue wifi or Vercel.

---

## 1. The three answers

Tabby's brief asks exactly three questions. Here are the answers in one breath each. Everything else in this document supports them.

### وش الخلل اليوم — What's broken today

Tabby's whole promise at checkout is simple: you see exactly what you'll pay, and when, **before** you commit. Four payments of SAR 125. First one today. Confirm.

The Tabby Card breaks that promise. You tap, the terminal beeps, and you have no idea what you just agreed to. The decision about how to pay happens *later* — in the app, on your statement, or never, if you forget. The card quietly turned Tabby from "know exactly" into "find out later," which is precisely how a credit card works — the thing Tabby was built to replace.

And the rules around splitting have been changing under customers' feet. Reviews complain that splitting now has to be done by hand, or that what used to split automatically now doesn't. Customers are confused about what their card will do before they use it.

In Saudi Arabia the card doesn't exist yet. Tabby has said it wants to bring it here since 2022. When it arrives, it will inherit this problem — unless it's designed differently from day one.

### وش بتغيّر — What changes

**You set your rules once. Every tap then shows you your plan in seconds.**

- Fee-free plans apply automatically, within a monthly cap *you* set.
- Anything that carries a cost never applies itself. It asks you, with one tap, with the full amount shown.
- Every purchase produces an instant plan receipt: amount, split, dates.
- You can change any purchase's plan until your statement closes.

The terminal still just beeps. The difference is that your phone tells you what the beep meant before you've put it back in your pocket.

### مين يفيد — Who benefits

**The customer** — the Saudi shopper with no credit card who wants predictability, not a surprise bill. They know what every tap costs, and the cap means they decide how much they can owe, not an algorithm.

**Tabby** — a card that launches in Saudi with a clear promise instead of a confusing one; fewer "why wasn't this split?" support contacts; a responsible-lending design it can put in front of SAMA; and a card whose behaviour matches Tabby's brand.

**Merchants** — every Visa-accepting shop in the Kingdom becomes a place where a Tabby customer can split, with no integration work, no QR, no checkout change.

---

## 2. The system you're designing inside

### 2.1 What the Tabby Card is today (UAE)

- A digital and physical Visa card, UAE residents only, usable only in the UAE.
- Added to Apple Pay, Samsung Pay, or Google Pay; tap at any terminal.
- Statement-based: up to 40 days to pay, with the positioning "your statement, your call."
- Customers choose **after purchase** which purchases to split, over 4, 6, 8, or 10 months. (The app store listing says "up to 8 months" — sources disagree; verify before quoting a number.)
- Pay in 4 is fee-free at partner stores, or anywhere with a **Tabby Plus** subscription.
- Every transaction is approved individually; a past approval doesn't guarantee the next one.
- In the UAE, late fees apply to the card and the card pauses until the overdue balance clears.

### 2.2 What Saudi has today

- No Tabby Card. No Tabby Plus. No Tabby Cash.
- Pay in 4, pay next month, and — since the July 2026 consumer finance licence — plans up to 12 months on SAR 2,000–50,000 purchases.
- **No late fees**, for Shariah compliance. Longer plans run on a Murabaha structure with costs agreed upfront.
- 15% credit card penetration. For most Saudi customers, Tabby is the only credit they have.

### 2.3 Why now

- Tabby raised $233M at a $6.5B valuation in September 2026, explicitly to expand beyond BNPL into broader financial services in Saudi Arabia and the UAE.
- Tabby's own Saudi GM said in 2022 that the virtual card would come to Saudi after its UAE success. Four years on, it hasn't. When it does, this is the moment to decide what it behaves like.
- The industry is moving from manual to automatic. U.S. Bank launched ExtendPay in 2021, letting cardholders move purchases into plans by hand. In November 2025 it launched Split Card, which splits every purchase automatically into a three-month plan, with optional longer plans for larger purchases. Tabby is at the manual stage today.

### 2.4 The constraints you cannot design around

**Consent for cost.** In Saudi, anything longer than fee-free Pay in 4 runs as Murabaha — a financing agreement with an agreed cost. You cannot silently enter someone into one. **This is why fee-bearing plans never auto-apply in this design.** That rule isn't timidity; it's what makes the product legal.

**Per-transaction eligibility.** A rule is a preference, not a promise. Every purchase is checked on its own. The UI must never imply otherwise.

**Payment rails.** A card terminal cannot wait while the customer picks a plan in an app. The plan decision must be made from pre-set rules at authorisation, with confirmation *after* the tap. The prototype must not pretend Apple Wallet shows a custom Tabby screen — it doesn't, and a Tabby engineer will know.

**Regulation.** A new product feature in Saudi likely needs SAMA non-objection. The prototype is a product concept, not a claim that this is approved or deployable. Say so in the submission.

---

## 3. The problem, in detail

### 3.1 The broken promise

Put two experiences side by side. This comparison is the core visual of the submission.

```
TABBY AT ONLINE CHECKOUT              TABBY CARD AT A TERMINAL
────────────────────────              ────────────────────────
See: 4 × SAR 125                      Tap.
See: dates                            Beep.
See: fees (none)                      ...
Confirm                               Later: open app
                                      Later: find purchase
Done. You know everything.            Later: decide whether to split
                                      Later: pick a plan
                                      Or forget, and pay in full
```

The left side is Tabby's brand. The right side is a credit card.

### 3.2 What customers are saying

From public reviews (paraphrased — the scrape in §13.1 will give you verbatims with dates):

- A UAE customer describes card purchases that used to split into four automatically no longer doing so, calls it confusing, and says everyone in their friend circle has the same problem. Tabby's reply frames it as an intentional change.
- A one-star Trustpilot review warns that under a new policy, users must now split card purchases manually.
- A five-star reviewer suggests exactly this product unprompted: a Tabby card where purchases convert automatically into instalment plans.

Three different people, three angles, one problem: **customers don't know what their card will do until after they've used it.**

`[FILL]` — the numbers from §13.1. How many UAE reviews mention split, card, manual, statement, or Plus confusion? How many Saudi reviews ask for a card?

### 3.3 Why Tabby probably went manual — and why that matters

Don't pitch against a decision without understanding it. Tabby likely moved to manual splitting for good reasons:

- **Consent.** Longer plans carry fees. Auto-applying them would enter people into costs they didn't choose.
- **Monetisation.** Pay in 4 anywhere became a Tabby Plus benefit. Splitting is now partly a paid feature.
- **Risk.** Auto-splitting everything makes it easy to accumulate debt without noticing.

**This design keeps every one of those reasons intact.** Fee-bearing plans still require explicit consent. The auto lane can sit inside Plus where Plus exists. The cap addresses risk more directly than the manual model does. Say this in the room. It shows you respected their decision instead of ignoring it.

### 3.4 Who this is for

**Primary — Reem, 26, Jeddah.** Works in marketing, SAR 9,000/month, no credit card, uses Tabby weekly online. When the card reaches Saudi she'll use it at Jarir, at the pharmacy, at the salon. She wants the flexibility and she's terrified of a statement she didn't see coming.

**Secondary — the merchant** who doesn't integrate Tabby today and never will.

**Tertiary — Tabby**, launching a card into its largest market.

---

## 4. The insight

> Tabby at checkout means you know exactly what you'll pay before you commit.
> Tabby Card means you find out afterwards.
>
> Split Rules puts "know exactly" back — without making the terminal wait.

**Why the rename:** *Auto-Split* sounds like "debt that happens to you." The first question a judge would ask is whether it makes borrowing invisible. *Split Rules* says the opposite: **you** set the rules, money follows them. That's also Tabby's new brand platform, *Show money who's boss*, almost word for word. The Arabic label is **قواعدك**.

---

## 5. The product

### 5.1 Flow

```
   SET                   TAP                  SEE                 ADJUST
   ───                   ───                  ───                 ──────
   Your rules,     →     Pay normally,   →    Plan receipt   →    Change it until
   once                  anywhere             in seconds          your statement
```

### 5.2 The rules

Three rules, no more. More than three and it becomes a settings page nobody reads.

**Rule 1 — What splits automatically**
*"Split purchases over SAR [300] into 4 payments."*
Fee-free Pay in 4 only. One amount threshold, set by slider.

**Rule 2 — Your monthly cap**
*"Never auto-split more than SAR [2,000] a month."*
Above the cap, purchases don't split automatically — they go to the statement, and the receipt says so.

**Rule 3 — Anything with a cost**
*"Always ask me."*
Not configurable. Shown as a locked rule with a one-line explanation. Visible, not hidden, because it's a feature.

### 5.3 Screens

---

**Screen 1 — The card, with your rules on it**

The Tabby Card, and directly beneath it, the three rules as plain sentences — not toggles, not a settings list. The rules *are* the card's personality.

```
┌─────────────────────────────────────┐
│   [ Tabby Card ]                    │
│                                     │
│   Your rules                        │
│   ───────────                       │
│   Over SAR 300 → 4 payments         │
│   Up to SAR 2,000 a month           │
│   Anything with a fee → asks you    │
│                                     │
│   This month: SAR 840 of 2,000      │
│   ▓▓▓▓▓▓▓░░░░░░░░░░                  │
└─────────────────────────────────────┘
```

---

**Screen 2 — Setting the rules**

First-time setup. Two sliders and one locked line. As the threshold slider moves, a live example updates: *"A SAR 450 purchase at Jarir would become 4 × SAR 112.50."*

Copy for the locked rule: *"Plans with a fee always ask you first. That one's not a setting."*

---

**Screen 3 — The tap (simulated)**

A simulated terminal. The prototype must be honest here: show a generic "phone at terminal" moment, labelled as simulation. **Never** draw a fake Apple Wallet screen with Tabby content inside it.

---

**Screen 4 — The plan receipt (the magic moment)**

Arrives as a notification seconds after the tap, opens to:

```
┌─────────────────────────────────────┐
│   Jarir · SAR 450                   │
│                                     │
│   4 × SAR 112.50                    │
│   ─────────────                     │
│   Today      SAR 112.50             │
│   23 Oct     SAR 112.50             │
│   23 Nov     SAR 112.50             │
│   23 Dec     SAR 112.50             │
│                                     │
│   Split by your rule: over SAR 300  │
│   Change until your statement       │
│                                     │
│   [ Keep ]   [ Change plan ]        │
└─────────────────────────────────────┘
```

The line **"Split by your rule"** matters most. It tells the customer *why* this happened, and that they caused it.

This is the one orchestrated animation in the app flow. The schedule resolves line by line. Nothing else moves.

---

**Screen 5 — Over your cap**

Purchase: SAR 1,400. This month so far: SAR 1,200 of a 2,000 cap.

*"This one would take you past your SAR 2,000 cap, so it wasn't split automatically. It's on your statement. You can still split it yourself."*

Two buttons: **Split anyway** / **Leave it on my statement.** No judgement in the copy.

---

**Screen 6 — A plan with a cost**

Purchase: SAR 3,200 at an electronics store, eligible for 6 months with a fee.

*"You can split this over 6 months for a fee of SAR [X]. Total: SAR [Y]."* — the fee and total are the biggest numbers on screen.

**[Split over 6 months]** / **[Pay in 4 instead]** / **[Leave it on my statement]**

---

**Screen 7 — Not split: not eligible**

Clean and short. The purchase went through; it just isn't eligible to split. Never expose risk reasons. Say what the customer can do, not what the model decided.

---

**Screen 8 — This month**

Everything the card did this month, grouped: split by rule, split by you, on statement. Total owed, and when. The cap progress bar from Screen 1, bigger.

---

### 5.4 Edge cases

The earlier draft listed thirty. That's a QA plan, not a prototype. Build these five; list the rest in the submission as "designed for, not built."

| Build | Behaviour |
|---|---|
| Over the cap | Screen 5. Not split, told why, offered the choice. |
| Fee-bearing plan | Screen 6. Never auto. Cost is the headline. |
| Not eligible | Screen 7. Purchase succeeds; split doesn't. No risk reasons. |
| Refund after split | Remaining payments adjust; the receipt updates and says so. |
| Rule changed mid-month | New rule applies to future purchases only. Say so at the moment of change. |

**Designed for, not built:** partial refunds, disputes, declined transactions, frozen cards, card reissue, offline phone at tap, duplicate authorisations, reversals, overdue balances, account restrictions.

---

## 6. Scope

**In:**
- Eight screens
- Five edge cases
- The side-by-side "broken promise" comparison
- A working rules simulator (the hero)

**Cut, on purpose:**

| Cut | Why |
|---|---|
| Real Apple Pay, Visa, POS, KYC | It's a concept prototype. Everything is mocked and labelled mocked. |
| Auto-applying fee-bearing plans | Consent and Murabaha. It's the rule that makes the product legal, not a limitation. |
| More than three rules | Every extra rule makes the card harder to predict — which is the problem we're solving. |
| Category-based rules ("split groceries, not fuel") | Tempting, and a clear Phase 2. Adds complexity before the core is proven. |
| Card application and onboarding | Tabby already knows how to issue a card. The submission is about what the card does. |

---

## 7. State machine

A typed `useReducer`, all mocked. Must exist in code even though nothing is real.

```
IDLE
 → TAP
 → ELIGIBILITY_CHECK
     ├─ NOT_ELIGIBLE             → STATEMENT         → RECEIPT
     ├─ OVER_CAP                 → STATEMENT         → RECEIPT (offer split)
     ├─ FEE_PLAN_AVAILABLE       → ASK_CUSTOMER
     │                               ├─ ACCEPT       → PLAN_CREATED → RECEIPT
     │                               ├─ PAY_IN_4     → PLAN_CREATED → RECEIPT
     │                               └─ STATEMENT    → RECEIPT
     └─ MATCHES_RULE             → PLAN_CREATED      → RECEIPT
 RECEIPT
 → CHANGE_PLAN (until statement close) → PLAN_UPDATED → RECEIPT
```

Mock data: a user, a card, three rules, a month-to-date total, and a handful of preset purchases the visitor can trigger — Jarir SAR 450, pharmacy SAR 85, electronics SAR 3,200, furniture SAR 1,400.

---

## 8. The business case

Mark every assumption. Card economics in Saudi are not public — don't invent interchange rates.

```
Assumptions — all replaceable
─────────────────────────────────────────────
Saudi Tabby users offered the card, year 1   [FILL]
Share who activate                           [FILL]
Share who set rules                          [FILL]  — the adoption metric
Monthly card spend per active user           [FILL]
Share of spend split by rule                 [FILL]
```

Don't lead with revenue. Lead with three arguments:

**1. It's the card launch Tabby should want.** A Saudi card that arrives with a clear promise — *you'll always know what every tap costs* — instead of a statement you have to decode.

**2. It cuts support cost.** Every "why wasn't this split?" contact is a cost and a trust leak. `[FILL: count these in the UAE review scrape]`.

**3. It's the responsible-lending story Tabby needs for SAMA.** A customer-set cap and mandatory consent for fees is easier to defend to a regulator than either the auto-everything model or the forget-and-find-out model.

---

## 9. Objections, and your answers

**"This makes debt invisible."**
It does the opposite. Today a card purchase sits silently on a statement until you go looking. Under Split Rules every purchase produces an instant receipt showing exactly what you'll pay and when, and nothing with a cost happens without your tap. Plus a cap you set yourself.

**"We moved to manual splitting deliberately."**
And this keeps every reason for it: consent for fees, Plus as a paid benefit where it exists, and risk control. It just stops making the customer do the same decision by hand every time.

**"The card isn't in Saudi."**
Correct — and that's the point. Tabby has said since 2022 that it's coming, and it just raised $233M to expand financial services here. This is the moment to decide how it behaves, before a million customers learn the UAE version's habits.

**"This is just U.S. Bank Split Card."**
U.S. Bank's path — manual in 2021, automatic in 2025 — is evidence the model works, not a reason not to build it. The difference is the constraint: Tabby can't auto-apply costs, so this design separates the fee-free lane from the consent lane. That separation is the actual idea.

**"Why only three rules?"**
Because the problem is unpredictability. Every extra rule makes the card harder to predict.

**"How does the plan decision happen at the terminal?"**
It doesn't happen *at* the terminal. Rules are applied at authorisation; the customer's confirmation comes after, on their phone. The terminal never waits. `[FILL: confirm at a high level how card authorisation and later conversion work — don't invent specifics]`

---

## 10. Metrics

**Primary:** share of card purchases where the customer knew the plan within 60 seconds of tapping.

**Secondary:**
- Share of cardholders who set rules
- "Why wasn't this split?" support contacts per 1,000 card purchases
- Share of rule-split purchases the customer changed afterwards (too high means the rules are wrong)
- Fee-plan acceptance rate when asked

**Guardrail:** share of customers hitting their own cap three months running. If that climbs, the product is enabling overextension, and the default cap needs to come down.

---

## 11. Design

### 11.1 Reuse

tokens.css, type scale, spacing scale, motion rules, banned list — all unchanged. Tabby Green `#6CFF93`. Tabby Sans is unlicensed; use the same substitute as submissions 1 and 2. Monions are restricted and do not appear.

### 11.2 Specific to this submission

- **Rules are sentences, not switches.** "Over SAR 300 → 4 payments" reads faster than a toggle labelled "Auto-split threshold."
- **The fee is always the largest number on its screen.** If a cost exists, nothing is bigger.
- **The cap bar is the only progress bar in the product.** Don't add others.
- **Phone mockups are allowed here** — this is an app concept — but they sit inside the argument, never as the hero on their own.

### 11.3 Voice

| Don't | Do |
|---|---|
| "Auto-split is enabled." | "Over SAR 300 → 4 payments." |
| "Transaction ineligible for instalments." | "This one can't be split. It's on your statement." |
| "You have exceeded your limit." | "This would take you past your SAR 2,000 cap." |
| "Configure your preferences." | "Set your rules." |

---

## 12. The website

Same three acts, built on Tabby's three questions.

```
HERO
  The rules simulator, live. Two sliders (threshold, cap)
  and four purchase buttons: Jarir 450, pharmacy 85,
  furniture 1,400, electronics 3,200.
  Tap a purchase → the plan receipt appears instantly,
  with "Split by your rule" or the reason it wasn't.
  Move the sliders → the same purchases behave differently.
  The visitor learns the product by breaking it.

ACT 1 · وش الخلل اليوم
  1.1  Statement: "Online, Tabby tells you before.
       The card tells you after."
  1.2  INTERACTIVE — the broken promise. Two phones side
       by side. Visitor taps "Pay" on both. Left shows
       the schedule instantly. Right shows nothing — then
       a "later" timeline of the steps the customer has
       to do by hand.
  1.3  Evidence: the review numbers and verbatims (§13)

ACT 2 · وش بتغيّر
  2.1  Statement: the rename — "You set the rules."
  2.2  INTERACTIVE — the eight screens, clickable
  2.3  "The rule that can't be changed" — why fee plans
       always ask. Treated as a strength, not a caveat.

ACT 3 · مين يفيد
  3.1  Three-way selector: العميل · التاجر · تابي
  3.2  Why now: the four-year card promise, the $233M raise,
       the manual → automatic industry path
  3.3  The responsible-lending argument, as a statement

CLOSE
  What I cut
  What I'd test first
  Method and limitations
  Footer: © 2026 Salman Zamzami + LinkedIn
```

The hero is the most important thing on the page. A judge who moves the cap slider and watches the furniture purchase flip from "split" to "over your cap" understands the product in four seconds.

---

## 13. Evidence method — desk research only

### 13.1 Reuse the scraper — two runs

**Run A — UAE reviews (where the card exists).** Point `scrape_reviews.js` at the UAE App Store and Google Play (country `ae`). Include English and Arabic. Tag for: card, split / manual / automatic, statement, Plus, confused / didn't know. Report the count and the n.

**Run B — the existing Saudi corpus.** Re-tag the 3,217 Saudi reviews for card demand: بطاقة, كارت, في المحل, آبل باي. A count of Saudis asking for the card is evidence the Saudi launch matters.

State both samples honestly: country, date range, n.

### 13.2 Primary sources

Verify each against the live page and note the date and market:

- Tabby UAE card page and help centre — split options, statement model, Plus requirement
- Tabby UAE Pay in 4 / Plus pages
- Tabby Saudi help — declined purchases
- SAMA BNPL and consumer finance rules — instalment limits, non-objection for new products, consent and disclosure
- U.S. Bank Split Card announcement (Nov 2025) and ExtendPay (2021)

### 13.3 The limitation line

> *"Built on UAE card reviews, Tabby's own product documentation, and an international precedent. The card isn't live in Saudi, so this designs its launch rather than fixing an existing Saudi product. The first thing I'd test inside Tabby is whether customers set rules at all, and whether the cap they choose is lower than the limit Tabby gives them."*

---

## 14. The plan — 7 days

Today is 23 September. Submissions close on the 30th. This is tighter than submissions 1 and 2, and it's only possible because the design system already exists.

**Day 1 · Sept 23 — Evidence**
Both scraper runs. Verify the primary sources in §13.2. No design work.

**Day 2 · Sept 24 — Argument + screens**
Lock the three answers in §1. Grey-box all eight screens and the five edge cases.

**Day 3–4 · Sept 25–26 — Hero**
The rules simulator. BLOCKING — show Salman before continuing.

**Day 5 · Sept 27 — Act 1**
The broken-promise comparison and the evidence. BLOCKING.

**Day 6 · Sept 28 — Acts 2, 3, close**
One section at a time, reviewed.

**Day 7 · Sept 29 — Cut, mobile, submit**
375px pass. Remove one thing. Submit by evening — the 30th is buffer, not a work day.

---

## 15. Sources

- Tabby Card: UAE residents only, UAE use only; Pay in 4 anywhere with Tabby Plus; plans up to 8 months (app listing) — Google Play listing, September 2026
- Tabby Card: split over 4, 6, 8, or 10 months chosen in-app; statement model; Plus for Pay in 4 anywhere — tabby.ai/en-AE/card
- UAE card late fees and card pause — Kredit.ae
- Customer review on automatic-to-manual confusion, and Tabby's reply — App Store listing
- Review describing manual split under new policy — Trustpilot
- Review suggesting automatic instalment conversion on a Tabby card — Trustpilot, March 2026
- Tabby's plan to bring the virtual card to Saudi — Arab News, September 2022
- $233M raise at $6.5B to expand financial services in Saudi and UAE — September 2026
- Consumer finance licence, Murabaha, no late fees, SAR 2,000–50,000, up to 12 months — tbreak / FFNews, June–July 2026
- U.S. Bank Split Card, automatic three-month split, November 2025; ExtendPay 2021 — U.S. Bank press release

Verify each before citing it in the room.

---

## One last thing

Submission 1 said Tabby should meet the customer earlier.
Submission 2 said Tabby is sitting on the best SME credit data in the Kingdom.
This one says something smaller and sharper: **the card broke Tabby's own promise, and it can be fixed before it ever reaches Saudi.**

Build the hero first. Let the judge move the cap and watch a purchase change its mind.

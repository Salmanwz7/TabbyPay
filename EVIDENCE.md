# EVIDENCE — desk research for spec §13

Run 23 Sep 2026. Every number that goes on the page must be in this file.
Scripts and raw outputs are in `evidence/`. Keyword hits are candidates; every
count below that says "hand-audited" was read review by review.

---

## Run A — UAE reviews, where the card exists (§13.1)

| | |
|---|---|
| Source | Google Play, Tabby app (`app.tabby.client`), requested with `country=ae` |
| Languages | English + Arabic (two passes), text filtered by dominant script |
| Date range | 23 Sep 2025 – 22 Sep 2026 (12 months) |
| n | **30,250** (18,588 English · 11,662 Arabic) |
| App Store | **0.** Apple's public review feed returns no entries for the UAE listing (the app itself resolves; the feed is empty). Not a filter on our side. |

**Honest caveat on "UAE".** Google Play does not strictly restrict reviews by
country, so this is "Tabby reviews in English and Arabic, requested for the
UAE". Reviews about the *card* are UAE by nature: the card only exists there
(tabby.ai/en-AE/card: "Be a UAE resident").

### Counts

| Keyword candidates (`evidence/tag_card.js ae`) | n |
|---|---|
| Mentions a card (any sense, incl. own bank card) | 237 |
| Card + split / instalment words | 32 |
| Card + Plus | 7 |
| Card + statement | 4 |
| Card + confused / didn't know | 8 |
| Card + manual / automatic | 2 |

| Hand-audited | n |
|---|---|
| **Didn't know what a card purchase would turn into, or the split rule changed under them** | **5** |
| Wants the Tabby Card but hasn't been given it | 9 |
| Card blocked or limit cut with no explanation | 11 |

**Read this plainly:** the on-theme signal is real but small, 5 of 30,250
reviews (≈0.02%). It is strong in *kind*, not in *volume*. The page should
quote these five, give the n, and not dress the number up. Reviews are what
people bother to write in a store; the spec's own §8 metric ("why wasn't this
split?" support contacts) is the number that would size the problem, and only
Tabby has it.

### The five, verbatim (Google Play, UAE)

1. **1★ · 7 Aug 2026 · Arabic**
   "تجربة سيئة عبر الدفع بالبطاقة اجبرني ادفع ست دفعات مع اني كنت اريد اربع دفعات وفوقها رسوم كبيرة"
   *(Paying by card forced me into six payments when I wanted four, with big fees on top.)*
2. **1★ · 1 Aug 2026 · English**
   "I made a purchase yesterday at OK Hypermarket, which is a Tabby partner store. However, because I paid using my Tabby Card via my mobile wallet (Tap & Pay), the app is treating it as a non-partner transaction and asking me to activate Tabby Plus with a monthly fee to split the amount."
3. **1★ · 17 Jul 2026 · English**
   "why don't you show the real 4 month split in the app since I am a plus user like before? so we can plan in advance the payment"
4. **1★ · 13 Jul 2026 · Arabic** (split unpredictability, not card-specific)
   "احيانا يتم تقسيم المشتريات واحيانا يطلب الدفع كاملا وعندما تتواصل مع خدمة العملاء لاتعرف السبب وراء ذلك الامر لانهم يقولون ان العملية تتم الياً دون توضيح"
   *(Sometimes purchases are split, sometimes it asks for full payment. Support can't tell you why; they say it happens automatically, with no explanation.)*
5. **2★ · 18 Oct 2025 · English**
   "The free "split in 4" option is now limited to Tabby Plus subscribers, and my card keeps getting blocked without clear reasons."

---

## Run B — the Saudi corpus, card demand (§13.1)

| | |
|---|---|
| Source | Submission 1's corpus: App Store + Google Play, Saudi, Arabic |
| Date range | 29 Apr 2026 – 12 Sep 2026 |
| n | **3,217** (matches the spec) |

| Keyword candidates (`evidence/tag_card.js sa`) | n |
|---|---|
| Mentions a card (بطاقة, كارت, كرت, فيزا) | 19 |
| Mentions paying in store | 7 |
| Mentions Apple Pay | 0 |
| Card/in-store word + a wish word | 12 |

| Hand-audited | n |
|---|---|
| **Asks for a Tabby card** | **2** |
| Asks for a physical card for ATM cash (not this product) | 1 |

The two:
- **5★ · 4 Jul 2026** — "ممتاز ولكنى اريد بطاقه تابى" *(Excellent, but I want a Tabby card.)*
- **5★ · 27 Jun 2026** — "ممتاز لكن بطاقة تابي" *(Excellent, but — the Tabby card.)* Read as a request; one could argue it.

**Read this plainly:** Saudi reviews do not show demand for the card, 2 of
3,217. Most "بطاقة" hits are the customer's own bank card. Several Tabby-card
reviews in the Saudi corpus quote limits in **dirhams**: UAE card users
reviewing on the Saudi listing. **Do not use Run B as "Saudis are asking for
the card."** The Saudi case rests on Tabby's own stated plan (Arab News, 2022)
and the funding (Sep 2026), not on review demand.

---

## Trustpilot (spec §3.2, §15) — checked 23 Sep 2026

Fetched through a summarising reader, so the wording must be re-checked on the
live page before it is quoted in the room.

- **1★ · 2 Jul 2025 · AE** — "users must now manually split the payment using the app—otherwise, the full amount is charged upfront" ✔ confirms the spec's "new policy" review.
- **1★ · 18 Feb 2025 · AE** — "I had to open the app, something I don't usually do… I had to click on the 4-split payment option"
- The spec's 5★ "Tabby card where purchases convert automatically" (Mar 2026) was **not found** on the pages fetched. Not used until found.
- The spec's App Store review with Tabby's reply was **not reachable** (the feed is empty; see Run A). Not used until found.

---

## Primary sources (§13.2) — verified 23 Sep 2026

| Claim | Status | Source |
|---|---|---|
| Card splits over 4, 6, 8 or 10 months, chosen in the app | ✔ "choose which purchases to split in over 4, 6, 8 or 10 months" | tabby.ai/en-AE/card |
| Statement model, up to 40 days | ✔ "Pay up to 40 days later, with all purchases combined into a single monthly statement" | tabby.ai/en-AE/card |
| Pay in 4 fee-free at partners, anywhere only with Plus | ✔ partner stores free; "No fees anywhere" is Plus (AED 49/month) | tabby.ai/en-AE/card |
| UAE residents, UAE use | ✔ "Be a UAE resident"; "anywhere Visa is accepted in the UAE" | tabby.ai/en-AE/card |
| Saudi GM, 2022: card will come to Saudi | ✔ Abdulaziz Saja: "After the successful launch of the Tabby Virtual Card in UAE, we want to bring it to Saudi Arabia." (10 Sep 2022) | Arab News, node/2160111 |
| $233M at $6.5B, to expand financial services in KSA + UAE | ✔ Series F, led by Blue Pool Capital (Sep 2026) | Arab News; tbreak; Pulse 2.0 |
| Consumer finance licence: SAR 2,000–50,000, up to 12 months, Murabaha, no late fees | ✔ announced 29 Jun 2026 | tabby.ai newsroom; tbreak; FinTech Futures |
| U.S. Bank Split Card, auto 3-month split, Nov 2025; ExtendPay 2021 | ✔ announced 5 Nov 2025; 6/12-month extensions for a fixed monthly plan fee | U.S. Bank press release |

### Corrections to the spec

- **"15% credit card penetration" (§2.2) is stale.** It traces to pre-2014
  academic work. The World Bank's figure is **25.4% of adults (15+) in 2021**;
  Tabby's own Saudi GM said "around 0.3 credit cards per person" (2022).
  The page will not use 15%. See NOTES.md E2.
- **Tweeq.** Tabby acquired Tweeq (SAMA-licensed e-money wallet, Sep 2024),
  which issues wallet cards and "will continue to operate as an independent
  entity". "No Tabby Card in Saudi" still holds, but a judge could raise
  Tweeq. See NOTES.md E3.

### Not verified (stays `[FILL]` or off the page)

- SAMA rules on non-objection for new products, consent and disclosure (§13.2): not checked yet. The page says "likely needs SAMA non-objection" as the spec does, and claims nothing more.
- Tabby Saudi help, declined purchases: not checked.
- UAE card late fees and card pause (Kredit.ae): not checked; not needed on the page.
- How card authorisation and later conversion work at Tabby (§9 `[FILL]`): not public. Not claimed.

## The Tabby Card, how it's paid for and split — checked 29 Sep 2026

Asked by Salman (29 Sep): is the card topped up first, like a wallet card
(Barq), or paid later? From Tabby's UAE pages:

| Claim | Status | Source |
|---|---|---|
| Pay-later, not prepaid: link a debit/credit card "to cover Tabby payments"; "Pay up to 40 days later, with all purchases combined into a single monthly statement" | ✔ | tabby.ai/en-AE/card |
| Billing cycle: 30 days from the first purchase; repayment "due within 10 days of the statement issue date" | ✔ | tabby.ai/en-AE/help/help-tabby-card/how-do-billing-cycles-work |
| Splits are months: "split in over 4, 6, 8 or 10 months" | ✔ | tabby.ai/en-AE/card |
| Free plan: no fees at Tabby Card partner stores only; Plus (AED 49/month): no fees anywhere. Fee amounts outside that: not published | ✔ | tabby.ai/en-AE/card |
| Online with Apple Pay, Samsung Pay or Google Pay: "you don't have to approve it in the app" (manual card entry needs in-app approval) | ✔ | tabby.ai/en-AE/help/help-tabby-card/how-do-i-approve-my-online-purchases-with-tabby-card |
| Balance "set at an individual level and reassessed regularly" | ✔ | tabby.ai/en-AE/card |

Not found: when the first month of a card split is collected. The page shows
the monthly amount only, with no dates.

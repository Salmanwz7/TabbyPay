/**
 * ============================================================================
 *  PROTOTYPE DATA. NOT TABBY DATA.
 * ============================================================================
 *
 * Every value in this file is invented for the prototype (spec §0.1: "All data
 * mocked in a single mock-data.ts, clearly labelled as prototype data").
 * Nothing here is a Tabby price, limit, merchant agreement or eligibility rule.
 * The page says so wherever a number from this file is shown.
 *
 * The two exceptions are facts, and are marked as such:
 *   LONG_PLAN_MIN  SAR 2,000, the floor of Tabby's Saudi consumer finance
 *                  plans (licence announced 29 Jun 2026; EVIDENCE.md).
 *   Months = 6     one of the plan lengths inside the licensed 12-month max.
 */

export type Rules = {
  /** Rule 1: split purchases of this amount and up into 4 payments. */
  threshold: number;
  /** Rule 2: never auto-split more than this in a month. */
  cap: number;
};

export type Purchase = {
  id: string;
  merchant: { ar: string; en: string };
  amount: number;
  /**
   * Per-transaction eligibility (spec §2.4): Tabby's approval at the tap and
   * an allowed merchant category. A rule is a preference, not a promise:
   * Tabby checks every purchase on its own. The screen names the two checks,
   * never a risk reason, so which one failed is not modelled.
   */
  eligible: boolean;
  /**
   * A longer plan with a cost. Present when the purchase is over the
   * customer's Pay in 4 limit, so this plan is its only split; and only from
   * SAR 2,000, the floor of the licensed plans.
   */
  feePlan?: { months: number; fee: number };
};

/** The prototype's "today". A literal, never new Date(): the static export
 *  would otherwise bake in the build date and hydrate with a different one. */
export const TODAY = "2026-09-23";

/** Mock statement close: plans can be changed until this date (spec §5.1). */
export const STATEMENT_CLOSES = "2026-09-30";

/** Reem, spec §3.4. */
export const USER = { name: { ar: "ريم", en: "Reem" }, city: { ar: "جدة", en: "Jeddah" } };

export const DEFAULT_RULES: Rules = { threshold: 300, cap: 2000 };

/** Already split this month before the visitor arrives (spec §5.3 Screen 1). */
export const MONTH_TO_DATE = 840;

/** Fact, not mock: Tabby's Saudi longer plans start at SAR 2,000. */
export const LONG_PLAN_MIN = 2000;

/**
 * ILLUSTRATIVE FEE. Agreed with Salman: Tabby's Murabaha pricing is not
 * public, so Screen 6 shows a round made-up figure and labels it on screen as
 * prototype pricing. 5% of 3,200. Not an estimate of Tabby's price.
 */
export const ILLUSTRATIVE_FEE = 160;

export const PURCHASES: Purchase[] = [
  { id: "jarir", merchant: { ar: "جرير", en: "Jarir" }, amount: 450, eligible: true },
  { id: "pharmacy", merchant: { ar: "الصيدلية", en: "Pharmacy" }, amount: 85, eligible: true },
  { id: "furniture", merchant: { ar: "محل أثاث", en: "Furniture store" }, amount: 1400, eligible: true },
  {
    id: "electronics",
    merchant: { ar: "محل إلكترونيات", en: "Electronics store" },
    amount: 3200,
    eligible: true,
    feePlan: { months: 6, fee: ILLUSTRATIVE_FEE },
  },
  // Screen 7 only. Not one of the hero's four presets.
  { id: "salon", merchant: { ar: "الصالون", en: "Salon" }, amount: 620, eligible: false },
];

/** The four the hero offers, in the spec's order (§12). */
export const HERO_PURCHASE_IDS = ["jarir", "pharmacy", "furniture", "electronics"] as const;

export function byId(id: string): Purchase {
  const p = PURCHASES.find((x) => x.id === id);
  if (!p) throw new Error(`No mock purchase "${id}"`);
  return p;
}

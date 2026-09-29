/**
 * The Tabby Card's split plans as the UAE card page states them: "choose
 * which purchases to split in over 4, 6, 8 or 10 months" (tabby.ai/en-AE/card,
 * checked 29 Sep 2026). Months, not payments.
 *
 * The fee isn't here on purpose: splitting is fee-free at partner stores or
 * with Plus, and Tabby doesn't publish the fee otherwise. The screen says so
 * instead of inventing a number.
 */

export const CARD_PLAN_MONTHS = [4, 6, 8, 10] as const;
export type CardPlanMonths = (typeof CARD_PLAN_MONTHS)[number];

export interface MonthlySplit {
  /** One amount per month, in riyals; they add up to the purchase exactly. */
  payments: number[];
  /** The first month, which carries any leftover halalas. */
  first: number;
  /** Every month after the first. */
  monthly: number;
}

/** Split in whole halalas; the leftover goes in the first month. */
export function splitMonths(amount: number, months: CardPlanMonths): MonthlySplit {
  if (!CARD_PLAN_MONTHS.includes(months)) throw new Error(`No ${months}-month plan`);
  const total = Math.round(amount * 100);
  if (total <= 0) throw new Error("Nothing to split");

  const base = Math.floor(total / months);
  const first = base + (total - base * months);
  const payments = [first, ...Array<number>(months - 1).fill(base)].map((h) => h / 100);
  return { payments, first: first / 100, monthly: base / 100 };
}

/**
 * The evidence on the page, and nothing that isn't in EVIDENCE.md.
 *
 * Counts and verbatims from Run A (UAE, Google Play) and Run B (Saudi
 * corpus), both hand-audited. Quotes are reproduced exactly as written,
 * spelling included; the translation is mine and is labelled as one.
 */

import type { Lang } from "./copy.ts";

export const UAE_RUN = { onTheme: 5, n: 30_250 };
export const SA_RUN = { asksForCard: 2, n: 3_217 };

export interface Verbatim {
  id: string;
  stars: number;
  /** ISO date the review was posted. */
  date: string;
  lang: Lang;
  text: string;
  /** Into the other language. Mine, not the reviewer's. */
  translation: string;
  /** False for the one quote about splitting in general. */
  cardSpecific: boolean;
}

export const VERBATIMS: Verbatim[] = [
  {
    id: "six-payments",
    stars: 1,
    date: "2026-08-07",
    lang: "ar",
    text: "تجربة سيئة عبر الدفع بالبطاقة اجبرني ادفع ست دفعات مع اني كنت اريد اربع دفعات وفوقها رسوم كبيرة",
    translation: "Paying by card forced me into six payments when I wanted four, with big fees on top.",
    cardSpecific: true,
  },
  {
    id: "ok-hypermarket",
    stars: 1,
    date: "2026-08-01",
    lang: "en",
    text: "I made a purchase yesterday at OK Hypermarket, which is a Tabby partner store. However, because I paid using my Tabby Card via my mobile wallet (Tap & Pay), the app is treating it as a non-partner transaction and asking me to activate Tabby Plus with a monthly fee to split the amount.",
    translation:
      "اشتريت أمس من OK Hypermarket، وهو متجر شريك لتابي. بس لأني دفعت ببطاقة تابي من محفظة الجوال، التطبيق يعاملها كعملية من متجر غير شريك ويطلب مني أفعّل تابي بلس برسوم شهرية عشان أقسّم المبلغ.",
    cardSpecific: true,
  },
  {
    id: "plan-in-advance",
    stars: 1,
    date: "2026-07-17",
    lang: "en",
    text: "why don't you show the real 4 month split in the app since I am a plus user like before? so we can plan in advance the payment",
    translation: "ليش ما تعرضون التقسيم الحقيقي على 4 في التطبيق وأنا مشترك بلس مثل قبل؟ عشان نقدر نخطط للدفع من قبل.",
    cardSpecific: true,
  },
  {
    id: "sometimes-split",
    stars: 1,
    date: "2026-07-13",
    lang: "ar",
    text: "احيانا يتم تقسيم المشتريات واحيانا يطلب الدفع كاملا وعندما تتواصل مع خدمة العملاء لاتعرف السبب وراء ذلك الامر لانهم يقولون ان العملية تتم الياً دون توضيح",
    translation:
      "Sometimes purchases are split, sometimes it asks for full payment. Support can't tell you why; they say it happens automatically, with no explanation.",
    cardSpecific: false,
  },
  {
    id: "plus-only",
    stars: 2,
    date: "2025-10-18",
    lang: "en",
    text: 'The free "split in 4" option is now limited to Tabby Plus subscribers, and my card keeps getting blocked without clear reasons.',
    translation: "خيار «التقسيم على 4» المجاني صار بس لمشتركي تابي بلس، وبطاقتي تنقفل كل شوي بدون أسباب واضحة.",
    cardSpecific: true,
  },
];

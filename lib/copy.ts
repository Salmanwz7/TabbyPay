/**
 * Every string on the page, in both languages.
 *
 * Arabic is the source, written as spoken in Saudi. The English is the gloss,
 * never the other way round (DESIGN-SYSTEM.md §8). `en` is typed against
 * `ar`, so a string missing from either language is a type error.
 *
 * Where a sentence carries a live number, it is split into `…Before` /
 * `…After` around the figure, so the figure is rendered by <Money> (tabular,
 * isolated for bidi, currency word set separately) instead of being pasted
 * into a string.
 */

export type Lang = "ar" | "en";

export const dirOf = (l: Lang): "rtl" | "ltr" => (l === "ar" ? "rtl" : "ltr");

const ar = {
  // --- chrome --------------------------------------------------------------
  skip: "تخطَّ إلى المحتوى",
  brandName: "قواعدك",
  brandSub: "بطاقة تابي، بقواعد تحطها أنت",
  switchTo: "English",
  switchLabel: "Switch to English",
  footerRights: "جميع الحقوق محفوظة",
  footerName: "سلمان زمزمي",
  linkedinAria: "حساب سلمان زمزمي على لينكدإن، يفتح في نافذة جديدة",
  currency: "ريال",
  forward: "←",
  prototypeTag: "نموذج أولي · بيانات تجريبية",

  // --- hero ----------------------------------------------------------------
  heroKicker: "المشاركة الثالثة · تابي إماجن 2026",
  heroTitle: "اعرف خطتك قبل ما تصفّر مكينة الدفع.",
  heroSetup: [
    "حط قواعدك مرة وحدة.",
    "وكل ما تدفع بالبطاقة، يوصلك جدول دفعاتك خلال ثواني.",
  ],

  rulesHeading: "قواعدك",
  rule1Label: "القاعدة 1 · وش يتقسّم لحاله",
  rule1Before: "أي شراء من",
  rule1After: "وفوق",
  rule1Result: "4 دفعات",
  rule2Label: "القاعدة 2 · سقفك بالشهر",
  rule2Before: "لا تقسّم لحالك أكثر من",
  rule2After: "بالشهر",
  rule3Label: "القاعدة 3 · أي شي فيه رسوم",
  rule3Sentence: "أي خطة فيها رسوم",
  rule3Result: "تسألني أول",
  rule3Locked: "الخطط اللي فيها رسوم تسألك دايم قبل. وهذي مو إعداد.",
  lockedAria: "قاعدة ثابتة، ما تتغير",
  sliderHint: "اسحب",

  purchasesHeading: "جرّب تدفع",
  purchasesHelp: "اختر شراء، وشوف وش يصير له بقواعدك.",
  heroNudge: "اختر الأثاث، وبعدين حرّك سقفك.",

  outcomeSplits: "يتقسّم",
  outcomeStatement: "على الكشف",
  outcomeOverCap: "فوق سقفك",
  outcomeAsks: "يسألك",
  outcomeNotEligible: "ما يتقسّم",

  // --- receipt -------------------------------------------------------------
  receiptHeading: "إيصال خطتك",
  receiptLive: "تحدّث الإيصال",
  fourPaymentsOf: "4 دفعات، كل دفعة",
  today: "اليوم",
  splitByRuleBefore: "تقسّم بقاعدتك: من",
  splitByRuleAfter: "وفوق",
  changeUntilBefore: "تقدر تغيّرها لين يقفل كشفك في",
  statementTitle: "على كشفك",
  belowBefore: "هذا الشراء أقل من قاعدتك (",
  belowAfter: ")، فما تقسّم. تقدر تقسّمه بنفسك.",
  overCapBefore: "هذا الشراء بيطلّعك فوق سقفك",
  overCapAfter:
    "، فما تقسّم لحاله. هو على كشفك، وتقدر تقسّمه بنفسك.",
  feeTitle: "هذي الخطة فيها رسوم، فتسألك أول.",
  feeMonthsBefore: "تقدر تقسّمه على",
  feeMonthsAfter: "شهور، برسوم",
  feeTotal: "المجموع",
  feeNothingYet: "ما يصير شي لين تختار أنت.",
  feeIllustrative: "رقم توضيحي للنموذج، مو تسعيرة تابي.",

  capLabel: "هالشهر",
  capOf: "من",
  capWithThis: "مع هذا الشراء",
  capWouldBe: "بيصير",
};

export type Copy = typeof ar;

const en: Copy = {
  skip: "Skip to content",
  brandName: "Split Rules",
  brandSub: "The Tabby Card, on rules you set",
  switchTo: "العربية",
  switchLabel: "التبديل إلى العربية",
  footerRights: "All rights reserved",
  footerName: "Salman Zamzami",
  linkedinAria: "Salman Zamzami on LinkedIn, opens in a new tab",
  currency: "SAR",
  forward: "→",
  prototypeTag: "Prototype · mock data",

  heroKicker: "Submission 3 · Tabby Imagine 2026",
  heroTitle: "Know your plan before the terminal beeps.",
  heroSetup: [
    "Set your rules once.",
    "Every time you tap the card, your plan arrives in seconds.",
  ],

  rulesHeading: "Your rules",
  rule1Label: "Rule 1 · What splits on its own",
  rule1Before: "Over",
  rule1After: "",
  rule1Result: "4 payments",
  rule2Label: "Rule 2 · Your monthly cap",
  rule2Before: "Never auto-split more than",
  rule2After: "a month",
  rule3Label: "Rule 3 · Anything with a cost",
  rule3Sentence: "Anything with a fee",
  rule3Result: "asks you",
  rule3Locked: "Plans with a fee always ask you first. That one's not a setting.",
  lockedAria: "Fixed rule, not a setting",
  sliderHint: "Drag",

  purchasesHeading: "Try paying",
  purchasesHelp: "Pick a purchase and see what your rules do with it.",
  heroNudge: "Pick the furniture, then move your cap.",

  outcomeSplits: "Splits",
  outcomeStatement: "On statement",
  outcomeOverCap: "Over your cap",
  outcomeAsks: "Asks you",
  outcomeNotEligible: "Can't split",

  receiptHeading: "Your plan receipt",
  receiptLive: "Receipt updated",
  fourPaymentsOf: "4 payments of",
  today: "Today",
  splitByRuleBefore: "Split by your rule: over",
  splitByRuleAfter: "",
  changeUntilBefore: "You can change it until your statement closes on",
  statementTitle: "On your statement",
  belowBefore: "This one is under your rule (",
  belowAfter: "), so it wasn't split. You can still split it yourself.",
  overCapBefore: "This one would take you past your",
  overCapAfter:
    " cap, so it wasn't split automatically. It's on your statement. You can still split it yourself.",
  feeTitle: "This plan has a fee, so it asks you first.",
  feeMonthsBefore: "You can split this over",
  feeMonthsAfter: "months for a fee of",
  feeTotal: "Total",
  feeNothingYet: "Nothing happens until you choose.",
  feeIllustrative: "Illustrative figure for the prototype, not Tabby pricing.",

  capLabel: "This month",
  capOf: "of",
  capWithThis: "With this purchase",
  capWouldBe: "would be",
};

export const copy: Record<Lang, Copy> = { ar, en };

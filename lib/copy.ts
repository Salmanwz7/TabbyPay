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

  // --- act 1 ---------------------------------------------------------------
  act1Kicker: "الفصل الأول · وش الخلل اليوم",
  act1Statement: "أونلاين، تابي يقولك قبل. البطاقة تقولك بعدين.",
  act1Setup: [
    "في صفحة الدفع تشوف الدفعات والتواريخ والرسوم قبل ما تأكد.",
    "ببطاقة تابي في محلات الإمارات اليوم، تدفع أول وتقرر بعدين.",
  ],

  bpHeading: "جرّب الاثنين",
  bpHelp: "اضغط «ادفع» في الجوالين.",
  bpOnlineLabel: "تابي في الدفع أونلاين",
  bpTerminalLabel: "بطاقة تابي عند مكينة الدفع",
  bpOnlineStore: "متجر إلكتروني",
  bpShop: "محل",
  bpSplitIn4: "قسّمها على 4 مع تابي",
  bpFees: "الرسوم",
  bpNoFees: "بدون رسوم",
  bpPay: "ادفع",
  bpDone: "تم. تعرف كل شي.",
  bpSimulation: "محاكاة لجوال عند مكينة الدفع، مو شاشة محفظة.",
  bpTapToPay: "قرّب جوالك من المكينة",
  bpBeep: "بيب.",
  bpApproved: "تمت العملية",
  bpLater: "بعدين",
  bpLaterSteps: ["تفتح التطبيق", "تدوّر على العملية", "تقرر تقسّمها ولا لا", "تختار خطة"],
  bpOrForget: "أو تنسى، وتدفعها كاملة.",
  bpAgain: "من جديد",
  bpCaption: "الدفع أونلاين هو براند تابي. المكينة بطاقة ائتمان.",

  evHeading: "وش يقولون العملاء",
  evLead:
    "قليل اللي يكتبونها. واللي كتبوها يوصفون نفس الشي: ما عرفوا وش بتسوي البطاقة إلا بعد ما دفعوا.",
  evUaeOf: "من",
  evUaeLabel:
    "مراجعة لتطبيق تابي على Google Play في الإمارات، خلال 12 شهر، توصف هالمشكلة. قريتها وحدة وحدة.",
  evSaLabel:
    "مراجعة سعودية تطلب بطاقة تابي. الطلب السعودي ما يبان في المراجعات، والحجة السعودية في الفصل الثالث.",
  evTranslation: "ترجمة",
  evNotCard: "عن التقسيم عموماً، مو البطاقة بالذات",
  evStars: "من 5",
  evSource: "Google Play · الإمارات",
  evMethod:
    "الطريقة: مراجعات تطبيق تابي بالعربي والإنجليزي على Google Play للإمارات، من 23 سبتمبر 2025 إلى 22 سبتمبر 2026، فرزتها بكلمات مفتاحية وبعدين قريتها وحدة وحدة. متجر آبل ما رجّع أي مراجعة للإمارات. المراجعات هي اللي يكلّف الناس نفسهم يكتبونها. الرقم اللي يقيس المشكلة فعلاً هو تواصلات «ليش ما انقسمت؟» مع الدعم، وهذا عند تابي بس.",
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

  act1Kicker: "Act 1 · What's broken today",
  act1Statement: "Online, Tabby tells you before. The card tells you after.",
  act1Setup: [
    "At checkout you see the payments, the dates and the fees before you confirm.",
    "With the Tabby Card in a UAE shop today, you pay first and decide later.",
  ],

  bpHeading: "Try both",
  bpHelp: "Press Pay on both phones.",
  bpOnlineLabel: "Tabby at online checkout",
  bpTerminalLabel: "Tabby Card at a terminal",
  bpOnlineStore: "Online store",
  bpShop: "In a shop",
  bpSplitIn4: "Split in 4 with Tabby",
  bpFees: "Fees",
  bpNoFees: "None",
  bpPay: "Pay",
  bpDone: "Done. You know everything.",
  bpSimulation: "Simulation of a phone at a terminal. Not a wallet screen.",
  bpTapToPay: "Hold your phone near the terminal",
  bpBeep: "Beep.",
  bpApproved: "Approved",
  bpLater: "Later",
  bpLaterSteps: ["Open the app", "Find the purchase", "Decide whether to split", "Pick a plan"],
  bpOrForget: "Or forget, and pay in full.",
  bpAgain: "Again",
  bpCaption: "Online is Tabby's brand. The terminal is a credit card.",

  evHeading: "What customers say",
  evLead:
    "Few people write it down. The ones who do describe the same thing: they didn't know what the card would do until after they paid.",
  evUaeOf: "of",
  evUaeLabel:
    "Tabby app reviews on Google Play in the UAE, over 12 months, describe this problem. I read each one by hand.",
  evSaLabel:
    "Saudi reviews ask for a Tabby Card. Saudi demand doesn't show in reviews; the Saudi case is in Act 3.",
  evTranslation: "Translation",
  evNotCard: "About splitting in general, not the card specifically",
  evStars: "of 5",
  evSource: "Google Play · UAE",
  evMethod:
    "Method: Tabby app reviews in Arabic and English on Google Play for the UAE, 23 Sep 2025 to 22 Sep 2026, filtered by keyword and then read one by one. Apple's feed returned no UAE reviews. Reviews are what people bother to write. The number that would size this is \"why wasn't this split?\" support contacts, and only Tabby has it.",
};

export const copy: Record<Lang, Copy> = { ar, en };

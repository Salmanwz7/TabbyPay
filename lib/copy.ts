/**
 * Every string on the page, in both languages.
 *
 * Arabic is the source, written as spoken in Saudi. The English is the gloss,
 * never the other way round (DESIGN-SYSTEM.md §8). Sections add their own
 * blocks here as they are built, so a missing translation is a type error.
 */

export type Lang = "ar" | "en";

export const dirOf = (l: Lang): "rtl" | "ltr" => (l === "ar" ? "rtl" : "ltr");

export const copy = {
  ar: {
    skip: "تخطَّ إلى المحتوى",
    brandName: "قواعدك",
    brandSub: "بطاقة تابي، بقواعد تحطها أنت",
    switchTo: "English",
    switchLabel: "Switch to English",
    footerRights: "جميع الحقوق محفوظة",
    footerName: "سلمان زمزمي",
    linkedinAria: "حساب سلمان زمزمي على لينكدإن، يفتح في نافذة جديدة",
  },
  en: {
    skip: "Skip to content",
    brandName: "Split Rules",
    brandSub: "The Tabby Card, on rules you set",
    switchTo: "العربية",
    switchLabel: "التبديل إلى العربية",
    footerRights: "All rights reserved",
    footerName: "Salman Zamzami",
    linkedinAria: "Salman Zamzami on LinkedIn, opens in a new tab",
  },
} as const;

export type Copy = { [K in keyof (typeof copy)["ar"]]: string };

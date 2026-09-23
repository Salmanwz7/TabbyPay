"use client";

import { useLang } from "@/lib/LanguageProvider";

export default function LangToggle() {
  const { lang, t, setLang } = useLang();

  return (
    <button
      type="button"
      onClick={() => setLang(lang === "ar" ? "en" : "ar")}
      aria-label={t.switchLabel}
      // The label is in the OTHER language, so it is marked as such.
      lang={lang === "ar" ? "en" : "ar"}
      className="min-h-tap min-w-tap rounded-tabby border border-rule px-s2 text-small font-medium text-ink transition-colors duration-(--t-micro) hover:border-ink"
    >
      {t.switchTo}
    </button>
  );
}

"use client";

/**
 * Language state for the whole page. Carried over from submission 1.
 *
 * Arabic is the default AND is what the static HTML is served in, so an Arabic
 * visitor never sees a flash of the wrong direction. The toggle rewrites
 * <html lang dir> so every logical property mirrors with it.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { copy, dirOf, type Copy, type Lang } from "@/lib/copy";

type Ctx = {
  lang: Lang;
  dir: "rtl" | "ltr";
  t: Copy;
  setLang: (l: Lang) => void;
};

const LanguageContext = createContext<Ctx | null>(null);

const KEY = "tabby-split-rules-lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(KEY);
      if (stored === "en" || stored === "ar") setLangState(stored);
    } catch {
      /* storage blocked: stay in Arabic */
    }
  }, []);

  useEffect(() => {
    const el = document.documentElement;
    el.lang = lang;
    el.dir = dirOf(lang);
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(KEY, l);
    } catch {
      /* private mode: the toggle still works for this visit */
    }
  }, []);

  return (
    <LanguageContext.Provider
      value={{ lang, dir: dirOf(lang), t: copy[lang], setLang }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang(): Ctx {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}

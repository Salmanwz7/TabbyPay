"use client";

/**
 * The Saudi Tabby app's home, simplified from Salman's screenshot: search,
 * the two big tiles, a category row, then the one new thing, a green banner
 * announcing the card. Categories are plain tiles; the app's illustrations
 * are not copied. The banner is tagged as a proposal.
 */

import { useLang } from "@/lib/LanguageProvider";

export default function HomeScreen({ onOpenCard }: { onOpenCard: () => void }) {
  const { t } = useLang();

  return (
    <>
      <div className="app-search" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
        <span>{t.appSearch}</span>
      </div>

      <div className="grid grid-cols-2 gap-s1">
        <div className="app-tile">
          <span className="text-lead font-semibold">{t.appAllStores}</span>
          <span className="text-label text-muted">{t.appAllStoresSub}</span>
        </div>
        <div className="app-tile">
          <span className="text-lead font-semibold">{t.appDeals}</span>
          <span className="text-label text-muted">{t.appDealsSub}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-s1">
        {t.appCategories.map((c) => (
          <div key={c} className="app-tile">
            <span className="block aspect-square rounded-tabby bg-rule-soft" aria-hidden="true" />
            <span className="text-label font-semibold">{c}</span>
          </div>
        ))}
      </div>

      {/* The one new thing on this screen. */}
      <div className="app-banner">
        <span className="rounded-tabby bg-card px-s1 text-caption font-semibold">{t.appProposal}</span>
        <p className="text-title leading-tight font-bold">{t.appBannerTitle}</p>
        <p className="text-body">{t.appBannerSub}</p>
        <button type="button" className="app-pill mt-s1" onClick={onOpenCard}>
          {t.appBannerCta}
        </button>
      </div>
    </>
  );
}

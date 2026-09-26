"use client";

/**
 * The Tabby app's frame inside the phone: status bar, scrolling body, and
 * the floating pill tab bar from the real Saudi app, with one addition,
 * the new Card tab (Idea 1). A simplified likeness, labelled as one on the
 * page (NOTES.md R1).
 *
 * The tab bar is navigation, so each tab is a button with aria-current, and
 * the icon-only tabs carry their names for assistive tech.
 */

import type { Tab } from "@/lib/issue";
import { useLang } from "@/lib/LanguageProvider";
import { InAppContext } from "@/components/ui/Money";

const TABS: Tab[] = ["home", "shop", "card", "payments", "account"];

interface AppShellProps {
  tab: Tab;
  onTab: (tab: Tab) => void;
  children: React.ReactNode;
}

export default function AppShell({ tab, onTab, children }: AppShellProps) {
  const { t } = useLang();
  const names: Record<Tab, string> = {
    home: t.appTabHome,
    shop: t.appTabShop,
    card: t.appTabCard,
    payments: t.appTabPayments,
    account: t.appTabAccount,
  };

  return (
    <div className="app">
      <StatusBar />

      <div className="app-body">
        <InAppContext value={true}>{children}</InAppContext>
      </div>

      <nav className="app-tabbar" aria-label={t.appTabsLabel}>
        {TABS.map((key) => (
          <button
            key={key}
            type="button"
            className="app-tab"
            aria-current={tab === key ? "page" : undefined}
            aria-label={key === "card" ? `${names[key]} · ${t.appNew}` : names[key]}
            onClick={() => onTab(key)}
          >
            <TabIcon tab={key} />
            {key === "card" ? (
              <span className="app-tab__new" aria-hidden="true">
                {t.appNew}
              </span>
            ) : null}
          </button>
        ))}
      </nav>
    </div>
  );
}

/** The phone's status bar: time and icons. Decorative. */
export function StatusBar() {
  return (
    <div className="app-status" aria-hidden="true">
      <span className="tnum">9:41</span>
      <span className="app-status__icons">
        <StatusIcons />
      </span>
    </div>
  );
}

/** A placeholder for tabs the prototype doesn't cover. */
export function NotInPrototype() {
  const { t } = useLang();
  return <p className="py-s4 text-center text-body text-muted">{t.appNotInPrototype}</p>;
}

// ---------------------------------------------------------------------------

function TabIcon({ tab }: { tab: Tab }) {
  const common = {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (tab) {
    case "home":
      return (
        <svg {...common}>
          <path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z" />
        </svg>
      );
    case "shop":
      return (
        <svg {...common}>
          <path d="M5 8h14l-1 12H6z" />
          <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
        </svg>
      );
    case "card":
      return (
        <svg {...common}>
          <rect x="3" y="6" width="18" height="12.5" rx="2.5" />
          <path d="M3 10.5h18M7 15h3" />
        </svg>
      );
    case "payments":
      return (
        <svg {...common}>
          <path d="M12 3a9 9 0 1 0 9 9h-9z" />
          <path d="M15 3.5A9 9 0 0 1 20.5 9H15z" />
        </svg>
      );
    case "account":
      return (
        <svg {...common}>
          <circle cx="12" cy="8.5" r="3.5" />
          <path d="M5 20c1.2-3.6 4-5.5 7-5.5s5.8 1.9 7 5.5" />
        </svg>
      );
  }
}

function StatusIcons() {
  return (
    <>
      <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
        <rect x="0" y="8" width="3" height="4" rx="1" />
        <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
        <rect x="10" y="3" width="3" height="9" rx="1" />
        <rect x="15" y="0" width="3" height="12" rx="1" />
      </svg>
      <svg width="24" height="12" viewBox="0 0 24 12" fill="none" stroke="currentColor">
        <rect x="0.5" y="0.5" width="20" height="11" rx="3" />
        <rect x="2.5" y="2.5" width="14" height="7" rx="1.5" fill="currentColor" stroke="none" />
        <path d="M22.5 4v4" strokeLinecap="round" />
      </svg>
    </>
  );
}

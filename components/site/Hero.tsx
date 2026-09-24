"use client";

/**
 * The hero. Spec §12: "The hero is the most important thing on the page."
 *
 * The headline and two setup lines, then straight into the simulator. No
 * phone here: phone mockups sit inside the argument, never as the hero on
 * their own (§11.2). The simulator IS the pitch.
 *
 * Core palette only (DESIGN-SYSTEM.md §4 rule 4: first impressions): ink on
 * paper, with the green reserved for "a plan you know" inside the simulator.
 */

import { useLang } from "@/lib/LanguageProvider";
import RulesSimulator from "@/components/sim/RulesSimulator";

export default function Hero() {
  const { t } = useLang();

  return (
    <section aria-labelledby="hero-title" className="mx-auto w-full max-w-col px-s2 py-s5 sm:px-s4 lg:py-s6">
      <p className="mb-s3 text-small font-medium text-muted">{t.heroKicker}</p>
      <h1 id="hero-title" className="display max-w-measure text-h3 sm:text-h2 lg:text-h1">
        {t.heroTitle}
      </h1>
      <p className="mt-s3 max-w-measure text-lead text-ink-soft sm:text-lead-lg">
        {t.heroSetup.map((line, i) => (
          <span key={line} className={i < t.heroSetup.length - 1 ? "me-sentence" : ""}>
            {line}{" "}
          </span>
        ))}
      </p>

      <div className="mt-s5">
        <RulesSimulator />
      </div>
    </section>
  );
}

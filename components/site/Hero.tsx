"use client";

/**
 * The hero for "Tabby Pay" (NOTES.md R1).
 *
 * The title, the two lines that set up the two ideas, then the two ideas as
 * numbered links into their sections. Beside them, the Saudi Tabby app's
 * home with the new Card tab: a picture of Idea 1's first screen, inert here
 * (the working version is in Idea 1), and captioned as a likeness.
 *
 * Spec §11.2 keeps phones out of the hero on their own; this one sits beside
 * the argument, by Salman's direction (NOTES.md R2).
 */

import { useLang } from "@/lib/LanguageProvider";
import Phone from "@/components/phone/Phone";
import AppShell from "@/components/phone/app/AppShell";
import HomeScreen from "@/components/phone/app/HomeScreen";

const noop = () => {};

export default function Hero() {
  const { t } = useLang();
  const ideas = [
    { href: "#idea-1", title: t.heroIdea1, sub: t.heroIdea1Sub },
    { href: "#idea-2", title: t.heroIdea2, sub: t.heroIdea2Sub },
  ];

  return (
    <section
      aria-labelledby="hero-title"
      className="mx-auto grid w-full max-w-col items-center gap-s5 px-s2 py-s5 sm:px-s4 lg:grid-cols-2 lg:py-s6"
    >
      <div className="flex flex-col">
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

        <ol className="mt-s4 flex flex-col gap-s2">
          {ideas.map((idea, i) => (
            <li key={idea.href}>
              <a
                href={idea.href}
                className="flex items-start gap-s2 rounded-tabby border border-rule bg-card p-s3 text-ink no-underline hover:border-ink"
              >
                <span className="text-small font-medium whitespace-nowrap text-muted">
                  {t.ideaWord} <bdi className="tnum">{i + 1}</bdi>
                </span>
                <span className="flex flex-col gap-s1">
                  <span className="text-lead font-semibold">{idea.title}</span>
                  <span className="text-body text-ink-soft">{idea.sub}</span>
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>

      <figure className="flex flex-col gap-s2">
        {/* A picture of Idea 1's first screen: inert, so nothing in it takes
            focus or clicks. The working one is in Idea 1. */}
        <div inert>
          <Phone>
            <AppShell tab="home" onTab={noop}>
              <HomeScreen onOpenCard={noop} />
            </AppShell>
          </Phone>
        </div>
        <figcaption className="text-center text-small text-muted">{t.heroPhoneCaption}</figcaption>
      </figure>
    </section>
  );
}

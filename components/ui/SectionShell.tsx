/**
 * One rhythm for the whole page, so nothing drifts.
 *
 * This component exists because of a specific failure in submission 1: sections
 * with no spacing discipline, content rendered as data lists instead of designed
 * as editorial. Every section goes through here, and the scale is not negotiable:
 *
 *   Section padding, desktop                     --s7  (160px)
 *   Section padding, mobile                      --s5  (64px)
 *   Minimum gap between things inside a section  --s4  (40px)
 *   Content column, hard max                     --col (1200px)
 *   Text measure, always                         --text (68ch)
 *
 * The kicker is SENTENCE CASE. All-caps labels are banned by name (§12).
 */

interface SectionShellProps {
  /** Short label above the rule. Sentence case, never all-caps. */
  kicker?: string;
  /** Anchor target, for the skip link and in-page navigation. */
  id?: string;
  /** Extra classes on the section element. Layout only , no spacing overrides. */
  className?: string;
  /**
   * `dark` inverts the section onto ink, the way submission 1 treats its
   * regulatory block. It carries `data-on-dark`, which globals.css uses to
   * switch the focus ring to green — a near-black outline on a near-black
   * ground is invisible, and an invisible focus ring is a failed one.
   */
  tone?: "light" | "dark";
  children: React.ReactNode;
}

export default function SectionShell({
  kicker,
  id,
  className = "",
  tone = "light",
  children,
}: SectionShellProps) {
  const dark = tone === "dark";

  const inner = (
    <section
      id={id}
      className={`mx-auto w-full max-w-col px-s2 py-s5 sm:px-s4 lg:py-s7 ${className}`}
    >
      {kicker ? (
        <div className="mb-s4 flex items-center gap-s2">
          <span
            className={`text-small font-medium ${
              dark ? "text-rule" : "text-muted"
            }`}
          >
            {kicker}
          </span>
          <span
            className={`h-px flex-1 ${dark ? "bg-ink-soft" : "bg-rule"}`}
            aria-hidden="true"
          />
        </div>
      ) : null}
      {children}
    </section>
  );

  if (!dark) return inner;

  // The ground bleeds the full width; the content column stays at --col.
  return (
    <div className="bg-ink" data-on-dark>
      {inner}
    </div>
  );
}

/**
 * A statement that sits alone on screen , the opening beat of each act.
 *
 * Deliberately has no supporting furniture. If it needs a subtitle to land, the
 * sentence is wrong and shortening it is the fix.
 */
export function Statement({
  children,
  id,
  setup,
}: {
  children: React.ReactNode;
  id?: string;
  /**
   * The lines that say what the statement MEANS.
   *
   * A statement with nothing under it is a slogan: the reader has to supply
   * the significance themselves, and most will not bother. Submission 1 never
   * leaves one bare — it follows every statement with one or two plain lines,
   * and that is the difference between an argument and a poster.
   *
   * Rendered through the §8 sentence gap, so two short lines read as two
   * beats rather than one run.
   */
  setup?: string[];
}) {
  return (
    <section
      id={id}
      className="mx-auto flex w-full max-w-col flex-col justify-center px-s2 py-s6 sm:px-s4 lg:py-s7"
    >
      <h2 className="display max-w-measure text-h3 sm:text-h2 lg:text-h1">
        {children}
      </h2>

      {setup?.length ? (
        <p className="max-w-measure mt-s4 text-lead leading-body text-ink-soft sm:text-lead-lg">
          {setup.map((line, i) => (
            <span
              key={line}
              className={i < setup.length - 1 ? "me-[0.45em]" : ""}
            >
              {line}
            </span>
          ))}
        </p>
      ) : null}
    </section>
  );
}

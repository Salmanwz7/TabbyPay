/**
 * The phone frame, same body as submissions 1 and 2 (app/device.css).
 *
 * `children` is rendered exactly once. Below `sm` the chrome is stripped by
 * CSS, not by a second subtree, so the screen's state survives a resize.
 */

/** Front to back: a bright chamfer, a dark band, a lighter rear step. */
const LAMINA_TONES = [
  "--tabby-neutral-300",
  "--tabby-neutral-500",
  "--tabby-neutral-700",
  "--tabby-neutral-800",
  "--tabby-neutral-900",
  "--tabby-neutral-900",
  "--tabby-neutral-900",
  "--tabby-neutral-800",
  "--tabby-neutral-700",
  "--tabby-neutral-600",
  "--tabby-neutral-700",
  "--tabby-neutral-800",
] as const;

export default function Phone({ children }: { children: React.ReactNode }) {
  return (
    <div className="stage">
      <div className="device">
        <span className="device__back" aria-hidden="true" />
        {LAMINA_TONES.map((tone, i) => (
          <span
            key={`${tone}-${i}`}
            className="device__lamina"
            style={{
              ["--lam-tone" as string]: `var(${tone})`,
              // A fraction of the depth, so every layer stays between the
              // back and front plates.
              ["--lam-z" as string]: `calc(var(--dev-d) * ${((i + 1) / (LAMINA_TONES.length + 1) - 0.5).toFixed(4)})`,
            }}
            aria-hidden="true"
          />
        ))}
        <span className="device__front" aria-hidden="true" />
        <div className="device__screen">{children}</div>
        <span className="device__island" aria-hidden="true" />
        <span className="device__btn device__btn--action" aria-hidden="true" />
        <span className="device__btn device__btn--vol-up" aria-hidden="true" />
        <span className="device__btn device__btn--vol-down" aria-hidden="true" />
        <span className="device__btn device__btn--power" aria-hidden="true" />
        <span className="device__contact" aria-hidden="true" />
      </div>
    </div>
  );
}

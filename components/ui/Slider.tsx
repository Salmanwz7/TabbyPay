"use client";

/**
 * Slider.
 *
 * A native range input sits underneath at opacity 0, carrying keyboard support,
 * touch, and RTL direction for free. The visible track, fill and handle are drawn
 * from the same `--f` fraction, so the two can never disagree.
 *
 * Three details from §10 that are the difference between a slider people use and
 * one they don't:
 *
 *   1. Grip bars on the handle. A plain disc on a rule reads as a position
 *      MARKER; bars say "hold me".
 *   2. A labelled cue beneath it that retires after the first drag. Say the
 *      gesture out loud , a slider nobody drags is a slider nobody understands.
 *   3. Endpoint labels at `muted`, not `faint`. They are how you know what the
 *      range spans, so they are content, not decoration.
 *
 * The control is 44px tall including its hit area, per §9.
 */

import { useId, useState } from "react";

interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (next: number) => void;
  /** Accessible name, shown above the track. */
  label: string;
  /** Shown opposite the label , usually the live figure. */
  valueLabel?: React.ReactNode;
  /** Range ends. These tell the reader what the slider spans. */
  minLabel?: string;
  maxLabel?: string;
  /** One-line cue. Retires the first time the handle moves. */
  hint?: string;
  /**
   * Visually hide the label when a sentence right above the track already
   * says what the slider is (the hero's rules). It stays the accessible name.
   */
  hideLabel?: boolean;
  id?: string;
}

export default function Slider({
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
  valueLabel,
  minLabel,
  maxLabel,
  hint,
  hideLabel = false,
  id,
}: SliderProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const [touched, setTouched] = useState(false);

  const fraction = max > min ? (value - min) / (max - min) : 0;

  return (
    <div className="w-full">
      <div className={hideLabel ? "sr-only" : "mb-s1 flex items-baseline justify-between gap-s2"}>
        <label htmlFor={inputId} className="text-label font-medium text-ink">
          {label}
        </label>
        {valueLabel ? <div>{valueLabel}</div> : null}
      </div>

      <div className="slider" style={{ ["--f" as string]: fraction }}>
        <span className="slider__track" aria-hidden="true" />
        <span className="slider__fill" aria-hidden="true" />
        <input
          id={inputId}
          className="slider__input"
          type="range"
          // Labelled twice on purpose: htmlFor ties the visible label, and
          // aria-label guarantees a name even when the association is not
          // traced or the visible label is clipped.
          aria-label={label}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => {
            if (!touched) setTouched(true);
            onChange(Number(e.target.value));
          }}
        />
        <span className="slider__handle" aria-hidden="true" />
      </div>

      {(minLabel || maxLabel) && (
        <div className="tnum mt-s1 flex justify-between text-caption text-muted">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}

      {/* The cue retires once the gesture has been performed. It has done its
          job, and staying would be nagging. */}
      {hint && !touched ? <p className="hint mt-s2">{hint}</p> : null}
    </div>
  );
}

# Design System

Everything needed to rebuild this look and these rules in another project, in one
file. Every value below is transcribed from the working code , `app/tokens.css`,
`app/globals.css`, `app/app-ui.css`, `app/device.css`, `lib/format.ts` , not from
memory.

**How to use it:** copy §2 into `tokens.css`, §3 into your theme layer, then read
§5–§12 once. The rules are the part that matters; the hex values are the easy part.

---

## 0. Read this before reusing the colours

Two separate things live in this document.

**Portable , take freely.** The spacing scale, the motion budget, the RTL
architecture, the contrast discipline, the bidi verification technique, the
Arabic sentence-spacing fix, the component patterns. None of it belongs to
anyone. It is the useful half.

**Not portable , Tabby's brand identity.** The green `#6CFF93`, the warm neutral
ramp, the five secondaries and the Pantone references were extracted from
`brand.tabby.ai` and Tabby's shipped design-system CSS. They are one company's
visual identity. Shipping them in an unrelated product means shipping that
company's brand.

For a new project, **keep the structure and replace the values**: the same ramp
shape (0 → 1000, warm-shifted), one accent that means exactly one thing, two
secondaries maximum. That gives the same discipline without wearing someone
else's clothes.

**Tabby Sans is proprietary** (© NaN / Luke Prowse, all rights reserved, no
embedding licence). It must never be committed or served. This project keeps a
copy locally for measurement only, says so in its own Method section, and
gitignores `brand-assets/` for that reason. **Readex Pro** is the shipped
substitute , open licence, covers Arabic and Latin in one family.

---

## 1. The idea in one paragraph

A warm off-white ground, near-black ink, and one vivid accent that is only ever
allowed to mean one thing. Flat fills, no gradients, no floating cards. Type does
the work. Motion is a response to a gesture and nothing else. Arabic is the
primary language and the layout mirrors rather than flips. Every number is
tabular so a figure that counts does not jitter.

---

## 2. Tokens

Drop this in as `tokens.css` and import it first. **Nothing outside this file is
allowed a raw hex value.** That single rule is what stops a palette drifting.

```css
:root {
  /* --- CORE ---------------------------------------------------------------
     One accent. Green for money, green for go. Core palette is accent +
     black + white and nothing else. */
  --tabby-green: #6cff93;
  --tabby-black: #000000;
  --tabby-white: #ffffff;

  /* --- NEUTRALS -----------------------------------------------------------
     Warm-shifted throughout. 900 is #1A1919, never #111 , a cold grey next
     to a warm ground reads as a mistake. */
  --tabby-neutral-0: #ffffff;
  --tabby-neutral-50: #f5f4f2; /* page ground */
  --tabby-neutral-100: #ebe7e4;
  --tabby-neutral-200: #d6d3d0;
  --tabby-neutral-300: #bab6b3;
  --tabby-neutral-400: #8f8b88;
  --tabby-neutral-500: #75726f;
  --tabby-neutral-600: #595754;
  --tabby-neutral-700: #3d3b3a;
  --tabby-neutral-800: #292826;
  --tabby-neutral-900: #1a1919; /* primary ink */
  --tabby-neutral-1000: #000000;

  /* --- SECONDARIES --------------------------------------------------------
     Five exist. Use at most TWO in one composition. */
  --tabby-gold: #edcc37;
  --tabby-olive: #ada95b;
  --tabby-coral: #e3715d;
  --tabby-pearl: #dda2fa;
  --tabby-sky: #66abfe;

  /* --- FULL RAMPS ---------------------------------------------------------
     Product use. The brand colour is one step of each ramp, noted inline. */
  --tabby-green-50: #e9f7ee;
  --tabby-green-100: #daf0df;
  --tabby-green-200: #bce3c6;
  --tabby-green-300: #90d19f;
  --tabby-green-400: #57c26e;
  --tabby-green-500: #419454;
  --tabby-green-600: #316e3e;
  --tabby-green-700: #1e4d28;
  --tabby-green-800: #103018;
  --tabby-green-900: #0d2112;

  --tabby-gold-50: #fff4d1;
  --tabby-gold-100: #fcedb8;
  --tabby-gold-200: #f5dd7d;
  --tabby-gold-300: #edcc37; /* = --tabby-gold */
  --tabby-gold-400: #d1a923;
  --tabby-gold-500: #ab8a1d;
  --tabby-gold-600: #755e12;
  --tabby-gold-700: #52400e;
  --tabby-gold-800: #332909;
  --tabby-gold-900: #211b06;

  --tabby-olive-50: #f5f3e4;
  --tabby-olive-100: #edebd1;
  --tabby-olive-200: #dbd8b4;
  --tabby-olive-300: #c7c381;
  --tabby-olive-400: #ada95b; /* = --tabby-olive */
  --tabby-olive-500: #8c883f;
  --tabby-olive-600: #666331;
  --tabby-olive-700: #454421;
  --tabby-olive-800: #27290a;
  --tabby-olive-900: #1b1c05;

  --tabby-coral-50: #fceeed;
  --tabby-coral-100: #ffe1de;
  --tabby-coral-200: #ffc2ba;
  --tabby-coral-300: #fc9b8e;
  --tabby-coral-400: #e3715d; /* = --tabby-coral */
  --tabby-coral-500: #d44c3b;
  --tabby-coral-600: #a13427;
  --tabby-coral-700: #6e271e;
  --tabby-coral-800: #4d1a13;
  --tabby-coral-900: #2e100d;

  --tabby-purple-50: #fbedff;
  --tabby-purple-100: #f5defa;
  --tabby-purple-200: #eac6f5;
  --tabby-purple-300: #dda2fa; /* = --tabby-pearl */
  --tabby-purple-400: #c879db;
  --tabby-purple-500: #a55ab8;
  --tabby-purple-600: #803891;
  --tabby-purple-700: #5c2969;
  --tabby-purple-800: #3e1847;
  --tabby-purple-900: #25102b;

  --tabby-blue-50: #ebf5ff;
  --tabby-blue-100: #dfecf7;
  --tabby-blue-200: #bcdcf7;
  --tabby-blue-300: #8dc5f7;
  --tabby-blue-400: #66abfe; /* = --tabby-sky */
  --tabby-blue-500: #3a7dcf;
  --tabby-blue-600: #2e5e99;
  --tabby-blue-700: #154178;
  --tabby-blue-800: #0e2c4f;
  --tabby-blue-900: #0a1d33;

  --tabby-green-tint-3: #c7ffd6;

  /* --- SEMANTIC -----------------------------------------------------------
     NOTE the trap: the vivid brand accent (#6CFF93) is NOT the functional
     "positive" colour. Positive is green-400/500. Using the brand accent for
     success states burns it out , it stops meaning anything. */
  --tabby-front-primary: var(--tabby-neutral-900);
  --tabby-front-secondary: var(--tabby-neutral-500);
  --tabby-front-tertiary: var(--tabby-neutral-300);
  --tabby-front-positive: var(--tabby-green-500);
  --tabby-front-negative: var(--tabby-coral-500);
  --tabby-front-warning: var(--tabby-gold-500);
  --tabby-front-accent: var(--tabby-blue-500);
  --tabby-front-link: var(--tabby-blue-500);

  --tabby-bg-level-0: var(--tabby-neutral-50);
  --tabby-bg-level-1: var(--tabby-neutral-0);
  --tabby-bg-control-primary: var(--tabby-neutral-900);
  --tabby-bg-positive-strong: var(--tabby-green-400);
  --tabby-bg-negative-strong: var(--tabby-coral-400);
  --tabby-bg-warning-strong: var(--tabby-gold-400);
  --tabby-bg-accent-strong: var(--tabby-blue-400);

  /* --- SPACING ------------------------------------------------------------
     The ONLY spacing values in the system. Nothing in between, nothing
     outside. If a gap needs 12px, the design is wrong, not the scale. */
  --s1: 8px;
  --s2: 16px;
  --s3: 24px;
  --s4: 40px;
  --s5: 64px;
  --s6: 96px;
  --s7: 160px;
  --s8: 240px;

  /* --- LAYOUT ------------------------------------------------------------- */
  --col: 1200px; /* content column, hard max */
  --text: 68ch; /* text measure, always */
  --radius: 8px; /* corner radius CEILING, not a default */

  /* --- MOTION -------------------------------------------------------------- */
  --t-micro: 120ms; /* state change on a control */
  --t-standard: 240ms; /* anything larger */
  --t-reveal: 900ms; /* the ONE orchestrated moment, if the product has one */

  --ease-tabby: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-enter: cubic-bezier(0.16, 1, 0.3, 1);
}
```

### Spacing, in practice

| Where                                       | Value           |
| ------------------------------------------- | --------------- |
| Section padding, desktop                    | `--s7` (160px)  |
| Section padding, mobile                     | `--s5` (64px)   |
| Minimum gap between things inside a section | `--s4` (40px)   |
| Related elements                            | `--s2` / `--s3` |
| Tight pairs (label + value)                 | `--s1`          |

---

## 3. Semantic layer

Tokens are raw material; components never name them directly. Map once, then use
the semantic name everywhere. This is what lets you fix a contrast failure in one
place instead of forty.

```css
@theme {
  --font-sans: "Readex Pro", system-ui, -apple-system, sans-serif;

  --color-ink: var(--tabby-neutral-900);
  --color-ink-soft: var(--tabby-neutral-700);
  --color-muted: var(--tabby-neutral-600);
  --color-faint: var(--tabby-neutral-400);
  --color-rule: var(--tabby-neutral-200);
  --color-rule-soft: var(--tabby-neutral-100);
  --color-paper: var(--tabby-neutral-50);
  --color-card: var(--tabby-neutral-0);
  --color-black: var(--tabby-neutral-1000);

  --color-green: var(--tabby-green);
  --color-green-tint: var(--tabby-green-tint-3);
  --color-green-deep: var(--tabby-green-800);
  --color-green-ink: var(--tabby-green-900);
  --color-positive: var(--tabby-green-500);

  --color-gold: var(--tabby-gold);
  --color-gold-soft: var(--tabby-gold-100);
  --color-coral: var(--tabby-coral);
  --color-coral-soft: var(--tabby-coral-100);
  --color-coral-ink: var(--tabby-coral-700);

  --spacing-s1: var(--s1); /* … through --s8 */
  --radius-tabby: var(--radius);
  --ease-tabby: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-enter: cubic-bezier(0.16, 1, 0.3, 1);
}
```

> **A real bug this prevented.** `--color-muted` was originally `neutral-500`
> (`#75726F`) , **4.35:1** on paper, which misses AA's 4.5:1 at body size. Moving
> it one step to `neutral-600` (`#595754`, **6.55:1**) fixed every muted string on
> the site in one line. A component that had named `neutral-500` directly stayed
> broken and had to be found separately. Name the semantic token.

---

## 4. Colour rules

1. **The accent means exactly one thing.** Here: money and approval. Nowhere else
   , not for hover, not for decoration, not for a success toast. An accent used
   for three things means nothing.
2. **The vivid brand colour is not the functional colour.** Positive is
   `green-500`. Keep them separate or the brand colour burns out.
3. **Two secondaries maximum** in one composition. Five exist; using four is a
   carnival.
4. **Core palette only for first impressions** , the hero, the first screen.
   Expanded palette once the reader is already inside.
5. **Never carry meaning by colour alone.** Where this project shows an
   affordability bar in green/gold/coral, the verdict word changes with it:
   `مريح` / `على الحد` / `أكبر من قدرتك`. Colour-blind readers and printed
   copies get the same information.
6. **No gradients. Flat fills only.** Depth comes from layering flat tones , §11.

---

## 5. Typography

**One family for both scripts.** Readex Pro covers Arabic and Latin, so a mixed
line has one voice instead of two. Self-host it, subset it, preload it.

```html
<link
  rel="preload"
  href="/fonts/ReadexPro-arabic.woff2"
  as="font"
  type="font/woff2"
  crossorigin="anonymous"
/>
```

```css
@font-face {
  font-family: "Readex Pro";
  src: url("/fonts/ReadexPro-arabic.woff2") format("woff2");
  font-weight: 160 700;
  font-display: swap;
  unicode-range:
    U+0600-06FF, U+0750-077F, U+0870-088E, U+0890-0891, U+0897-08E1,
    U+08E3-08FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF,
    U+FE70-FE74, U+FE76-FEFC;
}
@font-face {
  font-family: "Readex Pro";
  src: url("/fonts/ReadexPro-latin.woff2") format("woff2");
  font-weight: 160 700;
  font-display: swap;
  unicode-range:
    U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC,
    U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212,
    U+2215, U+FEFF, U+FFFD;
}
```

### Leading differs by script, and this is not optional

Arabic ascenders and descenders are taller. The line-height that looks tight and
confident in Latin looks cramped and unreadable in Arabic.

|                      | Arabic (RTL) | Latin (LTR) |
| -------------------- | ------------ | ----------- |
| Display              | **1.24**     | **0.94**    |
| Headline             | **1.28**     | **1.00**    |
| Quote / long reading | **1.62**     | 1.34        |
| Body                 | 1.6 – 1.7    | 1.5 – 1.6   |

Make it a direction-scoped token so one class produces both:

```css
:root:lang(ar),
[dir="rtl"] {
  --lead-display: 1.24;
  --lead-head: 1.28;
}
:root:lang(en),
[dir="ltr"] {
  --lead-display: 0.94;
  --lead-head: 1;
}

.display {
  font-weight: 700;
  line-height: var(--lead-display);
  letter-spacing: -0.02em;
  text-wrap: balance;
}
.headline {
  font-weight: 600;
  line-height: var(--lead-head);
  letter-spacing: -0.01em;
  text-wrap: balance;
}
.quote {
  font-weight: 500;
  line-height: 1.34;
  letter-spacing: -0.005em;
  text-wrap: pretty;
}

/* Arabic gets NO negative tracking. Ever. It breaks the joins between
   letters, which is not a style choice , it is a spelling error. */
[dir="rtl"] .display,
[dir="rtl"] .headline {
  letter-spacing: 0;
}
[dir="rtl"] .quote,
.quote:lang(ar) {
  line-height: 1.62;
  letter-spacing: 0;
}
```

### Tabular figures on every number

Non-negotiable. A counting number that changes width makes the layout twitch.

```css
.tnum {
  font-variant-numeric: tabular-nums;
  font-feature-settings:
    "tnum" 1,
    "lnum" 1;
}
```

### Numerals in Arabic

Use **Western digits in both languages** where that is what the market actually
reads , in Saudi Arabia it is. The Arabic-ness comes from the words and the
direction, not the numeral system.

```ts
const LOCALE = { ar: "ar-SA-u-nu-latn", en: "en-GB" };
new Intl.NumberFormat(LOCALE[lang], { maximumFractionDigits: 0 }).format(n);
```

Render the bare figure and set the currency **word** separately as type
(`25,000` + `ريال`), so the two style independently and the number never gets
caught inside a reordering run.

### Scale

No rigid type scale. Sizes are chosen per context with responsive steps, e.g.
`text-[30px] sm:text-[42px] lg:text-[54px]`. What _is_ fixed: measure never
exceeds `--text` (68ch), and body copy never drops below 13px.

---

## 6. Motion

|          | Duration  | Use                                                          |
| -------- | --------- | ------------------------------------------------------------ |
| Micro    | **120ms** | state change on a control , border, colour, 0.97 press scale |
| Standard | **240ms** | anything larger                                              |
| Reveal   | **900ms** | at most ONE orchestrated moment in the entire product        |

Easing: `--ease-tabby: cubic-bezier(0.22, 1, 0.36, 1)` for settles,
`--ease-enter: cubic-bezier(0.16, 1, 0.3, 1)` for entrances.

**Motion is interaction-driven. Full stop.** If the user did not do something,
nothing moves.

Banned by name: scroll fade-up / reveal-on-scroll, parallax, hover animation on
every card, spinners where a state change would do, anything that moves on a
timer.

**One orchestrated moment, maximum.** Here it is the approval: the number counts
from 0 over 600ms with `easeOutCubic`, then a bar draws over the remaining 300ms.
Nothing else on screen moves. If everything is special, nothing is.

Reset to the start value in a **layout** effect, not an effect, or the final value
paints for one frame and then jumps backwards:

```ts
useLayoutEffect(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setShown(FINAL);
    return; // no animation, correct value
  }
  setShown(0);
  /* …rAF loop… */
}, [active]);
```

Every animation needs a reduced-motion fallback, plus the global belt:

```css
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

> ### The expensive lesson: never move a surface that carries controls
>
> This project had a phone rendered in CSS 3D that rotated toward the cursor.
> It looked wonderful and it **silently broke the primary button.**
>
> A `click` is only dispatched when `pointerdown` and `pointerup` resolve to the
> **same element**. When the surface rotates between press and release, the
> browser discards the click , no error, no console warning, nothing to debug.
> Controls that change state in place mostly survived, because a few pixels of
> drift still lands on a 64px tile. The primary action sat at the bottom of the
> screen where the rotation swung furthest, and it did not survive.
>
> It also passed every automated test, because a scripted `.click()` skips the
> down/up pairing entirely. Only a human found it.
>
> Freezing the tilt on `pointerdown` and capturing the pointer both narrowed the
> window without closing it. **The fix was to delete the motion.** If a surface
> holds buttons, it does not move.

---

## 7. RTL architecture

**Mirror the layout, do not flip the text.** The difference is everything.

### Use logical properties exclusively

| Never              | Always                                    |
| ------------------ | ----------------------------------------- |
| `left` / `right`   | `inset-inline-start` / `inset-inline-end` |
| `margin-left`      | `margin-inline-start` (`ms-*`)            |
| `padding-right`    | `padding-inline-end` (`pe-*`)             |
| `text-align: left` | `text-align: start`                       |
| `border-left`      | `border-inline-start` (`border-s-*`)      |
| `width` / `height` | `inline-size` / `block-size`              |

Enforce it:

```css
* {
  box-sizing: border-box;
  min-inline-size: 0;
}
```

**The documented exceptions.** A physical object does not mirror. Hardware
buttons on a rendered device, and anything truly centred, use physical properties
on purpose , with a comment saying why:

```css
.device__btn--power {
  right: -3px;
} /* a phone does not mirror */
.device__island {
  left: 50%;
  transform: translateX(-50%);
} /* centred is centred */
```

### Icons and direction

- A chevron must mirror: `className="rtl:-scale-x-100"` (or `ltr:` for the
  opposite one).
- **A down arrow means the same in both scripts.** Where an affordance can point
  down instead of forward, do that , it cannot mirror wrongly.
- Arrow keys follow the _language_, not the keyboard: in RTL, `ArrowLeft` is
  forward.

```ts
const fwd = dir === "rtl" ? "ArrowLeft" : "ArrowRight";
const back = dir === "rtl" ? "ArrowRight" : "ArrowLeft";
```

### Bidi: verify by measurement, never by eye

Mixed Arabic + digits + Latin reorders in ways that look fine in source and wrong
on screen. **`2 / 3` in an RTL run renders as `3 / 2`.** Isolate numbers with
words , `2 من 3` , and then _prove_ it.

Paste this into the console on any page with mixed content. It measures where each
token actually paints and flags anything out of logical order:

```js
(() => {
  const out = [];
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = w.nextNode())) {
    const t = n.nodeValue;
    if (!t || !/[؀-ۿ]/.test(t) || !/[0-9A-Za-z]/.test(t)) continue;
    const rects = [];
    let i = 0;
    for (const tok of t.trim().split(/\s+/)) {
      const s = t.indexOf(tok, i);
      if (s < 0) continue;
      i = s + tok.length;
      const r = document.createRange();
      r.setStart(n, s);
      r.setEnd(n, i);
      const b = r.getBoundingClientRect();
      if (!b.width) continue;
      rects.push({ tok, right: Math.round(b.right), y: Math.round(b.y) });
    }
    const lines = {};
    const bad = [];
    for (const r of rects) (lines[r.y] = lines[r.y] || []).push(r);
    for (const line of Object.values(lines))
      for (let k = 1; k < line.length; k++)
        if (line[k].right > line[k - 1].right)
          bad.push(`"${line[k - 1].tok}" then "${line[k].tok}" moved RIGHT`);
    if (bad.length) out.push({ text: t.trim().slice(0, 60), bad });
  }
  console.table(out);
  return out.length ? "REORDERING FOUND" : "clean";
})();
```

In RTL, each visual line must run **right to left**: every token's right edge
should be less than the previous token's. Anything else is a reorder bug.

Other bidi habits that pay:

- Split a copyright line into separate `<span>`s rather than one mixed string.
- Set a year as a literal (`"2026"`), not `new Date()` , under static export that
  is a hydration mismatch waiting to happen.
- Serve the primary language in the HTML before any JS runs:
  `<html lang="ar" dir="rtl">`.

---

## 8. Arabic reading comfort

Real feedback on this build: _"in Arabic I read everything like it's in a single
line."_ Arabic has no capital letter to mark where a sentence restarts, so three
short sentences read as one long run and the reader has to hunt for the full
stops.

**The fix:** give every sentence after the first roughly double the normal word
gap. Put the gap as a margin on the **end of the preceding** sentence, not the
start of the next , a trailing margin disappears when the line wraps there, a
leading one would look like an indent.

```ts
export function splitSentences(text: string): string[] {
  const out: string[] = [];
  let buf = "";
  for (let i = 0; i < text.length; i++) {
    buf += text[i];
    const ends = text[i] === "." || text[i] === "؟" || text[i] === "!";
    const spaceNext = i + 1 < text.length && /\s/.test(text[i + 1]);
    if (ends && spaceNext) {
      out.push(buf.trim());
      buf = "";
      while (i + 1 < text.length && /\s/.test(text[i + 1])) i++;
    }
  }
  const tail = buf.trim();
  if (tail) out.push(tail);
  return out;
}
```

Render each sentence in a span with `me-[0.45em]` on all but the last, and emit a
real space between them so lines still break normally. Requiring whitespace after
the full stop is what keeps `4.5 شهر`, `Next.js` and `tokens.css` intact.

**Do not apply it to quotations.** A verbatim quote is reproduced as written.

### Copy rules

- One idea per sentence. Under ten words. No nested clauses.
- If a line cannot be understood on first read, cut it down until it can.
- Jargon is explained in the sentence that uses it.
- Arabic written as spoken, not translated from the English. The English is the
  gloss, never the source.
- Latin acronyms stay Latin inside Arabic (`SAMA`, `X`) , then verify with §7.

---

## 9. Accessibility

**Contrast targets:** 4.5:1 normal text, 3:1 large (≥24px, or ≥18.66px bold),
3:1 for meaningful non-text UI.

Known-good pairs on `--color-paper` (`#F5F4F2`):

| Token                   | Ratio      | Verdict                           |
| ----------------------- | ---------- | --------------------------------- |
| `ink` `#1A1919`         | 15.96:1    | anything                          |
| `ink-soft` `#3D3B3A`    | ~10.8:1    | body                              |
| `muted` `#595754`       | **6.55:1** | body ✓                            |
| `neutral-500` `#75726F` | **4.35:1** | ✗ fails at body size              |
| `faint` `#8F8B88`       | ~3.07:1    | **large text or decoration only** |

Audit computed values, not swatches , the paint is what the reader gets:

```js
const lum = (c) => {
  const [r, g, b] = c
    .match(/\d+(\.\d+)?/g)
    .slice(0, 3)
    .map(Number)
    .map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return +((x + 0.05) / (y + 0.05)).toFixed(2);
};
```

**Focus is visible everywhere and never removed:**

```css
:focus-visible {
  outline: 3px solid var(--color-ink);
  outline-offset: 3px;
  border-radius: 2px;
}
[data-on-dark] :focus-visible {
  outline-color: var(--color-green);
}
::selection {
  background: var(--color-green);
  color: var(--color-ink);
}
```

**Put the pointer cursor back.** Tailwind v4's reset gives `<button>`
`cursor: default`, silently removing the oldest affordance on the web:

```css
button:not(:disabled),
[role="button"]:not([aria-disabled="true"]),
label[for],
summary {
  cursor: pointer;
}
```

**Touch targets: 44px minimum**, always. Watch for scaled containers , inside a
`scale()` wrapper a 44px target is no longer 44px on glass.

**Skip link** , first focusable element in the document, invisible until focused:

```css
.skip-link {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
.skip-link:focus-visible {
  position: fixed;
  inset-block-start: 12px;
  inset-inline-start: 12px;
  z-index: 100;
  inline-size: auto;
  block-size: auto;
  overflow: visible;
  clip-path: none;
  padding: 10px 16px;
  border-radius: var(--radius);
  background: var(--tabby-neutral-900);
  color: var(--tabby-neutral-50);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}
```

**Announce state changes politely**, so a stepper reports where you landed
without interrupting what is being read:

```tsx
<p aria-live="polite">
  {t.screenWord} {i + 1} {t.of} {total}
</p>
```

**Disabled buttons are dead ends.** If a control looks pressable and does nothing,
people conclude the whole thing is a picture. Prefer a button that always does
something: first press completes the prerequisite, second press advances.

---

## 10. Components

All states are `border-color` + `color` changes plus a small press scale. No
shadows, no fills that move.

### Primary / secondary action

```css
.btn-primary {
  inline-size: 100%;
  min-block-size: 52px;
  border-radius: var(--radius);
  background: var(--tabby-bg-control-primary);
  color: var(--tabby-neutral-50);
  font-size: 16px;
  font-weight: 600;
  transition: scale var(--t-micro) var(--ease-tabby);
}
.btn-primary:active {
  scale: 0.99;
}
.btn-primary:disabled {
  background: var(--tabby-neutral-200);
  color: var(--tabby-neutral-400);
  scale: 1;
}

.btn-secondary {
  inline-size: 100%;
  min-block-size: 52px;
  border-radius: var(--radius);
  border: 1.5px solid var(--tabby-neutral-900);
  background: transparent;
  color: var(--tabby-neutral-900);
  font-size: 15px;
  font-weight: 600;
  transition: scale var(--t-micro) var(--ease-tabby);
}
.btn-secondary:active {
  scale: 0.99;
}
```

### Chip (single-select)

```css
.chip {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center; /* centred flex, so a 2-line label keeps the
                                    same height as a 1-line one */
  min-block-size: 44px;
  padding-inline: 10px;
  border-radius: var(--radius);
  border: 1.5px solid var(--tabby-neutral-200);
  background: var(--tabby-neutral-0);
  color: var(--tabby-neutral-500);
  font-size: 12.5px;
  line-height: 1.25;
  font-weight: 500;
  transition:
    border-color var(--t-micro) var(--ease-tabby),
    color var(--t-micro) var(--ease-tabby),
    scale var(--t-micro) var(--ease-tabby);
}
.chip[aria-pressed="true"] {
  border-color: var(--tabby-neutral-900);
  color: var(--tabby-neutral-900);
}
.chip:active {
  scale: 0.97;
}
```

### Tile (icon + label)

```css
.tile {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  min-block-size: 82px;
  padding: 12px;
  border-radius: var(--radius);
  border: 1.5px solid var(--tabby-neutral-200);
  background: var(--tabby-neutral-0);
  color: var(--tabby-neutral-500);
  text-align: start;
  transition:
    border-color var(--t-micro) var(--ease-tabby),
    color var(--t-micro) var(--ease-tabby),
    scale var(--t-micro) var(--ease-tabby);
}
.tile--on {
  border-color: var(--tabby-neutral-900);
  color: var(--tabby-neutral-900);
}
.tile:active {
  scale: 0.975;
}
```

### Selectable row with a leading rule

The rule grows and the padding shifts , motion that says "selected" without
animating anything decorative. Logical `border-inline-start`, so it mirrors.

```css
.hard-row {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  inline-size: 100%;
  padding-block: 20px;
  padding-inline: 4px;
  border-block-end: 1px solid var(--tabby-neutral-200);
  border-inline-start: 2px solid transparent;
  text-align: start;
  transition:
    border-inline-start-color var(--t-standard) var(--ease-tabby),
    padding-inline-start var(--t-standard) var(--ease-tabby);
}
.hard-row:hover:not(.hard-row--on) {
  border-inline-start-color: var(--tabby-neutral-300);
  padding-inline-start: 10px;
}
.hard-row--on {
  border-inline-start-color: var(--tabby-neutral-900);
  padding-inline-start: 16px;
}
```

Hover is allowed **on controls**, never as card decoration:

```css
.chip:hover:not([aria-pressed="true"]),
.tile:hover:not(.tile--on),
.verify-row:hover:not(.verify-row--on) {
  border-color: var(--tabby-neutral-400);
}
```

### Slider

Native `<input type="range">` underneath at opacity 0, carrying keyboard, touch
and RTL for free. Visible parts are drawn from the same `--f` fraction, so the two
can never disagree.

```css
.slider {
  position: relative;
  block-size: 44px;
  display: flex;
  align-items: center;
  touch-action: pan-y;
}
.slider__track {
  position: absolute;
  inset-inline: 0;
  block-size: 6px;
  border-radius: 3px;
  background: var(--tabby-neutral-200);
}
.slider__fill {
  position: absolute;
  inset-block: 0;
  inset-inline-start: 0;
  border-radius: 3px;
  background: var(--tabby-neutral-900);
  inline-size: calc(var(--f) * (100% - 36px) + 18px);
}
.slider__handle {
  position: absolute;
  inset-inline-start: calc(var(--f) * (100% - 36px));
  inline-size: 36px;
  block-size: 36px;
  border-radius: 50%;
  background: var(--tabby-green);
  border: 2px solid var(--tabby-neutral-900);
  pointer-events: none;
  transition: scale var(--t-micro) var(--ease-tabby);
}
/* Grip bars. A disc on a rule reads as a position MARKER; bars say "hold me". */
.slider__handle::after {
  content: "";
  position: absolute;
  inset: 0;
  margin: auto;
  inline-size: 10px;
  block-size: 12px;
  background:
    linear-gradient(var(--tabby-neutral-900) 0 0) 0 0 / 2px 100% no-repeat,
    linear-gradient(var(--tabby-neutral-900) 0 0) 50% 0 / 2px 100% no-repeat,
    linear-gradient(var(--tabby-neutral-900) 0 0) 100% 0 / 2px 100% no-repeat;
}
.slider__input {
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 44px;
  margin: 0;
  padding: 0;
  opacity: 0;
  cursor: grab;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
}
.slider__input:active {
  cursor: grabbing;
}
.slider__input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: transparent;
}
.slider__input::-moz-range-thumb {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 50%;
  background: transparent;
}
.slider__input:focus-visible ~ .slider__handle {
  outline: 3px solid var(--tabby-neutral-900);
  outline-offset: 3px;
}
```

**Say the gesture out loud.** A slider nobody drags is a slider nobody
understands: grip bars on the handle, a labelled cue beneath it that retires after
the first drag, and endpoint labels at `muted` (not `faint` , they are how you
know what the range spans).

### Progress rail (non-interactive)

One segment per step, grouped under phase labels, `flex-grow` = step count. **It
reports, it does not navigate** , two ways to move through a sequence lets people
skip the part that carries the argument. Three states, three stops on the neutral
ramp, so it survives being printed and being colour-blind.

```css
.flow-rail {
  display: flex;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.flow-rail__phase {
  flex-basis: 0;
  min-inline-size: 0;
}
.flow-rail__bars {
  display: flex;
  gap: 3px;
}
.flow-rail__bars i {
  flex: 1;
  block-size: 5px;
  border-radius: 3px;
  background: var(--tabby-neutral-200);
  transition: background-color var(--t-micro) var(--ease-tabby);
}
.flow-rail__bars i[data-state="done"] {
  background: var(--tabby-neutral-400);
}
.flow-rail__bars i[data-state="now"] {
  background: var(--tabby-neutral-900);
}
.flow-rail__label {
  display: block;
  margin-block-start: 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-muted);
  white-space: nowrap;
}
.flow-rail__label[data-on] {
  font-weight: 600;
  color: var(--color-ink);
}
```

### Navigation buttons

Icon-only squares make people guess. Carry the word **and** the chevron; fill the
forward one.

```css
.nav-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-block-size: 48px;
  padding-inline: 16px;
  border-radius: var(--radius);
  border: 1.5px solid var(--tabby-neutral-200);
  background: var(--tabby-neutral-0);
  color: var(--tabby-neutral-900);
  font-size: 14.5px;
  font-weight: 600;
  transition:
    border-color var(--t-micro) var(--ease-tabby),
    background-color var(--t-micro) var(--ease-tabby),
    scale var(--t-micro) var(--ease-tabby);
}
.nav-btn:hover:not(:disabled) {
  border-color: var(--tabby-neutral-900);
}
.nav-btn:active:not(:disabled) {
  scale: 0.96;
}
.nav-btn:disabled {
  color: var(--tabby-neutral-300);
  border-color: var(--tabby-neutral-100);
}
.nav-btn--go {
  flex: 1;
  border-color: var(--tabby-neutral-900);
  background: var(--tabby-neutral-900);
  color: var(--tabby-neutral-50);
}
```

### Small tags, hint, meter

```css
.tag-guess,
.tag-known {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}
.tag-guess {
  background: var(--tabby-gold-100);
  color: var(--tabby-gold-700);
}
.tag-known {
  border: 1px solid var(--tabby-neutral-200);
  color: var(--color-muted);
}

/* "You can do something with the thing next to this." */
.hint {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-muted);
}
.hint::before {
  content: "";
  inline-size: 7px;
  block-size: 7px;
  border-radius: 50%;
  background: var(--tabby-green);
  flex: none;
}

/* A meter. Not decoration and not a nag. */
.afford {
  display: flex;
  block-size: 10px;
  border-radius: 5px;
  overflow: clip;
  background: var(--tabby-neutral-200);
}
.afford__take {
  block-size: 100%;
  background: var(--afford-tone);
  transition: inline-size var(--t-micro) linear;
}
```

### Section shell

One rhythm for the whole page so nothing drifts. Kicker is **sentence case** ,
all-caps labels are banned.

```tsx
<section className="mx-auto w-full max-w-[var(--col)] px-s2 py-s5 sm:px-s4 lg:py-s7">
  <div className="mb-s4 flex items-center gap-s2">
    <span className="text-[13px] font-medium text-muted">{kicker}</span>
    <span className="h-px flex-1 bg-rule" aria-hidden="true" />
  </div>
  {children}
</section>
```

---

## 11. Depth without gradients or shadows

When you need a three-dimensional object and gradients are banned, **laminate**:
stack the silhouette along Z as a dozen flat solid layers from the neutral ramp.
That gives a correctly-rounded milled edge with no corner maths, and it shades in
flat steps rather than a gradient.

```css
.stage {
  perspective: 2400px;
  perspective-origin: 50% 46%;
}
.stage__scale {
  transform: scale(var(--scale));
  transform-style: preserve-3d;
}
.object {
  transform-style: preserve-3d;
} /* NO rotation if it holds controls */
.object__lamina {
  position: absolute;
  inset: 0;
  border-radius: var(--radius-lg);
  background: var(--lam-tone);
  transform: translateZ(var(--lam-z));
  backface-visibility: hidden;
}
```

Tone order front→back: a bright chamfer catches the light, the band body goes
dark, then a lighter step where the rear chamfer turns away ,
`300, 500, 700, 800, 900, 900, 900, 800, 700, 600, 700, 800`.

**Perspective alone gives depth.** Even at zero rotation, laminae at different Z
render at measurably different widths (239 / 236 / 234px in this build), so the
edge is visible around the silhouette. You do not need to tilt it , and §6 says do
not, if it carries buttons.

Grounding instead of a floating-card shadow:

```css
.object__contact {
  position: absolute;
  inset-block-end: -34px;
  left: 50%;
  translate: -50% 0;
  inline-size: 78%;
  block-size: 46px;
  border-radius: 50%;
  background: var(--tabby-neutral-900);
  opacity: 0.16;
  filter: blur(26px);
  transform: translateZ(calc(var(--depth) / -2));
  pointer-events: none;
}
```

Tight, directly beneath, no drift. That is contact with the ground, not a card
hovering in space.

---

## 12. Banned

By name, because each is a thing a reviewer will notice:

- gradients
- glossy 3D renders
- generic vector art / stock illustration
- purple-blue "fintech" washes
- soft-shadow floating cards
- **all-caps labels**
- single-word headline accents (one word in a different colour)
- scroll fade-up, parallax, hover-on-every-card
- spinners where a state change would do
- an accent colour used for more than one meaning
- negative letter-spacing on Arabic
- raw hex outside the token file
- physical `left`/`right` outside the documented exceptions

---

## 13. Ship checklist

**Layout**

- [ ] No physical `left`/`right` except documented exceptions
- [ ] Layout mirrors in RTL , not just text direction
- [ ] Bidi verified by measuring paint positions (§7), not by eye
- [ ] Measure never exceeds `--text`

**Type**

- [ ] Arabic leading 1.24–1.28 on headlines, Latin 0.94–1.0
- [ ] No negative tracking on Arabic
- [ ] `.tnum` on every figure
- [ ] Fonts self-hosted, subset, preloaded
- [ ] No proprietary font in the repo or the bundle

**Colour**

- [ ] No raw hex outside `tokens.css`
- [ ] Accent means exactly one thing
- [ ] Two secondaries maximum
- [ ] No meaning carried by colour alone
- [ ] Contrast audited on **computed** values

**Motion**

- [ ] Nothing moves without a gesture
- [ ] 120ms micro / 240ms standard
- [ ] At most one orchestrated moment
- [ ] `prefers-reduced-motion` fallback on every animation
- [ ] **No moving surface carries a button** (§6)

**Interaction**

- [ ] Every control ≥44px
- [ ] `cursor: pointer` restored on buttons
- [ ] Visible focus everywhere, never removed
- [ ] Skip link present and first in the DOM
- [ ] No disabled button that looks like a dead end
- [ ] **Every button pressed by hand**, not only by script , a scripted click
      skips the `pointerdown`/`pointerup` pairing that real presses depend on

**Performance**

- [ ] Under 2s to first paint
- [ ] Mobile checked on a real phone, not a resized window

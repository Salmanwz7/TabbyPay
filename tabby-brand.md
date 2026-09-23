# Tabby brand system , extracted

**Method.** Playwright (Chromium 1243) driven headless; every page of
`brand.tabby.ai` walked via its nav, plus `tabby.ai/ar-SA`. For each page:
all CSS custom properties from every reachable stylesheet, computed
`font-family` on every element, every computed colour paired with its nearest
label, all body copy, and the network log filtered to fonts and SVG.
**Extracted 13 September 2026.** Raw JSON in the session scratchpad.

**Two caveats that shape everything below.**

1. `tabby.ai/ar-SA` **307-redirects to `ar-AE`** from a non-Saudi IP. Every
   tabby.ai figure here is therefore from the UAE Arabic build. The Saudi
   build may differ; check from a Saudi IP or VPN before relying on it.
2. `brand.tabby.ai` is hosted on a third-party guidelines platform
   ("Standards", `standards-site-beta.appspot.com`). Its _own_ CSS variables
   (`--color-component: #8247ff`, Söhne, Inter) are **platform chrome, not
   Tabby brand**. Tabby's real values there are in published page content ,
   which is where the numbers below come from.

---

## The headline findings

|                                          |                                                                                                                                                                                 |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Tabby Green is `#6CFF93`**             | Published on `/colour` with `PMS 2270 C`, and independently confirmed as the fill of the live app icon SVG. Much more electric than the spec's `#3ECF8E` placeholder.           |
| **The neutral ramp is warm**             | `#F5F4F2` → `#1A1919`. Confirmed twice over: published on `/colour`, and identical to `--tui-neutral-*` in the product CSS.                                                     |
| **The typeface is real and proprietary** | `Tabby Sans Display` / `Tabby Sans Text`, © NaN / Luke Prowse, _all rights reserved_. Served publicly, licensed to nobody. See [Typeface availability](#typeface-availability). |
| **Monions are restricted**               | Figma library returns **403**; the Drive folder demands sign-in. See [Monion availability](#monion-availability).                                                               |
| **Logo assets are fully public**         | A 29 MB zip, 255 files, no auth.                                                                                                                                                |

---

## `/` , Overview

Nav is ten pages: Overview, Brand Strategy, Verbal Identity, Logo, Colour,
Typography, Illustration, Iconography, Art Direction, Motion. All walked.

Page furniture, consistent sitewide: ground `#FFFFFF` / `#FAFAFA`, ink
`#1A1919`, section accent `#6CFF93`.

> Repeated site-wide disclaimer: _"The photography on this page is indicative
> and should not be used externally."_ It appears on nearly every page ,
> treat all imagery on the guidelines site as unlicensed for your use.

## `/brand-strategy`

Applied colours: `#6CFF93`, `#1A1919`, `#75726F`, `#EBE7E4`, `#F2F1F0`.

Section headings captured: _"WHERE WE'RE COMING FROM: Inheriting
Assumptions"_, _"SUMMARISING THE CHANGE WE'LL BRING , Reclaiming…"_,
_"Positioning , The difference our brand is rooted in"_, and the line
_"For too long, the system has run…"_.

## `/verbal-identity`

The voice section is the richest on the site (169 copy nodes). Verbatim:

- **The defining principle** , _"We empower customers to be the boss of their
  money. So our voice leads by example, and shows them boss energy in action."_
- **Broken into three rules:**
  - _"Make your reader the boss , write like you're empowering a peer, not
    talking down to a customer."_
  - _"They boss money. (We don't boss them.) …Their money follows their
    orders: we don't tell anyone what to do."_
  - _"Tabby is not the boss. We may sound like a boss, but we're never the
    actual boss. The reader has the power and the vision: Tabby is simply
    their tool."_
- **Range , two traits.** _Commanding_ should sound **"Fiery. Bold.
  Ambitious."** and never **"Rude. Obnoxious. Mean."** _Playful_ should sound
  **"Charming. Well-timed. Easy."** and never **"Punny. Try-hard. Lazy."**
  Crucially: _"this commanding side is always aimed at money, not our readers."_
- **Key line:** _"Money now answers to you."_
- **Key descriptor:** _"Tabby is the complete money app that lets you spend,
  send, save and boss money around."_
- **A hard rule**, flagged on a `#DDA2FA` panel: _"Don't use the word 'boss'
  other than in our [key descriptor]"_ , _"Overuse this word and it can feel
  a little try-hard."_
- _"Read the room"_ maps commanding vs playful across touchpoints: buttons,
  notifications, product copy, OOH, in-store, banner ads, launches, website,
  social, events, success screens.

## `/logo`

_"Grounded in currency. Bossy enough to lead."_

Five asset families, each in print and screen builds: **1. Badge, 2. Wordmark, 3. T Marque, 4. T App Tile, 5. T Avatar Circle.**

Downloaded to `brand-assets/logos/` , 9 SVG, 19 `.ai`, 35 PNG (255 entries
total, 29 MB). Extracted SVGs:

```
TabbyBadge.svg               Tabby_Wordmark_Black.svg   Tabby_T-Marque_Black.svg
Tabby_T-Avatar_Circle.svg    Tabby_Wordmark_Green.svg   Tabby_T-Marque_Green.svg
Tabby_T-Marque_App_Tile.svg  Tabby_Wordmark_White.svg   Tabby_T-Marque_White.svg
```

The live app icon (`tabby.ai/icon-v2.svg`, also saved) is a `#6CFF93`
squircle with the wordmark glyph in pure black , the cleanest single
confirmation of the brand green.

## `/colour`

Three declared tiers:

- **Core brand palette** , _"The purest distillation of Tabby. Centred around
  our vibrant green. Grounded by black and white."_ Used _"whenever we're
  making a first impression."_
- **Expanded brand palette** , _"when we're on home turf"_: adds neutrals and
  secondaries.
- **Digital palette** , _"when we're in our product"_: every tint and
  functional colour.

**Core**

| Name        | HEX       | Pantone | CMYK      |
| ----------- | --------- | ------- | --------- |
| Tabby Green | `#6CFF93` | 2270 C  | 73/0/94/0 |
| Black       | `#000000` | ,       | ,         |
| White       | `#FFFFFF` | ,       | ,         |

**Secondary** , each is one step of a functional ramp

| Name        | HEX       | Pantone | CMYK        | = ramp step |
| ----------- | --------- | ------- | ----------- | ----------- |
| Tabby Gold  | `#EDCC37` | 107 C   | 0/10/100/0  | gold-300    |
| Tabby Olive | `#ADA95B` | 618 C   | 25/20/75/15 | olive-400   |
| Tabby Coral | `#E3715D` | 2031 C  | 0/70/60/5   | coral-400   |
| Tabby Pearl | `#DDA2FA` | 264 C   | 23/40/0/0   | purple-300  |
| Tabby Sky   | `#66ABFE` | 2171 C  | 70/20/0/0   | blue-400    |

**Neutrals** , `#FFFFFF` `#F5F4F2` `#EBE7E4` `#D6D3D0` `#BAB6B3` `#8F8B88`
`#75726F` `#595754` `#3D3B3A` `#292826` `#1A1919` `#000000` (0→1000).

Full ramps are in **`tokens.css`**.

**Usage rules, verbatim:**

- _"Green. We can't say it enough, and it's what our customers should be
  saying when asked what colour Tabby is. It should stand out in every brand
  application."_
- _"Green and our most vibrant secondaries (300) can often be combined in
  layouts as long as they have space to breathe."_
- _"Mixing two secondaries together feels bold. Three, and things feel too
  playful."_
- _"Stick to the core colors and vibrant 300. Any other tint, and it starts to
  lose its punch."_
- On the extra tints: _"Treat these with caution: if they dominate layouts we
  run the risk of feeling too soft or too corporate."_
- Accessibility: every swatch on the page carries a live **AA / AAA** badge
  against the CTA colours.

**Cross-validation.** Every brand-site value matches the product's `--tui-*`
tokens exactly (Coral 300 `#FC9B8E` = `--tui-red-300`; Purple 400 `#C879DB` =
`--tui-pink-400`; Gold 400 `#D1A923` = `--tui-yellow-400`; …). The product
ships two themes, `.tui-theme-o25-light` and `.tui-theme-o26-light`; **`o26`
is the one whose values match the published brand**, so o25 is the outgoing
system. The shift is legible: cool `chrome` greys → warm `neutral`;
`iris` purple → `blue`; `lipstick` → `red`; `tangerine` → `orange`.

⚠️ On the marketing pages neither theme class is actually applied to the DOM ,
the `--tui-*` block ships in the bundle but goes unused there. So treat these
as _the design system's definitions_, not as proof of what is painted.

## `/typography`

> _"Our typography is firm but fair, like any good boss. Built from one
> typeface across headlines and body, Latin and Arabic, to create a unified
> system."_

**Tabby Sans Display** , _"A characterful typeface built on **SuperX Sans**
and customised to marry up with our brand identity. Bold and characterful to
the max, designed to be used in large headlines."_
**Tabby Sans Text** , _"More readable and functional, designed to be used
throughout copy and product."_

|          | Latin headlines    | Arabic headlines   |
| -------- | ------------------ | ------------------ |
| Face     | Tabby Sans Display | Tabby Sans Display |
| Leading  | 90–100%            | **120–130%**       |
| Tracking | −2–0%              | 0%                 |
| Case     | Sentence           | Sentence           |

That Arabic/Latin leading gap is their own number, and it is wider than the
+0.15 rule of thumb , use theirs.

Minimum display size: _"generally 72pt for print and 32px for product…
Headlines should be at least 2× larger than body copy for clear hierarchy."_

**Latin style sheet** (all Text unless noted; leading 100–130%, tracking 0%):

| Level          | Face / weight                            | Sample                           |
| -------------- | ---------------------------------------- | -------------------------------- |
| 1 Headline     | Display, 90–100% leading, −2–0% tracking | _"Money, now under your thumb."_ |
| 2 Subheadline  | Text Bold, sentence or upper             | _"Money wants to say hello"_     |
| 3 Leading copy | Text Medium                              | _"Put money to work with Tabby"_ |
| 4 Body         | Text Regular                             | ,                                |
| 5 Captions     | Text Regular                             | ,                                |
| 6 Buttons      | Text Bold, leading 100%                  | ,                                |

**Currency glyphs , directly relevant to Tabby Ahead.** _"Our typeface
includes customised versions of the Dirham and the new Riyal symbol. To
ensure that these currency glyphs appear correctly, make sure the OpenType
feature is switched on."_

**Bilingual rules.** _"Arabic and English text should be equal in size and
visual weight."_ Align to reading direction (left for Latin, right for
Arabic); centre only for effect. Display in product _"only at the highest
level of the hierarchy."_

### Typeface availability

**Proprietary. Technically downloadable, licensed to nobody.** Name tables
read straight off the binaries:

| File                                        | Family                  | Copyright                                                              | Coverage                           |
| ------------------------------------------- | ----------------------- | ---------------------------------------------------------------------- | ---------------------------------- |
| `TabbySansDisplay-Bold.woff2`               | Tabby Sans Display Bold | **© 2025 NaN / Luke Prowse. All rights reserved.**                     | 296 glyphs · 161 Arabic · 78 Latin |
| `TabbySansText-{Regular,Medium,Bold}.woff2` | Tabby Sans Text         | **© 2023 NaN / Luke Prowse, modified for Tabby. All rights reserved.** | 302 glyphs · 161 Arabic · 78 Latin |

No `licenseURL`, no OFL, no embedding permission , just _all rights
reserved_. The 2023 vs 2025 dates line up with Text being the existing face
and Display being drawn for the rebrand.

Served from two public, unauthenticated endpoints:
`cdn.tabby.ai/static/fonts/*.woff2` (what the site loads) and a **"Download
Tabby fonts"** button on `/typography` linking to `.ttf` builds on Firebase
Storage. Public hosting is not a licence. **Substitute for anything you
publish** , Readex Pro is the closest available match and covers Arabic and
Latin. Copies are in `brand-assets/fonts/` for _reference measurement only_
(matching leading, tracking, glyph widths).

**Legacy faces**, still declared in the product CSS but not loaded on the
Arabic page , these are the pre-rebrand identity, don't use them:
Radial Saudi (© Gradient 2018, Latin-only, 0 Arabic glyphs),
Ping AR Saudi (© TPTQ Arabic 2020), plus Inter and Geist.

## `/illustration` , the Monions

> _"Meet the Monions. Our most distinctive asset, brought to life by your
> command. Hand drawn for a touch of charm."_

Three principles, verbatim: **Controlled** , _"Easily readable compositions
with plenty of white space and just a pinch of chaos added in."_ · **Warm** ,
_"Crafted to be personable with imperfect poses and characterful actions."_ ·
**Charming** , _"Here to make sense of finances with wit and ease."_

Rules that constrain how you would draw or place them:

- _"Our Monions are all identical to each other, to give the feeling of a
  collective crowd rather than individuals."_
- _"We imagine the Monions to be about the size of coins… when we depict them
  alongside prop items, the Monions always have to be dwarfed by them. If a
  single Monion can use a single item on its own, that item is far too small.
  The Monions need to act in unison."_
- _"Using Monions on or in photography can start to make our brand look
  juvenile"_ , keep illustration and photography as _"distinctly separate
  worlds."_
- In product: fine _"as long as we're illustrating outside of blocks and
  panels."_
- Three sanctioned jobs: reinforce a message, visualise a financial concept
  (_"like pay-in-4 or interest rates"_), or reference the user's money.

### Monion availability

**Restricted.** Every route is gated:

| Route                                                   | Result                                                      |
| ------------------------------------------------------- | ----------------------------------------------------------- |
| "Monion library" → Figma `dyTSTJwCJv2N98DRPJXTn2`       | **HTTP 403**                                                |
| "How to design monions" → Figma Illustration Guidelines | Same Figma workspace, not public                            |
| Objects / illustration library → Google Drive folder    | **Google Drive sign-in wall**                               |
| On-page examples                                        | Covered by _"indicative and should not be used externally"_ |

No Monion artwork is downloadable, and the guidance explicitly forbids reusing
the on-page samples. **Do not put Monions in your submission.** The principles
above are public and you can honour the _spirit_ , hand-drawn, collective,
coin-scaled, warm , with your own illustration, which is also the safer call
in a competition judged by the people who commissioned them.

## `/graphic-system` , Iconography

Thinnest page (41 nodes). Icons live in Notion
(`app.notion.com/p/tabby/Icons-…`) and a `🍒 Graphics` Figma file , both
outside the public site, so not extractable.

## `/art-direction`

Photography direction. Same `#6CFF93` / `#1A1919` / `#F5F4F2` furniture; all
imagery carries the "indicative, not for external use" disclaimer.

## `/motion`

> _"Our motion draws inspiration from our Monions. Joyful and charming yet
> obedient and responsive."_

Three principles, verbatim:

- **Eager** , _"never floaty or distracting. We focus on clear, intentional
  movements, where each element has a logical rest point. Every time an
  element animates, it has a place to be and gets there eagerly."_
- **Human** , _"organic motion curves that are smoothed out, and have
  acceleration and inertia. Never mechanical."_
- **Charming** , _"in the big moments when motion takes centre stage, we
  animate elements as if they were cartoons… dimensionality, bounces, and UI
  micro-animations."_

**In product, the rule tightens:** _"our product has to be functional first
and foremost… any use of motion should be subtle, short, and not distract or
get in the way of what the user wants to do. Motion should delight, reinforce,
or give feedback to what the user is doing."_

No durations or easing curves are published , the spec's 120/240/900 ms
figures are its own invention, not Tabby's. Nothing here contradicts them.

---

## tabby.ai (Arabic build) , what is actually painted

`<html lang="ar" dir="rtl">`. Fonts actually fetched and rendered: **Tabby
Sans Text** (Regular/Medium/Bold) and **Tabby Sans Display Bold** , the latter
setting the Arabic hero _"أموالك الآن تعمل لصالحك"_. So the bespoke face does
carry Arabic in production, exactly as the guidelines claim.

Computed colours, by frequency:

| Hex                   | Role                                 | Token       |
| --------------------- | ------------------------------------ | ----------- |
| `#1A1919`             | body text, borders                   | neutral-900 |
| `#F5F4F2`             | inverted text on dark, panel grounds | neutral-50  |
| `#75726F`             | footnotes, secondary                 | neutral-500 |
| `#6CFF93`             | hero accent panel                    | Tabby Green |
| `#FFFFFF` / `#000000` | grounds                              | ,           |

Note what is _absent_: no gradient, no purple, no secondary colour anywhere on
the page. Core palette only , green, black, white, warm greys , which is the
`/colour` "first impression" tier applied literally.

---

## Assets on disk

```
tokens.css                                full palette as custom properties
brand-assets/fonts/*.woff2                10 files , REFERENCE ONLY, proprietary
brand-assets/logos/Tabby-Logo-Assets.zip  29 MB, 255 files, public
brand-assets/logos/svg/                   9 extracted SVG logo builds
brand-assets/logos/tabby-icon-v2.svg      live app icon
brand-assets/logos/Tabby_Wordmark_Black.svg
```

## Licensing, plainly

The logo zip is served without authentication and is clearly intended for
partner use. The fonts are served without authentication but are marked _all
rights reserved_ and are not licensed for redistribution or reuse. The Monions
are locked. For a competition submission: use the **colour values and the
written principles** freely , they are published guidance, and quoting them
back accurately is the whole point. Substitute the typeface, draw your own
characters, and say in the submission that you have done both. The spec was
already right that naming a limitation reads as rigour.

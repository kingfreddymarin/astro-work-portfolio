# Freddy J. Marin — Brand Manual

> The unique identity system for this portfolio. Replaces the default
> charcoal / safe-orange / grey scale with an ownable visual language.
>
> **Concept: SIGNAL.** A precision instrument aesthetic — the meeting point
> of embedded silicon (oscilloscope, terminal, telemetry) and the warmth of
> a person who *builds things*. Cold structure, one warm pulse.

---

## 1. Brand idea

| | |
|---|---|
| **Essence** | *Extreme adaptability, shipped.* |
| **Personality** | Precise, calm, fast, quietly confident. Engineer, not influencer. |
| **One-liner** | "I just build stuff." — said by someone who has built it 20+ times. |
| **Feeling** | Looking into a well-tuned instrument: dark, exact, alive. |
| **Avoid** | Generic SaaS gradients, startup purple, default Bootstrap orange, stock-photo warmth. |

The whole system is **near-monochrome on purpose** so the single signal color
carries all the energy. One accent. Used sparingly. It should feel earned.

---

## 2. Color system

The default was `#141413 / #E0573A / grey`. We keep a deep ink base (it's
correct for an instrument) but **retune everything** to be ours:

- A base that's a touch cooler and deeper — *graphite*, not brown-black.
- A signature accent that is **not** safe orange: **Signal Amber `#FFC24B`**,
  a warm sodium-lamp / oscilloscope-trace yellow. Reads as "live readout,"
  not "buy now button."
- A secondary cool accent — **Trace Cyan `#5EE6D0`** — used *only* for
  states, links-on-hover, and data, never decoratively. Amber is the brand;
  cyan is the instrument.

### Core tokens (dark — default)

```css
:root {
  /* Base — cool graphite, deeper than the old brown-black */
  --bg:         #0E0F11;   /* page                */
  --surface:    #16181B;   /* raised panels       */
  --surface-2:  #1E2125;   /* cards on panels     */

  /* Ink — neutral cool grey ramp, slightly blue */
  --ink:        #ECEEF0;   /* primary text        */
  --ink-2:      #9BA1A8;   /* secondary           */
  --ink-3:      #5A6066;   /* muted / labels      */

  /* Signal — the brand. Use sparingly. */
  --accent:     #FFC24B;   /* Signal Amber        */
  --accent-dim: #2A2113;   /* amber wash bg       */

  /* Trace — instrument/data only, never decorative */
  --trace:      #5EE6D0;   /* Trace Cyan          */
  --trace-dim:  #11211F;

  /* Structure */
  --border:     rgba(236,238,240,0.10);
  --border-2:   rgba(236,238,240,0.18);
  --nav-bg:     rgba(14,15,17,0.85);

  /* Status (semantic only) */
  --ok:    #5EE6D0;
  --warn:  #FFC24B;
  --live:  #FF5C5C;   /* "available" pulse, NDA-live, etc. */

  --radius: 3px;      /* tighter than default — instrument, not app */
}
```

### Light variant (optional — "Datasheet")

```css
:root[data-theme="light"] {
  --bg:        #F4F2ED;   /* warm paper, not pure white */
  --surface:   #FBFAF6;
  --surface-2: #FFFFFF;
  --ink:       #15171A;
  --ink-2:     #4A4F55;
  --ink-3:     #868C92;
  --accent:    #B5791A;   /* amber darkened for AA on paper */
  --accent-dim:#F2E4C4;
  --trace:     #0E8C7A;
  --border:    rgba(20,22,25,0.12);
}
```

### Usage rules (the part that keeps it ownable)

1. **One amber per view.** If two things are amber, neither feels important.
   Amber marks the single most important action or the live signal.
2. **Cyan is for truth, not taste.** Data values, active states, valid links
   on hover, "online" dots. Never headings, never borders for looks.
3. **80 / 15 / 4 / 1** — ink-on-graphite 80%, structure/borders 15%,
   amber 4%, cyan 1%. If amber creeps past ~5% of a screen, pull it back.
4. **Never** the old `#E0573A` orange. That's the generic look we're leaving.
5. Red (`--live`) is reserved for genuine live/availability/recording states.

### Contrast (don't ship below this)

- `--ink` on `--bg` → AAA. `--ink-2` on `--bg` → AA.
- `--accent` amber on `--bg` → AA for large/bold text and UI, **not** body copy.
  Body copy is always `--ink` / `--ink-2`, never amber.

---

## 3. Typography

Keep the strong existing pairing but assign it strict roles. Three voices:

| Role | Family | Use |
|---|---|---|
| **Display / editorial** | `Cormorant Garamond` (serif) | Section titles, the hero name, big statements. The human warmth. |
| **Body / UI** | `DM Sans` | All paragraphs, nav, buttons, descriptions. Weight 300–500. |
| **Signal / data** | `DM Mono` | Labels, numbers, telemetry, tags, kickers, status. The instrument. |

> Note the import currently says `Cormorant Garant` — that font does not exist.
> It should be **`Cormorant Garamond`**. Worth fixing as part of adopting this.

### Type rules

- **Mono carries the brand voice.** Every label, stat, tag, and status reading
  is `DM Mono`, uppercase, `letter-spacing: 0.18em`, `--ink-3`. This is the
  single most recognizable thing about the brand — the "readout" texture.
- **Serif is rare and large.** Only headlines. Tight tracking (`-0.02em`).
- **Sans never goes uppercase-tracked.** That's mono's job.
- Body weight 300. UI weight 400–500. Never bold sans display — use the serif.

### Scale

```
Display   clamp(2.5rem, 6vw, 4.5rem)   serif 600   -0.02em
H2        clamp(2rem, 4vw, 3rem)       serif 600   -0.02em
H3        1.25rem                      sans 500
Body      1rem / 1.6                   sans 300
Small     0.8125rem                    sans 400
Kicker    9px  / 0.20em UPPER          mono       (the readout label)
Data      11px / 0.14em                mono
```

---

## 4. Motion & texture

The instrument feel comes from restraint plus *one* living detail.

- **Caret blink** (mono cursor) — the signature animation. Already present;
  keep it amber, ~1.1s step-end.
- **Scanline / grain** — keep film grain at `--grain-opacity: 0.035` max.
  Texture should be felt, never seen.
- **Corner brackets** (`.panel-frame`) — the framing motif. Make them
  amber, 1px, 14px arms. This is a brand shape — use it on hero, contact,
  and featured work, not everywhere.
- **Reveal** — translateY(16px) + fade, 0.6s ease. No bounce, no scale-pop.
- **Transitions** — easing `cubic-bezier(0.76, 0, 0.24, 1)` for view changes
  (already in use — keep it). Snappy, mechanical, confident.
- Honor `prefers-reduced-motion` everywhere (already done).

**Tone:** movement should feel like a machine settling, not a UI bouncing.

---

## 5. Components

- **Buttons.** Primary = solid `--ink` on `--bg`, hover fills `--accent`.
  Ghost = transparent, `--border`, hover border `--ink-2`. Mono label,
  `letter-spacing: 0.06em`. Radius 3px.
- **Tags / pills.** Mono 10px, `--accent-dim` bg, `--accent` text, full-round.
  This is the one place amber repeats — it reads as "spec sheet," which is on-brand.
- **Status dots.** 6px square (not circle — instrument), `--live` pulsing for
  "available," `--trace` static for "online/valid."
- **Kicker label.** `console-label` — mono 9px uppercase `--ink-3`. Precedes
  most headings. The connective tissue of the whole site.
- **Telemetry row.** Mono, right-aligned, `--ink-3` + amber caret. Keep.
- **Corner-bracket frame.** Reserved for hero, contact, featured project.

---

## 6. The signature theme variants

The site already cycles themes (`glass`, `chaos`, `terminal`, `winxp`) as an
easter egg — keep those, they're personality. But the **default** is now
**SIGNAL** as specified above. The default is the brand; the rest are jokes
you let people find.

---

## 7. Voice & tone

- First person, present tense, short sentences. "I build." "It ships."
- State capability as fact, not aspiration. No "passionate about." No "I love."
- Numbers do the bragging: `60M+`, `20+`, `8+`, `70%`. Always mono.
- NDA work is stated plainly and confidently — the constraint *is* the credential.
- Never hype words: "revolutionary," "cutting-edge," "synergy." Banned.

---

## 8. Do / Don't

| Do | Don't |
|---|---|
| One amber accent per view | Paint the UI orange |
| Mono for every label & number | Uppercase-track the sans body |
| Deep cool graphite base | Brown-black charcoal |
| Cyan only for data/state | Cyan as decoration |
| Square 6px status indicators | Round glowing dots everywhere |
| Big rare serif headlines | Bold sans pretending to be display |
| Let the easter-egg themes be found | Make a joke theme the default |

---

## 9. Quick reference card

```
BASE     #0E0F11  graphite
INK      #ECEEF0  text
ACCENT   #FFC24B  Signal Amber   ← the brand, 4% of any screen
TRACE    #5EE6D0  Trace Cyan     ← data & state only
LIVE     #FF5C5C  availability pulse

Serif  Cormorant Garamond  → headlines (rare, large)
Sans   DM Sans 300/500     → everything readable
Mono   DM Mono UPPER 0.18em → every label, number, status (the readout)

Radius 3px · Grain ≤0.035 · Caret amber blink · Corner brackets amber
```

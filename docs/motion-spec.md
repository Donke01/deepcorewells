# Deep Core Wells — Motion Design Spec

**Repo:** `~/workspace/deepcorewells` · **Scope:** `index.html` redesign, spec only (no HTML changes here)
**Stack:** static site, no build step · GSAP 3 + ScrollTrigger via CDN · vanilla-JS `<canvas>` for hero
**Audience:** mobile-first — mid-range Android is the reference device

---

## 1. Motion concept

**"The Descent."** Scrolling the page is a drill string going down. The visitor starts at the surface — a bright sky-blue hero with the rig in the foreground — and as they scroll, the page's ambient background literally sinks: sky blue → dry topsoil ochre → rock-brown → deep aquifer indigo/teal. A fixed depth-gauge rail on the edge counts down the metres (0 m → 200 m), synced to scroll position. Midway down, at the stats section, the drill *strikes water*: numbers burst upward like a gusher, particles fountain, the palette blooms into saturated blues. The final sections (quote form, CTA) surface back into clean daylight — you went down, you found water, now let's talk. Everything moves slowly and weightily; this is geology, not a startup landing page. Motion is always *transform/opacity only*, and every heavy effect dies instantly under `prefers-reduced-motion`.

---

## 2. Animation inventory

Conventions: `data-` hooks below are suggested attributes the builder adds. Easing names are GSAP easings. Durations in seconds. All "scroll enter" triggers use `ScrollTrigger` with `start: "top 85%"`, `once: true` unless noted.

### Global / ambient

| # | Element | Trigger | Duration / easing | Detail |
|---|---------|---------|-------------------|--------|
| G1 | Fixed depth rail (`.depth-rail`: right-edge gauge, 0–200 m + moving marker) | Scroll scrub | scrub 0.6 (smoothing) | Scrubbed across whole `<body>`: marker `y` translates top→bottom; digital readout counts 0→200 m. Fades in after hero (opacity 0→1, 0.4 s) so it never fights the hero. Hidden below 640 px viewport width (use ScrollTrigger `matchMedia` or CSS) and when reduced-motion is on. |
| G2 | Ambient background gradient wash (`body::before` fixed layer) | Scroll scrub | scrub 0.8 | Fixed full-viewport gradient layer crossfading through 4 stops tied to section boundaries: sky `#7ec8f7` (hero) → ochre `#c98f4e` (services/why-us) → umber `#6b4a2f` (trust/stats approach) → aquifer teal `#0b3d5c` (stats→contact). Implemented as 4 stacked fixed divs, opacity scrubbed — never animate `background` itself. Opacity ≤ 0.55 so content stays legible. |
| G3 | Section titles (`.section-title`) | Scroll enter | 0.7 s, `power3.out` | `y: 40 → 0`, opacity 0→1. Add a short accent rule under the title that draws itself: `scaleX 0→1` (transform-origin left), 0.5 s, `power2.out`, delay 0.15. |
| G4 | Nav header | Load | 0.5 s, `power2.out` | Slides `y: -100% → 0` on load. On scroll down past 300 px, translate up out of view (`yPercent: -100`, 0.3 s); back on scroll up. Standard hide/reveal; disable under reduced-motion. |
| G5 | Footer | Scroll enter | 0.6 s, `power2.out` | Simple `y: 30 → 0`, opacity 0→1. Footer gets no drama — it is the end of the borehole. |

### Hero (`.hero`)

| # | Element | Trigger | Duration / easing | Detail |
|---|---------|---------|-------------------|--------|
| H1 | Hero canvas: drill-depth particle field | Load, runs while hero visible | Continuous (rAF) | Full-bleed canvas behind hero content. ~60 dust/soil particles drifting upward (the cuttings being flushed out of the borehole) + 3 slow parallax "strata" bands (translucent horizontal layers moving at different speeds on scroll, scrubbed via GSAP: `y` at 0.1× / 0.25× / 0.4× scroll speed). Strata colors match the descent palette. |
| H2 | Drill-depth counter (`.hero-depth`: "DEPTH 000 m" mono readout) | Load | 2.2 s, `power2.inOut` | Counts 0→47 m on load (average first-strike depth story), then continues scrubbing with page scroll afterwards (hands off to G1 logic). Font: monospace, letter-spaced, small. |
| H3 | H1 headline | Load | 0.9 s, `power3.out`, delay 0.2 | Words slide up with stagger: split into word spans, `y: "110%" → 0` inside overflow-hidden wrappers, stagger 0.06. |
| H4 | Hero sub-copy | Load | 0.8 s, `power3.out`, delay 0.5 | `y: 24 → 0`, opacity 0→1. |
| H5 | Hero buttons | Load | 0.7 s, `power3.out`, delay 0.7 | Stagger 0.1, `y: 20 → 0`, opacity 0→1. Primary button gets a perpetual soft pulse: box-shadow ring expanding (opacity 0.5→0), 2.4 s loop, `sine.inOut` — pause when tab hidden. |
| H6 | Scroll cue (chevron / "scroll to drill down") | Load, loops | 1.8 s loop, `sine.inOut` | `y: 0 → 10 → 0`. Fades out permanently once user scrolls 120 px (opacity 0, 0.3 s). |

### Services (`.services`, 6 `.service-card`)

| # | Element | Trigger | Duration / easing | Detail |
|---|---------|---------|-------------------|--------|
| S1 | Service cards | Scroll enter (batch) | 0.6 s, `power3.out`, stagger 0.08 | `y: 50 → 0`, opacity 0→1, via `ScrollTrigger.batch`. Cards also get hover lift: `y: -6`, shadow deepen, 0.25 s `power2.out` (CSS transition is fine; keep off on touch — use `@media (hover: hover)`). |
| S2 | Service icons | Scroll enter | 0.9 s, `back.out(1.6)`, delay 0.25 after card | Icon `scale: 0 → 1` with slight overshoot. Stagger matches S1 + 0.25 s. |

### Why us (`.why-us`)

| # | Element | Trigger | Duration / easing | Detail |
|---|---------|---------|-------------------|--------|
| W1 | Checklist items (`.why-us-list li`) | Scroll enter | 0.45 s, `power2.out`, stagger 0.07 | `x: -30 → 0`, opacity 0→1. Each item's check marker pops (`scale 0→1`, `back.out(2)`, 0.3 s). |
| W2 | Why-us image block | Scroll enter | 0.8 s, `power3.out` | `x: 40 → 0`, opacity 0→1. Subtle parallax: `y` scrubbed at 0.15× within its section. |

### Trust badges (`.trust-section`, 4 `.badge`)

| # | Element | Trigger | Duration / easing | Detail |
|---|---------|---------|-------------------|--------|
| T1 | Badges | Scroll enter (batch) | 0.55 s, `power3.out`, stagger 0.1 | `y: 36 → 0`, opacity 0→1. Badge icons get a one-time "stamp" feel: `scale: 1.4 → 1`, opacity 0→1, 0.4 s `power2.in`, stagger synced. |

### Stats (`.stats`) — the water-strike moment

| # | Element | Trigger | Duration / easing | Detail |
|---|---------|---------|-------------------|--------|
| ST1 | Section shockwave | Scroll enter (`start: "top 70%"`) | 1.1 s, `power2.out` | An expanding ring (border circle) scales from the section center: `scale 0 → 3`, opacity 0.6→0, 1.1 s. Two rings, second delayed 0.18 s. Pure transform/opacity. This is the visual "strike". |
| ST2 | Stat numbers (`200+`, `6+`, `98%`, `24/7`) | Scroll enter, delay 0.35 | 1.6 s, `power2.out` | Count-up via GSAP tweening an object `{v: 0}` → target, `onUpdate` writes textContent (with suffix preserved: `+`, `%`; `24/7` is static text, fade it instead — no fake counting). Numbers `y: 20 → 0` + opacity 0→1 first, then count runs. |
| ST3 | Stat labels | Scroll enter | 0.5 s, `power2.out`, delay 0.9 | Opacity 0→1, `y: 10 → 0`. |
| ST4 | Gusher particle burst | Scroll enter, fires once with ST1 | 1.4 s | Vanilla canvas overlay (or reuse hero canvas module): ~80 droplet particles fountain upward from section center with gravity, fading out. Only if canvas budget allows (skip on `save-data` / low-end — see §5). |

### Process (`.process`, 4 `.process-step`)

| # | Element | Trigger | Duration / easing | Detail |
|---|---------|---------|-------------------|--------|
| P1 | Steps | Scroll enter (batch) | 0.6 s, `power3.out`, stagger 0.12 | `y: 44 → 0`, opacity 0→1. |
| P2 | Step numbers | Scroll enter | 0.7 s, `power2.out`, delay 0.2 | Draw-in ring: an SVG circle around the number with `stroke-dashoffset` animated via CSS/GSAP (stroke animation is fine — it's not layout). Number itself counts 1→2→3→4? No — keep numbers static, the ring draws. |
| P3 | Connector line between steps | Scroll enter | 1.0 s, `power2.inOut`, delay 0.4 | Horizontal (desktop) line `scaleX 0→1` left→right, suggesting the drill's path from step to step. On mobile the steps stack; the line becomes vertical (`scaleY`). |

### Gallery (`.gallery`, 6 `.gallery-item`)

| # | Element | Trigger | Duration / easing | Detail |
|---|---------|---------|-------------------|--------|
| GA1 | Gallery items | Scroll enter (batch) | 0.7 s, `power3.out`, stagger 0.1 | `y: 60 → 0`, opacity 0→1, plus a 2°→0° rotation settle for a filmic feel. |
| GA2 | Image hover (desktop only) | Hover | 0.4 s, `power2.out` | Image `scale: 1 → 1.06` inside overflow-hidden frame; caption slides up `y: 100% → 0` over a gradient scrim. CSS transitions acceptable. |
| GA3 | Water-ripple on the strike photo | Scroll enter on that item | — | See Signature moment M3 below. |

### Testimonials (`.testimonials`, 3 `.testimonial-card`)

| # | Element | Trigger | Duration / easing | Detail |
|---|---------|---------|-------------------|--------|
| TE1 | Cards | Scroll enter (batch) | 0.65 s, `power3.out`, stagger 0.12 | Alternate: odd cards `x: -40 → 0`, even `x: 40 → 0`, opacity 0→1. |
| TE2 | Quote icon | Scroll enter | 0.5 s, `back.out(1.8)` | `scale: 0 → 1`. |

### Contact (`.contact`)

| # | Element | Trigger | Duration / easing | Detail |
|---|---------|---------|-------------------|--------|
| C1 | Contact info items | Scroll enter | 0.5 s, `power2.out`, stagger 0.08 | `x: -24 → 0`, opacity 0→1. |
| C2 | Quote form | Scroll enter | 0.8 s, `power3.out`, delay 0.15 | `y: 40 → 0`, opacity 0→1. Fields cascade: each `.form-group` `y: 16 → 0`, opacity 0→1, stagger 0.06, delay 0.35. |
| C3 | Submit button | Scroll enter | 0.6 s, delay 0.8 | Scale-in `0.9 → 1`, opacity 0→1. On successful submit (existing handler), morph to success state: button text → "Request received ✓", background shifts to aquifer teal, 0.4 s. |

### CTA + footer

| # | Element | Trigger | Duration / easing | Detail |
|---|---------|---------|-------------------|--------|
| CT1 | CTA panel | Scroll enter | 0.8 s, `power3.out` | `y: 50 → 0`, opacity 0→1; background gets a slow drifting radial highlight (opacity 0.25↔0.45, 6 s `sine.inOut` loop) suggesting sunlit water. |
| CT2 | CTA button | Scroll enter | 0.6 s, `back.out(1.5)`, delay 0.3 | `scale: 0.8 → 1`. |

---

## 3. Signature moments

### M1 — Hero: "First strike" canvas + depth counter

A full-bleed `<canvas id="hero-canvas">` absolutely positioned behind the hero content (`z-index: 0`, content at `z-index: 1`). On load:

1. **Strata bands:** three translucent horizontal layers (CSS divs, not canvas — cheaper) at staggered depths, scrubbed on scroll at 0.1×/0.25×/0.4× via ScrollTrigger. They read as soil layers sliding past as you "drill".
2. **Cuttings particles:** ~60 small particles on canvas drift *upward* (like drill cuttings flushed up the borehole), with slight horizontal wobble (`sin(t)`), sizes 1–3 px, opacity 0.15–0.5. Warm ochre color. Loop via `requestAnimationFrame`; pause when hero is off-screen (IntersectionObserver) or tab hidden.
3. **Depth counter:** mono readout "DEPTH 000 m" top-left of hero. GSAP tween 0→47 over 2.2 s `power2.inOut` on load, formatted with leading zeros. After load it becomes scroll-driven: maps hero-bottom→contact-top to 47→200 m (hands the baton to the fixed depth rail G1, which fades in as the hero counter scrolls away).

*Fallback:* if canvas 2D is unavailable, the strata bands + counter alone still carry the moment.

### M2 — Scroll-scrubbed descent (depth rail + palette shift)

A fixed right-edge rail (desktop ≥1024 px only; hidden on mobile to save paint): a thin 120 px track with a glowing marker and a mono readout (`128 m`). Implementation:

- `ScrollTrigger.create({ trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.6, onUpdate: self => {...} })`.
- Marker `y` = `progress × trackHeight` (transform only). Readout = `Math.round(progress × 200)` + " m".
- Depth milestones pop: at 50/100/150/200 m the readout briefly scales 1→1.25 (`power2.out`, 0.25 s) and a tiny tick label ("soil", "rock", "fracture zone", "aquifer 💧") fades in beside the rail for 1.2 s. Throttle: only fire when crossing thresholds.
- Coupled with G2 (the four crossfading fixed gradient layers, opacity scrubbed at the same progress). The two together make the whole page feel like one continuous borehole.

*Mobile:* rail hidden; the gradient wash (G2) still runs — it's the cheap version of the same idea.

### M3 — Water ripple on the gallery strike photo

On the "Water Strike" gallery item (`images/mutwot-water-strike.jpg`):

- When the item enters the viewport, spawn **3 expanding ripple rings** over the image: absolutely-positioned bordered circles centered on the image's visual center, `scale 0.2 → 1.6`, opacity 0.7→0, 1.6 s `power1.out`, staggered 0.35 s. Run once.
- Add a **shimmer sweep**: a diagonal white gradient band (`linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.35) 50%, transparent 60%)`) translated `x: -150% → 150%` across the image, 1.2 s `power2.inOut`, once — reads as light on water.
- Both are transform/opacity on pseudo-elements/composited layers. No WebGL, no displacement filters (too heavy for the target devices).

*Reduced-motion:* rings and sweep are skipped entirely; the photo simply fades in with GA1.

---

## 4. Tech

- **GSAP 3 + ScrollTrigger via CDN** (no build step, no npm needed for the motion layer):
  ```html
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
  ```
  Pin the version. Register once: `gsap.registerPlugin(ScrollTrigger)`.
- **Canvas effects:** vanilla JS only (hero particles H1, gusher burst ST4). One shared tiny particle helper (~60 lines) reused by both; no library.
- **Everything else:** GSAP tweens + CSS transitions for hovers. No jQuery, no animation frameworks beyond GSAP.
- **Structure for the builder:** one new file `js/motion.js` (deferred, after GSAP CDN scripts), plus a `<canvas id="hero-canvas">` and a few `data-motion` hooks in `index.html`. Keep all selectors in a `SELECTORS` map at the top of `motion.js` so a redesign of class names doesn't require hunting through tweens.
- **Master kill-switch:**
  ```js
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (REDUCED) { /* set everything to final state, register no ScrollTriggers, skip canvases */ }
  ```
  Also honor `navigator.connection.saveData === true` → skip ST4 gusher and reduce hero particles to 20.

---

## 5. Performance budget (mid-range Android is the target)

1. **Transform & opacity only.** No tweening `width`, `height`, `top`, `left`, `margin`, `background`, `box-shadow`, or `filter` in scroll-driven or looping animations. (The G2 gradient crossfade uses layered divs' *opacity*, never animated gradients.)
2. **`will-change` sparingly:** apply only to the depth-rail marker, hero canvas, and elements mid-tween via GSAP's auto handling; remove after (`onComplete: clearProps: "will-change"` or manual). Never blanket `will-change` on cards.
3. **Canvas discipline:** hero canvas DPR capped at 1.5 (`Math.min(devicePixelRatio, 1.5)`); ≤60 hero particles, ≤80 gusher particles; rAF loop pauses via IntersectionObserver when the canvas is off-screen and on `document.visibilitychange`. Gusher canvas element is created lazily on first trigger and removed from DOM 2 s after its burst ends.
4. **ScrollTrigger hygiene:** `once: true` on all enter animations; `ScrollTrigger.batch` for card grids; `invalidateOnRefresh: true` where layout can shift (fonts/images); call `ScrollTrigger.refresh()` after images load (`window.addEventListener('load', ...)`), not on every image.
5. **No layout thrash:** cache all DOM queries at init; inside `onUpdate` callbacks do arithmetic + style writes only, never reads (read `scrollTrigger.progress`, write transforms).
6. **Reduced motion = static page:** when `prefers-reduced-motion` is set, skip GSAP registration entirely and add a `reduced-motion` class that forces final states (`opacity: 1; transform: none`) via CSS. Content must never be stuck invisible if JS fails: default CSS keeps everything visible; JS adds a `js-motion` class on `<html>` at init and *only then* do pre-animation hidden states apply (progressive enhancement — no-JS still shows the full page).
7. **Frame budget:** aim ≤ 3 concurrently animating layers during scroll on mobile (rail hidden on mobile, gradient wash is 1 composited layer, cards are discrete). If `deviceMemory <= 3` (Chrome Android) or hardware concurrency ≤ 4, halve particle counts and skip ST4.
8. **Testing bar:** scroll the full page on a mid-range Android (e.g. Tecno/Infinix tier) over throttled 4G with DevTools FPS meter — target no sustained drops below 50 fps during scrubbed sections, and zero console errors with images blocked (placeholders must animate fine).

---

*Spec version 1.0 — motion designer handoff. Builder implements `js/motion.js` + hooks; content/design crews own copy and palette.*

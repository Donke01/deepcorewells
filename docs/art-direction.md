# Deep Core Wells — Art Direction
**Cinematic redesign · single-page static site · Kitale, Kenya**

---

## 1. Cinematic visual concept

**"The Descent."** The page itself is a borehole. The visitor starts at the surface — dusk light, dust, the green rig mast rising against eucalyptus trees — and scrolls *downward* through deepening darkness: amber work-lights, grinding pressure, strata of red murram earth, until the page bottoms out in the black where the drill breaks through. Then the payoff: the water strike — a backlit geyser erupting upward in white spray — and the site resurfaces into light for the quote form. Every section is a depth marker on the way down; every accent color is drawn from the actual job site (red soil, amber rig lights, mineral water), never from a generic corporate palette. The mood is industrial documentary meets thriller trailer: heavy machinery, real stakes, and one explosive moment of relief when water hits air.

---

## 2. Color palette

Dark cinematic base. All accents sampled from drilling reality — **no generic blue anywhere** (the current `#0066cc` is retired).

| Role | Name | Hex | Usage |
|------|------|-----|-------|
| Page background | Basalt | `#0D0B09` | Body bg, hero, footer — near-black with a warm umber undertone |
| Surface | Umber | `#171310` | Cards, panels, form fields |
| Raised surface | Kiln | `#241C15` | Hover states, gallery captions, badges |
| Hairline | Strata line | `#3A2E22` | Borders, dividers (thin, low-contrast) |
| Primary text | Bone | `#F2EDE4` | Headlines, body copy on dark |
| Muted text | Dust | `#A79B8A` | Secondary copy, captions, labels |
| Primary accent | Rig amber | `#E8A33D` | CTAs, key numbers, active states — the color of work-lights and hazard paint |
| Secondary accent | Murram red | `#B4502A` | Earth, depth markers, section eyebrows — Kenyan red soil from the site photos |
| Water accent | Aquifer teal | `#6FBFA8` | Water strike moments, success states, the "payoff" color — mineralized, desaturated, deliberately *not* corporate blue |
| Warning | Strike white | `#EAF3EC` | Reserved for the water-strike imagery and final CTA glow |

**Rules:** amber is the *only* CTA color. Teal appears sparingly — it must feel earned, like water itself (stats "200+ wells", the strike photo treatment, form success). Red is for texture and eyebrows, never for buttons.

---

## 3. Typography

Two Google Fonts, loaded via CDN with `display=swap`. One preconnect each; total added weight ~30–45 KB.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

- **Display — Oswald (500/600/700), always uppercase, tight letter-spacing.** Rationale: a tall, condensed industrial sans that visually echoes the drill mast itself — vertical, engineered, urgent. It gives headlines a film-poster gravity ("WATER, 120 METRES DOWN") that the current Segoe UI never could. Use for H1/H2, stat numerals, nav logo, button labels.
- **Body — Inter (400/500/600).** Rationale: neutral, extremely legible at small sizes on mid-range Android screens, and it renders cleanly without hinting issues. It disappears so the display type and photography can carry the drama. Use for paragraphs, form labels, captions.

Fallback stack: `Oswald, 'Arial Narrow', sans-serif` / `Inter, system-ui, -apple-system, 'Segoe UI', sans-serif` — so the layout holds even if fonts are blocked.

---

## 4. Image treatment (CSS-only)

The two site photos (`images/mutwot-drilling-rig.jpg`, `images/mutwot-water-strike.jpg`) are vertical phone shots. Grade them into the film with pure CSS — no re-exports, no build step:

**Base filmic grade (apply to all photography):**
```css
.graded img {
  filter: saturate(0.82) contrast(1.08) brightness(0.92);
}
```
Desaturate slightly, crush the blacks a touch — this unifies phone photos and future Cloudinary uploads into one "shot on the same day" look.

**Cinematic overlays (pseudo-elements, GPU-cheap):**
- *Warm shadow wash:* `linear-gradient(180deg, rgba(13,11,9,0) 40%, rgba(13,11,9,0.55) 100%)` over every photo — grounds the image in the page background.
- *Amber lift:* a `mix-blend-mode: overlay` layer with `linear-gradient(135deg, rgba(232,163,61,0.14), rgba(180,80,42,0.10))` — pushes highlights toward rig-light warmth without touching the file.
- *Vignette:* `radial-gradient(ellipse at center, transparent 55%, rgba(13,11,9,0.5) 100%)` on hero/gallery images for the anamorphic feel.
- *Grain:* one tiny inline SVG `feTurbulence` data-URI at `opacity: 0.05`, tiled over full-bleed images only. Cheap on mobile GPUs; skip it on small thumbnails.

**Per-photo direction:**
- *Water strike* → the hero background. `object-fit: cover; object-position: center 30%` to keep the geyser plume in frame on portrait phones. Heavy bottom scrim (`rgba(13,11,9,0.72)`) so the bone-white headline sits legibly over the spray. This is the only full-bleed image on the page — everything else bows to it.
- *Drilling rig* → the "Why choose us" / process side image. Keep the red murram foreground; grade slightly warmer (`sepia(0.12)`) to make the soil glow against the dark section.
- *"Coming soon" placeholder cards* → kill the 🚧 emoji. Replace with dark strata cards: layered CSS gradients suggesting geological cross-section bands in umber/murram tones, with small caps text "PHOTO COMING SOON". They should look intentional, not empty.
- *Cloudinary uploads* (dynamic gallery): the JS already injects `<img loading="lazy">` — add the `.graded` class and `decoding="async"` in the injection template so new photos inherit the grade automatically.

**Performance rules:** no `backdrop-filter` over large areas; no `background-attachment: fixed` (janky on Android — fake parallax with a slow `translateY` on scroll instead, or skip it); all motion via `transform`/`opacity` only.

---

## 5. Section-by-section storyboard

The scroll is a descent: sections darken from dusk amber at the top to near-black at the process, then the strike brings light back for contact.

**Header/nav** — Slim, translucent basalt bar with a hairline strata border; bone Oswald wordmark with a small amber drill-bit mark (CSS diamond, no image). On scroll it solidifies to `#0D0B09`. Mood: control room — quiet, engineered.

**Hero** — Full-viewport water-strike photo, graded dark, geyser plume rising behind the headline. Eyebrow in murram red caps: "KITALE · DRILLING COUNTRYWIDE". H1 in huge Oswald: "WATER, 120 METRES DOWN." Sub in Inter: the existing fact line (expert drilling, pump installation, water treatment). One amber CTA ("Get free quote") — the only bright object on screen, like a work-light in the dark. A subtle animated depth readout ("−000 m" ticking down on load, then holding) sells the descent motif. Mood: the trailer's opening shot.

**Services** — Dark umber surface, six cards in near-black Kiln with hairline borders. Replace the emoji icons with minimal line glyphs in amber (CSS/SVG strokes: drill bit, gauge, droplet, wrench, flask, siren). Cards lift on hover with an amber top-edge glow. Mood: equipment laid out on the truck bed before the job — orderly, professional, ready.

**Why choose us** — Split: left, the checklist in bone Inter with amber check ticks (keep every fact: since 2020, licensed/bonded/insured, certified technicians, transparent quotes, same-day emergency, satisfaction guarantee, latest equipment, free testing); right, the graded rig photo full-bleed in its frame, red soil glowing. Mood: the crew at work — human, credible, dusty.

**Trust badges + stats** — Merge into one "credentials band": four badges (Licensed, WRA Approved, NEMA Compliant, Countrywide) as quiet outlined chips, then the stats row huge in Oswald — "200+ / 6+ / 98% / 24/7" — with the numerals in amber and a thin teal underline that draws itself on scroll into view. Mood: the spec sheet, stamped and certified.

**Process** — The darkest section: pure basalt. Four steps become depth markers on a vertical drill-string line (desktop) / stacked (mobile): "−30 m CONSULT", "−60 m SURVEY", "−120 m DRILL", "STRIKE — INSTALL & TEST". Step numbers in amber circles; the connecting line glows faintly amber. The final step flips to teal — the breakthrough. Mood: going down, pressure building, then release.

**Gallery (Completed Projects)** — "THE STRIKE REEL." Large cinematic frames, 16:10 crops, vignette + grain. The two Mutwot photos lead (rig, then water strike); captions in small caps with location ("MUTWOT COMPREHENSIVE SCHOOL — SIMAT, ELDORET"). Placeholder cards become strata-textured dark tiles. Cloudinary uploads inherit the grade automatically. Mood: the money shots — proof, not promises.

**Testimonials ("Why boreholes matter")** — Keep the three existing cards and their facts (water security, farming/irrigation, lasting investment — these are education, not reviews, and that's fine). Restyle as pull-quotes: large Oswald excerpt in bone, thin murram-red left rule, attribution in dust caps. Slightly lighter surface so the section breathes before the finale. Mood: neighbors talking over the fence — warm, plain-spoken.

**Contact** — The resurface: background lifts from black to a deep teal-black gradient, like coming up into water-light. Left: contact facts unchanged and prominent (0706 716 310 as a big amber tap-to-call button on mobile, info@deepcorewells.com, Mega Centre 3rd Floor Makasembo Road Kitale, hours Mon–Fri 8–6 / Sat 8–2 / Sun emergency). Right: the quote form on a Kiln card, amber focus rings, amber submit. Mood: daylight after the descent — clear, easy, one obvious action.

**CTA + footer** — Final CTA: strike-white headline on basalt with a faint teal radial glow behind the button ("the water is down there"). Footer in basalt, hairline dividers, dust-colored links; keep all business facts and the © 2026 line. Mood: credits rolling.

---

## 6. Motion language (for the motion designer)

- **Reveal system:** `IntersectionObserver`, elements translate `24px → 0` + fade over `0.7s` with `cubic-bezier(0.2, 0.7, 0.2, 1)`. Stagger cards by `90ms`. Transform/opacity only — 60fps on mid-range Android.
- **Signature moments:** hero depth counter ticking down on load; stat numerals counting up when scrolled into view; the process drill-line drawing downward (scaleY) as you scroll; the teal underline drawing under stats.
- **Restraint:** no parallax on the hero image on mobile (perf); honor `prefers-reduced-motion` by disabling all of the above and showing final states.
- **Easing personality:** slow-in, decisive-out — machinery doesn't bounce.

---

## 7. Hard constraints (do not break)

- Static single page, no build step; keep it fast on mid-range Android (lazy images, minimal JS, system-fallback fonts).
- All business facts stay accurate: Kitale base (Mega Centre, 3rd Floor, Makasembo Road), countrywide drilling, since 2020, licensed/bonded/insured, WRA permits, NEMA compliance, 200+ wells / 6+ years / 98% / 24/7, phone 0706 716 310, info@deepcorewells.com, stated hours.
- `admin.html` is untouched. The Cloudinary gallery loader in `index.html` keeps working — new uploads must inherit the photo grade.
- No generic blue. Ever.

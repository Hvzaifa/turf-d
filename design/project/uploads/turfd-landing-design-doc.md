# Turf'd — Pre-Launch Landing Page Design Specification

A complete, build-ready design document. Any AI design tool (Figma AI, v0, Lovable, Framer AI) should be able to reproduce the full page from this spec alone.

---

## 1. Product Context

| Field | Value |
|---|---|
| Product | **Turf'd** — on-demand sports venue booking platform |
| Market | Pakistan; launch city Islamabad, Q4 2026 |
| Sports | Futsal, cricket nets, padel, 5-a-side |
| Page type | Single-page pre-launch waitlist landing page |
| Audiences | (a) Players 18–35 booking courts, (b) Court owners listing venues |
| Core promise | "Book a court in seconds. Own one? List it in minutes." |
| Emotional tone | Floodlit night match. Kinetic, confident, street-sport swagger — not corporate SaaS. |

**Key differentiators to communicate:** live map discovery, atomic "Slot-Lock" (zero double-bookings), EasyPaisa/JazzCash instant payments, owner revenue dashboard.

---

## 2. Design System

### 2.1 Color tokens (BISOL Labs brand palette)

| Token | Hex | Role |
|---|---|---|
| `--ink` / `--background` | `#04301F` | Page background, dark base |
| `--turf` / `--secondary` | `#106043` | Mid green: fills, badges, gradients |
| `--turf-glow` / `--primary` / `--accent` | `#34D498` | Bright mint: accents, glows, CTAs |
| `--turf-deep` | `#0A3A26` | Deep green for inner surfaces |
| `--amber-glow` | `#7DEDBF` | Light mint, secondary highlight |
| `--chalk` / `--foreground` | `#F5FBF7` | Primary text |
| `--card` / `--popover` | `#072D1E` | Card surfaces |
| `--muted` | `#0A3A26` | Muted surface |
| `--muted-foreground` | `#8FBFA6` | Muted text |
| Border | `rgba(255,255,255,0.08)` | Hairline borders |
| Input | `rgba(255,255,255,0.10)` | Input borders |

Everything is one cohesive green system — **no amber, no purple, no blue**. There is no light mode; the page is permanently dark.

Text opacity ladder on `--chalk`: 100% (headlines), 80% (nav links), 70% (lead paragraphs), 60% (body copy), 50% (footer copy), 40% (labels/meta).

### 2.2 Typography

| Role | Font | Treatment |
|---|---|---|
| Display / headlines | **Anton** (fallback Impact) | UPPERCASE, letter-spacing -0.01em, line-height 0.85 |
| Body / UI | **Inter Tight** (400–800) | Sentence case |
| Meta / labels / data | **JetBrains Mono** (400, 600) | UPPERCASE, letter-spacing 0.25–0.4em, 10–12px |

Fluid type scale:
- H1: `clamp(3.2rem, 9vw, 7.5rem)`
- Section H2: `clamp(2.5rem, 6vw, 5rem)`
- Final CTA H2: `clamp(3rem, 10vw, 9rem)`
- Card H3: 24px → 30px
- Lead paragraph: 16px → 18px
- Mono eyebrow: 11–12px

### 2.3 Spacing, radius, elevation

- Container: `max-width 1280px`, padding `24px` mobile / `40px` desktop.
- Section rhythm: `112px` mobile / `160px` desktop vertical padding. Final CTA: `128px / 192px`.
- Radii: pills `999px`, cards `24px`, bento cards `24px`, phone bezel `40px`, inner screen `32px`, small chips `8px`.
- Glass surface recipe: `background: rgba(255,255,255,0.04)`, `border: 1px solid rgba(255,255,255,0.10)`, `backdrop-filter: blur(16px)`.
- Glow recipe: `box-shadow: 0 0 30px var(--turf-glow)` for dots/marks; `text-shadow: 0 0 40px rgba(52,212,152,0.6)` for glowing words.

### 2.4 Reusable background utilities

1. **`bg-stadium`** — layered radial gradients over ink:
   `radial-gradient(ellipse 80% 60% at 50% 0%, turf 22%, transparent 60%)` +
   `radial-gradient(ellipse 60% 40% at 80% 100%, mint 18%, transparent 60%)` + `#04301F`.
2. **`bg-pitch-lines`** — 64×64px grid of 1px lines in `turf @ 12%` opacity (evokes pitch markings). Used at 20–40% opacity.
3. **`marquee-mask`** — horizontal mask fading edges: transparent → black 8% → black 92% → transparent.
4. **`btn-turf`** — primary button: `linear-gradient(180deg, #34D498, #106043)`, ink-colored bold text, 1px mint ring, `0 10px 30px -8px` mint shadow, inset top white highlight. Hover: translateY(-2px) + intensified shadow.
5. **`live-dot`** — 8px pulsing mint dot with 12px glow, preceding a label; 1.6s ease-in-out pulse between opacity 1/scale 1 and opacity .4/scale .9.

---

## 3. Global Behaviors

| Behavior | Spec |
|---|---|
| Smooth scroll | Lenis momentum scrolling, duration 1.15, exponential easing, wheel-smoothing on |
| Scroll reveal | Elements enter with `y: 40 → 0`, `opacity: 0 → 1`, 0.9s `power3.out`, 0.08s stagger, triggered at `top 80%` of viewport, fires once |
| Custom cursor | Desktop only (`hover: hover`). 8px solid mint dot follows at 0.15s ease; 36px mint-outlined ring trails with 0.12 lerp and `mix-blend-mode: difference` |
| Magnetic buttons | On mousemove, button translates 25% of cursor offset (0.5s power3.out); on leave, returns with `elastic.out(1, 0.4)`; tap scales to 0.96 |
| Card hover | Lift `y: -6px`, spring (stiffness 300, damping 20), border brightens to `white/20` |
| Reduced motion | All decorative loops (marquee, float, pulse, typing) should freeze; reveals become instant fades |

---

## 4. Page Structure (top → bottom)

```text
┌──────────────────────────────────────────────┐
│ FLOATING NAV  (fixed logo TL · menu btn TR)  │
├──────────────────────────────────────────────┤
│ 01 HERO         copy + waitlist | phone mock │
├──────────────────────────────────────────────┤
│    MARQUEE      infinite ticker strip        │
├──────────────────────────────────────────────┤
│ 02 PROCESS      toggle: Player / Owner       │
│                 illustration | 3 steps       │
├──────────────────────────────────────────────┤
│ 03 VALUE BENTO  4 cards, 6-col × 2-row grid  │
├──────────────────────────────────────────────┤
│ 04 CHAT FAQ     iMessage-style Q&A           │
├──────────────────────────────────────────────┤
│    FINAL CTA    giant headline + email form  │
├──────────────────────────────────────────────┤
│    FOOTER       4-col + legal bar            │
└──────────────────────────────────────────────┘
```

---

## 5. Section Specifications

### 5.0 Floating Nav (fixed, z-50)

- **Top-left:** 36px mint-filled circle with 30px glow + wordmark `TURF'D` in Anton 24px, letter-spacing wide.
- **Top-right:** 48px circular glass button containing a 2-line hamburger (20×2px bars) that morphs into an X on open.
- **Drawer:** slides in from right, full height, `max-width 448px`, ink at 95% + blur(24px), spring (stiffness 220, damping 28).
  - Nav items in Anton 48px: `Hero, Process, Why Turf'd, FAQ, Join`, each prefixed by a mono index `01–05` in mid-green. Hover turns item mint.
  - Bottom rule + `hello@turfd.pk · Islamabad, PK` in 14px at 60% opacity.

### 5.1 Hero (`#hero`, min-height 100svh)

**Background layers (back→front):** parallax photo of a floodlit futsal court at night (object-cover, 40% opacity, scroll parallax `y: 0→30%`, `scale: 1.05→1.25`) → vertical ink gradient (60% → 40% → 100%) → pitch-lines grid at 30% → `bg-stadium` base.

**Corner meta (mono 11px, 25% letter-spacing, 50% chalk):** left = live-dot + `Waitlist open · beta seats limited`; right (desktop only) = `33.6844°N — 73.0479°E`.

**Layout:** 2-column grid `1.15fr / 1fr`, gap 48px; stacks to single column below `md`.

**Left column:**
1. Glass pill badge: mint dot + `Launching Islamabad · Q4 2026` (mono, uppercase).
2. H1, four masked lines that slide up from `yPercent: 110` with 0.08s stagger, 1.1s `power4.out`:
   - `Book a court`
   - `in ` + **seconds.** (mint + glow)
   - `Own one?` (chalk at 60%)
   - `List it in ` + **minutes.** (mint)
3. Lead paragraph (max-width 512px, chalk 70%): "Real-time discovery. Atomic slot-lock. Instant EasyPaisa & JazzCash checkout. Turf'd ends the group-chat scramble and the double-booking chaos — for good."
4. **Waitlist form:** pill-shaped glass bar, 1.5 padding; transparent email input (`you@team.pk`), magnetic `btn-turf` submit labelled `Join the Waitlist`. On success input is disabled, placeholder becomes "You're on the list — see you on the pitch." and button reads `✓ You're in`.
5. Sport badges row (mono uppercase, mint ◆ bullets): `Futsal · Cricket nets · Padel · 5-a-side`, scale-in staggered.

**Right column — Phone Mockup (aspect 9:19, max-width 384px):**
- Radial mint glow bleed behind, blurred 32px at 40% opacity.
- Bezel: rounded 40px, gradient `#1A2420 → #0A1210`, 1px white/10 border, notch pill 96×20px, deep shadow `0 50px 100px -20px rgba(0,0,0,.7)`.
- Idle float animation: ±14px vertical, 1° rotation, 6s loop.
- Mouse-tracked pseudo-3D tilt: rotateY ±18°, rotateX ∓18°, perspective 900; releases with `elastic.out(1,0.5)`.
- Auto-cycles 3 screens every 3.2s with crossfade (0.4s):
  1. **Map:** pitch-line grid + green radial, 3 spring-in mint pins with black label chips (`Turf Xpress`, `Green Arena`, `Play Factory`), top search bar `📍 Courts near F-7 · 8 open now`.
  2. **Slot picker:** title `Green Arena · Sat`, 3×2 grid of times `6PM–11PM`; index 2 selected (mint border + mint tint), index 4 disabled (strikethrough, 30% opacity); bottom card `◆ SLOT-LOCK / Reserved for you · 60s`.
  3. **Confirmation:** 80px mint check circle springing in, `You're on the pitch`, mono line `Sat · 8:00 PM · Court B · ₨ 2,400`, chips `EasyPaisa ✓` and `Team notified`.
- Two floating glass stat cards (desktop only): left `Slot locked / 00:07` (mint, Anton), right `Owner revenue / + ₨ 48k`.

**Scroll cue:** bottom-center mono `Scroll · Kick off`, 40% letter-spacing.

### 5.2 Marquee Strip

Full-bleed band on ink, 24px vertical padding, hairline borders top and bottom. Anton 30px → 48px at 70% chalk, mint ◆ separators, edge-masked, translating -50% over 32s linear, infinite (content duplicated for seamlessness).

Items: `127 courts onboarding · F-7 · Islamabad · Turf Xpress · Green Arena · Play Factory · DHA Turfs · 9,432 players waitlisted · Cricket · Futsal · Padel · The Pitch Club · Kickstart Arena · Bahria Sports · Zero double-bookings`.

### 5.3 Process — Two-Sided Toggle (`#process`)

**Header row (flex, ends aligned):**
- Left: mono eyebrow `02 · The Game Plan` (mid-green) and H2 `Two sides. / One <mint>unfair</mint> advantage.`
- Right: pill segmented toggle in glass; animated gradient thumb (spring stiffness 340, damping 30) sliding between `I'm a Player` and `I'm a Court Owner`. Active label ink-colored; inactive chalk 60%.

**Body grid `1fr / 1.4fr`, gap 64px:**
- **Left card:** square, radius 24px, border white/10. Background = green radial (positioned 30%/30% for player, 70%/30% for owner) over `#0F1A15`, plus pitch-lines at 20%. Illustration crossfades on toggle (`opacity 0→1, scale .9→1, y ±20`, 0.5s). Bottom-left mono caption: `For the squad` / `For the operator`.
- **Right list:** three step cards, each entering from `x: 30` with 0.12s stagger (spring 220/22). Card = radius 16px, white/2 fill, white/10 border; hover lifts 4px and brightens. Contents: giant Anton number (48–72px, mint with 30px glow), H3 title, 16px body at 60%, and a 40px circular `→` chip that turns mint on hover.

| | Player track | Owner track |
|---|---|---|
| 01 | **Find a Court** — Live map of every open turf near you — filtered by sport, price, and vibe. | **List in Minutes** — Snap photos, set prices, done. No spreadsheets, no back-and-forth calls. |
| 02 | **Slot Lock** — Tap once. The slot is atomically yours for 60 seconds while you pay. | **Automate Slots** — Dynamic pricing + auto-distribution. Empty slots get filled while you sleep. |
| 03 | **Play & Enjoy** — Show up, scan in, run the game. Split the bill with your squad in-app. | **Track Revenue** — EasyPaisa & JazzCash settle instantly. Live cash-flow, one clean screen. |

### 5.4 Value Bento (`#why-turf-d`)

Eyebrow `03 · Why Turf'd`; H2 `Built for the messy reality of <mint>local sport.</mint>`

Grid: 6 columns × 2 rows on desktop (16px gap), single column on mobile. Card shell: radius 24px, gradient `white/4 → white/1`, white/10 border, blur, 24–32px padding, decorative blurred green orb at top-right that intensifies on hover, hover lift `y: -6`.

| Span | Eyebrow | Title | Body | Visual |
|---|---|---|---|---|
| 4 cols | Discovery | A live map of every court around you. | No more calling five owners. No more scrolling three Facebook groups. See what's open, priced, and lit right now. | 160–208px mini-map: pitch grid + green radial + 5 mint pins pulsing (scale 1→1.3→1, 2s loop, staggered 0.3s) |
| 2 cols | Slot-Lock™ | Zero double-bookings. Ever. | Enforced atomically at the data layer. | 3×3 square grid; all at 30% opacity except center square, which lights mint with 20px glow (staggered 0.06s reveal) |
| 2 cols | Payments | EasyPaisa & JazzCash, one tap. | The rails your players already use. | Two mono chips: `EasyPaisa ✓` (mid-green tint) and `JazzCash ✓` (mint tint) |
| 4 cols | Owner Cockpit | Every field, every slot, one dashboard. | Bookings, cash-flow, court utilization — no more juggling WhatsApp, ledgers, and receipts. | 4 stat tiles: Bookings **342** (mint), Utilization **87%** (chalk), Revenue **₨ 4.8L** (mint), Fields **6** (chalk) |

### 5.5 Chat FAQ (`#faq`, max-width 896px)

Eyebrow `04 · The Group Chat`; H2 `Ask the <mint>team.</mint>`

Presented as a messaging thread:
- **Question bubble (right aligned, clickable):** glass bubble, radius 24px with 6px top-right corner, label `You` in mono 10px at 40%, question text 16–18px. Followed by a 36px circular `U` avatar. Hover brightens border/fill.
- **Answer bubble (left aligned, accordion):** 36px mint avatar `T` in Anton with mint glow, then a bubble with gradient `#106043 → #0A3A26`, ink-colored text, `0 10px 40px -10px` green shadow, radius 24px with 6px top-left corner. Header line: `Turf'd · typing done`. Answer body renders with a typewriter effect (2 characters per animation frame).
- Expand/collapse: height auto + fade + `y: -8`, 0.35s cubic-bezier(.2,.8,.2,1). First item open by default; only one open at a time.

**FAQ content:**
1. *Yaar, when do you actually launch?* — We're booting up in Islamabad in Q4 2026, with Lahore and Karachi rolling out weeks later. Waitlist members get 3 days of early access before the public open.
2. *Which cities are you starting with?* — Islamabad first — full coverage of F-sectors, Bahria and DHA. Lahore + Karachi close behind. Drop your city when you join and we'll prioritise onboarding there.
3. *Is it free to join the waitlist?* — 100% free. Waitlist members get founder pricing (locked forever), zero booking fees for the first 3 months, and a private community channel.
4. *How do mobile wallet payments actually work?* — One tap. Pick EasyPaisa or JazzCash at checkout, confirm on your wallet, done. Owners are settled instantly — no 5-day bank clearing, no ledger hassle.

### 5.6 Final CTA (`#join`)

Centered, max-width 1024px, 128–192px vertical padding. Background stack: `bg-stadium` + pitch-lines at 30% + a 70vh circular mint radial blurred 60px behind the headline.

- Glass pill: live-dot + `Beta seats open · 3,214 left`.
- H2 at `clamp(3rem,10vw,9rem)`: `The <mint glow>whistle</mint>` / `is about to blow.`
- Sub: "Get first access, founder pricing, and 3 months of zero booking fees. One field. One tap. One waitlist."
- Email form: same pill pattern as hero but larger (18px input, 32px×16px button).
- Reassurance row (mono uppercase, 50% chalk): `◆ No spam, ever · ◆ Unsubscribe anytime · ◆ Owners: reply for onboarding`.

### 5.7 Footer

Top hairline border, ink background, 56px vertical padding. Grid `2fr 1fr 1fr 1fr`:
1. Logo mark + `TURF'D`, plus "Book a court in seconds. Own one? List it in minutes. Islamabad, Q4 2026."
2. **Company:** About, Careers, Press
3. **Legal:** Privacy, Terms, Cookies
4. **Contact:** `hello@turfd.pk` (mint on hover, animated underline) + two 36px circular social chips `IG`, `IN` that outline mint on hover.

Bottom bar (mono 10px, 40% chalk, split left/right): `© 2026 Turf'd Technologies · Islamabad, PK` and `Built for the beautiful chaos of local sport.`

---

## 6. Imagery Brief

| Asset | Description |
|---|---|
| `hero-pitch.jpg` (1920×1200) | Cinematic night photo of a floodlit futsal/turf court, wet-look surface, strong green cast, shallow depth, no visible faces |
| `players-illo.png` | Stylized vector illustration of South Asian athletes celebrating, mint/green palette, transparent background |
| `owner-illo.png` | Stylized vector illustration of a court owner reviewing bookings on a phone/tablet, mint/green palette, transparent background |

---

## 7. Responsive Rules

| Breakpoint | Changes |
|---|---|
| `< 768px` | All grids collapse to single column. Phone mockup centers under hero copy; floating stat cards, right corner coordinate meta, and custom cursor are hidden. Section padding drops to 112px, container padding to 24px. Display type reaches the low end of its clamp. Drawer nav becomes full-width. |
| `≥ 768px` | Hero 1.15fr/1fr, process 1fr/1.4fr, bento 6×2, footer 2fr/1fr/1fr/1fr; custom cursor and magnetic hover enabled. |
| `≥ 1280px` | Content capped at 1280px and centered; type at the top of its clamp range. |

---

## 8. Accessibility & SEO

- Contrast: chalk on ink ≈ 15:1; never place mint text below 60% opacity on ink.
- Every icon-only control has an `aria-label` (menu button, social links).
- Decorative images use empty `alt`; illustrations are described.
- Focus states must remain visible on all inputs and buttons (mint ring).
- Single H1 (hero); section H2s follow in order; anchors `#hero #process #why-turf-d #faq #join`.
- Title: `Turf'd — Book a court in seconds. List one in minutes.`
- Meta description: `Turf'd is the on-demand booking platform for futsal, cricket, padel & more. Instant slot-lock for players. Zero double-bookings for court owners. Launching Islamabad Q4 2026.`
- Keywords: futsal booking Islamabad, cricket net booking, court booking Pakistan, turf booking app, padel court booking, EasyPaisa court booking, JazzCash sports.
- og:type `website`, twitter:card `summary_large_image`, theme-color `#0a1410`.

---

## 9. Zero-Slop Checklist

- No purple/indigo gradients, no Inter/Poppins defaults, no generic three-column feature row.
- Every section carries a mono numeric eyebrow (`02 ·`, `03 ·`, `04 ·`) — a consistent editorial motif.
- Repeating motifs to preserve: the mint ◆ diamond separator, the pitch-line grid, the live pulsing dot, and glass pills with hairline borders.
- One dominant color (deep green ~70% of surface), one accent (mint), one neutral (chalk). Nothing else.

# FLEX LAB

India's premium creative agency — **events, branding, gifting, social, digital, and print** under one roof, plus the **BLVCKCARD** premium NFC business card.

A fully static, animated multi-page website with a custom premium interaction layer, theme switcher, and modern creative-agency-grade visuals.

---

## ✨ Features

- **6 Labs** — Branding, Events, Gift, Social, Digital, Print — each with its own dedicated page
- **BLVCKCARD** — featured NFC business card product spotlight
- **9 theme palettes** in a live side panel (FlexLab, Carnival, Solar, Volt, Obsidian, Midnight, Burgundy, Pine, Pewter, Cognac) — recolors accents, hero glow, blobs, and CTAs in real time
- **Premium interaction layer** (`premium.js` + `premium.css`):
  - Liquid-glass outlined hero text with cursor-driven prismatic glow
  - SVG goo-filter liquid blobs trailing the cursor in the hero
  - Sticky-scroll "Why FlexLab" benefits section
  - Atmospheric mood-zone color washes per section
  - Floating glass dock navigation
  - Section progress counter
  - Confetti bursts on CTA click
  - Smooth cursor spotlight
- **Animation library** (`animations.js`):
  - Preloader with letter-by-letter logo reveal
  - GSAP ScrollTrigger reveals
  - Magnetic buttons
  - 3D card tilt
  - Text scramble & gradient-scroll fills
- **Clash Display** brand typography
- Fully responsive (down to mobile)
- Touch / `prefers-reduced-motion` aware

---

## 📂 Project structure

```
.
├── index.html           # Home — flagship with hero, labs grid, benefits, BLVCKCARD spotlight
├── branding.html        # Branding Lab
├── events.html          # Events Lab
├── gifting.html         # Gift Lab
├── social.html          # Social Lab
├── digital.html         # Digital Lab
├── print.html           # Print Lab
├── blvckcard.html       # BLVCKCARD product page
├── contact.html         # Contact form
├── style.css            # Shared design tokens, nav, footer, marquees, cards
├── anim.css             # Animation companion CSS (preloader, cursor, horiz, etc.)
├── premium.css          # Premium interaction layer styles
├── main.js              # Mobile menu, scroll reveal, particle canvas, counters
├── animations.js        # GSAP animations, preloader, text reveals
├── premium.js           # Theme panel, liquid hero, dock, benefits scroll, etc.
└── logo.svg             # Brand mark
```

---

## 🚀 Running locally

It's pure HTML/CSS/JS — no build step required. Just open `index.html` in a browser, or serve the folder:

```bash
# Python 3
python -m http.server 8080

# Node (with `serve`)
npx serve .

# VS Code Live Server extension — right-click index.html → Open with Live Server
```

Then visit `http://localhost:8080`.

---

## 🎨 Theme system

Click the palette button on the left edge of any page to switch between 9 curated palettes. Selection persists via `localStorage`. Default is `flexlab` (royal violet + champagne gold on deep navy).

---

## 📦 Tech

- Pure HTML5 / CSS3 / vanilla JS
- GSAP 3.12.5 (animations + ScrollTrigger) — loaded from CDN
- Clash Display font — loaded from FontShare
- Inter + Space Grotesk — loaded from Google Fonts

No npm, no framework, no build tools.

---

© FLex LAB — All rights reserved.

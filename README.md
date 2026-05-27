# ✦ Ember & Grain — Specialty Coffee Shop & Restaurant Website

A production-grade, single-page website for a modern specialty coffee shop and restaurant. Built with pure semantic HTML5, mobile-first CSS3, and vanilla JavaScript — no frameworks, no dependencies.

---

## 📸 Preview

> Open (https://akerolos.github.io/ember-grain-restaurant/) in a browser to view the site..

**Sections:** Sticky Header · Hero · Our Story · Menu (Tabbed) · Testimonials Slider · Reservation Form · Footer

---

## ✨ Features

### Design & UX
- **Dark, cozy aesthetic** — charcoal `#1A1A1A` base, warm gold `#D4AF37` accents, off-white typography
- **Fully responsive** — mobile-first layout that scales gracefully from 320px to 4K
- **Smooth animations** — entrance animations on hero text, card reveal on scroll, subtle hover micro-interactions
- **Accessible** — WCAG 2.1 AA compliant; semantic HTML, ARIA labels, roles, live regions, and full keyboard navigation
- **Performance-conscious** — no external JS/CSS frameworks; optimised CSS transitions with `will-change` awareness and `prefers-reduced-motion` support

### Components

| Component | Details |
|---|---|
| **Sticky Header** | Transparent on load, frosted-glass blur on scroll via `scrolled` class |
| **Mobile Hamburger Menu** | Animated burger → ✕, slide-in side drawer, focus trap, overlay click-to-close, Escape key support |
| **Hero Section** | Staggered entrance animations, ambient glow effects, grain texture overlay, stats bar |
| **Our Story** | Two-column editorial layout, image frame with decorative badge |
| **Menu Grid** | Accessible ARIA tab pattern (roving tabindex), animated panel transitions, 6-card grid per category |
| **Testimonials Slider** | Auto-playing carousel with touch/swipe, keyboard arrows, dot indicators, pause-on-hover/focus |
| **Reservation Form** | Real-time inline validation, loading state simulation, success confirmation, accessible error messaging |
| **Footer** | Multi-column layout, social links, opening hours, copyright auto-year |

---

## 🗂 File Structure

```
ember-and-grain/
├── index.html      # Semantic HTML5 markup — all sections and content
├── style.css       # Mobile-first CSS3 with Custom Properties (design tokens)
├── main.js         # Vanilla JS — IIFE modules, no dependencies
└── README.md       # This file
```

---

## 🛠 Technology Stack

| Layer | Technology | Notes |
|---|---|---|
| Markup | HTML5 | Semantic elements, ARIA roles/attributes, accessible forms |
| Styling | CSS3 | Custom Properties, Flexbox, Grid, `clamp()`, `@media`, animations |
| Scripting | Vanilla JavaScript (ES6+) | IIFE architecture, `IntersectionObserver`, async/await |
| Fonts | Google Fonts | Cormorant Garamond, Playfair Display, DM Sans |
| Icons | Inline SVG | No icon library dependency |
| Build Tools | None | Zero-dependency; open `index.html` directly |

---

## 🚀 Getting Started

### Option 1 — Direct Open
Simply open `index.html` in any modern browser:
```bash
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux
```

### Option 2 — Local Dev Server (recommended for best experience)
```bash
# Using Python
python3 -m http.server 8080

# Using Node.js (npx)
npx serve .

# Using VS Code
# Install the "Live Server" extension, then right-click index.html → "Open with Live Server"
```
Then visit `http://localhost:8080` in your browser.

---

## 🏗 Architecture

### CSS — Design Token System
All visual decisions are defined as CSS Custom Properties at the `:root` level in `style.css`, making global restyling a one-place change:

```css
:root {
  --color-bg:    #1A1A1A;   /* Base background */
  --color-gold:  #D4AF37;   /* Primary accent */
  --color-text:  #F0EBE1;   /* Primary text */
  --font-display: 'Cormorant Garamond', serif;
  --font-body:    'DM Sans', sans-serif;
  /* ... spacing, radius, shadow, transition tokens */
}
```

### JavaScript — IIFE Module Pattern
All JavaScript is wrapped in a single Immediately Invoked Function Expression (IIFE) to avoid polluting the global scope. Each feature is its own internal module with a clean `init()` API:

```javascript
(function () {
  'use strict';

  const headerModule    = (function () { /* ... */ return { init }; })();
  const menuToggleModule = (function () { /* ... */ return { init }; })();
  const tabsModule      = (function () { /* ... */ return { init }; })();
  const sliderModule    = (function () { /* ... */ return { init }; })();
  const formModule      = (function () { /* ... */ return { init }; })();
  const utilsModule     = (function () { /* ... */ return { init }; })();

  function bootstrap() {
    headerModule.init();
    menuToggleModule.init();
    // ...
  }

  document.addEventListener('DOMContentLoaded', bootstrap);
})();
```

### JavaScript Modules Overview

| Module | Responsibility |
|---|---|
| `headerModule` | Adds `.scrolled` class to header on scroll (throttled via `requestAnimationFrame`) |
| `menuToggleModule` | Controls mobile nav open/close, focus trap, overlay, keyboard handling |
| `tabsModule` | ARIA-compliant tab switching with roving tabindex and arrow-key navigation |
| `sliderModule` | Auto-playing slider with touch swipe, dot indicators, keyboard support, pause-on-hover |
| `formModule` | Per-field validation rules engine, inline error display, loading simulation, success state |
| `utilsModule` | Footer year, scroll spy active nav highlighting, `IntersectionObserver` card reveals |

---

## ♿ Accessibility

This project targets **WCAG 2.1 Level AA** compliance:

- **Semantic HTML5** — `<header>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<nav>`, `<address>`, `<blockquote>`, `<figure>` used appropriately
- **ARIA** — `role`, `aria-label`, `aria-expanded`, `aria-controls`, `aria-selected`, `aria-live`, `aria-required`, `aria-invalid`, `aria-describedby`, `aria-hidden` applied throughout
- **Keyboard navigation** — All interactive elements reachable and operable by keyboard; tab switching uses roving tabindex with arrow keys; modal nav traps focus
- **Focus indicators** — Visible `:focus-visible` outlines using the gold accent color
- **Colour contrast** — All text/background combinations meet 4.5:1 minimum ratio
- **Reduced motion** — `@media (prefers-reduced-motion: reduce)` disables all animations and transitions
- **Screen reader support** — Live regions (`aria-live="polite"`) for dynamic content (form errors, tab panels, slider)

---

## 🎨 Customisation Guide

### Changing the Brand Colors
Edit the tokens in `:root` inside `style.css`:
```css
:root {
  --color-bg:   #1A1A1A;   /* Dark background */
  --color-gold: #D4AF37;   /* Change to your brand accent */
}
```

### Changing the Fonts
1. Update the Google Fonts `<link>` in `index.html`
2. Update the font variables in `:root`:
```css
--font-display: 'Your Display Font', serif;
--font-body:    'Your Body Font', sans-serif;
```

### Adding Menu Items
Add a new `<article class="menu-card">` inside the appropriate `#panel-coffee` or `#panel-food` div in `index.html`. The CSS grid will automatically accommodate it.

### Connecting a Real Backend
In `main.js`, locate the `simulateSubmit` function inside `formModule` and replace it with a real `fetch` call:
```javascript
function simulateSubmit(formData) {
  return fetch('/api/reservations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  }).then(function (res) {
    if (!res.ok) throw new Error('Server error');
    return res.json();
  });
}
```

---

## 🌐 Browser Support

| Browser | Version |
|---|---|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |
| Mobile Safari | iOS 14+ |
| Mobile Chrome | Android 90+ |

> **Note:** The site uses `IntersectionObserver`, CSS Custom Properties, `backdrop-filter`, and `clamp()`. All are supported in the above browsers. For older browsers, graceful degradation ensures core content and navigation remain fully functional.

---

## 📋 Checklist

- [x] Semantic, accessible HTML5
- [x] CSS Custom Properties / Design Tokens
- [x] Mobile-first responsive layout
- [x] Sticky header with scroll detection
- [x] Animated hamburger menu with focus trap
- [x] ARIA-compliant tab interface
- [x] Auto-playing testimonials slider with touch support
- [x] Client-side form validation with per-field inline errors
- [x] Simulated async form submission with loading state
- [x] Success confirmation state
- [x] `IntersectionObserver` scroll reveal animations
- [x] Scroll spy active nav highlighting
- [x] `prefers-reduced-motion` support
- [x] Zero third-party dependencies
- [x] No build tools required

---

## 📄 License

This project is released for educational and portfolio purposes. Feel free to use, adapt, and build upon it. Attribution appreciated but not required.

---

*Built with intention. Just like the coffee.* ✦

# AgriShift AI

Landing page for **AgriShift AI** — an AI-powered agriculture platform that turns NASA Earth observation data into crop recommendations for climate-resilient farming.

Currently a **frontend-only** single-page marketing site. There is no backend, no routing, and no data layer yet.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Styling with Tailwind v4](#styling-with-tailwind-v4)
- [Components](#components)
- [Accessibility](#accessibility)
- [Known Issues & TODOs](#known-issues--todos)
- [Troubleshooting](#troubleshooting)
- [Git Workflow](#git-workflow)

---

## Tech Stack

| Package              | Version   | Role                              |
| -------------------- | --------- | --------------------------------- |
| `react`              | ^19.3.0   | UI runtime                        |
| `react-dom`          | ^19.3.0   | DOM renderer                      |
| `vite`               | ^7.3.6    | Dev server + build tool           |
| `@vitejs/plugin-react` | ^5.2.0  | React fast refresh + JSX transform |
| `tailwindcss`        | ^4.3.3    | Utility-first CSS framework       |
| `@tailwindcss/vite`  | ^4.3.3    | Tailwind v4 Vite plugin           |

Installed but **not yet imported anywhere**: `framer-motion` (^13.4.6), `lucide-react` (^0.468.0). Icons are currently plain emoji. See [Known Issues](#known-issues--todos).

---

## Prerequisites

- **Node.js** 20.19+ or 22.12+ (required by Vite 7)
- **npm** 10+ (ships with Node)

Verify with:

```bash
node --version
npm --version
```

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (http://localhost:5173)
npm run dev

# 3. Open the URL printed in the terminal
```

To stop the dev server, press `Ctrl + C`.

---

## Available Scripts

| Command           | Description                                            |
| ----------------- | ------------------------------------------------------ |
| `npm run dev`     | Start Vite dev server with HMR on port 5173            |
| `npm run build`   | Build for production into `dist/`                      |
| `npm run preview` | Serve the production build locally to verify output    |

There is **no lint, test, or typecheck script configured yet.**

---

## Project Structure

```
Agrishift-AI/
├── .gitignore                  # Ignores node_modules, dist, .env, logs
├── index.html                  # Vite HTML entry point
├── package.json                # Dependencies + scripts
├── package-lock.json           # Locked dependency tree
├── readme.md                   # Project overview & quickstart
├── PROCEDURE.md                # Full implementation procedure & dev guide
├── vite.config.js              # Vite + React + Tailwind plugins
└── src/
    ├── main.jsx                # React root, mounts <App /> in StrictMode
    ├── App.jsx                 # Top-level layout shell
    ├── index.css               # Tailwind import + global base styles
    ├── assets/
    │   └── hero-bg.png         # Full-bleed hero background (2.6 MB)
    └── components/
        ├── Navbar.jsx          # Top navigation bar
        ├── Hero.jsx            # Hero section, composes FeatureCard + LoginCard + HeroModal
        ├── HeroModal.jsx       # Interactive modal manager for buttons & telemetry
        ├── FeatureCard.jsx     # Reusable feature highlight card
        └── LoginCard.jsx       # Login form panel
```

---

## Architecture

### Entry flow

```
index.html  →  src/main.jsx  →  src/App.jsx  →  <Navbar /> + <Hero />
                                                     ├── <FeatureCard /> × 2
                                                     └── <LoginCard />
```

`main.jsx` mounts `<App />` inside `React.StrictMode`. StrictMode double-invokes renders in development to surface side-effect bugs — keep it enabled.

`App.jsx` is intentionally thin: it only composes the two top-level sections. As the site grows, this is where a router and shared layout would be introduced.

### State and data

There is currently **no application state and no data fetching.** Every component is a pure function of its props. `LoginCard` prevents its form's default submit and discards credentials — there is no authentication backend yet.

---

## Styling with Tailwind v4

This project uses **Tailwind CSS v4**, which differs from v3 in one critical way:

> **There is no `tailwind.config.js`.** Configuration lives in CSS via `@theme`, and the framework is activated by a single `@import "tailwindcss"` at the top of `src/index.css`.

`src/index.css` is the **only** stylesheet, and the `@import` must be the first line:

```css
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI",
    Roboto, sans-serif;
}

html { scroll-behavior: smooth; }

body {
  margin: 0;
  min-height: 100vh;
  background-color: #0b1220;
  color: #ffffff;
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

To rebrand, edit the CSS custom properties in `@theme` rather than creating a config file.

### Class naming convention

Components in this repo write `className` values as one utility per line. This is intentional and should be preserved for consistency:

```jsx
<div className="
absolute
inset-0
bg-black/30
">
```

---

## Components

### `Navbar`

Fixed top navigation. Brand mark links to `/`; six section anchors (`#home`, `#features`, `#nasa-data`, `#how-it-works`, `#impact`, `#about`); two actions — **Demo** and **Login**. Section links are hidden below the `md` breakpoint.

### `Hero`

Full-height (`min-h-screen`) section using `hero-bg.png` as a cover background with a `bg-black/30` scrim for text contrast. Contains the headline, two CTAs, two `FeatureCard`s, and the `LoginCard`.

- Headline scales `text-4xl → sm:text-5xl → lg:text-6xl`
- Layout is `grid-cols-1 lg:grid-cols-2`; the login card centers on mobile and right-aligns on desktop
- Carries `id="home"`; the feature row carries `id="features"`

### `FeatureCard`

Presentational component taking `{ icon, title, text }`. Glassmorphic panel (`bg-black/40` + `backdrop-blur-xl`) that scales on hover. `icon` is decorative and hidden from screen readers.

### `LoginCard`

Self-contained login form.

- Email field: `type="email"`, `autoComplete="email"`, `required`
- Password field: `type="password"`, `autoComplete="current-password"`, `required`
- Both are labelled with visually-hidden `<label>` elements
- Submits to a `preventDefault` no-op — wire to a real auth endpoint later
- Google / Microsoft buttons are `type="button"` placeholders

---

## Accessibility

The page is built to be keyboard-navigable and screen-reader friendly:

- Every interactive element has an accessible name
- Focus indicators use `focus-visible:outline-*` so they appear for keyboard users without showing on mouse clicks
- Decorative emoji and the background scrim are `aria-hidden="true"`
- Form inputs have real `<label>` associations, correct `type`, and `autoComplete`
- Layout reflows to a single column on small screens

---

## Known Issues & TODOs

1. **`hero-bg.png` is 2.6 MB** — the vast majority of the page weight and it blocks first paint. Convert to WebP/AVIF (target ~150–300 kB).
2. **Unused dependencies** — `framer-motion` and `lucide-react` are installed but never imported. Either use `lucide-react` in place of emoji icons or remove both.
3. **"Inter" is declared but never loaded** — the font stack lists Inter first, but no `@font-face` or Google Fonts `<link>` exists, so every load falls back to `system-ui`. Either add the font or drop it from the stack.
4. **Unresolved nav anchors** — `#nasa-data`, `#how-it-works`, `#impact`, and `#about` are valid links but their target sections do not exist yet. Only `#home` and `#features` resolve today.
5. **No mobile navigation** — section links are hidden below `md` with no hamburger/menu replacement.
6. **No login handler** — `LoginCard` discards credentials.
7. **No tests, linting, or typechecking** — no ESLint/Prettier config and no `test` script.
8. **Empty `readme.md`** — this document replaces the placeholder.

---

## Troubleshooting

**Page renders with no styling (plain stacked text)**
The Tailwind build is not running. Confirm `src/index.css` begins with `@import "tailwindcss";` and contains no HTML. Verify with `npm run build` — a correct CSS bundle is roughly 16 kB; a ~0.3 kB bundle means Tailwind never ran.

**`Cannot find module 'react-dom/client'`**
Dependencies not installed or lockfile out of sync. Run `npm install`.

**Vite fails to start with an engine warning**
Your Node version is below Vite 7's minimum. Upgrade Node to 20.19+ or 22.12+.

**Build succeeds but warns `[esbuild css minify] Unexpected "<"`**
A `.css` file contains HTML markup. Vite treats it as CSS and fails to parse it.

**Blank page after `npm run preview`**
Rebuild first — `preview` serves `dist/`, which must exist and be current.

---

## Git Workflow

- `main` tracks `origin/main`
- `node_modules/`, `dist/`, `.env*`, and logs are ignored via `.gitignore`
- Commit source and config; never commit build output or secrets
- Run `npm run build` before pushing to confirm the bundle is clean

---

## License

Not yet specified. Add a `LICENSE` file before distributing.
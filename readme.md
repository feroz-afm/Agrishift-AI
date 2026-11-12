# AgriShift AI 🌾🛰️

**NASA Space Apps Challenge 2026 — Challenge: "Field Shift: Adapting Farms with NASA Data"**

AgriShift AI turns NASA Earth observations into **climate-resilient crop-rotation plans for Bangladeshi farmers**: in Bangla, on any phone, even offline.

| Part | Where | What it is |
|---|---|---|
| Landing page | `/` | Project story, NASA data, impact |
| **Field Shift app** | `/#/app` | The working app. Installable on Android / iPhone, runs on laptops |
| **Backend API** | `/api/*` | Fetches and caches NASA data on the server and runs the rotation engine |

---

## ✨ Features

- **Pick a field:** 64 districts, GPS, tap on the map, or one-tap demo fields (**Sariakandi**, **Kahaloo**, **Rajshahi**). Bangladesh only.
- **Real NASA data:** NASA POWER daily weather and soil wetness since 2001, MODIS 250 m NDVI, and ISRIC SoilGrids soil properties.
- **Monsoon drift:** monsoon onset and withdrawal detected for every year; the 2001–10 window is compared with 2016–25.
- **Rotation planner:** ranks Aman → Rabi → Kharif-1 rotations from 22 crops by soil health, irrigation need, return and climate risk, and compares them with what the farmer grows now.
- **2040 climate test:** the NASA trend since 2001 is projected forward and the plans are re-scored.
- **Bangladesh hazards:** coastal salinity, haor flash floods, Barind drought, char/river floods, northern cold waves.
- **"Why?" for every plan:** plain-Bangla reasons, the formulas used, and BRRI/BARI variety tips.
- **Alerts:** flash drought, heat wave, heavy rain, cold wave.
- **Voice assistant:** ask in Bangla (`bn-BD`) by voice or text and hear the answer. Works offline and shows the source of each answer.
- **Map:** opens on a normal street map zoomed to the field with a pin, plus a **satellite photo** mode. Optional **NASA GIBS** overlays: NDVI greenness, land surface temperature, GPM IMERG rain.
- **Works offline:** installable PWA; the last data is saved on the device; real NASA data can be bundled for the demo fields.
- **Bangla first:** Bangla text and digits, with a one-tap English toggle for judges.

---

## 🚀 Quick start

**Requirements:** Node.js **20.19+** (check with `node -v`).

```bash
npm install          # first time only
npm run dev          # app + API → http://localhost:5173/#/app
```

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with the backend API. Prints a **Network** URL for phones on the same Wi-Fi |
| `npm run build` | Production build into `dist/` |
| `npm start` | Production server (built app + API) → `http://localhost:3000/#/app` |
| `npm run preview` | Serves the build with the API, for checking before deploy |
| `npm test` | Engine, assistant and backend tests (NASA mocked, no internet needed) |
| `npm run fetch-data` | Downloads **real** NASA data for Sariakandi, Kahaloo and Rajshahi into `public/data/` |

### বাংলায় সংক্ষেপে
```bash
npm install
npm run dev
```
- **ল্যাপটপে:** `http://localhost:5173/#/app`
- **ফোনে** (একই Wi-Fi): টার্মিনালে দেখানো `Network: http://192.168.x.x:5173/` লিংকের শেষে `#/app` যোগ করে খুলুন।
- বন্ধ করতে: **Ctrl + C**

---

## 📱 Use on a phone

**Quick look (same Wi-Fi):** run `npm run dev` and open `http://<Network-IP>:5173/#/app` on the phone. On Windows, allow **Node.js** through the firewall if the page does not load.

> GPS, voice input and "Add to Home Screen" only work on **HTTPS**, so use a deployed link for demos and videos.

**Deploy (free, HTTPS):**

- **Option A, Vercel CLI from this folder:**
  ```bash
  npx vercel          # log in with GitHub, press Enter for the defaults
  npx vercel --prod   # permanent production URL
  ```
- **Option B, Vercel dashboard:** import `feroz-afm/Agrishift-AI` on vercel.com and deploy. `vercel.json` already sets up the Vite build and the `/api/*` serverless functions.

**Install on the phone:** open `https://<your-app>.vercel.app/#/app`, then:
- **Android:** Chrome ⋮ → **Add to Home screen**
- **iPhone:** Safari → Share → **Add to Home Screen**

---

## 🔌 Backend API

| Endpoint | Returns |
|---|---|
| `GET /api/health` | Service status |
| `GET /api/power?lat=&lon=` | NASA POWER daily, 2001→: T2M, T2M_MAX, T2M_MIN, PRECTOTCORR, GWETROOT, GWETTOP, RH2M, ALLSKY_SFC_SW_DWN |
| `GET /api/ndvi?lat=&lon=` | MODIS MOD13Q1 250 m NDVI, about 3 years (ORNL DAAC) |
| `GET /api/soil?lat=&lon=` | SoilGrids 2.0 topsoil: clay, sand, silt, SOC, pH, N |
| `GET /api/field?lat=&lon=` | All three in one call (used by the app) |
| `GET /api/plan?preset=sariakandi&priority=water` | Full server-side analysis and ranked rotations. Also takes `lat`, `lon`, `irrigation=none\|limited\|full`, `current=rice_aman,rice_boro,fallow`, `future=1`, `saline=1` |

Results are cached in memory and at the CDN (`s-maxage`), so NASA is called at most a few times a day per location. The same handlers run on Vercel (`api/`), inside `npm run dev` (`server/vite-api.js`), and on any Node host (`server/index.js`).

**Data flow in the app:** backend `/api/field` → NASA directly from the browser → real data bundled in `public/data/` → last copy saved on the device. Sample data is only used when the user taps *"Explore with sample data"*, and it is always labelled.

---

## 📍 Demo fields

| Field | Why it matters |
|---|---|
| **Sariakandi, Bogura** | Jamuna char land: monsoon river floods, sandy soils |
| **Kahaloo, Bogura** | Western Bogura on the Barind edge: Boro irrigation, dry-season water stress |
| **Rajshahi (Barind)** | Drought and falling groundwater |

To make the demo fields work fully offline with real data, run this on a computer with internet:
```bash
npm run fetch-data
git add public/data && git commit -m "data: real NASA data for demo fields" && git push
```

---

## 🧮 How the engine works

- **ET₀:** Hargreaves method from NASA POWER daily Tmax/Tmin and latitude. Crop water = Kc × ET₀ (FAO-56).
- **Irrigation need** = crop water − effective rain (80%) − stored soil moisture in Rabi, plus paddy percolation.
- **Risk:** damaging heat or cold days for each crop in the last 10 years of NASA daily data, plus district hazards (salinity, haor, Barind, char floods, cold).
- **Soil score:** rewards legumes, green manure, crop-family diversity, deep roots and residue; penalises bare land and the same family twice in a row.
- **2040:** the linear temperature and rain trend since 2001, applied to the same daily record.
- **Monsoon drift:** yearly onset and withdrawal from daily rain, with thresholds scaled to local rainfall so pre-monsoon storms do not count.
- **Field health (0–100):** soil wetness percentile, recent heat, and NDVI against its own history.

---

---

## Landing page (original notes)

Landing page for **AgriShift AI** — an AI-powered agriculture platform that turns NASA Earth observation data into crop recommendations for climate-resilient farming.

The landing page links to the working app at `#/app`.

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
        ├── Navbar.jsx          # Sticky navigation bar with mobile drawer
        ├── Hero.jsx            # Hero section with CTAs & live telemetry bar (#home)
        ├── Features.jsx        # Core architectural capabilities section (#features)
        ├── NasaData.jsx        # NASA Earth observation sensor engine (#nasa-data)
        ├── HowItWorks.jsx      # Automated 3-step satellite-to-tractor workflow (#how-it-works)
        ├── Impact.jsx          # Verified ecological & economic field results (#impact)
        ├── About.jsx           # Mission, data standards & final CTA banner (#about)
        ├── Footer.jsx          # Global footer with status & navigation
        ├── HeroModal.jsx       # Interactive modal manager for telemetry, advisory & ROI
        ├── FeatureCard.jsx     # Reusable feature card with interactive triggers
        └── LoginCard.jsx       # Standalone login card (reserved for auth modal/route)
```

---

## Architecture

### Entry flow

```
index.html  →  src/main.jsx  →  src/App.jsx
                                 ├── <Navbar /> (Sticky + Mobile Drawer)
                                 ├── <Hero /> (#home)
                                 ├── <Features /> (#features)
                                 ├── <NasaData /> (#nasa-data)
                                 ├── <HowItWorks /> (#how-it-works)
                                 ├── <Impact /> (#impact)
                                 ├── <About /> (#about)
                                 ├── <Footer />
                                 └── <HeroModal /> (Global telemetry & simulator dialogs)
```

`main.jsx` mounts `<App />` inside `React.StrictMode`. StrictMode double-invokes renders in development to surface side-effect bugs — keep it enabled.

`App.jsx` cleanly composes all sections and coordinates active modal dialog state.

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

1. **`hero-bg.png` is 2.6 MB** — Convert to WebP/AVIF (target ~150–300 kB) for faster initial paint.
2. ~~**Unused dependencies**~~ — *Resolved.* `lucide-react` icons are now imported across all sections and modals.
3. ~~**"Inter" font loading**~~ — *Resolved.* Google Fonts preconnect and Inter stylesheet are configured in `index.html`.
4. ~~**Unresolved nav anchors**~~ — *Resolved.* Dedicated sections created for `#home`, `#features`, `#nasa-data`, `#how-it-works`, `#impact`, and `#about`.
5. ~~**No mobile navigation**~~ — *Resolved.* Responsive mobile drawer with hamburger toggle added in `Navbar.jsx`.
6. **Backend integration** — Wire `LoginCard` and consultative modal submissions to actual API / database endpoints.
7. **Automated Testing** — Add Vitest and Playwright test suites.

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
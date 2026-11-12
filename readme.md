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

## 🗂️ Code map

```
api/                     Vercel serverless functions (thin wrappers)
server/
  handlers.js            Backend: NASA fetch + cache, /field, /plan
  vite-api.js            Serves the API inside `npm run dev` / `preview`
  index.js               Standalone Node server (Render, Railway, laptop)
scripts/fetch-data.mjs   Bundles real NASA data for offline demos
public/                  PWA manifest, icons, service worker, data/
src/
  App.jsx                Landing page + #/app routing
  components/            Landing page sections
  fieldshift/            The Field Shift app
    FieldShiftApp.jsx    App shell (bottom nav on phones, sidebar on laptops)
    MapBox.jsx           Leaflet map: street/satellite base, field pin, NASA GIBS overlays
    screens/             Setup, Field, Plan, MapView, Ask, DataInfo
    lib/                 Engine, climate analysis, NASA access, crops, districts, i18n, assistant
tests/                   node --test suites
```

**Stack:** React 19, Vite 7, Tailwind CSS 4 (landing page), Leaflet, Hind Siliguri / Space Grotesk / JetBrains Mono (bundled, so they work offline), Node 20+ backend.

---

## 📚 Data sources

| Dataset | Used for |
|---|---|
| **NASA POWER** Daily API (AG community) | Weather, ET₀, monsoon onset, heat days, soil wetness, 2040 trend |
| **MODIS MOD13Q1 v6.1** (ORNL DAAC web service) | Field greenness and health |
| **NASA GIBS** WMTS (MODIS NDVI, MODIS LST, GPM IMERG) | Map overlays |
| **ISRIC SoilGrids 2.0** | Soil texture, organic carbon, pH |
| **FAO-56, FAO Ecocrop, BRRI/BARI** calendars | Crop water need, temperature limits, seasons, variety tips |
| OpenStreetMap, Esri World Imagery | Base maps |

---

## ⚠️ Limitations (stated honestly)

- NASA POWER cells are about 50 km, so the weather describes the area, not one field.
- Soil moisture comes from POWER GWETROOT (MERRA-2 model), not SMAP retrievals.
- NASA GIBS overlays are 250 m – 10 km pixels and look blocky when zoomed into one field.
- SoilGrids is a modelled estimate, not a soil test.
- The return index is relative, not money.
- Confirm varieties and fertiliser with the Upazila agriculture office.

---

## 🛠️ Troubleshooting

| Problem | Fix |
|---|---|
| `'vite' is not recognized` | Dependencies are missing. Run `npm install` |
| `running scripts is disabled` (PowerShell) | `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`, or switch the terminal to Command Prompt |
| Phone cannot open the Network URL | Use the same Wi-Fi, and allow **Node.js** through Windows Firewall (Private + Public) |
| GPS / mic / install not working on the phone | These need HTTPS. Use the Vercel link |
| "Could not load NASA data" | Check internet, then press *Try again*. NASA APIs can be slow; the first load takes 10–40 s |
| Map tiles blank | Check internet. NASA overlays can take a few seconds to load |
| Engine warning on start | Upgrade Node to 20.19+ |

---

## 🌿 Git workflow

- `main`: stable. `agrishift-final`: latest version, including the map update. Feature work happens on branches and is merged with Pull Requests.
- `node_modules/`, `dist/`, `.env*` and logs are ignored.
- Before pushing: `npm test && npm run build`.

---

## License

Built for NASA Space Apps Challenge 2026. NASA data is public domain; follow each provider's attribution terms (OpenStreetMap, Esri, ISRIC).

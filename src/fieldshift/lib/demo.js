// SAMPLE data generator for offline demos only. It imitates a typical central-Bangladesh climate
// and is always labelled "Demo data" in the UI. It is never mixed with real NASA data.
const TMAX = [25, 28, 32, 34, 33, 32, 31, 31, 31, 31, 29, 26];
const TMIN = [12, 15, 19, 23, 25, 26, 26, 26, 25, 23, 18, 13];
const RAIN = [8, 20, 40, 110, 250, 380, 400, 330, 300, 170, 25, 8];
const DIM = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export function demoPower({ lat = 24.85, seed = 11, endDate } = {}) {
  const start = Date.UTC(2001, 0, 1);
  const end = endDate ? Date.parse(endDate) : Date.now() - 3 * 86400000;
  const n = Math.round((end - start) / 86400000);
  const p = { T2M: [], T2M_MAX: [], T2M_MIN: [], PRECTOTCORR: [], GWETROOT: [], GWETTOP: [], RH2M: [], ALLSKY_SFC_SW_DWN: [] };
  let s = seed;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  let soil = 0.5;
  for (let i = 0; i < n; i++) {
    const d = new Date(start + i * 86400000);
    const m = d.getUTCMonth();
    const yr = d.getUTCFullYear() - 2001;
    const warm = yr * 0.025; // gentle warming trend
    const tmax = TMAX[m] + warm + (rnd() - 0.5) * 4 + (m >= 2 && m <= 4 && rnd() < 0.08 ? 3 + rnd() * 3 : 0);
    const tmin = TMIN[m] + warm + (rnd() - 0.5) * 3;
    // monsoon onset drifts later by ~0.4 day/yr
    const late = m === 5 && d.getUTCDate() < 8 + yr * 0.4;
    const wetP = Math.min(0.85, RAIN[m] / DIM[m] / 12 + 0.08);
    let rain = rnd() < (late ? wetP * 0.3 : wetP) ? (-Math.log(1 - rnd()) * RAIN[m]) / DIM[m] / wetP : 0;
    rain = Math.round(rain * 10) / 10;
    soil = Math.max(0.12, Math.min(0.95, soil + rain / 120 - (tmax - 15) / 900));
    p.T2M.push(Math.round(((tmax + tmin) / 2) * 10) / 10);
    p.T2M_MAX.push(Math.round(tmax * 10) / 10);
    p.T2M_MIN.push(Math.round(tmin * 10) / 10);
    p.PRECTOTCORR.push(rain);
    p.GWETROOT.push(Math.round(soil * 100) / 100);
    p.GWETTOP.push(Math.round(Math.min(1, soil + (rain > 0 ? 0.1 : -0.05)) * 100) / 100);
    p.RH2M.push(m >= 5 && m <= 9 ? 85 : 65);
    p.ALLSKY_SFC_SW_DWN.push(m >= 5 && m <= 9 ? 15 : 19);
  }
  return { start: '2001-01-01', n, p, demo: true, lat };
}

export function demoNdvi() {
  const out = [];
  const now = Date.now();
  for (let k = 68; k >= 0; k--) {
    const d = new Date(now - k * 16 * 86400000 - 20 * 86400000);
    const m = d.getUTCMonth();
    const v = [0.55, 0.45, 0.35, 0.3, 0.38, 0.5, 0.62, 0.72, 0.78, 0.7, 0.5, 0.58][m];
    out.push({ date: d.toISOString().slice(0, 10), ndvi: Math.round((v + Math.sin(k) * 0.03) * 1000) / 1000 });
  }
  return out;
}

export const demoSoil = { clay: 28, sand: 30, silt: 42, soc: 9.5, ph: 6.1, nitrogen: 0.9, demo: true };

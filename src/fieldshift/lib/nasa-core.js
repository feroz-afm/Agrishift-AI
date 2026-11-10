// NASA / open-data access shared by the backend (server/*) and the browser.
// Pure: no storage, no DOM. Pass a `getJSON(url, opts)` function in.

export const POWER_PARAMS = ['T2M', 'T2M_MAX', 'T2M_MIN', 'PRECTOTCORR', 'GWETROOT', 'GWETTOP', 'RH2M', 'ALLSKY_SFC_SW_DWN'];
export const POWER_START_YEAR = 2001;
const DAY = 86400000;
const ymd = (d) => d.toISOString().slice(0, 10).replace(/-/g, '');

export function validLatLon(lat, lon) {
  return Number.isFinite(lat) && Number.isFinite(lon) && lat >= -60 && lat <= 70 && lon >= -180 && lon <= 180;
}

/** NASA POWER daily point API (AG community), 2001 → two days ago. */
export function powerUrl(lat, lon, end = new Date(Date.now() - 2 * DAY)) {
  return 'https://power.larc.nasa.gov/api/temporal/daily/point'
    + `?parameters=${POWER_PARAMS.join(',')}&community=AG&longitude=${lon.toFixed(4)}&latitude=${lat.toFixed(4)}`
    + `&start=${POWER_START_YEAR}0101&end=${ymd(end)}&format=JSON&time-standard=LST`;
}

/** POWER JSON → { start, n, p: { PARAM: number[] } } with nulls for missing days. */
export function compactPower(json) {
  const par = json?.properties?.parameter;
  if (!par || !par.T2M) throw new Error('NASA POWER returned no data for this point');
  const dates = Object.keys(par.T2M).sort();
  const p = {};
  for (const name of POWER_PARAMS) {
    const src = par[name] || {};
    p[name] = dates.map((d) => {
      const v = src[d];
      return v === undefined || v === null || v <= -998 ? null : Math.round(v * 100) / 100;
    });
  }
  let n = dates.length;
  while (n > 0 && p.T2M[n - 1] === null && p.PRECTOTCORR[n - 1] === null) n--;
  for (const name of POWER_PARAMS) p[name] = p[name].slice(0, n);
  const s = dates[0];
  return { start: `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`, n, p, source: 'NASA POWER daily (AG)' };
}

export async function getPower(getJSON, lat, lon) {
  return compactPower(await getJSON(powerUrl(lat, lon), {}, 90000));
}

/** MODIS MOD13Q1 250 m 16-day NDVI for one pixel via the ORNL DAAC web service (~3 years). */
export async function getNdvi(getJSON, lat, lon) {
  const base = 'https://modis.ornl.gov/rst/api/v1/MOD13Q1';
  const hdr = { headers: { Accept: 'application/json' } };
  const dj = await getJSON(`${base}/dates?latitude=${lat}&longitude=${lon}`, hdr);
  const want = (dj.dates || []).map((d) => d.modis_date).slice(-69);
  const chunks = [];
  for (let i = 0; i < want.length; i += 10) chunks.push(want.slice(i, i + 10)); // API limit: 10 dates per call
  const results = await Promise.all(chunks.map((c) => getJSON(
    `${base}/subset?latitude=${lat}&longitude=${lon}&band=250m_16_days_NDVI&startDate=${c[0]}&endDate=${c[c.length - 1]}&kmAboveBelow=0&kmLeftRight=0`, hdr,
  ).catch(() => null)));
  const series = [];
  for (const r of results) {
    if (!r) continue;
    const scale = Number(r.scale) || 0.0001;
    for (const s of r.subset || []) {
      const raw = Array.isArray(s.data) ? s.data[0] : s.data;
      if (raw === undefined || raw <= -2000) continue;
      series.push({ date: s.calendar_date, ndvi: Math.round(raw * scale * 1000) / 1000 });
    }
  }
  series.sort((a, b) => a.date.localeCompare(b.date));
  if (!series.length) throw new Error('MODIS returned no NDVI values');
  return series;
}

/** ISRIC SoilGrids 2.0, top 30 cm depth-weighted. */
export function soilUrl(lat, lon) {
  const props = ['clay', 'sand', 'silt', 'soc', 'phh2o', 'nitrogen'];
  return 'https://rest.isric.org/soilgrids/v2.0/properties/query'
    + `?lon=${lon}&lat=${lat}&${props.map((p) => `property=${p}`).join('&')}`
    + '&depth=0-5cm&depth=5-15cm&depth=15-30cm&value=mean';
}

export function parseSoil(j) {
  const w = { '0-5cm': 5, '5-15cm': 10, '15-30cm': 15 };
  const out = {};
  for (const layer of j?.properties?.layers || []) {
    const f = layer.unit_measure?.d_factor || 1;
    let sum = 0, wt = 0;
    for (const d of layer.depths || []) {
      const v = d.values?.mean;
      if (v === null || v === undefined) continue;
      sum += (v / f) * (w[d.label] || 1); wt += w[d.label] || 1;
    }
    out[layer.name] = wt ? sum / wt : null;
  }
  const r = (v, dp = 1) => (v === null || v === undefined ? null : Math.round(v * 10 ** dp) / 10 ** dp);
  return { clay: r(out.clay), sand: r(out.sand), silt: r(out.silt), soc: r(out.soc), ph: r(out.phh2o), nitrogen: r(out.nitrogen, 2), source: 'ISRIC SoilGrids 2.0' };
}

export async function getSoil(getJSON, lat, lon) {
  const s = parseSoil(await getJSON(soilUrl(lat, lon), {}, 40000));
  if (s.clay === null && s.sand === null) throw new Error('SoilGrids has no data here (water or built-up land?)');
  return s;
}

/** NASA GIBS WMTS layers for the map screen. */
export const GIBS_LAYERS = [
  { id: 'ndvi', layer: 'MODIS_Terra_L3_NDVI_16Day', matrix: 'GoogleMapsCompatible_Level9', maxZoom: 9, lag: 24, label: { en: 'Greenness (NDVI)', bn: 'সবুজতা (NDVI)' }, src: 'MODIS Terra 16-day' },
  { id: 'lst', layer: 'MODIS_Terra_Land_Surface_Temp_Day', matrix: 'GoogleMapsCompatible_Level7', maxZoom: 7, lag: 3, label: { en: 'Land heat (day)', bn: 'ভূমির তাপ (দিন)' }, src: 'MODIS Terra LST' },
  { id: 'rain', layer: 'IMERG_Precipitation_Rate', matrix: 'GoogleMapsCompatible_Level6', maxZoom: 6, lag: 2, label: { en: 'Rain rate', bn: 'বৃষ্টির হার' }, src: 'GPM IMERG' },
  { id: 'truecolor', layer: 'MODIS_Terra_CorrectedReflectance_TrueColor', matrix: 'GoogleMapsCompatible_Level9', maxZoom: 9, lag: 1, label: { en: 'Satellite photo', bn: 'স্যাটেলাইট ছবি' }, src: 'MODIS Terra true colour' },
];

export function gibsUrl(l, date) {
  const ext = l.id === 'truecolor' ? 'jpg' : 'png';
  return `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/${l.layer}/default/${date}/${l.matrix}/{z}/{y}/{x}.${ext}`;
}

/** fetch → JSON with a timeout. Works in Node 18+ and browsers. */
export async function fetchJSON(url, opts = {}, timeoutMs = 45000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...opts, signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status} from ${new URL(url).host}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

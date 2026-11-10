// AgriShift / Field Shift backend. Runtime-agnostic handlers used by:
//   • Vercel serverless functions (api/*.js)
//   • the Node production server (server/index.js)
//   • the Vite dev server (server/vite-api.js)
// The backend fetches NASA data server-side (no browser CORS issues), caches it,
// and can run the full rotation engine so thin clients (SMS, USSD, partners) can use it.
import { getPower, getNdvi, getSoil, fetchJSON, validLatLon } from '../src/fieldshift/lib/nasa-core.js';
import { analyse, fieldHealth } from '../src/fieldshift/lib/analysis.js';
import { planRotations, DEFAULT_CURRENT, defaultIrrigation } from '../src/fieldshift/lib/engine.js';
import { DISTRICT, PRESET, nearestDistrict, inBangladesh } from '../src/fieldshift/lib/districts.js';
import { CROP } from '../src/fieldshift/lib/crops.js';

const HOUR = 3600000;
const cache = new Map(); // key → { at, ttl, value | promise }

/** Cached, de-duplicated fetch: concurrent requests for the same point share one NASA call. */
async function cached(key, ttl, fn) {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < hit.ttl) return hit.value;
  const value = fn();
  cache.set(key, { at: Date.now(), ttl, value });
  try {
    return await value;
  } catch (err) {
    cache.delete(key);
    throw err;
  }
}

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

function point(q) {
  const lat = Number(q.lat), lon = Number(q.lon);
  if (!validLatLon(lat, lon)) throw new HttpError(400, 'lat and lon are required, e.g. ?lat=24.85&lon=89.37');
  // round to ~1 km so nearby requests share the cache
  return { lat: Math.round(lat * 100) / 100, lon: Math.round(lon * 100) / 100 };
}

const k = (kind, { lat, lon }) => `${kind}:${lat}:${lon}`;
const power = (pt) => cached(k('power', pt), 12 * HOUR, () => getPower(fetchJSON, pt.lat, pt.lon));
const ndvi = (pt) => cached(k('ndvi', pt), 24 * HOUR, () => getNdvi(fetchJSON, pt.lat, pt.lon));
const soil = (pt) => cached(k('soil', pt), 30 * 24 * HOUR, () => getSoil(fetchJSON, pt.lat, pt.lon));

const SHORT = 'public, max-age=600, s-maxage=21600, stale-while-revalidate=86400';
const ok = (body, cacheControl = SHORT) => ({ status: 200, body, headers: { 'Cache-Control': cacheControl } });

export const handlers = {
  async health() {
    return ok({ ok: true, service: 'agrishift-field-shift', time: new Date().toISOString(), cachedItems: cache.size }, 'no-store');
  },

  async power(q) { return ok(await power(point(q))); },
  async ndvi(q) { return ok({ series: await ndvi(point(q)), source: 'MODIS MOD13Q1 v6.1 (ORNL DAAC)' }); },
  async soil(q) { return ok(await soil(point(q))); },

  /** Everything the app needs in one round-trip. NDVI and soil are optional extras. */
  async field(q) {
    const pt = point(q);
    const [pw, nd, so] = await Promise.allSettled([power(pt), ndvi(pt), soil(pt)]);
    if (pw.status !== 'fulfilled') throw new HttpError(502, 'NASA POWER unavailable: ' + (pw.reason?.message || pw.reason));
    return ok({
      point: pt,
      power: pw.value,
      ndvi: nd.status === 'fulfilled' ? nd.value : null,
      soil: so.status === 'fulfilled' ? so.value : null,
      errors: { ndvi: nd.status === 'rejected' ? String(nd.reason?.message || nd.reason) : null, soil: so.status === 'rejected' ? String(so.reason?.message || so.reason) : null },
      fetchedAt: new Date().toISOString(),
    });
  },

  /**
   * Server-side rotation plan.
   * ?lat&lon | ?preset=sariakandi|kahaloo|rajshahi  [&irrigation=none|limited|full] [&priority=soil|water|profit|risk]
   * [&current=rice_aman,rice_boro,fallow] [&future=1] [&saline=1]
   */
  async plan(q) {
    const preset = q.preset ? PRESET[q.preset] : null;
    if (q.preset && !preset) throw new HttpError(400, 'Unknown preset. Use sariakandi, kahaloo or rajshahi.');
    const pt = preset ? { lat: preset.lat, lon: preset.lon } : point(q);
    if (!inBangladesh(pt.lat, pt.lon)) throw new HttpError(400, 'This service covers Bangladesh only.');
    const district = preset ? DISTRICT[preset.districtId] : (q.district && DISTRICT[q.district]) || nearestDistrict(pt.lat, pt.lon);
    const flags = [...(preset ? preset.flags : district.flags)];
    if (q.saline === '1' && !flags.includes('saline')) flags.push('saline');
    const current = q.current ? String(q.current).split(',').map((s) => s.trim()).filter((s) => CROP[s]) : (preset?.current || DEFAULT_CURRENT);
    const irrigation = ['none', 'limited', 'full'].includes(q.irrigation) ? q.irrigation : (preset?.irrigation || defaultIrrigation(flags));
    const priority = ['soil', 'water', 'profit', 'risk'].includes(q.priority) ? q.priority : 'soil';

    const [pw, nd, so] = await Promise.allSettled([power(pt), ndvi(pt), soil(pt)]);
    if (pw.status !== 'fulfilled') throw new HttpError(502, 'NASA POWER unavailable: ' + (pw.reason?.message || pw.reason));
    const a = analyse(pw.value, pt.lat);
    const ctx = {
      a, power: pw.value, soil: so.status === 'fulfilled' ? so.value : null, irrigation, flags, current,
      weights: { soil: 1, water: 1, profit: 1, risk: 1, [priority]: 3 }, future: q.future === '1',
    };
    const plan = planRotations(ctx);
    const slim = (r) => r && ({ crops: r.crops, overall: r.overall, soil: r.soil, water: r.water, irrigationMm: r.irrigation, return: r.ret, risk: r.risk, reasons: r.reasons, seasons: r.places.map((p) => ({ season: p.season, crop: p.crop, months: p.months, irrigationMm: p.irrigation, risk: p.risk })) });
    return ok({
      location: { ...pt, district: district.id, districtBn: district.bn, preset: preset?.id || null, flags },
      inputs: { irrigation, priority, current, future: ctx.future },
      climate: { mode: a.mode, annualRainMm: a.annualRain, period: a.period, window: a.window.ok ? { early: a.window.early, late: a.window.late, shiftStartDays: a.window.shiftStart, shiftLengthDays: a.window.shiftLen } : null, change: a.change, future2040: a.future },
      now: a.current,
      alerts: a.alerts,
      fieldHealth: fieldHealth(a, nd.status === 'fulfilled' ? nd.value : null),
      currentRotation: slim(plan.current),
      rotations: plan.rotations.map(slim),
      sources: ['NASA POWER daily (AG)', 'MODIS MOD13Q1 (ORNL DAAC)', 'ISRIC SoilGrids 2.0', 'FAO-56'],
    });
  },
};

/** Run a handler and turn errors into JSON responses. */
export async function run(name, query) {
  const h = handlers[name];
  if (!h) return { status: 404, body: { error: 'Not found', endpoints: Object.keys(handlers).map((x) => '/api/' + x) }, headers: {} };
  try {
    return await h(query || {});
  } catch (err) {
    return { status: err.status || 500, body: { error: err.message || String(err) }, headers: { 'Cache-Control': 'no-store' } };
  }
}

/** Adapter for Node req/res (Vercel functions, node:http, Vite middleware). */
export function nodeHandler(name) {
  return async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const out = await run(name, Object.fromEntries(url.searchParams));
    res.statusCode = out.status;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    for (const [h, v] of Object.entries(out.headers || {})) res.setHeader(h, v);
    res.end(JSON.stringify(out.body));
  };
}

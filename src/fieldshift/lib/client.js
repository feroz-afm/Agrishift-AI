// Browser data client. Order of preference:
//   1. our backend  /api/field   (server fetches NASA, caches, no CORS problems)
//   2. NASA APIs directly from the browser (if the backend is unreachable)
//   3. real NASA data bundled with the app for the demo fields (public/data/<preset>.json)
//   4. the last copy saved on this device (works fully offline)
import { getPower, getNdvi, getSoil, fetchJSON } from './nasa-core.js';
import { cacheGet, cacheSet } from './store.js';

const API_BASE = (import.meta.env && import.meta.env.VITE_API_BASE) || '';
const DAY = 86400000;

async function fromBackend(lat, lon) {
  const j = await fetchJSON(`${API_BASE}/api/field?lat=${lat}&lon=${lon}`, {}, 100000);
  if (!j.power) throw new Error(j.error || 'backend returned no data');
  return { power: j.power, ndvi: j.ndvi, soil: j.soil, via: 'backend' };
}

async function fromBrowser(lat, lon) {
  const [pw, nd, so] = await Promise.allSettled([getPower(fetchJSON, lat, lon), getNdvi(fetchJSON, lat, lon), getSoil(fetchJSON, lat, lon)]);
  if (pw.status !== 'fulfilled') throw pw.reason;
  return { power: pw.value, ndvi: nd.status === 'fulfilled' ? nd.value : null, soil: so.status === 'fulfilled' ? so.value : null, via: 'direct' };
}

async function fromBundle(presetId) {
  if (!presetId) throw new Error('no bundled data');
  const j = await fetchJSON(`./data/${presetId}.json`, {}, 15000);
  if (!j.power) throw new Error('bundle has no POWER data');
  return { power: j.power, ndvi: j.ndvi || null, soil: j.soil || null, via: 'bundled', fetchedAt: j.fetchedAt };
}

/**
 * Load everything for a field. Returns { power, ndvi, soil, via, fromCache, savedAt, error? }.
 * Throws only if no real data is available anywhere.
 */
export async function loadField({ lat, lon, presetId }, { force = false } = {}) {
  const key = `field:${lat.toFixed(2)}:${lon.toFixed(2)}`;
  const cached = cacheGet(key);
  const online = typeof navigator === 'undefined' || navigator.onLine !== false;
  if (cached && !force && (!online || Date.now() - cached.savedAt < 2 * DAY)) {
    return { ...cached.data, fromCache: true, savedAt: cached.savedAt };
  }
  const errors = [];
  for (const step of [() => fromBackend(lat, lon), () => fromBrowser(lat, lon), () => fromBundle(presetId)]) {
    try {
      const data = await step();
      cacheSet(key, data);
      return { ...data, fromCache: false, savedAt: Date.now() };
    } catch (err) {
      errors.push(String(err.message || err));
    }
  }
  if (cached) return { ...cached.data, fromCache: true, savedAt: cached.savedAt, error: errors.join(' · ') };
  throw new Error(errors.join(' · '));
}

export { GIBS_LAYERS, gibsUrl } from './nasa-core.js';

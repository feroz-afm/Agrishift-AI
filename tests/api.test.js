// Backend tests with NASA mocked (no network needed).
import test from 'node:test';
import assert from 'node:assert/strict';
import { demoPower } from '../src/fieldshift/lib/demo.js';
import { POWER_PARAMS } from '../src/fieldshift/lib/nasa-core.js';
import { run } from '../server/handlers.js';

// Turn our compact demo series back into the shape NASA POWER returns.
function powerJson() {
  const d = demoPower({ endDate: '2026-11-05' });
  const t0 = Date.parse(d.start);
  const parameter = {};
  for (const p of POWER_PARAMS) {
    parameter[p] = {};
    d.p[p].forEach((v, i) => { parameter[p][new Date(t0 + i * 86400000).toISOString().slice(0, 10).replace(/-/g, '')] = v; });
  }
  return { properties: { parameter } };
}
const POWER = powerJson();
let calls = 0;
globalThis.fetch = async (url) => {
  calls++;
  const u = String(url);
  const body = u.includes('power.larc') ? POWER
    : u.includes('/dates') ? { dates: [{ modis_date: 'A2026001' }, { modis_date: 'A2026017' }] }
    : u.includes('modis.ornl') ? { scale: '0.0001', subset: [{ calendar_date: '2026-01-01', data: [6200] }, { calendar_date: '2026-01-17', data: [6500] }] }
    : u.includes('soilgrids') ? { properties: { layers: [{ name: 'clay', unit_measure: { d_factor: 10 }, depths: [{ label: '0-5cm', values: { mean: 280 } }] }, { name: 'sand', unit_measure: { d_factor: 10 }, depths: [{ label: '0-5cm', values: { mean: 300 } }] }] } }
    : null;
  return { ok: !!body, status: body ? 200 : 404, json: async () => body };
};

test('health', async () => {
  const r = await run('health', {});
  assert.equal(r.status, 200);
  assert.equal(r.body.ok, true);
});

test('field returns POWER + NDVI + soil and caches', async () => {
  const r = await run('field', { lat: '24.887', lon: '89.567' });
  assert.equal(r.status, 200);
  assert.ok(r.body.power.n > 9000);
  assert.equal(r.body.ndvi.length, 2);
  assert.equal(r.body.soil.clay, 28);
  const before = calls;
  await run('field', { lat: '24.887', lon: '89.567' });
  assert.equal(calls, before, 'second call served from cache');
});

test('plan for Sariakandi preset', async () => {
  const r = await run('plan', { preset: 'sariakandi', priority: 'water' });
  assert.equal(r.status, 200, JSON.stringify(r.body));
  assert.deepEqual(r.body.location.flags, ['flood']);
  assert.ok(r.body.rotations.length >= 2);
  assert.ok(r.body.currentRotation.crops.length === 3);
});

test('validation errors', async () => {
  assert.equal((await run('field', {})).status, 400);
  assert.equal((await run('plan', { lat: '40.7', lon: '-74' })).status, 400);
  assert.equal((await run('nope', {})).status, 404);
});

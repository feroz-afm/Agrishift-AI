import test from 'node:test';
import assert from 'node:assert/strict';
import { demoPower } from '../src/fieldshift/lib/demo.js';
import { analyse, et0Hargreaves, fieldHealth } from '../src/fieldshift/lib/analysis.js';
import { planRotations, DEFAULT_CURRENT } from '../src/fieldshift/lib/engine.js';
import { compactPower, parseSoil } from '../src/fieldshift/lib/nasa-core.js';
import { DISTRICTS, DISTRICT, PRESETS, nearestDistrict } from '../src/fieldshift/lib/districts.js';
import { answer } from '../src/fieldshift/lib/ask.js';

const power = demoPower({ endDate: '2026-11-05' });
const a = analyse(power, 24.85);

test('64 districts + 3 presets', () => {
  assert.equal(DISTRICTS.length, 64);
  assert.equal(PRESETS.length, 3);
  assert.equal(nearestDistrict(24.86, 89.36).id, 'bogura');
});

test('Hargreaves ET0 in a sensible range', () => {
  const v = et0Hargreaves(34, 24, 24.85, 120);
  assert.ok(v > 3 && v < 8, String(v));
});

test('rotations for every hazard zone, irrigation level and 2040', () => {
  assert.equal(a.mode, 'monsoon');
  for (const flags of [[], ['saline'], ['haor'], ['barind'], ['flood']]) {
    for (const irrigation of ['none', 'limited', 'full']) {
      for (const future of [false, true]) {
        const plan = planRotations({ a, power, soil: { clay: 30, sand: 30, soc: 9, ph: 6.2 }, irrigation, flags, future, weights: { soil: 2, water: 1, profit: 1, risk: 1 }, current: DEFAULT_CURRENT });
        assert.ok(plan.rotations.length >= 2, `${flags} ${irrigation} → ${plan.rotations.length}`);
        assert.ok(plan.current);
      }
    }
  }
  assert.ok(fieldHealth(a, null).score > 0);
});

test('parsers', () => {
  const c = compactPower({ properties: { parameter: { T2M: { 20250101: 20, 20250102: -999 } } } });
  assert.equal(c.n, 1);
  const s = parseSoil({ properties: { layers: [{ name: 'clay', unit_measure: { d_factor: 10 }, depths: [{ label: '0-5cm', values: { mean: 300 } }] }] } });
  assert.equal(s.clay, 30);
});

test('assistant answers in Bangla', () => {
  const engineCtx = { a, power, soil: { clay: 28, sand: 30, soc: 9.5, ph: 6.1 }, irrigation: 'full', flags: [], weights: { soil: 3, water: 1, profit: 1, risk: 1 }, current: DEFAULT_CURRENT };
  const ctx = { lang: 'bn', a, plan: planRotations(engineCtx), futurePlan: planRotations({ ...engineCtx, future: true }), farm: { name: 'জমি' }, district: DISTRICT.bogura, soil: engineCtx.soil, engineCtx };
  assert.ok(answer('কখন আমন লাগাব?', ctx).text.includes('বর্ষা'));
  assert.ok(answer('এবার কি বোরো ধান করব?', ctx).text.includes('বোরো'));
});

#!/usr/bin/env node
// Download REAL NASA data for the demo fields and bundle it with the app (works offline, great for the video).
//   npm run fetch-data                       → Sariakandi, Kahaloo, Rajshahi
//   node scripts/fetch-data.mjs --id myfarm --lat 24.85 --lon 89.37
// Writes public/data/<id>.json. Commit those files so the deployed app has real data even without internet.
import { writeFile, mkdir } from 'node:fs/promises';
import { getPower, getNdvi, getSoil, fetchJSON } from '../src/fieldshift/lib/nasa-core.js';
import { PRESETS } from '../src/fieldshift/lib/districts.js';

const args = Object.fromEntries(process.argv.slice(2).reduce((acc, a, i, arr) => (a.startsWith('--') ? [...acc, [a.slice(2), arr[i + 1]]] : acc), []));
const targets = args.lat ? [{ id: args.id || 'custom', lat: Number(args.lat), lon: Number(args.lon) }] : PRESETS;
const out = new URL('../public/data/', import.meta.url);
await mkdir(out, { recursive: true });

for (const t of targets) {
  process.stdout.write(`→ ${t.id} (${t.lat}, ${t.lon}) … `);
  const [pw, nd, so] = await Promise.allSettled([getPower(fetchJSON, t.lat, t.lon), getNdvi(fetchJSON, t.lat, t.lon), getSoil(fetchJSON, t.lat, t.lon)]);
  if (pw.status !== 'fulfilled') { console.log('FAILED (POWER):', pw.reason?.message || pw.reason); continue; }
  const body = {
    id: t.id, lat: t.lat, lon: t.lon, fetchedAt: new Date().toISOString(),
    power: pw.value,
    ndvi: nd.status === 'fulfilled' ? nd.value : null,
    soil: so.status === 'fulfilled' ? so.value : null,
  };
  await writeFile(new URL(`${t.id}.json`, out), JSON.stringify(body));
  console.log(`ok — ${pw.value.n} days POWER, ${body.ndvi ? body.ndvi.length : 0} NDVI, soil ${body.soil ? 'yes' : 'no'}`);
}

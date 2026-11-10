// Rotation engine for Bangladesh's three cropping seasons.
// For every candidate crop it computes a monthly water balance from NASA POWER climate,
// counts real damaging-heat / cold days in the NASA daily record, adds the district's
// hazards (salinity, haor flash floods, Barind drought, char floods), and scores each
// full-year rotation for soil health, water, return and risk — today and in 2040.
import { CROPS, CROP } from './crops.js';
import { daysPerYear } from './analysis.js';

const clamp = (x, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, x));

/** Bangladesh seasons in rotation order (the farm year starts with Aman). */
export const SEASONS = [
  { id: 'k2', months: [6, 7, 8, 9], en: 'Kharif-2 (Aman)', bn: 'খরিফ-২ (আমন)' },
  { id: 'rabi', months: [10, 11, 0, 1], en: 'Rabi (winter)', bn: 'রবি (শীত)' },
  { id: 'k1', months: [2, 3, 4, 5], en: 'Kharif-1 (summer)', bn: 'খরিফ-১ (গ্রীষ্ম)' },
];

/**
 * Place one crop in a season. `offset` = months already taken by the previous crop (Boro runs into Kharif-1).
 * Returns null when the crop cannot work there (temperature, water, length).
 */
export function placeCrop(crop, si, ctx, offset = 0) {
  const { a, power, soil, irrigation, future, flags = [] } = ctx;
  const slot = SEASONS[si];
  const dT = future ? a.future.dT : 0;
  const rf = future ? a.future.rainFactor : 1;
  const avail = slot.months.slice(offset);
  const seq = [...avail, ...SEASONS[(si + 1) % 3].months];
  const shift = crop.shift || 0;
  const need = crop.role === 'fallow' ? avail.length : Math.max(1, Math.ceil(crop.days / 30.4));
  if (crop.role !== 'fallow' && shift && offset) return null;
  const months = crop.role === 'fallow' ? avail : seq.slice(shift, shift + need);
  const overflow = Math.max(0, shift + need - avail.length);
  if (!avail.length && crop.role !== 'fallow') return null;
  if (overflow > (shift ? 2 : 0)) return null;
  const issues = [];

  // temperature fit
  if (crop.role !== 'fallow') {
    const tm = months.map((m) => a.clim[m].tmean + dT);
    const avg = tm.reduce((s, x) => s + x, 0) / tm.length;
    if (avg < crop.t[0] - 1.5 || avg > crop.t[1] + 2) return null;
    if (Math.min(...tm) < crop.t[0] - 5) return null;
  }

  // monthly water balance (FAO-56 style)
  let etc = 0, eff = 0, perc = 0, wettest = 0, rainSum = 0;
  for (const m of months) {
    const c = a.clim[m];
    const e = crop.kc * c.et0 * (future ? 1 + 0.03 * dT : 1);
    const r = c.rain * rf;
    wettest = Math.max(wettest, r);
    rainSum += r;
    etc += e;
    eff += Math.min(e, r * 0.8);
    if (crop.paddy) perc += 2.5 * 30.4; // puddling + deep percolation ≈ 2.5 mm/day
  }
  // Rabi crops sown right after Aman use moisture stored in the soil (relay / zero-till sowing).
  if (slot.id === 'rabi' && !crop.paddy && crop.role !== 'fallow') {
    const stored = soil?.clay > 35 ? 180 : soil?.sand > 55 ? 90 : 150;
    eff += Math.min(stored, Math.max(0, etc - eff));
  }
  if (crop.paddy) {
    perc *= soil?.sand > 55 ? 1.6 : soil?.clay > 35 ? 0.7 : 1;
    eff = Math.min(etc + perc, Math.max(eff, rainSum * 0.85)); // bunded paddy stores monsoon rain
  }
  const irrigationNeed = crop.role === 'fallow' ? 0 : Math.max(0, Math.round(etc + perc - eff));
  const cap = irrigation === 'full' ? Infinity : irrigation === 'limited' ? 250 : 0;
  const shortfall = Math.max(0, irrigationNeed - cap);
  const demand = etc + perc;
  if (crop.role !== 'fallow' && shortfall > demand * (crop.drought === 3 ? 0.6 : crop.drought === 2 ? 0.45 : 0.2)) return null;
  if (shortfall > 0 && crop.role !== 'fallow') issues.push({ k: 'short', mm: Math.round(shortfall) });

  // climate risk from the real NASA POWER daily record (recent decade), shifted for 2040
  const P = power.p;
  let risk = 0, heatDays = 0, coldDays = 0;
  if (crop.role !== 'fallow') {
    heatDays = daysPerYear(power, a, months, (i) => P.T2M_MAX[i] !== null && P.T2M_MAX[i] + dT >= crop.heat);
    coldDays = daysPerYear(power, a, months, (i) => P.T2M_MIN[i] !== null && P.T2M_MIN[i] + dT * 0.8 <= crop.cold);
    risk += heatDays * 2.5 + coldDays * 2;
    if (heatDays >= 1) issues.push({ k: 'heat', days: Math.round(heatDays), t: crop.heat });
    if (coldDays >= 2) issues.push({ k: 'cold', days: Math.round(coldDays), t: crop.cold });
    if (crop.waterlog === 1 && wettest > 320) { risk += 25; issues.push({ k: 'waterlog' }); }
    const phBad = soil?.ph && (soil.ph < crop.ph[0] - 0.3 || soil.ph > crop.ph[1] + 0.3);
    if (phBad) { risk += 12; issues.push({ k: 'ph', ph: soil.ph }); }
    if (crop.sandy && soil?.clay > 40) risk += 10;
    if (demand) risk += (shortfall / demand) * 60;

    // Bangladesh hazard zones
    const dryMonths = months.filter((m) => [11, 0, 1, 2, 3, 4].includes(m)).length;
    if (flags.includes('saline') && dryMonths) {
      const add = crop.salt === 1 ? 30 : crop.salt === 2 ? 10 : 0;
      if (add) { risk += add; issues.push({ k: 'salt', sev: crop.salt }); }
    }
    if (flags.includes('haor') && (months.includes(3) || months.includes(4))) {
      const add = crop.id === 'rice_boro' ? 18 : 28;
      risk += add; issues.push({ k: 'flashflood', boro: crop.id === 'rice_boro' });
    }
    if (flags.includes('barind') && irrigationNeed > 250) { risk += 12; issues.push({ k: 'groundwater', mm: irrigationNeed }); }
    if (flags.includes('flood') && slot.id === 'k2') {
      if (crop.waterlog === 1) { risk += 25; issues.push({ k: 'riverflood' }); }
      else if (crop.paddy) { risk += 8; issues.push({ k: 'submerge' }); }
    }
    if (flags.includes('cold') && crop.id === 'rice_boro') { risk += 8; issues.push({ k: 'coldboro' }); }
  } else {
    risk = flags.includes('saline') ? 10 : 4;
  }

  return { crop: crop.id, season: slot.id, si, months, overflow, etc: Math.round(etc), perc: Math.round(perc), irrigation: irrigationNeed, shortfall, heatDays, coldDays, risk: clamp(Math.round(risk)), issues };
}

/** Score a full rotation (one placement per season). */
export function scoreRotation(places, ctx) {
  const { soil, weights, flags = [] } = ctx;
  const crops = places.map((p) => CROP[p.crop]);
  const lowCarbon = soil?.soc !== null && soil?.soc !== undefined && soil.soc < 12;
  const reasons = [];

  let s = 40;
  for (const c of crops) {
    if (c.role === 'fallow') { s -= flags.includes('hill') ? 12 : 8; continue; }
    if (c.nfix) s += (c.role === 'manure' ? 18 : 12) * (lowCarbon ? 1.25 : 1);
    s += c.residue * 2;
    if (c.root === 3) s += 3;
    if (c.paddy) s -= 3;
  }
  const real = crops.filter((c) => c.role !== 'fallow');
  const fams = new Set(real.map((c) => c.fam));
  s += Math.min(14, (fams.size - 1) * 6);
  for (let i = 0; i < crops.length - 1; i++) {
    if (crops[i].fam !== 'none' && crops[i].fam === crops[i + 1].fam) { s -= 8; reasons.push({ k: 'samefam', a: crops[i].id, b: crops[i + 1].id }); }
  }
  if (real.filter((c) => c.paddy).length >= 2) reasons.push({ k: 'ricerice' });
  const soilScore = clamp(Math.round(s));

  const irrigation = places.reduce((x, p) => x + p.irrigation, 0);
  const totalWater = places.reduce((x, p) => x + p.etc + p.perc, 0);
  const waterScore = clamp(Math.round(100 - irrigation / 13));

  const riskMax = Math.max(...places.map((p) => p.risk));
  const riskAvg = places.reduce((x, p) => x + p.risk, 0) / places.length;
  const risk = clamp(Math.round(riskMax * 0.6 + riskAvg * 0.4));
  const ret = clamp(Math.round(crops.reduce((x, c) => x + c.ret, 0) * 0.42 * (1 - risk / 250)));

  for (const c of crops) {
    if (c.nfix) reasons.push({ k: c.role === 'manure' ? 'manure' : 'nfix', crop: c.id });
    if (c.role === 'fallow') reasons.push({ k: 'fallow' });
    if (c.root === 3 && c.role === 'crop') reasons.push({ k: 'deep', crop: c.id });
  }
  if (fams.size >= 3) reasons.push({ k: 'families', n: fams.size });
  for (const p of places) for (const iss of p.issues) reasons.push({ ...iss, crop: p.crop, months: p.months });
  if (irrigation > 0) reasons.push({ k: 'irrig', mm: irrigation });
  if (lowCarbon) reasons.push({ k: 'lowsoc', soc: soil.soc });

  const w = weights || { soil: 1, water: 1, profit: 1, risk: 1 };
  const wsum = w.soil + w.water + w.profit + w.risk || 1;
  const overall = Math.round((soilScore * w.soil + waterScore * w.water + ret * w.profit + (100 - risk) * w.risk) / wsum);
  return { places, crops: crops.map((c) => c.id), soil: soilScore, water: waterScore, irrigation, totalWater: Math.round(totalWater), ret, risk, overall, reasons: dedupe(reasons) };
}

function dedupe(rs) {
  const seen = new Set();
  return rs.filter((r) => { const k = JSON.stringify([r.k, r.crop, r.a]); if (seen.has(k)) return false; seen.add(k); return true; });
}

const quick = (p) => {
  const c = CROP[p.crop];
  return (c.nfix ? 22 : 0) + c.ret * 0.5 - p.risk - p.irrigation / 25 + (c.role === 'fallow' ? -12 : 0) + c.residue * 3;
};

/** Rank rotations. ctx = { a, power, soil, irrigation, weights, future, flags, current: [k2, rabi, k1] } */
export function planRotations(ctx, limit = 6) {
  const combos = [];
  const walk = (si, offset, acc) => {
    if (si === 3) { combos.push(acc); return; }
    const list = CROPS.filter((c) => c.seasons.includes(SEASONS[si].id) || (offset && c.role === 'fallow'))
      .map((c) => placeCrop(c, si, ctx, offset)).filter(Boolean);
    list.sort((x, y) => quick(y) - quick(x));
    const top = list.filter((p) => p.crop !== 'fallow').slice(0, si === 0 ? 3 : 7);
    const fallow = list.find((p) => p.crop === 'fallow');
    if (fallow && (si !== 0 || !top.length)) top.push(fallow);
    for (const p of top) walk(si + 1, p.overflow, [...acc, p]);
  };
  walk(0, 0, []);

  const scored = combos.map((c) => scoreRotation(c, ctx)).sort((x, y) => y.overall - x.overall);
  const out = [];
  for (const r of scored) {
    const sig = r.crops.join('|');
    if (out.some((o) => o.crops.join('|') === sig)) continue;
    if (out.filter((o) => o.crops.filter((c, i) => c === r.crops[i]).length >= 2).length >= 2) continue; // keep variety
    out.push(r);
    if (out.length >= limit) break;
  }

  let current = null;
  if (ctx.current?.length) {
    let offset = 0;
    const places = SEASONS.map((_, si) => {
      const id = ctx.current[si] || 'fallow';
      const p = placeCrop(CROP[id], si, ctx, offset) || forcePlace(CROP[id], si, ctx, offset);
      offset = p.overflow || 0;
      return p;
    });
    current = { ...scoreRotation(places, ctx), isCurrent: true };
  }
  return { slots: SEASONS, rotations: out, current };
}

/** The crop the farmer already grows, even when it is a poor fit — flagged as such. */
function forcePlace(crop, si, ctx, offset) {
  const relaxed = { ...crop, t: [-50, 60], drought: 3 };
  const p = placeCrop(relaxed, si, { ...ctx, irrigation: 'full' }, crop.shift ? 0 : offset)
    || { crop: crop.id, season: SEASONS[si].id, si, months: SEASONS[si].months.slice(offset), overflow: 0, etc: 0, perc: 0, irrigation: 0, shortfall: 0, heatDays: 0, coldDays: 0, risk: 50, issues: [] };
  return { ...p, crop: crop.id, risk: clamp(p.risk + 25), issues: [...p.issues, { k: 'misfit' }] };
}

export const DEFAULT_CURRENT = ['rice_aman', 'rice_boro', 'fallow'];

/** Typical starting irrigation for a district. */
export const defaultIrrigation = (flags) => (flags.includes('barind') ? 'limited' : flags.includes('saline') ? 'limited' : 'full');

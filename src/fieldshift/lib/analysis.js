// Climate analysis on NASA POWER daily data. Pure functions — no network, easy to test.
const DAY = 86400000;
export const MONTHS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

const mean = (a) => { const v = a.filter((x) => x !== null && !Number.isNaN(x)); return v.length ? v.reduce((s, x) => s + x, 0) / v.length : null; };
const sum = (a) => a.reduce((s, x) => s + (x || 0), 0);
const r1 = (x) => (x === null || x === undefined ? null : Math.round(x * 10) / 10);

/** FAO-56 extraterrestrial radiation, MJ m-2 day-1. */
export function extraterrestrialRadiation(latDeg, doy) {
  const phi = (latDeg * Math.PI) / 180;
  const dr = 1 + 0.033 * Math.cos((2 * Math.PI * doy) / 365);
  const delta = 0.409 * Math.sin((2 * Math.PI * doy) / 365 - 1.39);
  const x = Math.max(-1, Math.min(1, -Math.tan(phi) * Math.tan(delta)));
  const ws = Math.acos(x);
  return ((24 * 60) / Math.PI) * 0.082 * dr * (ws * Math.sin(phi) * Math.sin(delta) + Math.cos(phi) * Math.cos(delta) * Math.sin(ws));
}

/** Hargreaves reference evapotranspiration, mm/day. */
export function et0Hargreaves(tmax, tmin, latDeg, doy) {
  if (tmax === null || tmin === null) return null;
  const tmean = (tmax + tmin) / 2;
  const ra = extraterrestrialRadiation(latDeg, doy) * 0.408;
  return Math.max(0, 0.0023 * (tmean + 17.8) * Math.sqrt(Math.max(0, tmax - tmin)) * ra);
}

/** Calendar index for every day in the series. */
export function indexDays(power) {
  const t0 = Date.parse(power.start + 'T00:00:00Z');
  const year = new Array(power.n), month = new Array(power.n), doy = new Array(power.n);
  for (let i = 0; i < power.n; i++) {
    const d = new Date(t0 + i * DAY);
    year[i] = d.getUTCFullYear();
    month[i] = d.getUTCMonth();
    doy[i] = Math.floor((d - Date.UTC(year[i], 0, 1)) / DAY) + 1;
  }
  return { t0, year, month, doy };
}

export function dateOf(ix, i) {
  return new Date(ix.t0 + i * DAY).toISOString().slice(0, 10);
}

/** Main entry: everything the screens need. */
export function analyse(power, lat) {
  const ix = indexDays(power);
  const P = power.p;
  const n = power.n;
  const et0 = new Array(n);
  for (let i = 0; i < n; i++) et0[i] = et0Hargreaves(P.T2M_MAX[i], P.T2M_MIN[i], lat, ix.doy[i]);

  const firstYear = ix.year[0];
  const lastFull = ix.month[n - 1] === 11 && ix.doy[n - 1] >= 365 ? ix.year[n - 1] : ix.year[n - 1] - 1;
  const recentFrom = Math.max(firstYear, lastFull - 9);

  // ---------- per-year stats ----------
  const years = [];
  for (let y = firstYear; y <= lastFull; y++) years.push({ year: y, rain: 0, heat35: 0, heat38: 0, frost: 0, tmean: [], days: 0 });
  const yMap = Object.fromEntries(years.map((y) => [y.year, y]));
  for (let i = 0; i < n; i++) {
    const y = yMap[ix.year[i]];
    if (!y) continue;
    y.days++;
    y.rain += P.PRECTOTCORR[i] || 0;
    if (P.T2M_MAX[i] >= 35) y.heat35++;
    if (P.T2M_MAX[i] >= 38) y.heat38++;
    if (P.T2M_MIN[i] !== null && P.T2M_MIN[i] <= 0) y.frost++;
    y.tmean.push(P.T2M[i]);
  }
  for (const y of years) { y.tmean = r1(mean(y.tmean)); y.rain = Math.round(y.rain); }

  // ---------- monthly climatology (recent 10 full years) ----------
  const monthly = MONTHS.map((m) => ({ m, tmax: [], tmin: [], tmean: [], rain: 0, et0: 0, gwet: [], rh: [], nYears: new Set() }));
  for (let i = 0; i < n; i++) {
    if (ix.year[i] < recentFrom || ix.year[i] > lastFull) continue;
    const mo = monthly[ix.month[i]];
    mo.tmax.push(P.T2M_MAX[i]); mo.tmin.push(P.T2M_MIN[i]); mo.tmean.push(P.T2M[i]);
    mo.rain += P.PRECTOTCORR[i] || 0; mo.et0 += et0[i] || 0; mo.gwet.push(P.GWETROOT[i]); mo.rh.push(P.RH2M[i]);
    mo.nYears.add(ix.year[i]);
  }
  const clim = monthly.map((mo) => {
    const ny = mo.nYears.size || 1;
    return { m: mo.m, tmax: r1(mean(mo.tmax)), tmin: r1(mean(mo.tmin)), tmean: r1(mean(mo.tmean)), rain: Math.round(mo.rain / ny), et0: Math.round(mo.et0 / ny), gwet: r1((mean(mo.gwet) || 0) * 100), rh: r1(mean(mo.rh)) };
  });
  const annualRain = sum(clim.map((c) => c.rain));

  // ---------- seasonality / farming mode ----------
  let wetStart = 0, wetShare = 0;
  for (let s = 0; s < 12; s++) {
    const r = sum([0, 1, 2, 3, 4, 5].map((k) => clim[(s + k) % 12].rain));
    if (r > wetShare) { wetShare = r; wetStart = s; }
  }
  wetShare = annualRain ? wetShare / annualRain : 0;
  const coldest = Math.min(...clim.map((c) => c.tmean));
  let mode = 'tropical';
  if (coldest < 7) mode = 'temperate';
  else if (wetShare >= 0.7 && annualRain >= 450) mode = 'monsoon';
  else if (annualRain < 350) mode = 'arid';

  // ---------- growing-window drift ----------
  const window = mode === 'temperate' ? frostWindow(power, ix, lastFull) : rainWindow(power, ix, wetStart, lastFull, annualRain);

  // ---------- trends → 2040 ----------
  const yrs = years.filter((y) => y.days > 360);
  const tSlope = slope(yrs.map((y) => y.year), yrs.map((y) => y.tmean));
  const rSlope = slope(yrs.map((y) => y.year), yrs.map((y) => y.rain));
  const recentMid = (recentFrom + lastFull) / 2;
  const yearsAhead = 2040 - recentMid;
  const recentRain = mean(yrs.filter((y) => y.year >= recentFrom).map((y) => y.rain)) || annualRain;
  const future = {
    year: 2040,
    dT: r1(Math.max(0.3, Math.min(3, (tSlope || 0.02) * yearsAhead))),
    rainFactor: Math.round(Math.max(0.75, Math.min(1.25, 1 + ((rSlope || 0) * yearsAhead) / Math.max(1, recentRain))) * 100) / 100,
    tSlopeDecade: r1((tSlope || 0) * 10),
    rSlopeDecade: Math.round((rSlope || 0) * 10),
  };

  const first10 = yrs.filter((y) => y.year < firstYear + 10);
  const last10 = yrs.filter((y) => y.year >= recentFrom);
  const change = {
    heat35: r1((mean(last10.map((y) => y.heat35)) || 0) - (mean(first10.map((y) => y.heat35)) || 0)),
    heat35Now: Math.round(mean(last10.map((y) => y.heat35)) || 0),
    rainPct: Math.round(((mean(last10.map((y) => y.rain)) || 0) / Math.max(1, mean(first10.map((y) => y.rain)) || 1) - 1) * 100),
    tmean: r1((mean(last10.map((y) => y.tmean)) || 0) - (mean(first10.map((y) => y.tmean)) || 0)),
  };

  const current = currentConditions(power, ix, et0);
  const alerts = buildAlerts(current, clim);

  return {
    ix, et0, years, clim, annualRain, wetStart, wetShare: Math.round(wetShare * 100), mode, window, future, change, current, alerts,
    period: { first: firstYear, lastFull, recentFrom, lastDate: dateOf(ix, n - 1) },
  };
}

/** Average number of days per year (recent decade) in the given months where predicate holds. */
export function daysPerYear(power, a, months, pred) {
  const set = new Set(months);
  let count = 0;
  const yrs = new Set();
  const { ix } = a;
  for (let i = 0; i < power.n; i++) {
    const y = ix.year[i];
    if (y < a.period.recentFrom || y > a.period.lastFull) continue;
    yrs.add(y);
    if (set.has(ix.month[i]) && pred(i)) count++;
  }
  return yrs.size ? count / yrs.size : 0;
}

function slope(xs, ys) {
  const pts = xs.map((x, i) => [x, ys[i]]).filter((p) => p[1] !== null && !Number.isNaN(p[1]));
  if (pts.length < 5) return null;
  const mx = mean(pts.map((p) => p[0])), my = mean(pts.map((p) => p[1]));
  let num = 0, den = 0;
  for (const [x, y] of pts) { num += (x - mx) * (y - my); den += (x - mx) ** 2; }
  return den ? num / den : null;
}

/** Monsoon / wet-season onset and withdrawal per year. */
export function rainWindow(power, ix, wetStart, lastFull, annualRain = 1500) {
  const R = power.p.PRECTOTCORR;
  const n = power.n;
  const perYear = [];
  const searchMonth = wetStart; // start of the wettest 6-month block (May in Bangladesh)
  // Thresholds scale with how wet the place is, so pre-monsoon showers (Kalbaishakhi) don't count.
  const t5 = Math.max(20, annualRain * 0.015), t30 = Math.max(60, annualRain * 0.07), tEnd = Math.max(20, annualRain * 0.012);
  for (let y = ix.year[0]; y <= lastFull + 1; y++) {
    const startMs = Date.UTC(y, searchMonth, 1);
    const s = Math.round((startMs - ix.t0) / DAY);
    const e = s + 270;
    if (s < 0 || e + 30 >= n) continue;
    let onset = null;
    for (let d = s; d < s + 150; d++) {
      const r5 = sum(R.slice(d, d + 5));
      const r30 = sum(R.slice(d, d + 30));
      let dry = false;
      for (let k = d + 5; k < d + 24; k++) if (sum(R.slice(k, k + 7)) < 5) { dry = true; break; }
      if (r5 >= t5 && r30 >= t30 && !dry) { onset = d; break; }
    }
    if (onset === null) continue;
    let end = null;
    for (let d = Math.min(e, n - 11); d > onset + 45; d--) {
      if (sum(R.slice(d, d + 10)) >= tEnd) { end = d + 10; break; }
    }
    if (end === null) continue;
    perYear.push({ year: y, start: ix.doy[onset], end: ix.doy[Math.min(end, n - 1)], len: end - onset, startIdx: onset });
  }
  return summariseWindow('rain', perYear);
}

/** Frost-free season (temperate farms): last spring frost → first autumn frost. */
export function frostWindow(power, ix, lastFull) {
  const T = power.p.T2M_MIN;
  const perYear = [];
  for (let y = ix.year[0]; y <= lastFull; y++) {
    let lastSpring = null, firstAutumn = null;
    for (let i = 0; i < power.n; i++) {
      if (ix.year[i] !== y || T[i] === null) continue;
      if (T[i] <= 0 && ix.doy[i] < 182) lastSpring = i;
      if (T[i] <= 0 && ix.doy[i] >= 182 && firstAutumn === null) firstAutumn = i;
    }
    if (lastSpring === null || firstAutumn === null) continue;
    perYear.push({ year: y, start: ix.doy[lastSpring] + 1, end: ix.doy[firstAutumn], len: firstAutumn - lastSpring, startIdx: lastSpring });
  }
  return summariseWindow('frost', perYear);
}

function summariseWindow(kind, perYear) {
  if (perYear.length < 6) return { kind, perYear, ok: false };
  const k = Math.min(10, Math.floor(perYear.length / 2));
  const early = perYear.slice(0, k), late = perYear.slice(-k);
  const circMean = (arr) => { // day-of-year mean that survives the Dec→Jan wrap
    const a = arr.map((d) => (d / 365.25) * 2 * Math.PI);
    const ang = Math.atan2(mean(a.map(Math.sin)), mean(a.map(Math.cos)));
    return Math.round(((ang < 0 ? ang + 2 * Math.PI : ang) / (2 * Math.PI)) * 365.25) || 1;
  };
  const e = { start: circMean(early.map((p) => p.start)), end: circMean(early.map((p) => p.end)), len: Math.round(mean(early.map((p) => p.len))) };
  const l = { start: circMean(late.map((p) => p.start)), end: circMean(late.map((p) => p.end)), len: Math.round(mean(late.map((p) => p.len))) };
  let shift = l.start - e.start;
  if (shift > 180) shift -= 365; if (shift < -180) shift += 365;
  return {
    kind, ok: true, perYear,
    early: { ...e, from: early[0].year, to: early[early.length - 1].year },
    late: { ...l, from: late[0].year, to: late[late.length - 1].year },
    shiftStart: shift, shiftLen: l.len - e.len,
  };
}

/** Last-30-day conditions against the same calendar days in other years. */
export function currentConditions(power, ix, et0) {
  const P = power.p;
  const n = power.n;
  let last = n - 1;
  while (last > 0 && P.PRECTOTCORR[last] === null) last--;
  const win = (arr, from, to) => arr.slice(Math.max(0, from), to + 1);
  const rain30 = sum(win(P.PRECTOTCORR, last - 29, last));
  const rain14 = sum(win(P.PRECTOTCORR, last - 13, last));
  const rain7 = sum(win(P.PRECTOTCORR, last - 6, last));

  // Climatology for the same window in previous years
  const normal30 = [], normal14 = [], normalGw = [], normalTmax = [];
  for (let back = 365; last - back - 30 > 0; back += 365) {
    const j = last - back;
    normal30.push(sum(win(P.PRECTOTCORR, j - 29, j)));
    normal14.push(sum(win(P.PRECTOTCORR, j - 13, j)));
    const gw = mean(win(P.GWETROOT, j - 3, j));
    if (gw !== null) normalGw.push(gw);
    normalTmax.push(mean(win(P.T2M_MAX, j - 6, j)));
  }
  let lastGw = last;
  while (lastGw > 0 && P.GWETROOT[lastGw] === null) lastGw--;
  const gwNow = mean(win(P.GWETROOT, lastGw - 3, lastGw));
  const gw14ago = mean(win(P.GWETROOT, lastGw - 17, lastGw - 14));
  const tmax7 = mean(win(P.T2M_MAX, last - 6, last));
  const pct = gwNow !== null && normalGw.length ? Math.round((normalGw.filter((v) => v < gwNow).length / normalGw.length) * 100) : null;
  const et7 = sum(win(et0, last - 6, last)) / 7;
  return {
    date: dateOf(ix, last),
    rain30: Math.round(rain30), rain14: Math.round(rain14), rain7: Math.round(rain7),
    rain30Normal: Math.round(mean(normal30) || 0), rain14Normal: Math.round(mean(normal14) || 0),
    gw: gwNow === null ? null : Math.round(gwNow * 100) / 100,
    gwNormal: normalGw.length ? Math.round(mean(normalGw) * 100) / 100 : null,
    gwPercentile: pct,
    gwDrop14: gwNow !== null && gw14ago !== null ? Math.round((gw14ago - gwNow) * 100) / 100 : null,
    tmax7: r1(tmax7), tmax7Normal: r1(mean(normalTmax)),
    tmaxToday: r1(P.T2M_MAX[last]), tminToday: r1(P.T2M_MIN[last]),
    et0: r1(et7),
    maxRainDay7: Math.round(Math.max(0, ...win(P.PRECTOTCORR, last - 6, last).map((v) => v || 0))),
    hot3: win(P.T2M_MAX, last - 6, last).filter((v) => v >= 36).length,
  };
}

export function buildAlerts(c) {
  const out = [];
  const dryRain = c.rain14Normal > 10 && c.rain14 < 0.5 * c.rain14Normal;
  if (c.gwDrop14 !== null && c.gwDrop14 >= 0.05 && dryRain && c.tmax7 >= (c.tmax7Normal || 0)) {
    out.push({ id: 'flash', level: 'high', vars: { drop: Math.round(c.gwDrop14 * 100) } });
  } else if (c.gwPercentile !== null && c.gwPercentile <= 15) {
    out.push({ id: 'dry', level: 'med', vars: { pct: c.gwPercentile } });
  }
  if (c.hot3 >= 3 || c.tmax7 >= 38) out.push({ id: 'heat', level: c.tmax7 >= 38 ? 'high' : 'med', vars: { t: c.tmax7, d: c.hot3 } });
  if (c.maxRainDay7 >= 80) out.push({ id: 'flood', level: 'high', vars: { mm: c.maxRainDay7 } });
  else if (c.rain30Normal > 20 && c.rain30 > 1.8 * c.rain30Normal) out.push({ id: 'wet', level: 'med', vars: { pct: Math.round((c.rain30 / c.rain30Normal) * 100) } });
  if (c.tminToday !== null && c.tminToday <= 2) out.push({ id: 'frost', level: 'med', vars: { t: c.tminToday } });
  return out;
}

/** 0–100 field-health score from soil water, recent heat and (if available) NDVI vs its own history. */
export function fieldHealth(a, ndviSeries) {
  const c = a.current;
  let score = 70;
  const parts = [];
  if (c.gwPercentile !== null) { const s = (c.gwPercentile - 50) * 0.3; score += s; parts.push(['soil', Math.round(s)]); }
  if (c.tmax7 !== null && c.tmax7Normal !== null) { const s = -Math.max(0, c.tmax7 - c.tmax7Normal) * 3; score += s; parts.push(['heat', Math.round(s)]); }
  const nd = ndviStatus(ndviSeries);
  if (nd) { const s = nd.anomaly * 120; score += s; parts.push(['ndvi', Math.round(s)]); }
  return { score: Math.max(5, Math.min(99, Math.round(score))), parts, ndvi: nd };
}

export function ndviStatus(series) {
  if (!series || !series.length) return null;
  const latest = series[series.length - 1];
  const md = latest.date.slice(5, 7);
  const same = series.filter((s) => s.date.slice(5, 7) === md && s.date !== latest.date).map((s) => s.ndvi);
  const normal = same.length ? mean(same) : mean(series.map((s) => s.ndvi));
  return { latest: latest.ndvi, date: latest.date, normal: Math.round(normal * 100) / 100, anomaly: Math.round((latest.ndvi - normal) * 100) / 100 };
}

export function doyToMonthFrac(doy) {
  return ((doy - 1) / 365.25) * 12;
}

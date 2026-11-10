import React from 'react';
import { CROP, cropName } from './lib/crops.js';
import { MONTHS, num } from './lib/i18n.js';

const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round' };
const paths = {
  field: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /><circle cx="12" cy="12" r="8" /></>,
  plan: <path d="M3 6h18M3 12h12M3 18h7" />,
  map: <><path d="m12 2 10 5-10 5L2 7z" /><path d="m2 17 10 5 10-5M2 12l10 5 10-5" /></>,
  mic: <><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0M12 17v5" /></>,
  info: <><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></>,
  back: <path d="m15 18-6-6 6-6" />,
  arrow: <path d="M5 12h14M13 5l7 7-7 7" />,
  warn: <><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></>,
  gps: <><circle cx="12" cy="12" r="4" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></>,
  share: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" /></>,
  speaker: <><path d="M11 5 6 9H2v6h4l5 4z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" /></>,
  send: <path d="m22 2-7 20-4-9-9-4zM22 2 11 13" />,
  refresh: <><path d="M21 12a9 9 0 1 1-3-6.7L21 8" /><path d="M21 3v5h-5" /></>,
  chevron: <path d="m6 9 6 6 6-6" />,
  check: <path d="M20 6 9 17l-5-5" />,
  sat: <><path d="m13 7 4-4 4 4-4 4zM3 17l4-4 4 4-4 4zM9 9l6 6" /><path d="M16 21a5 5 0 0 0 5-5" /></>,
  drop: <path d="M12 2.7S6 9 6 14a6 6 0 0 0 12 0c0-5-6-11.3-6-11.3z" />,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  leaf: <><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10z" /><path d="M2 21c0-3 1.9-5.4 5.1-6" /></>,
  wifiOff: <><path d="M2 2l20 20M8.5 16.5a5 5 0 0 1 7 0M5 13a10 10 0 0 1 5.2-2.8M19 13a10 10 0 0 0-2.3-1.7M2 8.8a15 15 0 0 1 4.2-2.6M22 8.8A15 15 0 0 0 11 4.6" /><path d="M12 20h.01" /></>,
};

export function Icon({ name, size = 20, color, style }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" {...P} style={{ color, flex: '0 0 auto', ...style }}>{paths[name]}</svg>
  );
}

export function Ring({ value, label, size = 124 }) {
  const r = size * 0.42, c = 2 * Math.PI * r;
  const color = value >= 65 ? 'var(--lime)' : value >= 45 ? 'var(--amber)' : 'var(--red)';
  return (
    <svg role="img" aria-label={`${label} ${value}`} width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={size * 0.08} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={size * 0.08} strokeLinecap="round"
        strokeDasharray={`${(c * value) / 100} ${c}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      <text x="50%" y="50%" textAnchor="middle" fontSize={size * 0.27} fontWeight="700" fill="var(--text)" fontFamily="Space Grotesk">{value}</text>
      <text x="50%" y="66%" textAnchor="middle" fontSize={size * 0.075} fill="var(--muted)">{label}</text>
    </svg>
  );
}

/** Simple accessible bar chart. */
export function Bars({ data, height = 120, format = (v) => v, highlight, lang, unit = '' }) {
  if (!data?.length) return null;
  const vals = data.map((d) => d.v).filter((v) => v !== null);
  const max = Math.max(...vals), min = Math.min(0, ...vals);
  const span = max - min || 1;
  return (
    <div>
      <div className="bars" style={{ height }} role="img" aria-label={data.map((d) => `${d.label}: ${format(d.v)}`).join(', ')}>
        {data.map((d, i) => (
          <div key={i} className="bar" title={`${d.label}: ${format(d.v)}${unit}`}
            style={{ height: `${Math.max(3, ((d.v - min) / span) * 100)}%`, background: highlight && highlight(d, i) ? 'var(--amber)' : 'var(--lime-dim)' }} />
        ))}
      </div>
      <div className="axis">
        <span>{num(lang, data[0].label)}</span><span>{num(lang, data[Math.floor(data.length / 2)].label)}</span><span>{num(lang, data[data.length - 1].label)}</span>
      </div>
    </div>
  );
}

export function Spark({ data, height = 70 }) {
  if (!data?.length) return null;
  const w = 300, vals = data.map((d) => d.v);
  const max = Math.max(...vals), min = Math.min(...vals), span = max - min || 1;
  const pts = data.map((d, i) => `${(i / (data.length - 1)) * w},${height - 6 - ((d.v - min) / span) * (height - 12)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${height}`} width="100%" height={height} preserveAspectRatio="none" aria-hidden="true">
      <polyline points={pts} fill="none" stroke="var(--lime)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

// Farm year runs Jul → Jun (Aman first)
export const FARM_MONTHS = [6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5];
const col = (m) => FARM_MONTHS.indexOf(m) + 1;

export function cropColor(id) {
  const c = CROP[id];
  if (!c || c.role === 'fallow') return 'var(--fallow)';
  if (c.fam === 'Poaceae') return 'var(--lime)';
  if (c.fam === 'Fabaceae') return 'var(--blue)';
  return 'var(--amber)';
}

export function MonthHeader({ lang }) {
  return (
    <div className="months mono">
      {FARM_MONTHS.map((m) => <span key={m}>{MONTHS[lang][m].slice(0, lang === 'bn' ? 3 : 1)}</span>)}
    </div>
  );
}

export function Timeline({ rotation, lang }) {
  return (
    <div className="timeline" role="img" aria-label={rotation.places.map((p) => `${cropName(p.crop, lang)} ${MONTHS[lang][p.months[0]]}–${MONTHS[lang][p.months[p.months.length - 1]]}`).join(', ')}>
      {rotation.places.filter((p) => p.months.length).map((p, i) => {
        const a = col(p.months[0]), b = col(p.months[p.months.length - 1]);
        const name = cropName(p.crop, lang).replace(/ \(.+\)/, '');
        return (
          <div key={i} className={'seg' + (p.crop === 'fallow' ? ' fallow' : '')} style={{ gridColumn: `${a} / ${b + 1}`, background: cropColor(p.crop) }}>
            {name}
          </div>
        );
      })}
    </div>
  );
}

export function Seg({ options, value, onChange, label }) {
  return (
    <div className="seg-ctl" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} type="button" aria-pressed={value === o.value} className={value === o.value ? 'on' : ''} onClick={() => onChange(o.value)}>{o.label}</button>
      ))}
    </div>
  );
}

export function Stat({ label, value, sub, tone }) {
  return (
    <div className="stat">
      <span className="stat-label">{label}</span>
      <span className="stat-value mono" style={{ color: tone }}>{value}</span>
      {sub && <span className="stat-sub">{sub}</span>}
    </div>
  );
}

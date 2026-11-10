import React from 'react';
import { Icon, Ring, Bars, Spark, Timeline, MonthHeader } from '../components.jsx';
import { t, num, signed, alertText, zoneLabel, doyLabel, MONTHS, bnNum } from '../lib/i18n.js';
import { cropName } from '../lib/crops.js';

export default function Field({ lang, farm, district, flags, data, a, health, plan, go }) {
  const c = a.current;
  const w = a.window;
  const nd = health.ndvi;
  const bn = lang === 'bn';
  const best = plan.rotations[0];
  const mine = farm.chosen && [...plan.rotations, plan.current].find((r) => r && r.crops.join('|') === farm.chosen.join('|'));
  const show = mine || best;

  const statusChip = data.demo
    ? <span className="chip demo">{t(lang, 'demo')}</span>
    : <span className={'chip' + (data.fromCache ? '' : ' live')}>{data.fromCache ? <><Icon name="wifiOff" size={12} /> </> : '● '}{t(lang, 'updated')} {num(lang, c.date.slice(8, 10))} {MONTHS[lang][Number(c.date.slice(5, 7)) - 1]}</span>;

  return (
    <div className="stack">
      <div className="row between wrap">
        <div>
          <div className="kicker">{district[lang]} · {num(lang, farm.lat, 2)}N {num(lang, farm.lon, 2)}E · {num(lang, farm.area, 1)} {bn ? 'বিঘা' : 'bigha'}</div>
          <h1 className="title">{farm.name}</h1>
        </div>
        {statusChip}
      </div>
      {data.demo && <div className="tip">{t(lang, 'demoNote')}</div>}
      {!data.demo && data.via && (
        <span className="mono sub" style={{ fontSize: 11 }}>
          {t(lang, data.via === 'backend' ? 'viaBackend' : data.via === 'bundled' ? 'viaBundled' : 'viaDirect')} · NASA POWER {num(lang, a.period.first)}–{a.period.lastDate}
        </span>
      )}
      {flags.length > 0 && <div className="row wrap">{flags.map((f) => <span key={f} className="chip">{zoneLabel(lang, f)}</span>)}</div>}

      <div className="grid grid-2">
        <div className="stack">
          <div className="card row" style={{ gap: 18 }}>
            <Ring value={health.score} label={t(lang, 'fieldHealth')} />
            <div className="stack" style={{ gap: 10, flex: 1 }}>
              <div className="kv"><span>{t(lang, 'ndvi')}</span><span className="mono">{nd ? num(lang, nd.latest, 2) : '—'}</span></div>
              <div className="kv"><span>{t(lang, 'soilWet')}</span><span className="mono" style={{ color: c.gwPercentile !== null && c.gwPercentile < 25 ? 'var(--amber)' : undefined }}>{c.gw !== null ? num(lang, c.gw * 100) + '%' : '—'}{c.gwPercentile !== null && c.gwPercentile < 25 ? ' ▼' : ''}</span></div>
              <div className="kv"><span>{t(lang, 'et0')}</span><span className="mono">{num(lang, c.et0, 1)} {bn ? 'মিমি/দিন' : 'mm/d'}</span></div>
              <div className="kv"><span>{t(lang, 'tmax')}</span><span className="mono">{num(lang, c.tmaxToday, 1)}°</span></div>
            </div>
          </div>

          <div className="card stack" style={{ gap: 12 }}>
            <div className="row between">
              <h2>{t(lang, 'windowRain')}</h2>
              {w.ok && <span className="mono" style={{ color: 'var(--amber)' }}>{signed(lang, w.shiftStart)} {bn ? 'দিন' : 'd'}</span>}
            </div>
            {w.ok ? (
              <>
                {[w.early, w.late].map((p, i) => (
                  <div className="row" key={i} style={{ gap: 8 }}>
                    <span className="mono sub" style={{ width: 64, fontSize: 10 }}>{num(lang, p.from)}–{bnOrEn(lang, String(p.to).slice(2))}</span>
                    <div style={{ flex: 1, height: 14, background: 'var(--surface2)', borderRadius: 7, position: 'relative' }}>
                      <div style={{ position: 'absolute', left: `${((p.start - 1) / 365) * 100}%`, width: `${(p.len / 365) * 100}%`, height: 14, borderRadius: 7, background: i ? 'var(--lime)' : 'var(--lime-dim)' }} />
                    </div>
                  </div>
                ))}
                <div className="row between mono sub" style={{ paddingLeft: 72, fontSize: 10 }}>
                  {[0, 3, 6, 9, 11].map((m) => <span key={m}>{MONTHS[lang][m]}</span>)}
                </div>
                <span className="sub">
                  {t(lang, 'windowSub', {
                    s: num(lang, Math.abs(w.shiftStart)), dir: t(lang, w.shiftStart >= 0 ? 'later' : 'earlier'),
                    l: num(lang, Math.abs(w.shiftLen)), ldir: t(lang, w.shiftLen >= 0 ? 'longer' : 'shorter'),
                  })} · {bn ? 'এখন শুরু' : 'now starts'} ~{doyLabel(lang, w.late.start)}
                </span>
              </>
            ) : <span className="sub">{t(lang, 'noWindow')}</span>}
          </div>

          <div className="row wrap">
            {['POWER AG', 'MERRA-2 GWET', 'MODIS MOD13Q1', 'SoilGrids 2.0'].map((x) => <span key={x} className="chip">{x}</span>)}
          </div>

          <div className="stack" style={{ gap: 10 }} aria-live="polite">
            <h2 style={{ margin: 0, fontSize: 16 }}>{t(lang, 'alerts')}</h2>
            {a.alerts.length === 0 && <div className="card sub">{t(lang, 'noAlerts')}</div>}
            {a.alerts.map((al) => {
              const [title, body] = alertText(lang, al);
              return (
                <div key={al.id} className={'alert ' + al.level}>
                  <div className="ic"><Icon name="warn" /></div>
                  <div><strong>{title}</strong><span>{body}</span></div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="stack">
          {show && (
            <button className="card stack" onClick={() => go('plan')} style={{ textAlign: 'left', gap: 10, cursor: 'pointer' }}>
              <div className="row between">
                <h2>{mine ? t(lang, 'myPlan') : (bn ? 'সেরা পরবর্তী ফসল-চক্র' : 'Best next rotation')}</h2>
                <Icon name="arrow" color="var(--lime)" />
              </div>
              <MonthHeader lang={lang} />
              <Timeline rotation={show} lang={lang} />
              <span style={{ fontSize: 15, fontWeight: 600 }}>{show.crops.map((x) => cropName(x, lang)).join(' → ')}</span>
              {plan.current && (
                <span className="sub" style={{ color: 'var(--lime)' }}>
                  {t(lang, 'vsNow')}: {t(lang, 'soilGain', { n: num(lang, show.soil - plan.current.soil) })} · {t(lang, 'irrigSave', { n: num(lang, Math.max(0, plan.current.irrigation - show.irrigation)) })}
                </span>
              )}
            </button>
          )}
          <button className="btn" onClick={() => go('plan')}>{t(lang, 'planNext')} <Icon name="arrow" /></button>

          <div className="card stack">
            <h2>{t(lang, 'trends')}</h2>
            <span className="sub">{t(lang, 'heatDaysNow', { n: num(lang, a.change.heat35Now), c: signed(lang, a.change.heat35, 0) })} · {bn ? 'গড় তাপ' : 'mean temp'} {signed(lang, a.change.tmean, 1)}°সে</span>
            {w.ok && (
              <div className="stack" style={{ gap: 6 }}>
                <span className="label">{t(lang, 'onsetChart')}</span>
                <Bars lang={lang} height={90} data={w.perYear.map((p) => ({ label: p.year, v: p.start }))} format={(v) => doyLabel(lang, v)} highlight={(d) => d.v > w.early.start + 5} />
              </div>
            )}
            <div className="stack" style={{ gap: 6 }}>
              <span className="label">{t(lang, 'heatChart')}</span>
              <Bars lang={lang} height={80} data={a.years.filter((y) => y.days > 360).map((y) => ({ label: y.year, v: y.heat35 }))} highlight={(d) => d.v > a.change.heat35Now} />
            </div>
            <div className="stack" style={{ gap: 6 }}>
              <span className="label">{t(lang, 'rainChart')}</span>
              <Bars lang={lang} height={80} data={a.years.filter((y) => y.days > 360).map((y) => ({ label: y.year, v: y.rain }))} />
            </div>
            {data.ndvi?.length > 0 && (
              <div className="stack" style={{ gap: 6 }}>
                <span className="label">{t(lang, 'ndviChart')}</span>
                <Spark data={data.ndvi.map((s) => ({ v: s.ndvi }))} />
              </div>
            )}
            <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>NASA POWER {num(lang, a.period.first)}–{num(lang, a.period.lastFull)} · {bn ? 'দৈনিক' : 'daily'} · ~50 km</span>
          </div>

          {data.soil && (
            <div className="card stack" style={{ gap: 8 }}>
              <h2>{t(lang, 'soilProfile')}</h2>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0,1fr))' }}>
                {[['clay', '%'], ['sand', '%'], ['soc', bn ? ' গ্রা/কেজি' : ' g/kg'], ['ph', '']].map(([k, u]) => (
                  <div key={k} className="stat"><span className="stat-label">{t(lang, k)}</span><span className="stat-value mono">{data.soil[k] !== null ? num(lang, data.soil[k], k === 'ph' ? 1 : 0) + u : '—'}</span></div>
                ))}
              </div>
              <span className="sub">{bn ? 'উপরের ৩০ সেমি মাটি, ২৫০ মিটার মডেল অনুমান' : 'Top 30 cm, 250 m modelled estimate'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const bnOrEn = (lang, s) => (lang === 'bn' ? bnNum(s) : s);

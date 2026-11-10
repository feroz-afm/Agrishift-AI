import React, { useState } from 'react';
import { Icon, Timeline, MonthHeader, Seg } from '../components.jsx';
import { t, num, reasonText, tipFor, riskWord } from '../lib/i18n.js';
import { cropName } from '../lib/crops.js';

const RISK_COLOR = (v) => (v >= 55 ? 'var(--red)' : v >= 28 ? 'var(--amber)' : 'var(--lime)');

function Metric({ label, value, pct, color }) {
  return (
    <div className="stat">
      <span className="stat-label">{label}</span>
      <span className="mono" style={{ fontSize: 14, fontWeight: 600, color }}>{value}</span>
      <div className="meter"><div style={{ width: `${Math.max(4, Math.min(100, pct))}%`, background: color || 'var(--lime)' }} /></div>
    </div>
  );
}

function RotationCard({ r, rank, lang, onChoose, chosen, current, onShare }) {
  const [open, setOpen] = useState(false);
  const bn = lang === 'bn';
  const tips = [...new Set(r.reasons.map((x) => tipFor(lang, x.k, x.crop)).filter(Boolean))];
  return (
    <article className={'rot' + (rank === 1 ? ' best' : '') + (r.isCurrent ? ' now' : '')}>
      <div className="row between" style={{ alignItems: 'flex-start' }}>
        <div className="stack" style={{ gap: 2 }}>
          <span className="kicker">{r.isCurrent ? t(lang, 'yourNow') : `${bn ? 'বিকল্প' : 'Option'} ${num(lang, rank)}`}</span>
          <span style={{ fontWeight: 600, fontSize: 15 }}>{r.crops.map((x) => cropName(x, lang)).join(' → ')}</span>
        </div>
        <div className="row" style={{ gap: 6 }}>
          {rank === 1 && <span className="badge-best">{bn ? 'সেরা' : 'Best'}</span>}
          <span className="mono" style={{ color: 'var(--lime)', fontSize: 13 }}>{num(lang, r.overall)}/{num(lang, 100)}</span>
        </div>
      </div>
      <Timeline rotation={r} lang={lang} />
      <div className="rot-metrics">
        <Metric label={t(lang, 'soil')} value={num(lang, r.soil)} pct={r.soil} color="var(--lime)" />
        <Metric label={t(lang, 'water')} value={`${num(lang, r.irrigation)} ${bn ? 'মিমি' : 'mm'}`} pct={100 - r.water} color="var(--blue)" />
        <Metric label={t(lang, 'ret')} value={num(lang, r.ret)} pct={r.ret} color="var(--amber)" />
        <Metric label={t(lang, 'risk')} value={riskWord(lang, r.risk)} pct={r.risk} color={RISK_COLOR(r.risk)} />
      </div>
      {current && !r.isCurrent && (
        <span className="sub" style={{ color: 'var(--lime)' }}>
          {t(lang, 'vsNow')}: {t(lang, 'soilGain', { n: num(lang, r.soil - current.soil) })}
          {current.irrigation > r.irrigation ? ' · ' + t(lang, 'irrigSave', { n: num(lang, current.irrigation - r.irrigation) }) : ''}
        </span>
      )}
      <button type="button" className="row between" onClick={() => setOpen(!open)} aria-expanded={open}
        style={{ background: 'none', border: 0, padding: '4px 0', color: 'var(--lime)', fontWeight: 600, minHeight: 44 }}>
        {t(lang, 'why')} <Icon name="chevron" style={{ transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>
      {open && (
        <div className="stack" style={{ gap: 10 }}>
          <ul className="reasons">{r.reasons.map((x, i) => { const s = reasonText(lang, x); return s ? <li key={i}>{s}</li> : null; })}</ul>
          {tips.map((tp, i) => <div key={i} className="tip"><strong style={{ color: 'var(--lime)' }}>{bn ? 'পরামর্শ: ' : 'Tip: '}</strong>{tp}</div>)}
          <div className="tip mono" style={{ fontSize: 11 }}>
            {bn ? 'হিসাব' : 'Math'}: ETc = Kc × ET₀ (Hargreaves, NASA POWER T2M_MAX/T2M_MIN) · {bn ? 'কার্যকর বৃষ্টি' : 'eff. rain'} = 0.8 × PRECTOTCORR · {bn ? 'তাপ/ঠান্ডা দিন' : 'heat/cold days'} = {bn ? 'গত ১০ বছরের দৈনিক রেকর্ড' : 'last 10 years daily record'}
          </div>
        </div>
      )}
      {!r.isCurrent && (
        <div className="row">
          <button className={'btn small' + (chosen ? ' ghost' : '')} style={{ flex: 1 }} onClick={() => onChoose(r.crops)}>{chosen ? t(lang, 'chosen') : t(lang, 'choose')}</button>
          <button className="iconbtn" aria-label={t(lang, 'share')} onClick={() => onShare(r)}><Icon name="share" /></button>
        </div>
      )}
    </article>
  );
}

export default function Plan({ lang, farm, setFarm, plan, futurePlan, a, toast }) {
  const [when, setWhen] = useState('now');
  const p = when === 'now' ? plan : futurePlan;
  const bn = lang === 'bn';

  const share = async (r) => {
    const text = `${t(lang, 'appName')} — ${farm.name}\n${r.crops.map((x) => cropName(x, lang)).join(' → ')}\n${t(lang, 'soil')} ${num(lang, r.soil)} · ${t(lang, 'water')} ${num(lang, r.irrigation)} ${bn ? 'মিমি' : 'mm'} · ${t(lang, 'risk')} ${riskWord(lang, r.risk)}\n(NASA POWER · MODIS · SoilGrids)`;
    try {
      if (navigator.share) await navigator.share({ title: t(lang, 'appName'), text });
      else { await navigator.clipboard.writeText(text); toast(t(lang, 'copied')); }
    } catch { /* cancelled */ }
  };

  return (
    <div className="stack">
      <div>
        <h1 className="title">{t(lang, 'rotTitle')}</h1>
        <div className="kicker" style={{ marginTop: 4 }}>{t(lang, 'rotSub')}</div>
      </div>
      <div className="row wrap">
        {['soil', 'water', 'profit', 'risk'].map((k) => (
          <button key={k} type="button" className={'pill' + (farm.priority === k ? ' on' : '')} aria-pressed={farm.priority === k} onClick={() => setFarm({ ...farm, priority: k })}>{t(lang, 'p_' + k)}</button>
        ))}
      </div>
      <Seg value={when} onChange={setWhen} label="climate" options={[{ value: 'now', label: t(lang, 'today') }, { value: '2040', label: t(lang, 'y2040') }]} />
      {when === '2040' && (
        <div className="tip">{t(lang, 'futureNote', { dT: '+' + num(lang, a.future.dT, 1), rf: (a.future.rainFactor >= 1 ? '+' : '−') + num(lang, Math.abs(Math.round((a.future.rainFactor - 1) * 100))) })}</div>
      )}
      <div className="legend">
        <span><i style={{ background: 'var(--lime)' }} />{t(lang, 'legendCereal')}</span>
        <span><i style={{ background: 'var(--blue)' }} />{t(lang, 'legendLegume')}</span>
        <span><i style={{ background: 'var(--amber)' }} />{t(lang, 'legendOther')}</span>
      </div>
      <MonthHeader lang={lang} />

      <div className="grid grid-2">
        {p.current && <RotationCard r={p.current} lang={lang} />}
        {p.rotations.length === 0 && <div className="card">{t(lang, 'noRot')}</div>}
        {p.rotations.map((r, i) => (
          <RotationCard key={r.crops.join('|')} r={r} rank={i + 1} lang={lang} current={p.current}
            chosen={farm.chosen && farm.chosen.join('|') === r.crops.join('|')}
            onChoose={(crops) => { setFarm({ ...farm, chosen: crops }); toast(t(lang, 'chosen')); }}
            onShare={share} />
        ))}
      </div>
      <span className="sub">{t(lang, 'aiFree')}</span>
    </div>
  );
}

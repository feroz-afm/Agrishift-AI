import React, { useState } from 'react';
import { Icon, Seg } from '../components.jsx';
import MapBox from '../MapBox.jsx';
import { DISTRICTS, DISTRICT, DIVISIONS, PRESETS, inBangladesh, nearestDistrict } from '../lib/districts.js';
import { cropsForSeason, cropName } from '../lib/crops.js';
import { SEASONS, DEFAULT_CURRENT, defaultIrrigation } from '../lib/engine.js';
import { t, zoneLabel, num } from '../lib/i18n.js';

export default function Setup({ lang, setLang, initial, onDone, onCancel }) {
  const [step, setStep] = useState(initial ? 1 : 0);
  const [f, setF] = useState(() => initial || {
    name: '', districtId: 'bogura', lat: DISTRICT.bogura.lat, lon: DISTRICT.bogura.lon, area: 3,
    current: [...DEFAULT_CURRENT], irrigation: 'full', priority: 'soil', saline: false,
  });
  const [msg, setMsg] = useState('');
  const set = (patch) => setF((x) => ({ ...x, ...patch }));
  const d = DISTRICT[f.districtId];
  const zone = f.flags || d.flags;
  const usePreset = (p) => onDone({
    name: p[lang], districtId: p.districtId, lat: p.lat, lon: p.lon, area: 3, current: [...p.current],
    irrigation: p.irrigation, priority: 'soil', saline: false, presetId: p.id, flags: p.flags,
  });
  const presetCard = (
    <div className="card stack" style={{ gap: 10 }}>
      <span className="label">{t(lang, 'demoFields')}</span>
      <span className="sub">{t(lang, 'demoFieldsSub')}</span>
      <div className="stack" style={{ gap: 8 }}>
        {PRESETS.map((p) => (
          <button key={p.id} type="button" className="btn ghost small" style={{ justifyContent: 'space-between' }} onClick={() => usePreset(p)}>
            <span>{p[lang]}</span>
            <span className="row" style={{ gap: 6 }}>{p.flags.map((fl) => <span key={fl} className="chip">{zoneLabel(lang, fl)}</span>)}<Icon name="arrow" size={16} /></span>
          </button>
        ))}
      </div>
    </div>
  );

  const pick = (lat, lon) => {
    if (!inBangladesh(lat, lon)) { setMsg(t(lang, 'outsideBd')); return; }
    const nd = nearestDistrict(lat, lon);
    setMsg('');
    set({ lat: Math.round(lat * 10000) / 10000, lon: Math.round(lon * 10000) / 10000, districtId: nd.id, irrigation: defaultIrrigation(nd.flags), presetId: null, flags: null });
  };
  const gps = () => {
    if (!navigator.geolocation) { setMsg(t(lang, 'gpsFail')); return; }
    navigator.geolocation.getCurrentPosition((p) => pick(p.coords.latitude, p.coords.longitude), () => setMsg(t(lang, 'gpsFail')), { enableHighAccuracy: true, timeout: 12000 });
  };
  const byDiv = Object.keys(DIVISIONS).map((dv) => ({ dv, list: DISTRICTS.filter((x) => x.div === dv).sort((a, b) => a[lang].localeCompare(b[lang], lang)) }));

  return (
    <div className="stack" style={{ maxWidth: 720, margin: '0 auto' }}>
      <div className="steps" aria-hidden="true">{[0, 1, 2].map((i) => <i key={i} className={i <= step ? 'on' : ''} />)}</div>

      {step === 0 && (
        <div className="stack">
          <div className="row" style={{ gap: 14 }}>
            <img src="./icon.svg" alt="" width="64" height="64" style={{ borderRadius: 16 }} />
            <div>
              <h1 className="title">{t(lang, 'appName')}</h1>
              <div className="sub">NASA Space Apps 2026 · Field Shift</div>
            </div>
          </div>
          <p style={{ fontSize: 18, margin: 0 }}>{t(lang, 'tagline')}</p>
          <div className="card stack">
            <span className="label">{t(lang, 'language')}</span>
            <Seg value={lang} onChange={setLang} label={t(lang, 'language')} options={[{ value: 'bn', label: 'বাংলা' }, { value: 'en', label: 'English' }]} />
          </div>
          <div className="card stack" style={{ gap: 10 }}>
            {[['sat', lang === 'bn' ? '২০০১ থেকে প্রতিদিনের নাসা তথ্য: বৃষ্টি, তাপ, মাটির আর্দ্রতা' : 'Daily NASA data since 2001: rain, heat, soil moisture'],
              ['plan', lang === 'bn' ? 'আমন–রবি–খরিফ-১ মৌসুমের সেরা ফসল-চক্র' : 'Best Aman–Rabi–Kharif-1 rotations'],
              ['warn', lang === 'bn' ? 'লবণাক্ততা, হাওরের আগাম বন্যা, বরেন্দ্রের খরা বিবেচনা' : 'Accounts for salinity, haor flash floods, Barind drought'],
              ['mic', lang === 'bn' ? 'বাংলায় কথা বলে প্রশ্ন করুন · অফলাইনেও চলে' : 'Ask by voice in Bangla · works offline']].map(([ic, tx]) => (
              <div key={ic} className="row"><Icon name={ic} color="var(--lime)" /><span>{tx}</span></div>
            ))}
          </div>
          <button className="btn" onClick={() => setStep(1)}>{t(lang, 'start')} <Icon name="arrow" /></button>
          {!initial && presetCard}
        </div>
      )}

      {step === 1 && (
        <div className="stack">
          <h1 className="title">{t(lang, 'whereFarm')}</h1>
          <div className="field">
            <label htmlFor="district">{t(lang, 'district')}</label>
            <select id="district" className="input" value={f.districtId} onChange={(e) => { const nd = DISTRICT[e.target.value]; set({ districtId: nd.id, lat: nd.lat, lon: nd.lon, irrigation: defaultIrrigation(nd.flags), presetId: null, flags: null }); }}>
              {byDiv.map(({ dv, list }) => (
                <optgroup key={dv} label={DIVISIONS[dv][lang]}>
                  {list.map((x) => <option key={x.id} value={x.id}>{x[lang]}</option>)}
                </optgroup>
              ))}
            </select>
          </div>
          <button className="btn ghost small" onClick={gps}><Icon name="gps" /> {t(lang, 'useGps')}</button>
          <span className="sub">{t(lang, 'tapMap')}</span>
          <MapBox lat={f.lat} lon={f.lon} zoom={9} onPick={pick} label={t(lang, 'tapMap')} />
          <div className="row wrap between">
            <span className="mono sub">{num(lang, f.lat, 3)}° N, {num(lang, f.lon, 3)}° E · {d[lang]}</span>
            <div className="row wrap">{zone.map((fl) => <span key={fl} className="chip">{zoneLabel(lang, fl)}</span>)}</div>
          </div>
          {msg && <div className="alert" role="alert"><div className="ic"><Icon name="warn" /></div><span>{msg}</span></div>}
          <div className="row">
            {initial ? <button className="btn ghost" onClick={onCancel}>{t(lang, 'back')}</button> : <button className="btn ghost" onClick={() => setStep(0)}>{t(lang, 'back')}</button>}
            <button className="btn" style={{ flex: 1 }} onClick={() => setStep(2)}>{t(lang, 'next')} <Icon name="arrow" /></button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="stack">
          <h1 className="title">{t(lang, 'aboutFarm')}</h1>
          <div className="grid grid-2">
            <div className="field">
              <label htmlFor="fname">{t(lang, 'fieldName')}</label>
              <input id="fname" className="input" value={f.name} placeholder={t(lang, 'fieldNameDefault')} onChange={(e) => set({ name: e.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="farea">{t(lang, 'area')}</label>
              <input id="farea" className="input" type="number" min="0.1" step="0.5" value={f.area} onChange={(e) => set({ area: Number(e.target.value) })} />
            </div>
          </div>

          <div className="card stack">
            <span className="label">{t(lang, 'nowGrow')}</span>
            {SEASONS.map((s, i) => (
              <div className="field" key={s.id}>
                <label htmlFor={'cur' + i}>{s[lang]}</label>
                <select id={'cur' + i} className="input" value={f.current[i]} onChange={(e) => { const c = [...f.current]; c[i] = e.target.value; set({ current: c }); }}>
                  {cropsForSeason(s.id).map((c) => <option key={c.id} value={c.id}>{cropName(c.id, lang)}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div className="card stack">
            <span className="label">{t(lang, 'irrigation')}</span>
            <div className="stack" style={{ gap: 6 }}>
              {['none', 'limited', 'full'].map((v) => (
                <label key={v} className="check"><input type="radio" name="irr" checked={f.irrigation === v} onChange={() => set({ irrigation: v })} />{t(lang, 'irr_' + v)}</label>
              ))}
            </div>
            {!zone.includes('saline') && (
              <label className="check"><input type="checkbox" checked={f.saline} onChange={(e) => set({ saline: e.target.checked })} />{t(lang, 'saline')}</label>
            )}
          </div>

          <div className="card stack">
            <span className="label">{t(lang, 'priorities')}</span>
            <div className="row wrap">
              {['soil', 'water', 'profit', 'risk'].map((p) => (
                <button key={p} type="button" className={'pill' + (f.priority === p ? ' on' : '')} aria-pressed={f.priority === p} onClick={() => set({ priority: p })}>{t(lang, 'p_' + p)}</button>
              ))}
            </div>
          </div>

          <div className="row">
            <button className="btn ghost" onClick={() => setStep(1)}>{t(lang, 'back')}</button>
            <button className="btn" style={{ flex: 1 }} onClick={() => onDone({ ...f, name: f.name || t(lang, 'fieldNameDefault') })}>{t(lang, 'save')} <Icon name="check" /></button>
          </div>
        </div>
      )}
    </div>
  );
}

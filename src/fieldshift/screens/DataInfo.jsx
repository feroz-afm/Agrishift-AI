import React from 'react';
import { Icon, Seg } from '../components.jsx';
import { t, num } from '../lib/i18n.js';

const SOURCES = [
  { name: 'NASA POWER — Daily (AG community)', vars: 'T2M, T2M_MAX, T2M_MIN, PRECTOTCORR, RH2M, ALLSKY_SFC_SW_DWN', res: '0.5° × 0.625° (~50 km) · 2001→', use: { bn: 'বৃষ্টি, তাপ, বাষ্পীভবন (ET₀), বর্ষার শুরু, গরম দিন, ২০৪০ প্রবণতা', en: 'Rain, heat, ET₀, monsoon onset, heat days, 2040 trend' }, url: 'https://power.larc.nasa.gov/' },
  { name: 'NASA POWER GWETROOT / GWETTOP (GMAO MERRA-2)', vars: 'Root-zone & surface soil wetness', res: '~50 km · daily', use: { bn: 'মাটির আর্দ্রতা, আকস্মিক খরার সংকেত', en: 'Soil moisture, flash-drought signal' }, url: 'https://power.larc.nasa.gov/' },
  { name: 'MODIS Terra MOD13Q1 v6.1 (ORNL DAAC)', vars: '250m 16-day NDVI', res: '250 m · 16 days · 2000→', use: { bn: 'জমির সবুজতা ও মাঠের স্বাস্থ্য', en: 'Field greenness and health' }, url: 'https://modis.ornl.gov/data/modis_webservice.html' },
  { name: 'NASA GIBS (MODIS NDVI, LST, GPM IMERG, True colour)', vars: 'WMTS map tiles', res: '250 m – 10 km', use: { bn: 'মানচিত্রের স্যাটেলাইট স্তর', en: 'Satellite map layers' }, url: 'https://nasa-gibs.github.io/gibs-api-docs/' },
  { name: 'ISRIC SoilGrids 2.0', vars: 'clay, sand, silt, SOC, pH, N (0–30 cm)', res: '250 m · modelled', use: { bn: 'মাটির ধরন, জৈব কার্বন, পিএইচ', en: 'Soil texture, organic carbon, pH' }, url: 'https://soilgrids.org/' },
  { name: 'FAO-56 / FAO Ecocrop, BRRI & BARI calendars', vars: 'Kc, temperature limits, season lengths', res: '—', use: { bn: 'ফসলের পানির চাহিদা ও মৌসুম', en: 'Crop water need and seasons' }, url: 'https://www.fao.org/3/x0490e/x0490e00.htm' },
];

export default function DataInfo({ lang, setLang, data, a, onEdit, onRefresh, onReset }) {
  const bn = lang === 'bn';
  return (
    <div className="stack" style={{ maxWidth: 900 }}>
      <h1 className="title">{t(lang, 'dataTitle')}</h1>
      <div className="card stack">
        <span className="label">{t(lang, 'language')}</span>
        <Seg value={lang} onChange={setLang} label={t(lang, 'language')} options={[{ value: 'bn', label: 'বাংলা' }, { value: 'en', label: 'English' }]} />
        <div className="row wrap">
          <button className="btn ghost small" onClick={onEdit}><Icon name="field" /> {t(lang, 'editFarm')}</button>
          <button className="btn ghost small" onClick={onRefresh}><Icon name="refresh" /> {t(lang, 'refresh')}</button>
        </div>
        <span className="sub mono">
          {data.demo ? t(lang, 'demo') : `NASA POWER ${num(lang, a.period.first)} → ${a.period.lastDate}`}
          {data.fromCache ? ` · ${bn ? 'ফোনে সংরক্ষিত' : 'cached on device'}` : ''}
        </span>
      </div>

      <div className="card stack">
        <h2>{t(lang, 'install')}</h2>
        <span className="sub">{t(lang, 'installHelp')}</span>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table className="data">
          <thead><tr><th>{t(lang, 'source')}</th><th>{bn ? 'রেজোলিউশন' : 'Resolution'}</th><th>{bn ? 'কী কাজে' : 'Used for'}</th></tr></thead>
          <tbody>
            {SOURCES.map((s) => (
              <tr key={s.name}>
                <td><a href={s.url} target="_blank" rel="noreferrer">{s.name}</a><div className="sub mono" style={{ fontSize: 11 }}>{s.vars}</div></td>
                <td className="mono" style={{ fontSize: 12 }}>{s.res}</td>
                <td>{s.use[lang]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card stack">
        <h2>{bn ? 'কীভাবে হিসাব হয়' : 'How the scores work'}</h2>
        <ul className="reasons">
          <li>{bn ? 'ET₀ = হারগ্রিভস সূত্র (দৈনিক সর্বোচ্চ/সর্বনিম্ন তাপ ও অক্ষাংশ থেকে)। ফসলের পানি = Kc × ET₀।' : 'ET₀ = Hargreaves (daily Tmax/Tmin and latitude). Crop water = Kc × ET₀.'}</li>
          <li>{bn ? 'সেচ = ফসলের পানি − কার্যকর বৃষ্টি (৮০%) − রবিতে মাটিতে জমা আর্দ্রতা; ধানে চুইয়ে যাওয়া পানি যোগ।' : 'Irrigation = crop water − effective rain (80%) − stored soil moisture in Rabi; paddy adds percolation.'}</li>
          <li>{bn ? 'ঝুঁকি = গত ১০ বছরের নাসার দৈনিক রেকর্ডে ফসলের ক্ষতিকর তাপ/ঠান্ডার দিন + জেলার লবণাক্ততা, হাওর, বরেন্দ্র, চর বন্যা।' : 'Risk = damaging heat/cold days in the last 10 years of NASA daily data + district salinity, haor, Barind and char-flood hazards.'}</li>
          <li>{bn ? 'মাটির স্কোর = ডাল/সবুজ সার, ফসলের পরিবার বৈচিত্র্য, গভীর শিকড়, খড়, খালি জমি ও একই পরিবার পরপর হলে কাটা।' : 'Soil score = legumes / green manure, family diversity, deep roots, residue; penalties for bare land and repeating families.'}</li>
          <li>{bn ? '২০৪০ = ২০০১ থেকে তাপ ও বৃষ্টির রৈখিক প্রবণতা বাড়িয়ে, একই দৈনিক রেকর্ডে প্রয়োগ।' : '2040 = linear trend of temperature and rain since 2001, applied to the same daily record.'}</li>
        </ul>
      </div>

      <div className="card stack">
        <h2>{t(lang, 'limits')}</h2>
        <span className="sub" style={{ fontSize: 14 }}>{t(lang, 'limitsText')}</span>
      </div>
      <button className="btn ghost small" onClick={onReset} style={{ alignSelf: 'flex-start', color: 'var(--red)' }}>{t(lang, 'reset')}</button>
    </div>
  );
}

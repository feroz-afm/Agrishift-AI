import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Icon } from './components.jsx';
import Setup from './screens/Setup.jsx';
import Field from './screens/Field.jsx';
import Plan from './screens/Plan.jsx';
import MapView from './screens/MapView.jsx';
import Ask from './screens/Ask.jsx';
import DataInfo from './screens/DataInfo.jsx';
import { loadField } from './lib/client.js';
import { analyse, fieldHealth } from './lib/analysis.js';
import { planRotations } from './lib/engine.js';
import { DISTRICT } from './lib/districts.js';
import { demoPower, demoNdvi, demoSoil } from './lib/demo.js';
import { load, save } from './lib/store.js';
import { t } from './lib/i18n.js';
import '@fontsource/hind-siliguri/400.css';
import '@fontsource/hind-siliguri/500.css';
import '@fontsource/hind-siliguri/600.css';
import '@fontsource/hind-siliguri/700.css';
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/600.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/600.css';
import './fieldshift.css';

const NAV = [
  ['field', 'field', 'navField'], ['plan', 'plan', 'navPlan'], ['map', 'map', 'navMap'], ['ask', 'mic', 'navAsk'], ['data', 'info', 'navData'],
];
const WEIGHTS = (p) => ({ soil: 1, water: 1, profit: 1, risk: 1, [p]: 3 });
const wantsDemo = () => { try { return new URLSearchParams(location.search).has('demo') || location.hash.includes('demo'); } catch { return false; } };

export default function FieldShiftApp() {
  const [lang, setLangState] = useState(() => load('lang', 'bn'));
  const [farm, setFarmState] = useState(() => load('farm', null));
  const [screen, setScreen] = useState('field');
  const [editing, setEditing] = useState(false);
  const [data, setData] = useState({ status: 'idle' });
  const [toastMsg, setToastMsg] = useState('');

  const setLang = (l) => { setLangState(l); save('lang', l); };
  const setFarm = (f) => { setFarmState(f); save('farm', f); };
  const toast = (m) => { setToastMsg(m); setTimeout(() => setToastMsg(''), 1800); };

  useEffect(() => { document.title = `${t(lang, 'appName')} — AgriShift AI`; }, [lang]);

  const loadData = useCallback(async (f, { force = false, demo = false } = {}) => {
    if (!f) return;
    if (demo) {
      setData({ status: 'ready', power: demoPower({ lat: f.lat }), ndvi: demoNdvi(), soil: demoSoil, demo: true });
      return;
    }
    setData((d) => ({ ...d, status: 'loading' }));
    try {
      const r = await loadField({ lat: f.lat, lon: f.lon, presetId: f.presetId }, { force });
      setData({ status: 'ready', ...r });
    } catch (err) {
      setData({ status: 'error', error: String(err.message || err) });
    }
  }, []);

  useEffect(() => { if (farm) loadData(farm, { demo: wantsDemo() }); }, [farm?.lat, farm?.lon]); // eslint-disable-line react-hooks/exhaustive-deps

  const district = farm ? DISTRICT[farm.districtId] : null;
  const flags = useMemo(() => {
    if (!district) return [];
    const f = [...(farm.flags || district.flags)];
    if (farm.saline && !f.includes('saline')) f.push('saline');
    return f;
  }, [district, farm?.saline, farm?.flags]);

  const a = useMemo(() => (data.status === 'ready' ? analyse(data.power, farm.lat) : null), [data.power, farm?.lat]); // eslint-disable-line react-hooks/exhaustive-deps
  const engineCtx = useMemo(() => a && ({
    a, power: data.power, soil: data.soil, irrigation: farm.irrigation, flags, weights: WEIGHTS(farm.priority), current: farm.current,
  }), [a, data.soil, farm?.irrigation, flags, farm?.priority, farm?.current]); // eslint-disable-line react-hooks/exhaustive-deps
  const plan = useMemo(() => engineCtx && planRotations(engineCtx), [engineCtx]);
  const futurePlan = useMemo(() => engineCtx && planRotations({ ...engineCtx, future: true }), [engineCtx]);
  const health = useMemo(() => a && fieldHealth(a, data.ndvi), [a, data.ndvi]);

  if (!farm || editing) {
    return (
      <div className="fs-app" data-lang={lang} lang={lang}><main className="main" style={{ paddingBottom: 40 }}>
        <Setup lang={lang} setLang={setLang} initial={editing ? farm : null}
          onCancel={() => setEditing(false)}
          onDone={(f) => { setFarm({ ...f, chosen: editing && farm?.lat === f.lat ? farm.chosen : null }); setEditing(false); setScreen('field'); }} />
      </main></div>
    );
  }

  let body;
  if (data.status === 'loading' || data.status === 'idle') {
    body = (
      <div className="loading" role="status">
        <div className="orbit" aria-hidden="true" />
        <strong style={{ fontSize: 18 }}>{t(lang, 'loading')}</strong>
        <span className="sub">{t(lang, 'loadingSub')}</span>
      </div>
    );
  } else if (data.status === 'error') {
    body = (
      <div className="loading" role="alert">
        <Icon name="wifiOff" size={40} color="var(--amber)" />
        <strong style={{ fontSize: 18 }}>{t(lang, 'loadFail')}</strong>
        <span className="sub mono">{data.error}</span>
        <div className="row wrap" style={{ justifyContent: 'center' }}>
          <button className="btn" onClick={() => loadData(farm, { force: true })}><Icon name="refresh" /> {t(lang, 'retry')}</button>
          <button className="btn ghost" onClick={() => loadData(farm, { demo: true })}>{t(lang, 'tryDemo')}</button>
        </div>
      </div>
    );
  } else {
    const common = { lang, farm, district, flags, data, a };
    if (screen === 'field') body = <Field {...common} health={health} plan={plan} go={setScreen} />;
    if (screen === 'plan') body = <Plan {...common} setFarm={setFarm} plan={plan} futurePlan={futurePlan} toast={toast} />;
    if (screen === 'map') body = <MapView lang={lang} farm={farm} />;
    if (screen === 'ask') body = <Ask lang={lang} ctx={{ a, plan, futurePlan, farm, district, soil: data.soil, engineCtx }} />;
    if (screen === 'data') {
      body = (
        <DataInfo lang={lang} setLang={setLang} data={data} a={a}
          onEdit={() => setEditing(true)}
          onRefresh={() => loadData(farm, { force: true })}
          onReset={() => { if (confirmReset(lang)) { try { localStorage.clear(); } catch { /* ignore */ } location.reload(); } }} />
      );
    }
  }

  const nav = (cls) => NAV.map(([id, icon, key]) => (
    <button key={id} type="button" className={'navbtn' + (screen === id ? ' on' : '')} aria-current={screen === id ? 'page' : undefined}
      onClick={() => { setScreen(id); window.scrollTo(0, 0); }} disabled={data.status !== 'ready' && id !== 'data'}>
      <Icon name={icon} size={22} />{t(lang, key)}
    </button>
  ));

  return (
    <div className="fs-app app" data-lang={lang} lang={lang}>
      <nav className="sidebar" aria-label="Main">
        <div className="brand"><img src="./icon.svg" alt="" />{t(lang, 'appName')}</div>
        {nav()}
        <div style={{ marginTop: 'auto' }} className="sub">
          <a href="#home" style={{ color: 'var(--muted)' }}>← AgriShift AI</a><br />NASA Space Apps 2026 · Field Shift
        </div>
      </nav>
      <main className="main">{body}</main>
      <nav className="bottomnav" aria-label="Main">{nav()}</nav>
      {toastMsg && <div className="toast" role="status">{toastMsg}</div>}
    </div>
  );
}

function confirmReset(lang) {
  try { return window.confirm(lang === 'bn' ? 'সব তথ্য মুছে যাবে। নিশ্চিত?' : 'This deletes all saved data. Continue?'); } catch { return true; }
}

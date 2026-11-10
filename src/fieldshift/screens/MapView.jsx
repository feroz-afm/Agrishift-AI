import React, { useState } from 'react';
import MapBox from '../MapBox.jsx';
import { GIBS_LAYERS } from '../lib/nasa-core.js';
import { t } from '../lib/i18n.js';

export default function MapView({ lang, farm }) {
  const [layer, setLayer] = useState('ndvi');
  const [op, setOp] = useState(0.75);
  const l = GIBS_LAYERS.find((x) => x.id === layer);
  return (
    <div className="stack">
      <div>
        <h1 className="title">{t(lang, 'mapTitle')}</h1>
        <div className="sub">{t(lang, 'mapNote')}</div>
      </div>
      <div className="row wrap" role="group" aria-label={t(lang, 'mapTitle')}>
        {GIBS_LAYERS.map((x) => (
          <button key={x.id} type="button" className={'pill' + (layer === x.id ? ' on' : '')} aria-pressed={layer === x.id} onClick={() => setLayer(x.id)}>{x.label[lang]}</button>
        ))}
      </div>
      <MapBox lat={farm.lat} lon={farm.lon} zoom={9} layerId={layer} opacity={op} tall label={t(lang, 'mapTitle')} />
      <div className="row wrap between">
        <span className="mono sub">NASA GIBS · {l.src}</span>
        <label className="row sub" style={{ gap: 8 }}>
          {lang === 'bn' ? 'স্বচ্ছতা' : 'Opacity'}
          <input type="range" min="0.2" max="1" step="0.05" value={op} onChange={(e) => setOp(Number(e.target.value))} />
        </label>
      </div>
      {layer === 'ndvi' && (
        <div className="card row wrap" style={{ gap: 12 }}>
          <span className="sub">{lang === 'bn' ? 'কম সবুজ' : 'Bare'}</span>
          <div style={{ flex: 1, minWidth: 160, height: 10, borderRadius: 5, background: 'linear-gradient(90deg,#c8a165,#e8e08a,#7fbf4d,#1f6b2a)' }} />
          <span className="sub">{lang === 'bn' ? 'ঘন সবুজ ফসল' : 'Dense crop'}</span>
        </div>
      )}
    </div>
  );
}

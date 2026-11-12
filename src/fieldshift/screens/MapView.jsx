import React, { useState } from 'react';
import MapBox from '../MapBox.jsx';
import { Seg } from '../components.jsx';
import { GIBS_LAYERS } from '../lib/nasa-core.js';
import { t } from '../lib/i18n.js';

const NASA = GIBS_LAYERS.filter((x) => x.id !== 'truecolor');

export default function MapView({ lang, farm }) {
  const bn = lang === 'bn';
  const [base, setBase] = useState('map');
  const [layer, setLayer] = useState(null);
  const [op, setOp] = useState(0.65);
  const l = GIBS_LAYERS.find((x) => x.id === layer);

  return (
    <div className="stack">
      <div>
        <h1 className="title">{bn ? 'মানচিত্র' : 'Map'}</h1>
        <div className="sub">{bn ? 'আপনার জমি সবুজ বিন্দু দিয়ে দেখানো। নাসার স্তর চাপলে উপরে বসবে।' : 'Your field is the green dot. Tap a NASA layer to overlay it.'}</div>
      </div>

      <Seg value={base} onChange={setBase} label={bn ? 'ম্যাপের ধরন' : 'Map type'}
        options={[{ value: 'map', label: bn ? 'সাধারণ ম্যাপ' : 'Street map' }, { value: 'satellite', label: bn ? 'স্যাটেলাইট ছবি' : 'Satellite' }]} />

      <div className="stack" style={{ gap: 6 }}>
        <span className="label">{bn ? 'নাসার স্তর' : 'NASA layers'}</span>
        <div className="row wrap" role="group" aria-label={t(lang, 'mapTitle')}>
          <button type="button" className={'pill' + (!layer ? ' on' : '')} aria-pressed={!layer} onClick={() => setLayer(null)}>{bn ? 'বন্ধ' : 'Off'}</button>
          {NASA.map((x) => (
            <button key={x.id} type="button" className={'pill' + (layer === x.id ? ' on' : '')} aria-pressed={layer === x.id} onClick={() => setLayer(x.id)}>{x.label[lang]}</button>
          ))}
        </div>
      </div>

      <MapBox lat={farm.lat} lon={farm.lon} zoom={14} base={base} layerId={layer} opacity={op} tall
        label={t(lang, 'mapTitle')} pinLabel={farm.name} />

      {l && (
        <div className="card stack" style={{ gap: 10 }}>
          <div className="row wrap between">
            <span className="mono sub">NASA GIBS · {l.src}</span>
            <label className="row sub" style={{ gap: 8 }}>
              {bn ? 'স্বচ্ছতা' : 'Opacity'}
              <input type="range" min="0.2" max="1" step="0.05" value={op} onChange={(e) => setOp(Number(e.target.value))} />
            </label>
          </div>
          {layer === 'ndvi' && (
            <div className="row wrap" style={{ gap: 12 }}>
              <span className="sub">{bn ? 'কম সবুজ' : 'Bare'}</span>
              <div style={{ flex: 1, minWidth: 140, height: 10, borderRadius: 5, background: 'linear-gradient(90deg,#c8a165,#e8e08a,#7fbf4d,#1f6b2a)' }} />
              <span className="sub">{bn ? 'ঘন সবুজ ফসল' : 'Dense crop'}</span>
            </div>
          )}
          <span className="sub">{bn ? 'নাসার এই ছবি ২৫০ মিটার থেকে ১০ কিমি পর্যন্ত মোটা দানার — তাই জমির খুব কাছে জুম করলে ঝাপসা দেখায়।' : 'NASA layers are 250 m – 10 km pixels, so they look blocky when zoomed into one field.'}</span>
        </div>
      )}
    </div>
  );
}

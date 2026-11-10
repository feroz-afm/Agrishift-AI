import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '../components.jsx';
import { answer, QUICK } from '../lib/ask.js';
import { t } from '../lib/i18n.js';

const SR = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

export default function Ask({ lang, ctx }) {
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const [listening, setListening] = useState(false);
  const rec = useRef(null);
  const end = useRef(null);

  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [msgs]);
  useEffect(() => () => rec.current?.abort?.(), []);

  const ask = (q) => {
    const qq = (q ?? text).trim();
    if (!qq) return;
    const r = answer(qq, { ...ctx, lang });
    setMsgs((m) => [...m, { me: true, text: qq }, { me: false, ...r }]);
    setText('');
  };

  const listen = () => {
    if (!SR) return;
    if (listening) { rec.current?.stop(); return; }
    const r = new SR();
    r.lang = lang === 'bn' ? 'bn-BD' : 'en-US';
    r.interimResults = false;
    r.maxAlternatives = 1;
    r.onresult = (e) => { const said = e.results[0][0].transcript; setText(said); ask(said); };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    rec.current = r;
    setListening(true);
    r.start();
  };

  const speak = (s) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(s.replace(/•/g, ''));
    u.lang = lang === 'bn' ? 'bn-BD' : 'en-US';
    const v = window.speechSynthesis.getVoices().find((x) => x.lang.toLowerCase().startsWith(lang === 'bn' ? 'bn' : 'en'));
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="stack" style={{ maxWidth: 820 }}>
      <div>
        <h1 className="title">{t(lang, 'askTitle')}</h1>
        <div className="sub">{t(lang, 'askHint')}</div>
      </div>
      <div className="row wrap">
        {QUICK[lang].map((q) => <button key={q} type="button" className="pill" onClick={() => ask(q)}>{q}</button>)}
      </div>
      <div className="chat" aria-live="polite">
        {msgs.map((m, i) => (
          <div key={i} className={'msg ' + (m.me ? 'me' : 'bot')}>
            {m.text}
            {!m.me && m.src && <span className="src">{t(lang, 'source')}: {m.src}</span>}
            {!m.me && window.speechSynthesis && (
              <button type="button" className="row" onClick={() => speak(m.text)} style={{ marginTop: 8, background: 'none', border: 0, color: 'var(--muted)', padding: 0, fontSize: 13, minHeight: 32 }}>
                <Icon name="speaker" size={16} /> {t(lang, 'readAloud')}
              </button>
            )}
          </div>
        ))}
        <div ref={end} />
      </div>
      <form className="composer" onSubmit={(e) => { e.preventDefault(); ask(); }}>
        {SR && (
          <button type="button" className={'mic' + (listening ? ' on' : '')} onClick={listen} aria-label={listening ? t(lang, 'listening') : t(lang, 'speak')}>
            <Icon name="mic" size={24} />
          </button>
        )}
        <label className="sr" htmlFor="askbox">{t(lang, 'askTitle')}</label>
        <input id="askbox" className="input" value={text} onChange={(e) => setText(e.target.value)} placeholder={listening ? t(lang, 'listening') : t(lang, 'askPlaceholder')} />
        <button type="submit" className="iconbtn" aria-label={t(lang, 'send')} style={{ width: 52, height: 52 }}><Icon name="send" /></button>
      </form>
    </div>
  );
}

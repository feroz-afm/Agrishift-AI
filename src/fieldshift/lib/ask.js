// Offline farm assistant: answers Bangla / English questions from the farm's own NASA analysis.
// Rule-based on purpose — every answer is traceable to a number and its dataset.
import { CROPS, CROP, cropName } from './crops.js';
import { placeCrop, SEASONS } from './engine.js';
import { num, signed, doyLabel, riskWord, tipFor, alertText, reasonText } from './i18n.js';

const ALIASES = {
  rice_boro: ['বোরো', 'boro'], rice_aman: ['আমন', 'aman'], rice_aus: ['আউশ', 'aus'],
  wheat: ['গম', 'wheat'], maize: ['ভুট্টা', 'maize', 'corn'], barley: ['যব', 'barley'],
  lentil: ['মসুর', 'lentil'], chickpea: ['ছোলা', 'chickpea'], grasspea: ['খেসারি', 'grass pea', 'khesari'],
  mungbean: ['মুগ', 'mung'], mustard: ['সরিষা', 'সর্ষে', 'mustard'], sunflower: ['সূর্যমুখী', 'sunflower'],
  potato: ['আলু', 'potato'], onion: ['পেঁয়াজ', 'পিঁয়াজ', 'onion'], vegetables: ['সবজি', 'টমেটো', 'বেগুন', 'vegetable', 'tomato'],
  groundnut: ['বাদাম', 'groundnut', 'peanut'], sweet_potato: ['মিষ্টি আলু', 'sweet potato'], watermelon: ['তরমুজ', 'watermelon'],
  jute: ['পাট', 'jute'], sesame: ['তিল', 'sesame'], dhaincha: ['ধৈঞ্চা', 'dhaincha', 'green manure', 'সবুজ সার'],
};

const has = (q, words) => words.some((w) => q.includes(w));

function findCrop(q) {
  // longest alias first so "মিষ্টি আলু" wins over "আলু"
  const pairs = Object.entries(ALIASES).flatMap(([id, ws]) => ws.map((w) => [id, w])).sort((x, y) => y[1].length - x[1].length);
  for (const [id, w] of pairs) if (q.includes(w)) return id;
  if (has(q, ['ধান', 'rice', 'paddy'])) return 'rice_boro';
  return null;
}

export function answer(question, ctx) {
  const { lang, a, plan, futurePlan, farm, district } = ctx;
  const bn = lang === 'bn';
  const q = question.toLowerCase().trim();
  const n = (x, dp) => num(lang, x, dp);
  const best = plan.rotations[0];
  const rotName = (r) => r.crops.map((x) => cropName(x, lang)).join(' → ');
  const c = a.current;

  const cropId = findCrop(q);
  const whenQ = has(q, ['কখন', 'when', 'লাগাব', 'রোপণ', 'বপন', 'বুনব', 'plant', 'sow']);
  if (cropId && !whenQ) {
    const crop = CROP[cropId];
    const si = SEASONS.findIndex((s) => crop.seasons.includes(s.id));
    const p = placeCrop(crop, si, ctx.engineCtx, 0);
    const inBest = plan.rotations.findIndex((r) => r.crops.includes(cropId));
    const season = SEASONS[si][lang];
    if (!p) {
      return {
        text: bn
          ? `${district.bn}-এর আবহাওয়া ও আপনার সেচ সুবিধায় ${season} মৌসুমে ${crop.bn} ভালো মিলছে না (তাপমাত্রা বা পানির ঘাটতি)।\nবদলে ভাবতে পারেন: ${rotName(best)}।`
          : `With ${district.en}'s climate and your irrigation, ${crop.en} is a poor fit for ${season} (temperature or water shortfall).\nConsider instead: ${rotName(best)}.`,
        src: 'NASA POWER T2M · PRECTOTCORR · ET₀',
      };
    }
    const lines = [];
    lines.push(bn ? `${crop.bn} (${season}): আনুমানিক সেচ লাগবে ${n(p.irrigation)} মিমি, ঝুঁকি ${riskWord(lang, p.risk)}।` : `${crop.en} (${season}): about ${p.irrigation} mm irrigation, risk ${riskWord(lang, p.risk).toLowerCase()}.`);
    for (const iss of p.issues) { const s = reasonText(lang, { ...iss, crop: cropId, months: p.months }); if (s) lines.push('• ' + s); }
    if (crop.nfix) lines.push('• ' + reasonText(lang, { k: 'nfix', crop: cropId }));
    if (cropId === 'rice_boro' && best && !best.crops.includes('rice_boro')) {
      lines.push(bn ? `বোরোর বদলে ${rotName(best)} করলে বছরে প্রায় ${n(Math.max(0, (plan.current?.irrigation || 0) - best.irrigation))} মিমি সেচ বাঁচবে।` : `Switching to ${rotName(best)} saves about ${Math.max(0, (plan.current?.irrigation || 0) - best.irrigation)} mm of irrigation a year.`);
    }
    if (inBest >= 0) lines.push(bn ? `এটি আমাদের সুপারিশের ${n(inBest + 1)} নম্বর ফসল-চক্রে আছে।` : `It appears in recommended rotation #${inBest + 1}.`);
    const tip = p.issues.map((x) => tipFor(lang, x.k, cropId)).find(Boolean);
    if (tip) lines.push(tip);
    return { text: lines.join('\n'), src: 'NASA POWER (2001–) · FAO-56 Kc' };
  }

  if (has(q, ['সেচ', 'পানি', 'irrigat', 'water', 'শুকনো', 'খরা', 'drought'])) {
    const dry = c.gwPercentile !== null && c.gwPercentile < 30;
    return {
      text: bn
        ? `মাটির আর্দ্রতা এখন ${n(c.gw * 100)}% — এই সময়ের ${n(c.gwPercentile)} পার্সেন্টাইল। গত ১৪ দিনে বৃষ্টি ${n(c.rain14)} মিমি (স্বাভাবিক ${n(c.rain14Normal)} মিমি)। প্রতিদিন বাষ্পীভবন ~${n(c.et0, 1)} মিমি।\n${dry ? 'মাটি শুকিয়ে আসছে — পরের ৩–৪ দিনের মধ্যে সেচ দিন।' : 'এখনই জরুরি সেচের দরকার নেই।'}`
        : `Soil moisture is ${n(c.gw * 100)}% — ${c.gwPercentile}th percentile for this time of year. Rain in 14 days: ${c.rain14} mm (normal ${c.rain14Normal} mm). Evaporation ~${n(c.et0, 1)} mm/day.\n${dry ? 'Soil is drying — irrigate within 3–4 days.' : 'No urgent irrigation needed.'}`,
      src: 'POWER GWETROOT · PRECTOTCORR · ET₀',
    };
  }

  if (has(q, ['বৃষ্টি', 'বর্ষা', 'rain', 'monsoon', 'কখন', 'when', 'লাগাব', 'রোপণ', 'plant', 'sow'])) {
    const w = a.window;
    if (!w.ok) return { text: bn ? 'বর্ষার শুরু নির্ণয়ের মতো যথেষ্ট তথ্য নেই।' : 'Not enough data to detect the monsoon start.', src: 'NASA POWER PRECTOTCORR' };
    return {
      text: bn
        ? `${n(w.early.from)}–${n(w.early.to)} সালে বর্ষা গড়ে ${doyLabel(lang, w.early.start)} শুরু হতো; ${n(w.late.from)}–${n(w.late.to)} সালে ${doyLabel(lang, w.late.start)} — ${n(Math.abs(w.shiftStart))} দিন ${w.shiftStart >= 0 ? 'দেরিতে' : 'আগে'}। মৌসুম ${n(Math.abs(w.shiftLen))} দিন ${w.shiftLen >= 0 ? 'লম্বা' : 'ছোট'} হয়েছে।\nআমনের চারা রোপণ বর্ষা ভালোভাবে শুরুর পর করুন; ${w.shiftLen < 0 ? 'মৌসুম ছোট হওয়ায় স্বল্পমেয়াদি জাত (যেমন ব্রি ধান৭১) ভালো।' : ''}`
        : `In ${w.early.from}–${w.early.to} the monsoon began around ${doyLabel(lang, w.early.start)}; in ${w.late.from}–${w.late.to} around ${doyLabel(lang, w.late.start)} — ${Math.abs(w.shiftStart)} days ${w.shiftStart >= 0 ? 'later' : 'earlier'}. The season is ${Math.abs(w.shiftLen)} days ${w.shiftLen >= 0 ? 'longer' : 'shorter'}.\nTransplant Aman once the rains are established${w.shiftLen < 0 ? '; with a shorter season, short-duration varieties (e.g. BRRI dhan71) fit better.' : '.'}`,
      src: 'NASA POWER PRECTOTCORR (daily, 2001–)',
    };
  }

  if (has(q, ['গরম', 'তাপ', 'heat', 'hot', 'temperature'])) {
    return {
      text: bn
        ? `এখন বছরে গড়ে ${n(a.change.heat35Now)} দিন তাপমাত্রা ৩৫°সে-এর বেশি থাকে — ২০০০-এর দশকের তুলনায় ${signed(lang, a.change.heat35)} দিন। গড় তাপ বেড়েছে ${signed(lang, a.change.tmean, 1)}°সে। গত সপ্তাহের গড় সর্বোচ্চ ${n(c.tmax7, 1)}°সে।\nএপ্রিলের গরমে বোরো ও গমের দানা ক্ষতিগ্রস্ত হয় — আগাম বপন ও তাপসহিষ্ণু জাত বেছে নিন।`
        : `There are now ${a.change.heat35Now} days a year above 35 °C — ${signed(lang, a.change.heat35)} vs the 2000s. Mean temperature is up ${signed(lang, a.change.tmean, 1)} °C. Last week's average max: ${n(c.tmax7, 1)} °C.\nApril heat hurts Boro and wheat grain — sow early and pick heat-tolerant varieties.`,
      src: 'NASA POWER T2M_MAX (daily, 2001–)',
    };
  }

  if (has(q, ['২০৪০', 'ভবিষ্যৎ', 'ভবিষ্যত', 'future', '2040'])) {
    const fb = futurePlan.rotations[0];
    return {
      text: bn
        ? `২০০১ থেকে নাসার তথ্যের প্রবণতা ধরে ২০৪০ সালে তাপ আরও ~${n(a.future.dT, 1)}°সে বাড়তে পারে। তখনও সবচেয়ে টেকসই চক্র: ${fb ? rotName(fb) : '—'}।${futurePlan.current ? ` আপনার বর্তমান চক্রের ঝুঁকি হবে ${riskWord(lang, futurePlan.current.risk)}।` : ''}`
        : `Extending the NASA trend since 2001, 2040 could be ~${n(a.future.dT, 1)} °C warmer. The most resilient rotation then: ${fb ? rotName(fb) : '—'}.${futurePlan.current ? ` Your current rotation's risk would be ${riskWord(lang, futurePlan.current.risk).toLowerCase()}.` : ''}`,
      src: 'Linear trend of NASA POWER T2M / PRECTOTCORR',
    };
  }

  if (has(q, ['মাটি', 'soil', 'সার', 'fertil', 'জৈব'])) {
    const s = ctx.soil;
    return {
      text: bn
        ? `${s ? `আপনার এলাকার মাটি: কাদা ${n(s.clay)}%, বালি ${n(s.sand)}%, জৈব কার্বন ${n(s.soc, 1)} গ্রাম/কেজি, পিএইচ ${n(s.ph, 1)}।\n` : ''}মাটি ভালো করতে বছরে অন্তত একটি ডাল ফসল (মসুর, মুগ, খেসারি) বা ধৈঞ্চা সবুজ সার রাখুন, খড় পুড়িয়ে না ফেলে মাটিতে মেশান। প্রস্তাবিত চক্রে মাটির স্কোর ${n(best?.soil)} (এখন ${n(plan.current?.soil)})।`
        : `${s ? `Your area's soil: clay ${s.clay}%, sand ${s.sand}%, organic carbon ${s.soc} g/kg, pH ${s.ph}.\n` : ''}Keep at least one legume (lentil, mungbean, grass pea) or dhaincha green manure each year, and mix straw back in instead of burning. Recommended rotation soil score ${best?.soil} (now ${plan.current?.soil}).`,
      src: 'ISRIC SoilGrids 2.0 (modelled)',
    };
  }

  if (has(q, ['লবণ', 'salt', 'saline'])) return { text: tipFor(lang, 'salt'), src: 'BRRI / BINA' };
  if (has(q, ['বন্যা', 'flood', 'হাওর', 'haor'])) return { text: [tipFor(lang, 'flashflood'), tipFor(lang, 'submerge')].join('\n'), src: 'BRRI' };
  if (has(q, ['সতর্ক', 'alert', 'warning'])) {
    return { text: a.alerts.length ? a.alerts.map((al) => alertText(lang, al).join(': ')).join('\n') : (bn ? 'এখন কোনো সতর্কতা নেই।' : 'No alerts right now.'), src: 'NASA POWER (last 30 days)' };
  }

  if (has(q, ['কী চাষ', 'কি চাষ', 'কোন ফসল', 'সেরা', 'best', 'recommend', 'what should', 'পরামর্শ', 'লাভ', 'profit'])) {
    return {
      text: bn
        ? `${farm.name}-এর জন্য সেরা ফসল-চক্র: ${rotName(best)}।\nমাটি ${n(best.soil)}/১০০ · সেচ ${n(best.irrigation)} মিমি · ঝুঁকি ${riskWord(lang, best.risk)}।${plan.current ? `\nআপনার বর্তমান চক্রের তুলনায় মাটি ${signed(lang, best.soil - plan.current.soil)} পয়েন্ট।` : ''}`
        : `Best rotation for ${farm.name}: ${rotName(best)}.\nSoil ${best.soil}/100 · irrigation ${best.irrigation} mm · risk ${riskWord(lang, best.risk).toLowerCase()}.${plan.current ? `\nSoil ${signed(lang, best.soil - plan.current.soil)} points vs your current rotation.` : ''}`,
      src: 'Field Shift engine · NASA POWER · SoilGrids',
    };
  }

  return {
    text: bn
      ? 'আমি এসব প্রশ্নের উত্তর দিতে পারি:\n• "এবার কি বোরো ধান করব?"\n• "কখন আমন লাগাব?"\n• "সেচ দিতে হবে?"\n• "গরম কতটা বাড়ছে?"\n• "মাটি ভালো করব কীভাবে?"\n• "২০৪০ সালে কী হবে?"'
      : 'I can answer things like:\n• "Should I grow Boro rice?"\n• "When should I plant Aman?"\n• "Do I need to irrigate?"\n• "How much hotter is it getting?"\n• "How do I improve my soil?"\n• "What about 2040?"',
    src: '',
  };
}

export const QUICK = {
  bn: ['এবার কি বোরো ধান করব?', 'সেচ দিতে হবে?', 'কখন আমন লাগাব?', 'কী চাষ করলে ভালো?', 'মাটি ভালো করব কীভাবে?', '২০৪০ সালে কী হবে?'],
  en: ['Should I grow Boro rice?', 'Do I need to irrigate?', 'When to plant Aman?', 'What should I grow?', 'How to improve soil?', 'What about 2040?'],
};

export { CROPS };
